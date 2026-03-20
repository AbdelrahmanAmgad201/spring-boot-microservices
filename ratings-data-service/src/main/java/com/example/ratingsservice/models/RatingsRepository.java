package com.example.ratingsservice.models;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface RatingsRepository extends JpaRepository<RatingsEntity, Long> {
    List<RatingsEntity> findByUserId(int userId);
    Optional<RatingsEntity> findByUserIdAndMovieId(int userId, String movieId);
}