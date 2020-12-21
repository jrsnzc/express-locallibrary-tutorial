const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../app');
const Genre = require('../models/genre');

const should = chai.should();

chai.use(chaiHttp);

describe('Genres', () => {
  describe('Create a genre', () => {
    it('It should not add a genre with a name less than three characters', (done) => {
      const genre = {
        name: 'Ab',
      };
      chai.request(server)
        .post('/catalog/genre/create')
        .send(genre)
        .end((err, res) => {
          res.should.have.status(200);
          done();
        });
    });
  });

  describe('Update a genre', () => {
    it('It should update a genre given the id', (done) => {
      const genre = Genre({
        name: 'Romance',
      });
      chai.request(server)
        .post('/catalog/genre/5fdffcd42b50e20e63f8cf2e/update')
        .send(genre)
        .end((err, res) => {
          res.should.have.status(200);
          done();
        });
    });
  });

  describe('Delete a genre', () => {
    it('It should remove a genre given the id', (done) => {
      const genre = {
        id: '5fdffcd42b50e20e63f8cf2e',
      };
      chai.request(server)
        .post('/catalog/genre/5fdffcd42b50e20e63f8cf2e/delete')
        .send(genre)
        .end((err, res) => {
          res.should.have.status(200);
          done();
        });
    });
  });
});
