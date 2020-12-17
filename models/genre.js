const mongoose = require('mongoose');

const GenreSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 100,
  },
});

// Virtual for this genre instance URL.
GenreSchema
  .virtual('url')
  .get(function toString() {
    return `/catalog/genre/${this._id}`;
  });

// Export model.
module.exports = mongoose.model('Genre', GenreSchema);
