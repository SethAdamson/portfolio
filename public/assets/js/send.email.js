function sendEmail (){
    const axios = require('axios');
    const name = document.getElementById('name');
    const email = document.getElementById('email');
    const message = document.getElementById('message');

    console.log(name, email, message);
}