"use strict";

var mongoose       = require("mongoose");
var Schema         = mongoose.Schema;
const ReplySchema  = require("./reply").ReplySchema;

var ThreadSchema = Schema({
    text: {type: String, required: true},
    created_on: Date,
    bumped_on: Date,
    reported: Boolean,
    delete_password: {type: String, required: true},
    replies: [ReplySchema], //para disponer de métodos de búsqueda en el array, por ejemplo
    board: {type: String, required: true}
});

module.exports = mongoose.model("Thread", ThreadSchema, "threads");