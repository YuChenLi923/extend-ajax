import { setKeyToLargeCamel, toStandardHeader } from './util';

class ExtendAjax {
  public url: string;
  public method: HTTP_METHOD;
  public options: AjaxOptions = {};
  private events: AjaxEvents = {};
  private xhr: XMLHttpRequest | null;
  constructor(url: string, ...configs:AjaxConfig) {
    this.url = url;
    if (!configs[1]) {
      this.options = configs[0] as AjaxOptions;
      this.method = 'post';
    } else {
      this.options = configs[1];
      this.method = configs[0] as HTTP_METHOD;
    }
    if (this.options.header) {
      setKeyToLargeCamel(this.options.header);
      toStandardHeader(this.options.header);
    }
    // this.xhr = this.method === 'jsonp' ? null :
  }
  async send(): Promise<void> {
    return;
  }
  on(eventName: string, cb: CALLBACK):void {
    const eventList: CALLBACK[] = this.events[`${eventName}`];
    if (!eventList) {
      this.events[`${eventName}`] = [cb];
    } else {
      eventList[eventList.length as number] = cb;
    }
    return;
  }
}

export default function ajax(url: string, method: HTTP_METHOD, options: AjaxOptions):ExtendAjax {
  return new ExtendAjax(url, method, options);
};
