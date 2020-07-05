function submit(choice) {
    let pokemon = document.getElementById("search").value;
    pokemon = pokemon.toLowerCase();
    if (!isNaN(parseInt(pokemon))) 
    pokemon = parseInt(pokemon);
    if(choice == 1) {
        pokemon = Math.floor(Math.random() * 806) + 1;
    }
    if(pokemon == "" && choice == 0) {

    } else {
    getData(pokemon).then(data => {
        let id = parseInt(data.id);
        if(id < 100) {
            if(id < 10) 
                id = "00" + id;
            else 
                id = "0" + id;
        }
        getSpecies(id);
        if(document.getElementById("pokemon-info").style.display == "none")
        document.getElementById("pokemon-info").style.display = "block";
        let height = data.height / 10;
        let type = data.types[0].type.name.slice(0,1).toUpperCase() +
        data.types[0].type.name.slice(1);
        let weight = data.weight / 10;
        let name = data.forms[0].name.slice(0,1).toUpperCase() +
        data.forms[0].name.slice(1);
        document.getElementById("pokeball-img").src = "https://p7.hiclipart.com/preview/858/879/587/5bbeb70d53fc2.jpg"
        document.getElementById("pokemon-name").innerText = id + "\t" + name;
        document.getElementById("pokemon-type").innerText = type; 
        document.getElementById("pokemon-weight").innerText = "Weight: " + weight + " kg";
        document.getElementById("pokemon-height").innerText = "Height: " + height + " m";
        document.getElementById("pokemon-img").src = "images/" + id + ".png";
        })
    }
}
function getData(pokemon) {
    return fetch("https://pokeapi.co/api/v2/pokemon/" + pokemon).then(res => {
    if(res.ok) {
        console.log("Success!");
        return res.json();
    } else {
        document.getElementById("pokeball-img").src = "https://p7.hiclipart.com/preview/858/879/587/5bbeb70d53fc2.jpg"
        document.getElementById("pokemon-name").innerText = "--- Unknown Pokemon";
        document.getElementById("pokemon-type").innerText = "Type: N/A"
        document.getElementById("pokemon-weight").innerText = "Weight: N/A";
        document.getElementById("pokemon-height").innerText = "Height: N/A";
        document.getElementById("pokemon-img").src = "https://w7.pngwing.com/pngs/190/415/png-transparent-pokemon-gold-and-silver-pokemon-heartgold-and-soulsilver-pokemon-ruby-and-sapphire-question-mark-text-trademark-logo.png";
        
        document.getElementById("pokemon-description").innerText = "No description available.";
        console.log("Error!");
    }
    }).then(data => {
        console.log(data);
        return data;
    }).catch(error => {
        console.log(error);
    })
}
function getSpecies(id) {
    return fetch("https://pokeapi.co/api/v2/pokemon-species/" + parseInt(id)).then(res => {
        if(res.ok) {
            console.log("Species Success!");
            return res.json();
        } else {
            console.log("Species Error!");
        }
    }).then(species => {
        for(i = 10; i < 20; i++) {
            if(species.flavor_text_entries[i].language.name == "en") {
                let description = species.flavor_text_entries[i].flavor_text;
                document.getElementById("pokemon-description").innerText = description;
                break;
            }
            else {
                let description = "No description available."
                document.getElementById("pokemon-description").innerText = description;
            }
        }
    }).catch(error => console.log("SPECIES ERROR!"));
}
function register() {
    if(document.getElementById("password").value != document.getElementById("re-password").value) {
        document.getElementById("error").innerText = "ERROR: Passwords must match!";
        console.log("Error! passwords don't match");
    }
    else if(document.getElementById("password").value.length < 5) {
        document.getElementById("error").innerText = "ERROR: Password must be 5+ characters long!";
        console.log("Error! password too short");
    }
    else if(document.getElementById("username").value.length < 3 || document.getElementById("username").value.length > 15) {
        document.getElementById("error").innerHTML = "ERROR: Username must be 3-15 characters long!";
        console.log("Error! username too short!");
    }
    else {
        document.getElementById("error").innerHTML = "";
        console.log("Successful register!");
    }
}