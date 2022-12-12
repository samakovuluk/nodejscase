const http = require('http');

const data = {}; 

const server = http.createServer((req, res) => {
  const { method, url: requestUrl } = req;

  if (method === 'POST' && requestUrl === '/api/save_file') {
    let body = '';

    req.on('data', chunk => {
      body += chunk.toString(); 
    });

    req.on('end', () => {
      const { fileData, url } = JSON.parse(body); 
      let fileName = url.split('/').pop(); 
      if (data[url]) {
        suffix = data[url].suffix ? data[url].suffix + 1 : 2;
        fileName = `${fileName}_${suffix}`;
        data[url] = { fileName,  fileData: data[url].fileData, suffix};
        console.log(`Warning: file with URL ${url} already exists. Saving with new name: ${fileName}`);
      } else {
        data[url] = { fileName, fileData };
      }
      res.statusCode = 200;
      res.end('File saved successfully.');
    });
  } else {
    res.statusCode = 404;
    res.end('Invalid request.');
  }
});

server.listen(8080);
