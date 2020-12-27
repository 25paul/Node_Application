const express = require('express');
const router = require('./router');

const app = new express();

app.use('/', router);

const server = app.listen(5000, () => {
  const { address, port } = server.address();
  console.log('http服务启动成功：http://%s:%s', address, port)
})