var http = require('http');
var { static, html, json, error, parseJson, saveFileAsync } = require('./util');
let server = http.createServer(async (req, res) => {
  if (req.url == '/')
    static(res, './public/index.html');
  else if (req.url.startsWith('/api')) 
    json(res, { message: 'Hello Api' });
  else if (req.url.startsWith('/public'))
    static(res, req.url.slice(1));
  else if (req.method == 'PUT')
    saveFileAsync(req)
      .then(() => json(res, { message: 'File saved' }))
      .catch(err => error(res, 500, err.message));
  else if (req.method == 'POST')
    parseJson(req, res, () => json(res, { message: 'File saved' }));
  else
    error(res, 404, 'Not found');
});

server.listen(80);
