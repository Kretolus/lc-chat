const { Router } = require('express');
const clientRouter = Router();

clientRouter.get('/', (req, res) => {
  res.sendFile(__dirname + '/client.html');
});

module.exports = clientRouter;
