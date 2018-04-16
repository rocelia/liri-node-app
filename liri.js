require("dotenv").config();
var moment = require('moment');

// Load the fs package to read and write
var fs = require("fs");

// Include the request npm package (Don't forget to run "npm install request" in this folder first!)
var request = require("request");
var keys = require('./keys.js');
var liriCommand = process.argv[2];
var specify = process.argv[3];
const Twitter = require('twitter');
const Spotify = require('node-spotify-api');


function getThings() {
  switch (liriCommand) {
    case 'my-tweets':
      getTweet();
      break;
    case 'spotify-this-song' :
    getSong();
    break;
    case 'movie-this':
    getFlick();
    break;
    case 'do-what-it-says' :
    doIt();
    break;
  }
};

function getTweet() {
  var client = new Twitter(keys.twitter);
  var params = { q: '@ginnyandbeef', count: 20 };
  client.get('statuses/user_timeline', params, function (error, tweets, response) {
    console.log(error);
    if (!error) {
      console.log(tweets);
      for (let i = 0; i < tweets.length; i++) {
        var unix = moment(new Date(tweets[i].created_at));
        var unixPretty = moment(unix).format('MM/DD/YYYY @ hh:mma');
        var tweeter = `Tweet: ${(parseInt([i]) + 1)} of ${tweets.length}
        \nTweeted on ${unixPretty} \nText: ${tweets[i].text} \n-------------------------`
        console.log(tweeter);

      }
    }
  });
};

function getSong() {
  var spotify = new Spotify(keys.spotify);
  if (specify != null){
   spotify.search({type:'track', query: specify, limit: 10}, function(error, data){
     if(error) {
       return console.log('Error occured: ' + error);
       
     } else { 
       for (let i = 0; i < data.tracks.items.length; i++){
        var musicText = `Artist: ${data.tracks.items[i].artists[i].name} \nSong Name: ${data.tracks.items[i].name} \nPreview Link: ${data.tracks.items[i].preview_url} \nAlbum: ${data.tracks.items[i].album.name} \n------------------\n`;       
      console.log(musicText)}
     }
   }
   )}
else {
  spotify.search({ type: 'track', query: 'Ace of Base Sign', limit: 1 }).then(function (data) {
    var musicText = `Artist: ${data.tracks.items[0].artists[0].name} \nSong Name: ${data.tracks.items[0].name} \nPreview Link: ${data.tracks.items[0].preview_url} \nAlbum: ${data.tracks.items[0].album.name} \n------------------\n`;
    console.log(musicText);
  })
}

}

function getFlick() {
  if (specify != null) {
    request(`http://www.omdbapi.com/?t=${specify}&y=&plot=short&apikey=trilogy`, function(error, response, body) {
      if (!error && response.statusCode === 200) {
        var movie = JSON.parse(body);
        console.log(movie);
        var movieText = `Title: ${movie.Title} \nRelease Year: ${movie.Year} \nIMDB Rating: ${movie.imdbRating} \nRotten Tomatoes Rating: ${movie.Ratings[1].Value} \nProduced In: ${movie.Country} \nLanguage: ${movie.Language} \nPlot: ${movie.Plot} \nActors: ${movie.Actors} \n------------------\n`;
        console.log(movieText);
      }
    })
  }
  else{
    request("http://www.omdbapi.com/?t=Mr.%20Nobody&y=&plot=short&apikey=trilogy", function (error, response, body) {
      if (!error && response.statusCode === 200) {
        var movie = JSON.parse(body);
        var movieText = "\nTitle: " + movie.Title +
          "\nRelease Year: " + movie.Year + "\nIMDB Rating: " + movie.imdbRating +
          "\nRotten Tomatoes Rating: " + movie.Ratings[1].Value +
          "\nProduced In: " + movie.Country +
          "\nLanguage: " + movie.Language +
          "\nPlot: " + movie.Plot +
          "\nActors: " + movie.Actors +
          "\n------------------\n";
        console.log(movieText)
      }
    })
  }
}

function doIt() {
  fs.readFile('random.txt', 'utf8', function(error, data){
    if (error){
      return console.log(error);

    }
    var dataArr = data.split(',')
    liriCommand = dataArr[0];
    specify = dataArr[1];
    getSong();
  })
}

getThings();