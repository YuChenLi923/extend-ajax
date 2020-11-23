declare type HTTP_METHOD = 'get' | 'post' | 'delete' | 'put' | 'jsonp';
declare type CALLBACK = (data?: any) => void;
declare type EVENT_TYPE = 'success' | 'fail' | 'start' | 'end' | 'timeout' | 'abort' | 'progress';
declare type AjaxConfig = [method: HTTP_METHOD, options?: AjaxOptions] | [options: AjaxOptions] | []
declare interface HttpHeader {
  'Content-Type'?: 'text' | 'json' | 'form' | 'formData' | 'html' | string;
  Accept?: 'text' | 'json' | 'form' | string;
  [headerName: string]: string | any;
}
declare interface AjaxOptions {
  isAsync?: boolean;
  cacheSize?: number;
  cacheExp?: number;
  charset?: string;
  convert?(data?: string):string | Record<string, any> | null;
  host?: string;
  header?: HttpHeader;
  jsonpName?: string;
  jsonpParam?: string;
  scope?: any;
  timeout?: number | false;
  withCredentials?: boolean;
  query?: Record<string, string | number>
}

interface AjaxResData {
  status?: number;
  data?: string | Record<string, any> | null;
  header?: HttpHeader;
  error?: Error;
}

declare class ExtendAjax {
  static options: AjaxOptions;
  static cacheCurSize: number;
  public options: AjaxOptions;
  constructor(url: string, ...configs: AjaxConfig);
  on(eventName: EVENT_TYPE, cb: CALLBACK): void;
  send(data?: string | Record<string, unknown> | null): Promise<AjaxResData>;
}

export default function ejax(url: string, ...configs: AjaxConfig): ExtendAjax;
export function setConfig(options: AjaxOptions): void;
