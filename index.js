const { greetUser } = require("./user");
const http = require("http");
const url = require("url");
const events = require("events");
const fs = require("fs");

const logger = new events.EventEmitter();
logger.on("log-in", (fname, lname) => {
  fs.appendFile("log.txt", `${fname} ${lname}\n`, (err) => {
    // ...
  });
});

logger.on("init", () => {
  if (!fs.existsSync("log.txt")) {
    return;
  }
  fs.unlinkSync("log.txt");
});

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);

  const fname = parsedUrl.query.fname;
  const lname = parsedUrl.query.lname;
  if (!fname || !lname) {
    res.end();
    return;
  }
  res.end(greetUser(fname, lname));
  logger.emit("log-in", fname, lname);
});

server.listen(3000, () => {
  console.log("sever running");
  logger.emit("init");
});
