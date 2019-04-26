require("dotenv").config();

var keys = require("./keys.js");

var Spotify = require('node-spotify-api');

var spotify = new Spotify(keys.spotify);

var fs = require("fs");

var moment = require("moment");

var axios = require("axios");

var action = process.argv[2];

var input = process.argv.slice(3).join(" ");

var info;

var space = (" ");

var divider = "*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/"

function command() {
    switch (action) {
        case "concert-this":
            concertThis();
            break;
        case "spotify-this":
            spotifyThisSong();
            break;
        case "movie-this":
            movieThis();
            break;
        case "do-this":
            doThis();
            break;
        default:
            console.log("I dont't understand")
            break;
    }
}

command();

function concertThis() {

    var url = "https://rest.bandsintown.com/artists/" + input + "/events?app_id=codingbootcamp";

    axios.get(url).then(
        function (response) {

            for (var i = 0; i < response.data.length; i++) {

               var info = response.data[i].lineup + " Concert" + "\nVenue: " + response.data[i].venue.name + "\nLocation: " + response.data[i].venue.city + ", " + response.data[i].venue.region + ", " + response.data[i].venue.country + "\nDate: " + moment(response.data[i].datetime).format("MM/DD/YYYY");
                console.log("\n" + info + "\n" + space + "\n" + divider);

            }


        },

    );
}

function movieThis() {

    if (!input) {
        input = "Mr. Nobody"

        console.log(space);
        console.log(divider);
        console.log(space);
        console.log("If you haven't watched 'Mr. Nobody,' then you should!");
        console.log("It's on Netflix!");
        console.log("Go to http://www.imdb.com/title/tt0485947/ to findout more!");

    }

    var queryUrl = "http://www.omdbapi.com/?t=" + input + "&y=&plot=short&apikey=trilogy";

    axios.get(queryUrl).then(
        function (response) {

            var info = "Title " + response.data.Title + "\nRelease Year " + response.data.Year + "\nIMdB Rating: " + response.data.imdbRating + "\nCountry: " + response.data.Country + "\nLanguage: " + response.data.Language + "\nPlot: " + response.data.Plot + "\nActors: " + response.data.Actors + "\nRotten Tomatoes Rating: " + response.data.Ratings[1].Value;
            console.log("\n" + info + "\n" + space + "\n" + divider);
            writeLog(info, input);

        },
    );

}

function spotifyThisSong() {

    if (!input) {
        input = 'The Sign';
    }
    spotify
        .search({ type: 'track', query: input })
        .then(function (response) {

            for (var i = 0; i < response.tracks.items.length; i++) {

                var song = response.tracks.items[i];

                var info = "Artist: " + song.artists[0].name + "\nSong: " + song.name + "\nAlbum: " + song.album.name + "\nLink to preview the song: " + song.preview_url;
                console.log("\n" + info + "\n" + space + "\n" + divider);
            }
        })
        .catch(function (err) {
            console.log(err);
        });
}

function doThis() {

    fs.readFile("random.txt", "utf8", function (error, data) {

        if (error) {
            return console.log(error);
        }
        var dataArr = data.split(",");
        input = dataArr[1];

        if (dataArr[0] === "spotify-this-song") {
            spotifyThisSong();
        } else if (dataArr[0] === "movie-this") {
            movieThis();
        } else if (dataArr[0] === "concert-this") {
            concertThis();
        }

    });
}

function writeLog() {

    var date = Date();
    fs.appendFile("log.txt", "\n" + space + "\n" + date + "\n" + action + "\n" + input + "\n" + space + + "\n" + divider, function (err) {

        if (err) {
            return console.log(err);
        }
    });

    console.log("log.txt was updated!");

};

writeLog();