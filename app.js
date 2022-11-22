const http = require("http");

/*
Inorder to import a exported logic 
we wrote in a diffrent file 
we can use "require" with the  
relative path to the file we want to 
import 
*/
const rout = require("./routes");

const server = http.createServer(rout.handler);

server.listen(3000);
