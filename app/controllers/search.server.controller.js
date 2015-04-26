'use strict';

exports.searcharticle = function(req, res) {
    Article.find({'tag': req.params.tag}).sort('-created').populate('username', 'name username').exec(function(err, articles) {
        if (err) {
            res.render('error', {
                status: 500
            });
        } else {
            res.jsonp(articles);
        }
    });
};
