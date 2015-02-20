var jwtExpressAuth = require('jwt-express-auth');

/**
 * Add jwt authentication/authorization to the resource
 *
 * options example:
    auth:{
         auth_secret: options.auth_secret,
         url_param: 'student_id',
         token_param: 'user_id'
    }

 * @param options Object
 * @param imports Object
 * @param register Function
 */
module.exports = function(options, imports, register){
    if (!options.token_param) { throw new Error('token_param is not defined') }
    if (!options.url_param) { throw new Error('url_param is not defined') }
    if (!options.auth_secret) { throw new Error('auth_secret is not defined') }

    imports.log('auth').info('loading...');

    var middleware = imports.middleware;

    var authMiddleware = jwtExpressAuth({
        secret: options.auth_secret,
        tokenParam: options.token_param
    });

    // Hook into the before middleware
    middleware.before.push(auth);

    function auth(req, res, next) {
        authMiddleware(req, res, next, req.param(options.url_param));
    }

    register(null, {});

};