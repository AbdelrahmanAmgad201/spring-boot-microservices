package com.example.movieinfoservice.resources;

import com.example.movieinfoservice.models.Movie;
import com.example.movieinfoservice.models.MovieSummary;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.client.HttpComponentsClientHttpRequestFactory;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import javax.annotation.Nullable;

@RestController
@RequestMapping("/movies")
public class MovieResource {


    private MovieService movieService;

    public MovieResource(MovieService movieService) {
        this.movieService = movieService;
    }

    @RequestMapping("/{movieId}")
    public Movie getMovieInfo(@PathVariable("movieId") String movieId) {
        // Get the movie info from TMDB
        MovieSummary movieSummary = movieService.getMovieSummary(movieId);

        return new Movie(movieId, movieSummary.getTitle(), movieSummary.getOverview());
    }


}
