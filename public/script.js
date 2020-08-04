
//cross movie search and movie to watch page
let currentSearchedMovies = []; 





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
async function sendData(entry,route){
    const entryObj = {
        message: entry,
        movie: currentSearchedMovies[0].Title,
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


//main movie add func; TODO add trigger when click button of sorts
async function addMovie(title){
    const movieJson = await getMovie(title);
    console.log(movieJson);
    movieJson.Search.forEach(movie=>currentSearchedMovies.push(movie));
    console.log(currentSearchedMovies);
    await updateImage(title);
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

addMovie('platform').then();





