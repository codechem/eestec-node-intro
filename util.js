var fs = require('fs');
var path = require('path');

const extContentTypeMap = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.ico': 'image/x-icon',
  '.svg': 'image/svg+xml',
  '.json': 'application/json',
  '.txt': 'text/plain'
}


module.exports.error = (res, status, message) => {
  status = status ? status : 500;
  message = message ? message : 'Internal Server Error';
  console.error('error:', status, message);
  res.writeHead(status);
  res.end(message);
}

module.exports.parseJson = (req, next) => {
  let data = '';
  req.on('data', function(chunk) {
    console.log('chunk', chunk.toString());
    data += chunk;
  });
  req.on('end', function() {
    req.body = JSON.parse(data);
    next();
  });
}

module.exports.saveFileAsync = async (req) => {
  return new Promise((resolve, reject) => {
    var fname = './uploads/' + randomUuid();
    let file = fs.createWriteStream(fname);
    req.on('data', (chunk) => file.write(chunk));
    req.on('end', () => {
      file.end();
      req.files = [{
        name: 'file',
        path: fname
      }];
      resolve(null);
    });
    req.on('error', (err) => reject(err));
  });
}

module.exports.html = (res, body) => {
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.end(body);
}

module.exports.json = (res, body) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(body));
}

module.exports.static = (res, file) => {
  try {
    if (fs.existsSync(file)) {
      const ext = path.extname(file);
      let contentType = extContentTypeMap[ext];
      contentType = contentType ? contentType : 'text/plain';
      res.writeHead(200, { 'Content-Type': contentType });
      fs.createReadStream(file).pipe(res);
    }
    else
      module.exports.error(res, 404, 'File not found');
  } catch (err) {
    module.exports.error(res, 500, err.message+'\n'+err.stack);
  }
}

function randomUuid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}
