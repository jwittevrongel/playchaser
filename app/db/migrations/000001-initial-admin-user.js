"use strict"

var Player = require ('../../models/Player'),
    config = require ('../../lib/config/config');

exports.up = function(mongoose, next) {
    var adminPassword = config.initialSetup.adminPassword;
    if (!adminPassword) {
        var errorMessage = '*** Error: initialSetup.adminPassword was not set in site.json';
        next(errorMessage);
        return;
    }

    var theFirstAdministrator = new Player({
        idp: "this",
        idpUserId: "Administrator",
        thisPasswd: adminPassword,
        profile: {
            realName: "PlayChaser Administrator"
        }
    });
    theFirstAdministrator.save();
    next();
}

exports.down = function(mongoose, next) {
    next();
}
