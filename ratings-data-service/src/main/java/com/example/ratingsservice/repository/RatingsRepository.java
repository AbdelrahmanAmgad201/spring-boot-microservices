package com.example.ratingsservice.repository;

import com.example.ratingsservice.dto.TopKMovies;
import com.example.ratingsservice.entity.RatingsEntity;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;

public interface RatingsRepository extends JpaRepository<RatingsEntity, Long> {
    List<RatingsEntity> findByUserId(int userId);

    Optional<RatingsEntity> findByUserIdAndMovieId(int userId, String movieId);

    @Query("SELECT new com.example.ratingsservice.dto.TopKMovies(r.movieId, AVG(r.rating)) " +
            "FROM RatingsEntity r " +
            "GROUP BY r.movieId " +
            "ORDER BY AVG(r.rating) DESC")
    List<TopKMovies> findTopKMovies(Pageable pageable);

}