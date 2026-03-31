package com.example.ratingsservice.models;

import com.fasterxml.jackson.annotation.JsonProperty;

public class Rating {

    private String movieId;

    @JsonProperty("movie_name")
    private String movieName;

    private int rating;

    public Rating() {
    }

    public Rating(String movieId, int rating) {
        this.movieId = movieId;
        this.rating = rating;
    }

    public Rating(String movieId, String movieName, int rating) {
        this.movieId = movieId;
        this.movieName = movieName;
        this.rating = rating;
    }

    public String getMovieId() {
        return movieId;
    }

    public void setMovieId(String movieId) {
        this.movieId = movieId;
    }

    public String getMovieName() {
        return movieName;
    }

    public void setMovieName(String movieName) {
        this.movieName = movieName;
    }

    public int getRating() {
        return rating;
    }

    public void setRating(int rating) {
        this.rating = rating;
    }
}
