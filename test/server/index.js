const app = {
  getHandle: {},
  postHandle: {},
  get: (url, cb) => {
    app.getHandle[url] = cb;
  },
  post: function (url, cb) {
    app.postHandle[url] = cb;
  }
};
app.post('/test/post', (req, res) => {
  let body = req.body,
      result = {
        message: 'xxxxx',
        send: body
      };
  res.setHeader('Content-Type', ' application/json');
  res.write(JSON.stringify(result));
  res.end();
});
app.post('/test/start', (req, res) => {
  let body = req.body,
      result = {
        message: 'xxxxx',
        send: body
     };
  res.setHeader('Content-Type', ' application/json');
  res.write(JSON.stringify(result));
  res.end();
});
app.post('/test/fail', (req, res) => {
  let body = req.body,
      result = {
        message: 'xxxxx',
        send: body
      };
  res.writeHead(500, {
    'Content-Type': ' application/json'
  });
  res.end(JSON.stringify(result));
});
// test get

app.get('/test/get', (req, res) => {
  let result = {
    message: 'xxxxx'
  };
  res.setHeader('Content-Type', ' application/json');
  res.write(JSON.stringify(result));
  res.end();
});

// test post
app.post('/test/form', (req, res) => {
  let body = req.body,
      result = {
        message: 'xxxxx',
        send: body
      };
  res.setHeader('Content-Type', 'text/html');
  res.write(JSON.stringify(result));
  res.end();
});
app.post('/test/form-timeout', (req, res) => {
  let body = req.body,
      result = {
        message: 'xxxxx',
        send: body
      };
  setTimeout(() => {
    res.setHeader('Content-Type', 'text/html');
    res.write(JSON.stringify(result));
    res.end();
  }, 500);
});
app.get('/test/jsonp?callback=getDataByJsonp', (req, res) => {
  res.setHeader('Content-Type', 'application/javascript');
  var data = 1;
  res.write('getDataByJsonp(' + data + ');');
  res.end();
});
app.get('/test/jsonpfail?callback=getDataByJsonp', (req, res) => {
  var data = 1;
  res.writeHead(400, {
    'Content-Type': ' application/javascript'
  });
  res.end('getDataByJsonp(' + data + ');');
});
app.get('/test/jsonp-timout?callback=getDataByJsonp', (req, res) => {
  setTimeout(function () {
    res.setHeader('Content-Type', 'application/javascript');
    var data = 1;
    res.write('getDataByJsonp(' + data + ');');
    res.end();
  }, 500);
});
module.exports = function (config) {
  return function (req, res, next) {
    const method = req.method.toLowerCase() + 'Handle',
          url = req.url,
          handle = app[method] && app[method][url];
    if (handle) {
      handle(req, res);
    } else {
      next();
    }
  };
};
