(function (win) {
  var support = {
    XHR2: !!win.FormData,
    Promise: !!win.Promise,
    DefineProperty: Object.prototype.hasOwnProperty('defineProperty')
  };
  var _contentTypes = {
    html: 'text/html',
    json: 'application/json',
    file: 'multipart/form-data',
    text: 'text/plain',
    form: 'application/x-www-form-urlencoded',
    formData: '',
    _default: 'application/x-www-form-urlencoded'
  };
  var _accepts = {
    xml: 'application/xml, text/xml',
    html: 'text/html',
    script: 'text/javascript, application/javascript',
    json: 'application/json, text/javascript',
    text: 'text/plain',
    _default: '*/*'
  };
  var _options = {
    timeout: false,
    async: true,
    header: {
      'Accept': _accepts['_default'],
      'Content-Type': _contentTypes['_default']
    },
    charset: 'utf-8',
    host: '',
    cacheSize: 2,
    cacheExp: 1000
  };
  var _LargeCamelReg = /(^\w)|-(\w)/,
      _DataType = / (\w+)]/;
  function extend(target, source, filter) {
    var key,
        flag;
    !target && (target = {});
    for (key in source) {
      flag = true;
      filter && (forEach(filter, function (filterKey) {
        filterKey === key && (flag = false);
      }));
      if (flag) {
        target[key] = source[key];
      }
    }
    return target;
  }
  function toLargeCamel(str) {
    return str.replace(_LargeCamelReg, function (char) {
      return char.toUpperCase();
    });
  }
  function toArray(likeArray) {
    return [].slice.call(likeArray);
  }
  function protect(obj, propertys) {
    if (support.DefineProperty) {
      forEach(propertys, function (property) {
        Object.defineProperty(obj, property, {
          writable: false,
          enumerable: false
        });
      });
    }
  }
  function deepEqual(result, expect) {
    var flag = true;
    if (isType(result, 'object') && isType(expect, 'object') &&
        getObjectLength(result) === getObjectLength(expect)) {
      forEach(expect, function (value, key) {
        if (result.hasOwnProperty(key) && expect.hasOwnProperty(key)) {
          flag = deepEqual(result[key], expect[key]);
        } else {
          flag = false;
        }
      });
    } else {
      flag = (result === expect);
    }
    return flag;
  }
  function getHeader(xhr) {
    var headerStr = xhr.getAllResponseHeaders(),
        itemsStr = headerStr.split('\n'),
        header = {};
    itemsStr.pop();
    forEach(itemsStr, function (itemStr) {
      var item = itemStr.replace(' ', '').split(':');
      header[item[0].toLowerCase()] = item[1];
    });
    return header;
  }
  function setKeyToLargeCamel(obj) {
    for (var key in obj) {
      var temp = obj[key];
      delete obj[key];
      obj[toLargeCamel(key)] = temp;
    }
  }
  function setHeader(xhr, header, charset) {
    for (var key in header) {
      var value = header[key],
          isContentType = key === 'Content-Type',
          isAccept = key === 'Accept';
      isContentType && (value = _contentTypes[value] ? _contentTypes[value] : value);
      xhr.setRequestHeader(toLargeCamel(key), value);
    }
  }
  function forEach(items, cb) {
    var i,
        len;
    if (isType(items, 'array') || items.length) {
      for (i = 0, len = items.length; i < len; i++) {
        cb(items[i], i);
      }
    } else if (isType(items, 'object')) {
      for (i in items) {
        cb(items[i], i);
      }
    }
  }
  function getObjectLength(obj) {
    var len = 0;
    forEach(obj, function () {
      ++len;
    });
    return len;
  }
  function isType(data, type) {
    var expectType = _DataType.exec(Object.prototype.toString.call(data))[1].toLowerCase();
    return type.toLowerCase() === expectType;
  }
  function haveCache(caches, data, size) {
    var result = false,
        cacheIndex;
    if (!caches || caches.length === 0) {
      result = false;
    } else {
      forEach(caches, function (cache, index) {
        !result && (result = deepEqual(data, cache.data));
        result && (result = cache) && (cacheIndex = index);
      });
    }
    if (result.time && result.exp + result.time < +new Date()) {
      caches.splice(cacheIndex, 1);
      --ajax.cacheCurSize;
      result = false;
    }
    if (caches && ajax.cacheCurSize > size) {
      caches.shift();
      --ajax.cacheCurSize;
      (cacheIndex === 0) && (result = false);
    }
    return (result && result.res) || result;
  }
  function getXhr() {
    if (typeof XMLHttpRequest === 'undefined') {
      try {
        return new ActiveXObject('Msxml2.XMLHTTP.6.0');
      } catch (e) {}
      try {
        return new ActiveXObject('Msxml2.XMLHTTP.3.0');
      } catch (e) {}
      try {
        return new ActiveXObject('Msxml2.XMLHTTP');
      } catch (e) {}
      return false;
    } else {
      return new XMLHttpRequest();
    }
  }
  function addXHR2Listener(xhr) {
    var callback = ['error', 'abort', 'progress'],
        _this = this;
    forEach(callback, function (event) {
      xhr['on' + event] = function (e) {
        _this.emit(event, e, xhr.status, getHeader(xhr));
      };
    });
  }
  function addXHRListener(xhr, options) {
    var timeout = options.timeout,
        cacheExp = options.cacheExp,
        cacheSize = options.cacheSize,
        timer = null,
        _this = this;
    xhr.onreadystatechange = function (e) {
      var readyState = xhr.readyState,
          status,
          responseText,
          convert = options.convert,
          res = {};
      if (readyState === 4) {
        responseText = xhr.responseText
        status = xhr.status;
        res.status = status;
        res.header = getHeader(xhr);
        timer && clearTimeout(timer);
        if ((status >= 200 && status < 300) || status === 304) {
          res.data = isType(convert, 'function') ? convert(responseText) : responseText;
          var cache = ajax.cache[_this.url];
          if (!cache) {
            cache = ajax.cache[_this.url] = [];
          }
          if (!haveCache(cache, _this.data, cacheSize)) {
            cache.push({
              res: res,
              data: _this.data,
              exp: cacheExp,
              time: +new Date()
            });
            ++ajax.cacheCurSize;
          }
          _this.emit('success', res);
        } else {
          res.error = new Error('request fail:' + status);
          _this.emit('fail', res);
        }
      } else if (readyState === 1 && isType(timeout, 'number')) {
        timer = setTimeout(function () {
          res.error = new Error('request timeout');
          _this.emit('timeout', res);
        }, timeout);
      }
    };
  }
  function encodeData(data, contentType) {
    var temp;
    switch (contentType) {
    case 'json':
    case 'application/json':
      isType(data, 'object') && (data = JSON.stringify(data));
      break;
    case 'text':
    case 'text/plain':
      !isType(data, 'string') && (data = '');
      break;
    case 'application/x-www-form-urlencoded':
    case 'form':
      temp = '';
      if (isType(data, 'object')) {
        forEach(data, function (value, key) {
          temp += ('&' + key + '=' + encodeURI(value));
        });
      }
      data = temp.substring(1);
      break;
    case 'formData':
      if (isType(data, 'object') && support.XHR2) {
        temp = new FormData();
        forEach(data, function (value, key) {
          if (isType(value, 'FileList')) {
            forEach(value, function (file) {
              // checkFile() 文件检测
              temp.append(key, file);
            });
          } else {
            temp.append(key, value);
          }
        });
        data = temp;
      }
      break;
    default:
      data = '';
      break;
    }
    return data;
  }
  // ajax对象
  var ajax = function () {
    return new _ajax.init(toArray(arguments));
  };
  var _ajax = ajax.prototype;
  // 初始化ajax对象， 内部使用
  extend(_ajax, {
    init: function Ajax(args) {
      var url = args.shift(),
          type = args[0],
          options = args[1],
          xhr = this.xhr = getXhr(),
          _this = this;
      setKeyToLargeCamel(options.header);
      this.type = type || 'post';
      this.url = url || '';
      options = this.options = extend(ajax.options || _options, options, ['host']);
      support.XHR2 && addXHR2Listener.call(this, xhr, options);
      if (support.Promise) {
        this.promise = new Promise(function (resolve) {
          addXHRListener.call(_this, xhr, options);
          _this.resolve = resolve;
        });
        protect(this, ['promise', 'resolve']);
      } else {
        addXHRListener.call(_this, xhr, options);
      }
    },
    on: function (event, cb) {
      if (isType(cb, 'function')) {
        this['$' + event] = cb;
        protect(this, ['$' + event]);
      }
      return this;
    },
    then: function (cb) {
      isType(cb, 'function') && this.on('success', cb);
    },
    send: function (data) {
      var xhr = this.xhr,
          type = this.type,
          url = this.url,
          options = this.options,
          async = options.async,
          cacheSize = options.cacheSize,
          rootHost = ajax.options.host,
          isGet = type === 'get';
      if (isType(rootHost, 'object') && isType(this.host, 'string')) {
        url = rootHost[this.host] + url;
      } else if (isType(rootHost, 'string')) {
        url = rootHost + url;
      }
      this.url = url;
      this.data = data;
      var cacheData = haveCache(ajax.cache[url], data, cacheSize);
      if (!cacheData) {
        data = encodeData(data, options.header['Content-Type']);
        xhr.open(type, isGet ? (url + data) : url, async);
        setHeader(xhr, options.header, options.charset);
        xhr.send(isGet ? null : data || '');
      } else {
        this.emit('success', cacheData);
      }
      return this.promise || this;
    },
    emit: function () {
      var args = toArray(arguments),
          event = args.shift();
      if (this.promise && this.resolve && (event === 'success' || event === 'fail')) {
        this.resolve(args[0]);
      }
      this['$' + event] && this['$' + event].apply(null, args);
    }
  });
  extend(ajax, {
    config: function (options) {
      extend(this.options, options);
    },
    options: _options,
    cacheCurSize: 0,
    cache: {}
  });
  _ajax.init.prototype = _ajax;
  protect(_ajax, ['emit']);
  if (typeof module === 'object' && module.exports) {
    module.exports = ajax;
  } else if (win.window === win) {
    win.ajax = ajax;
  }
})(window);
