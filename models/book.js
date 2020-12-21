const mongoose = require('mongoose');

const BookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: mongoose.Schema.ObjectId, ref: 'Author', required: true },
  summary: { type: String, required: true },
  isbn: { type: String, required: true },
  genre: [{ type: mongoose.Schema.ObjectId, ref: 'Genre' }],
});

// Virtual for this book instance URL.
BookSchema
  .virtual('url')
  .get(function toString() {
    return `/catalog/book/${this._id}`;
  });

// Export model.
module.exports = mongoose.model('Book', BookSchema);
