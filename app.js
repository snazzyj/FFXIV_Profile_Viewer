
const private_key = "f369b58d6e7141439bc7b563f4c90bf1bf6a5e82d5f249088c7436606bba0460";
const charUrl = "https://xivapi.com/character/search?";
const profileUrl = "https://xivapi.com/character/";


//Watches for search button to be clicked on
//Initializes get search results
function formWatch () {
    $('#js-form').submit(event => {
        event.preventDefault();
        $('nav').removeClass('nav');
        $('nav').addClass('navTop');

        const playerName = $('#userSearch').val();
        const serverName = document.getElementById('serverList').value;

        getSearchResults(playerName, serverName);
        console.log(playerName);
        console.log(serverName);
        
        console.log("click")
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
        private_key : private_key,
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

    $('#js-results').empty();

    for(let idx = 0; idx < data.Results.length; idx++){
        $('#js-results').append(`
        <a href="https://xivapi.com/character/${data.Results[idx].ID}">
        <div class="miniProfile">
        <img class="avatar" src="${data.Results[idx].Avatar}" alt="Players Avatar Picture">
        <div class="profileInfo">
        <p>${data.Results[idx].Name}</p>
        <p>${data.Results[idx].Server}</p>
        </div>
        </div>
        </a>`
        )};
        profileWatch();
}

//Watches for the click on the mini Profile
function profileWatch() {

    $('.miniProfile').on('click', function (event) {
        event.preventDefault();
        console.log("click");
    })

}



$(formWatch);
