"use strict";

const bcrypt      = require("bcrypt");

const Thread      = require("../models/thread");
const errorTypes  = require("./error_types");
const mongoose    = require("mongoose");

const controller  = {
    /**
     *
     * @api {post} /api/threads/:board Create a new thread
     * @apiName newThread
     * @apiGroup Thread
     *
     *
     * @apiParam  (QUERY) {String} board board to publish the thread
     * @apiParam  (BODY) {String} text content of the thread
     * @apiParam  (BODY) {String} delete_password password to delete the thread, in plaintext
     *
     * @apiSuccess (302) {html} name redirection to thread view
     *
     * @apiParamExample  {json} Request-Example:
     * {
     *     board: "general",
     *     text: "message of example",
     *     delete_password: "12345"
     * }
     *
     * @apiError Error400 Text, board and delete are required
     */
    newThread: (req,res,next) => {
        if(!req.body.delete_password || !req.body.text)
            throw new errorTypes.Error400("text, board and delete_password are required");
        let password_hash = bcrypt.hashSync(req.body.delete_password, parseInt(process.env.BCRYPT_ROUNDS));
        let thread = new Thread({
            text: req.body.text,
            delete_password: password_hash,
            created_on: new Date(),
            bumped_on: new Date(),
            reported: false,
            replies: [],
            board: req.params.board
        });
        thread.save()
            .then(()=>res.redirect("/b/" + req.params.board + "/"))
            .catch((err)=>next(err));
    },


    getLastThread: (req,res,next) =>{
        if(!req.params.board)
            throw new errorTypes.Error400("board is required");
        Thread.find({board: req.params.board})
            .sort("-bumped_on")
            .limit(10)
            .select("-delete_password -replies.delete_password")
            .exec()
            .then( data => {
                let result = data.map(e=>{
                    let replycount = e.replies.length;
                    return {
                        _id: e._id,
                        text: e.text,
                        created_on: e.created_on,
                        bumped_on: e.bumped_on,
                        board: e.board,
                        reported: e.reported,
                        replies: e.replies = e.replies.sort((a,b)=>{
                            if(a.created_on<=b.created_on) return 1;
                            else return -1;
                        }).slice(0,3),
                        replycount: replycount
                    };
                });
                res.json(result);
            })
            .catch(err=>next(new errorTypes.Error500(err.message)));
    },

    getThread: (req,res,next)=>{
        if(!req.query.thread_id)
            return next(new errorTypes.Error400("Bad Request"));
        else if(!mongoose.Types.ObjectId.isValid(req.query.thread_id))
            throw new errorTypes.Error400("thread_id is not valid.");
        Thread.findById(req.query.thread_id)
            .select("-delete_password -replies.delete_password")
            .exec()
            .then( data => {
                if(!data)
                    throw errorTypes.Error404("thread not found");
                let replycount = data.replies.length;
                let result =  {
                    _id: data._id,
                    text: data.text,
                    created_on: data.created_on,
                    bumped_on: data.bumped_on,
                    board: data.board,
                    reported: data.reported,
                    replies: data.replies = data.replies.sort((a,b)=>{
                        if(a.created_on<=b.created_on) return 1;
                        else return -1;
                    }),
                    replycount: replycount
                };
                res.json(result);
            })
            .catch(err=>next(err));
    },

    deleteThread: (req,res,next)=>{
        if(!req.body.thread_id || !req.body.delete_password)
            throw new errorTypes.Error400("thread_id and delete_password are required.");
        else if(!mongoose.Types.ObjectId.isValid(req.body.thread_id))
            throw new errorTypes.Error400("thread_id is not valid.");
        Thread.findById(req.body.thread_id)
            .then(data=>{
                if(!data)
                    throw new errorTypes.Error404("thread not found");
                if(bcrypt.compareSync(req.body.delete_password, data.delete_password))
                    return data;
                else
                    throw new errorTypes.Error401("incorrect password");
            })
            .then(data=>{
                return Thread.deleteOne({_id:data._id});
            })
            .then(()=>{
                res.json("success");
            })
            .catch(err=>next(err));
    },

    reportThread: (req,res,next)=>{
        if(!req.body.thread_id || !req.params.board)
            throw new errorTypes.Error400("thread_id and board are required.");
        else if(!mongoose.Types.ObjectId.isValid(req.body.thread_id))
            throw new errorTypes.Error400("thread_id is not valid.");
        Thread.findByIdAndUpdate({_id: req.body.thread_id, board: req.params.board},
            {
                $set: {reported: true}
            })
            .then(()=>{
                res.json("success");
            })
            .catch(err=>next(err));
    }

};


module.exports = controller;