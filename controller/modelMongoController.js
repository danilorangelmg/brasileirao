/**
 * Created by danilorangel on 27/04/17.
 */

var constUtil = require('../const.js');
var base = require('../controller/baseController.js');

var UserModel = base.createModel(constUtil.UserModel(), {
    id: Number,
    name: String,
    email: String,
    username: String,
    password: Number
});

var OfferModel = base.createModel(constUtil.OfferModel(), {
    offerId : Number,
    description : String,
    price : Number,
    movieCount : Number,
    isAdditional : Boolean
});

var HomeMovieModel = base.createModel(constUtil.HomeMovieModel(), {
    result : String,
    date : Date
});

var UserBuyModel = base.createModel(constUtil.UserBuyModel(), {
    buyId        : Number,
    offerId      : Number,
    userId       : Number,
    isAtive      : Boolean,
    dateOfCancel : Date,
    dateOfBuy    : Date,
    isMainBuy    : Boolean
});

var RecorrenceCountModel = base.createModel(constUtil.RecorrenceCountModel(), {
    recorrenceId :  Number,
    userId       :  Number,
    movieCount   :  Number,
    mounthYear   :  String,
    maxMovie     :  Number
});

var RentModel = base.createModel(constUtil.RentModel(), {
    rentId   : Number,
    userId   : Number,
    movieId  : Number,
    rentDate : Date,
    movie : JSON
});