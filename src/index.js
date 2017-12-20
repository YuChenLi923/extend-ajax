(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) : global.ejax = factory();
})(this, function () {
  var win = window;
  var doc = document;
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
    cacheExp: 300
  };
  var _encodeMethods = {
    'application/json': function(data) {
      isType(data, 'object') && (data = JSON.stringify(data));
      return data;
    },
    'text/plain': function (data) {
      !isType(data, 'string') && (data = '');
      return data;
    },
    'application/x-www-form-urlencoded': function (data) {
      var temp = '';
      if (isType(data, 'object')) {
        forEach(data, function (value, key) {
          temp += ('&' + key + '=' + encodeURI(value));
        });
      }
      data = temp.substring(1);
      return data;
    },
    'formData': function (data) {
      if (isType(data, 'object') && support.XHR2) {
        var temp = new FormData();
        forEach(data, function (value, key) {
          if (isType(value, 'FileList')) {
            forEach(value, function (file) {
              temp.append(key, file);
            });
          } else {
            temp.append(key, value);
          }
        });
        data = temp;
      }
      return data;
    }
  };
  var _LargeCamelReg = /(^\w)|-(\w)/;
  var _DataType = / (\w+)]/;
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
  function getHashKey(obj) {
    var array = [],
        hash = '';
    (function getKeys(array, obj, preKey) {
      var key;
      for (key in obj) {
        if (isType(obj[key], 'object') || isType(obj[key], 'array')) {
          getKeys(array, obj[key], key + '.');
        } else {
          array.push({key: preKey + key, value: obj[key]});
        }
      }
    })(array, obj, '');
    array.sort(function (item1, item2) {
      return item1.key > item2.key;
    });
    forEach(array, function (item) {
      hash += item.key + '=' + item.value + ';';
    });
    return hash;
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
  function toStandardHeader(header) {
    forEach(header, function (value, key) {
      var isContentType = key === 'Content-Type',
          isAccept = key === 'Accept';
      isContentType && (value = _contentTypes[value] || value);
      isAccept && (value = _accepts[value] || value);
      header[key] = value;
    });
  }
  function setHeader(xhr, header, charset) {
    forEach(header, function (value, key){
      key === 'Content-Type' && (value += ';charset=' + charset);
      (value === 'formData' && key === 'Content-Type') || (xhr.setRequestHeader(key, value));
    });
  }
  function forEach(items, cb) {
    var i,
        len;
    if (isType(items, 'array') || items.length) {
      for (i = 0, len = items.length; i < len; i++) {
        cb(items[i], i) && (i = len);
      }
    } else if (isType(items, 'object')) {
      for (i in items) {
        if (cb(items[i], i)) { break; }
      }
    }
  }
  function isType(data, type) {
    var expectType = _DataType.exec(Object.prototype.toString.call(data))[1].toLowerCase();
    return type.toLowerCase() === expectType;
  }
  function verifyCache(cache, size, key) {
    var result = true;
    if (cache && ((cache.exp + cache.time < +new Date()) || (ajax.cacheCurSize > size))) {
      delete ajax.cache[key];
      --ajax.cacheCurSize;
      result = false;
    } else if (!cache) {
      result = false;
    }
    return result;
  }
  function getXhr() {
    var activeXs = ['Msxml2.XMLHTTP.6.0', 'Msxml2.XMLHTTP.3.0', 'Msxml2.XMLHTTP'],
        xhr;
    try {
      xhr = new XMLHttpRequest();
    } catch (e) {
      forEach(activeXs, function (activeX) {
        try {
          xhr = new ActiveXObject(activeX);
          return xhr;
        } catch (e) {}
      });
    }
    return xhr;
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
        timer = null,
        _this = this;
    xhr.onreadystatechange = function (e) {
      var readyState = xhr.readyState,
          status,
          responseText,
          convert = options.convert,
          res = {};
      if (readyState === 4) {
        responseText = xhr.responseText;
        status = xhr.status;
        res.status = status;
        res.header = getHeader(xhr);
        res.data = isType(convert, 'function') ? convert(responseText) : responseText;
        timer && clearTimeout(timer);
        if ((status >= 200 && status < 300) || status === 304) {
          if (options.cacheSize) {
            var cacheKey = _this.url + JSON.stringify(getHashKey(_this.data));
            if (!ajax.cache[cacheKey]) {
              ajax.cache[cacheKey] = {
                res: res,
                exp: (+cacheExp) * 1000,
                time: +new Date()
              };
              ++ajax.cacheCurSize;
            }
          }
          _this.emit('success', res);
        } else {
          res.error = new Error('request fail:' + status);
          _this.emit('fail', res);
        }
      } else if (readyState === 1 && isType(timeout, 'number')) {
        timer = setTimeout(function () {
          res.error = new Error('request timeout');
          _this.emit('timeout');
        }, timeout);
      }
    };
  }
  function addFormListener(form, options) {
    var id = +new Date(),
        iframe = doc.createElement('frame'),
        res = {},
        convert = options.convert,
        timeout = options.timeout,
        timer = null,
        _this = this,
        initLoad = true,
         submit = form.submit;
    iframe.name = form.target = id;
    iframe.style.cssText = 'display:none';
    doc.body.appendChild(iframe);
    res.status = null;
    res.header = null;
    var load = function () {
      clearTimeout(timer);
      if (!initLoad) {
        var responseText = iframe.contentWindow.document.body.innerText;
        res.data = isType(convert, 'function') ? convert(responseText) : responseText;
        _this.emit('success', res);
      }
    };
    var createTimer = function (e) {
      initLoad = false;
      if (timeout) {
        clearTimeout(timer);
        timer = setTimeout(function () {
          try {
            iframe.removeEventListener('load', load);
          } catch (e) {
            iframe.detachEvent('load', load);
          }
          _this.emit('timeout');
        }, timeout);
      }
      return false;
    };
    form.submit = function () {
      submit.call(form);
      createTimer();
    };
    try {
      iframe.addEventListener('load', load);
      form.addEventListener('submit', createTimer);
    } catch (e) {
      iframe.attachEvent('load', load);
      form.attachEvent('submit', createTimer);
    }
  }
  function encodeData(data, contentType) {
    return _encodeMethods[contentType] ? _encodeMethods[contentType](data) : '';
  }
  // ajax对象
  var ajax = function () {
    return new _ajax.init(toArray(arguments));
  };
  var _ajax = ajax.prototype;
  // 初始化ajax对象， 内部使用
  extend(_ajax, {
    init: function Ajax(args) {
      var url = args.shift() || '',
          type = typeof args[0] === 'string' ? (args[0] || 'post') : 'post',
          options = args[1] ? (args[1] || {}) : args[0],
          xhr = this.xhr = getXhr(),
          _this = this,
          formElement = typeof url === 'object' ? url : null;
      formElement && (url = null);
      options.header && (setKeyToLargeCamel(options.header) || toStandardHeader(options.header));
      this.type = type;
      this.url = url;
      this.formElement = formElement;
      options = this.options = extend(ajax.options || _options, options, ['host']);
      !formElement && support.XHR2 && addXHR2Listener.call(this, xhr, options);
      var addListener = function () {
        if (formElement) {
          addFormListener.call(_this, formElement, options);
        } else {
          addXHRListener.call(_this, xhr, options);
        }
      };
      if (support.Promise) {
        this.promise = new Promise(function (resolve) {
          addListener();
          _this.resolve = resolve;
        });
        protect(this, ['promise', 'resolve']);
      } else {
        addListener();
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
      if (this.formElement) {
        return;
      }
      var xhr = this.xhr,
          type = this.type,
          url = this.url,
          options = this.options,
          async = options.async,
          cacheSize = options.cacheSize,
          query = options.query,
          rootHost = ajax.options.host,
          isGet = type === 'get';
      if (isType(rootHost, 'object') && isType(this.host, 'string')) {
        url = rootHost[this.host] + url;
      } else if (isType(rootHost, 'string')) {
        url = rootHost + url;
      }
      this.url = url;
      this.data = data;
      if (cacheSize) {
        var cacheKey = url + JSON.stringify(getHashKey(data)),
            cacheData = ajax.cache[cacheKey];
      }
      if (!cacheSize || !verifyCache(cacheData, cacheSize, cacheKey)) {
        query && (query = encodeData(query, _contentTypes['form'])) && (url += '?' + query);
        data = isGet ? encodeData(data, _contentTypes['form']) : encodeData(data, options.header['Content-Type']);
        xhr.open(type, url, async);
        setHeader(xhr, options.header, options.charset);
        xhr.send(data);
      } else {
        this.emit('success', cacheData.res);
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
    cacheCurSize: 2,
    cache: {},
    form: function (id, options) {
      var formElement = doc.getElementById(id);
      if (!formElement) {
        throw new Error('Html element selected is null');
      } else if (!formElement.nodeName.toLowerCase() === 'form') {
        throw new Error('Html element selected must be form element');
      }
      return ajax(formElement, null, options);
    }
  });
  _ajax.init.prototype = _ajax;
  protect(_ajax, ['emit']);
  return ajax;
});
