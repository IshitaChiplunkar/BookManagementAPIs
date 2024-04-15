const mongoose = require("mongoose");

//Creating a Schema
const BookSchema = mongoose.Schema({
    ISBN: String,
    title: String,
    authors: [Number],
    languages: String,
    numPage: Number,
    publication: Number,
    pubDate: String,
    category: [String]
});

const BookModel = mongoose.model('books',BookSchema);
module.exports = BookModel;