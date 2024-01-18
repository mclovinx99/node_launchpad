const express = require('express');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
// parse application/json

const routes = require('./routes');
const path = require('path');
// const mysql = require('mysql2');
const multer  = require('multer');
const upload = multer({ dest: 'uploads/' });

const port = 3000;


app.listen(process.env.PORT||port);

app.use((req,res,next)=>{
    console.log(req.method, req.url);
    next();
})
app.use('/get', (req, res) => {
    const data = { message: "data" };
    res.json(data);
});

app.use('/', routes);