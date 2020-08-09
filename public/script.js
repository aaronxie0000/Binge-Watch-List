
/*---User Input---*/

const sessionID = document.querySelector('.idForm');
sessionID.addEventListener('submit', sessionIDinput);

function sessionIDinput(e){
    e.preventDefault();
    //function to check if user name used

    //function to update previous results in graph

    console.log('hi');
}


/*---Movie Searching---*/
let currentDisplayMovies = [];

const movieNameSearch = document.querySelector('#movieNameInput');
const movieNameForm = document.querySelector('.searchMovie');
movieNameForm.addEventListener('submit',inputMovie);

async function inputMovie(e){
    e.preventDefault();
    const movieData = await getMinMovies();
    updateMoviePoster(movieData);


}

//returns the fetch of basic movie info
async function getMinMovies(){
    const raw = await fetch(`/getMinMovieData/${movieNameSearch.value}`);
    const movieData = await raw.json();
    return movieData.Search;
}

const movieList = document.querySelector('.movieList');

function updateMoviePoster(movieData){
    movieList.innerHTML = '';
    currentDisplayMovies = [];

    for(let i=0;i<movieData.length;i++){
        currentDisplayMovies.push(movieData[i]);

        const theMovie = document.createElement('div');
        theMovie.classList.add('theMovie');

        const movieImage = document.createElement('img');
        movieImage.classList.add('movieImage');
        if (movieData[i].Poster == 'N/A'){
            movieImage.src ='assets/not_found.jpg';
        }
        else{
            movieImage.src = movieData[i].Poster;
        }

        const description = document.createElement('div');
        description.classList.add('description');

        const movieName = document.createElement('p');
        movieName.classList.add('movieName');
        movieName.textContent = `${movieData[i].Title} (${movieData[i].Year})`;

        const movieSelect = document.createElement('input');
        movieSelect.classList.add('movieSelect');
        movieSelect.type = 'checkbox';

        description.append(movieName);
        description.append(movieSelect);
        theMovie.append(movieImage);
        theMovie.append(description);
        movieList.append(theMovie);
        
    }

}




const toWatchCommentForm = document.querySelector('.toWatchCommentForm');
const toWatchComment = document.querySelector('#toWatchComment');

toWatchCommentForm.addEventListener('submit',addMovieToDataBase);

async function addMovieToDataBase(e){
    e.preventDefault();
    //get list of IMBd id of checked movie from currentDisplayMovies and checkboxes
    const IDList = getCheckedMovies();
    //request the full data from backend
    const movieData = await getFullData(IDList);
    //push to database
    for (let i=0; i<movieData.length;i++){
        console.log(movieData[i]);
        const response = await pushToDataBase(movieData[i]);
        console.log(response);
    }
}



function getCheckedMovies(){
    const checkBox = document.querySelectorAll('.movieSelect');
    //get here as need the search and checkbox-ing to be finished first

    let currentCheckMoviesID = [];
    for(let i=0; i<checkBox.length;i++){
        if(checkBox[i].checked){
            currentCheckMoviesID.push(currentDisplayMovies[i].imdbID);
        }
    }

    return currentCheckMoviesID;
}

async function getFullData(IDList){
    let arrayOfMovieObj = [];
    for (let i=0; i<IDList.length;i++){
        const raw = await fetch(`/getFullMovieData/${IDList[i]}`);
        const fullMovieData = await raw.json();
        arrayOfMovieObj.push(fullMovieData);
    }
    return arrayOfMovieObj;
}

async function pushToDataBase(movieObj){
    const userComment = toWatchComment.value;
    const dateWatched = 'Not Yet';
    const route = '/pushMovieData';

    const sentData = {
        movie: movieObj.Title,
        comments: userComment,
        dateWatched: dateWatched,
    }


    const postOptions = {
        method: 'POST',
        headers:{
            "Content-type": "application/json",
        },
        body: JSON.stringify(sentData),
    }

    const raw = await fetch(route,postOptions);
    const response = await raw.json();
    return response;


}


/*---to watch list---*/



