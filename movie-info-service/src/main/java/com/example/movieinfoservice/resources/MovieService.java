package com.example.movieinfoservice.resources;

import com.example.movieinfoservice.models.MovieSummary;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import javax.annotation.Nullable;

@Service
public class MovieService {

    @Value("${api.key}")
    private String apiKey;

    @Value("${cache.enabled}")
    private boolean cacheEnabled;

    private final RestTemplate restTemplate;
    private final MovieCacheRepository movieCacheRepository;

    public MovieService(RestTemplate restTemplate, MovieCacheRepository movieCacheRepository) {
        this.restTemplate = restTemplate;
        this.movieCacheRepository = movieCacheRepository;
    }

    @Nullable
    public MovieSummary getMovieSummary(String movieId) {

        if (cacheEnabled) {
            MovieCacheEntity cached = movieCacheRepository.findById(movieId).orElse(null);
            if (cached != null) {
                MovieSummary summary = new MovieSummary();
                summary.setId(cached.getMovieId());
                summary.setTitle(cached.getTitle());
                summary.setOverview(cached.getOverview());
                return summary;
            }
        }

        final String url = "https://api.themoviedb.org/3/movie/" + movieId + "?api_key=" + apiKey;
        MovieSummary movieSummary = restTemplate.getForObject(url, MovieSummary.class);

        if (cacheEnabled && movieSummary != null) {
            movieCacheRepository.save(
                    new MovieCacheEntity(movieId, movieSummary.getTitle(), movieSummary.getOverview())
            );
        }

        return movieSummary;
    }
}
