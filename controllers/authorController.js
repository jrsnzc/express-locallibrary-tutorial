const async = require('async');
const { body, validationResult } = require('express-validator');
const Author = require('../models/author');
const Book = require('../models/book');

// Display list of all Authors.
exports.author_list = (req, res, next) => {
  Author.find()
    .sort([['family_name', 'ascending']])
    .exec((err, listAuthors) => {
      if (err) { return next(err); }
      // Successful, so render.
      res.render('author_list', { title: 'Author List', author_list: listAuthors });
      return null;
    });
};

// Display detail page for a specific Author.
exports.author_detail = (req, res, next) => {
  async.parallel({
    author: (callback) => {
      Author.findById(req.params.id)
        .exec(callback);
    },
    authors_books: (callback) => {
      Book.find({ author: req.params.id }, 'title summary')
        .exec(callback);
    },
  }, (err, results) => {
    if (err) { return next(err); } // Error in API usage.
    if (results.author == null) { // No results.
      const myErr = new Error('Author not found');
      myErr.status = 404;
      return next(myErr);
    }
    // Successful, so render.
    res.render('author_detail', { title: 'Author Detail', author: results.author, author_books: results.authors_books });
    return null;
  });
};

// Display Author create form on GET.
exports.author_create_get = (req, res, next) => {
  res.render('author_form', { title: 'Create Author' });
};

// Handle Author create on POST.
exports.author_create_post = [

  // Validate and sanitize fields.
  body('first_name')
    .trim().isLength({ min: 1 }).escape()
    .withMessage('First name must be specified.')
    .isAlphanumeric()
    .withMessage('First name has non-alphanumeric characters.'),
  body('family_name')
    .trim().isLength({ min: 1 }).escape()
    .withMessage('Family name must be specified.')
    .isAlphanumeric()
    .withMessage('Family name has non-alphanumeric characters.'),
  body('date_of_birth', 'Invalid date of birth').optional({ checkFalsy: true }).isISO8601().toDate(),
  body('date_of_death', 'Invalid date of death').optional({ checkFalsy: true }).isISO8601().toDate(),

  // Process request after validation and sanitization.
  (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create Author object with escaped and trimmed data
    const author = new Author({
      first_name: req.body.first_name,
      family_name: req.body.family_name,
      date_of_birth: req.body.date_of_birth,
      date_of_death: req.body.date_of_death,
    });

    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values/errors messages.
      res.render('author_form', { title: 'Create Author', author, errors: errors.array() });
      return;
    }
    // Data from form is valid.
    // Save author.
    author.save((err) => {
      if (err) { return next(err); }
      // Successful - redirect to new author record.
      res.redirect(author.url);
      return null;
    });
  },
];

// Display Author delete form on GET.
exports.author_delete_get = (req, res, next) => {
  async.parallel({
    author: (callback) => {
      Author.findById(req.params.id).exec(callback);
    },
    authors_books: (callback) => {
      Book.find({ author: req.params.id }).exec(callback);
    },
  }, (err, results) => {
    if (err) { return next(err); }
    if (results.author == null) { // No results.
      res.redirect('/catalog/authors');
    }
    // Successful, so render.
    res.render('author_delete', { title: 'Delete Author', author: results.author, author_books: results.authors_books });
    return null;
  });
};

// Handle Author delete on POST.
exports.author_delete_post = (req, res, next) => {
  async.parallel({
    author: (callback) => {
      Author.findById(req.body.authorid).exec(callback);
    },
    authors_books: (callback) => {
      Book.find({ author: req.body.authorid }).exec(callback);
    },
  }, (err, results) => {
    if (err) { return next(err); }
    // Success.
    if (results.authors_books.length > 0) {
      // Author has books. Render in same way as for GET route.
      res.render('author_delete', { title: 'Delete Author', author: results.author, author_books: results.authors_books });
      return null;
    }
    // Author has no books. Delete object and redirect to the list of authors.
    Author.findByIdAndRemove(req.body.authorid, (myErr) => {
      if (myErr) { return next(myErr); }
      // Success - go to author list.
      res.redirect('/catalog/authors');
      return null;
    });
    return null;
  });
};

// Display Author update form on GET.
exports.author_update_get = (req, res, next) => {
  Author.findById(req.params.id, (err, author) => {
    if (err) { return next(err); }
    if (author == null) { // No results.
      const myErr = new Error('Author not found');
      myErr.status = 404;
      return next(myErr);
    }
    // Success.
    res.render('author_form', { title: 'Update Author', author });
    return null;
  });
};

// Handle Author update on POST.
exports.author_update_post = [
  // Validate and santize fields.
  body('first_name')
    .trim().isLength({ min: 1 }).escape()
    .withMessage('First name must be specified.')
    .isAlphanumeric()
    .withMessage('First name has non-alphanumeric characters.'),
  body('family_name')
    .trim().isLength({ min: 1 }).escape()
    .withMessage('Family name must be specified.')
    .isAlphanumeric()
    .withMessage('Family name has non-alphanumeric characters.'),
  body('date_of_birth', 'Invalid date of birth').optional({ checkFalsy: true }).isISO8601().toDate(),
  body('date_of_death', 'Invalid date of death').optional({ checkFalsy: true }).isISO8601().toDate(),

  // Process request after validation and sanitization.
  (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);
    // Create Author object with escaped and trimmed data (and the old id!)
    const author = new Author({
      first_name: req.body.first_name,
      family_name: req.body.family_name,
      date_of_birth: req.body.date_of_birth,
      date_of_death: req.body.date_of_death,
      _id: req.params.id,
    });

    if (!errors.isEmpty()) {
      // There are errors. Render the form again with sanitized values and error messages.
      res.render('author_form', { title: 'Update Author', author, errors: errors.array() });
      return;
    }
    // Data from form is valid. Update the record.
    Author.findByIdAndUpdate(req.params.id, author, {}, (err, theAuthor) => {
      if (err) { return next(err); }
      // Successful - redirect to genre detail page.
      res.redirect(theAuthor.url);
      return null;
    });
  },
];
