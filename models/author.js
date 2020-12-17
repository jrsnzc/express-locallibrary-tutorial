const mongoose = require('mongoose');
const { DateTime } = require('luxon'); // for date handling

const AuthorSchema = new mongoose.Schema({
  first_name: { type: String, required: true, maxlength: 100 },
  family_name: { type: String, required: true, maxlength: 100 },
  date_of_birth: { type: Date },
  date_of_death: { type: Date },
});

// Virtual for author "full" name.
AuthorSchema.virtual('name').get(function toString() {
  return `${this.family_name}, ${this.first_name}`;
});

// Virtual for this author instance URL.
AuthorSchema.virtual('url').get(function toString() {
  return `/catalog/author/${this._id}`;
});

AuthorSchema.virtual('lifespan').get(function toString() {
  let lifetimeString = '';
  if (this.date_of_birth) {
    lifetimeString = DateTime.fromJSDate(this.date_of_birth).toLocaleString(DateTime.DATE_MED);
  }
  lifetimeString += ' - ';
  if (this.date_of_death) {
    lifetimeString += DateTime.fromJSDate(this.date_of_death).toLocaleString(DateTime.DATE_MED);
  }
  return lifetimeString;
});

AuthorSchema.virtual('date_of_birth_yyyy_mm_dd').get(function toString() {
  return DateTime.fromJSDate(this.date_of_birth).toISODate(); // format 'YYYY-MM-DD'
});

AuthorSchema.virtual('date_of_death_yyyy_mm_dd').get(function toString() {
  return DateTime.fromJSDate(this.date_of_death).toISODate(); // format 'YYYY-MM-DD'
});

// Export model.
module.exports = mongoose.model('Author', AuthorSchema);
