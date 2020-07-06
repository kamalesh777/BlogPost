var mongoose = require('mongoose');
mongoose.connect('mongodb+srv://kammo777:blog123@blog-juyj6.mongodb.net/blog', { useNewUrlParser: true, useUnifiedTopology: true });

  var Schema = mongoose.Schema;
  const passportLocalMongoose = require('passport-local-mongoose');
  var userSchema = new Schema({
    username: String,
    email: String,
    password: String,
    gender: String,
    date: String,
  });
  userSchema.plugin(passportLocalMongoose);
  
  var userModel = mongoose.model("userAccount", userSchema);

  module.exports = userModel;