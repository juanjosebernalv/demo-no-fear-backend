const mongoose = require('mongoose');
const { authorSchema, blogSchema } = require('./schemas');

const authorModel = mongoose.model('Author', authorSchema);
const blogModel = mongoose.model('Blog', blogSchema);

module.exports = {
  authorModel,
  blogModel
};