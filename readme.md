# extend-ajax

![NPM version](https://badge.fury.io/js/extend-ajax.svg)
![Downloads](http://img.shields.io/npm/dm/extend-ajax.svg?style=flat)
[![Coverage Status](https://coveralls.io/repos/github/YuChenLi923/yc-task-manager/badge.svg?branch=master)](https://coveralls.io/github/YuChenLi923/extend-ajax?branch=master)
- returns Promises（if support it）
- ability to specify request headers
- ability to get response headers
- cache response data
- pre-treat response received
- support IE8+

## Install

```
npm i extend-ajax --save
```

## Examples

send a post request

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

file upload(IE10+)
```
html:

<input name = "file" type = "file" id = "file">

js:
var ajax = require('extend-ajax');
var files = document.getElementById('file').files;
var fileUpload =  ajax('upload', {
  header: {
    'Content-Type': 'formData'
  }
}).send({
  file: files
}).then(() => {
  alert('file is successfully uploaded');
});

```

file upload(IE8~9)
```
html:

<form id = "my-form" action = "test/form" method = "post" enctype = "multipart/form-data">
  <input name = "file" type = "file">
</form>

js:
var ajax = require('extend-ajax');
var myForm = ajax.form('my-form', {
  convert: (data) => {
    return JSON.parse(data.trim());
  }
});
myForm.on('success', (res) => {
  console.log(res);
  alert('file is successfully uploaded')
});
myForm.on('timeout', ({data}) => {
  console.log('File upload timeout');
});

```


## API

### ajax(url[,method,options])

create one ajax object, but it can't send a request immediately, you need use ajax.send() to send a request.

- url \<string> a reequest url

- method \<string> request method。default: 'post'

- options \<object>

  - async \<boolean> default: true

  - host \<string> host url,default: ''.
  - timeout \<number> the number of milliseconds a request can take before automatically being terminated
  - cacheSize \<number> set size of cache, default: 0
  - cacheExp \<number> set the cache expiration time relative to the present, default: 300, unit: s.
  - charset \<stirng> set http charset,default: 'utf-8'
  - convert \<function>  pre-treat response data received, the function have one argument:response data.if set it, it must return a data handled,or when success event happen,we can't get data from res.
  - header \<object> set http header.default: {'Content-Type': 'form', 'Accept': 'json'}
    - Content-Type \<string> you can set: 'text', 'json', 'form'(default), 'formData', 'html' and standard content-type value
    - Accept \<string> you can set: 'text', 'json', 'html' and standard Accept value
    - ...

### ajax.form(id[,options])

return ajax object, but it can't send any ajax request. It only be used to listen the data response submitted by the form.It only support 'success' and 'timeout' event.

- id form html element's id
- options  \<object>
  - convert\<function>  pre-treat response data received, the function have one argument:response data.
  - timeout  \<number> the number of milliseconds a request can take before automatically being terminated

### ajax.send(data)

send the ajax request, if browser support Promise, it will return Promise.If not, it will return itself.

- data \<string>|\<object>  if the request method is 'get', it's appended to query string of the URL, or it's sended to remote of body.

### ajax.then(cb)

when browser can't support Promise,ajax.send() will return the ajax object, so you can use then() to get response.

- cb \<function> the function have one argument res object include header, status, data.

### ajax.on(event, cb)

add event listener for the ajax object.if async is false, ajax.on() must be called before send,else it will not work.
- cb \<funtction>  the cb is called when event happen
- event \<string>
  - success  cb is fired when getting the response successfully
  - fail  cb is fired when  failing to get the response(eg: 404, 400, 500...)
  - abort  cb is fired when request is aborted
  - timeout  cb is fired when request timeout
  - error  cb is fired when happening error

### ajax.config(options)

specify global options, each ajax object will apply the options and own options.

## test

```
npm run test
```

