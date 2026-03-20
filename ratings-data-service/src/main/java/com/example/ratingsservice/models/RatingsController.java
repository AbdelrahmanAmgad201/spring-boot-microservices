package com.example.ratingsservice.models;

import com.example.ratingsservice.models.Rating;
import com.example.ratingsservice.models.RatingsService;
import com.example.ratingsservice.models.UserRating;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/ratings")
public class RatingsController {

    private final RatingsService ratingsService;

    public RatingsController(RatingsService ratingsService) {
        this.ratingsService = ratingsService;
    }

    // GET /ratingsdata/{userId}  → all ratings for a user
    @GetMapping("/{userId}")
    public UserRating getUserRatings(@PathVariable int userId) {
        return ratingsService.getUserRatings(userId);
    }

    // GET /ratingsdata/{userId}/{movieId}  → one specific rating
    @GetMapping("/{userId}/{movieId}")
    public ResponseEntity<Rating> getRating(
            @PathVariable int userId,
            @PathVariable String movieId) {
        return ratingsService.getRating(userId, movieId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // POST /ratingsdata/{userId}  → add/update a rating
    // Body: { "movieId": "tt123", "rating": 4 }
    @PostMapping("/{userId}")
    public Rating saveRating(
            @PathVariable int userId,
            @RequestBody Rating rating) {
        return ratingsService.saveRating(userId, rating.getMovieId(), rating.getRating());
    }

    // DELETE /ratingsdata/{userId}/{movieId}  → remove a rating
    @DeleteMapping("/{userId}/{movieId}")
    public ResponseEntity<Void> deleteRating(
            @PathVariable int userId,
            @PathVariable String movieId) {
        ratingsService.deleteRating(userId, movieId);
        return ResponseEntity.noContent().build();
    }
}