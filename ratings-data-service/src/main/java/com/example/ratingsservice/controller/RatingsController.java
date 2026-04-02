package com.example.ratingsservice.controller;

import com.example.ratingsservice.dto.Rating;
import com.example.ratingsservice.dto.UserRating;
import com.example.ratingsservice.service.RatingsService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/ratings")
public class RatingsController {

    private final RatingsService ratingsService;

    public RatingsController(RatingsService ratingsService) {
        this.ratingsService = ratingsService;
    }

    @GetMapping("/{userId}")
    public UserRating getUserRatings(@PathVariable int userId) {
        return ratingsService.getUserRatings(userId);
    }

    @GetMapping("/{userId}/{movieId}")
    public ResponseEntity<Rating> getRating(
            @PathVariable int userId,
            @PathVariable String movieId) {
        return ratingsService.getRating(userId, movieId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/{userId}")
    public Rating saveRating(
            @PathVariable int userId,
            @RequestBody Rating rating) {
        return ratingsService.saveRating(userId, rating.getMovieId(), rating.getRating());
    }

    @DeleteMapping("/{userId}/{movieId}")
    public ResponseEntity<Void> deleteRating(
            @PathVariable int userId,
            @PathVariable String movieId) {
        ratingsService.deleteRating(userId, movieId);
        return ResponseEntity.noContent().build();
    }
}