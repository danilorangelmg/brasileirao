// var db_string = 'localhost:27017/data/db/TCC';

var db_string = 'localhost:27017/data/db/TCC';

var mongoose = require('mongoose').connect(db_string);
console.log("connected mongodb on localhost:27017")

var db = mongoose.connection;

exports.createModel = function (name, configuration) {
    return mongoose.model(name, configuration);
}

exports.getModel = function (name) {
    return mongoose.model(name);
}

//crud function
exports.save = function (obj, callback) {
    obj.save(function (err, dbObj) {
        if (err) {
            callback(err);
            console.log(err);
        } else {
            callback();
            console.log('saved successfully:', obj);
        }
    });
}

exports.find = function(model, params, callback) {
    model.find(params).exec(callback);
}

exports.findOrderBy = function(model, params, sort, callback) {
    model.find(params).sort(sort).exec(callback);
};

exports.findProjection = function(model, params, projection, callback) {
    model.find(params).select(projection).exec(callback);
};

exports.findJoin = function(model, params, callback) {
    // model.aggregate([{$lookup:lookup}]).exec(callback);
    model.aggregate(params).exec(callback);
};

exports.createLookup = function(from, localField, foreignField, as) {
    return {$lookup:{from:from, localField: localField, foreignField:foreignField, as: as}};
};

exports.createMatch = function(params) {
    return {$match:params};
};

// var query = dbSchemas.SomeValue.find({}).select({ "name": 1, "_id": 0});
// exports.count = function (model, params, callback) {
//     model.find()count(params,callback);
// }







