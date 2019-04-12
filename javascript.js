
fetch('https://rickandmortyapi.com/api/character/')
.then(response => response.json())
.then(response => {
    console.log(response);
    let mainCharacters = document.getElementById('mainCharacters');
    
    // const characterCard = response.results.map(person => {

    //     let character = document.createElement('div');
    //     character.setAttribute('class', 'character');

    //     let characterImage = document.createElement('img');
    //     characterImage.setAttribute('class', 'character__image');

    //     let characterName = document.createElement('span');
    //     characterName.setAttribute('class', 'character__name');

    //     let characterSpecie = document.createElement('span');
    //     characterSpecie.setAttribute('class', 'character__name');

    //     let characterGender = document.createElement('span');
    //     characterGender.setAttribute('class', 'character__name');
        
    //     characterImage.src=`${person.image}`;
    //     characterName.innerHTML=`${person.name}`;
    //     characterSpecie.innerHTML= `${person.species}`;
    //     characterGender= innerHTML=`${person.gender}`;
    //     character.appendChild(characterImage);
    //     character.appendChild(characterName);
    //     character.appendChild(characterSpecie);
    //     character.appendChild(characterGender);
    // })
    mainCharacters.innerHTML = "characterCard";

})
.catch(err => console.log(err.message))
