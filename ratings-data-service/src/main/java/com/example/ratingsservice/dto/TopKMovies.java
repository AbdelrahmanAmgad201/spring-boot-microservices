package com.example.ratingsservice.dto;

public class TopKMovies {
    private String movieId;
    private double averageRating;

    public TopKMovies(String movieId, double averageRating) {
        this.movieId = movieId;
        this.averageRating = averageRating;
    }

    public TopKMovies() {}

    public String getMovieId() {
        return movieId;
    }

    public void setMovieId(String movieId) {
        this.movieId = movieId;
    }

    public double getAverageRating() {
        return averageRating;
    }

    public void setAverageRating(double averageRating) {
        this.averageRating = averageRating;
    }
}
