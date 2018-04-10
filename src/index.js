(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() : typeof define === 'function' && define.amd ? define(factory) : global.ejax = factory();
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
    cacheSize: 0,
    cacheExp: 300,
    jsonpName: 'jsonpCallback',
    jsonpParam: 'callback'
  };
  var _encodeMethods = {
    'application/json': function (data) {
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
          if (typeof value !== 'undefined') {
            temp += ('&' + key + '=' + encodeURI(value));
          }
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
            if (typeof value !== 'undefined') {
              temp.append(key, value);
            }
          }
        });
        data = temp;
      }
      return data;
    }
  };
  var _LargeCamelReg = /^\w+(-\w+)+/;
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
        target[key] = key === 'header' ? extend(target[key] || {}, source[key] || {}) : source[key];
      }
    }
    return target;
  }
  function cloneObject(obj) {
    var source;
    if (isType(obj, 'object')) {
      source = {};
    } else if (isType(obj, 'array')) {
      source = [];
    } else {
      return null;
    }
    return (function clone(obj, source) {
      if (isType(obj, 'object')) {
        var key;
        for (key in obj) {
          if (isType(obj[key], 'object')) {
            source[key] = clone(obj[key], {});
          } else if (isType(obj[key], 'array')) {
            source[key] = clone(obj[key], []);
          } else {
            source[key] = obj[key];
          }  
        }
      }
      return source;
    })(obj, source);
  }
  function toLargeCamel(str) {
    if (_LargeCamelReg.test(str)) {
      str = str.split('-');
      forEach(str, function (item, index) {
        str[index] = item.replace(/^\w/, function (char) {
          return char.toUpperCase();
        });
      });
      str = str.join('-');
    }
    return str;
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
    forEach(header, function (value, key) {
      if (value) {
        key === 'Content-Type' && value !== 'formData' && (value += ';charset=' + charset);
        (value === 'formData' && key === 'Content-Type') || (xhr.setRequestHeader(key, value));
      }
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
    var callback = ['abort', 'progress'],
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
      } else if (readyState === 1) {
        _this.emit('start');
        if (isType(timeout, 'number')) {
          timer = setTimeout(function () {
            res.error = new Error('request timeout');
            _this.emit('timeout');
          }, timeout);
        }
      }
    };
  }
  function createScript(url) {
    var script = doc.createElement('script'),
        _this = this,
        timeout = this.options.timeout,
        timer = null,
        body = doc.body;
    this.script = script;
    script.src = url;
    script.type = 'text/javascript';
    if (timeout) {
      timer = setTimeout(function () {
        timer = script.onreadystatechange = script.onload = script.onerror = null;
        _this.jsonpTimeout = true;
        body.removeChild(script);
        _this.emit('timeout');
      }, timeout);
    }
    _this.emit('start');
    body.appendChild(script);
    function load() {
      if (!script.getAttribute('data-load')) {
        _this.emit('fail');
        script.onerror = null;
        body.removeChild(script);
      }
      script.onload = script.onreadystatechange = null;
      clearTimeout(timer);
      win[_this.options.jsonpName] = null;
    }
    script.onreadystatechange = function () {
      if (script.readyState && (script.readyState === 'loaded' || script.readyState === 'complete')) {
        load();
      }
    };
    script.onload = load;
    script.onerror = function () {
      clearTimeout(timer);
      _this.emit('fail');
      win[_this.options.jsonpName] = null;
      body.removeChild(script);
    };
  }
  function addJSONPCallback(cb) {
    var _this = this;
    win[this.options.jsonpName] = function () {
      _this.script.setAttribute('data-load', true);
      if (!_this.jsonpTimeout) {
        cb.apply(null, arguments);
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
      _this.emit('start');
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
      iframe.onload = load;
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
          xhr = this.xhr = type === 'jsonp' ? null : getXhr(),
          _this = this,
          formElement = typeof url === 'object' ? url : null;
      formElement && (url = null);
      options && options.header && (setKeyToLargeCamel(options.header) && toStandardHeader(options.header));
      this.type = type;
      this.url = url;
      this.formElement = formElement;
      options = this.options = extend(cloneObject(ajax.options || _options), options, ['host']);
      if (!formElement && support.XHR2 && xhr) {
        addXHR2Listener.call(this, xhr, options);
      }
      var addListener = function () {
        if (formElement) {
          addFormListener.call(_this, formElement, options);
        } else if (xhr) {
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
        if (event === 'success' && !this.xhr) {
          addJSONPCallback.call(this, cb);
        } else {
          this['$' + event] = cb;
          protect(this, ['$' + event]);
        }
      }
      return this;
    },
    stop: function () {
      typeof this.xhr.abort === 'function' && this.xhr.abort();
    },
    then: function (cb) {
      if (this.xhr) {
        isType(cb, 'function') && this.on('success', cb);
      } else {
        throw new Error('extend-ajax can\'t use then() with jsonp, it must use on(\'sucesss\')');
      }
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
      this.data = data;
      if (xhr) {
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
      } else {
        // jsonp
        url += '?' + options.jsonpParam + '=' + options.jsonpName;
        createScript.call(this, url);
      }
      return xhr ? (this.promise || this) : this;
    },
    emit: function () {
      var args = toArray(arguments),
          event = args.shift();
      if (this.promise && this.resolve && (event === 'success' || event === 'fail')) {
        this.resolve(args[0]);
      }
      this['$' + event] && this['$' + event].apply(null, args);
      if (event !== 'progress' && event !== 'end' && event !== 'start ') {
        this.emit('end');
      }
    }
  });
  extend(ajax, {
    config: function (options) {
      if (typeof options === 'object') {
        options.header && setKeyToLargeCamel(options.header) && toStandardHeader(options.header);
        extend(this.options, options);
      }
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
