/**
 * Created by danilorangel on 26/02/17.
 */

var db = require('../db_config.js');
var request = require("request");


exports.getCall = function (service, callback) {
    request.get(service,
        function (err, response, body) {
            if (!err) {
                var resultsObj = JSON.parse(body);
                callback(resultsObj);
            }
        });
};

exports.postCall = function (service, payload, callback) {
    request.post(service, payload,
        function (error, response, body) {
            if (!error) {
                var resultsObj = JSON.parse(body);
                callback(resultsObj);
            }
        }
    );
};

exports.save = function (obj, callback) {
    db.save(obj, callback);
}

exports.createModel = function (name, configuration) {
    return createModelfn(name, configuration);
}

exports.find = function (model, params, callback) {
    db.find(db.getModel(model), params, function (err, results) {
       if (!err) {
           callback(results);
       } else {
           callback(err)
       }
    });
}

exports.findOrderBy = function (model, params, sort, callback) {
    db.findOrderBy(db.getModel(model), params, sort, function (err, results) {
        if (!err) {
            callback(results);
        } else {
            callback(err)
        }
    });
}

exports.findProjection = function (model, params, projection, callback) {
    db.findProjection(db.getModel(model), params, projection, function (err, results) {
        if (!err) {
            callback(results);
        } else {
            callback(err)
        }
    });
}

exports.count = function (model, params, callback) {
    count(model, params, callback)
};

exports.getNextId = function (model, params, callback) {
    count(model, params, function (result) {
        var res = result + 1;
        callback(res);
    });
};

exports.findJoin = function (model, params, callback) {
    db.findJoin(db.getModel(model), params, callback);
};

exports.errorMessage = function (status, message) {
    var ret = new Object();
    ret.status = status;
    ret.message = message;
    return ret;
}

exports.getDbModel = function(name) {
    return db.getModel(name);
};

function createModelfn(name, configuration) {
    return db.createModel(name, configuration);
}

function count(model, params, callback) {
    db.find(db.getModel(model), params, function (err, results) {
        if (!err) {
            callback(results.length);
        } else {
            callback(0);
        }
    });
}

function drop(model, callback) {
    db.drop(model, callback())
}

