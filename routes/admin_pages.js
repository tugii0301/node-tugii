var express = require('express');
const req = require('express/lib/request');
const { aggregate } = require('../models/page');
var router = express.Router();

//Get page model
var Page = require('../models/page');

//get pages index///////////////

router.get('/', function(req, res){
    Page.find({}).sort({sorting: 1}).exec(function(err, pages){
        res.render('admin/pages',{
           pages: pages
        });
    });
});


router.get('/test', function(req, res){
    res.send('admin test');
 });

 //get add page ///////////////

router.get('/add-page', function(req, res){

    var title = "";
    var slug = "";
    var content = "";

    res.render('admin/add_page', {
        title: title,
        slug:slug,
        content: content
    })
});

 //pOST add page ///////////////

 router.post('/add-page', function(req, res){
    console.log('add page');

    req.checkBody('title', 'Title must have a value.').notEmpty();
    req.checkBody('content', 'Content must have a value.').notEmpty();

    var title = req.body.title;
    // confirm.log(title)
    var slug = req.body.slug.replace(/\s+/g, '-').toLowerCase();
    // confirm.log(slug)
    if(slug == "") slug = title.replace(/\s+/g, '-').toLowerCase();
    var content = req.body.content;
    // confirm.log(content)
    var errors = req.validationErrors();

    if(errors){
        console.log('errors')
        res.render('admin/add_page', {
            errors: errors,
            title: title,
            slug: slug,
            content: content
        });
    }else{
        Page.findOne({slug: slug}, function(err, page){
            if(page){
                req.flash('danger', 'page slug exists choose another.');
                res.render('admin/add_page',{
                    title: title,
                    slug: slug,
                    content: content
                });
            }else{
                var page = new Page({
                    title: title,
                    slug : slug,
                    content: content,
                    sorting: 100,
                });
                page.save(function(err){
                    if(err) {
                        return console.log("aldaa: ", err);
                    }
                    req.flash('success', 'Page added');
                    res.redirect('/admin/pages');
                });
            }
        });
    }

});


//
//Post reorder pages ///////////////

router.post('reoeder-pages/', function(req, res){
    var ids = req.body['id[i]'];

    var count = 0;

    for(var i = 0;i < ids.lenght; i++){

    (function(count){

        page.sorting = count;
        page.save(function(err){
            if(err){ return console.log(err); }
        });
    })(count);

    }
});

 //get edit page ///////////////

 router.get('/edit-page/:id', function(req, res){

    Page.findById(req.params.id, function(err, page){
        if(err){   return console.log(err);     }


        res.render('admin/edit_page', {
            title: page.title,
            slug:page.slug,
            content: page.content,
            id: page._id
        });

    });

});


 //POST Edit page ///////////////

 router.post('/edit-page/:id', function(req, res){
    console.log('add page');

    req.checkBody('title', 'Title must have a value.').notEmpty();
    req.checkBody('content', 'Content must have a value.').notEmpty();

    var title = req.body.title;
    var slug = req.body.slug.replace(/\s+/g, '-').toLowerCase();
    if(slug == "") slug = title.replace(/\s+/g, '-').toLowerCase();
    var content = req.body.content;
    var id = req.params.id;

    var errors = req.validationErrors();

    if(errors){
        res.render('admin/edit_page', {
            errors: errors,
            title: title,
            slug: slug,
            content: content,
            id: id
        });
    }else{
        Page.findOne({slug: slug, _id :{'$ne': id}}, function(err, page){
            if(page){
                req.flash('danger', 'page slug exists choose another.');
                res.render('admin/edit_page',{
                    title: title,
                    slug: slug,
                    content: content,
                    id: id
                });
            }else{
                Page.findById(id, function(err, page){
                    if(err) return console.log(err);
                page.title = title;
                page.slug =slug;
                page.content =content;

                page.save(function(err){
                    if(err) return console.log(err);

                    req.flash('success', 'Page added');
                    res.redirect('/admin/pages/edit-page/' + id);
                })

                })

            }
        });
    }

})

//get Delete page ///////////////

router.get('/delete-page/:id', function(req, res){
    Page.findByIdAndRemove(req.params.id, function(err){
        if (err) return console.log(err);
        req.flash('success', 'Page deleted');
        res.redirect('/admin/pages/');
    });
});
//Exports
module.exports = router;