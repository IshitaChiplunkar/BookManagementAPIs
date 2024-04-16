require("dotenv").config();

//Framework
const express = require("express");
const mongoose = require("mongoose");

//Mircoservices
const Books = require('./API/Book');
const Authors = require('./API/Author');
const Publications = require('./API/Publication');

//Initializing express
const shapeAI = express();

shapeAI.use(express.json());

//Establish database connection
mongoose.connect(process.env.MONGO_URL).then(() => console.log("Connection established!"));

//Initializing microservices
shapeAI.use("/book",Books);
shapeAI.use("/author",Authors);
shapeAI.use("/publication",Publications);

shapeAI.listen(3000, () => console.log("Server is running!!"));