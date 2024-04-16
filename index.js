require("dotenv").config();

//Framework
const express = require("express");
const mongoose = require("mongoose");

//Database
const database = require("./database/index");

//Models
const BookModel = require("./database/book");
const AuthorModel = require("./database/author");
const PublicationModel = require("./database/publication");

//Initializing express
const shapeAI = express();

//Establish database connection
mongoose.connect(process.env.MONGO_URL).then(() => console.log("Connection established!"));

shapeAI.use(express.json());

// Authors
//GET Method API
/*
Route:                 /authors
Description:           To get all the authors from database
Access:                Public
Parameters:            none
Method:                GET
*/
shapeAI.get("/authors", async (req, res) => {
    const getAuthors = await AuthorModel.find();
    return res.json({ authors: getAuthors });
})

/*
Route:                 /author
Description:           To get specific author from database
Access:                Public
Parameters:            id
Method:                GET
*/
shapeAI.get("/author/:id", async (req, res) => {
    //const specificAuthor = database.authors.filter((auth) => auth.id === parseInt(req.params.id));

    const specificAuthor = await AuthorModel.findOne({id: req.params.id});
    if (!specificAuthor) {
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
shapeAI.get("/author/book/:isbn", async (req, res) => {
    //const authorList = database.authors.filter((auth) => auth.books.includes(req.params.isbn));

    const authorList = await AuthorModel.find({books: req.params.isbn});
    if (!authorList) {
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
shapeAI.post("/author/newAuthor", async (req, res) => {
    const { newAuthor } = req.body;

    AuthorModel.create(newAuthor);
    //database.authors.push(newAuthor);
    return res.json({message: `New author added with id ${newAuthor.id}` });
})

//PUT
/*
Route:                 /author/update
Description:           To update author name
Access:                Public
Parameters:            id
Method:                PUT
*/
shapeAI.put("/author/update/:id", async(req, res) => {
    const updateAuthor = await AuthorModel.findOneAndUpdate({id: parseInt(req.params.id)},{name: req.body.authorName},{new:true});
    /*
    database.authors.forEach((author) => {
        if (author.id === parseInt(req.params.id)) {
            author.name = req.body.authorName;
            return;
        }
    })
    */
    return res.json({ authors: updateAuthor, message: "Author name is updated" });
})

//DELETE
/*
Route:                 /author/delete/
Description:           To delete an author
Access:                Public
Parameters:            authorId
Method:                DELETE
*/
shapeAI.delete("/author/delete/:authorId", async (req, res) => {
    const updatedAuthors = await AuthorModel.findOneAndDelete({id: parseInt(req.params.authorId)})
    /*
    const newAuthorList = database.authors.filter((author) => author.id !== parseInt(req.params.authorId))
    database.authors = newAuthorList;
    */
    return res.json({ Authors: updatedAuthors , message: "Deleted author"});
})

//Publications
/*
Route:                 /publications
Description:           To get all the publications from database
Access:                Public
Parameters:            none
Method:                GET
*/
shapeAI.get("/publications", async (req, res) => {
    const getPublications = await PublicationModel.find();
    return res.json({ publications: getPublications });
})

/*
Route:                 /publication
Description:           To get specific publication from database
Access:                Public
Parameters:            id
Method:                GET
*/
shapeAI.get("/publication/:id", async (req, res) => {
    //const specificPublication = database.publications.filter((pub) => pub.id === parseInt(req.params.id));

    const specificPublication = await PublicationModel.findOne({id: req.params.id});
    if (!specificPublication) {
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
shapeAI.get("/publication/book/:isbn", async (req, res) => {
    //const pubList = database.publications.filter((pub) => pub.books.includes(req.params.isbn));

    const pubList = await PublicationModel.findOne({books: req.params.isbn});
    if (!pubList) {
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
shapeAI.post("/pub/newPub", async (req, res) => {
    const { newPub } = req.body;
    //database.publications.push(newPub);
    PublicationModel.create(newPub);
    return res.json({message: `New publication added ${newPub.id}` });
})

//PUT
/*
Route:                 /pub/update
Description:           To update publication name
Access:                Public
Parameters:            id
Method:                PUT
*/
shapeAI.put("/pub/update/:id", async (req, res) => {
    const updatePubName = await PublicationModel.findOneAndUpdate({id: parseInt(req.params.id)},{name: req.body.pubName},{new:true});
    /*
    database.publications.forEach((pub) => {
        if (pub.id === parseInt(req.params.id)) {
            pub.name = req.body.pubName;
            return;
        }
    })
    */
    return res.json({ publications: updatePubName, message: "Publication name is updated" });
})

/*
Route:                 /pub/update
Description:           To update/add new book to a publication
Access:                Public
Parameters:            id
Method:                PUT
*/
shapeAI.put("/publication/book/update/:id", async (req, res) => {
    const updatePublication = await PublicationModel.findOneAndUpdate({id: parseInt(req.params.id)},{$addToSet:{books: req.body.ISBN}},{new: true});
    const updateBook = await BookModel.findOneAndUpdate({ISBN: req.body.ISBN},{publication: parseInt(req.params.id)},{new:true});
    /*
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
    */
    return res.json({ publications: updatePublication, books: updateBook, message: "Details updated" });
})

//DELETE
/*
Route:                 /publication/delete/
Description:           To delete a publciation
Access:                Public
Parameters:            pubId
Method:                DELETE
*/
shapeAI.delete("/publication/delete/:pubId",async  (req, res) => {
    const deletePub = await PublicationModel.findOneAndDelete({id: parseInt(req.params.pubId)});
    const newPubList = await PublicationModel.find();
    /*
    const newPubList = database.publications.filter((pub) => pub.id !== parseInt(req.params.pubId))
    database.publications = newPubList;
    */
    return res.json({ deletedPub: deletePub, Publications: newPubList , message: "Deleted publications"});
})

/*
Route:                 /publication/book/delete
Description:           To delete a book from publication
Access:                Public
Parameters:            pubId
Method:                DELETE
*/
shapeAI.delete("/publication/book/delete/:pubId", async (req, res) => {
    const newBookList = await BookModel.findOneAndUpdate({ISBN: req.body.bookISBN},{publications: parseInt(req.params.pubId)},{new:true});
    const newPubList = await PublicationModel.findOneAndUpdate({id: parseInt(req.params.pubId)},{$addToSet: {books: req.body.bookISBN}},{new:true});
    /*
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
    */
    return res.json({ books: newBookList, publications: newPubList, message: "Deleted publications" })
})





shapeAI.listen(3000, () => console.log("Server is running!!"));