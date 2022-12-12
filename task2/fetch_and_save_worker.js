const request = require('request');
const { parentPort } = require('worker_threads');

const WEB_SERVICE_URL = "http://localhost:8080/api/save_file";

parentPort.on('message', event => {
  const { url } = event;

  request.get(url, (error, res, body) => {
    if (error) {
      return parentPort.postMessage({ error: `Error fetching file: ${error.message}` });
    }

    const fileDataString = Buffer.from(body).toString('base64');

    const data = JSON.stringify({ url, fileData: fileDataString });

    const options = {
      url: WEB_SERVICE_URL,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: data
    };

    request(options, (error, res) => {
      if (error) {
        return parentPort.postMessage({ error: `Error saving file: ${error.message}` });
      }

      if (res.statusCode === 200) {
        console.log(`File saved: ${url}`);
        parentPort.postMessage({ success: true });
      } else {
        parentPort.postMessage({ error: `Error saving file: ${url}` });
      }
    });
  });
});
