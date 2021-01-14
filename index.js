const express = require("express");
const fs = require('fs');
const fetch = require("node-fetch");
const app = express();
const proxyurl = "https://corsanimaco-dev.herokuapp.com/";
const url = "https://www.kickstarter.com/projects/search.json?search=&term=games";
const db = './db.json';
let horas;
if (process.argv[2]) {
	horas = process.argv[2];
}else{
	horas = 5;
}
let numreq = 0;

function guardarDatos(json){
	fs.writeFile(db, JSON.stringify(json), function(err) {
    if (err) {
        console.log(err);
    }
});
	console.log('[DB] Datos actualizados, próxima actualización en '+horas+' horas');
}

function handleErrors(response) {
    if (!response.ok) throw new Error(response.status);
    return response;
}

function getData() {
	fetch(proxyurl + url, {headers: {
      'origin' : '*'
    }})
    .then(handleErrors)
    .then(response => response.text())
	.then(contents => guardarDatos(JSON.parse(contents)))
    .catch(error => console.log(error) );
}
getData();

setInterval(function(){ 
getData();
}, (horas*60*60*1000));

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');
    next();
});

app.get('/projects', function(req, res) {
 res.send(JSON.parse(fs.readFileSync(db)));
 console.log('[API] Peticion #'+numreq+' respondida :)');
 numreq++;
});

app.listen(3000, () => {
 console.log('[API] Esperando peticiones...');
});
