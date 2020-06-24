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
            console.log("Error!");
        }

}).then(data => {
    document.getElementById("pokemon-name").innerText = "Name: " + data.forms[0].name.slice(0,1).toUpperCase() +
        data.forms[0].name.slice(1);
    document.getElementById("pokemon-type").innerText = "Type: " + data.types[0].type.name.slice(0,1).toUpperCase() +
        data.types[0].type.name.slice(1);
    document.getElementById("pokemon-weight").innerText = "Weight: " + data.weight + " kg";
})
.catch(error => console.log("ERROR"));
    }
}