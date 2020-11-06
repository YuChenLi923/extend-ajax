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
