const async = require('async');
const { body, validationResult } = require('express-validator');
const Book = require('../models/book');
const Author = require('../models/author');
const Genre = require('../models/genre');
const BookInstance = require('../models/bookinstance');

exports.index = (req, res) => {
  async.parallel({
    book_count: (callback) => {
      Book.countDocuments({}, callback);
    },
    book_instance_count: (callback) => {
      BookInstance.countDocuments({}, callback);
    },
    book_instance_available_count: (callback) => {
      BookInstance.countDocuments({ status: 'Available' }, callback);
    },
    author_count: (callback) => {
      Author.countDocuments({}, callback);
    },
    genre_count: (callback) => {
      Genre.countDocuments({}, callback);
    },
  }, (err, results) => {
    res.render('index', { title: 'Local Library Home', error: err, data: results });
  });
};

// Display list of all books.
exports.book_list = (req, res, next) => {
  Book.find({}, 'title author')
    .populate('author').exec((err, listBooks) => {
      if (err) { return next(err); }
      // Successful, so render
      res.render('book_list', { title: 'Book List', book_list: listBooks });
      return null;
    });
};

// Display detail page for a specific book.
exports.book_detail = (req, res, next) => {
  async.parallel({
    book: (callback) => {
      Book.findById(req.params.id)
        .populate('author')
        .populate('genre')
        .exec(callback);
    },
    book_instance: (callback) => {
      BookInstance.find({ book: req.params.id })
        .exec(callback);
    },
  }, (err, results) => {
    if (err) { return next(err); }
    if (results.book == null) { // No results.
      const myErr = new Error('Book not found');
      myErr.status = 404;
      return next(myErr);
    }
    // Successful, so render.
    res.render('book_detail', { title: results.book.title, book: results.book, book_instances: results.book_instance });
    return null;
  });
};

// Display book create form on GET.
exports.book_create_get = (req, res, next) => {
  // Get all authors and genres, which we can use for adding to our book.
  async.parallel({
    authors: (callback) => {
      Author.find(callback);
    },
    genres: (callback) => {
      Genre.find(callback);
    },
  }, (err, results) => {
    if (err) { return next(err); }
    res.render('book_form', { title: 'Create Book', authors: results.authors, genres: results.genres });
    return null;
  });
};

// Handle book create on POST.
exports.book_create_post = [
  // Convert the genre to an array.
  (req, res, next) => {
    if (!(req.body.genre instanceof Array)) {
      if (typeof req.body.genre === 'undefined') {
        req.body.genre = [];
      } else {
        req.body.genre = new Array(req.body.genre);
      }
    }
    next();
  },

  // Validate and sanitize fields.
  body('title', 'Title must not be empty.').trim().isLength({ min: 1 }).escape(),
  body('author', 'Author must not be empty.').trim().isLength({ min: 1 }).escape(),
  body('summary', 'Summary must not be empty.').trim().isLength({ min: 1 }).escape(),
  body('isbn', 'ISBN must not be empty').trim().isLength({ min: 1 }).escape(),
  body('genre.*').escape(),

  // Process request after validation and sanitization.
  (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create a Book object with escaped and trimmed data.
    const book = new Book({
      title: req.body.title,
      author: req.body.author,
      summary: req.body.summary,
      isbn: req.body.isbn,
      genre: req.body.genre,
    });

    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values/error messages.
      // Get all authors and genres for form.
      async.parallel({
        authors: (callback) => {
          Author.find(callback);
        },
        genres: (callback) => {
          Genre.find(callback);
        },
      }, (err, results) => {
        if (err) { return next(err); }
        // Mark our selected genres as checked.
        for (let i = 0; i < results.genres.length; i += 1) {
          if (book.genre.indexOf(results.genres[i]._id) > -1) {
            results.genres[i].checked = 'true';
          }
        }
        res.render('book_form', {
          title: 'Create Book',
          authors: results.authors,
          genres: results.genres,
          book,
          errors: errors.array(),
        });
        return null;
      });
      return;
    }
    // Data from form is valid. Save book.
    book.save((err) => {
      if (err) { return next(err); }
      // Successful - redirect to new book record.
      res.redirect(book.url);
      return null;
    });
  },
];

// Display book delete form on GET.
exports.book_delete_get = (req, res, next) => {
  async.parallel({
    book: (callback) => {
      Book.findById(req.params.id).populate('author').populate('genre').exec(callback);
    },
    book_bookinstances: (callback) => {
      BookInstance.find({ book: req.params.id }).exec(callback);
    },
  }, (err, results) => {
    if (err) { return next(err); }
    if (results.book == null) { // No results.
      res.redirect('/catalog/books');
    }
    // Successful, so render.
    res.render('book_delete', { title: 'Delete Book', book: results.book, book_instances: results.book_bookinstances });
    return null;
  });
};

// Handle book delete on POST.
exports.book_delete_post = (req, res, next) => {
  // Assume the post has valid id (ie no validation/sanitization).

  async.parallel({
    book: (callback) => {
      Book.findById(req.body.id).populate('author').populate('genre').exec(callback);
    },
    book_bookinstances: (callback) => {
      BookInstance.find({ book: req.body.id }).exec(callback);
    },
  }, (err, results) => {
    if (err) { return next(err); }
    // Success
    if (results.book_bookinstances.length > 0) {
      // Book has book_instances. Render in same way as for GET route.
      res.render('book_delete', { title: 'Delete Book', book: results.book, book_instances: results.book_bookinstances });
      return null;
    }
    // Book has no BookInstance objects. Delete object and redirect to the list of books.
    Book.findByIdAndRemove(req.body.id, (myErr) => {
      if (myErr) { return next(myErr); }
      // Success - got to books list.
      res.redirect('/catalog/books');
      return null;
    });
    return null;
  });
};

// Display book update form on GET.
exports.book_update_get = (req, res, next) => {
  // Get book, authors and genres for form.
  async.parallel({
    book: (callback) => {
      Book.findById(req.params.id).populate('author').populate('genre').exec(callback);
    },
    authors: (callback) => {
      Author.find(callback);
    },
    genres: (callback) => {
      Genre.find(callback);
    },
  }, (err, results) => {
    if (err) { return next(err); }
    if (results.book == null) { // No results.
      const myErr = new Error('Book not found');
      myErr.status = 404;
      return next(myErr);
    }
    // Success.
    // Mark our selected genres as checked.
    for (let allGenreIter = 0; allGenreIter < results.genres.length; allGenreIter += 1) {
      for (let bookGenreIter = 0; bookGenreIter < results.book.genre.length; bookGenreIter += 1) {
        const theGenreId = results.genres[allGenreIter]._id.toString();
        const theBookGenreId = results.book.genre[bookGenreIter]._id.toString();
        if (theGenreId === theBookGenreId) {
          results.genres[allGenreIter].checked = 'true';
        }
      }
    }
    res.render('book_form', {
      title: 'Update Book',
      authors: results.authors,
      genres: results.genres,
      book: results.book,
    });
    return null;
  });
};

// Handle book update on POST.
exports.book_update_post = [
  // Convert the genre to an array.
  (req, res, next) => {
    if (!(req.body.genre instanceof Array)) {
      if (typeof req.body.genre === 'undefined') {
        req.body.genre = [];
      } else {
        req.body.genre = new Array(req.body.genre);
      }
    }
    next();
  },

  // Validate and santitize fields.
  body('title', 'Title must not be empty.').trim().isLength({ min: 1 }).escape(),
  body('author', 'Author must not be empty.').trim().isLength({ min: 1 }).escape(),
  body('summary', 'Summary must not be empty.').trim().isLength({ min: 1 }).escape(),
  body('isbn', 'ISBN must not be empty').trim().isLength({ min: 1 }).escape(),
  body('genre.*').escape(),

  // Process request after validation and sanitization.
  (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create a Book object with escaped/trimmed data and old id.
    const book = new Book({
      title: req.body.title,
      author: req.body.author,
      summary: req.body.summary,
      isbn: req.body.isbn,
      genre: (typeof req.body.genre === 'undefined') ? [] : req.body.genre,
      _id: req.params.id, // This is required, or a new ID will be assigned!
    });

    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values/error messages.

      // Get all authors and genres for form
      async.parallel({
        authors: (callback) => {
          Author.find(callback);
        },
        genres: (callback) => {
          Genre.find(callback);
        },
      }, (err, results) => {
        if (err) { return next(err); }
        // Mark our selected genres as checked.
        for (let i = 0; i < results.genres.length; i += 1) {
          if (book.genre.indexOf(results.genres[i]._id) > -1) {
            results.genres[i].checked = 'true';
          }
        }
        res.render('book_form', {
          title: 'Update Book',
          authors: results.authors,
          genres: results.genres,
          book,
          errors: errors.array(),
        });
        return null;
      });
      return;
    }
    // Data from form is valid. Update the record.
    Book.findByIdAndUpdate(req.params.id, book, {}, (err, theBook) => {
      if (err) { return next(err); }
      // Successful - redirect to book detail page.
      res.redirect(theBook.url);
      return null;
    });
  },
];
