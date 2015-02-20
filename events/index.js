var events = require('events');

module.exports = function(options, imports, register){
    imports.log('events').info('loading...');

    var emitter = new events.EventEmitter();
    register(null, { events:emitter } );

}
