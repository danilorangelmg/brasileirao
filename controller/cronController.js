/**
 * Created by danilorangel on 27/04/17.
 */

var cron = require('node-cron');
var constUtil = require('../const.js');
var base = require('../controller/baseController.js');

var HomeMovieModel = base.getDbModel(constUtil.HomeMovieModel());

function getHomeMovies() {
    var result = new Object();
    result.categories = [];
    getGenres(function (genresResult) {
        var max_genres = genresResult.genres.length;
        iterateGenres(genresResult.genres, max_genres, 0, result);
    });
}

function iterateGenres(genres, maxIndex, actualIndex, result) {
    if (maxIndex == actualIndex) {

        base.find(constUtil.HomeMovieModel(), {}, function (valuesResult) {
            if (valuesResult && valuesResult.length > 0) {
                var values = valuesResult[0];
                values.result = JSON.stringify(result);
                values.date = new Date();
                var model = new HomeMovieModel(values);
                save(model);
            } else {
                var values = new Object();
                values.result = JSON.stringify(result);
                values.date = new Date();
                var model = new HomeMovieModel(values);
                save(model);
            }
        });
        return;
    }

    mountGenresForHome(genres, maxIndex, actualIndex, result);
}

function mountGenresForHome(genreList, maxIndex, actualIndex, result) {
    var item = genreList[actualIndex];
    result.categories[actualIndex] = new Object();
    result.categories[actualIndex].id = item.id;
    result.categories[actualIndex].name = item.name;

    getMoviesList(genreList, item.id, maxIndex, actualIndex, result);
}

function getMoviesList(genreList, genreId, maxGenreIndex, actualGenreIndex, result) {
    base.getCall(constUtil.getGenresById(genreId), function (resp) {
        result.categories[actualGenreIndex].movies = [];
        for(var i = 0; i < resp.results.length; i++) {
            var item = resp.results[i];
            result.categories[actualGenreIndex].movies[i] = new Object();
            result.categories[actualGenreIndex].movies[i].original_title = item.original_title;
            result.categories[actualGenreIndex].movies[i].vote_average = item.vote_average;
            result.categories[actualGenreIndex].movies[i].poster_path = "https://image.tmdb.org/t/p/w1280"+item.poster_path;
            result.categories[actualGenreIndex].movies[i].title = item.title;
            result.categories[actualGenreIndex].movies[i].release_date = item.release_date;
            result.categories[actualGenreIndex].movies[i].id = item.id;
        }
        actualGenreIndex++;
        iterateGenres(genreList, maxGenreIndex, actualGenreIndex, result);
    });
}

function getGenres(callback) {
    base.getCall(constUtil.getGenres(), callback);
}

function save(model) {
    model.save(function (err, dbObj) {
        if (err) {
            console.log(err);
        } else {
            console.log('saved successfully: '+new Date());
        }
    });
}

exports.createCrons = function() {
    cron.schedule("0 0 * * * *", function () {
        HomeMovieModel = base.getDbModel(constUtil.HomeMovieModel());
        console.log("Run Schedule "+new Date());
        getHomeMovies();
    });
};


