const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../app');
const Book = require('../models/book');

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

  describe('Update a book', () => {
    it('It should update a book given the id', (done) => {
      const book = Book({
        title: 'Alicia en el Pais de las Maravillas',
        author: '5fdfd78579e83f14f83c3f4a',
        summary: 'Alicia empezaba ya a cansarse de estar sentada con su hermana a la orilla del río, sin tener nada que...',
        isbn: 'ISBN12341234',
        genre: ['5f67ed4995600d1abe808a23'],
      });
      chai.request(server)
        .post('/catalog/book/5fdfcc983c0ecc0afbfa7372/update')
        .send(book)
        .end((err, res) => {
          res.should.have.status(200);
          done();
        });
    });
  });

  describe('Delete a book', () => {
    it('It should remove a book given the id', (done) => {
      const book = {
        id: '5fdb998b916a3e51faa9cfc1',
      };
      chai.request(server)
        .post('/catalog/book/5fdb998b916a3e51faa9cfc1/delete')
        .send(book)
        .end((err, res) => {
          res.should.have.status(200);
          done();
        });
    });
  });
});
