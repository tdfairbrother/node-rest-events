var librato = require('librato-node');

/**
 * Add librato metrics
 *
 * options example:
    librato:{        
        tokein: 'xxx',
        email: 'xxx',
        metricPrefix: 'xxx',
        enabled: true        
    }

 * @param options Object
 * @param imports Object
 * @param register Function
 */
module.exports = function(options, imports, register){
    if (!options.token) { throw new Error('token is not defined') }
    if (!options.email) { throw new Error('email is not defined') }
    if (!options.metricPrefix) { throw new Error('metricPrefix is not defined') }
    if (!options.enabled) { throw new Error('metricPrefix is not defined') }

    imports.log('librato').info('loading...');

    var middleware = imports.middleware;
    var config = {
      email: options.email,
      token: options.token,
      interval: options.interval || 10,
      metricPrefix: options.metricPrefix
    }

    librato.configure(config);
    librato.start();    

    // Hook into the before middleware
    middleware.before.push(librato.middleware());
    register(null, {});
};