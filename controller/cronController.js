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
            // console.log('saved successfully: '+new Date());
        }
    });
}

exports.createCrons = function() {
    cron.schedule("0 0 * * * *", function () {
        ScoreModel = base.getDbModel(constUtil.ScoreModel());
        console.log("Run Schedule "+new Date());
        var result = new Object()
        result.rodadas = [38]
        var descriptions = new Object();
        descriptions.values = []
        var count = 1
        var countTotal = 0
        getGame(count, countTotal, descriptions, result)

    });
};

function getGame(rodadaCount, countTotal, descriptions, result) {
    if (rodadaCount > 38) {
        return
    }
    var url = "https://api.globoesporte.globo.com/tabela/d1a37fa4-e948-43a6-ba53-ab24ab3a45b1/fase/fase-unica-seriea-2019/rodada/"+rodadaCount+"/jogos/"
    base.getCall(url, function (resp) {
        console.log(url)
        console.log(rodadaCount)
        var rodada = new Object();
        rodada.num = rodadaCount
        rodada.value = resp
        result.rodadas[rodadaCount-1] = rodada

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

        if (rodadaCount == 37) {
            verify(result)
            for(var i = 0; i<descriptions.values.length; i++) {
                getDescription(descriptions.values[i].id, descriptions.values[i].url)
            }
        }

        rodadaCount++
        getGame(rodadaCount, countTotal, descriptions, result)
    })
}

function getDescription(id, url) {
    var url = "https://globoesporte.globo.com/globo/raw/"+url
    verifyDescription(id, url)
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