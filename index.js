const authUrl = "/v1/authorization";
const resUrl = "http://localhost:8080"
const carsUrl = "/v1/cars"
const signOut = "/SignOut"
const express = require('express')
const app = express()
const axios = require('axios');
const urlencodedParser = express.urlencoded({extended: false});
const cookieParser = require("cookie-parser");

app.use(cookieParser());
app.listen(8090)
app.use("/css", express.static('css'))
app.use("/image", express.static('image'))

app.get('/', function(req, res){
    res.sendFile(__dirname + '/views/index.html')
});
app.post(authUrl, urlencodedParser, function (req, res) {
    const data = {
        login: req.body.login,
        password: req.body.password
    }

    axios.post(resUrl + authUrl, data, {
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(function (response) {
        res.cookie("access_token", response.data.access_token).redirect("/v1/cars")
    }).catch(function () {
        res.status(401).sendFile(__dirname + '/views/401.html')
    });
});

app.get(carsUrl, (req, res) => {
    axios.get(resUrl + carsUrl, {
        headers: {
            "Authorization": req.cookies.access_token,
            'Content-Type': 'application/json'
        }
    }).then(function (response) {
        res.send(response.data)
    }).catch(function () {
        res.status(403).sendFile(__dirname + '/views/403.html');
    });
});

app.get(signOut,  (req, res) => {
    axios.get(resUrl + signOut, {
        headers: {
            "Authorization": req.cookies.access_token,
            'Content-Type': 'application/json'
        }
    }).then(function (response) {
        res.clearCookie("access_token")
            .redirect('/')
    }).catch(function () {
        res.redirect("/v1/cars")
    });    
});

app.get('*', function(req, res){
    res.status(404).sendFile(__dirname + '/views/404.html')
});

