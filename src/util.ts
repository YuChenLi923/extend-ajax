import isObject from 'lodash/isObject';
import isArray from 'lodash/isArray';
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

export function getHeader(xhr:XMLHttpRequest):HttpHeader {
  const headerStr = xhr.getAllResponseHeaders();
  const itemsStr = headerStr.split('\n');
  const header:HttpHeader = {};
  itemsStr.pop();
  itemsStr.forEach((itemStr) => {
    const item = itemStr.replace(' ', '').split(':');
    header[item[0].toLowerCase()] = item[1];
  });
  return header;
}

const getKeys = function (array: any[], obj: Record<string, unknown>, preKey = '') {
  for (const key in obj) {
    const val = obj[key];
    if (val == null) {
      continue;
    }
    if (isObject(val) || isArray(val)) {
      getKeys(array, val as Record<string, unknown>, key);
    } else {
      array.push({
        key: preKey + key,
        val
      });
    }
  }
};

interface HashItem {
  key: string;
  val: string | number;
}
export function getHashKey(obj:Record<string, unknown>):string {
  const array: HashItem[] = [];
  let hash = '';
  getKeys(array, obj);
  array.sort((item1, item2) => {
    if (item1.key > item2.key) {
      return 1;
    } else if (item1.key === item2.key) {
      return 0;
    } else {
      return -1;
    }
  });
  array.forEach(({key, val}) => {
    hash += `${key}=${val}`;
  });
  return hash;
}

export function setHeader(xhr: XMLHttpRequest, header: HttpHeader, charset: string): void {
  for (const key in header) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    let val = header[key];
    if (val !== 'formData' && key === 'Content-Type') {
      val += ';charset=' + charset
    }
    if (key !== 'Content-Type' || val !== 'formData') {
      xhr.setRequestHeader(key, val)
    }
  }
}
