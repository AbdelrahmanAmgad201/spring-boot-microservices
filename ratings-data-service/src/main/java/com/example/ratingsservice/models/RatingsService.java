package com.example.ratingsservice.models;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class RatingsService {

    private final RatingsRepository ratingsRepository;

    public RatingsService(RatingsRepository ratingsRepository) {
        this.ratingsRepository = ratingsRepository;
    }

    // Get all ratings for a user
    public UserRating getUserRatings(int userId) {
        List<RatingsEntity> entities = ratingsRepository.findByUserId(userId);
        List<Rating> ratings = entities.stream()
                .map(e -> new Rating(e.getMovieId(), e.getMovieName(), e.getRating()))
                .collect(Collectors.toList());
        return new UserRating(ratings);
    }

    // Get a single rating for a user+movie
    public Optional<Rating> getRating(int userId, String movieId) {
        return ratingsRepository.findByUserIdAndMovieId(userId, movieId)
                .map(e -> new Rating(e.getMovieId(), e.getMovieName(), e.getRating()));
    }

    // Add or update a rating
    public Rating saveRating(int userId, String movieId, String movieName, int ratingValue) {
        RatingsEntity entity = ratingsRepository
                .findByUserIdAndMovieId(userId, movieId)
                .orElse(new RatingsEntity());

        entity.setUserId(userId);
        entity.setMovieId(movieId);
        entity.setMovieName(movieName);
        entity.setRating(ratingValue);

        RatingsEntity saved = ratingsRepository.save(entity);
        return new Rating(saved.getMovieId(), saved.getMovieName(), saved.getRating());
    }

    // Delete a rating
    public void deleteRating(int userId, String movieId) {
        ratingsRepository.findByUserIdAndMovieId(userId, movieId)
                .ifPresent(ratingsRepository::delete);
    }
}