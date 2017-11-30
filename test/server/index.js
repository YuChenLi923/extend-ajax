const express = require('express'),
      bodyParser = require('body-parser'),
      port = 8081,
      app = express(),
      server = app.listen(port, () => {
        console.log('测试服务器已经打开');
      });

app.all('*', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization,X-Requested-With');
  next();
});
app.use(['/test/post'], bodyParser.json());
// test post
app.post('/test/post', (req, res) => {
  let body = req.body,
      result = {
        message: 'xxxxx',
        send: body
      };
  res.send(result);
});

// test get

app.get('/test/get', (req, res) => {
  let result = {
      message: 'xxxxx'
  };
  res.send(result);
});
