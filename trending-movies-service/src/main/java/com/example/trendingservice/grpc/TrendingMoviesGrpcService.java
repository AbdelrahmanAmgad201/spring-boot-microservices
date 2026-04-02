package com.example.trendingservice.grpc;

import com.example.ratingsservice.Reply;
import com.example.ratingsservice.Request;
import com.example.ratingsservice.TopKMovies;
import com.example.ratingsservice.getTopKGrpc;
import com.example.trendingservice.service.TrendingMoviesService;
import io.grpc.Status;
import io.grpc.StatusRuntimeException;
import io.grpc.stub.StreamObserver;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TrendingMoviesGrpcService extends getTopKGrpc.getTopKImplBase {

    private final TrendingMoviesService trendingMoviesService;

    public TrendingMoviesGrpcService(TrendingMoviesService trendingMoviesService) {
        this.trendingMoviesService = trendingMoviesService;
    }

    @Override
    public void getTopK(Request request, StreamObserver<Reply> responseObserver) {
        try {
            List<TopKMovies> topKMovies = trendingMoviesService.getTopKMovies(request.getK());
            Reply reply = Reply.newBuilder()
                    .addAllList(topKMovies)
                    .build();
            responseObserver.onNext(reply);
            responseObserver.onCompleted();
        } catch (IllegalArgumentException exception) {
            responseObserver.onError(Status.INVALID_ARGUMENT
                    .withDescription(exception.getMessage())
                    .asRuntimeException());
        } catch (StatusRuntimeException exception) {
            responseObserver.onError(exception);
        } catch (Exception exception) {
            responseObserver.onError(Status.INTERNAL
                    .withDescription("Failed to fetch top K movies")
                    .withCause(exception)
                    .asRuntimeException());
        }
    }
}