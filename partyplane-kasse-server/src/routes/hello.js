const express = require('express');

const hello = express.Router();

hello.get('/hello', (req, res) => {
   res.json({
       hello: "World"
   });
});

module.exports = {helloRouter: hello};