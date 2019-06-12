module.exports = (req, res, next)=>{

    if(!req.user){
        res.redirect('/account/login')
    }
    else{
        next()
    }
}