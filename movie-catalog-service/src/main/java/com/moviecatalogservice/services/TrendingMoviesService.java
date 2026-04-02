package com.moviecatalogservice.services;

import com.example.ratingsservice.Reply;
import com.example.ratingsservice.Request;
import com.example.ratingsservice.getTopKGrpc;
import com.moviecatalogservice.models.Rating;
import io.grpc.ManagedChannel;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

@Service
public class TrendingMoviesService {

    private final getTopKGrpc.getTopKBlockingStub trendingMoviesStub;

    public TrendingMoviesService(@Qualifier("trendingGrpcChannel") ManagedChannel trendingGrpcChannel) {
        this.trendingMoviesStub = getTopKGrpc.newBlockingStub(trendingGrpcChannel);
    }

    public List<Rating> getTopKMovies(int k) {
        Reply reply = trendingMoviesStub
                .withDeadlineAfter(5, TimeUnit.SECONDS)
                .getTopK(Request.newBuilder().setK(k).build());

        return reply.getListList().stream()
                .map(movie -> new Rating(movie.getMovieId(), (int) movie.getRating()))
                .collect(Collectors.toList());
    }
}