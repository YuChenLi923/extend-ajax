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
  it('post', (done) => {
    ajax('test/post', 'post', {
      header: {
        'Content-Type': 'json'
      }
    }).send({
      a: 1
    }).then(({data}) => {
      console.log(data);
      done();
    });
  });
  it('get', (done) => {
    ajax('test/get', 'get', {
      header: {
        'Content-Type': 'form'
      },
      convert: (data) => {
        return JSON.parse(data);
      }
    }).send().then(({data}) => {
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
      test: 123
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
        test: 123
      }).then(function (res) {
        done();
        console.log(res);
      });
    }, 1000);
  });
});
