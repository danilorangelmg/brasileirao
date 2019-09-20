/**
 * Created by danilorangel on 27/02/17.
 */
var base = require('../controller/baseController.js');
var constUtil = require('../const.js');

var OfferModel = base.getDbModel(constUtil.OfferModel());

exports.getOffers = function(req, res) {
    this.getActiveOffers(function (results) {
        res.json(results);
    });
};

exports.getAdditionalOffers = function (req, res) {
    base.find(constUtil.OfferModel(), {isAdditional:true}, function (results) {
        res.json(results);
    });
};

exports.newOffer = function (req, res) {
    var ret = validadeParamsNewOffer(req);
    var jsonRet = new Object();
    if (ret != true) {
        jsonRet.status = "error";
        jsonRet.message = ret;
        res.json(jsonRet);
    } else {
        saveOffer(req.body, res)
    }
};

exports.getOfferById = function (id, callback) {
    base.find(constUtil.OfferModel(), {offerId:id}, function (results) {
        callback(results);
    });
};

exports.getServiceOfferById = function (id, req, res) {
    if (!id) {
        var jsonRet = new Object();
        jsonRet.status = "error";
        jsonRet.message = "missing offerId";
        res.json(jsonRet);
    } else {
        this.getOfferById(id, function (results) {
            res.json(results);
        });
    }
};

exports.getActiveOffers = function(callBack) {
    base.find(constUtil.OfferModel(), {isAdditional:false}, function (results) {
        callBack(results)
    });
};

exports.getMovieValue = function(req, res) {
    var result = new Object();
    result.value = 0.5;
    res.json(result);
};

exports.getOfferByUser = function(req, res, id) {

    // var params = [{
    //     $match : {
    //         userId: userId
    //     }
    // }, {
    //     $lookup : {
    //         from : "users",
    //         localField : "userId",
    //         foreignField : "id",
    //         as : "user"
    //     }
    // }];

    base.findOrderBy(constUtil.RecorrenceCountModel(), {userId:id}, {rentDate:'desc'}, function (rents) {
        base.findOrderBy(constUtil.UserBuyModel(), {userId:id, isAtive:true}, {offerId:'asc'}, function (buys) {

            if (!buys[0] || buys.length <= 0) {
                res.status(500).send(base.errorMessage("error", "username don't has offers"));
                return;
            }

            var array = new Array(buys.length);
            for (var i = 0; i < buys.length; i++) {
                array[i] = parseInt(buys[i].offerId);
            }

            base.findOrderBy(constUtil.OfferModel(), {offerId:{$in: array}, isAdditional:false},{rentDate:'desc'}, function (offer) {
                var date = new Date();
                var mounthYear = (date.getUTCMonth() + 1) + "/" + date.getUTCFullYear();

                var result = new Object();

                result.offerId = offer[0].offerId;
                result.movieCount = offer[0].movieCount;
                result.maxMovie = rents[0].maxMovie;

                result.movieValue = offer[0].price / offer[0].movieCount;
                result.price = offer[0].price;
                result.countMovies = rents[0].movieCount;

                res.json(result);
            });
        });
    });
}

function validadeParamsNewOffer(req) {
    var ret = "missing a parameter";
    var isValid = true;
    if (!req.body.description) {
        req.body.description = "Sem descrição";
    }

    if (!req.body.price) {
        ret = ret + " price,";
        isValid = false;
    }

    if (!req.body.movieCount) {
        ret = ret + " movieCount,";
        isValid = false;
    }

    if (!isValid) {
        ret = ret.substr(0, ret.length-1);
        return ret;
    }

    return true;
};

function saveOffer(param, res) {

    var searchParam = new Object();
    searchParam.price = param.price;
    searchParam.movieCount = param.movieCount;
    base.find(constUtil.OfferModel(), searchParam, function (offer) {
        if (offer[0]) {
            ret(offer[0].offerId);
        } else {
            save(param);
        }
    });

    function save(param) {
        base.getNextId(constUtil.OfferModel(), {}, function (result) {
            param.offerId = result;
            if (!param.isAdditional) {
                param.isAdditional = false;
            }

            var offer = new OfferModel(param);
            base.save(offer, function (err) {
                if (!err) {
                    ret(result);
                } else {
                    base.errorMessage("error", "couldn't save offer")
                    res.status(500).send(base.errorMessage("error", "couldn't save offer"));
                }
            });
        });
    };

    function ret(id) {
        var ret = new Object();
        ret.offerId = id;
        res.json(ret);
    }

};