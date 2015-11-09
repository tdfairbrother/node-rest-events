var librato = require('librato-node');

/**
 * Add librato metrics
 *
 * options example:
    librato:{        
        tokein: 'xxx',
        email: 'xxx',
        prefix: 'xxx'
    }

 * @param options Object
 * @param imports Object
 * @param register Function
 */
module.exports = function(options, imports, register){
    if (!options.token) { throw new Error('token is not defined') }
    if (!options.email) { throw new Error('email is not defined') }
    if (!options.prefix) { throw new Error('prefix is not defined') }

    imports.log('librato').info('loading...');

    var middleware = imports.middleware;
    var config = {
      email: options.email,
      token: options.token,
      prefix: options.prefix
    }

    librato.configure(config);
    librato.start();    

    // Hook into the before middleware
    middleware.before.push(librato.middleware());
    register(null, {});
};