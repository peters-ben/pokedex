function submit() {
    let pokemon = document.getElementById("search").value;
    pokemon = pokemon.toLowerCase();
    if(pokemon == "") {

    } else {
    fetch("https://pokeapi.co/api/v2/pokemon/" + pokemon).then(res => {
        if(res.ok) {
            console.log("Success!");
            return res.json();
        } else {
            document.getElementById("pokemon-name").innerText = "Name: Unknown Pokemon";
            document.getElementById("pokemon-type").innerText = "Type: N/A"
            document.getElementById("pokemon-weight").innerText = "Weight: N/A";
            document.getElementById("pokemon-img").src = "https://w7.pngwing.com/pngs/190/415/png-transparent-pokemon-gold-and-silver-pokemon-heartgold-and-soulsilver-pokemon-ruby-and-sapphire-question-mark-text-trademark-logo.png";
            document.getElementById("pokemon-img").height = "100"; !important
            console.log("Error!");
        }

}).then(data => {
    let name = data.forms[0].name.slice(0,1).toUpperCase() +
        data.forms[0].name.slice(1);
    let id = data.id;
    if(id < 100) {
        if(id < 10) {
            id = "00" + id;
        }
        else {
            id = "0" + id;
        }
    }
    let height = data.height;
    let type = data.types[0].type.name.slice(0,1).toUpperCase() +
    data.types[0].type.name.slice(1);
    let weight = data.weight / 10;
    document.getElementById("pokeball-img").src = "https://p7.hiclipart.com/preview/858/879/587/5bbeb70d53fc2.jpg"
    document.getElementById("pokemon-name").innerText = id + "\t" + name;
    document.getElementById("pokemon-type").innerText = "Type: "+ type; 
    document.getElementById("pokemon-weight").innerText = "Weight: " + weight + " kg";
    document.getElementById("pokemon-img").src = data.sprites.front_default;
})
.catch(error => console.log("ERROR"));
    }
}