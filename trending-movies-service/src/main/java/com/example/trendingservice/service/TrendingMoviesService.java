package com.example.trendingservice.service;

import com.example.ratingsservice.TopKMovies;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TrendingMoviesService {

    private final RatingsGrpcClient ratingsGrpcClient;

    public TrendingMoviesService(RatingsGrpcClient ratingsGrpcClient) {
        this.ratingsGrpcClient = ratingsGrpcClient;
    }

    public List<TopKMovies> getTopKMovies(int k) {
        if (k <= 0) {
            throw new IllegalArgumentException("k must be greater than 0");
        }
        return ratingsGrpcClient.getTopKMovies(k);
    }
}