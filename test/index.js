var ajax = require('extend-ajax');
jasmine.DEFAULT_TIMEOUT_INTERVAL = 9999999999999;
ajax.config({
  convert: function (data) {
    return data;
  },
  header: {
    a: 1231
  },
  cacheSize: 5
});
describe('test request', function () {
  it('post', function (done) {
    ajax('test/post', 'post', {
      header: {
        'content-type': 'json'
      }
    }).send({
      a: 1
    }).then(function (res) {
      console.log(res.data);
      done();
    });
  });
  it('get', function (done) {
    ajax('test/get', 'get', {
      header: {
        'Content-Type': 'form'
      }
    }).send({
      test: 9999
    }).then(function (res) {
      done();
    });
  });
  it('fail', function (done) {
    var myAjax = ajax('test/fail', 'post');
    myAjax.on('fail', function () {
      console.log('request fail');
      done();
    });
    myAjax.on('success', function () {
      done();
    });
    myAjax.send({
      test: 9999
    });
  });
  it('abort', function (done) {
    var myAjax = ajax('test/fail', 'post');
    myAjax.on('abort', function () {
      console.log('request abort');
      done();
    });
    myAjax.send({
      test: 9999
    });
    myAjax.stop();
  });
  it('end', function (done) {
    var myAjax = ajax('test/get', 'get', {
      header: {
        'Content-Type': 'form'
      }
    });
    myAjax.on('end', function () {
      console.log('request end');
      done();
    });
    myAjax.send({
      test: 9999
    });
  });
  it('start', function (done) {
    var myAjax = ajax('test/start', 'post', {
      header: {
        'Content-Type': 'form'
      }
    });
    myAjax.on('start', function () {
      console.log('start request');
      done();
    });
    myAjax.send({
      test: 9999
    });
  });
  it('send undefined data', function (done) {
    ajax('test/post', 'post', {
      dev: true
    }).send({
      a: undefined
    }).then(function (res) {
      done();
    });
  });
});
describe('test cache', function () {
  it('cache ajax', function (done) {
    ajax('test/post', 'post', {
      header: {
        'Content-Type': 'json',
        'Accept': 'json'
      }
    }).send({
      a: 123,
      b: 12,
      c: {
        a: 12,
        b: 123
      }
    }).then(function (res) {
      console.log(res);
    });
    setTimeout(function () {
      ajax('test/post', 'post', {
        header: {
          'Content-Type': 'json',
          'Accept': 'json'
        }
      }).send({
        b: 12,
        a: 123,
        c: {
          b: 123,
          a: 12
        }
      }).then(function (res) {
        done();
        console.log(res);
      });
    }, 1000);
  });
});
describe('test jsonp', function () {
  it('jsonp success', function (done) {
    var testJSONP = ajax('/test/jsonp', 'jsonp', {
      jsonpParam: 'callback',
      jsonpName: 'getDataByJsonp'
    });
    testJSONP.on('success', function (data) {
      console.log('get data:' + data + ' with jsonp');
      done();
    });
    testJSONP.send();
  });
  it('jsonp fail', function (done) {
    var testJSONP = ajax('/test/jsonpfail', 'jsonp', {
      jsonpParam: 'callback',
      jsonpName: 'getDataByJsonp'
    });
    testJSONP.on('fail', function (data) {
      console.log('jsonp fail');
      done();
    });
    testJSONP.send();
  });
  it('jsonp timeout', function (done) {
    var testJSONP = ajax('/test/jsonp-timout', 'jsonp', {
      jsonpParam: 'callback',
      jsonpName: 'getDataByJsonp',
      timeout: 1
    });
    testJSONP.on('timeout', function (data) {
      console.log('jsonp timeout');
      done();
    });
    testJSONP.on('success', function (data) {
      console.log('get data:' + data + ' with jsonp');
      done();
    });
    testJSONP.send();
  });
});
describe('test form submit', function () {
  it('test form submit', function (done) {
    var form = document.getElementById('my-form');
    form.elements[0].value = 'test';
    ajax.form('my-form').on('success', function (res) {
      console.log(res);
      done();
    });
    form.submit();
  });
  it('test form submit timeout', function (done) {
    var formTimeOut = document.getElementById('my-form-timeout');
    formTimeOut.elements[0].value = 'test';
    ajax.form('my-form-timeout', {
      timeout: 5
    }).on('success', function (res) {
      alert(1);
      console.log(res);
    }).on('timeout', function () {
      done();
      console.log('request timeout');
    });
    formTimeOut.submit();
  });
});
