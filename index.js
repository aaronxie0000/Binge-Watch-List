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
entries.persistence.setAutocompactionInterval(6000)

//adding post request to database
runner.post('/newEntry',(request,response)=>{
    // console.log(request.body);
    entries.insert(request.body)

    response.json({
        status: 'success',
    })
})

//giving data from database
runner.get('/getDatabase',(request,response)=>{
    entries.find({}, (err, data) => {
        response.json(data)
    });
});


//updating database
runner.post('/checkMovie', (request,response)=>{
    entries.update({'movie.Title': request.body.movieName},{ $set:{meta:{watched:true}}},{multi:true},function(err,numDocs){
        if(err) throw error
        console.log(numDocs);
    });
    response.json({
        status: 'Updated Database'
    })
});

runner.post('/uncheckMovie', (request,response)=>{
    entries.update({'movie.Title': request.body.movieName},{ $set:{meta:{watched:false}}},{multi:true},function(err,numDocs){
        if(err) throw error
        console.log(numDocs);
    });
    response.json({
        status: 'Updated Database'
    })
});


//fetching movie database
const backFetch = require('node-fetch');
const { request, response } = require('express');
require('dotenv').config(); //for api key security

runner.get('/getMovie/:title', async (request,response)=>{
    const rawData = await backFetch (`http://www.omdbapi.com/?apikey=${process.env.API_KEY}&s=${request.params.title}`);  
    let movieData = await rawData.json();
    response.json(movieData);
});


//fetching movie with more specific
runner.get('/movieInfo/:imbd',async(request,response)=>{
    const rawData = await backFetch (`http://www.omdbapi.com/?apikey=${process.env.API_KEY}&i=${request.params.imbd}`);
    const movieData = await rawData.json();
    response.json(movieData);
});

