
window.onload = function () {
    console.log('DOM has loaded');




    var myFirstRouter = new Router('myFirstRouter', [
        {
            path: '/home',
            name: 'Root',
            callback: 'loadHome'
        }, {
            path: '/characters',
            name: 'About'
        }, {
            path: /^\/details\/([^&]+)/g,
            name: 'Details',
            callback: 'loadDetails',
        }
    ], '/home');


    var currentRoute = myFirstRouter.resolvePath();

    console.log(currentRoute);

}

var Router = function (name, routes, defaultRoute = '/') {
    this.name = name; 
    this.routes = routes; 
    this.defaultRoute = defaultRoute
}

Router.prototype.resolvePath = function () {
    var currentPath = window.location.pathname;
    var params = [];
    var route = this.routes.filter(function (r) {
        if(typeof r.path === 'string') {
            return r.path === currentPath
        } else if(typeof r.path !== 'undefiend') {
            let m = r.path.exec(currentPath);
            if(m !== null) {
                if(typeof m[1] !== 'undefined') {
                    params.push(m[1]);
                }
                return true;
            }
        } 
        return false;
    })[0];

    if (typeof route === 'undefined') {
        window.location.pathname = this.defaultRoute;
        return;
    }
    if (typeof route.callback !== 'undefined') {
        var paramsStr = '(\'' + params.join('\',\')') + '\')';
        try {
            eval(route.callback + paramsStr);
        } catch (error) {
            alert('Function doesn\'t exists');
        }
    } else {
        alert('Callback function undefined.');
    }
    return route;

}

function renderCharacterCard(person) {
    var characterDiv = document.createElement('div');
    characterDiv.classList.add('character');

    let characterImage = document.createElement('img');
    characterImage.classList.add('character__image');
    characterImage.src = `${person.image}`;

    let characterName = document.createElement('span');
    characterName.classList.add('character__name');
    characterName.innerHTML = `${person.name}`;

    let characterSpecie = document.createElement('span');
    characterSpecie.classList.add('character__name');
    characterSpecie.innerHTML = `${person.species}`;

    let characterGender = document.createElement('span');
    characterGender.classList.add('character__name');
    characterGender.innerHTML = `${person.gender}`;

    characterDiv.appendChild(characterImage);
    characterDiv.appendChild(characterName);
    characterDiv.appendChild(characterSpecie);
    characterDiv.appendChild(characterGender);
    return characterDiv;
}

function renderCharacterDetails(person) {

}

function fetchData(route = '') {
    route = 'https://rickandmortyapi.com/api/' + route;
    return fetch(route)
        .then(response => response.json())
        .catch(err => console.error(err.message));
}


function loadDetails(characterId = null) {
    if(characterId === null) {
        alert('No character id');
    }
}

function loadHome() {
    var appDiv = document.getElementById('app');
    fetchData('/character/1,2,3')
        .then(response => {
            let mainCharacters = document.createElement('div');
            mainCharacters.id = 'mainCharacters';
            mainCharacters.classList.add('mainCharacters');

            response.map(person => {
                mainCharacters.appendChild(renderCharacterCard(person));
            });
            appDiv.innerHTML = '';
            appDiv.appendChild(mainCharacters);
        })
}
