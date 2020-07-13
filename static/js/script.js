function submit(choice) {
    let pokemon = document.getElementById("search").value;
    pokemon = pokemon.toLowerCase();
    if (!isNaN(parseInt(pokemon)) && isFinite(pokemon))
        pokemon = parseInt(pokemon);
    if(choice == 1) {
        pokemon = Math.floor(Math.random() * 806) + 1;
    }
    if(pokemon == "" && choice == 0) {

    } else {
    getData(pokemon).then(data => {
        if(data) {
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
            document.getElementById("pokemon-img").src = "static/images/" + id + ".png";
            document.getElementById("pokemon-data-div").style.display = "block";
            checkbox(id);
        }})
        }
}
function getData(pokemon) {
    return fetch("https://pokeapi.co/api/v2/pokemon/" + pokemon).then(res => {
    if(res.ok) {
        console.log("Success!");
        return res.json();
    } else {
        if(document.getElementById("pokemon-info").style.display == "none")
            document.getElementById("pokemon-info").style.display = "block";
        document.getElementById("pokeball-img").src = "https://p7.hiclipart.com/preview/858/879/587/5bbeb70d53fc2.jpg"
        document.getElementById("pokemon-name").innerText = "--- Unknown Pokemon";
        document.getElementById("pokemon-type").innerText = "Type: N/A"
        document.getElementById("pokemon-weight").innerText = "Weight: N/A";
        document.getElementById("pokemon-height").innerText = "Height: N/A";
        document.getElementById("pokemon-img").src = "https://w7.pngwing.com/pngs/190/415/png-transparent-pokemon-gold-and-silver-pokemon-heartgold-and-soulsilver-pokemon-ruby-and-sapphire-question-mark-text-trademark-logo.png";
        document.getElementById("pokemon-seen").checked = false;
        document.getElementById("pokemon-caught").checked = false;
        document.getElementById("pokemon-data-div").style.display = "none";
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
        for(i = 0; i < 20; i++) {
            if(species.flavor_text_entries[i].language.name == "en") {
                let description = species.flavor_text_entries[i].flavor_text;
                if(description.includes(""))
                    continue;
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
    username = document.getElementById("username").value;
    password = document.getElementById("password").value;
    repassword = document.getElementById("re-password").value;
    email = document.getElementById("email").value;
    error = document.getElementById("error");
    if (!verify_username(username, error)) {}
    else if(!email) {
        document.getElementById("error").innerHTML = "ERROR: Please enter an email!";
        console.log("Error! No email entered!");
        }
    else if(!verify_password(password, repassword, error)) {}
    else {
        error.innerHTML = "";
        console.log("Successful register!");
        return true;
        }
    console.log("error in submitting form!");
    return false;
}
function verify_username(username, error) {
    if(username.length < 3 || username.length > 15) {
        error.innerHTML = "ERROR: Username must be 3-15 characters long!";
        console.log("Error! username too short!");
        return false;
    }
    return true;
}
function verify_password(password, repassword, error) {
    if(password.length < 5) {
        error.innerText = "ERROR: Password must be 5+ characters long!";
        console.log("Error! password too short");
        return false;
    }
    else if(password != repassword) {
        error.innerText = "ERROR: Passwords must match!";
        console.log("Error! passwords don't match");
        return false;
    }
    return true;
}
function dataSubmit() {
    var xhr = new XMLHttpRequest();
    xhr.open("POST", '/search.html', true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    let obj = new Object();
    obj.id = parseInt(document.getElementById("pokemon-name").innerText.slice(0,3));
    obj.status = 0;
    let seen = document.getElementById("pokemon-seen");
    let caught = document.getElementById("pokemon-caught");
    if(caught.checked) {
        obj.status = 2;
        document.getElementById("pokemon-seen").checked = true;
        }
    else if(seen.checked)
        obj.status = 1;
    let jsonString = JSON.stringify(obj);
    xhr.send(jsonString);
    return 0;
}
 function checkbox(id) {
   fetch('/search.html', {headers: {"Content-type": "application/json"}}).then(response => {
        return response.json();
        }).then(pokemondata => {
               document.getElementById("pokemon-seen").checked = false;
               document.getElementById("pokemon-caught").checked = false;
               id = parseInt(id);
               if(pokemondata[id - 1] == 1) {
                    document.getElementById('pokemon-seen').checked = true;
               }
               else if(pokemondata[id - 1] == 2) {
                    document.getElementById('pokemon-seen').checked = true;
                    document.getElementById('pokemon-caught').checked = true;
         }
      });
}
function reset_password() {
    password = document.getElementById("reset-password").value;
    repassword = document.getElementById("reset-repassword").value;
    error = document.getElementById("reset-error");
    if(!verify_password(password, repassword, error)) {}
    else {
        error.innerHTML = "";
        console.log("Successful register!");
        return true;
    }
    console.log("error in submitting form!");
    return false;
}
function update() {
    username = document.getElementById("update-username").value;
    email = document.getElementById("update-email").value;
    password = document.getElementById("update-password").value;
    repassword = document.getElementById("update-repassword").value;
    error = document.getElementById("update-error");
    let username_bool = true;
    let password_bool = true;
    if(username != "") {
    console.log("Not empty!");
    username_bool = verify_username(username, error);
    }
    if(password != "" || repassword != "") {password_bool = verify_password(password, repassword, error);}
    if(username_bool && password_bool) {return true;}
    console.log("error in submitting form!");
    return false;

}