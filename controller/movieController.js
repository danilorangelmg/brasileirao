var base = require('../controller/baseController.js');
var constUtil = require('../const.js');

var HomeMovieModel = base.getDbModel(constUtil.HomeMovieModel());

exports.listLasted = function (callback) {
    base.getCall(constUtil.getLastMovies(), callback);
}

exports.getHomeMovies = function (req, res) {
    if (!HomeMovieModel) {
        HomeMovieModel = base.getDbModel('homeMovies');
    }
  base.find(constUtil.HomeMovieModel(), {}, function (values) {
    res.json(JSON.parse(values[0].result));
  });
};

exports.listLastedMoviesBanner = function (callback) {
    base.getCall(constUtil.getLastMovies(), function (resp) {
        var result = new Object();
        result.banners = [];
        for (var i = 0; i < resp.results.length; i++) {
            result.banners[i] = new Object(); //esse inferno tava funcionando antes teve que mudar pra colocar no new
            result.banners[i].id = 1;
            result.banners[i].banner = "https://image.tmdb.org/t/p/w1280" + resp.results[i].backdrop_path;
        }
        callback(result);
    });
}

exports.listGenres = function (callback) {
    getGenres(callback)
}

exports.listGenresMovies = function (id, callback) {
    base.getCall(constUtil.getGenresById(id), function (resp) {
        var movies = new Object();
        movies.movies = [];

        var res = resp.results;
        for(var i = 0; i < res.length; i++) {
            var item = res[i];
            movies.movies[i] = new Object();
            movies.movies[i].original_title = item.original_title;
            movies.movies[i].vote_average = item.vote_average;
            movies.movies[i].poster_path = "https://image.tmdb.org/t/p/w1280"+item.poster_path;
            movies.movies[i].title = item.title;
            movies.movies[i].release_date = item.release_date;
            movies.movies[i].id = item.id;
        }
        callback(movies);
    });
}

exports.listMovies = function (name, callback) {
    base.getCall(constUtil.getMoviesByName(name), function (resp) {
        var movies = new Object();
        movies.movies = [];

        var res = resp.results;
        for(var i = 0; i < res.length; i++) {
            var item = res[i];
            movies.movies[i] = new Object();
            movies.movies[i].original_title = item.original_title;
            movies.movies[i].vote_average = item.vote_average;
            movies.movies[i].poster_path = "https://image.tmdb.org/t/p/w1280"+item.poster_path;
            movies.movies[i].title = item.title;
            movies.movies[i].release_date = item.release_date;
            movies.movies[i].id = item.id;
        }
        callback(movies);
    });
}

function getGenres(callback) {
    base.getCall(constUtil.getGenres(), callback);
}


exports.getMovieDetail = function (id, res) {
    base.getCall(constUtil.getMovieDetail(id), function (result) {
        mountMovieDetail(result, function (movie) {
            res.json(movie);
        });
    });
}

exports.getSimilarMovies= function (id, res) {
    base.getCall(constUtil.getSimilarMovies(id), function (result) {
        mountSimilarMovies(result, res);
    });
}

exports.getDetail = function(id, callback) {
    base.getCall(constUtil.getMovieDetail(id), function (result) {
        mountMovieDetail(result, callback);
    });
};

function mountMovieDetail(result, callback) {
    var movie = new Object();
    movie.id = result.id;
    movie.name = result.title;
    movie.original_title = result.original_title;
    movie.backdrop_path = "https://image.tmdb.org/t/p/w1280"+result.backdrop_path;
    movie.poster_path = "https://image.tmdb.org/t/p/w1280"+result.poster_path;
    movie.overview = result.overview;
    movie.popularity = result.popularity;
    movie.vote_average = result.vote_average;
    movie.tagline = result.tagline;
    movie.release_date = result.release_date;

    callback(movie);

}

function mountSimilarMovies(result, res) {

    var similarMovies = new Object();
    similarMovies.movies = [];

    var movies = result.results;
    for(var i = 0; i < movies.length; i++) {
        var item = movies[i];
        similarMovies.movies[i] = new Object();
        similarMovies.movies[i].original_title = item.original_title;
        similarMovies.movies[i].vote_average = item.vote_average;
        similarMovies.movies[i].poster_path = "https://image.tmdb.org/t/p/w1280"+item.poster_path;
        similarMovies.movies[i].title = item.title;
        similarMovies.movies[i].release_date = item.release_date;
        similarMovies.movies[i].id = item.id;
    }

    res.json(similarMovies);

}


