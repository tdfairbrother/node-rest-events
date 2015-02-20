
'use strict';
process.env.NODE_ENV = 'test';


var expect = require('expect.js'),
    request = require('supertest'),
    ready = require('../index');

var express = require('express');
var app = express();
var router = express.Router();
var services, events;


describe('Supports Method Override', function(){

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
                done();
            });
        });
    });

    describe('PUT update', function(){

        it('renders 200 ok', function(done){
            events.once('update', function(query, next) {
                next(null, { test:true });
            });

            request(app)
                .post('/crud_test?test=1')
                .send({ _method:'PUT', my_data:true })
                .expect(200)
                .expect({ test:true })
                .end(done);
        });
    });

    describe('DELETE destroy', function(){

        it('renders 200 ok', function(done){
            events.once('destroy', function(query, next) {
                next(null, { test:true });
            });

            request(app)
                .post('/crud_test?test=1')
                .send({ _method:'DELETE', my_data:true })
                .expect(200)
                .expect({ test:true })
                .end(done);
        });


    });
});
