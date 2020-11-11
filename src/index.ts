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
const win = window as Record<string, any>;
class ExtendAjax {
  static options: AjaxOptions = DEFAULT_OPTIONS;
  public options: AjaxOptions = {};
  private url: string;
  private method: HTTP_METHOD;
  private static cache: Record<string, AjaxCache> = {};
  private static cacheCurSize = 0;
  private events: AjaxEvents = {} as AjaxEvents;
  private xhr: XMLHttpRequest | null;
  private pool: XMLHttpRequest[] = [];
  private script?: HTMLScriptElement;
  private promise?: Promise<any>;
  private resolve?: (data: any) => void
  private reject?: (data: any) => void
  private timer?: number | null;
  private data?: string | Record<string, unknown> | null;
  constructor(url: string, ...configs:AjaxConfig) {
    let options: AjaxOptions = {};
    if (!configs[1]) {
      if (typeof configs[0] === 'string') {
        this.method = configs[0];
        options = {};
      } else {
        this.method = 'get';
        options = configs[0];
      }
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
    this.options = {
      ...ExtendAjax.options,
      ...options
    };
  }
  private verifyCache(cache: AjaxCache, key:string) {
    if (cache && ExtendAjax.options.cacheSize &&
      ((cache.exp + cache.time < +new Date()) ||
       (ExtendAjax.cacheCurSize > ExtendAjax.options.cacheSize)
    )) {
      delete ExtendAjax.cache[key];
      --ExtendAjax.cacheCurSize;
      return false;
    } else if (!cache || ExtendAjax.options.cacheSize === 0) {
     return false;
    }
    return true;
  }
  private addXHREventListener (xhr:XMLHttpRequest, that: any) {
    const {
      convert,
      timeout,
      query,
      header
    } = this.options;
    const res:AjaxResData = {};
    xhr.onreadystatechange = () => {
      const { readyState, status } = xhr;
      res.status = status;
      if (readyState === 1) {
        this.emit('start');
        if (isNumber(timeout)) {
          this.timer = window.setTimeout(() => {
            res.error = new Error('request timeout');
            this.emit('timeout');
          }, timeout);
        }
        return;
      }
      if (readyState !== 4) {
        return;
      }
      if (readyState === 4) {
        res.header = getHeader(xhr);
        res.data = isFunction(convert) ? convert(xhr.responseText) : xhr.responseText;
      }
      if ((status >= 200 && status < 300) || status === 304) {
        const hashKey = getHashKey({
          body: this.data,
          query,
          header,
          url: this.url
        });
        if (!ExtendAjax.cache[hashKey] && ExtendAjax.options.cacheExp) {
          ExtendAjax.cache[hashKey] = {
            res,
            exp: ExtendAjax.options.cacheExp * 1000,
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
    const script = this.script = document.createElement('script');
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
      this.emit('success', ...data);
      win[jsonpName] = null;
      clearTimeout(this.timer as number);
    }
    script.onload = () => {
      if (!script.getAttribute('data-load')) {
        this.emit('fail');
        script.onerror = null;
        document.body.removeChild(script);
      }
      script.onload = null;
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
  public async send(data?: string | Record<string, unknown> | null): Promise<AjaxResData> {
    this.data = data;
    this.promise = new Promise((resolve, reject) => {
      this.resolve = resolve;
      this.reject = reject;
      if (!this.xhr) {
        return;
      }
      this.addXHREventListener(this.xhr, this);
    });
    const {
      query,
      header,
      withCredentials,
      isAsync = true,
      charset = 'utf-8',
      jsonpName = 'jsonpCallback',
      jsonpParam = 'callback',
      host = ''
    } = this.options;
    let url = host + this.url;
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
    return this.promise as Promise<AjaxResData>;
  }
  public abort() {
    if (this.xhr) {
      this.xhr.abort();
      this.emit('abort');
    } else { // jsonp
      const { jsonpName } = this.options;
      if (jsonpName && win[jsonpName]) {
        win[jsonpName] = null;
      }
      if (this.script) {
        document.body.removeChild(this.script)
        delete this.script;
      }
      this.emit('abort');
    }
  }
}

const ajax = function (url: string, ...configs: AjaxConfig):ExtendAjax {
  return new ExtendAjax(url, ...configs);
}

ajax.options = ExtendAjax.options;
export default ajax;
