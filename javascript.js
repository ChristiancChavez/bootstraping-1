
fetch('https://rickandmortyapi.com/api/character/')
.then(response => response.json())
.then(response => {
    console.log(response);
    let mainCharacters = document.getElementById('mainCharacters');
    
    response.results.map(person => {

        let character = document.createElement('div');
        character.classList.add('character');

        let characterImage = document.createElement('img');
        characterImage.classList.add('character__image');
        characterImage.src=`${person.image}`;

        let characterName = document.createElement('span');
        characterName.classList.add('character__name');
        characterName.innerHTML=`${person.name}`;

        let characterSpecie = document.createElement('span');
        characterSpecie.classList.add('character__name');
        characterSpecie.innerHTML= `${person.species}`;

        let characterGender = document.createElement('span');
        characterGender.classList.add('character__name');
        characterGender.innerHTML=`${person.gender}`;

        mainCharacters.appendChild(character);
        character.appendChild(characterImage);
        character.appendChild(characterName);
        character.appendChild(characterSpecie); 
        character.appendChild(characterGender);
    })

    

})
.catch(err => console.log(err.message));
