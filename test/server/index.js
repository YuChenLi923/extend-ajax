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
  res.write(JSON.stringify(result));
  res.end();
});
// test get

app.get('/test/get', (req, res) => {
  let result = {
    message: 'xxxxx'
  };
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
  }, 1000);
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
