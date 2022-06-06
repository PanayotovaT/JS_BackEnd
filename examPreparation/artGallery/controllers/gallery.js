const { Router } = require('express');
const galleryService = require('../services/galleryService');
const preload = require('../middlewares/preload');
const { isUser, isOwner } = require('../middlewares/guards');

const router = Router();


router.get('/create-publication', isUser(), (req, res ) => {
    res.render('create', {title: 'Create Page'});
});

router.post('/create-publication', isUser(), async (req, res) => {
    const title = req.body.title.trim();
    const technique = req.body.technique.trim();
    const imageUrl = req.body.imageUrl.trim();
    const certificate = req.body.certificate.trim();
    
    const publication = {
        title,
        technique,
        imageUrl,
        certificate,
        author: req.session.user._id,
    }
    try {
        await galleryService.createPublication(publication);
        res.redirect('/');
    } catch(err) {
        console.log(err);
        res.render('create', { title: 'Create page', publication});
    }  
});

router.get('/details/:id', preload(), (req, res) => {
    const isOwner = res.locals.publication.author._id == req.session.user?._id;
    res.locals.isOwner = isOwner;
    res.render('details', {title: 'Details Page'})

})

router.get('/edit-publication/:id', preload(), isOwner(), (req, res) => {
    res.render('edit', {title: 'Edit Page'});
});

router.post('/edit-publication/:id', preload(), isOwner(), async (req, res) => {
    const publication = {
        title: req.body.title,
        technique: req.body.technique,
        imageUrl: req.body.imageUrl,
        certificate: req.body.certificate,
    }

    try{
        await galleryService.updatePublication(req.params.id, publication);
        res.redirect('/details/' + req.params.id);
    }catch(err) {
        console.log(err)
        res.render('edit', {title: 'Edit page', publication});
    }
});

router.get('/delete-publication/:id', preload(), isOwner(), async (req, res) => {
    console.log(req.params.id);
    try {
        await galleryService.deletePublication(req.params.id);
        res.redirect('/');
    }catch(err) {
        console.log(err);
        res.redirect('/details/' + req.params.id);
    }
})

module.exports = router;

