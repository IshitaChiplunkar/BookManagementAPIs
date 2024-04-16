const Router = require("express").Router;

//Publications
/*
Route:                 /publications
Description:           To get all the publications from database
Access:                Public
Parameters:            none
Method:                GET
*/
Router.get("/publications", async (req, res) => {
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
Router.get("/publication/:id", async (req, res) => {
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
Router.get("/publication/book/:isbn", async (req, res) => {
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
Router.post("/pub/newPub", async (req, res) => {
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
Router.put("/pub/update/:id", async (req, res) => {
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
Router.put("/publication/book/update/:id", async (req, res) => {
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
Router.delete("/publication/delete/:pubId",async  (req, res) => {
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
Router.delete("/publication/book/delete/:pubId", async (req, res) => {
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

module.exports = Router;