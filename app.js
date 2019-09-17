
const charUrl = "xivapi.com/character/search?";
const profileUrl = "https://xivapi.com/character/";
const corsApiHost = "https://cors-anywhere.herokuapp.com/";


//Watches for search button to be clicked on
//Initializes get search results
function formWatch() {
    $('#js-form').submit(event => {
        event.preventDefault();
        $('nav').removeClass('nav');
        $('nav').addClass('navTop');
        $('.characterBox').addClass('hidden');
        $('.footer').addClass('bottom');
        $('.header').addClass('hidden');
        $('.navTitle').removeClass('hidden');
        $('.error').empty();

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
        name: playerName,
        server: serverName
    }
    const queryString = generateQueryString(params);
    const searchUrl = corsApiHost + charUrl + queryString;   

    fetch(searchUrl)
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error(response.statusText);
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
    $('.footer').removeClass('bottom');
    $('.results').empty();

    if(data.Results.length === 0) {
        $('.error').html(`
            <h2>Character Not Found</h2>
        `)
    }

    for (let idx = 0; idx < data.Results.length; idx++) {
        $('.results').append(`
        <li class="searchResults">
        <a class="characterUrl" href="https://xivapi.com/character/${data.Results[idx].ID}">
        <img class="avatar" src="${data.Results[idx].Avatar}" alt="Players Avatar Picture">
        
        <span>${data.Results[idx].Name}</span>
        <span>${data.Results[idx].Server}</span>
       
        </a>
        </li>
        
       ` )
    };
    profileWatch();
}

//Watches for the click on the mini Profile
function profileWatch() {

    $('.characterUrl').on('click', function (event) {
        event.preventDefault();

        let dataParams = "?extended=1&data=MIMO,FC"
        let playerData = $(this).attr('href');
        let playerDataUrl = playerData + dataParams;

        fetch(playerDataUrl)
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error(response.statusText);
                }
            })
            .then(results => displayCharacterData(results))
            .catch(error => {
                alert(`Something Went Wrong: ${error.message}`);
            });

    })

}


//Displays all character data recieved
//including minion + mount totals
//Along with current stats for that job
//Along with current gear equipped
function displayCharacterData(results) {

    $('.characterBox').removeClass('hidden');
    
    $('.results').empty();

    let toon = results.Character;
    let FC = results.FreeCompany;

    $('.nameAndServer').html(displayPlayerInfo(toon, FC));

    $('.characterPortrait').html(`
        <img class="charPortrait" src=${toon.Portrait}>
    `);

    $('.minions').html(calculateMinionTotal(results));
    $('.mounts').html(calculateMountTotal(results));
    displayStats(toon);
    displayJobLevels(toon);
    displayGear(toon);
    displayActiveJob(toon);

}

//Displays the players
//Name, Server, Data Center, FC and GC
function displayPlayerInfo(toon, FC) {

    let name = toon.Name;
    let server = toon.Server;
    let dc = toon.DC;
    let playerFC = checkFCStatus(FC);
    let playerGC = checkGCStatus(toon);

    return `
        <p>${name}</p>
        <p>${server} (${dc})</p>
        ${playerFC}
        ${playerGC}  
    `
}

//Checks to see if player is in a Free Company
function checkFCStatus(FC) {

    if (FC === null) {
        return ``
    }
    return `
    <p>Free Company: ${FC.Name}</p>
    `
}

//Checks to see if player is in a Grand Company
function checkGCStatus(toon) {

    let GC = toon.GrandCompany.Company;
    if (GC === null) {
        return ``
    }
    return `
    <p>Grand Company: ${GC.Name}</p>
    `
}

function displayActiveJob(toon) {

    let jobName = toon.ActiveClassJob.Job.Abbreviation;
    let jobLevel = toon.ActiveClassJob.Level;
    let jobIcon = toon.ActiveClassJob.Job.Icon;
    let maxExp = toon.ActiveClassJob.ExpLevelMax;
    let currentExp = toon.ActiveClassJob.ExpLevelTogo;

    $('.activeJobIcon').html(`
    <img class="activeJobIcon" src="https://xivapi.com${jobIcon}">
    `);

    $('.activeJob').html(`
    <p>${jobName}</p>
    `);

    $('.activeLevel').html(`
    <p>Level: ${jobLevel}</p>
    `);

    $('.exp').html(checkLevel(jobLevel, maxExp, currentExp));
}

function checkLevel(jobLevel, maxExp, currentExp) {

    if (jobLevel === 80) {
        return ``
    }

    return `
    <img src="images/065001.png" alt="Exp Icon" class="expIcon">
    <p>${currentExp} / ${maxExp}</p>
    `
}

function calculateMinionTotal(results) {

    let minionTotal = results.Minions.length;
    return `<p>Total Minions : ${minionTotal}</p>`

}

function calculateMountTotal(results) {

    let mountTotal = results.Mounts.length;
    return `<p>Total Mounts: ${mountTotal}</p>`

}

//Displays the stats
function displayStats(toon) {

    let stats = Object.keys(toon.GearSet.Attributes).map(
        function (attr) {
            let value = toon.GearSet.Attributes[attr];
            return value;
        }
    )

    $('.str').html(`${stats[0].Value}`);
    $('.dex').html(`${stats[1].Value}`);
    $('.vit').html(`${stats[2].Value}`);
    $('.int').html(`${stats[3].Value}`);
    $('.mnd').html(`${stats[4].Value}`);

    $('.ch').html(`${stats[5].Value}`);
    $('.det').html(`${stats[6].Value}`);
    $('.dh').html(`${stats[7].Value}`);

    $('.def').html(`${stats[8].Value}`);
    $('.mdef').html(`${stats[9].Value}`);

    $('.atk').html(`${stats[10].Value}`);
    $('.sks').html(`${stats[11].Value}`);

    $('.atkMagic').html(`${stats[12].Value}`);
    $('.healMagic').html(`${stats[13].Value}`);
    $('.sps').html(`${stats[14].Value}`);

    $('.ten').html(`${stats[15].Value}`);
    $('.pie').html(`${stats[16].Value}`);

}

//Grabs the level of each class
//then displays it
function displayJobLevels(toon) {

    let level = toon.ClassJobs.map(el => el.Level);

    $('.pld').html(`${level[0]}`);
    $('.war').html(`${level[1]}`);
    $('.drk').html(`${level[2]}`);
    $('.gnb').html(`${level[3]}`);

    $('.whm').html(`${level[8]}`);
    $('.sch').html(`${level[9]}`);
    $('.ast').html(`${level[10]}`);

    $('.mnk').html(`${level[4]}`);
    $('.drg').html(`${level[5]}`);
    $('.nin').html(`${level[6]}`);
    $('.sam').html(`${level[7]}`);

    $('.brd').html(`${level[11]}`);
    $('.mch').html(`${level[12]}`);
    $('.dnc').html(`${level[13]}`);

    $('.blm').html(`${level[14]}`);
    $('.smn').html(`${level[15]}`);
    $('.rdm').html(`${level[16]}`);
    $('.blu').html(`${level[17]}`);

    $('.crp').html(`${level[18]}`);
    $('.bsm').html(`${level[19]}`);
    $('.arm').html(`${level[20]}`);
    $('.gsm').html(`${level[21]}`);
    $('.ltw').html(`${level[22]}`);
    $('.wvr').html(`${level[23]}`);
    $('.alc').html(`${level[24]}`);
    $('.cul').html(`${level[25]}`);

    $('.min').html(`${level[26]}`);
    $('.btn').html(`${level[27]}`);
    $('.fsh').html(`${level[28]}`);

}

function displayGear(toon) {

    let leftParts = ['MainHand', 'Head', 'Body', 'Hands', 'Waist', 'Legs', 'Feet'];
    let rightParts = ['OffHand', 'Earrings', 'Necklace', 'Bracelets', 'Ring1', 'Ring2'];
    let gear = toon.GearSet.Gear;

    $('.gear').html(getGearColumns(gear, leftParts, rightParts));
    $('.ilvl').html(getItemLevel(gear));
}
//Creates an array of the gear list
//Then filters out the soul crystal out of the list
//To allow for a proper Item level calculation
function getItemLevel(gear) {

    let itemList = Object.keys(gear).map(
        function (key) {
            let value = gear[key].Item
            return value;

        }
    )

    const soulCrystalPrefix = 'Soul of the';

    let filteredItems = itemList.filter(item => !item.Name.includes(soulCrystalPrefix));

    let itemLevel = Object.keys(filteredItems).map(
        function (key) {
            let value = filteredItems[key].LevelItem;
            return value;
        }
    );

    let ilvl = calculateLevel(itemLevel);

    return ilvl;
}

//Adds every value together
//Divided by the length of the array
//to calculate the average item level
function calculateLevel(itemLevel) {

    let sum = 0;

    for (let el in itemLevel) {
        if (itemLevel.hasOwnProperty(el)) {
            sum += parseFloat(itemLevel[el]);

        }

    }
    let total = Math.round(sum / itemLevel.length);
    return total;
}

//Checks and returns if materia is present on any of the gear pieces
function getMateria(part) {

    if (part && part.Materia.length > 0) {
        return part.Materia.map(
            materia => `<div class="Materia">
            <img src="https://xivapi.com${materia.Icon}">
            ${materia.Name}
            </div>
            `
        );
    } else {
        return `<div class="Materia">
                <h5></h5>
                </div>

        `
    }
}


//Gets and returns all currently equipped gear
function getGearItem(gear, partName) {

    let part = gear[partName];
    let materia = getMateria(part);

    if (part != undefined) {
        return `
        <li class="bodyPart ${partName}">
        <h4>${partName}</h4>
        <img src="https://xivapi.com${part.Item.Icon}">
        ${part.Item.Name}
        ${materia}
        </li>
    `;
    } else {
        return `
            <li class="bodyPart ${partName}">
            <h4>${partName}</h4>
            <h5>Not Equipped</h5>
            </li>
        `
    }

}

//breaks up the gear into 2 columns
function getGearColumns(gear, column1, column2) {

    let leftColumn = column1.map(
        partName => getGearItem(gear, partName)
    ).join('');

    let rightColumn = column2.map(
        partName => getGearItem(gear, partName)
    ).join('');

    return `<div class="gearColumns">
        <ul class="bodyParts left">${leftColumn}</ul>
        <ul class="bodyParts right">${rightColumn}</ul>
    `
}


$(formWatch);
