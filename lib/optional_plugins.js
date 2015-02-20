var _ = require('lodash');

/**
 * Checks the options for additional plugins to include and pushes them to a copy of the plugins array.
 * Merges the options from a property named the same as the plugin.
 * @param defaultPlugins Array
 * @param plugins Array
 * @param options Object
 * @returns plugins Array
 */
module.exports = function includeOptionalPlugins(defaultPlugins, plugins, options) {

    // If there is a plugin option, add it to the usePlugins array
    if (options.plugins) {
        defaultPlugins = defaultPlugins.concat(options.plugins);
    }

    // Iterate over the all of the available plugins and only return the ones in the usePlugins array.
    // If options.plugins is defined, merge the plugin options from the property named the same as the plugin.
    var allPlugins = _.map(plugins, function(plugin) {
        var pluginName = _.last(plugin.packagePath.split('/'));
        if (_.contains(defaultPlugins, pluginName)) {
            if (_.contains(options.plugins, pluginName)) {
                plugin = _.merge(plugin, options[pluginName]);
            }
            return plugin;
        }
    });

    // Remove undefined's
    return _.filter(allPlugins);
};