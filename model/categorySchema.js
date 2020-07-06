var mongoose = require('mongoose');
mongoose.connect('mongodb+srv://kammo777:blog123@blog-juyj6.mongodb.net/blog', { useNewUrlParser: true, useUnifiedTopology: true });

  var Schema = mongoose.Schema;

  var categorySchema = new Schema({
    author : {
      id : String,
      name : String
    },
    category : String,
    date : String,
  });

  var categoryModel = mongoose.model("category", categorySchema);

  module.exports = categoryModel;