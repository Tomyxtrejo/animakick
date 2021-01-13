const express = require("express");
const fs = require('fs');
const fetch = require("node-fetch");
const app = express();
const proxyurl = "https://corsanimaco-dev.herokuapp.com/";
const url = "https://www.kickstarter.com/projects/search.json?search=&term=games";

function guardarDatos(json){
	fs.writeFile("db.json", JSON.stringify(json), function(err) {
    if (err) {
        console.log(err);
    }
});
	console.log('Projectos actualizados');
}

function handleErrors(response) {
    if (!response.ok) throw new Error(response.status);
    return response;
}

setInterval(function(){ 
    fetch(proxyurl + url, {headers: {
      'origin' : '*'
    }})
    .then(handleErrors)
    .then(response => response.text())
	.then(contents => guardarDatos(JSON.parse(contents)))
    .catch(error => console.log(error) );
}, 36000000);

app.get('/projects', function(req, res) {
 res.send(JSON.parse(fs.readFileSync('db.json')));
 console.log('Peticion respondida');
});

app.listen(3000, () => {
 console.log("*Esperando peticiones*");
});