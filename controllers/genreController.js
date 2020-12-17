const async = require('async');
const { body, validationResult } = require('express-validator');
const Genre = require('../models/genre');
const Book = require('../models/book');

// Display list of all Genre.
exports.genre_list = (req, res, next) => {
  Genre.find()
    .sort([['name', 'ascending']])
    .exec((err, listGenres) => {
      if (err) { return next(err); }
      // Successful, so render.
      res.render('genre_list', { title: 'Genre List', list_genres: listGenres });
      return null;
    });
};

// Display detail page for a specific Genre.
exports.genre_detail = (req, res, next) => {
  async.parallel({
    genre: (callback) => {
      Genre.findById(req.params.id)
        .exec(callback);
    },
    genre_books: (callback) => {
      Book.find({ genre: req.params.id })
        .exec(callback);
    },
  }, (err, results) => {
    if (err) { return next(err); }
    if (results.genre == null) { // No results.
      const myErr = new Error('Genre not found');
      myErr.status = 404;
      return next(myErr);
    }
    // Successful, so render.
    res.render('genre_detail', { title: 'Genre Detail', genre: results.genre, genre_books: results.genre_books });
    return null;
  });
};

// Display Genre create form on GET.
exports.genre_create_get = (req, res, next) => {
  res.render('genre_form', { title: 'Create Genre' });
};

// Handle Genre create on POST.
exports.genre_create_post = [
  // Validate and santise the name field.
  body('name', 'Genre name must contain at least 3 characters').trim().isLength({ min: 3 }).escape(),

  // Process request after validation and sanitization.
  (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create a genre object with escaped and trimmed data.
    const genre = new Genre(
      { name: req.body.name },
    );

    if (!errors.isEmpty()) {
      // There are errors. Render the form again with sanitized values/error messages.
      res.render('genre_form', { title: 'Create Genre', genre, errors: errors.array() });
      return;
    }
    // Data from form is valid.
    // Check if Genre with same name already exists.
    Genre.findOne({ name: req.body.name })
      .exec((err, foundGenre) => {
        if (err) { return next(err); }
        if (foundGenre) {
          // Genre exists, redirect to its detail page.
          res.redirect(foundGenre.url);
        } else {
          genre.save((myErr) => {
            if (myErr) { return next(myErr); }
            // Genre saved. Redirect to genre detail page.
            res.redirect(genre.url);
            return null;
          });
        }
        return null;
      });
  },
];

// Display Genre delete form on GET.
exports.genre_delete_get = (req, res, next) => {
  async.parallel({
    genre: (callback) => {
      Genre.findById(req.params.id).exec(callback);
    },
    genre_books: (callback) => {
      Book.find({ genre: req.params.id }).exec(callback);
    },
  }, (err, results) => {
    if (err) { return next(err); }
    if (results.genre == null) { // No results.
      res.redirect('/catalog/genres');
    }
    // Successful, so render.
    res.render('genre_delete', { title: 'Delete Genre', genre: results.genre, genre_books: results.genre_books });
    return null;
  });
};

// Handle Genre delete on POST.
exports.genre_delete_post = (req, res, next) => {
  async.parallel({
    genre: (callback) => {
      Genre.findById(req.params.id).exec(callback);
    },
    genre_books: (callback) => {
      Book.find({ genre: req.params.id }).exec(callback);
    },
  }, (err, results) => {
    if (err) { return next(err); }
    // Success
    if (results.genre_books.length > 0) {
      // Genre has books. Render in same way as for GET route.
      res.render('genre_delete', { title: 'Delete Genre', genre: results.genre, genre_books: results.genre_books });
      return null;
    }
    // Genre has no books. Delete object and redirect to the list of genres.
    Genre.findByIdAndRemove(req.body.id, (myErr) => {
      if (myErr) { return next(myErr); }
      // Success - go to genres list.
      res.redirect('/catalog/genres');
      return null;
    });
    return null;
  });
};

// Display Genre update form on GET.
exports.genre_update_get = (req, res, next) => {
  Genre.findById(req.params.id, (err, genre) => {
    if (err) { return next(err); }
    if (genre == null) { // No results.
      const myErr = new Error('Genre not found');
      myErr.status = 404;
      return next(myErr);
    }
    // Success.
    res.render('genre_form', { title: 'Update Genre', genre });
    return null;
  });
};

// Handle Genre update on POST.
exports.genre_update_post = [
  // Validate and sanitze the name field.
  body('name', 'Genre name must contain at least 3 characters').trim().isLength({ min: 3 }).escape(),

  // Process request after validation and sanitization.
  (req, res, next) => {
    // Extract the validation errors from a request .
    const errors = validationResult(req);

    // Create a genre object with escaped and trimmed data (and the old id!)
    const genre = new Genre({
      name: req.body.name,
      _id: req.params.id,
    });

    if (!errors.isEmpty()) {
      // There are errors. Render the form again with sanitized values and error messages.
      res.render('genre_form', { title: 'Update Genre', genre, errors: errors.array() });
      return;
    }
    // Data from form is valid. Update the record.
    Genre.findByIdAndUpdate(req.params.id, genre, {}, (err, theGenre) => {
      if (err) { return next(err); }
      // Successful - redirect to genre detail page.
      res.redirect(theGenre.url);
      return null;
    });
  },
];
