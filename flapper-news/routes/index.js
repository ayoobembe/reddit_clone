var express = require('express');
var router = express.Router();


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


var mongoose = require('mongoose');
var Post = mongoose.model('Post');
var Comment = mongoose.model('Comment');


router.get('/posts', function(req, res, next) {
  Post.find(function(err, posts) {
    if(err){ return next(err); }

    res.json(posts);
  });
});


router.post('/posts', function(req, res, next) {
  var post = new Post(req.body);

  post.save(function(err, post) {
    if(err){ return next(err); }

    res.json(post);
  });
});


router.param('post', function(req, res, next, id) {
  var query = Post.findById(id);

  query.exec(function(err, post) {
    if(err) { return next(err); }
    if(!post) {return next(new Error('can\'t find post')); }

    req.post = post;
    return next();
  });
});


// testing
// test22: 552e91e8b07e69d705a88b6f
// comment = test: 552fbb313ce3153609d4c7e8


router.param('comment', function(req, res, next, id) {
  var query = Comment.findById(id);

  query.exec(function(err, comment) {
    if(err) { return next(err); }
    if(!comment) { return next(new Error('can\'t find comment')); }

    req.comment = comment
    return next()
  });
});


router.put('/posts/:post/comments/:comment/upvote', function(req, res, next) {
  req.comment.upvote(function(err, comment) {
    if(err) {return next(err); }

    res.json(comment);
  });
});


//don't think it's loading the comments properly ... check later.
router.get('/posts/:post', function(req, res) {
  req.post.populate('comments', function(err, post) {
    if(err) { return next(err); }

    res.json(post);
  });

});


router.put('/posts/:post/upvote', function(req, res, next) {
  req.post.upvote(function(err, post) {
    if (err) { return next(err); }

    res.json(post);
  });
});


router.post('/posts/:post/comment', function(req, res, next) {
  var comment = new Comment(req.body);
  comment.post = req.post;

  comment.save(function(err, comment) {
    if(err) { return next(err); }

    req.post.comments.push(comment);
    req.post.save(function(err, post) {
      if(err) { return next(err); }

      res.json(comment);
    });
  });
});



module.exports = router;
