var express = require('express');
var async = require('async');
var bodyParser = require('body-parser');
var controller = require('./controller');
var methodOverride = require('method-override');

if (process.env.NODE_ENV !== 'production' && process.env.NODE_ENV !== 'staging'){ require('longjohn'); }

module.exports = function(options, imports, register){
    imports.log('express route').info('loading...');

    var router = express.Router();

    var middleware = {
        before: []
    };

    /**
     * Attach router specific middleware here
     */
    router.use(methodOverride('_method'));
    router.use(bodyParser.urlencoded({ extended: false }));
    router.use(bodyParser.json());

    router.use(methodOverride(function(req, res){
        if (req.body && typeof req.body === 'object' && '_method' in req.body) {
            var method = req.body._method
            delete req.body._method
            return method
        }
    }));


    /**
     * Inject middleware defined in middleware.before array
     */
    router.use(function(req, res, next) {
        async.eachSeries(middleware.before, function(func, cb) {
            func(req, res, cb);
        }, next);
    });

    /**
     * Routes
     */
    router.get('', controller.index);
    router.get('/:id', controller.show);
    router.post('', controller.create);
    router.put('', controller.update);
    router.delete('', controller.destroy);


    register(null, {
        controller:router,
        middleware:middleware
    });

}
