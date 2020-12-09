# extend-ajax
[![Build Status](https://travis-ci.org/YuChenLi923/extend-ajax.svg?branch=master)](https://travis-ci.org/YuChenLi923/extend-ajax)
![NPM version](https://badge.fury.io/js/extend-ajax.svg)
![Downloads](http://img.shields.io/npm/dm/extend-ajax.svg?style=flat)
[![Coverage Status](https://coveralls.io/repos/github/YuChenLi923/extend-ajax/badge.svg?branch=master)](https://coveralls.io/github/YuChenLi923/extend-ajax?branch=master)


## 特性

- 能够轻松地设定请求头和获取响应头
- 能够缓存请求,如果不是jsonp传输的话
- 可以在使用前提前处理服务端发来的数据
- 支持jsonp传输
- 支持IE10+


## 安装

```
npm i extend-ajax --save
```

## 实例

发送一个ajax post请求

```
ajax('test/post', 'post').send({
   text: 'hello'
}).then(({data})=> {
  console.log(data);
})
```

发送一个ajax post请求,并设置全局配置

```
var ajax = require('extend-ajax');
ajax.config({
   host: 'http://xxx.com/',
   convert: (data) => {
     return JSON.parse(data);
   },
   cacheSize: 2
});
ajax('test/post', 'post', {
     header: {
       'Content-Type': 'json',
       'Accept': 'json'
     }
}).send().then(({data})=> {
      console.log(data);
})
```

仅考虑IE10+的文件传输
```
html:

<input name = "file" type = "file" id = "file">

js:
var ajax = require('extend-ajax');
var files = document.getElementById('file').files;
var fileUpload =  ajax('upload', 'post', {
  header: {
    'Content-Type': 'formData'
  }
}).send({
  file: files
}).then(() => {
  alert('file is successfully uploaded');
});

```

jsonp传输

```
 var JSONP = ajax('/test/jsonp', 'jsonp', {
     jsonpParam: 'callback',
     jsonpName: 'getDataByJsonp'
 });
 JSONP.on('success', function (data) {
     console.log('get data:' + data + ' with jsonp');
     done();
 });
 JSONP.send();
```

## API

### ajax(url[,method,options])

创建一个ajax对象,随后需要调用ajax.send()方法才能发送一个ajax请求。

- url \<string> 请求的url

- method \<string>  请求方式。default: 'get'.

- options \<object>

  - isAsync \<boolean> 默认值: true
  - cacheSize \<number> 设置缓存大小,默认值: 0
  - cacheExp \<number> 设置缓存时间,单位:秒,默认值:300
  - charset \<stirng> 设置传输数据的编码字符集,默认值: 'utf-8'
  - convert \<function>  在使用响应数据前,对其进行处理,之后通过then(({data}) => {...})或者on('success', ({data})=> {...}),我们获取的data就是这个convert函数返回给我们的。
  - host \<string> 服务器主机的地址,默认值: ''.
  - header \<object> 设置头信息。默认值: {'Content-Type': 'form', 'Accept': 'json'}
      - Content-Type \<string> 可以设置为: 'text', 'json', 'form'(default), 'formData', 'html' 以及标准的content-type。
      - Accept \<string> 可以设置为: 'text', 'json', 'html'以及标准的Accept值。
      - ...
  - jsonpName \<String>  处理jsonp响应的函数名称,默认值: 'jsonpCallback'
  - jsonpParma \<String> jsonp传输时回调函数的键名,default: 'callback'
  - scope \<object> 默认:null, 定义回调函数的作用域。
  - timeout \<number> 请求超时的响应时间,单位:ms.默认值:0,0的情况下不会触发响应超时事件
  - withCredentials \<boolean> 是否允许ajax请求携带验证信息,例如:cookie.


### ajax.send(data)

发送一个ajax请求,并返回一个Promise对象,如果不支持Promise则返回一个ajax对象它本身。

- data \<string>|\<object>  如果请求方式为get,那么data会放入查询字符串中，而不会放入请求主体中。

### ajax.abort()

中断ajax请求

### ajax.then(cb)

发送一个ajax请求, 如果不支持Promise则返回一个ajax对象它本身,所以仍然可以通过then()获取响应信息

- cb \<function> 这个回调函数,调用时会被传入一个res对象,这个对象包含了header, status, data。

### ajax.on(event, cb)

为ajax对象添加事件监听。如果是同步请求,必须在发送请求之前添加事件监听。

- cb \<funtction>  事件对应的回调函数。
- event \<string>
  - success 当响应成功时,会触发success事件
  - fail  当响应失败时(例如http状态码为: 404, 400, 500..., 或者 jsonp传输失败时)
  - abort  当请求被中断时
  - timeout  请求超时
  - start 开始发送请求时
  - end 请求结束时,无论是成功与否

### ajax.config(options)

设置全局配置,每一个ajax对象都会应用这个配置。


## 兼容IE8-9

请使用1.x和0.x版本。
