module.exports = {
   
    async details(req, res) {
        const id = req.params.id;
        const car = await req.storage.getOne(id);
        console.log(car);
        if(car) {
            res.render('details', { ...car, title: 'Car Details' });
        } else {
            res.redirect('/404');
        }
    }
}