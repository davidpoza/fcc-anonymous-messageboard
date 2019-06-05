"use strict";

const ThreadController = require("../controllers/thread");
const ReplyController  = require("../controllers/reply");

module.exports = function (app) {
  
    app.route("/api/threads/:board")
        .post(ThreadController.newThread)
        .get(ThreadController.getLastThread)
        .delete(ThreadController.deleteThread)
        .put(ThreadController.reportThread);
  
    app.route("/api/replies/:board")
        .post(ReplyController.newReply)
        .get(ThreadController.getThread)
        .delete(ReplyController.deleteReply)
        .put(ReplyController.reportReply);
 

};