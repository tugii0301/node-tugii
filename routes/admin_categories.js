var express = require('express');
const req = require('express/lib/request');
const { aggregate } = require('../models/page');
var router = express.Router();

//Get category model
var Category = require('../models/category');

//get pages index///////////////

router.get('/', function(req, res){
    Category.find(function(err, categories){
        if(err) return console.log(err);
        res.render('admin/categories',{
            categories: categories
        });
    });
});


router.get('/test', function(req, res){
    res.send('admin test');
 });

 //get add category ///////////////

router.get('/add-category', function(req, res){

    var title = "";

    res.render('admin/add_category', {
        title: title,

    })
});

 //pOST add category ///////////////

 router.post('/add-category', function(req, res){

    req.checkBody('title', 'Title must have a value.').notEmpty();

    var title = req.body.title;
    var slug = title.replace(/\s+/g, '-').toLowerCase();

    var errors = req.validationErrors();

    if(errors){
        console.log('errors')
        res.render('admin/add_category', {
            errors: errors,
            title: title
        });
    }else{
        Category.findOne({slug: slug}, function(err, category){
            if(category){
                req.flash('danger', 'Category title exists choose another.');
                res.render('admin/add_category',{
                    title: title
                });
            }else{
                var category = new Category({
                    title: title,
                    slug : slug
                });
                category.save(function(err){
                    if(err) {
                        return console.log("aldaa: ", err);
                    }
                    req.flash('success', 'Category added');
                    res.redirect('/admin/categories');
                });
            }
        });
    }

});


 //get edit Category ///////////////

 router.get('/edit-category/:id', function(req, res){

    Category.findById(req.params.id, function(err, category){
        if(err){   return console.log(err);     }

        res.render('admin/edit_category', {
            title: category.title,
            id: category._id
        });

    });

});


 //POST Edit Category ///////////////

 router.post('/edit-category/:id', function(req, res){
    console.log('add page');

    req.checkBody('title', 'Title must have a value.').notEmpty();


    var title = req.body.title;
    var slug = title.replace(/\s+/g, '-').toLowerCase();
    var id = req.params.id;

    var errors = req.validationErrors();

    if(errors){
        res.render('admin/edit_category', {
            errors: errors,
            title: title,
            id: id
        });
    }else{
        Category.findOne({slug: slug, _id :{'$ne': id}}, function(err, category){
            if(category){
                req.flash('danger', 'Category title exists choose another.');
                res.render('admin/edit_category',{
                    title: title,
                    id: id
                });
            }else{
                Category.findById(id, function(err, category){
                    if(err) return console.log(err);
                category.title = title;
                category.slug =slug;

                category.save(function(err){
                    if(err) return console.log(err);

                    req.flash('success', 'Category edit');
                    res.redirect('/admin/categories/edit-category/' + id);
                })

                })

            }
        });
    }

})

//get Delete page ///////////////

router.get('/delete-category/:id', function(req, res){
    Category.findByIdAndRemove(req.params.id, function(err){
        if (err) return console.log(err);
        req.flash('success', 'Category deleted');
        res.redirect('/admin/categories/');
    });
});
//Exports
module.exports = router;