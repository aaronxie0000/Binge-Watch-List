
//get textbox and form, add listeners
const textEntry = document.querySelector('#fcomment');
const newEntry = document.querySelector('#newEntry');
newEntry.addEventListener('submit',submitEvent);

//listener function to add entries by sending body request
async function submitEvent(e){
    e.preventDefault();
    //how should i add the movie name in, the get is in separate funciton
    const response = await sendData(textEntry.value, '/newEntry');
    console.log(response);

    textEntry.value ='';
}

//general send data function, used by add entries
async function sendData(entry,movieName,route){
    const entryObj = {
        message: entry,
        movie: movieName
    }
    const fetchObj = {
        method: 'POST',
        headers:{
            "Content-type": "application/json"
        },
        body: JSON.stringify(entryObj),
    }

    const rawResp = await fetch(route,fetchObj);
    const response = await rawResp.json();
    return response;
}


//search movie
async function getMovie(title){
    console.log('hi');
    const response = await fetch(`/getMovie/${title}`);
    const movieData = await response.json();
    return movieData;

}

//add image to page
const movieImage = document.querySelector('#movieImage');
async function updateImage(title){
    const movieData = await getMovie(title);
    const imageUrl = movieData.Search[0].Poster;
    movieImage.src = imageUrl;
}

updateImage('platform').then();

