//express
const express = require('express');
const runner = express();

//local server
runner.listen(3000,()=>console.log('listening at 3000'));
runner.use(express.static('public'));

runner.use(express.json()); //important for post requests

//database neDb
const neDatabase = require('nedb');
const entries = new neDatabase('entries.db');
entries.loadDatabase();

//adding post request to database
runner.post('/newEntry',(request,response)=>{
    console.log(request.body);
    entries.insert(request.body)

    response.json({
        status: 'success',
    })
})



//fetching movie database
const backFetch = require('node-fetch');
require('dotenv').config(); //for api key security

runner.get('/getMovie/:title', async (request,response)=>{
    const rawData = await backFetch (`http://www.omdbapi.com/?apikey=${process.env.API_KEY}&s=${request.params.title}`);  
    const movieData = await rawData.json();
    response.json(movieData);
});


//fetching movie with more specific
runner.get('/movieInfo/:imbd',async(request,response)=>{
    console.log(`http://www.omdbapi.com/?apikey=${process.env.API_KEY}&i=${request.params.imbd}`);
    const rawData = await backFetch (`http://www.omdbapi.com/?apikey=${process.env.API_KEY}&i=${request.params.imbd}`);
    const movieData = await rawData.json();
    response.json(movieData);
});

