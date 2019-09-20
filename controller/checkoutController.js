/**
 * Created by danilorangel on 26/02/17.
 */
var base = require('../controller/baseController.js');
var offer = require('../controller/offerController.js');
var movies = require('../controller/movieController.js');
var constUtil = require('../const.js');

var UserBuyModel = base.getDbModel(constUtil.UserBuyModel());

var RecorrenceCountModel = base.getDbModel(constUtil.RecorrenceCountModel());

var RentModel = base.getDbModel(constUtil.RentModel());

exports.buy = function (req, res) {
    var ret = validadeBuy(req.body);
    var jsonRet = new Object();
    if (ret != true) {
        jsonRet.status = "error";
        jsonRet.message = ret;
        res.json(jsonRet);
    } else {
        doBuy(req.body, res)
    }
}

exports.cancel = function (req, res) {
    if (!req.body.userId) {
        res.json({"status":"error", ",message":"missing userId"});
    }
    doCancelBuy(req.body.userId, res);
}

exports.rentMovie = function(req, res) {
    var ret = validadeRent(req.body);
    var jsonRet = new Object();
    if (ret != true) {
        jsonRet.status = "error";
        jsonRet.message = ret;
        res.json(jsonRet);
    } else {
        doRent(req.body.userId, req.body.movieId, res);
    }
};

exports.getRentByUser = function(idUser, res) {
    base.find(constUtil.RentModel(), {userId:idUser}, function (result) {
        res.json(result);
    });
};

exports.changeOffer = function (req, res) {
    var ret = validadeBuy(req.body);
    var jsonRet = new Object();
    if (ret != true) {
        jsonRet.status = "error";
        jsonRet.message = ret;
        res.json(jsonRet);
    } else {
        doChangeOffer(req.body, res)
    }
}

exports.getRecorrences = function (userId, res) {
    var params = [{
        $match : {
            userId: userId
        }
    }, {
        $lookup : {
            from : "users",
            localField : "userId",
            foreignField : "id",
            as : "user"
        }
    }];

    base.findJoin(constUtil.RecorrenceCountModel(), params, function (err, results) {
        res.json(results);
    });
};


function validadeBuy(param) {
    var ret = "missing a parameter";
    var isValid = true;
    if (!param.offerId) {
        ret = ret + " offerId,";
        isValid = false;
    }

    if (!param.userId) {
        ret = ret + " userId,";
        isValid = false;
    }

    if (!isValid) {
        ret = ret.substr(0, ret.length-1);
        return ret;
    }

    return true;
};

function validadeRent(param) {
    var ret = "missing a parameter";
    var isValid = true;
    if (!param.movieId) {
        ret = ret + " movieId,";
        isValid = false;
    }

    if (!param.userId) {
        ret = ret + " userId,";
        isValid = false;
    }

    if (!isValid) {
        ret = ret.substr(0, ret.length-1);
        return ret;
    }

    return true;
}

function doBuy(param, res) {
    //validar questoes de pagamento
    offer.getOfferById(param.offerId, function (result) {
        if (!result) {
            res.json({"state":"error", "message":"is not possible buy because offer don't exists"})
            return;
        }
        if(result.isAdditional) {
            getUserBuy(param.userId, function (buy) {
                if (!buy.isAtive) {
                    res.json({"state":"error", "message":"is not possible buy because you has canceled the offer"})
                    return;
                }
            });
        }

        base.getNextId(constUtil.UserBuyModel(), {}, function (resultCount) {
            var buy = new Object();
            buy.buyId = resultCount;
            buy.offerId = param.offerId;
            buy.userId = param.userId;
            buy.isAtive = true;
            buy.dateOfBuy = new Date();
            var buyModel = new UserBuyModel(buy);
            base.save(buyModel, function(err) {
                var jsonRet = new Object();
                if (!err) {
                    saveRecorrence(buy.userId, result[0], res);
                } else {
                    jsonRet.status = "error";
                    jsonRet.message = "Error to buy"; //colocar uma mensagem melhor
                    res.json(jsonRet);
                }
            });
        });
    });
}

function doRent(userId, movieId, res) {
    verifyRentIsPossible(userId, movieId, res, function (recorrence) {
        recorrence.movieCount = recorrence.movieCount+1;
        base.save(recorrence, function (err) {
            if (err) {
                res.json({"status":"error", "message":"error processing..."});
            } else {
                saveRent(userId, movieId, res, function () {
                    res.json({"status":"success"});
                });
            }
        });
    });
}

function verifyRentIsPossible(userId, movieId, res, callback) {
    var date = new Date();
    var mounthYear = (date.getUTCMonth() + 1) + "/" + date.getUTCFullYear();
    getRecorrence(userId, mounthYear, function (result) {
        if (!result) {
            res.json({"status":"error", "message":"Rent is not possible because you don't buy"});
        }
        if (result.movieCount == result.maxMovie) {
            res.status(500).send(base.errorMessage("error", "Rent is not possible because you reached the limit"));
        } else {
            verifyRent(movieId, userId, res, function () {
                callback(result);
            });
        }
    });
};

function getRecorrence(userId, mounthYear, callback) {
    base.find(constUtil.RecorrenceCountModel(), {userId:userId, mounthYear:mounthYear}, function (result) {
        callback(result[0]);
    });
};

function getBuy(userId, offerId, callback) {
    base.find(constUtil.UserBuyModel(), {userId:userId, isMainBuy:true}, function (result) {
        callback(result[0]);
    });
};


function verifyRent(movieId, userId, res, callback) {
    base.count(constUtil.RentModel(), {movieId:movieId, userId:userId}, function (result) {
        if (result > 0) {
            res.json({"status":"error", "message":"Rent is not possible because the movie was selected before"});
        } else {
            callback();
        }
    });
};

function saveRent(userId, movieId, res, callback) {

    base.getNextId(constUtil.RentModel(), {}, function (result) {
        movies.getDetail(movieId, function (movies) {
            var rent = new Object();
            rent.userId = userId;
            rent.movieId = movieId;
            rent.rentId = result;
            rent.rentDate = new Date();
            rent.movie = movies;
            var rentModel = new RentModel(rent);
            base.save(rentModel, function (err) {
                if (err) {
                    res.json({"status":"error", "message":"error processing..."});
                } else {
                    callback();
                }
            });
        });
    });
};

function saveRecorrence(userId, offer, res) {

    var date = new Date();
    var mounthYear = (date.getUTCMonth() + 1) + "/" + date.getUTCFullYear();

    verifyUpdateRecorrence(userId, mounthYear, function (result) {
        if (!result) {
            save();
        } else {
            result.maxMovie = result.maxMovie + offer.movieCount;
            var recorrenceModel = new RecorrenceCountModel(result);
            base.save(recorrenceModel, function (err) {
                resultJson(err, res);
            });
        }
    });

    function save() {
        base.getNextId(constUtil.RecorrenceCountModel(), {}, function (result) {
            var recorrence = new Object();
            recorrence.recorrenceId = result;
            recorrence.userId = userId;
            recorrence.movieCount = 0;

            recorrence.mounthYear = mounthYear;
            recorrence.maxMovie = offer.movieCount;
            var recorrenceModel = new RecorrenceCountModel(recorrence);
            base.save(recorrenceModel, function (err) {
                resultJson(err, res);
            });
        });
    }
}

function verifyUpdateRecorrence(userId, monthYear, callback) {
    getRecorrence(userId, monthYear, function (result) {
        callback(result)
    });
}

function doCancelBuy(userId, res) {
    getUserBuy(userId, function (buy) {
        buy.isAtive = false;
        buy.dateOfCancel = new Date();
        var userBuyModel = new UserBuyModel(buy);
        base.save(userBuyModel, function (err) {
            if (res) {
                resultJson(err, res)
            }
        });
    });
}

function getUserBuy(userId, callback) {
    offer.getActiveOffers(function (results) {
        // param.userId = userId;
        var ids = [results.length];
        for (var i=0; i < results.length; i++) {
            ids[i]=results[i].offerId;
        }

        base.find(constUtil.UserBuyModel(), {userId:userId, offerId:{$in:ids}, isAtive:true}, function(buys) {
            callback(buys[0]);
        });
    });
}

function doChangeOffer(params, res) {
    getUserBuy(params.userId, function (buy) {
        offer.getOfferById(buy.offerId, function (offer) {
            var date = new Date();
            var mounthYear = (date.getUTCMonth() + 1) + "/" + date.getUTCFullYear();
            getRecorrence(params.userId, mounthYear, function (recorrence) {
                doCancelBuy(params.userId);
                recorrence.maxMovie = recorrence.maxMovie - offer[0].movieCount;
                var model = new RecorrenceCountModel(recorrence);
                base.save(model, function (err) {
                    if (!err) {
                        doBuy(params, res);
                    }
                });
            });
        });
    });
}

exports.getUserBuyList =  function(userId, res) {

    base.find(constUtil.UserBuyModel(), {userId:userId}, function (resp) {
        //deu algum problema no $lookup, teve que buscar a oferta na mao
        var buys = [];
        buys = getOffer(0, resp, buys, res)
    });
}

function getOffer(index, resp, buys, res) {
    if (index > resp.length-1) {
        res.json(buys);
    }

    offer.getOfferById(resp[index].offerId, function (result) {
        buys[index] = new Object();
        buys[index].dateOfBuy = resp[index].dateOfBuy;
        buys[index].isAtive = resp[index].isAtive;
        buys[index].price = result[0].price;
        buys[index].isAdditional = result[0].isAdditional;
        index++;
        getOffer(index, resp, buys, res);
    });
}

function resultJson(err, res) {
    var jsonRet = new Object();
    if (!err) {
        jsonRet.status = "success";
    } else {
        jsonRet.status = "success";
        jsonRet.message = "sucess";
    }

    res.json(jsonRet);
}
