/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       (if additional are added, keep them at the very end!)
*/
const mongoose = require("mongoose");
const chaiHttp = require("chai-http");
const chai     = require("chai");
const assert   = chai.assert;
const expect   = chai.expect;

const server = require("../index");
const Reply  = require("../models/reply");
const Thread = require("../models/thread");

chai.use(chaiHttp);

function mySetup(done){
    let threads = [
        new Thread({
            _id: mongoose.Types.ObjectId("5ced52cc1db7ac25495b8aec"),
            text: "respuesta de prueba",
            delete_password: "$2b$12$hLE640pKaq0GMa0RcJM.NOGKftj2PPV0w7Pg0UW3TICDerA02DPVm", //12345
            created_on: new Date(),
            bumped_on: new Date(),
            reported: false,
            replies: [
                new Reply({
                    _id: mongoose.Types.ObjectId("4ced52cc1db7ac25495b8aed"),
                    text: "respuesta de prueba",
                    created_on: new Date(),
                    reported: false,
                    delete_password: "$2b$12$hLE640pKaq0GMa0RcJM.NOGKftj2PPV0w7Pg0UW3TICDerA02DPVm", //12345
                }),
                new Reply({
                    _id: mongoose.Types.ObjectId("5cf557407131bc2e9857788b"),
                    text: "respuesta de prueba 2",
                    created_on: new Date(),
                    reported: false,
                    delete_password: "$2b$12$hLE640pKaq0GMa0RcJM.NOGKftj2PPV0w7Pg0UW3TICDerA02DPVm", //12345
                }),
                new Reply({
                    text: "respuesta de prueba 3",
                    created_on: new Date(),
                    reported: false,
                    delete_password: "$2b$12$hLE640pKaq0GMa0RcJM.NOGKftj2PPV0w7Pg0UW3TICDerA02DPVm", //12345
                })
            ],
            board: "testing"
        }),
        new Thread({
            _id: mongoose.Types.ObjectId("5ced52cc1db7ac25495b8aed"),
            text: "respuesta de prueba2",
            delete_password: "$2b$12$hLE640pKaq0GMa0RcJM.NOGKftj2PPV0w7Pg0UW3TICDerA02DPVm", //12345
            created_on: new Date(),
            bumped_on: new Date(),
            reported: false,
            replies: [
                new Reply({
                    text: "respuesta de prueba 4",
                    created_on: new Date(),
                    reported: false,
                    delete_password: "$2b$12$hLE640pKaq0GMa0RcJM.NOGKftj2PPV0w7Pg0UW3TICDerA02DPVm", //12345
                }),
                new Reply({
                    text: "respuesta de prueba 5",
                    created_on: new Date(),
                    reported: false,
                    delete_password: "$2b$12$hLE640pKaq0GMa0RcJM.NOGKftj2PPV0w7Pg0UW3TICDerA02DPVm", //12345
                }),
            ],
            board: "testing"
        }),
        new Thread({
            _id: mongoose.Types.ObjectId("5ced52cc1db7ac25495b8aee"),
            text: "respuesta de prueba3",
            delete_password: "$2b$12$hLE640pKaq0GMa0RcJM.NOGKftj2PPV0w7Pg0UW3TICDerA02DPVm", //12345
            created_on: new Date(),
            bumped_on: new Date(),
            reported: false,
            replies: [],
            board: "testing"
        }),
        new Thread({
            _id: mongoose.Types.ObjectId("5ced52cc1db7ac25495b8aef"),
            text: "respuesta de prueba4",
            delete_password: "$2b$12$hLE640pKaq0GMa0RcJM.NOGKftj2PPV0w7Pg0UW3TICDerA02DPVm", //12345
            created_on: new Date(),
            bumped_on: new Date(),
            reported: false,
            replies: [],
            board: "testing2"
        }),
    ];
    Thread.insertMany(threads)
        .then(()=>done())
        .catch((err)=>done(err));

}

function myTeardown(done){
    Thread.deleteMany({_id: { $in: ["5ced52cc1db7ac25495b8aec", "5ced52cc1db7ac25495b8aed", "5ced52cc1db7ac25495b8aee", "5ced52cc1db7ac25495b8aef"]}})
        .then(()=>done())
        .catch(err=>done(err));
}

suite("Functional Tests", function() {

    suite("API ROUTING FOR /api/threads/:board", function() {

        suite("POST", function() {
            test("test correct thread creation",function(done){
                chai.request(server)
                    .post("/api/threads/general")
                    .type("form")
                    .send({text: "thread de prueba", delete_password:"12345"})
                    .then(res=>{
                        expect(res).to.redirect;
                        expect(res).to.redirectTo(/\/b\/general\/$/);
                        assert.equal(res.status, 200, "must return 200");
                        done();
                    })
                    .catch(err=>done(err));
            });

            test("test thread creation without text",function(done){
                chai.request(server)
                    .post("/api/threads/general")
                    .type("form")
                    .send({delete_password:"12345"})
                    .then(res=>{
                        assert.equal(res.status, 400, "must return 400");
                        assert.equal(res.body.error, "text, board and delete_password are required", "must return required params message");
                        done();
                    })
                    .catch(err=>done(err));
            });

            test("test thread creation without delete_password",function(done){
                chai.request(server)
                    .post("/api/threads/general")
                    .type("form")
                    .send({text: "thread de prueba"})
                    .then(res=>{
                        assert.equal(res.status, 400, "must return 400");
                        assert.equal(res.body.error, "text, board and delete_password are required", "must return required params message");
                        done();
                    })
                    .catch(err=>done(err));
            });

            test("test thread creation without specify board",function(done){
                chai.request(server)
                    .post("/api/threads")
                    .type("form")
                    .send({text: "thread de prueba", delete_password: "12345"})
                    .then(res=>{
                        assert.equal(res.status, 404, "must return 404");
                        done();
                    })
                    .catch(err=>done(err));
            });

            //borramos la base de datos
            suiteTeardown(myTeardown);
        });
        suite("GET", function(){

            suiteSetup(mySetup);
            test("test correct request",function(done){
                chai.request(server)
                    .get("/api/threads/testing")
                    .then(res=>{
                        assert.equal(res.status, 200);
                        assert.equal(res.type, "application/json");
                        assert.isAtMost(res.body.length, 10, "returns 10 threads at most");
                        assert.isAbove(res.body.length, 0, "returns at least one thread");
                        res.body.forEach(e=>{
                            assert.property(e, "text", "has text property text");
                            assert.property(e, "created_on", "has text property created_on");
                            assert.property(e, "bumped_on", "has text property bumped_on");
                            assert.property(e, "board", "has text property board");
                            assert.property(e, "replies", "has text property replies");
                            assert.property(e, "replycount", "has text property replycount");
                            assert.property(e, "reported", "has text property reported");
                            assert.isAtMost(e.replies.length, 3, "returns 3 replies al most");
                            e.replies.forEach(r=>{
                                assert.property(r, "_id", "reply has _id property");
                                assert.property(r, "text", "reply has text property text");
                                assert.property(r, "created_on", "reply has text property created_on");
                                assert.property(r, "reported", "reply has text property reported");
                            });
                        });
                        done();
                    })
                    .catch(err=>done(err));
            });



            test("test request without specify board",function(done){
                chai.request(server)
                    .get("/api/threads/")
                    .then(res=>{
                        assert.equal(res.status, 404, "must return 404");
                        done();
                    })
                    .catch(err=>done(err));
            });

            suiteTeardown(myTeardown);

        });

        suite("DELETE", function() {
            suiteSetup(mySetup);

            test("test delete correct request",function(done){
                chai.request(server)
                    .delete("/api/threads/testing")
                    .type("form")
                    .send({thread_id: "5ced52cc1db7ac25495b8aec", delete_password:"12345"})
                    .then(res=>{
                        assert.equal(res.status, 200, "must return 200");
                        assert.equal(res.body, "success", "must return success message");
                        done();
                    })
                    .catch(err=>done(err));
            });

            test("test delete without board",function(done){
                chai.request(server)
                    .delete("/api/threads")
                    .type("form")
                    .send({thread_id: "5ced52cc1db7ac25495b8aec", delete_password:"12345"})
                    .then(res=>{
                        assert.equal(res.status, 404, "must return 404");
                        done();
                    })
                    .catch(err=>done(err));
            });

            test("test delete with invalid thread_id",function(done){
                chai.request(server)
                    .delete("/api/threads/testing")
                    .type("form")
                    .send({thread_id: "sddrtyuj", delete_password:"12345"})
                    .then(res=>{
                        assert.equal(res.status, 400, "must return 400");
                        done();
                    })
                    .catch(err=>done(err));
            });

            test("test delete without thread_id",function(done){
                chai.request(server)
                    .delete("/api/threads/testing")
                    .type("form")
                    .send({delete_password:"12345"})
                    .then(res=>{
                        assert.equal(res.status, 400, "must return 400");
                        done();
                    })
                    .catch(err=>done(err));
            });

            test("test delete without delete_password",function(done){
                chai.request(server)
                    .delete("/api/threads/testing")
                    .type("form")
                    .send({thread_id: "5ced52cc1db7ac25495b8aec"})
                    .then(res=>{
                        assert.equal(res.status, 400, "must return 400");
                        done();
                    })
                    .catch(err=>done(err));
            });

            test("test delete with incorrect delete_password",function(done){
                chai.request(server)
                    .delete("/api/threads/testing")
                    .type("form")
                    .send({thread_id: "5ced52cc1db7ac25495b8aed", delete_password: "11111"})
                    .then(res=>{
                        assert.equal(res.status, 401, "must return 401");
                        assert.equal(res.body.error, "incorrect password", "must return incorrect password message");
                        done();
                    })
                    .catch(err=>done(err));
            });

            test("test delete with non existent thread_id",function(done){
                chai.request(server)
                    .delete("/api/threads/testing")
                    .type("form")
                    .send({thread_id: "5cf545ce34924125ac8904fe", delete_password:"12345"})
                    .then(res=>{
                        assert.equal(res.status, 404, "must return 404");
                        assert.equal(res.body.error, "thread not found", "must return thread not found message");
                        done();
                    })
                    .catch(err=>done(err));
            });


            suiteTeardown(myTeardown);
        });

        suite("PUT", function() {
            suiteSetup(mySetup);
            test("test reporting thread correct request",function(done){
                chai.request(server)
                    .put("/api/threads/testing")
                    .type("form")
                    .send({thread_id: "5ced52cc1db7ac25495b8aec"})
                    .then(res=>{
                        assert.equal(res.status, 200, "must return 200");
                        assert.equal(res.body, "success", "response success message");
                        done();
                    })
                    .catch(err=>done(err));
            });

            test("test reporting thread without board",function(done){
                chai.request(server)
                    .put("/api/threads/")
                    .type("form")
                    .send({thread_id: "5ced52cc1db7ac25495b8aec"})
                    .then(res=>{
                        assert.equal(res.status, 404, "must return 404");
                        done();
                    })
                    .catch(err=>done(err));
            });

            test("test reporting thread without thread_id",function(done){
                chai.request(server)
                    .put("/api/threads/testing")
                    .type("form")
                    .then(res=>{
                        assert.equal(res.status, 400, "must return 400");
                        assert.equal(res.body.error, "thread_id and board are required.", "response message params required");
                        done();
                    })
                    .catch(err=>done(err));
            });

            test("test reporting with invalid thread_id",function(done){
                chai.request(server)
                    .put("/api/threads/testing")
                    .type("form")
                    .send({thread_id: "fgfgdh"})
                    .then(res=>{
                        assert.equal(res.status, 400, "must return 400");
                        assert.equal(res.body.error, "thread_id is not valid.", "response message invalid thread_id");
                        done();
                    })
                    .catch(err=>done(err));
            });

            suiteTeardown(myTeardown);
        });


    });

    suite("API ROUTING FOR /api/replies/:board", function() {

        suite("POST", function() {
            setup(mySetup);
            test("test reply creation",function(done){
                chai.request(server)
                    .post("/api/replies/testing")
                    .type("form")
                    .send({thread_id: "5ced52cc1db7ac25495b8aec", text: "reply", delete_password:"12345"})
                    .then(res=>{
                        expect(res).to.redirect;
                        expect(res).to.redirectTo(/\/b\/testing\/5ced52cc1db7ac25495b8aec$/);
                        assert.equal(res.status, 200, "response code 200");
                        done();
                    })
                    .catch(err=>done(err));
            });

            teardown(myTeardown);
        });

        suite("GET", function() {
            suiteSetup(mySetup);
            test("test correct request",function(done){
                chai.request(server)
                    .get("/api/replies/general")
                    .query({thread_id: "5ced52cc1db7ac25495b8aec" })
                    .then(res=>{
                        assert.equal(res.status, 200);
                        assert.equal(res.type, "application/json");
                        assert.property(res.body, "_id", "has id property");
                        assert.property(res.body, "text", "has text property");
                        assert.property(res.body, "created_on", "has created_on property");
                        assert.property(res.body, "bumped_on", "has bumped_on property");
                        assert.property(res.body, "board", "has board property");
                        assert.property(res.body, "reported", "has reported property");
                        assert.property(res.body, "replycount", "has replycount property");
                        assert.property(res.body, "replies", "has replies property");
                        assert.isArray(res.body.replies, "replies property is an array");
                        res.body.replies.forEach(r=>{
                            assert.property(r, "_id", "reply has _id property");
                            assert.property(r, "text", "reply has text property text");
                            assert.property(r, "created_on", "reply has text property created_on");
                            assert.property(r, "reported", "reply has text property reported");
                        });
                        done();
                    })
                    .catch(err=>done(err));
            });
            test("test request without thread_id",function(done){
                chai.request(server)
                    .get("/api/replies/testing")
                    .then(res=>{
                        assert.equal(res.status, 400);
                        assert.equal(res.type, "application/json");

                        done();
                    })
                    .catch(err=>done(err));
            });

            test("test request with invalid thread_id",function(done){
                chai.request(server)
                    .get("/api/replies/general")
                    .query({thread_id: "qwqwqwW" })
                    .then(res=>{
                        assert.equal(res.status, 400);
                        assert.equal(res.type, "application/json");
                        assert.equal(res.body.error, "thread_id is not valid.", "error message is correct");
                        done();
                    })
                    .catch(err=>done(err));
            });
            suiteTeardown(myTeardown);
        });

        suite("PUT", function() {
            test("test reporting reply correct request",function(done){
                chai.request(server)
                    .put("/api/replies/testing")
                    .type("form")
                    .send({thread_id: "5ced52cc1db7ac25495b8aec", reply_id: "4ced52cc1db7ac25495b8aed"})
                    .then(res=>{
                        assert.equal(res.status, 200, "must return 200");
                        assert.equal(res.body, "success", "response success message");
                        done();
                    })
                    .catch(err=>done(err));
            });

            test("test reporting reply without board",function(done){
                chai.request(server)
                    .put("/api/replies/")
                    .type("form")
                    .send({thread_id: "5ced52cc1db7ac25495b8aec", reply_id: "4ced52cc1db7ac25495b8aed"})
                    .then(res=>{
                        assert.equal(res.status, 404, "must return 404");
                        done();
                    })
                    .catch(err=>done(err));
            });

            test("test reporting reply without thread_id",function(done){
                chai.request(server)
                    .put("/api/replies/testing")
                    .type("form")
                    .send({reply_id: "4ced52cc1db7ac25495b8aed"})
                    .then(res=>{
                        assert.equal(res.status, 400, "must return 400");
                        assert.equal(res.body.error, "thread_id, reply_id and board are required.", "response message params required");
                        done();
                    })
                    .catch(err=>done(err));
            });

            test("test reporting reply with invalid thread_id",function(done){
                chai.request(server)
                    .put("/api/replies/testing")
                    .type("form")
                    .send({thread_id: "fgfgf", reply_id: "4ced52cc1db7ac25495b8aed"})
                    .then(res=>{
                        assert.equal(res.status, 400, "must return 400");
                        assert.equal(res.body.error, "thread_id is not valid.", "response message invalid thread_id");
                        done();
                    })
                    .catch(err=>done(err));
            });

            test("test reporting reply without reply_id",function(done){
                chai.request(server)
                    .put("/api/replies/testing")
                    .type("form")
                    .send({thread_id: "5ced52cc1db7ac25495b8aec"})
                    .then(res=>{
                        assert.equal(res.status, 400, "must return 400");
                        assert.equal(res.body.error, "thread_id, reply_id and board are required.", "response message params required");
                        done();
                    })
                    .catch(err=>done(err));
            });

            test("test reporting reply with invalid reply_id",function(done){
                chai.request(server)
                    .put("/api/replies/testing")
                    .type("form")
                    .send({thread_id: "5ced52cc1db7ac25495b8aec", reply_id: "fggfth"})
                    .then(res=>{
                        assert.equal(res.status, 400, "must return 400");
                        assert.equal(res.body.error, "reply_id is not valid.", "response message invalid reply_id");
                        done();
                    })
                    .catch(err=>done(err));
            });

            suiteTeardown(myTeardown);
        });

        suite("DELETE", function() {
            suiteSetup(mySetup);

            test("test delete correct request",function(done){
                chai.request(server)
                    .delete("/api/replies/testing")
                    .type("form")
                    .send({thread_id: "5ced52cc1db7ac25495b8aec", reply_id: "4ced52cc1db7ac25495b8aed", delete_password:"12345"})
                    .then(res=>{
                        assert.equal(res.status, 200, "must return 200");
                        assert.equal(res.body, "success", "must return success message");
                        done();
                    })
                    .catch(err=>done(err));
            });

            test("test delete without board",function(done){
                chai.request(server)
                    .delete("/api/replies")
                    .type("form")
                    .send({thread_id: "5ced52cc1db7ac25495b8aec", reply_id: "4ced52cc1db7ac25495b8aed", delete_password:"12345"})
                    .then(res=>{
                        assert.equal(res.status, 404, "must return 404");
                        done();
                    })
                    .catch(err=>done(err));
            });

            test("test delete with invalid thread_id",function(done){
                chai.request(server)
                    .delete("/api/replies/testing")
                    .type("form")
                    .send({thread_id: "fgfsgfg", reply_id: "4ced52cc1db7ac25495b8aef", delete_password:"12345"})
                    .then(res=>{
                        assert.equal(res.status, 400, "must return 400");
                        assert.equal(res.body.error, "thread_id is not valid.", "must return thread_id not valid message");
                        done();
                    })
                    .catch(err=>done(err));
            });

            test("test delete with invalid reply_id",function(done){
                chai.request(server)
                    .delete("/api/replies/testing")
                    .type("form")
                    .send({thread_id: "5ced52cc1db7ac25495b8aec", reply_id: "dfgfgrg", delete_password:"12345"})
                    .then(res=>{
                        assert.equal(res.status, 400, "must return 400");
                        assert.equal(res.body.error, "reply_id is not valid.", "must return reply_id not valid message");
                        done();
                    })
                    .catch(err=>done(err));
            });

            test("test delete without thread_id",function(done){
                chai.request(server)
                    .delete("/api/replies/testing")
                    .type("form")
                    .send({reply_id: "4ced52cc1db7ac25495b8aed", delete_password:"12345"})
                    .then(res=>{
                        assert.equal(res.status, 400, "must return 400");
                        done();
                    })
                    .catch(err=>done(err));
            });

            test("test delete without reply_id",function(done){
                chai.request(server)
                    .delete("/api/replies/testing")
                    .type("form")
                    .send({thread_id: "5ced52cc1db7ac25495b8aec", delete_password:"12345"})
                    .then(res=>{
                        assert.equal(res.status, 400, "must return 400");
                        done();
                    })
                    .catch(err=>done(err));
            });

            test("test delete without delete_password",function(done){
                chai.request(server)
                    .delete("/api/replies/testing")
                    .type("form")
                    .send({thread_id: "5ced52cc1db7ac25495b8aec", reply_id: "5cf557407131bc2e9857788b"})
                    .then(res=>{
                        assert.equal(res.status, 400, "must return 400");
                        done();
                    })
                    .catch(err=>done(err));
            });

            test("test delete with incorrect delete_password",function(done){
                chai.request(server)
                    .delete("/api/replies/testing")
                    .type("form")
                    .send({thread_id: "5ced52cc1db7ac25495b8aec", reply_id: "5cf557407131bc2e9857788b", delete_password: "11111"})
                    .then(res=>{
                        assert.equal(res.status, 401, "must return 401");
                        assert.equal(res.body.error, "incorrect password", "must return incorrect password message");
                        done();
                    })
                    .catch(err=>done(err));
            });

            test("test delete with non existent thread_id",function(done){
                chai.request(server)
                    .delete("/api/replies/testing")
                    .type("form")
                    .send({thread_id: "5ced52cc1db7ad25495b8aef", reply_id: "5cf557407131bc2e9857788b", delete_password:"12345"})
                    .then(res=>{
                        assert.equal(res.status, 404, "must return 404");
                        assert.equal(res.body.error, "thread not found", "must return thread not found message");
                        done();
                    })
                    .catch(err=>done(err));
            });

            test("test delete with non existent reply_id",function(done){
                chai.request(server)
                    .delete("/api/replies/testing")
                    .type("form")
                    .send({thread_id: "5ced52cc1db7ac25495b8aec", reply_id: "5ced52cc1db7ac25495b8aec", delete_password:"12345"})
                    .then(res=>{
                        assert.equal(res.status, 404, "must return 404");
                        assert.equal(res.body.error, "reply not found", "must return reply not found message");
                        done();
                    })
                    .catch(err=>done(err));
            });

            suiteTeardown(myTeardown);
        });

    });

});
