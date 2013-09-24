"use strict";

var Player = require ('../../models/Player'),
    config = require ('../../lib/config/config');

exports.up = function(mongoose, next) {
    var adminPassword = config.initialSetup.adminPassword;
    if (!adminPassword) {
        next('*** Error: initialSetup.adminPassword was not set in site.json');
        return;
    }
    
    var theFirstAdministrator = new Player({
        idp: "this",
        _id: "Administrator",
        passwd: adminPassword,
        profile: {
            realName: "PlayChaser Administrator"
        }
    });

    theFirstAdministrator.save(function (err) {
        next(err);
    });
};

exports.down = function(mongoose, next) {
    Player.remove({ _id: "Administrator" }, function(err) {
        next(err);
    });
};
