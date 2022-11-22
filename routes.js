const fs = require("fs");

const requestHandler = (req, res) => {
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
    return res.on("finish", () => {
      const parsedBody = Buffer.concat(body).toString();
      const message = parsedBody.split("=")[1];
      //   console.log(message);
      fs.writeFile("./UserMessage.txt", message, (error) => {
        res.statusCode = 302;
        res.setHeader("Location", "/");
        return res.end();
      });
    });
  }
  res.setHeader("Content-Type", "text/html");
  res.write(
    "<html><hrader><title>My Page</title></header><body><h1>Remez</h1></body></html>"
  );
  res.end();
};

/*
 Nodejs exposes a global var module. 
 with this var we can export ligic from files.
*/
module.exports = requestHandler;
