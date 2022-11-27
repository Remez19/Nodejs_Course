const http = require("http");

const express = require("express");

/*
express() - init a new object where express js 
will store and manage a lot of things. 
the app const is a valid request handler.
which means we can pass to http.createServer().
*/
const app = express();

/* 
 use() - allows us to create a new middleware function.
 it gets array of request handlers.
 One easy way of using it is to pass a function to it.
 This function will run for every incoming request.
 The next argument is a function. 
 this function must be called to pass to the next 
 middleware.
*/
app.use((req, res, next) => {
  console.log("Remez");
  next();
});

app.use((req, res, next) => {
  console.log("Remez next");
  /*
  send() - allows us to send a responses.
  the default response header is html/text.
    */
  res.send("<h1>Remez !</h1>");
});

const server = http.createServer(app);

server.listen(3000);
