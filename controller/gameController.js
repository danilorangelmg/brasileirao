var constUtil = require('../const.js');
var base = require('../controller/baseController.js');
var DescriptionModelCache = base.getDbModel(constUtil.DescriptionModelCache());

exports.getGames = function(req, res, id) {
    let gameId = id
    base.find(constUtil.DescriptionModelCache(), {"gameId":id}, function (valuesResult) {

        if (valuesResult && valuesResult.length > 0) {
            var values = valuesResult[0];
            res.json(JSON.parse(values.result))
        } else {
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

                    var values = new Object();
                    values.gameId = gameId
                    values.result = JSON.stringify(json);
                    values.date = new Date();
                    var model = new DescriptionModelCache(values);
                    save(model);
                    res.json(json)
                })
            });
        }
    });
    return;
}

function save(model) {
    model.save(function (err, dbObj) {
        if (err) {
            console.log(err);
        } else {
            console.log('saved successfully: '+new Date());
        }
    });
}