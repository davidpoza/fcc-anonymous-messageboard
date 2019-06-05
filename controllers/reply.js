"use strict";

const bcrypt      = require("bcrypt");

const Thread      = require("../models/thread");
const Reply       = require("../models/reply");
const errorTypes  = require("./error_types");
const mongoose    = require("mongoose");

const controller  = {
    newReply: (req,res,next) => {
        if(!req.body.delete_password || !req.body.text || !req.body.thread_id)
            throw new errorTypes.Error400("thread_id, text and delete_password are required");
        else if(!mongoose.Types.ObjectId.isValid(req.body.thread_id))
            throw new errorTypes.Error400("thread_id is not valid.");
        let password_hash = bcrypt.hashSync(req.body.delete_password, parseInt(process.env.BCRYPT_ROUNDS));
        let reply = new Reply({
            text: req.body.text,
            delete_password: password_hash,
            created_on: new Date(),
            reported: false
        });

        Thread.findOneAndUpdate({_id: req.body.thread_id},
            {
                $set:{
                    bumped_on: new Date()
                },
                $push:{
                    replies: reply
                }
            }
        )
            .then((thread)=>res.redirect("/b/" + thread.board + "/" + thread._id))
            .catch(()=>next(new errorTypes.Error400("Bad request")));
    },
    deleteReply: (req,res,next) => {
        if(!req.body.delete_password || !req.body.reply_id || !req.body.thread_id)
            throw new errorTypes.Error400("thread_id, reply_id and delete_password are required");
        else if(!mongoose.Types.ObjectId.isValid(req.body.thread_id))
            throw new errorTypes.Error400("thread_id is not valid.");
        else if(!mongoose.Types.ObjectId.isValid(req.body.reply_id))
            throw new errorTypes.Error400("reply_id is not valid.");
        Thread.findById(req.body.thread_id)
            .then(data=>{
                if(!data)
                    throw new errorTypes.Error404("thread not found");
                else
                    return data;
            })
            .then((data)=>{
                let reply = data.replies.id(req.body.reply_id); //podemos buscar el subdocumento por id porque hemos declarado el Schema del array
                if(reply == null)
                    throw new errorTypes.Error404("reply not found");
                if(bcrypt.compareSync(req.body.delete_password, reply.delete_password))
                {
                    reply.text = "[deleted]"; //modificamos el subdocumento
                    return data.save(); //salvamos el documento
                }
                else
                    throw new errorTypes.Error401("incorrect password");
            })
            .then(()=>{
                res.json("success");
            })
            .catch(err=>next(err));
    },
    reportReply: (req,res,next)=>{
        if(!req.body.thread_id || !req.body.reply_id || !req.params.board)
            throw new errorTypes.Error400("thread_id, reply_id and board are required.");
        else if(!mongoose.Types.ObjectId.isValid(req.body.thread_id))
            throw new errorTypes.Error400("thread_id is not valid.");
        else if(!mongoose.Types.ObjectId.isValid(req.body.reply_id))
            throw new errorTypes.Error400("reply_id is not valid.");
        Thread.findByIdAndUpdate({_id: req.body.thread_id, board: req.params.board},
            {
                $set: {"replies.$[reply].reported": true}
            },
            {
                arrayFilters: [ { "reply._id": req.body.reply_id } ]
            })
            .then(()=>{
                res.json("success");
            })
            .catch(err=>next(err));
    }

};


module.exports = controller;