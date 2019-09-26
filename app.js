var app = require('./app_config.js');

//controller
require('./controller/modelMongoController.js');
var cron = require('./controller/cronController.js');
var base = require('./controller/baseController.js');
var cheerio = require('cheerio')
var request = require("request");
var constUtil = require('./const.js');

var validator = require('validator');
var ScoreModel = base.getDbModel(constUtil.ScoreModel());
var DescriptionModel = base.getDbModel(constUtil.DescriptionModel());

cron.createCrons();


app.get('/', function (req, res) {
    res.contentType('application/json');
    var resp = 'Servidor online\n\n' +
        'Serviços disponivel\n' +
        '/score\n' +
        '/games\n' +

    res.end(resp);
});

app.get("/score", function (req, res) {

    request('https://globoesporte.globo.com/futebol/brasileirao-serie-a/', function (err, resReq, html) {
        const a = cheerio.load(html)
        const $ = cheerio.load(a.html())
        var result = $('body').find('main').find('script').html().toString()
        const match = result.match(/const classificacao = (.*);/);
        var json = JSON.parse(match[1])
        delete json.edicao
        delete json.fase
        delete json.fases_navegacao
        delete json.lista_jogos
        delete json.lista_jogos_unica
        delete json.lista_tipo_unica
        delete json.rodada
        delete json.faixas_classificacao
        res.json(json)

    })
})

app.get("/games", function(req, res){
    if (!ScoreModel) {
        ScoreModel = base.getDbModel('ScoreModel');
    }
    base.find(constUtil.ScoreModel(), {}, function (values) {
        res.json(JSON.parse(values[0].result));
    });

})

app.get("/description/:id", function (req, res) {
    id = validator.trim(validator.escape(req.param('id')));
    if (!DescriptionModel) {
        DescriptionModel = base.getDbModel('DescriptionModel');
    }
    base.find(constUtil.DescriptionModel(), {"gameId":id}, function (values) {
        base.getCall(values[0].url, function(resp){
            var json = resp
            delete json.resource.transmissao
            delete json.data_layer
            delete json.context
            delete json.hierarchy
            delete json.resource.lances_feed
            delete json.resource.total_espectadores
            delete json.resource.tabela
            res.json(json)
        })
    });
})