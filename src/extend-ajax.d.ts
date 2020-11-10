type HTTP_METHOD = 'get' | 'post' | 'delete' | 'put' | 'jsonp';
type CALLBACK = (data?: any) => void
type EVENT_TYPE = 'success' | 'fail' | 'start' | 'end' | 'timeout' | 'abort' | 'progress';
type AjaxEvents = Record<EVENT_TYPE, CALLBACK[]>;
interface HttpHeader {
  'Content-Type'?: 'text' | 'json' | 'form' | 'formData' | 'html' | string;
  Accept?: 'text' | 'json' | 'form' | string;
  [headerName: string]: string | any;
}

interface AjaxOptions {
  isAsync?: boolean; // 默认:true
  cacheSize?: number;
  cacheExp?: number;
  charset?: string;
  convert?(data?: string):string | JSONData | null;
  host?: string;
  header?: HttpHeader;
  jsonpName?: string;
  jsonpParam?: string;
  scope?: any;
  timeout?: number | false;
  withCredentials?: boolean;
  query?: Record<string, string | number>
}



interface JSONData {
  [propName: string]: any;
}

interface AjaxResData {
  status?: number;
  data?: string | JSONData | null;
  header?: HttpHeader;
  error?: Error;
}

interface AjaxCache {
  res: AjaxResData;
  exp: number;
  time: number;
}
type AjaxConfig = [method: HTTP_METHOD, options: AjaxOptions] | [options: AjaxOptions]

declare class ExtendAjax {
  constructor(url: string, method: HTTP_METHOD, options: AjaxOptions)
}

