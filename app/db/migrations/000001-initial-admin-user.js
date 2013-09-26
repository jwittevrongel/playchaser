"use strict";

var Player = require ('../../models/Player'),
    config = require ('../../lib/config');

exports.up = function(mongoose, next) {
    var adminPassword = config.initialSetup.adminPassword;
    if (!adminPassword) {
        next('*** Error: initialSetup.adminPassword was not set in site.json');
        return;
    }
    
    var theFirstAdministrator = new Player({
        idp: "this",
        idpUsername: "Administrator",
        username: "Administrator",
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
    Player.remove({ idp: 'this', idpUsername: 'Administrator' }, function(err) {
        next(err);
    });
};
