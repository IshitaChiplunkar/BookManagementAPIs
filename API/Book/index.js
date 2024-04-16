const Router = require("express").Router;

//Books
//GET Method API
/*
Route:                 /books
Description:           To get all the books from database
Access:                Public
Parameters:            none
Method:                GET
*/
Router.get("/books", async (req, res) => {
    const getBooks = await BookModel.find();
    return res.json({ books: getBooks });
})

/*
Route:                 /books
Description:           To get specific book from database
Access:                Public
Parameters:            isbn
Method:                GET
*/
Router.get("/book/:isbn", async (req, res) => {

    const specificBook = await BookModel.findOne({ISBN: req.params.isbn});
    //const specificBook = database.books.filter((book) => book.ISBN === req.params.isbn);

    if (!specificBook) {
        return res.json({ error: `No book found with ISBN: ${req.params.isbn}` });
    }
    return res.json({ book: specificBook });
})

/*
Route:                 /books/cat
Description:           To get specific books from database based on category
Access:                Public
Parameters:            categoryName
Method:                GET
*/
Router.get("/book/cat/:categoryName", async (req, res) => {
    
    const categorySpecificBooks = await BookModel.findOne({category: req.params.categoryName});
    //const categorySpecificBooks = database.books.filter((book) => book.category.includes(req.params.categoryName));

    if (!categorySpecificBooks) {
        return res.json({ error: `No book found with category: ${req.params.categoryName}` });
    }
    return res.json({ books: categorySpecificBooks });
})

/*
Route:                 /books/auth
Description:           To get specific books from database based on authorId
Access:                Public
Parameters:            authId
Method:                GET
*/
Router.get("/book/auth/:authId", async (req, res) => {
    //const authorSpecificBooks = database.books.filter((book) => book.authors.includes(parseInt(req.params.authId)));

    const authorSpecificBooks = await BookModel.findOne({authors: req.params.authId});
    if (!authorSpecificBooks) {
        return res.json({ error: `No book found with authorId: ${req.params.authId}` });
    }
    return res.json({ books: authorSpecificBooks });
})

//POST
/*
Route:                 /book/newBook
Description:           To add new book
Access:                Public
Parameters:            none
Method:                POST
*/
Router.post("/book/newBook", async (req, res) => {
    const { newBook } = req.body;

    BookModel.create(newBook);
    //database.books.push(newBook);
    return res.json({ message: "New book added" });
})

//PUT
/*
Route:                 /book/update
Description:           To update book title
Access:                Public
Parameters:            isbn
Method:                PUT
*/
Router.put("/book/update/:isbn", async (req, res) => {

    const updatedBook = await BookModel.findOneAndUpdate({ISBN: req.params.isbn},{title: req.body.bookTitle},{new:true});
    /*
    database.books.forEach((book) => {
        if (book.ISBN === req.params.isbn) {
            book.title = req.body.bookTitle;
            return;
        }
    })
    */
    return res.json({ books: updatedBook, message: "Book is updated" });
})

/*
Route:                 /book/author/update
Description:           To update/add new author
Access:                Public
Parameters:            isbn
Method:                PUT
*/
Router.put("/book/author/update/:isbn", async (req, res) => {

    const updatedBook = await BookModel.findOneAndUpdate({ISBN:req.params.isbn},{$addToSet:{authors:req.body.authorId}},{new:true})
    const updatedAuthor = await AuthorModel.findOneAndUpdate({id:req.body.authorId},{$addToSet:{books: req.params.isbn}},{new:true})
    /*
    //update the book database
    database.books.forEach((book) => {
        if (book.ISBN === req.params.isbn) {
            return book.authors.push(req.body.authorId);
        }
    })

    //update the author database
    database.authors.forEach((author) => {
        if (author.id === req.body.authorId) {
            return author.books.push(req.params.isbn);
        }
    })
    */
    return res.json({ books: updatedBook, authors: updatedAuthor, message: "Updated the details" });
})

//DELETE
/*
Route:                 /book/delete
Description:           To delete a book
Access:                Public
Parameters:            isbn
Method:                PUT
*/
Router.delete("/book/delete/:isbn", async (req, res) => {
    const updatedBookDatabase = await BookModel.findOneAndDelete({ISBN: req.params.isbn});
    /*
    const updatedBookDatabase = database.books.filter(
        (book) => book.ISBN !== req.params.isbn
    );

    database.books = updatedBookDatabase;
    */
    return res.json({ books: updatedBookDatabase, message: "Book deleted" });
});

/*
Route:                 /book/delete/author
Description:           To delete author from a book
Access:                Public
Parameters:            isbn
Method:                PUT
*/
Router.delete("/book/delete/author/:isbn", async(req, res) => {
    const updatedBook = await BookModel.findOneAndUpdate({ISBN:req.params.isbn},{$pull:{authors:req.body.authorId}},{new:true});
    const updatedAuthor = await AuthorModel.findOneAndUpdate({id: req.body.authorId},{$pull:{books:req.params.isbn}},{new:true});
    /*
    //update book database
    database.books.forEach((book) => {
        if (book.ISBN === req.params.isbn) {
            const newAuthorList = book.authors.filter((author) => author !== req.body.authorId);
            book.authors = newAuthorList;
            return;
        }
    })

    //update author database
    database.authors.forEach((author) => {
        if (author.id === req.body.authorId) {
            const newBookList = author.books.filter((book) => book !== req.params.isbn)
            author.books = newBookList;
            return;
        }
    })
    */
    return res.json({ books: updatedBook, authors: updatedAuthor, message: "Deleted author from books" })
})

module.exports = Router;