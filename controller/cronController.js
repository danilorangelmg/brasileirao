/**
 * Created by danilorangel on 27/04/17.
 */

var cron = require('node-cron');
var constUtil = require('../const.js');
var base = require('../controller/baseController.js');

var ScoreModel = base.getDbModel(constUtil.ScoreModel());

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
        var count = 0
        for (var i = 1; i <= 38; i++) {
            base.getCall("https://api.globoesporte.globo.com/tabela/d1a37fa4-e948-43a6-ba53-ab24ab3a45b1/fase/fase-unica-seriea-2019/rodada/"+i+"/jogos/", function (resp) {
                console.log("executando "+count)

                var rodada = new Object();
                rodada.num = count + 1
                rodada.value = resp
                result.rodadas[count] = rodada

                if (count == 37) {
                    console.log(JSON.stringify(result))
                    verify(result)
                }

                count++

            })

        }
    });
};


function verify(result) {
        base.find(constUtil.ScoreModel(), {}, function (valuesResult) {
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

//