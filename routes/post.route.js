var express = require('express');
var router = express.Router();

var postModel = require('../models/post.model');
var commentModel = require('../models/comment.model')

router.get('/', (req, res, next) => {


    // throw new Error('This is an error for test!')

    var catId = req.query.cat
    var postId = req.query.post
    if (isNaN(postId) || isNaN(postId)) {
        throw new Error('Id is not a number!')
    }
    Promise.all([
        postModel.single1(postId),
        postModel.commentByPostID(postId),
        postModel.postCungChuyenMuc(catId, postId)
    ])
        .then(([rows, comments, cungchuyenmuc]) => {
            res.render('vwProducts/viewDetail', {
                danhMuc: rows[0].CatName,
                post: rows[0],
                comments,
                cungchuyenmuc
            })
        })
        .catch(err => {
            console.log(err)
            next()
        })
})

router.post('/', (req, res, next) => {
    
    var catId = req.query.cat
    var postId = req.query.post

    var name = req.body.commenter
    var content = req.body.content
    var today = new Date();
    var datePost = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()} ${today.getHours()}:${today.getMinutes()}:${today.getSeconds()}`;

    var comment = {
        PostID: postId,
        date: datePost,
        commenter: name,
        content: content,
    }
    commentModel.add(comment)
        .then(id => {
            res.redirect(`/post?cat=${catId}&post=${postId}`)
        })
        .catch(err => {
            console.log(err)
            next()
        })
})

module.exports = router;