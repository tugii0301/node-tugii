var express = require('express');
var router = express.Router();

router.get('/', function(reg, res){
    res.render('index', {
       title: 'Home'
    });
 });

router.get('/test', function(reg, res){
   res.send('page test');
});

//Exports
module.exports = router;