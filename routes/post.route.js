var express = require('express');
var router = express.Router();

var postModel = require('../models/post.model');
var commentModel = require('../models/comment.model')

router.get('/:id', (req, res, next) => {


    // throw new Error('This is an error for test!')

    var id = req.params.id
    if (isNaN(id)) {
        throw new Error('Id is not a number!')
    }
    Promise.all([
        postModel.single(id),
        postModel.commentByPostID(id)
    ])
        .then(([rows, comments]) => {
            res.render('vwProducts/viewDetail', {
                danhMuc: rows[0].CatName,
                post: rows[0],
                comments
            })
        })
        .catch(err => {
            console.log(err)
            next()
        })
})

router.post('/:id', (req, res, next) => {
    var idPost = req.params.id;
    var name = req.body.commenter
    var content = req.body.content
    var today = new Date();
    var datePost = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()} ${today.getHours()}:${today.getMinutes()}:${today.getSeconds()}`;

    var comment = {
        PostID: idPost,
        date: datePost,
        commenter: name,
        content: content,
    }
    commentModel.add(comment)
        .then(id =>{
            res.render(`/post/${idPost}`)
        })
        .catch(err => {
            console.log(err)
            next()
        })
})

module.exports = router;