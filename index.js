var _ = require('lodash');
var loadPlugins = require('./lib/load_plugins');
var createApp = require('./lib/create_app');
var includeOptionalPlugins = require('./lib/optional_plugins');

module.exports = function(options, imports, register) {

    // Load up all of the plugins including optional plugins
    loadPlugins(__dirname, function(err, plugins) {
        if (err) { return register(err) }

        register(null, {
            rest: restFactory(plugins)
        });
    });

    function restFactory(plugins) {
        return function(options, callback) {
            var defaultPlugins = ['events', 'express', 'express.trigger','node-architect-log'];

            // options are optional
            if (_.isFunction(options)) {
                callback = options;
                options = {};
            }

            var allPlugins = includeOptionalPlugins(defaultPlugins, plugins, options);

            createApp(allPlugins, function(err, app) {
                if (err) return callback(err);
                app.services.log('rest_events').info('app instance ready');
                callback(null, app);
            });
        }
    }

}

