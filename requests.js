/**
 * Created by sylas on 02/04/17.
 */
const cheerio = require('cheerio')
, getDate = require('./helpers/getDate.js')
, SITE = 'http://www.ingresso.com/'
, request = require('request')
, rp = require('request-promise-native');
let choosedType;
let city = 'rio-de-janeiro';
// let specific date =`?partnership=&date=${getDate.init()}`
choosedType = 'legendado';

module.exports  = {
    moviesArray: function (body)  {
        let $ = cheerio.load(body);
        let tickets = $(`.favoriteCinemas`);
        if (tickets.length) {
            console.log(`procurando horarios pelo cinema`);
            $(`a.nomeEspetaculo`).each(function () {
                let pageToVisit = $(this).attr('href');
                if (MOVIES.indexOf(pageToVisit) === -1 ){
                    MOVIES.push(pageToVisit)
                }

            });
            console.log(MOVIES);
            MOVIES.forEach((pageToVisit,index) =>{
                if(index % 2 === 0) {
                    module.exports.byMovie(pageToVisit);
                    console.log(pageToVisit)
                }
                else{
                    console.log(`primeiro elemento: ${pageToVisit}`)
                }
            });
        }
        else {
            console.log(`Ainda não tenho informações sobre o cinema especificado`)
        }
    },
    byMovieTheater: function (movieTheater) {
        return new Promise((resolve, reject) => {
            let pageToVisit = `${SITE}${city}/home/cinemas/${movieTheater}`;
            console.log(`Buscando horários para o cinema ${movieTheater}`);
            console.log(pageToVisit);
            rp(pageToVisit)
            .then(body => {
                module.exports.apiCall(body)
                .then(res => {
                    resolve(res);
                })
                .catch(err => console.log(err))
            })
            .catch(err => err)
        });  
    },
    byMovie: function (movie) {
        return new Promise((resolve, reject) => {
            let pageToVisit = `${SITE}${city}/home/filmes/${movie}`;
            console.log(`Buscando horários para o filme ${movie}`);
            console.log(pageToVisit);
            rp(pageToVisit)
            .then(body => {
                module.exports.apiCall(body)
                .then(res => {
                    resolve(res);
                })
                .catch(err => console.log(err))
            })
            .catch(err => err)
        });
    },
    byMovieandTheater: function (movie,movieTheater) {
         return new Promise((resolve, reject) => {
            let pageToVisit = `${SITE}${city}/home/filmes/${movie}`;
            console.log(`Buscando horários para o filme ${movie}`);
            console.log(pageToVisit);
            rp(pageToVisit)
            .then(body => {
                module.exports.apiCall(body)
                .then(res => {
                    resolve(res);
                })
                .catch(err => console.log(err))
            })
            .catch(err => err)
        });
    },
    apiCall: function (body) {
        return new Promise((resolve, reject) => {
            let $ = cheerio.load(body);
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
                    reject('não existe sessão para o filme na data escolhida');
            }
            if(session.nodeType === 8){
                let index = session.data.indexOf("city")
                session = session.data.slice(index).replace(/[^0-9\.]/g, '')
                let link = `https://api-content.ingresso.com/v0/sessions/city/${session.slice(0,1)}/${type}/${session.slice(1,6)}`
                rp({uri:link,json:true,simple: true})
                .then(body =>{
                    if(body.length > 0 ){
                        resolve(body)
                    }
                    else{
                         reject(`não existe sessão para o filme na data escolhida`)
                    }
                })
                .catch(err => console.log(err))
            }
                else{
                    reject(`Verifique a grafia do filme ou se ele está em cartaz`)
                }
        })
    }
};