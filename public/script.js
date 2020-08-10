
const alertMessage = document.querySelector('.alertMessage');
const alertBox = document.querySelector('.alertPopup');

/*---User Input---*/
let mySessionID;

const sessionID = document.querySelector('.idForm');
const sessionInput = document.querySelector('#idInput');
sessionID.addEventListener('submit', sessionIDinput);

async function sessionIDinput(e){
    e.preventDefault();
    mySessionID = sessionInput.value;
    //function to check if user name used
    const existing = await checkID(mySessionID);
    if(existing === true){
        alertMessage.textContent = 'This SessionID has been used. If this is you or the EXAMPLE, simply exit and scroll to continue'
        alertBox.classList.remove('hidden');
    }
    else{
        window.scrollBy(0,window.innerHeight);
    }

    //function to update previous results in graph
    updateDisplayMovies(mySessionID);
}

async function checkID(sessionID){
    const raw = await fetch(`/getMovies/${sessionID}`);
    const response = await raw.json();
    if (response.length==0){
        return false;
    }
    else{
        return true;
    }
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
    if (movieData == null){
        alertMessage.textContent = '!! Invalid Movie Name !! \n Sure you got the rigth movie or tv show name? Try again!'
        alertBox.classList.remove('hidden');
        return;
    }

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
        const response = await pushToDataBase(movieData[i]);
    }

    toWatchComment.value = '';
    movieNameSearch.value = '';

    updateDisplayMovies(mySessionID);

}



function getCheckedMovies(){
    const checkBox = document.querySelectorAll('.movieSelect');

    //get here as need the search and checkbox-ing to be finished first
    let currentCheckMoviesID = [];
    try{
        if (currentDisplayMovies.length==0) throw('Error');
        for(let i=0; i<checkBox.length;i++){
            if(checkBox[i].checked){
                currentCheckMoviesID.push(currentDisplayMovies[i].imdbID);
            }
        }
        if (currentCheckMoviesID.length == 0) throw('Error');
    }
    catch{
        alertMessage.textContent = 'Please make sure you have searched and selected at least one movie'
        alertBox.classList.remove('hidden');
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
    const userID = mySessionID;
    if (userID==null){
        alertMessage.textContent = 'Please re-enter your SessionID before submitting'
        alertBox.classList.remove('hidden');
        return;
    }
    const sentData = {userID,userComment,dateWatched,movieObj};


    const postOptions = {
        method: 'POST',
        headers:{
            "Content-type": "application/json",
        },
        body: JSON.stringify(sentData),
    }

    const raw = await fetch('/pushMovieData',postOptions);
    const response = await raw.json();
    return response;


}


/*---to watch list---*/

const infoList = document.querySelector('.infoList');
const toWatchList = document.querySelector('.toWatchList');

async function updateDisplayMovies(userID){
    //function to get all the objects stored
    const raw = await fetch(`/getMovies/${userID}`);
    const movies = await raw.json();

    const removeToWatchList = document.querySelectorAll('.toWatchList > li:not(.listTitle)');
    removeToWatchList.forEach(ele=>ele.remove());

    const removeDataList = document.querySelectorAll('.infoList > tr:not(.infoListTitle)');
    removeDataList.forEach(ele=>ele.remove());

    for (let i=0; i<movies.length;i++){
        updateToWatchList(movies[i]);
        updateMovieTable(movies[i]);
    }
}

//update to watch list
function updateToWatchList(inputObj){

    const listMovieItem = document.createElement('li');
    listMovieItem.classList.add('listMovieItem');

    const listMovieName = document.createElement('p');
    listMovieName.classList.add('listMovieName');
    listMovieName.textContent = inputObj.movieObj.Title;

    const listIcons = document.createElement('div');
    listIcons.classList.add('listIcons');

    const removeButton = document.createElement('span');
    removeButton.classList.add('removeButton');

    const imgRemoveButton = document.createElement('img');
    imgRemoveButton.src = "./assets/noun_Trash_3465739.png";

    const checkButton = document.createElement('span');
    checkButton.classList.add('checkButton');
    checkButton.textContent = 'x';

    removeButton.append(imgRemoveButton);
    listIcons.append(removeButton);
    listIcons.append(checkButton);

    listMovieItem.append(listMovieName);
    listMovieItem.append(listIcons);
    toWatchList.append(listMovieItem);

    checkButton.addEventListener('click',watchedItem);
    removeButton.addEventListener('click', removeItem);

    if (inputObj.dateWatched!='Not Yet'){
        checkButton.parentNode.parentNode.classList.toggle('watchedItem');
    }
}

//update data table list
function updateMovieTable(inputObj){
    

    const movieListEntry = document.createElement('tr');
    movieListEntry.classList.add('movieListEntry');

    const Title = document.createElement('td');
    Title.setAttribute('data-th','Title');
    Title.textContent = inputObj.movieObj.Title;

    const Director = document.createElement('td');
    Director.setAttribute('data-th','Director');
    Director.textContent = inputObj.movieObj.Director;

    const Year = document.createElement('td');
    Year.setAttribute('data-th','Year');
    Year.textContent =  inputObj.movieObj.Year;

    const Runtime = document.createElement('td');
    Runtime.setAttribute('data-th','Runtime');
    Runtime.textContent =  inputObj.movieObj.Runtime;

    const Rating = document.createElement('td');
    Rating.setAttribute('data-th','Rating');
    if(inputObj.movieObj.Ratings[1] == null){
        Rating.textContent = 'N/A'
    }
    else{
        Rating.textContent =  inputObj.movieObj.Ratings[1].Value;
    }

    const watchedOn = document.createElement('td');
    watchedOn.setAttribute('data-th','Watched On');
    watchedOn.textContent =  inputObj.dateWatched;

    const Thoughts = document.createElement('td');
    Thoughts.setAttribute('data-th','Thoughts');
    Thoughts.textContent =  inputObj.userComment;

    movieListEntry.append(Title);
    movieListEntry.append(Director);
    movieListEntry.append(Year);
    movieListEntry.append(Runtime);
    movieListEntry.append(Rating);
    movieListEntry.append(watchedOn);
    movieListEntry.append(Thoughts);

    infoList.append(movieListEntry);


}

let checkButtons = document.querySelectorAll('.checkButton');
checkButtons.forEach(button=>button.addEventListener('click',watchedItem));

//function to update database when a movie is crossed
async function watchedItem(){
    const movieName = this.parentNode.parentNode;
    movieName.classList.toggle('watchedItem');

    const title = movieName.childNodes[0].textContent;

    let timeString;
    if (movieName.classList.contains('watchedItem')){
        const currTime = new Date();
        const raw = currTime.toDateString();
        timeString = raw.replace(/ /g,', ' );
    }
    else{
        timeString = 'Not Yet';
    }
    

    const sentData = {title,timeString,mySessionID}
    const postOptions = {
        method: 'POST',
        headers:{
            "Content-type": "application/json",
        },
        body: JSON.stringify(sentData),
    }

    const rawResponse = await fetch(`/updateTime`,postOptions);
    const response = await rawResponse.json();

    updateDisplayMovies(mySessionID);
}

async function removeItem(){
    const movieItem = this.parentNode.parentNode;
    const title = movieItem.childNodes[0].textContent;
    const sentData = {
        userID: mySessionID,
        Title: title,
    }
    const postOptions = {
        method: 'POST',
        headers:{
            "Content-type": "application/json",
        },
        body: JSON.stringify(sentData),
    }

    const rawResponse = await fetch(`/removeMovie`,postOptions);
    const response = await rawResponse.json();
    updateDisplayMovies(mySessionID);

}


