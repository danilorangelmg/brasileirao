/**
 * Created by danilorangel on 27/02/17.
 */

var base = require('../controller/baseController.js');
var constUtil = require('../const.js');

var UserModel = base.createModel(constUtil.UserModel());

exports.doLogin = function (req, res) {
    res.contentType('application/json');
    res.setHeader('sessionID', 'testesteste');
    if (!req.body.username || !req.body.password) {
        res.json(({"status": "error", "message": "missing a parameter"}));
    } else {
       console.log("call validade");
       validadeLogin(req, res);
    }
};

function validadeLogin(req, res) {
    base.count(constUtil.UserModel(), req.body, function(result) {
      if (result == 0) {
          // res.json({status: "error", message:"username or password is invalid"});
          var request = new Object();
          request.username = req.body.username;
          base.count(constUtil.UserModel(), request, function (result) {
              if (result == 0) {
                   res.status(500).send(errorMessage("error", "username or password is invalid"));
              } else {
                  res.status(500).send(errorMessage("error", "username or password is not match"));
              }
          });

      } else {
          base.find(constUtil.UserModel(), req.body, function (result) {
              var ret = new Object();
              ret.userId = result[0].id;
              res.json(ret);
          });

      }
  });
};

exports.doLogout = function (req, res) {
    res.json({status: "success"});
};

exports.newUser = function (req, res) {
    base.getNextId(constUtil.UserModel(),{}, function (result) {
        res.contentType('application/json');
        if (!req.body.name || !req.body.username || !req.body.email || !req.body.password) {
            res.json(({"status": "error", "message": "missing a parameter"}));
        } else {
            req.body.id = result;
            var user = new UserModel(req.body);
            base.save(user, function (err) {
                if (!err) {
                    res.json({status: "success"});
                } else {
                    res.json({status: "error"});
                }
            });
        }
    });
};

exports.getUserInformation = function (req, res) {
    if (!req.body.username) {
        res.json(({"status": "error", "message": "missing a parameter"}));
    } else {
        base.find(constUtil.UserModel(), req.body, function (results) {
           res.json(results);
        });
    }
}

function errorMessage(status, message) {
    var ret = new Object();
    ret.status = status;
    ret.message = message;
    return ret;
}

