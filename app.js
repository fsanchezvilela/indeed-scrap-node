const indeed = require('indeed-scraper');
var express = require('express');
var app = express();

function getQuery(query){
  const queryOptions = {
    host: 'www.indeed.es',
    query: `${query}`,
    city: 'Madrid',
    radius: '40',
    level: '',
    jobType: 'fulltime',
    maxAge: '7',
    sort: 'date',
    limit: 100
  };
  return queryOptions;
}



app.get('/:query', async function (req, res) {
  try {
    let {query} = req.params;
    query = query.replace(/\-/g," ");
    console.log(query);
    const queryOptions = await (getQuery(query))
    const lol = await indeed.query(queryOptions);
    res.json(lol);
  } catch(e){
    console.log(e)
  }
 
})

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});