const books = [
    {
        ISBN: "1234ONE",
        title: "Getting started with MERN Stack",
        authors: [1, 2],
        languages: "en",
        numPage: 225,
        publication: 1,
        pubDate: "2024-01-20",
        category: ["fiction", "web"]
    },
    {
        ISBN: "1234TWO",
        title: "Getting started with Java",
        authors: [2, 3],
        languages: "en",
        numPage: 325,
        publication: 2,
        pubDate: "2024-04-20",
        category: ["fiction", "web", "programming"]
    }
];

const authors = [
    {
        id: 1,
        name: "Ishita Chiplunkar",
        books: ["1234ONE"]
    },
    {
        id: 2,
        name: "Manisha Chiplunkar",
        books: ["1234ONE", "1234TWO"]
    },
    {
        id: 3,
        name: "Krishnakant Chiplunkar",
        books: ["1234TWO"]
    }
];

const publications = [
    {
        id: 1,
        name: "Chakra",
        books: ["1234ONE"]
    },
    {
        id: 2,
        name: "Mithun",
        books: ["1234TWO"]
    }
];

module.exports = { books, authors, publications };