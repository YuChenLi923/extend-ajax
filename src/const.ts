export const ACCEPT_MAP:{
  [propName: string]: string
} = {
  xml: 'application/xml, text/xml',
  html: 'text/html',
  script: 'text/javascript',
  json: 'application/json',
  text: 'text/plain',
  _default: '*/*'
};

export const CONTENT_TYPE_MAP: {
  [propName: string]: string
} = {
  html: 'text/html',
  json: 'application/json',
  file: 'multipart/form-data',
  text: 'text/plain',
  form: 'application/x-www-form-urlencoded',
  _default: 'application/x-www-form-urlencoded'
};

export const DEFAULT_OPTIONS: AjaxOptions = {
  timeout: false,
  isAsync: true,
  header: {
    'Accept': ACCEPT_MAP['_default'],
    'Content-Type': CONTENT_TYPE_MAP['_default']
  },
  charset: 'utf-8',
  host: '',
  cacheSize: 0,
  cacheExp: 300000,
  jsonpName: 'jsonpCallback',
  jsonpParam: 'callback',
  autoAbort: false
};

