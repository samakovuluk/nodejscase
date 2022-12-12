const { Worker } = require('worker_threads');
const request = require('request');
const REMOTE_SERVICE_URL = "https://cfrkftig71.execute-api.us-east-1.amazonaws.com/prod?expert=true";

const MAX_WORKERS = 5;

const urlQueue = [];
let numWorkers = 0;

function startWorker() {
  const worker = new Worker("./fetch_and_save_worker.js");
  worker.on('message', event => {
    
    if (event.error) {
        console.log('eee')
      console.error(event.error);
    }

    numWorkers--;

    if (urlQueue.length > 0) {
      startWorker();
    }
  });

  worker.postMessage({ url: urlQueue.shift() });

  numWorkers++;
}

function fetchAndSave() {
  console.log('fetchAndSave');

  request.get(REMOTE_SERVICE_URL, (error, res, body) => {
    if (error) {
      return console.error(`Error fetching remote service: ${error.message}`);
    }

    if (res.statusCode === 200) {
      const urls = extractUrls(JSON.parse(body));
      console.log(urls);

      for (const url of urls) {
        urlQueue.push(url);
      }

      while (numWorkers < MAX_WORKERS && urlQueue.length > 0) {
        startWorker();
      }
    }
  });
}

function extractUrls(json) {
       const urls = [];
          function traverse(obj) {
            if (typeof obj === 'string') {
              if (obj.startsWith('https://')) {
                urls.push(obj);
              }
            } else {
              for (const prop in obj) {
                traverse(obj[prop]);
              }
            }
          }
          traverse(json);
        return urls;
}
fetchAndSave()
setInterval(fetchAndSave, 5 * 60 * 1000);

