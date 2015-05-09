"use strict";

var config = require('../../config');

exports.schema = 'player';

exports.up = function(db) {
    var adminPassword = config.initialSetup.adminPassword;
    if (!adminPassword) {
        throw '*** Error: initialSetup.adminPassword was not set in site.json';
    }
    
    return db.collection('players').updateOneAsync({ 
        idp: "this", 
        idpUsername: "administrator@playchaser.com" 
    }, {
        idp: "this", 
        idpUsername: "administrator@playchaser.com",
        passwd: adminPassword,
    }, { upsert: true });
};

exports.down = function(db) {
    return db.collection('players').deleteOneAsync({ idp: 'this', idpUsername: 'administrator@playchaser.com' });
};
