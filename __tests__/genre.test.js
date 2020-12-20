const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../app');

const should = chai.should();

chai.use(chaiHttp);

describe('Genres', () => {
  describe('Create a genre', () => {
    it('It should not POST a genre with a name less than three characters', (done) => {
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
});
