"use strict";

window.onload = function () {
  var myFirstRouter = new Router('myFirstRouter', [{
    path: '/home',
    name: 'Root',
    callback: 'homePage'
  }, {
    path: '/characters',
    name: 'Characters',
    callback: 'charactersPage'
  }, {
    path: /^\/characters\/([^&]+)/g,
    name: 'Characters',
    callback: 'charactersPage'
  }, {
    path: /^\/details\/([^&]+)/g,
    name: 'Details',
    callback: 'detailsPage'
  }], '/home');
  var currentRoute = myFirstRouter.resolvePath();
};

var Router = function Router(name, routes) {
  var defaultRoute = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '/';
  this.name = name;
  this.routes = routes;
  this.defaultRoute = defaultRoute;
};

Router.prototype.resolvePath = function () {
  var currentPath = window.location.pathname;
  var params = [];
  var route = this.routes.filter(function (r) {
    if (typeof r.path === 'string') {
      return r.path === currentPath;
    } else if (typeof r.path !== 'undefiend') {
      var m = r.path.exec(currentPath);

      if (m !== null) {
        if (typeof m[1] !== 'undefined') {
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
};

Router.prototype.homePage = function () {
  var appDiv = document.getElementById('app');
  fetchData('character/1,2,3').then(function (response) {
    var mainCharacters = document.createElement('div');
    mainCharacters.id = 'mainCharacters';
    mainCharacters.classList.add('mainCharacters');
    response.map(function (person) {
      mainCharacters.appendChild(renderCharacterCard(person));
    });
    appDiv.innerHTML = '';
    appDiv.appendChild(mainCharacters);
  });
};

Router.prototype.charactersPage = function () {
  var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [1];
  var page = params[0];
  var appDiv = document.getElementById('app');
  fetchData("character?page=".concat(page)).then(function (response) {
    // Pagination.
    console.log(response.info);
    var mainCharacters = document.createElement('div');
    mainCharacters.id = 'mainCharacters';
    mainCharacters.classList.add('mainCharacters');
    response.results.map(function (person) {
      mainCharacters.appendChild(renderCharacterCard(person));
    });
    appDiv.innerHTML = '';
    appDiv.appendChild(mainCharacters);
  });
};

Router.prototype.detailsPage = function (params) {
  var id = params[0];
  var appDiv = document.getElementById('app');
  fetchData('character/' + id).then(function (response) {// handle details page.
  });
};

function renderCharacterCard(person) {
  var characterDiv = document.createElement('div');
  characterDiv.classList.add('character');
  var characterLink = document.createElement('a');
  characterLink.classList.add('character__link');
  characterLink.href = "/details/".concat(person.id);
  var characterImage = document.createElement('img');
  characterImage.classList.add('character__image');
  characterImage.src = "".concat(person.image);
  var characterName = document.createElement('span');
  characterName.classList.add('character__name');
  characterName.innerHTML = "".concat(person.name);
  var characterSpecie = document.createElement('span');
  characterSpecie.classList.add('character__name');
  characterSpecie.innerHTML = "".concat(person.species);
  var characterGender = document.createElement('span');
  characterGender.classList.add('character__name');
  characterGender.innerHTML = "".concat(person.gender);
  characterLink.appendChild(characterImage);
  characterLink.appendChild(characterName);
  characterLink.appendChild(characterSpecie);
  characterLink.appendChild(characterGender);
  characterDiv.appendChild(characterLink);
  return characterDiv;
}

function renderCharacterDetails(person) {}

function fetchData() {
  var route = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
  route = 'https://rickandmortyapi.com/api/' + route;
  return fetch(route).then(function (response) {
    return response.json();
  }).catch(function (err) {
    return console.error(err.message);
  });
}