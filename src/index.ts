import isFunction from 'lodash/isFunction';
import isNumber from 'lodash/isNumber';
import {
  setKeyToLargeCamel,
  toStandardHeader,
  getHeader,
  getHashKey,
  setHeader
} from './util';
import { DEFAULT_OPTIONS } from './const';
import formatData from './formatData';

class ExtendAjax {
  static options: AjaxOptions = DEFAULT_OPTIONS;
  static cache: Record<string, AjaxCache> = {};
  static cacheCurSize = 0;
  public url: string;
  public method: HTTP_METHOD;
  public options: AjaxOptions = {};
  private events: AjaxEvents = {} as AjaxEvents;
  private xhr: XMLHttpRequest | null;
  private pool: XMLHttpRequest[] = [];
  private promise?: Promise<any>;
  private resolve?: (data: any) => void
  private reject?: (data: any) => void
  private timer?: number | null;
  private data?: string | Record<string, unknown> | null;
  constructor(url: string, ...configs:AjaxConfig) {
    let options: AjaxOptions = {};
    if (!configs[1]) {
      options = configs[0] as AjaxOptions;
      this.method = 'post';
    } else {
      options = configs[1];
      this.method = configs[0] as HTTP_METHOD;
    }
    if (this.options.header) {
      setKeyToLargeCamel(this.options.header);
      toStandardHeader(this.options.header);
    }
    this.url = url;
    this.xhr = this.method === 'jsonp' ? null : this.getXHR();
    this.options = Object.assign({}, ExtendAjax.options, options);
  }
  private verifyCache(cache: AjaxCache, key:string) {
    if (cache && ExtendAjax.options.cacheSize &&
      ((cache.exp + cache.time < +new Date()) ||
       (ExtendAjax.cacheCurSize > ExtendAjax.options.cacheSize)
    )) {
      delete ExtendAjax.cache[key];
      --ExtendAjax.cacheCurSize;
      return false;
    } else if (!cache) {
     return false;
    }
    return true;
  }
  private addXHREventListener (xhr:XMLHttpRequest) {
    const { convert } = this.options;
    const res:AjaxResData = {};
    xhr.onreadystatechange = () => {
      const { readyState, status } = xhr;
      res.status = status;
      if (readyState === 1) {
        this.emit('start');
        if (isNumber(this.options.timeout)) {
          this.timer = window.setTimeout(() => {
            res.error = new Error('request timeout');
            this.emit('timeout');
          }, this.options.timeout);
        }
        return;
      }
      if (readyState === 4) {
        res.header = getHeader(xhr);
        res.data = isFunction(convert) ? convert(xhr.responseText) : xhr.responseText;
      }
      if ((status >= 200 && status < 300) || status === 304) {
        const hashKey = getHashKey({
          body: this.data,
          query: this.options.query,
          header: this.options.header,
          url: this.url
        });
        if (!ExtendAjax.cache[hashKey] && this.options.cacheExp) {
          ExtendAjax.cache[hashKey] = {
            res,
            exp: this.options.cacheExp * 1000,
            time: +new Date()
          };
          ++ExtendAjax.cacheCurSize;
        }
        this.emit('success', res);
      } else {
        res.error = new Error(`request fail:${status}`);
        this.emit('fail', res);
      }
    };
  }
  private sendJSONP(url: string): void {
    const script = document.createElement('script');
    const win = window as Record<string, any>;
    const {
      timeout,
      jsonpName = 'jsonpCallback'
    } = this.options;
    script.src = url;
    script.type = 'text/javascript';
    if (timeout) {
      this.timer = window.setTimeout(() => {
        this.timer = script.onload = script.onerror = null;
        document.body.removeChild(script);
        this.emit('timeout');
      }, timeout);
    }
    this.emit('start');
    win[jsonpName] = (...data: any[]) => {
      script.setAttribute('data-load', 'true');
      this.emit('success', data);
    }
    script.onload = () => {
      if (!script.getAttribute('data-load')) {
        this.emit('fail');
        script.onerror = null;
        document.body.removeChild(script);
      }
      script.onload = null;
      clearTimeout(this.timer as number);
      win[jsonpName] = null;
    };
    script.onerror = () => {
      this.emit('fail');
      clearTimeout(this.timer as number);
      win[jsonpName] = null;
      document.body.removeChild(script);
    };
    document.body.append(script);
  }
  private getXHR(): XMLHttpRequest {
    return this.pool.shift() || new XMLHttpRequest();
  }
  private emit(eventName: EVENT_TYPE, ...data: any) {
    if (this.promise) {
      switch (eventName) {
        case 'success':
          this.resolve?.apply(this.options.scope, data || []);
          break;
        case 'fail':
          this.reject?.apply(this.options.scope, data || []);
          break;
      }
    }
    const events = this.events[eventName];
    if (!events) {
      return;
    }
    events.forEach((cb) => {
      cb.call(this.options.scope || null, data);
    });
  }
  public on(eventName: EVENT_TYPE, cb: CALLBACK):void {
    const eventList: CALLBACK[] = this.events[eventName];
    if (!eventList) {
      this.events[eventName] = [cb];
    } else {
      eventList.push(cb);
    }
    return;
  }
  async send(data: string | Record<string, unknown> | null): Promise<any> {
    this.data = data;
    this.promise = new Promise((resolve, reject) => {
      this.resolve = resolve;
      this.reject = reject;
      if (!this.xhr) {
        return;
      }
      this.addXHREventListener(this.xhr);
    });
    const {
      query,
      header,
      withCredentials,
      isAsync = true,
      charset = 'utf-8',
      jsonpName = 'jsonpCallback',
      jsonpParam = 'callback'
    } = this.options;
    let url = this.options.host??'' + this.url;
    if (this.xhr) {
      const cacheKey = getHashKey({
        body: data,
        query,
        header,
        url: this.url
      });
      const cacheData = ExtendAjax.cache[cacheKey];
      if (!this.verifyCache(cacheData, cacheKey)) {
        if (query) {
          url += `?${formatData(query) as string}`;
        }
        const sendData = this.method === 'get' ? formatData(data) : formatData(data, header && header['Content-Type']);
        this.xhr.open(this.method, url, isAsync);
        this.xhr.withCredentials = !!withCredentials;
        setHeader(this.xhr, header || {}, charset);
        this.xhr.send(sendData);
      } else {
        this.emit('success', cacheData.res);
      }
    } else {
      url += `?${jsonpParam}=${jsonpName}`;
      this.sendJSONP(url);
    }
    return this.promise;
  }
}

export default function ajax(url: string, method: HTTP_METHOD, options: AjaxOptions):ExtendAjax {
  return new ExtendAjax(url, method, options);
};
