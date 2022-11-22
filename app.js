const http = require("http");

/*
    The requestListener function gets two args:
    requst - in type of incoming message.
    response - object to send to the request.  
*/

function requsetListener(req, res) {
  console.log(req);
  //   console.log("remez");
}

/* 
    Takes a request listener:  
    a function that will be called on every coming request.
    It returs a SERVER
*/

const server = http.createServer(requsetListener);

/* 
    Same result diffrent approach:
    http.createServer((req, res) =>{
    
    })
*/

/* 
    listen: 
    Nodejs starts a process that keeps runing to listen to incomung requests.
    listen take couple of arguments. 
    the first one is the port on which we want to listen to (the default is port 80). 

*/
server.listen(3000);
