const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../app');

const should = chai.should();

chai.use(chaiHttp);

describe('Books', () => {
  describe('Create a book', () => {
    it('It should not POST a book without author field', (done) => {
      const book = {
        title: 'Mi Planta de Naranja Lima',
        summary: 'Cuenta la vida de un niño de 5 años llamado Zezé, este es un niño muy travieso e independiente, el vive en una familia muy numerosa y pobre debido a que su padre no tiene empleo...',
        isbn: '999899773',
      };
      chai.request(server)
        .post('/catalog/book/create')
        .send(book)
        .end((err, res) => {
          res.should.have.status(500);
          done();
        });
    });
    it('It should POST a book', (done) => {
      const book = {
        title: 'Mi Planta de Naranja Lima',
        author: '5fdf7255615474082d10bb92',
        summary: 'Cuenta la vida de un niño de 5 años llamado Zezé, este es un niño muy travieso e independiente, el vive en una familia muy numerosa y pobre debido a que su padre no tiene empleo...',
        isbn: '999899773',
      };
      chai.request(server)
        .post('/catalog/book/create')
        .send(book)
        .end((err, res) => {
          res.should.have.status(200);
          done();
        });
    });
  });
});
