// Create web server
// Require modules
const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const app = express();

// Set up the view engine
app.set('view engine', 'ejs');
app.set('views', './views');

// Set up body-parser
app.use(bodyParser.urlencoded({ extended: false }));

// Set up static file
app.use(express.static('public'));

// Set up data
let data = JSON.parse(fs.readFileSync('./data.json'));

// Set up port
const port = 3000;

// Render the home page
app.get('/', (req, res) => {
    res.render('home');
});

// Render the comment page
app.get('/comment', (req, res) => {
    res.render('comment', { data });
});

// Add new comment
app.post('/add-comment', (req, res) => {
    let newComment = {
        id: data.length + 1,
        name: req.body.name,
        content: req.body.content
    };
    data.push(newComment);
    fs.writeFileSync('./data.json', JSON.stringify(data));
    res.redirect('/comment');
});

// Delete comment
app.get('/delete/:id', (req, res) => {
    let id = req.params.id;
    data.splice(id - 1, 1);
    fs.writeFileSync('./data.json', JSON.stringify(data));
    res.redirect('/comment');
});

// Edit comment
app.get('/edit/:id', (req, res) => {
    let id = req.params.id;
    res.render('edit', { id, data });
});

app.post('/edit/:id', (req, res) => {
    let id = req.params.id;
    let editComment = {
        id: id,
        name: req.body.name,
        content: req.body.content
    };
    data[id - 1] = editComment;
    fs.writeFileSync('./data.json', JSON.stringify(data));
    res.redirect('/comment');
});

// Listen on port
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
