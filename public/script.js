
//get textbox and form, add listeners
const textEntry = document.querySelector('#fcomment');
const newEntry = document.querySelector('#newEntry');
newEntry.addEventListener('submit',submitEvent);

//listener function to add entries by sending body request
async function submitEvent(e){
    e.preventDefault();
    const response = await sendData(textEntry.value, '/newEntry');
    console.log(response);

    textEntry.value ='';
}

//general send data function, used by add entries
async function sendData(entry,route){
    const entryObj = {
        message: entry,
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