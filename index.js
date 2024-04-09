require("dotenv").config();

//Framework
const express = require("express");
const mongoose = require("mongoose");

//Database
const database = require("./database/index");

//Initializing express
const shapeAI = express();

//Establish database connection
mongoose.connect(process.env.MONGO_URL).then(() => console.log("Connection established!"));

shapeAI.use(express.json());

//Books
//GET Method API
/*
Route:                 /books
Description:           To get all the books from database
Access:                Public
Parameters:            none
Method:                GET
*/
shapeAI.get("/books", (req, res) => {
    return res.json({ books: database.books });
})

/*
Route:                 /books
Description:           To get specific book from database
Access:                Public
Parameters:            isbn
Method:                GET
*/
shapeAI.get("/book/:isbn", (req, res) => {
    const specificBook = database.books.filter((book) => book.ISBN === req.params.isbn);

    if (specificBook.length === 0) {
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
shapeAI.get("/book/cat/:categoryName", (req, res) => {
    const categorySpecificBooks = database.books.filter((book) => book.category.includes(req.params.categoryName));

    if (categorySpecificBooks.length === 0) {
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
shapeAI.get("/book/auth/:authId", (req, res) => {
    const authorSpecificBooks = database.books.filter((book) => book.authors.includes(parseInt(req.params.authId)));

    if (authorSpecificBooks.length === 0) {
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
shapeAI.post("/book/newBook", (req, res) => {
    const { newBook } = req.body;
    database.books.push(newBook);
    return res.json({ books: database.books, message: "New book added" });
})

//PUT
/*
Route:                 /book/update
Description:           To update book title
Access:                Public
Parameters:            isbn
Method:                PUT
*/
shapeAI.put("/book/update/:isbn", (req, res) => {
    database.books.forEach((book) => {
        if (book.ISBN === req.params.isbn) {
            book.title = req.body.bookTitle;
            return;
        }
    })
    return res.json({ books: database.books, message: "Book is updated" });
})

/*
Route:                 /book/author/update
Description:           To update/add new author
Access:                Public
Parameters:            isbn
Method:                PUT
*/
shapeAI.put("/book/author/update/:isbn", (req, res) => {
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

    return res.json({ books: database.books, authors: database.authors, message: "Updated the details" });
})

//DELETE
/*
Route:                 /book/delete
Description:           To delete a book
Access:                Public
Parameters:            isbn
Method:                PUT
*/
shapeAI.delete("/book/delete/:isbn", (req, res) => {
    const updatedBookDatabase = database.books.filter(
        (book) => book.ISBN !== req.params.isbn
    );

    database.books = updatedBookDatabase;
    return res.json({ books: updatedBookDatabase, message: "Book deleted" });
});

/*
Route:                 /book/delete/author
Description:           To author from a book
Access:                Public
Parameters:            isbn
Method:                PUT
*/
shapeAI.delete("/book/delete/author/:isbn", (req, res) => {
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

    return res.json({ books: database.books, authors: database.authors, message: "Deleted author from books" })
})



// Authors
//GET Method API
/*
Route:                 /authors
Description:           To get all the authors from database
Access:                Public
Parameters:            none
Method:                GET
*/
shapeAI.get("/authors", (req, res) => {
    return res.json({ authors: database.authors });
})

/*
Route:                 /author
Description:           To get specific author from database
Access:                Public
Parameters:            id
Method:                GET
*/
shapeAI.get("/author/:id", (req, res) => {
    const specificAuthor = database.authors.filter((auth) => auth.id === parseInt(req.params.id));

    if (specificAuthor.length === 0) {
        return res.json({ error: `No author found with id: ${req.params.id}` });
    }
    return res.json({ author: specificAuthor });
})

/*
Route:                 /author/book
Description:           To get list of authors based on book's ISBN
Access:                Public
Parameters:            isbn
Method:                GET
*/
shapeAI.get("/author/book/:isbn", (req, res) => {
    const authorList = database.authors.filter((auth) => auth.books.includes(req.params.isbn));

    if (authorList.length === 0) {
        return res.json({ error: `No author found for book isbn: ${req.params.isbn}` })
    }
    return res.json({ authorList: authorList });
})

///POST
/*
Route:                 /author/newAuthor
Description:           To add new author
Access:                Public
Parameters:            none
Method:                POST
*/
shapeAI.post("/author/newAuthor", (req, res) => {
    const { newAuthor } = req.body;
    database.authors.push(newAuthor);
    return res.json({ authors: database.authors, message: `New author added with id ${newAuthor.id}` });
})

//PUT
/*
Route:                 /author/update
Description:           To update author name
Access:                Public
Parameters:            id
Method:                PUT
*/
shapeAI.put("/author/update/:id", (req, res) => {
    database.authors.forEach((author) => {
        if (author.id === parseInt(req.params.id)) {
            author.name = req.body.authorName;
            return;
        }
    })
    return res.json({ authors: database.authors, message: "Author name is updated" });
})

//DELETE
/*
Route:                 /author/delete/
Description:           To delete an author
Access:                Public
Parameters:            authorId
Method:                DELETE
*/
shapeAI.delete("/author/delete/:authorId", (req, res) => {
    const newAuthorList = database.authors.filter((author) => author.id !== parseInt(req.params.authorId))
    database.authors = newAuthorList;
    return res.json({ Authors: newAuthorList });
})

//Publications
/*
Route:                 /publications
Description:           To get all the publications from database
Access:                Public
Parameters:            none
Method:                GET
*/
shapeAI.get("/publications", (req, res) => {
    return res.json({ publications: database.publications });
})

/*
Route:                 /publication
Description:           To get specific publication from database
Access:                Public
Parameters:            id
Method:                GET
*/
shapeAI.get("/publication/:id", (req, res) => {
    const specificPublication = database.publications.filter((pub) => pub.id === parseInt(req.params.id));

    if (specificPublication.length === 0) {
        return res.json({ error: `No publication found with id: ${req.params.id}` });
    }
    return res.json({ publication: specificPublication });
})

/*
Route:                 /publication/book
Description:           To get list of publication based on book's ISBN
Access:                Public
Parameters:            isbn
Method:                GET
*/
shapeAI.get("/publication/book/:isbn", (req, res) => {
    const pubList = database.publications.filter((pub) => pub.books.includes(req.params.isbn));

    if (pubList.length === 0) {
        return res.json({ error: `No publications found for book isbn: ${req.params.isbn}` })
    }
    return res.json({ publicationsList: pubList });
})

//POST
/*
Route:                 /pub/newPub
Description:           To add new publications
Access:                Public
Parameters:            none
Method:                POST
*/
shapeAI.post("/pub/newPub", (req, res) => {
    const { newPub } = req.body;
    database.publications.push(newPub);
    return res.json({ publications: database.publications, message: `New publication added ${newPub.id}` });
})

//PUT
/*
Route:                 /pub/update
Description:           To update author name
Access:                Public
Parameters:            id
Method:                PUT
*/
shapeAI.put("/pub/update/:id", (req, res) => {
    database.publications.forEach((pub) => {
        if (pub.id === parseInt(req.params.id)) {
            pub.name = req.body.pubName;
            return;
        }
    })
    return res.json({ publications: database.publications, message: "Publication name is updated" });
})

/*
Route:                 /pub/update
Description:           To update/add new book to a publication
Access:                Public
Parameters:            id
Method:                PUT
*/
shapeAI.put("/publication/book/update/:id", (req, res) => {
    //Add book to publications
    database.publications.forEach((pub) => {
        if (pub.id === parseInt(req.params.id)) {
            return pub.books.push(req.body.bookISBN);
        }
    })

    //Update entry for the book
    database.books.forEach((book) => {
        if (book.ISBN === req.body.bookISBN) {
            book.publication = parseInt(req.params.id);
            return;
        }
    })
    return res.json({ publications: database.publications, books: database.books, message: "Details updated" });
})

//DELETE
/*
Route:                 /publication/delete/
Description:           To delete a publciation
Access:                Public
Parameters:            pubId
Method:                DELETE
*/
shapeAI.delete("/publication/delete/:pubId", (req, res) => {
    const newPubList = database.publications.filter((pub) => pub.id !== parseInt(req.params.pubId))
    database.publications = newPubList;
    return res.json({ Publications: newPubList });
})

/*
Route:                 /publication/book/delete
Description:           To delete a book from publication
Access:                Public
Parameters:            pubId
Method:                DELETE
*/
shapeAI.delete("/publication/book/delete/:pubId", (req, res) => {

    //update publication database
    database.publications.forEach((pub) => {
        if (pub.id === parseInt(req.params.pubId)) {
            const newBookList = pub.books.filter((book) => book !== req.body.bookISBN);
            pub.books = newBookList;
            return;
        }

        //update book database
        database.books.forEach((book) => {
            if (book.ISBN === req.body.bookISBN) {
                book.publication = 0;
                return;
            }
        })

        return res.json({ books: database.books, publications: database.publications, message: "Deleted publications" })
    })
})





shapeAI.listen(3000, () => console.log("Server is running!!"));