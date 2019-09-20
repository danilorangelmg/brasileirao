var app = require('./app_config.js');

//controller
require('./controller/modelMongoController.js');
var movies = require('./controller/movieController.js');
var checkout = require('./controller/checkoutController.js');
var user = require('./controller/userController.js');
var offer = require('./controller/offerController.js');
var cron = require('./controller/cronController.js');
var cheerio = require('cheerio')
var request = require("request");

var validator = require('validator');

cron.createCrons();


app.get('/', function (req, res) {
    res.contentType('application/json');
    var resp = 'Servidor online\n\n' +
        'Serviços disponivel\n' +
        '/lastedMovies\n' +
        '/lastedMovies/banners\n' +
        '/genres\n' +
        '/genres/{{id}}\n' +
        '/movies/{{name}}\n' +
        '/login\n' +
        '/logout\n' +
        '/userOffer\n' +
        '/newUser\n' +
        '/userDetail';

    res.end(resp);
});

app.get("/craw", function (req, res) {

    request('https://globoesporte.globo.com/futebol/brasileirao-serie-a/', function (err, resReq, html) {
        const a = cheerio.load(html)
        const $ = cheerio.load(a.html())
        $('.menu-submenu-column-1 ul').find('.menu-level li').find('.menu-item-link').each((i, el) => {
            if (i == 0) {
                item = $(el).text()
                res.json(({"status": "error", "message": item}));
            }
        })
    })
})

// function test(html, res) {
//     const a = cheerio.load(html)
//     const $ = cheerio.load(a.html())
//
//     $('.menu-submenu-column-1 ul').find('.menu-level li').find('.menu-item-link').each((i, el) => {
//         console.log("i "+i+" ")
//         if (i == 0) {
//         item = $(el).text()
//     }
// }

// var item = ""
// var finish = false
// request('https://globoesporte.globo.com/futebol/brasileirao-serie-a/', function (err, resReq, body) {
//     const a = cheerio.load(html)
//     const $ = cheerio.load(a.html())
//
//     $('.menu-submenu-column-1 ul').find('.menu-level li').find('.menu-item-link').each((i, el) => {
//         console.log("i "+i+" ")
//         if (i == 0) {
//         item = $(el).text()
//         res.json(({"status": "error", "message": item}));
//     }
//
// })