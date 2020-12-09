import isObject from 'lodash/isObject';
import { CONTENT_TYPE_MAP } from './const';

const formatMethods: Record<string, (data: any) => string | FormData> = {
  'application/json': function (data: any): string {
    if (isObject(data)) {
      return JSON.stringify(data);
    } else {
      return '';
    }
  },
  'text/plain': function (data: any): string {
    return typeof data === 'string' ? data : '';
  },
  'application/x-www-form-urlencoded': function (data: any): string {
    if (!isObject(data)) {
      return '';
    }
    let temp = '';
    for (const key in data) {
      const val = data[key as keyof typeof data];
      if (val === undefined) {
        continue;
      }
      temp += `&${key}=${encodeURI(val)}`;
    }
    return temp.substring(1);
  },
  'formData': function (data: any): FormData {
    const temp = new FormData();
    if (!isObject(data)) {
      return temp;
    }
    for (const key in data) {
      const val: any = data[key as keyof typeof data];
      if (val instanceof FileList) {
        for(let i = 0; i < val.length; i++) {
          temp.append(key, val[i]);
        }
      } else {
        if (val !== undefined) {
          temp.append(key, val);
        }
      }
    }
    return temp;
  }
};

function formatData(
  data: unknown,
  contentType = 'application/x-www-form-urlencoded',
  method?: HTTP_METHOD
): string | FormData {
  if (method === 'get') {
    contentType = 'text/plain';
  }
  if (CONTENT_TYPE_MAP[contentType]) {
    contentType = CONTENT_TYPE_MAP[contentType];
  }
  if (formatMethods[contentType]) {
    return formatMethods[contentType](data);
  }
  return '';
}
export default formatData;
