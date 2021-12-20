// fetch("http(s)://gateway.marvel.com/v1/public/characters?ts=1&apikey=a3cc71ff467c732d5714a0b926bd1b98&hash=d74e53c016d47b718f7dc2d18b895d11")


const searchName = document.getElementById("search");
const buttonSearch = document.getElementById("btn-search");
const card = document.querySelector(".card");
const autocompleteList = document.querySelector(".autocomplete-list");
const listItem = document.querySelectorAll("li")
const characterHeading = document.querySelector("#character-name");
const flipCard = document.querySelector(".comic-wrapper")
const comicTitle = document.querySelector(".comic-section-title")
const mainPage = document.querySelector(".main-page")
const moreInfo = document.querySelector(".more-info")
const main = document.querySelector("main");


const fetchCharacter = async (heroName) => {
    const res = await fetch(`https://gateway.marvel.com:443/v1/public/characters?nameStartsWith=${heroName}&ts=1&apikey=103c509c56473454eca9811f5773ffcf&hash=f6bc4b0de535e3012f670ab2b28991c8`);
    const data = await res.json();
    return data;
}




const fetchComics = async (characterId) => {
    const res = await fetch(`https://gateway.marvel.com:443/v1/public/characters/${characterId}/comics?orderBy=focDate&ts=1&apikey=103c509c56473454eca9811f5773ffcf&hash=f6bc4b0de535e3012f670ab2b28991c8&limit=50`)
    const data = await res.json();
    console.log(data);
    return data;
}

const fetchCharacterList = () => {
    searchName.addEventListener("input",async(e) => {
        
        const searchOnInput = await fetchCharacter(e.target.value)
        const searchResults = searchOnInput.data.results;
        clearList();
        searchResults.forEach((hero)=> {
            const a = document.createElement("li"); 
            a.innerHTML = hero.name
            autocompleteList.appendChild(a);
        })
        const listItem = document.querySelectorAll("li")
        listItem.forEach((item) => {
            item.addEventListener("click", () => {
              searchName.value = item.textContent 
              clearList();
              searchCharacter();
            })
        })
    })
}

window.addEventListener("click", () => {
    clearList();
})

fetchCharacterList();

function clearList () {
    autocompleteList.innerHTML = ""
}

async function searchCharacter() {
    const heroName = searchName.value;
    const character = await fetchCharacter(heroName)
    const hero = character.data.results
    const heroId = hero[0].id;
    const comics  = await fetchComics(heroId)
    const comic = comics.data.results
    console.log(comic);
    console.log(hero);
    clearComics();
    clearMoreInfo();
    
    mainPage.innerHTML = ""
    characterHeading.textContent = `${hero[0].name}`
    card.innerHTML = `<img src="${hero[0].thumbnail.path}.${hero[0].thumbnail.extension}" class="card-img-top" alt="...">
    <div class="card-body">
      <p class="card-text"> ${hero[0].description}</p>
    </div>`

    const cardText = document.querySelector(".card-text");

    if (hero[0].description == "" || hero[0].description == " ") {
        cardText.textContent = "Description not available"    
    }

   comicTitle.textContent = "Comics"

   
    for (let i = 0; i < 3; i++ ) {
        let randomI = Math.floor(Math.random()*(49-0 +1)+0)
        const comicCardDiv = document.createElement("div") 
        comicCardDiv.innerHTML =
        `<div class="flip-card">
           <div class="flip-card-inner">
               <div class="flip-card-front">
                <img class="comic-img" src="${comic[randomI].thumbnail.path}.${comic[randomI].thumbnail.extension}" alt="Avatar">
               </div>
               <div class="flip-card-back">
                 <h4 class="comic-title">${comic[randomI].title}</h4>
                 <p class="comic-description">${comic[randomI].description}</p>
                 <p class="comic-date">${comic[randomI].dates[0].date.slice(0,4)}</p>
               </div>
           </div>
         </div>`
        flipCard.appendChild(comicCardDiv);
    }

    const linksTitle = document.createElement("h2");
    linksTitle.innerText = "Link to other resources"
    moreInfo.appendChild(linksTitle);
    const linkDiv = document.createElement("div")
    moreInfo.appendChild(linkDiv);
    linkDiv.setAttribute("class", "resources-links")

    for (let i = 0; i < 3; i++) {
      const linkLi = document.createElement("a")
      linkLi.setAttribute("href", `${hero[0].urls[i].url}`)
      linkLi.setAttribute("target", "_blank")
      linkLi.innerHTML = capitalizeFirstLetter(`${hero[0].urls[i].type}`)
      linkDiv.appendChild(linkLi);
    }
}

   

const fetchCharacterByName = () => {
    buttonSearch.addEventListener("click", (e)=> {
        e.preventDefault();
         searchCharacter();
    })
}

function clearComics() {
    flipCard.innerHTML = "";
}

function clearMoreInfo() {
    moreInfo.innerHTML = "";
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1); 
}


fetchCharacterByName();









