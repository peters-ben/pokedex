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
    document.getElementById("pokemon-name").innerText = "Name: " + data.forms[0].name.slice(0,1).toUpperCase() +
        data.forms[0].name.slice(1);
    document.getElementById("pokemon-type").innerText = "Type: " + data.types[0].type.name.slice(0,1).toUpperCase() +
        data.types[0].type.name.slice(1);
    document.getElementById("pokemon-weight").innerText = "Weight: " + (data.weight / 10) + " kg";
    document.getElementById("pokemon-img").src = data.sprites.front_default;
})
.catch(error => console.log("ERROR"));
    }
}