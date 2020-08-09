require('dotenv').config();
const fetch = require('node-fetch');


const express = require('express');
const runner = express();

runner.listen(3000,()=>console.log('listening at 3000'));
runner.use(express.static('public'));

//get small data set
runner.get('/getMinMovieData/:title',async (request,response)=>{
    const rawMovie = await fetch(`http://www.omdbapi.com/?apikey=${process.env.API_KEY}&s=${request.params.title}`);
    const movieJson = await rawMovie.json();
    response.json(movieJson);
})

//get the large full data set
runner.get('/getFullMovieData/:imbdID',async (request,response)=>{
    const rawMovie = await fetch(`http://www.omdbapi.com/?apikey=${process.env.API_KEY}&i=${request.params.imbdID}`);
    const movieJson = await rawMovie.json();
    response.json(movieJson);
})

const database = require('nedb');
const userMovieEntries = new database('userMovieEntries.db'); 
userMovieEntries.loadDatabase();

runner.post('/pushMovieData',(request,response)=>{
    userMovieEntries.insert(request.body);

    response.json({
        message: 'Success',
    })
})

