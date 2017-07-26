//
const chai = require('chai');
const chaiHttp = require('chai-http');
const { app, runServer, closeServer } = require('../server');
const should = chai.should();

describe('Recipes', () => {
    before(() => {
        return runServer();
    });
    after(() => {
        return closeServer();
    });

    it('GET returns a list of recipes', () => {
        return chai.request(app)
            .get('/recipes')
            .then((res) => {
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a('array');
            });
    });

    it('POST adds recipes', () => {
        const newRecipe = {
            name: 'boiled white rice',
            ingredients: ['1 cup white rice', '2 cups water', 'pinch of salt']
        };
        return chai.request(app)
            .get('/recipes')
            .then(function(res) {

                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a('array');
                res.body.should.have.length.of.at.least(1);
                res.body.forEach(function(item) {
                    item.should.be.a('object');
                    item.should.include.keys('id', 'name', 'ingredients');
                });
            });
    });

    it('shoud update recipes in PUT', () => {
        const updateData = {
            name: 'rice',
            ingredients: ['1 cup white rice', '2 cups water', 'pinch of salt']
        };
        return chai.request(app)
            .get('/recipes')
            .then((res) => {
                updateData.id = res.body[0].id;

                return chai.request(app)
                    .put(`/recipes/${updateData.id}`)
                    .send(updateData)
            })
            .then((res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.include.keys('id', 'name', 'ingredients');
                res.body.name.should.equal(updateData.name);
                res.body.id.should.equal(updateData.id);
                res.body.ingredients.should.include.members(updateData.ingredients);
            });
    });
    it('should DELETE recipes', () => {
        return chai.request(app)
            .get('/recipes')
            .then(function(res) {
                return chai.request(app)
                    .delete(`/recipes/${res.body[0].id}`)
            })
            .then((res) => {
                res.should.have.status(204);
            });
    });
});