package com.example.ratingsservice.models;

import javax.persistence.*;

@Entity
@Table(
        name = "ratings",
        uniqueConstraints = {
                @UniqueConstraint(columnNames = {"user_id", "movie_id"})
        }
)
public class RatingsEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private int userId;

    @Column(name = "movie_id", nullable = false)
    private String movieId;

    @Column(name = "movie_name")
    private String movieName;

    @Column(name = "rating", nullable = false)
    private int rating;


    public RatingsEntity(int userId, Long id, String movieId, String movieName, int rating) {
        this.userId = userId;
        this.id = id;
        this.movieId = movieId;
        this.movieName = movieName;
        this.rating = rating;
    }

    public RatingsEntity(){

    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public int getUserId() {
        return userId;
    }

    public void setUserId(int userId) {
        this.userId = userId;
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
