package com.example.movieinfoservice.resources;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "movie_cache")
public class MovieCacheEntity {

    @Id
    private String movieId;
    private String title;
    private String overview;

    public MovieCacheEntity() {}

    public MovieCacheEntity(String movieId, String title, String overview) {
        this.movieId = movieId;
        this.title = title;
        this.overview = overview;
    }

    public String getMovieId() { return movieId; }
    public String getTitle() { return title; }
    public String getOverview() { return overview; }
}