const http = require("http");

/*
Inorder to import a exported logic 
we wrote in a diffrent file 
we can use "require" with the  
relative path to the file we want to 
import 
*/
const routes = require("./routes");

const server = http.createServer((req, res) => {});

server.listen(3000);
