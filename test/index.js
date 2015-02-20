
'use strict';
process.env.NODE_ENV = 'test';


var expect = require('expect.js'),
    request = require('supertest'),
    ready = require('../index');

var express = require('express');
var app = express();
var services, events;


describe('Rest Events', function(){

    // It is important that the express app only be initialised once.
    // If not, the middleware will not be flushed and will keep stacking.
    // Under normal circumstances the routes will only be mounted once.
    before(function(done){
        ready({}, {}, function(err, imports) {
            imports.rest(function(err, crud) {
                if (err) throw err;
                services = crud.services;
                events = services.events;
                app.use('/crud_test', services.controller);

                // define error middleware
                app.use(function(req, res, next) {
                    res.status(404);
                    next(new Error('Not Found'));
                });
                done();
            });
        });
    });

    describe('GET index', function(){

        it('with no event handler registered it calls next middleware (usually 404)', function(done){
            request(app)
                .get('/crud_test')
                .expect(404)
                .end(done);
        });

        it('renders 200 ok', function(done){
            events.once('index', function(query, next) {
                expect(query).to.eql({ test: '1' });
                next(null, { test:true });
            });

            request(app)
                .get('/crud_test?test=1')
                .expect(200)
                .expect({ test:true })
                .end(done);
        });

        it('renders 500 internal server error', function(done){
            events.once('index', function(query, next) {
                next(new Error());
            });

            request(app)
                .get('/crud_test')
                .expect(500)
                .end(done);
        });

        it('calling next with no data calls next middleware (usually 404)', function(done){
            events.once('index', function(query, next) {
                next();
            });

            request(app)
                .get('/crud_test')
                .expect(404)
                .end(done);
        });

        describe('lifecycle events', function(){

            it('emits index.after', function(done){
                events.once('index', function(query, next) {
                    next(null, { test:'data' });
                });

                events.once('index.after', function(data, next) {
                    expect(data).to.eql({ test:'data' });
                    next(null, { transformed:'data' });
                });

                request(app)
                    .get('/crud_test')
                    .expect(200)
                    .expect({ transformed:'data' })
                    .end(done);
            });

        });

    });

    describe('GET /:id show', function(){

        it('with no event handler registered it calls next middleware (usually 404)', function(done){
            request(app)
                .get('/crud_test/1')
                .expect(404)
                .end(done);
        });


        it('merges query, params & body', function(done){
            events.once('show', function(query, next) {
                expect(query).to.eql({ id:1, test:'1' });
                next(null, {});
            });

            request(app)
                .get('/crud_test/1?test=1')
                .expect(200)
                .end(done);
        });


        it('renders 200 ok', function(done){
            events.once('show', function(query, next) {
                next(null, { test:true });
            });

            request(app)
                .get('/crud_test/1?test=1')
                .expect(200)
                .expect({ test:true })
                .end(done);
        });


        it('renders 500 internal server error', function(done){
            events.once('show', function(query, next) {
                next(new Error());
            });

            request(app)
                .get('/crud_test/1')
                .expect(500)
                .end(done);
        });


        it('calling next with no data calls next middleware (usually 404)', function(done){
            events.once('show', function(query, next) {
                next();
            });

            request(app)
                .get('/crud_test/1')
                .expect(404)
                .end(done);
        });


        describe('lifecycle events', function(){

            it('emits show.after', function(done){
                events.once('show', function(query, next) {
                    next(null, { test:'data' });
                });

                events.once('show.after', function(data, next) {
                    expect(data).to.eql({ test:'data' });
                    next(null, { transformed:'data' });
                });

                request(app)
                    .get('/crud_test/1')
                    .expect(200)
                    .expect({ transformed:'data' })
                    .end(done);
            });

        });
    });

    describe('POST create', function(){

        it('with no event handler registered it calls next middleware (usually 404)', function(done){
            request(app)
                .post('/crud_test')
                .expect(404)
                .end(done);
        });

        it('merges query, params & body', function(done){
            events.once('create', function(query, next) {
                expect(query).to.eql({ my_data:true, test:'1' });
                next(null, { });
            });

            request(app)
                .post('/crud_test?test=1')
                .send({ my_data:true })
                .expect(200)
                .end(done);
        });

        it('renders 200 ok', function(done){
            events.once('create', function(query, next) {
                expect(query).to.eql({ my_data:true, test:'1' });
                next(null, { test:true });
            });

            request(app)
                .post('/crud_test?test=1')
                .send({ my_data:true })
                .expect(200)
                .expect({ test:true })
                .end(done);
        });

        it('renders 500 internal server error', function(done){
            events.once('create', function(query, next) {
                next(new Error());
            });

            request(app)
                .post('/crud_test')
                .expect(500)
                .end(done);
        });


        it('calling next with no data calls next middleware (usually 404)', function(done){
            events.once('create', function(query, next) {
                next();
            });

            request(app)
                .post('/crud_test')
                .expect(404)
                .end(done);
        });


        describe('lifecycle events', function(){

            it('emits create.after', function(done){
                events.once('create', function(query, next) {
                    next(null, { test:'data' });
                });

                events.once('create.after', function(data, next) {
                    expect(data).to.eql({ test:'data' });
                    next(null, { transformed:'data' });
                });

                request(app)
                    .post('/crud_test')
                    .expect(200)
                    .expect({ transformed:'data' })
                    .end(done);
            });

        });

    });

    describe('PUT update', function(){

        it('with no event handler registered it calls next middleware (usually 404)', function(done){
            request(app)
                .put('/crud_test')
                .expect(404)
                .end(done);
        });

        it('merges query, params & body', function(done){
            events.once('update', function(query, next) {
                expect(query).to.eql({ my_data:true, test:'1' });
                next(null, { });
            });

            request(app)
                .put('/crud_test?test=1')
                .send({ my_data:true })
                .expect(200)
                .end(done);
        });

        it('renders 200 ok', function(done){
            events.once('update', function(query, next) {
                next(null, { test:true });
            });

            request(app)
                .put('/crud_test?test=1')
                .send({ my_data:true })
                .expect(200)
                .expect({ test:true })
                .end(done);
        });

        it('renders 500 internal server error', function(done){
            events.once('update', function(query, next) {
                next(new Error());
            });

            request(app)
                .put('/crud_test')
                .expect(500)
                .end(done);
        });

        it('calling next with no data calls next middleware (usually 404)', function(done){
            events.once('update', function(query, next) {
                next();
            });

            request(app)
                .put('/crud_test')
                .expect(404)
                .end(done);
        });


        describe('lifecycle events', function(){

            it('emits update.after', function(done){
                events.once('update', function(query, next) {
                    next(null, { test:'data' });
                });

                events.once('update.after', function(data, next) {
                    expect(data).to.eql({ test:'data' });
                    next(null, { transformed:'data' });
                });

                request(app)
                    .put('/crud_test')
                    .expect(200)
                    .expect({ transformed:'data' })
                    .end(done);
            });

        });

    });

    describe('DELETE destroy', function(){

        it('with no event handler registered it calls next middleware (usually 404)', function(done){
            request(app)
                .delete('/crud_test')
                .expect(404)
                .end(done);
        });

        it('merges query, params & body', function(done){
            events.once('destroy', function(query, next) {
                expect(query).to.eql({ my_data:true, test:'1' });
                next(null, {});
            });

            request(app)
                .delete('/crud_test?test=1')
                .send({ my_data:true })
                .expect(200)
                .end(done);
        });

        it('renders 200 ok', function(done){
            events.once('destroy', function(query, next) {
                next(null, { test:true });
            });

            request(app)
                .delete('/crud_test?test=1')
                .send({ my_data:true })
                .expect(200)
                .expect({ test:true })
                .end(done);
        });

        it('renders 500 internal server error', function(done){
            events.once('destroy', function(query, next) {
                next(new Error());
            });

            request(app)
                .delete('/crud_test')
                .expect(500)
                .end(done);
        });

        it('calling next with no data calls next middleware (usually 404)', function(done){
            events.once('destroy', function(query, next) {
                next();
            });

            request(app)
                .delete('/crud_test')
                .expect(404)
                .end(done);
        });

        describe('lifecycle events', function(){

            it('emits destroy.after', function(done){
                events.once('destroy', function(query, next) {
                    next(null, { test:'data' });
                });

                events.once('destroy.after', function(data, next) {
                    expect(data).to.eql({ test:'data' });
                    next(null, { transformed:'data' });
                });

                request(app)
                    .delete('/crud_test')
                    .expect(200)
                    .expect({ transformed:'data' })
                    .end(done);
            });

        });

    });
});
