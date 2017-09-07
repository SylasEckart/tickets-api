/**
 * Created by sylas on 02/04/17.
 */
const cheerio = require('cheerio')
, getDate = require('./helpers/getDate.js')
, SITE = 'http://www.ingresso.com/'
, request = require('request')
, _ = require('lodash')
, rp = require('request-promise-native')
, fs = require('fs')
, city = 'rio de janeiro';
// let specific date =`?partnership=&date=${getDate.init()}`

exports.fetch = (req,res) => {

    let id = req.params;
    let filePath = id.movie ? `./db/filme/${id.movie}.json` : `./db/cinema/${id.movieTheater}.json`
    fs.exists(`${filePath}`, exists => {
        if(exists){
            fs.readFile(`${filePath}`, {encoding: "utf8"}, (err, data) => res.send(err = data))
        }
        else{
            makeRequest(id,res,filePath)
        }
    });
}

let makeRequest = async (id,res,filePath) => {
    let pageToVisit = id.movie ? `${SITE}${_.kebabCase(city)}/home/filmes/${_.kebabCase(id.movie)}` : `${SITE}${_.kebabCase(city)}/home/cinemas/${_.kebabCase(id.movieTheater)}` 
    console.log(pageToVisit);
    try {
        $ = await rp({uri: pageToVisit,transform: body => cheerio.load(body)})
        switch($('.container').contents().length) {
            case 23:
                var session = $('.container').contents()[17];
                var type = 'event'
            break;
            case 17:
                var session = $('.container').contents()[13];
                var type = 'theater'
            break;
            case 27:
                var session = $('.container').contents()[21];
                var type = 'event'
            break;
            default:
                res.send('não existe sessão para o filme na data escolhida')
        }
        if(session.nodeType === 8){
            let index = session.data.indexOf("city")
            session = session.data.slice(index).replace(/[^0-9\.]/g, '')
            let link = `https://api-content.ingresso.com/v0/sessions/city/${session.slice(0,1)}/${type}/${session.slice(1,6)}`
            let body = await rp({uri:link,json:true,simple: true})
            if(body.length > 0 ){
                fs.writeFile(`${filePath}`,JSON.stringify(body),err => console.log(err = "sucesso"))
                res.send(body)
            }
            else{
                res.send(`não existe sessão para o filme na data escolhida`)
            }
        }
        else{
            res.send(`Verifique a grafia do filme ou se ele está em cartaz`)
        }   
    } catch (err) {
        res.status(500).send(err)
    }
}