"use strict";

window.onload = function () {
  console.log('DOM has loaded');
  var myFirstRouter = new Router('myFirstRouter', [{
    path: '/home',
    name: 'Root',
    callback: 'loadHome'
  }, {
    path: '/characters',
    name: 'About'
  }, {
    path: /^\/details\/([^&]+)/g,
    name: 'Details',
    callback: 'loadDetails'
  }], '/home');
  var currentRoute = myFirstRouter.resolvePath();
  console.log(currentRoute);
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
};

function renderCharacterCard(person) {
  var characterDiv = document.createElement('div');
  characterDiv.classList.add('character');
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
  characterDiv.appendChild(characterImage);
  characterDiv.appendChild(characterName);
  characterDiv.appendChild(characterSpecie);
  characterDiv.appendChild(characterGender);
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

function loadDetails() {
  var characterId = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

  if (characterId === null) {
    alert('No character id');
  }
}

function loadHome() {
  var appDiv = document.getElementById('app');
  fetchData('/character/1,2,3').then(function (response) {
    var mainCharacters = document.createElement('div');
    mainCharacters.id = 'mainCharacters';
    mainCharacters.classList.add('mainCharacters');
    response.map(function (person) {
      mainCharacters.appendChild(renderCharacterCard(person));
    });
    appDiv.innerHTML = '';
    appDiv.appendChild(mainCharacters);
  });
}