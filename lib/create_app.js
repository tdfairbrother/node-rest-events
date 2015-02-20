var architect = require("architect");

module.exports = function(config, callback) {
    architect.createApp(config, function (err, app) {
        if (err) { return callback(err); }
        callback(null, app);
    });
};

