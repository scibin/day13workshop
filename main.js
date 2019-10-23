// Init
const express = require('express');
const hbs = require('express-handlebars');
const path = require('path');
const fs = require('fs');
const app = express();
const APP_PORT = process.env.PORT || 3001;

// Initialize handlebars
// hbs() -> initalize from const hbs = require('express-handlebars');
app.engine('hbs', hbs());
app.set('view engine', 'hbs');

// _________________________
// Initialize static content
// _________________________
// Homepage will be index.html at localhost:xxxx
app.use(express.static(path.join(__dirname, 'public')));
// Looks like this is not needed
// app.set('views', path.join(__dirname, '/views'));

// Static images at root/images --> this example shows that it can be anywhere in the project folder
// Lecturer's version is in views folder instead
const imgFolderPath = path.join(__dirname, 'images');
app.use(express.static(imgFolderPath));

// Initialize arrays for image names and paths
const imgNames = [];
const imgNamesWithPath = [];

// Read file names and push to arrays
fs.readdir(imgFolderPath, (err, files) => {
    if (err) {
        return
    } else {
        files.forEach((file) => {
            imgNames.push(file);
            imgNamesWithPath.push(path.join(imgFolderPath, file));
        })
        // console.log(imgNamesWithPath);
        // console.log(imgNames[getRandomInt(imgNames.length)]);
        // console.log(imgNamesWithPath);
    };
});

// helper random function
function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

// _________________________
// app.get section
// _________________________

// Serve image via send
app.get('/image', (req, res) => {
    res.status(200).type('text/html');
    let imgHTML = `<img src=${imgNames[getRandomInt(imgNames.length)]}>`;
    res.send(imgHTML);
});

// Serve image via render + HBS
app.get('/hbsimage', (req, res) => {
    let hbsImg = imgNames[getRandomInt(imgNames.length)];
    // Case if wordArr is simple array
    // res.render('randoimg', {name: hbsImg, wordArr: ['one', 'two', 'three']});
    res.render('randoimg', {name: hbsImg, wordArr: [{val: 'one', quan: '2'}, {val: 'two', quan: '4'}, {val: 'three', quan: '6'}]});
});

// Serve image via sendFile
app.get('/random-image', (req, res) => {
    let imgFileHTML = imgNamesWithPath[getRandomInt(imgNamesWithPath.length)];
    res.sendFile(imgFileHTML);
});

// Catch-all
app.use((req, res, next) => {
    res.redirect('/error.html');
});

// Logs the port that is used
app.listen(APP_PORT, () => {
    console.info(`Webserver at port ${APP_PORT}`);
});
