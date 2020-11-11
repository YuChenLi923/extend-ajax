
const should = require('should/as-function');
import ajax from 'extend-ajax';
describe('Test', () => {
  it('send get request', () => {
    return ajax('/testGet', 'get').send().then((res) => {
      should(res.status).equal(200);
      should(res.data).equal(`{"num":1}`);
      should(res).have.property('header');
    });
  });
  it('send post requst', () => {
    return ajax('/testPost', 'post').send({
      num: 1
    }).then((res) => {
      should(res.status).equal(200);
      should(res.data).equal(`{"num":"1"}`);
      should(res).have.property('header');
    });
  });
  it('send post requst with convert', () => {
    return ajax('/testPost', 'post', {
      convert: function (data) {
        return JSON.parse(data);
      }
    }).send({
      num: 1
    }).then((res) => {
      should(res.data.num).equal('1');
    });
  });
  it('send delete request', () => {
    return ajax('/testDelete', 'delete').send().then((res) => {
      should(res.data).equal('ok');
    });
  });
  it('send jsonp request', () => {
    return ajax('/testJsonp', 'jsonp').send().then((data) => {
      should(data).equal(1);
    });
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
});
