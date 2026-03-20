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

    private RestTemplate restTemplate;

    public MovieService(RestTemplate restTemplate){
        this.restTemplate = restTemplate;
    }

    @Nullable
    public MovieSummary getMovieSummary(String movieId) {
        final String url = "https://api.themoviedb.org/3/movie/" + movieId + "?api_key=" + apiKey;
        MovieSummary movieSummary = restTemplate.getForObject(url, MovieSummary.class);
        return movieSummary;
    }
}
