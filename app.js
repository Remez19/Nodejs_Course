const http = require("http");
const fs = require("fs");
/*
    The requestListener function gets two args:
    requst - in type of incoming message.
    response - object to send to the request.  
*/

// function requsetListener(req, res) {
//   console.log(req.url, req.method, req.headers);
//   //   res.
//   // exit the running process
//   // process.exit();
//   // console.log("remez");
// }

/* 
    Takes a request listener:  
    a function that will be called on every coming request.
    It returs a SERVER
*/

// const server = http.createServer(requsetListener);

// Same result diffrent approach:
const server = http.createServer((req, res) => {
  const url = req.url;
  const method = req.method;
  if (url === "/") {
    res.write("<html>");
    res.write("<head><title>Enter Name</title>");
    res.write("<body>");
    res.write(
      '<form action="/message" method="POST"><input type="text" name="message"/><button type="sumbit">Send</button></form>'
    );
    res.write("</body>");
    res.write("</html>");
    return res.end();
  }
  if (url === "/message" && method === "POST") {
    /* 
     on allows us to listen t odiffrent events.
     the data event will be fired whenever a new chunck 
     is ready to be read.
    the second argument is a function that will be 
    excuted for every data event.
     */
    const body = [];
    req.on("data", (chunck) => {
      //   console.log(chunck);
      body.push(chunck);
    });
    res.on("finish", () => {
      const parsedBody = Buffer.concat(body).toString();
      const message = parsedBody.split("=")[1];
      //   console.log(message);
      fs.writeFileSync("./UserMessage.txt", message);
    });
    res.statusCode = 302;
    res.setHeader("Location", "/");
    return res.end();
  }
  res.setHeader("Content-Type", "text/html");
  res.write(
    "<html><hrader><title>My Page</title></header><body><h1>Remez</h1></body></html>"
  );
  res.end();
});

/* 
    listen: 
    Nodejs starts a process that keeps runing to listen to incomung requests.
    listen take couple of arguments. 
    the first one is the port on which we want to listen to (the default is port 80). 

*/
server.listen(3000);
