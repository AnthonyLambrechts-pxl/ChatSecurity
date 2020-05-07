var crypt = new Crypt();
var rsa = new RSA();


rsa.generateKeyPair(function(keyPair) {
    // Callback function receives new key pair as a first argument
    publicKey = keyPair.publicKey;
    privateKey = keyPair.privateKey;
});

let aButton = document.getElementById("anthonyButton");
let sButton = document.getElementById("sachaButton");
aButton.addEventListener('click', sessionAnthony);
sButton.addEventListener('click', sessionSacha);


function sessionAnthony(){
    sessionStorage.setItem("user", "Anthony");
    let user =  {
        name: "Anthony",
        publicKey: publicKey,
        privateKey: privateKey
    };
    // addUserToJson(user);

    setTimeout(window.location = "chat.html", 200);

}

function sessionSacha(){
    let pair =
    sessionStorage.setItem("user", "Sacha");
    let user =  {
        name: "Sacha",
        publicKey: publicKey,
        privateKey: privateKey
    };
    // addUserToJson(user);
    setTimeout(window.location = "chat.html", 200);
}

function addUserToJson(user) {
    let url = 'http://localhost:3000/users';
    let jsonUser = user;
    fetch(url, {
        method: "POST",
        body: JSON.stringify(jsonUser),
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    })
        .then((response) => {
            if (response.status === 200 || response.status === 201) {
                console.log(response.json());
            } else {
                throw `error with status ${response.status}`;
            }
        })
}

let logoutLink = document.getElementById("logout-link");
logoutLink.addEventListener("click", logoutUser);

function logoutUser() {
    sessionStorage.removeItem("user");
}