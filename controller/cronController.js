/**
 * Created by danilorangel on 27/04/17.
 */

var cron = require('node-cron');
var constUtil = require('../const.js');
var base = require('../controller/baseController.js');

var ScoreModel = base.getDbModel(constUtil.ScoreModel());
var DescriptionModel = base.getDbModel(constUtil.DescriptionModel());

function save(model) {
    model.save(function (err, dbObj) {
        if (err) {
            console.log(err);
        } else {
            console.log('saved successfully: '+new Date());
        }
    });
}

exports.createCrons = function() {
    cron.schedule("0 * * * * *", function () {
        ScoreModel = base.getDbModel(constUtil.ScoreModel());
        console.log("Run Schedule "+new Date());
        var result = new Object()
        result.rodadas = [38]
        var descriptions = new Object();
        descriptions.values = []
        var count = 0
        var countTotal = 0
        for (var i = 1; i <= 38; i++) {
            base.getCall("https://api.globoesporte.globo.com/tabela/d1a37fa4-e948-43a6-ba53-ab24ab3a45b1/fase/fase-unica-seriea-2019/rodada/"+i+"/jogos/", function (resp) {
                var rodada = new Object();
                rodada.num = count + 1
                rodada.value = resp
                result.rodadas[count] = rodada

                for (var i = 0; i<resp.length; i++) {
                    if (resp[i].transmissao != null) {
                        descriptions.values[countTotal] = new Object()
                        descriptions.values[countTotal].url = resp[i].transmissao.url
                        descriptions.values[countTotal].id = resp[i].id
                        countTotal++
                        // console.log("RUN "+resp[i].id)
                        // getDescription(resp[i].id, resp[i].transmissao.url)
                    }
                }

                if (count == 37) {
                    console.log(JSON.stringify(result))
                    verify(result)
                    for(var i = 0; i<descriptions.values.length; i++) {
                        getDescription(descriptions.values[i].id, descriptions.values[i].url)
                    }
                }
                count++
            })

        }

    });
};

function getDescription(id, url) {
    var url = "https://globoesporte.globo.com/globo/raw/"+url
    console.log("getDescription "+url)
    verifyDescription(id, url)
    // base.getCall("https://globoesporte.globo.com/globo/raw/https://globoesporte.globo.com/sp/futebol/brasileirao-serie-a/jogo/01-05-2019/corinthians-chapecoense.ghtml", function(resp){
    //     console.log("getDescription request "+id)
    //     var json = resp
    //     delete json.resource.transmissao
    //     delete json.data_layer
    //     delete json.context
    //     delete json.hierarchy
    //     delete json.resource.lances_feed
    //     delete json.resource.total_espectadores
    //     delete json.resource.tabela
    //     verifyDescription(id, json)
    // })
}


function verify(result) {
        base.find(constUtil.DescriptionModel(), {}, function (valuesResult) {
            if (valuesResult && valuesResult.length > 0) {
                var values = valuesResult[0];
                values.result = JSON.stringify(result);
                values.date = new Date();
                var model = new ScoreModel(values);
                save(model);
            } else {
                var values = new Object();
                values.result = JSON.stringify(result);
                values.date = new Date();
                var model = new ScoreModel(values);
                save(model);
            }
        });
        return;
}

function verifyDescription(id, result) {
    console.log("verifyDescription "+id)
    base.find(constUtil.DescriptionModel(), {"gameId": id}, function (valuesResult) {
        if (valuesResult && valuesResult.length > 0) {
            var values = valuesResult[0];
            values.url = result;
            values.date = new Date();
            values.gameId = id
            var model = new DescriptionModel(values);
            save(model);
        } else {
            var values = new Object();
            values.url = result;
            values.date = new Date();
            values.gameId = id
            var model = new DescriptionModel(values);
            save(model);
        }
    });
    return;
}

//