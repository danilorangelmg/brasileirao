/**
 * Created by danilorangel on 27/04/17.
 */

var constUtil = require('../const.js');
var base = require('../controller/baseController.js');

var ScoreModel = base.createModel(constUtil.ScoreModel(), {
    result : String,
    date : Date
});

