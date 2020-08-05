
// Create a "close" button and append it to each list item
let myNodeList = document.querySelectorAll(".watchItem");
updateVisualToWatchList();

function updateVisualToWatchList(){
    myNodeList = document.querySelectorAll(".watchItem");
    for (let i = 0; i < myNodeList.length; i++) {
        if (myNodeList[i].childNodes[1] != null) continue;
        var span = document.createElement("SPAN");
        span.textContent = "\u2713"
        span.classList.add('checkButton')
        myNodeList[i].appendChild(span);
    }


    const checkButtons = document.querySelectorAll('.checkButton');
    checkButtons.forEach(button=> button.addEventListener('click',addWatched));
}


function addWatched(){
  this.parentNode.classList.toggle('watched');
}



//cross movie search and movie to watch page
let currentSearchedMovies = []; 




//get textbox and form, add listeners
const textEntry = document.querySelector('#toWatchComment');
const newEntry = document.querySelector('.newEntry');
const myWatchList = document.querySelector('#myWatchList');
newEntry.addEventListener('submit',submitToDatabase);


//general send data function, used by add entries
async function sendData(movieObj,route){
    
    const fetchObj = {
        method: 'POST',
        headers:{
            "Content-type": "application/json"
        },
        body: JSON.stringify(movieObj),
    }

    const rawResp = await fetch(route,fetchObj);
    const response = await rawResp.json();
    return response;
}


/*!!!*/

//searchMovie 
const movieInput = document.querySelector('.searchMovie');
const movieInputSearch = document.querySelector('#movieNameInput')
movieInput.addEventListener('submit',searchMovie);

async function searchMovie(e){
    e.preventDefault();
    const movieTitle = movieInputSearch.value;
    await addMovie(movieTitle);
}


//main movie add func; TODO add trigger when click button of sorts
async function addMovie(title){
    currentSearchedMovies.length = 0;
    const movieJson = await getMovie(title);
    if (movieJson.Response == 'False'){
        movieInputSearch.value = 'NOT A VALID MOVIE';
        return;
    };
    movieJson.Search.forEach(movie=>currentSearchedMovies.push(movie));
    updateImage();
}

//listener function to add entries by sending body request
async function submitToDatabase(e){
    e.preventDefault();

    if (document.querySelector('.watchItem p').textContent == '[Your Movie Here] Comments:'){
        myWatchList.innerHTML = '';
    }
    const myWatchItem = document.createElement('li');
    myWatchItem.classList.add('watchItem');

    const watchItemName = document.createElement('p');
    watchItemName.textContent = '[' + currentSearchedMovies[0].Title + ']' + ' Thoughts: ' + textEntry.value;

    myWatchItem.append(watchItemName);
    myWatchList.append(myWatchItem);

    updateVisualToWatchList();

    //call to get the full movie data
    const rawData = await fetch(`/movieInfo/${currentSearchedMovies[0].imdbID}`);
    const movieData = await rawData.json();

    const movieObj = {
        movie: movieData,
        comments: textEntry.value,
    }


    const response = await sendData(movieObj, '/newEntry');
    console.log(response); //tell if successful or not
    textEntry.value ='';
    movieInputSearch.value = '';

}


/*!!!*/



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
    movieList.innerHTML = '';
    let length =5;
    if (currentSearchedMovies.length<5){
        length = currentSearchedMovies.length;
    }    

    for (let i=0;i<length;i++){
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

        const movieContain = document.createElement('div');
        movieContain.classList.add('theMovie');


        movieContain.append(movieImage);
        movieContain.append(movieTitle);
        movieList.append(movieContain);
    }
   


}






