var ajax = require('extend-ajax');
jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000000;
ajax.config({
  convert: function (data) {
    return JSON.parse(data);
  },
  cacheSize: 5
});
describe('test request', function () {
  it('post', function (done) {
    ajax('test/post', 'post', {
      header: {
        'Content-Type': 'json'
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
      },
      convert: function (data) {
        return JSON.parse(data);
      }
    }).send({
      test: 9999
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
describe('test form submit', function () {
  it('test form submit', function (done) {
    var form = document.getElementById('my-form');
    form.elements[0].value = 'test';
    ajax.form('my-form', {
      convert: function (data) {
        return JSON.parse(data);
      }
    }).on('success', function (res) {
      console.log(res, 99999);
      done();
    });
    form.submit();
  });
  it('test form submit timeout', function (done) {
    var formTimeOut = document.getElementById('my-form-timeout');
    formTimeOut.elements[0].value = 'test';
    ajax.form('my-form-timeout', {
      convert: function (data) {
        return data;
      },
      timeout: 5
    }).on('success', function (res) {
      console.log(res);
    }).on('timeout', function () {
      done();
      console.log('request timeout');
    });
    formTimeOut.submit();
  });
});
