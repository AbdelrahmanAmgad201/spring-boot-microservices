package com.example.trendingservice.service;

import com.example.ratingsservice.Reply;
import com.example.ratingsservice.Request;
import com.example.ratingsservice.TopKMovies;
import com.example.ratingsservice.getTopKGrpc;
import io.grpc.ManagedChannel;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.concurrent.TimeUnit;

@Service
public class RatingsGrpcClient {

    private final getTopKGrpc.getTopKBlockingStub ratingsStub;

    public RatingsGrpcClient(@Qualifier("ratingsGrpcChannel") ManagedChannel ratingsGrpcChannel) {
        this.ratingsStub = getTopKGrpc.newBlockingStub(ratingsGrpcChannel);
    }

    public List<TopKMovies> getTopKMovies(int k) {
        Reply reply = ratingsStub
                .withDeadlineAfter(3, TimeUnit.SECONDS)
                .getTopK(Request.newBuilder().setK(k).build());
        return reply.getListList();
    }
}