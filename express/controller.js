module.exports = {
    index:function(req, res, next){
        res.trigger('index', next);
    },

    show:function(req, res, next){
        res.trigger('show', next);
    },

    create:function(req, res, next){
        res.trigger('create', next);
    },

    update:function(req, res, next){
        res.trigger('update', next);
    },

    destroy:function(req, res, next){
        res.trigger('destroy', next);
    }
};
