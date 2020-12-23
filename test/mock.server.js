const parse = require('co-body');
module.exports = function (app) {
  app.get('/testGet', (req, res) => {
    res.json({
      num: 1
    });
  });
  app.post('/testPost', async (req, res) => {
    const body = await parse(req)
    res.json(body);
  });
  app.delete('/testDelete', async (req, res) => {
    res.write('ok');
    res.end();
  });
  app.get('/testError', async (req, res) => {
    res.statusCode = 400;
    res.end();
  });
  app.get('/testTimeout', (req, res) => {
    setTimeout(() => {
      res.end();
    }, 1000)
  });
  app.get('/testJsonp', (req, res) => {
    res.setHeader('Content-Type', 'text/javascript');
    res.write(`jsonpCallback(1)`);
    res.end();
  });
  app.get('/testCache', (req, res) => {
    res.write(`${+new Date()}`);
    res.end();
  });
  app.get('/testDelete', (req, res) => {
    res.write(`${+new Date()}`);
    res.end();
  });
}
