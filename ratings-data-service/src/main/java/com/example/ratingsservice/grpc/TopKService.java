package com.example.ratingsservice.grpc;

import com.example.ratingsservice.Reply;
import com.example.ratingsservice.Request;
import com.example.ratingsservice.getTopKGrpc;
import com.example.ratingsservice.dto.TopKMovies;
import com.example.ratingsservice.service.RatingsService;
import io.grpc.stub.StreamObserver;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class TopKService extends getTopKGrpc.getTopKImplBase {

    private final RatingsService ratingsService;

    public TopKService(RatingsService ratingsService) {
        this.ratingsService = ratingsService;
    }

    @Override
    public void getTopK(Request request, StreamObserver<Reply> responseObserver) {
        try {
            List<TopKMovies> topKMovies =
                    ratingsService.getTopKMovies(request.getK());

            List<com.example.ratingsservice.TopKMovies> protoMovies = topKMovies.stream()
                    .map(movie -> com.example.ratingsservice.TopKMovies.newBuilder()
                    .setMovieId(movie.getMovieId())
                            .setRating(movie.getAverageRating())
                            .build())
                    .collect(Collectors.toList());

            Reply reply = Reply.newBuilder()
                    .addAllList(protoMovies)
                    .build();

            responseObserver.onNext(reply);
            responseObserver.onCompleted();
        } catch (NumberFormatException e) {
            responseObserver.onError(new IllegalArgumentException("Invalid movie ID format: " + e.getMessage()));
        } catch (Exception e) {
            responseObserver.onError(new RuntimeException("Failed to fetch top K movies: " + e.getMessage()));
        }
    }

}
