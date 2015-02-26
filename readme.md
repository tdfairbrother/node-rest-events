Rest Events
====================

[![Build Status](https://semaphoreapp.com/api/v1/projects/93cc7cc8-e887-4e1b-868d-1484915757ce/359591/badge.png)](https://semaphoreapp.com/tdfairbrother/node-rest-events)

[![Coverage Status](https://coveralls.io/repos/tdfairbrother/node-rest-events/badge.svg?branch=master)](https://coveralls.io/r/tdfairbrother/node-rest-events?branch=master)

Provides an express router and an event emitter that will trigger events on index, show, create, update and destroy.

This module is exposed as an [Architect](https://github.com/c9/architect) plugin.


```javascript
    module.exports = function(options, imports, register){
        var restFactory = imports.rest;

        /**
         * Create api and register a controller and an event hub.
         */
        restFactory(function(err, rest) {
            if (err) throw err;
            var events = rest.services.events;
            var controller = rest.services.controller;

            register(null, {
                home_controller:controller,
                home_events:events
            });
        });
    }
```


```javascript
    /**
     * Routes
     */
    router.get('', index);
    router.get('/:id', show);
    router.post('', create);
    router.put('', update);
    router.delete('', destroy);
```


```javascript
    /**
     * Events
     */
    events.emit('index', req.query, next);
    events.emit('show', req.params, res.respond);
    events.emit('create', req.body, res.respond);
    events.emit('update', req.body, res.respond);
    events.emit('destroy', req.body, res.respond);
```


```sh
npm install
```

To run tests
```sh
npm test
```