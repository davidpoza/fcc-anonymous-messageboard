"use strict";

var mongoose    = require("mongoose");
var Schema      = mongoose.Schema;

var ReplySchema = Schema({
    text: {type: String, required: true},
    created_on: Date,
    reported: Boolean,
    delete_password: {type: String, required: true},
});

module.exports = mongoose.model("Reply", ReplySchema, "replies");
module.exports.ReplySchema = ReplySchema;