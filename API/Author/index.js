const Router = require("express").Router;


// Authors
//GET Method API
/*
Route:                 /authors
Description:           To get all the authors from database
Access:                Public
Parameters:            none
Method:                GET
*/
Router.get("/authors", async (req, res) => {
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
Router.get("/author/:id", async (req, res) => {
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
Router.get("/author/book/:isbn", async (req, res) => {
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
Router.post("/author/newAuthor", async (req, res) => {
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
Router.put("/author/update/:id", async(req, res) => {
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
Router.delete("/author/delete/:authorId", async (req, res) => {
    const updatedAuthors = await AuthorModel.findOneAndDelete({id: parseInt(req.params.authorId)})
    /*
    const newAuthorList = database.authors.filter((author) => author.id !== parseInt(req.params.authorId))
    database.authors = newAuthorList;
    */
    return res.json({ Authors: updatedAuthors , message: "Deleted author"});
})

module.exports = Router;