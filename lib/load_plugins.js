var path = require('path');
var architect = require("architect");

module.exports = function(directory, callback) {

    var configPath = path.join(directory, "plugins.js");

    architect.loadConfig(configPath, function(err, config) {
        if (err) { return callback(err); }
        callback(null, config);
    });
}

