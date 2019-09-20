/**
 * Created by danilorangel on 26/02/17.
 */

//URL MOVIES
exports.getLastMovies = function () {
    return "https://api.themoviedb.org/3/discover/movie?" +
        "api_key=d272326e467344029e68e3c4ff0b4059&language=pt-BR&" +
        "sort_by=popularity.desc&include_adult=false&page=1&primary_release_year=2017&vote_count.gte=0";
}

exports.getGenres = function () {
    return "https://api.themoviedb.org/3/genre/movie/list?api_key=d272326e467344029e68e3c4ff0b4059&language=pt-BR";
}

exports.getGenresById = function (genreId) {
    return "https://api.themoviedb.org/3/genre/" + genreId + "/movies?api_key=d272326e467344029e68e3c4ff0b4059&language=pt-BR&include_adult=false&sort_by=created_at.asc";
}

exports.getMoviesByName = function (movieName) {
    return "https://api.themoviedb.org/3/search/movie?api_key=d272326e467344029e68e3c4ff0b4059&language=pt-BR&query=" + movieName + "&page=1&include_adult=false";
}

exports.getMovieDetail = function (movieId) {
    return "https://api.themoviedb.org/3/movie/"+movieId+"?api_key=d272326e467344029e68e3c4ff0b4059&language=pt-BR"
}

exports.getSimilarMovies = function (movieId) {
    return "https://api.themoviedb.org/3/movie/"+movieId+"/similar?api_key=d272326e467344029e68e3c4ff0b4059&language=pt-BR&page=1";
}

exports.HomeMovieModel = function () {
    return "HomeMovies";
}

exports.UserModel = function () {
    return "User";
}

exports.OfferModel = function () {
    return "Offers";
}

exports.UserBuyModel = function () {
    return "UsersBuy"
}

exports.RecorrenceCountModel = function () {
    return "Recorrences";
}

exports.RentModel = function () {
    return "Rent";
}