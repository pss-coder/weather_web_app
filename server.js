const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const app = express();


// set the port of our application
// process.env.PORT lets the port be set by Heroku
var port = process.env.PORT || 8080;

app.use(express.static(__dirname + '/public'));//need to allow express to expose file by default
app.use(bodyParser.urlencoded({extended:true}));
//setting,
//ejs default is set in a views folder
app.set('view engine','ejs');


let apiKey = '238b95b874da988c07852822b19bf294';


app.get('/',function(req,res) {
    //res.send('Hello World');
    res.render('index',{weather: null, error: null});
});

app.post('/',function(req,res) {
    //res.send('Hello World');
    let city = req.body.city;
    console.log(city);
    //to interpolate variable in string, must use the (`) symbol and not the normal (')
    let url=`http://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;

    //send request to url and get response
    request(url,function(err,response,body){

        if (err) { //error
            res.render('index',{weather:null,error:'Error, please try again.'});
            //weather and error are object which we can handle in our views
        }
        else{
            let weather = JSON.parse(body);//convert to JSON
            
            if(weather.main == undefined){ // if not a  country
                res.render('index',{weather:null,error:'Error, please try again.'});
            }else
            {
                let message = `It's ${weather.main.temp} Degress Celsius in ${city}`;
                console.log('message');
                res.render('index',{weather:message,error:null});
            }

            
        }
        
    });

});

//listen to server on port 3000
app.listen(port,function() {
    console.log('Example app listening on port 3000!');
})


//npm install ejs --save
// ejs -> template engine for html, similar to jsp

//npm install body-parser --save
// : able to make use of middleware to get request objects from get,post


//to deploy to heroku
//1. heroku create
//2.enter creditinals (if asked)
//3.git push heroku master