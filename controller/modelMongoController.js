/**
 * Created by danilorangel on 27/04/17.
 */

var constUtil = require('../const.js');
var base = require('../controller/baseController.js');

var ScoreModel = base.createModel(constUtil.ScoreModel(), {
    result : String,
    date : Date
});

var DescriptionModel = base.createModel(constUtil.DescriptionModel(), {
    gameId: String,
    url : String,
    date : Date
});

var DescriptionModelCache = base.createModel(constUtil.DescriptionModelCache(), {
    gameId: String,
    result : String,
    date : Date
});