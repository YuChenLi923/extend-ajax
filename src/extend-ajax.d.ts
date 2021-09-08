type HTTP_METHOD = 'get' | 'post' | 'delete' | 'put' | 'patch' | 'jsonp';
type CALLBACK = (data?: any) => void
type EVENT_TYPE = 'success' | 'fail' | 'start' | 'end' | 'timeout' | 'abort' | 'progress' | 'beforeSend';
type AjaxEvents = Record<EVENT_TYPE, CALLBACK[]>;
interface HttpHeader {
  'Content-Type'?: 'text' | 'json' | 'form' | 'formData' | 'html' | string;
  Accept?: 'text' | 'json' | 'form' | string;
  [headerName: string]: string | any;
}

interface AjaxOptions {
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
  query?: Record<string, string | number>;
  autoAbort?: boolean;
}

interface AjaxResData {
  status?: number;
  data?: string | Record<string, any> | null;
  header?: HttpHeader;
  error?: Error;
}

interface AjaxCache {
  res: AjaxResData;
  exp: number;
  time: number;
}

type AjaxConfig = [method: HTTP_METHOD, options: AjaxOptions] | [options: AjaxOptions]
