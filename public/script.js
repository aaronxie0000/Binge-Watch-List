
//cross movie search and movie to watch page
let currentSearchedMovies = []; 





//get textbox and form, add listeners
const textEntry = document.querySelector('#toWatchComment');
const newEntry = document.querySelector('.newEntry');
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
    currentSearchedMovies.length = 0;
    const movieJson = await getMovie(title);
    movieJson.Search.forEach(movie=>currentSearchedMovies.push(movie));
    updateImage();
}



//search movie
async function getMovie(title){
    const response = await fetch(`/getMovie/${title}`);
    const movieData = await response.json();
    return movieData;

}

//add movie visuals to page
const movieList = document.querySelector('.movieList');
function updateImage(){
    // currentSearchedMovies
    for (let i=0;i<5;i++){
        let imageUrl = currentSearchedMovies[i].Poster;
        const movieName = currentSearchedMovies[i].Title;
    
        if (imageUrl == 'N/A'){
            imageUrl = './assets/not_found.jpg'
        }
    
        const movieImage = document.createElement('img');
        movieImage.classList.add('movieImage');
        movieImage.src = imageUrl;
    
        const movieTitle = document.createElement('p');
        movieTitle.classList.add('movieName');
        movieTitle.textContent = movieName;

        movieList.append(movieImage);
        movieList.append(movieTitle);
    }
   


}

//searchMovie 
const movieInput = document.querySelector('.searchMovie');
const movieInputSearch = document.querySelector('#fsearch')
movieInput.addEventListener('submit',searchMovie);

async function searchMovie(e){
    e.preventDefault();
    const movieTitle = movieInputSearch.value;
    await addMovie(movieTitle);
    movieInputSearch.value = '';
}





