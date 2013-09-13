"use strict";

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var MigrationSchema = new Schema({
    _id: { type: String },
    applied: { type: Date }
});

module.exports = mongoose.model("Migration", MigrationSchema);