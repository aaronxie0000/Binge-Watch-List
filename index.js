require('dotenv').config();
const fetch = require('node-fetch');

const port = process.env.PORT||3000;
const express = require('express');
const runner = express();

runner.listen(port,()=>console.log(`listening at ${port}`));
runner.use(express.static('public'));
runner.use(express.json()); 

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

userMovieEntries.persistence.setAutocompactionInterval(10000)

//add to data
runner.post('/pushMovieData',(request,response)=>{
    userMovieEntries.insert(request.body);

    response.json({
        message: 'Success',
    })
})

//retrieve from data
runner.get('/getMovies/:myID',(request,response)=>{
    userMovieEntries.find({'userID': request.params.myID}, (err, data) => {
        response.json(data)
    });
});

//update date watched
runner.post('/updateTime', (request,response)=>{
    userMovieEntries.update({'movieObj.Title': request.body.title},{ $set:{dateWatched:request.body.timeString}},{multi:true},function(err,numDocs){
        if(err) throw error
    });
    response.json({
        status: 'Updated Database'
    })
});


//remove item when dumped

runner.post('/removeMovie',(request,response)=>{
    userMovieEntries.remove({'userID':request.body.userID, 'movieObj.Title':request.body.Title},{multi:true},function(err,numRemoved){
        // console.log(numRemoved);
    })
    response.json({
        status: 'Updated Database'
    })
})
