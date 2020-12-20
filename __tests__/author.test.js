const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../app');
const Author = require('../models/author');

const should = chai.should();

chai.use(chaiHttp);

describe('Authors', () => {
  describe('Create an author', () => {
    it('It should add an author', (done) => {
      const author = Author({
        first_name: 'Ricardo',
        family_name: 'Gamero',
        date_of_birth: '1837-09-20',
        date_of_death: '1925-12-21',
      });
      chai.request(server)
        .post('/catalog/author/create')
        .send(author)
        .end((err, res) => {
          res.should.have.status(200);
          done();
        });
    });
  });

  describe('Update an author', () => {
    it('It should update an author given the id', (done) => {
      const author = Author({
        first_name: 'Pedro',
        family_name: 'Aquino',
      });
      chai.request(server)
        .post('/catalog/author/5f67ed4695600d1abe808a1e/update')
        .send(author)
        .end((err, res) => {
          res.should.have.status(200);
          done();
        });
    });
  });

  describe('Delete an author', () => {
    it('It should remove an author given the id', (done) => {
      const author = {
        authorid: '5fdfcf2fb0e6a60f75bf81f7',
      };
      chai.request(server)
        .post('/catalog/author/5fdfcf2fb0e6a60f75bf81f7/delete')
        .send(author)
        .end((err, res) => {
          res.should.have.status(200);
          done();
        });
    });
  });
});
