var mongoose = require('mongoose');
mongoose.connect('mongodb+srv://kammo777:blog123@blog-juyj6.mongodb.net/blog', { useNewUrlParser: true, useUnifiedTopology: true , useFindAndModify:false});


var blogSchema = new mongoose.Schema({
    author : {
      id : String,
      name : String
    },
    title: String,
    imageUrl: String,
    content: String,
    categories: Array,
    comments: [{ cName: String, body: String, date: String }],
    date: String,
    publish: Boolean,
    meta: {
        votes: Number,
        favs:  Number
      }

});

var blogModel = mongoose.model("blogPost", blogSchema);

module.exports = blogModel;