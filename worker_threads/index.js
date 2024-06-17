const express = require("express");
const { Worker } = require("worker_threads");

const app = express();
const port = process.env.PORT || 4000;

app.get("/non-blocking", (req, res) => {
  res.status(200).send("this page is nonblocking");
});

app.get("/blocking", async (req, res) => {
  const worker = new Worker("./worker.js");

  worker.on("message", (data) => {
    res.status(200).send(`result is ${data}`);
  });

  worker.on("error", (err) => {
    res.status(404).send(`An error occurred ${err}`);
  });
});

app.listen(port, () => {
  console.log(`App is listening on port ${port}`);
});
