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
        name: 'Adventure',
      });
      chai.request(server)
        .post('/catalog/genre/5fdfbaed5413ed1b3247bb0d')
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
        id: '5fdfddbbfe6b671b04831097',
      };
      chai.request(server)
        .post('/catalog/genre/5fdfddbbfe6b671b04831097/delete')
        .send(genre)
        .end((err, res) => {
          res.should.have.status(200);
          done();
        });
    });
  });
});
