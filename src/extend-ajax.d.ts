type HTTP_METHOD = 'get' | 'post' | 'delete' | 'put' | 'jsonp';
type CALLBACK = (data?: any) => void
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
  convert?: (data: string) => any;
  host?: string;
  header?: HttpHeader;
  jsonpName?: string;
  jsonpParma?: string;
  scope?: any;
  timeout?: number;
  withCredentials?: boolean;
}

interface AjaxEvents {
  [eventName: string]: CALLBACK[];
}

type AjaxConfig = [method: HTTP_METHOD, options: AjaxOptions] | [options: AjaxOptions]

declare class ExtendAjax {
  constructor(url: string, method: HTTP_METHOD, options: AjaxOptions)
}

