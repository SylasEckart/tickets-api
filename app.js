const app= require('express')()
,port = 3000
,bodyparser = require('body-parser')
, requests = require('./requests.js');

app.use(bodyparser.json());
app.listen(port,function (){
    console.log(`api is on http://localhost:${port}`)
})
app.get('/filme/:movie',function(req,res){
    requests.byMovie(req.params.movie)
    .then(result=> res.send(result))
    .catch(err=> res.status(500).send(err))
})
app.get('/cinema/:movieTheater',function(req,res){
    requests.byMovieTheater(req.params.movieTheater)
    .then(result=> res.send(result))
    .catch(err=> res.status(500).send(err))
})