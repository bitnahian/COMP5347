const http = require('http');
const data = require('./data.json');


const hostname = '127.0.0.1';
const port = 3000;

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.setHeader("Access-Control-Allow-Origin", "*");
  console.log(req.url);
  if(req.url == '/getCategories') {
    let categorySet = new Set();
    for (let i = 0; i < data.length; i++) {
        categorySet.add(data[i].category);
    }
    categorySet.add('Anime');
    categoryList = Array.from(categorySet.values());
    categoryList.sort();
    categoryList.push('None');

    res.end(JSON.stringify(categoryList));
  }
  else {
    res.end(JSON.stringify(data));
  }
});


server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});