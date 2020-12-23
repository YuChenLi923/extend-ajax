const should = require('should/as-function');
const port = 8081;
let ajax = null;
if  (process.env.NODE_ENV === 'TEST') {
  require('blanket')();
  require('jsdom-global')('', {
    url: 'http://localhost'
  });
  ajax = require('../dist/extend-ajax').default;
  const mockServer = require('./mock.server');
  const cors = require('cors')
  const express = require('express');
  const app = express();
  app.use(cors({
    origin: '*'
  }));
  mockServer(app);
  app.listen(port, () => console.log(`Example app listening on port ${port}!`));
} else {
  ajax = require('../src').default;
}
const host = `http://localhost:${port}`;
ajax.config({ host });
describe('extend-ajax test cases:', () => {
  it('send get request', () => {
    return ajax('/testGet', 'get').send().then((res) => {
      should(res.status).equal(200);
      should(res.data).equal(`{"num":1}`);
      should(res).have.property('header');
    });
  });
  it('send post requst', () => {
    return ajax('/testPost', 'post', {
      header: {
        'Content-Type': 'json'
      }
    }).send({
      num: 1
    }).then((res) => {
      console.log(res, JSON.parse(res.data));
      should(res.status).equal(200);
      should(JSON.parse(res.data).num).equal(1);
      should(res).have.property('header');
    });
  });
  it('send post requst with convert', () => {
    return ajax('/testPost', 'post', {
      header: {
        'Content-Type': 'json'
      },
      convert: function (data) {
        return JSON.parse(data);
      }
    }).send({
      num: 1
    }).then((res) => {
      should(res.data.num).equal(1);
    });
  });
  it('send delete request', () => {
    return ajax('/testDelete', 'delete').send().then((res) => {
      should(res.data).equal('ok');
    });
  });
  // jsonp fail with mocha
  if (process.env.NODE_ENV !== 'TEST') {
    it('send jsonp request', () => {
      return ajax('/testJsonp', 'jsonp').send().then((data) => {
        should(data).equal(1);
      }).catch((e) => {
        console.log(e);
      });
    });
  }

  it('send request with cache', async () => {
    ajax.config({
      cacheSize: 4,
      cacheExp: 2000
    });
    const res1  = await ajax('/testCache', 'get').send();
    const res2  = await ajax('/testCache', 'get').send();
    ajax.config({
      cacheSize: 0
    });
    should(res1.data).equal(res2.data);
  });
  it('send 404 request', () => {
    return ajax('/test404').send().catch((res) => {
      should(res.status).equal(404);
    });
  });
  it('send server error request', () => {
    return ajax('/testError').send().catch((res) => {
      should(res.status).equal(400);
    });
  });
  it('send timeout request', (done) => {
    const req = ajax('/testTimeout', {
      timeout: 500
    });
    req.send();
    req.on('timeout', () => {
      done();
    });
  });
  it('router change after send request', (done) => {
    window.history.pushState({}, '', 'http://localhost/test');
    const req = ajax('/testTimeout', {
      autoAbort: true
    });
    req.on('abort', () => {
      done();
    });
    req.send();
    window.history.pushState({}, '', 'http://localhost');
    const req1 = ajax('/testTimeout', {
      autoAbort: true
    });
    req1.send();
  });
});
