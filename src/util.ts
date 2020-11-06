import { ACCEPT_MAP, CONTENT_TYPE_MAP } from './const';

export function toLargeCamel(str:string):string {
  if (!/^\w+(-\w+)+/.test(str)) {
    return str;
  }
  const fragment:string[] = str.split('-');
  fragment.forEach((item, index) => {
    fragment[index] = item.replace(/^\w/, function (char) {
      return char.toUpperCase();
    });
  });
  return fragment.join('-');
}

export function setKeyToLargeCamel(obj: HttpHeader):void {
  for (const key in obj) {
    const temp = obj[key] as string;
    delete obj[key];
    obj[toLargeCamel(key)] = temp;
  }
}

export function toStandardHeader(header: HttpHeader):void {
  for (const key in header) {
    const val:string = header[key] as string;
    if (key === 'Content-Type') {
      header[key] = CONTENT_TYPE_MAP[val] || val;
    }
    if (key === 'Accept') {
      header[key] = ACCEPT_MAP[val] || val;
    }
  }
}
