
const charUrl = "https://xivapi.com/character/search?";
const profileUrl = "https://xivapi.com/character/";


//Watches for search button to be clicked on
//Initializes get search results
function formWatch () {
    $('#js-form').submit(event => {
        event.preventDefault();
        $('nav').removeClass('nav');
        $('nav').addClass('navTop');
        $('#js-characterData').empty();
        const playerName = $('#userSearch').val();
        const serverName = document.getElementById('serverList').value;
 
        getSearchResults(playerName, serverName);

    })
}

//Converts params into a string
function generateQueryString(params) {

    const queryItems = Object.keys(params)
                       .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`);
    return queryItems.join('&');

}

//Fetches the XIVAPI to gather search results
//Based on Character + Server Name
function getSearchResults(playerName, serverName) {
    const params = {
        name : playerName,
        server : serverName
    }
    const queryString = generateQueryString(params);
    const searchUrl = charUrl + queryString;
    console.log(searchUrl);

    fetch(searchUrl)
    .then(response => {
        if(response.ok) {
            return response.json();
        } else {
            throw new Error (response.statusText);
        }
    })
    .then(data => (displaySearchResults(data)))
    .catch(error => {
        alert(`Something went wrong: ${error.message}`);
    })
}

//Displays the initial search results
//Found from the fetch
//Displays them their own div box
function displaySearchResults(data) {

    $('.results').empty();

    for(let idx = 0; idx < data.Results.length; idx++){
        $('.results').append(`
        <li>
        <a class="characterUrl" href="https://xivapi.com/character/${data.Results[idx].ID}">
        <img class="avatar" src="${data.Results[idx].Avatar}" alt="Players Avatar Picture">
        
        <span>${data.Results[idx].Name}</span>
        <span>${data.Results[idx].Server}</span>
       
        </a>
        </li>
        
       ` )};
        profileWatch();
}

//Watches for the click on the mini Profile
function profileWatch() {

    $('.characterUrl').on('click', function (event) {
        event.preventDefault();



        let playerDataUrl = $(this).attr('href');
        console.log(playerDataUrl);

        fetch(playerDataUrl)
        .then(response => {
            if(response.ok){
                return response.json();
            } else {
                throw new Error(response.statusText);
            }
        })
        .then(results => displayCharacterData(results))
        .catch(error => {
            alert(`Something Went Wrong: ${error.message}`);
        });
        console.log("click");
    })

}

function displayCharacterData(results) {
    console.log("DisplayChararcterData Ran");
    $('.results').empty();
    console.log(typeof(results));
    

    let res = results.Character.ClassJobs[0].Level;
    console.log(res);

    $('#js-characterData').append(`
        <div class="leftSideContainer">
            <p>${results.Character.Name}</p>
            <p>${results.Character.Server}</p>
            <img class="charPortrait" src="${results.Character.Portrait}">
        </div>
            
    `);

}


$(formWatch);
