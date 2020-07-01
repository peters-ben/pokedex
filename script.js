function submit(choice) {
    let pokemon = document.getElementById("search").value;
    pokemon = pokemon.toLowerCase();
    if(choice == 1) {
        pokemon = Math.floor(Math.random() * 806) + 1;
    }
    if(pokemon == "" && choice == 0) {

    } else {
        if (!isNaN(parseInt(pokemon))) 
            pokemon = parseInt(pokemon);
    fetch("https://pokeapi.co/api/v2/pokemon/" + pokemon).then(res => {
        if(res.ok) {
            console.log("Success!");
            return res.json();
        } else {
            document.getElementById("pokemon-name").innerText = "Name: Unknown Pokemon";
            document.getElementById("pokemon-type").innerText = "Type: N/A"
            document.getElementById("pokemon-weight").innerText = "Weight: N/A";
            document.getElementById("pokemon-img").src = "https://w7.pngwing.com/pngs/190/415/png-transparent-pokemon-gold-and-silver-pokemon-heartgold-and-soulsilver-pokemon-ruby-and-sapphire-question-mark-text-trademark-logo.png";
            document.getElementById("pokemon-img").height = "100";
            document.getElementById("pokemon-description").innerText = "No description available.";
            console.log("Error!");
        }

}).then(data => {
    let name = data.forms[0].name.slice(0,1).toUpperCase() +
        data.forms[0].name.slice(1);
    let id = parseInt(data.id);
    if(id < 100) {
        if(id < 10) {
            id = "00" + id;
        }
        else {
            id = "0" + id;
        }
    }
    fetch("https://pokeapi.co/api/v2/pokemon-species/" + parseInt(id)).then(res2 => {
        if(res2.ok) {
            console.log("Species Success!");
            return res2.json();
        } else {

        }
    }).then(species => {
        for(i = 10; i < 20; i++) {
            if(species.flavor_text_entries[i].language.name == "en") {
                console.log(i);
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
    let height = data.height / 10;
    let type = data.types[0].type.name.slice(0,1).toUpperCase() +
    data.types[0].type.name.slice(1);
    let weight = data.weight / 10;
    document.getElementById("pokeball-img").src = "https://p7.hiclipart.com/preview/858/879/587/5bbeb70d53fc2.jpg"
    document.getElementById("pokemon-name").innerText = id + "\t" + name;
    document.getElementById("pokemon-type").innerText = type; 
    document.getElementById("pokemon-weight").innerText = "Weight: " + weight + " kg";
    document.getElementById("pokemon-height").innerText = "Height: " + height + " m";
    document.getElementById("pokemon-img").src = "images/" + id + ".png";
}).catch(error => console.log("ERROR"));
    }
}