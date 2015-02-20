var _ = require('lodash');

module.exports = function(options, imports, register){
    imports.log('express.trigger').info('loading...');

    var events = imports.events;
    var middleware = imports.middleware;

    middleware.before.push(attachResponseHandlers);

    register(null, {});


    //TODO - prevent next from being called twice

    function attachResponseHandlers(req, res, next) {

        res.trigger = function(action, callback) {
            var respondTo = respond(req, res, callback);
            var mergedParams = _.merge(req.body, req.query, req.params);
            var afterEvent = triggerAfterEvent(action, respondTo);
            var received = events.emit(action, mergedParams, afterEvent);

            if (!received) {
                respondTo();
            }
        };

        next();
    }

    function triggerAfterEvent(action, respondCallback) {
        return function(err, data) {
            if (err) {
                return respondCallback(err);
            }
            var received = events.emit(action+'.after', data, respondCallback);

            if (!received) {
                respondCallback(null, data);
            }
        }
    }

    function respond(req, res, next) {
        return function respondTo(err, result) {
            if(err) {
                return next(err);
            }
            if (_.isString(result)) {
                res.send(result);
            } else if (result) {
                res.json(result);
            } else {
                next(null);
            }
        }
    }

};
