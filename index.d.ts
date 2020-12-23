declare type HttpMethod = 'get' | 'post' | 'delete' | 'put' | 'jsonp';
declare type CallBack = (data?: any) => void;
declare type EventType = 'success' | 'fail' | 'start' | 'end' | 'timeout' | 'abort' | 'progress';
declare type AjaxConfig = [method: HttpMethod, options?: AjaxOptions] | [options: AjaxOptions] | []
declare interface HttpHeader {
  'Content-Type'?: 'text' | 'json' | 'form' | 'formData' | 'html' | string;
  Accept?: 'text' | 'json' | 'form' | string;
  [headerName: string]: string | any;
}

declare interface AjaxOptions {
  /** Asynchronous or not */
  isAsync?: boolean;

  /** The size of ajax request cache. (default: 0) */
  cacheSize?: number;

  /** The expire time of ajax request cache. (default: 300000, unit: ms) */
  cacheExp?: number;

  /** The character type of the requested data */
  charset?: string;

  /** The convert function for the response data */
  convert?(data?: string):string | Record<string, any> | null;

  /** The request's host. */
  host?: string;

  /** The request's custom header. */
  header?: HttpHeader;

  /** The name of jsonp callback. */
  jsonpName?: string;

  /** The param of jsonp name. */
  jsonpParam?: string;

  /** The scope of callback function. */
  scope?: any;

  /** The timeout of the request. (unit: ms) */
  timeout?: number | false;

  /** Whether to use credentials or not. */
  withCredentials?: boolean;

  /** The query data of the request. */
  query?: Record<string, string | number>

  /** Whether to abort requests when the page url changed and does not refresh(For single page application, default: false)*/
  autoAbort?: boolean;
}

interface AjaxResData {
  /** The status code of response. */
  status?: number;

  /** The data of response. */
  data?: string | Record<string, any> | null;

  /** The header of response. */
  header?: HttpHeader;

  /** The error of request or response. */
  error?: Error;
}

declare class ExtendAjax {
  static options: AjaxOptions;
  static cacheCurSize: number;
  public options: AjaxOptions;
  constructor(url: string, ...configs: AjaxConfig);
  /**
  * Add a callback function for the specified event
  * @param {string} eventName - The event's name
  * @param {function} callback - The callback function
  */
  on(eventName: EventType, cb: CallBack): void;

  /**
  * Add a callback function for the specified event
  * @param {string | Record<string, unknown> | null } [data] - The body data of request
  * @return {Promise} The promise of response data
  */
  send(data?: string | Record<string, unknown> | null): Promise<AjaxResData>;

   /**
  * Abort the request
  */
  abort(): void;
}

/**
 * Create an Ajax request object.
 * @param {string} url - The url of the request.
 * @param {AjaxConfig}  ...configs - [method, options] | [options] | []
 * @return {ExtendAjax}  Ajax request object
 */
declare function eAjax(url: string, ...configs: AjaxConfig): ExtendAjax;

declare namespace eAjax {
    /**
   * Create an Ajax request object.
   * @param {AjaxOptions} AjaxOptions - The global config.
   */
  export function config(options: AjaxOptions): void;
  export {
    HttpHeader,
    EventType,
    HttpMethod,
    AjaxOptions,
    ExtendAjax
  }
}

export as namespace eAjax;
export = eAjax;
