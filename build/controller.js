"use strict";

fetch('https://rickandmortyapi.com/api/character/').then(function (response) {
  return response.json();
}).then(function (response) {
  console.log(response);
  var mainCharacters = document.getElementById('mainCharacters');
  response.results.map(function (person) {
    var character = document.createElement('div');
    character.classList.add('character');
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
    mainCharacters.appendChild(character);
    character.appendChild(characterImage);
    character.appendChild(characterName);
    character.appendChild(characterSpecie);
    character.appendChild(characterGender);
  });
}).catch(function (err) {
  return console.log(err.message);
});