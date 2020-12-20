const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../app');
const Author = require('../models/author');

const should = chai.should();

chai.use(chaiHttp);

describe('Authors', () => {
  describe('Author update', () => {
    it('It should update an author given the id', (done) => {
      const author = Author({
        first_name: 'Ricardo',
        family_name: 'Gamero',
      });
      chai.request(server)
        .post('/catalog/author/5f67ed4995600d1abe808a21/update')
        .send(author)
        .end((err, res) => {
          res.should.have.status(200);
          done();
        });
    });
  });
});
