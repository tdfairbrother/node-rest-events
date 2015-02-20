
'use strict';

process.env.NODE_ENV = 'test';

var expect = require('expect.js');
var request = require('supertest');
var ready = require('../index');

var express = require('express');
var app = express();
var router = express.Router();
var services, events;

var jwt = require('jsonwebtoken');
var token = jwt.sign({ token_user_id:349459 }, 'secret');

var pluginOptions = {
    plugins: ['express.jwt_auth'],
    'express.jwt_auth': {
        auth_secret: 'secret',
        url_param: 'user_id',
        token_param: 'token_user_id'
    }
};

describe('plugin express.jwt_auth', function(){

    // It is important that the express app only be initialised once.
    // If not, the middleware will not be flushed and will keep stacking.
    // Under normal circumstances the routes will only be mounted once.
    before(function(done){
        ready({}, {}, function(err, imports) {
            imports.rest(pluginOptions, function(err, crud) {
                if (err) throw err;
                services = crud.services;
                events = services.events;
                app.use('/crud_test', services.controller);

                app.use(function(req, res, next, err) {
                    res.status(err.status);
                    next(err);
                });

                done();
            });
        });
    });

    describe('GET index', function(){

        it('renders 401 unauthorized', function(done){
            request(app)
                .get('/crud_test')
                .expect(401)
                .end(done);
        });

        it('renders 200 success', function(done){
            events.once('index', function(query, next) {
                next(null, { test:true });
            });

            request(app)
                .get('/crud_test?user_id=349459&authorization='+token)
                .expect(200)
                .expect({ test:true })
                .end(done);
        });

        it('needs to authorize the user_id in only one place. If it is found in as a query param and the body, then they should match')

    });
});
