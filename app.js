const indeed = require('indeed-scraper');
var express = require('express');
var mcache = require('memory-cache');
var app = express();
//cache 

var cache = (duration) => {
  return (req, res, next) => {
    let key = '__express__' + req.originalUrl || req.url
    let cachedBody = mcache.get(key)
    if (cachedBody) {
      res.send(cachedBody)
      return
    } else {
      res.sendResponse = res.send
      res.send = (body) => {
        mcache.put(key, body, duration * 1000);
        res.sendResponse(body)
      }
      next()
    }
  }
}

function getQuery(query){
  const queryOptions = {
    host: 'www.indeed.es',
    query: `${query}`,
    city: 'Madrid',
    radius: '100',
    level: '',
    jobType: '',
    maxAge: '',
    sort: 'date',
    limit: 50
  };
  return queryOptions;
}

app.get('/',cache(10), function(req,res){
  res.send("Usar / 'categoria' (colocar - en vez de espacios) ")
})

app.get('/:query', cache(300), async function (req, res) {
  try {
    let {query} = req.params;
    query = query.replace(/\-/g," ");
    console.log("buscando categoria:",query);
    const queryOptions = await (getQuery(query))
    const lol = await indeed.query(queryOptions);
    res.json(lol);
  } catch(e){
    console.log(e)
  }
 
})

const port = process.env.PORT || 3000;
const ip = process.env.IP;

app.listen(port, ip, function () {
  console.log('Example app listening on port 3000!');
});