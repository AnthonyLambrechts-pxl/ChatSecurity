var me = {};
// me.avatar = "https://lh6.googleusercontent.com/-lr2nyjhhjXw/AAAAAAAAAAI/AAAAAAAARmE/MdtfUmC0M4s/photo.jpg?sz=48";
me.avatar = "../images/orange.jpg";

var you = {};
you.avatar = "../images/blue.jpg";

var crypt = new Crypt();
var rsa = new RSA();


let sender = sessionStorage.getItem("user");
let sendButton = document.getElementById("sendButton");
let refreshButton = document.getElementById("refreshButton");
sendButton.addEventListener("click", postEncryptedMessage);
refreshButton.addEventListener("click", GetAllMessages);

let anthonyPubKey = "-----BEGIN PUBLIC KEY-----\r\nMIICIjANBgkqhkiG9w0BAQEFAAOCAg8AMIICCgKCAgEAsAOpxegiKxty21XVXdr7\r\ngqOBlBiZIqhQIuFB+gbm3UTJklfs5Sskx0E1diqqB6cFM83wzSLr6U3C7gVfppJB\r\n2mJDkZjrHA1eOcAhkRah/Z0AExs47v1WnwmveodYdxIrkNhUWP+UTOSK3NQjspN4\r\nDBxTfIWfjw5BfMMU+jwAVJz9auYorTQm8Tof9QkRM50dyQtGFf0i48R38AQXNNx0\r\nIh2Hgt4xOyDNiE5t/w9hISZx3KSLgkt9elTas5nhftlIj4o77gdAOZpsutSp1D19\r\ncaSgxcSoWjxzx+ZX780TmVghDTJUCE1xQbU51BfwHogxRya6aPqKg9lM6/SkLOng\r\nCJfF4Fs8AXdDhUVqATOYvzfDRXgYRYFUbhAWpb3BHwy/VAgG43jVNiRj2A1nh2ML\r\nti0gE2iy9A3VdVJE3QXHiOj21lTUprLq6EWo2PZnAKmxj/l4NwtA/P88qFq/8KpE\r\nTym5zDlT13TvOTsBnVBlkADMuPBCVaJTbhYiGlf6Rje8UHr7clMY5VBUPxvbJWxR\r\nfGoFIm3dHB2ozRbGJlYL9xsH2srciV2UJ9P3yt5FDmNUNjXzC9i5JZIUGx8+uNYA\r\nzIVMGC0BnmrbeBytIUorUeT+qMXcr7/HmLXSKO5jDgfHZm5FFPZFZOXm7aODN3WM\r\nrk2AM84MKQwvWpTWZTAn1lcCAwEAAQ==\r\n-----END PUBLIC KEY-----\r\n";
let sachaPubKey = "-----BEGIN PUBLIC KEY-----\r\nMIICIjANBgkqhkiG9w0BAQEFAAOCAg8AMIICCgKCAgEArwAjZ+3LLwyYo5sWx0nj\r\nz73YgAJncNQJabO6PbFDq+buk8d1ns0Vo6wWpB4bJbDprARCEnFVaqNBW1B+Uy7P\r\n+ISFemiWSMO1buzVikgizu9mIiDKTMicogbH64Lv6nnEVTD4Hzdxvmr6LydJf3uB\r\nY9XpLjOc/n+aXDhyXeeP8M+bzsULLjTFvz6gnI0W5LUI/D8W5FkjVQkXMZGHmeAI\r\n2kwaEXL6RooioFkQjac30gbuTNSpbQ7hcwffovGwI3e99SWNXHZrSVmkQ7wORE5e\r\nPdUdpnR5SWkRrRojYDQcfFvqP/5m8Hsr2MfXmU3kzTnMiHG5L5/PKZsXeN4rXNwZ\r\n+HNBWHPjB4MAgj+H86m7Dm6xz4jFzuv2uwdklAAXWWJlCZxsdtHeCif87RJLMTFi\r\nMjpaRj7x4uyLKMmsmM4VmcVLXvR3IgSWdbef3DxAREx+VjdDYrhripJ+uKtqIRJ8\r\nks2wl1TkOezZogWNDXlL4mvVNoUqfBIo0Z15r9fpL499VZzzJWLfgPthh4JawmUY\r\n59dC3Ef0rs4+N54HJ3LPXjKKvBF8n9Y22/Jf2p8ESugMhpl1Llf/en63fFggO3hg\r\nxg+5wa45cbxgSkBlE36+gi4RkxZz1t/JbHU9W5chzrlYl0RDKeHeL5FabGyXbReZ\r\nCHuEtXIk4GTGOM+fJDNVHSkCAwEAAQ==\r\n-----END PUBLIC KEY-----\r\n";


var userPubKey;
var userPrivKey;

fetchKeys(sender);
GetAllMessages();


function postEncryptedMessage() {
    let url = 'http://localhost:3000/messages';
    let inputField = document.getElementById("message");
    let text = inputField.value;
    let encrypted = crypt.encrypt([anthonyPubKey, sachaPubKey], text);

    let jsonObject = {
        sender: sender,
        message: encrypted,
        dateField: formatAMPM(new Date())
    };
    fetch(url, {
        method: "POST",
        body: JSON.stringify(jsonObject),
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    })
        .then((response) => {
            if (response.status === 200 || response.status === 201) {
                console.log(response.json());
                GetAllMessages();
            } else {
                throw `error with status ${response.status}`;
            }
        })
}


function insertChat(messageSender, text, date){
    let time = 0;
    var control = "";

    if (sender !== messageSender){
        control = '<li style="width:100%">' +
            '<div class="msj macro">' +
            '<div class="avatar"><img class="img-circle" style="width:100%;" src="'+ me.avatar +'" /></div>' +
            '<div class="text text-l">' +
            '<p>'+ text +'</p>' +
            '<p><small>'+date+'</small></p>' +
            '</div>' +
            '</div>' +
            '</li>';
    }else{
        control = '<li style="width:100%;">' +
            '<div class="msj-rta macro">' +
            '<div class="text text-r">' +
            '<p>'+text+'</p>' +
            '<p><small>'+date+'</small></p>' +
            '</div>' +
            '<div class="avatar" style="padding:0px 0px 0px 10px !important"><img class="img-circle" style="width:100%;" src="'+you.avatar+'" /></div>' +
            '</li>';
    }
    setTimeout(
        function(){
            $("ul").append(control).scrollTop($("ul").prop('scrollHeight'));
        }, time);

}

function GetAllMessages() {
    resetChat();
    let url = 'http://localhost:3000/messages';
    fetch(url)
        .then((response) => {
            if (response.status === 200) {
                return response.json();
            } else {
                throw `error with status ${response.status}`;
            }
        })
        .then((messages) => {
            console.log(messages);
            InsertMessages(messages);
        })
}

function InsertMessages(messageList) {
    for (let i = 0; i < messageList.length; i++) {
        let forSender = messageList[i].sender;
        if (forSender === "Anthony") {
            let decryptedMessage = crypt.decrypt(userPrivKey, messageList[i].message);
            insertChat(forSender, decryptedMessage.message, messageList[i].dateField);
        } else {
            let decryptedMessage = crypt.decrypt(userPrivKey, messageList[i].message);
            insertChat(forSender, decryptedMessage.message, messageList[i].dateField);
        }
    }
}

function fetchKeys(userName) {
    let url = 'http://localhost:3000/users?name=' + userName;
    fetch(url)
        .then((response) => {
            if (response.status === 200 || response.status === 304) {
                return response.json();
            } else {
                throw `error with status ${response.status}`;
            }
        })
        .then((user) => {
            userPubKey = user[0].publicKey;
            userPrivKey = user[0].privateKey;
        })
}

function formatAMPM(date) {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0'+minutes : minutes;
    var strTime = hours + ':' + minutes + ' ' + ampm;
    return strTime;
}

function resetChat(){
    $("ul").empty();
}






//-- NOTE: No use time on insertChat.