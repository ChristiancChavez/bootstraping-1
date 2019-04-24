
window.onload = function () {
    var myFirstRouter = new Router('myFirstRouter', [
        {
            path: '/home',
            name: 'Root',
            callback: 'homePage'
        }, {
            path: '/characters',
            name: 'Characters',
            callback: 'charactersPage'
        }, {
            path: /^\/details\/([^&]+)/g,
            name: 'Details',
            callback: 'detailsPage',
        }
    ], '/home');

    var currentRoute = myFirstRouter.resolvePath();
}

var Router = function (name, routes, defaultRoute = '/') {
    this.name = name;
    this.routes = routes;
    this.defaultRoute = defaultRoute;
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
        try {
            this[route.callback](params);
        } catch (error) {
            alert('Function doesn\'t exists');
        }
    } else {
        alert('Callback function undefined.');
    }
    return route;
}

Router.prototype.homePage = function() {
    var appDiv = document.getElementById('app');
    fetchData('character/1,2,3')
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
Router.prototype.charactersPage = function() {
    var appDiv = document.getElementById('app');
    fetchData('character')
        .then(response => {
            let mainCharacters = document.createElement('div');
            mainCharacters.id = 'mainCharacters';
            mainCharacters.classList.add('mainCharacters');

            response.results.map(person => {
                mainCharacters.appendChild(renderCharacterCard(person));
            });
            appDiv.innerHTML = '';
            appDiv.appendChild(mainCharacters);
        })
}
Router.prototype.detailsPage = function(params) {
    let id = params[0];
    var appDiv = document.getElementById('app');
    fetchData('character/' + id)
        .then(response => {
            // handle details page.
        })
}

function renderCharacterCard(person) {
    var characterDiv = document.createElement('div');
    characterDiv.classList.add('character');

    
    let characterLink = document.createElement('a');
    characterLink.classList.add('character__link');
    characterLink.href = `/details/${person.id}`;

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

    characterLink.appendChild(characterImage);
    characterLink.appendChild(characterName);
    characterLink.appendChild(characterSpecie);
    characterLink.appendChild(characterGender);
    characterDiv.appendChild(characterLink);
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

