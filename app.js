const app= require('express')()
,port = 3000
,bodyparser = require('body-parser')
,requests = require('./requests.js');

app.use(bodyparser.json());
app.listen(port,function (){
    console.log(`api is on http://localhost:${port}`)
})
app.get('/filme/:movie',requests.fetch)
app.get('/cinema/:movieTheater',requests.fetch)