var ajax = require('extend-ajax');
jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
ajax.config({
  host: 'http://localhost:8081/',
  convert: function (data) {
    return JSON.parse(data);
  },
  cacheSize: 0
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
        a: 123,
        b: 12
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
