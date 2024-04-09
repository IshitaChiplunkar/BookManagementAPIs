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
    category: [Number]
});

//Creating a book model
const BookModel = mongoose.model(BookSchema);

module.exports = BookModel;