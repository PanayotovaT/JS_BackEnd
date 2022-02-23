const { create, getOne, deleteEstate } = require('../services/estateService');
const mapErrors = require('../util/mappers');

const router = require('express').Router();

router.get('/details/:id', async (req, res) => {

    
    const estate = await getOne(req.params.id);
    const isOwner = estate.owner._id == req.session.user?._id;
    res.locals.isOwner = isOwner;
    estate.rented = estate.rented.join(', ');
    res.render('details', { title: 'Details Page', ...estate })
});

router.get('/create', (req, res) => {
    res.render('create', { title: 'Create Page' });
});

router.post('/create', async (req, res) => {

    const estate = {
        name: req.body.name,
        type: req.body.type,
        year: Number(req.body.year),
        city: req.body.city,
        homeImg: req.body.homeImg,
        description: req.body.description,
        pieces: Number(req.body.pieces),
        owner: req.session.user._id,
    }

    try {
        await create(estate);
        res.redirect('/catalog');
    } catch (err) {
        const errors = mapErrors(err);
        res.render('create', { title: 'Create Page', data: estate, errors });
    }
})

router.get('/edit', (req, res) => {
    res.render('edit', { title: 'Edit Page' });
});

router.get('/delete', async (req, res) => {
    await deleteEstate(req.params.id);
    res.redirect('/catalog')
})

router.p
module.exports = router;