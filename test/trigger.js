
'use strict';
process.env.NODE_ENV = 'test';

var expect = require('expect.js'),
    ready = require('../express.trigger');

var sinon = require('sinon');
var emitter = require('events');
var log = require('node-architect-log/mock');

var events = new emitter.EventEmitter();

var attachResponseHandlers, req, res;

describe('plugin express.trigger', function(){

    // It is important that the express app only be initialised once.
    // If not, the middleware will not be flushed and will keep stacking.
    // Under normal circumstances the routes will only be mounted once.
    before(function(done){
        var middleware = {
            before: []
        };
        ready({}, {
            events:events,
            middleware:middleware,
            log: log
        }, function() {
            attachResponseHandlers = middleware.before[0];
            done();
        });
    });

    beforeEach(function() {
        req = {
            query:{},
            params:{},
            body:{}
        };
        res = {};
        events.removeAllListeners();
    });

    describe('with no event handler registered', function() {

        it('it calls next', function(done){
            attachResponseHandlers(req, res, function next() {
                res.trigger('action', function(err) {
                    expect(err).to.be(null);
                    done();
                });
            });
        });

        it('even with an action.after event handler registered it doesnt trigger action.after', function(done){
            var expectation = sinon.expectation.create('action.after event');
            expectation.once();

            events.once('action.after', function(query, callback) {
                expectation();
                callback();
            });

            attachResponseHandlers(req, res, function next() {
                res.trigger('action', function() {
                    expectation();
                    expectation.verify();
                    done();
                });
            });
        });

    });

    describe('when an event handler is registered', function() {

        it("emits an 'action'", function(done){
            var expectation = sinon.expectation.create('action event');
            expectation.once();

            events.once('action', function(query, callback) {
                expectation();
                callback();
            });

            attachResponseHandlers(req, res, function next() {
                res.trigger('action', function() {
                    expectation.verify();
                    done();
                });
            });
        });


        it("passes action event a merged query, params & body object", function(done){
            req.body.exampleBody = 'test body';
            req.query.exampleQuery = 'test query';
            req.params.exampleParams = 'test param';

            events.once('action', function(query, callback) {
                expect(query).to.eql({
                    exampleBody: 'test body',
                    exampleQuery: 'test query',
                    exampleParams: 'test param'
                });
                callback();
            });

            attachResponseHandlers(req, res, function next() {
                res.trigger('action', function() {
                    done();
                });
            });
        });

        describe('when an emitted callback is called with', function() {

            it("an error it calls next with that error", function(done){
                events.once('action', function(query, callback) {
                    callback(new Error('Boom!'));
                });

                attachResponseHandlers(req, res, function next() {
                    res.trigger('action', function(err) {
                        expect(err.message).to.match(/Boom!/);
                        done();
                    });
                });
            });

            it("null error and a data object, it calls res.json(data)", function(done){
                var sampleData = {
                    sample:'json data'
                };

                res.json = function() {};

                var expectation = sinon.mock(res);
                expectation.expects('json').once().withArgs(sampleData);

                events.once('action', function(query, callback) {
                    callback(null, sampleData);
                });

                attachResponseHandlers(req, res, function next() {
                    res.trigger('action');
                    expectation.verify();
                    done();
                });
            });
        });

        describe('when an action.after handler is registered', function() {

            it("emits an 'action.after'", function(done){
                var expectation = sinon.expectation.create('action.after event');
                expectation.once();

                events.once('action', function(query, callback) {
                    callback();
                });

                events.once('action.after', function(query, callback) {
                    expectation();
                    callback();
                });

                attachResponseHandlers(req, res, function next() {
                    res.trigger('action', function() {
                        expectation.verify();
                        done();
                    });
                });
            });

            describe('when an emitted after callback is called with', function() {

                it("an error it calls next with that error", function(done){
                    events.once('action', function(query, callback) {
                        callback();
                    });

                    events.once('action.after', function(query, callback) {
                        callback(new Error('Boom!'));
                    });

                    attachResponseHandlers(req, res, function next() {
                        res.trigger('action', function(err) {
                            expect(err.message).to.match(/Boom!/);
                            done();
                        });
                    });
                });

                it("null error and a data object, it calls res.json(data) with transformed object", function(done){
                    var transformedData = {
                        sample:'json data'
                    };

                    res.json = function() {};

                    var expectation = sinon.mock(res);
                    expectation.expects('json').once().withArgs(transformedData);

                    events.once('action', function(query, callback) {
                        callback();
                    });

                    events.once('action.after', function(query, callback) {
                        callback(null, transformedData);
                    });

                    attachResponseHandlers(req, res, function next() {
                        res.trigger('action');
                        expectation.verify();
                        done();
                    });
                });

            });
        });


        it('renders html if the content is a string')

    });


});
