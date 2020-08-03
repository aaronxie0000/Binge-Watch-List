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

