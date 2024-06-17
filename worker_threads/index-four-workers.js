const express = require("express");
const { Worker } = require("worker_threads");

const app = express();
const port = process.env.PORT || 4000;
const THREAD_COUNT = 8;

app.get("/non-blocking", (req, res) => {
  res.status(200).send("this page is nonblocking");
});

function createWorker() {
  return new Promise((resolve, reject) => {
    const worker = new Worker("./four-workers.js", {
      workerData: { thread_count: THREAD_COUNT },
    });

    worker.on("message", (data) => {
      resolve(data);
    });

    worker.on("error", (err) => {
      reject(`An error occurred ${err}`);
    });
  });
}

app.get("/blocking", async (req, res) => {
  const workerPromises = [];
  for (let i = 0; i < THREAD_COUNT; i++) {
    workerPromises.push(createWorker());
  }

  const thread_results = await Promise.all(workerPromises);
  const total =
    thread_results[0] +
    thread_results[1] +
    thread_results[2] +
    thread_results[3] +
    thread_results[4] +
    thread_results[5] +
    thread_results[6] +
    thread_results[7];

  res.status(200).send(`result is ${total}`);
});

app.listen(port, () => {
  console.log(`App is listening on port ${port}`);
});
