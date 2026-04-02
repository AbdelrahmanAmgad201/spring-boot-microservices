package com.example.trendingservice.config;

import io.grpc.ManagedChannel;
import io.grpc.ManagedChannelBuilder;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RatingsGrpcClientConfig {

    @Value("${ratings.grpc.host:localhost}")
    private String ratingsGrpcHost;

    @Value("${ratings.grpc.port:9083}")
    private int ratingsGrpcPort;

    @Bean(destroyMethod = "shutdownNow")
    public ManagedChannel ratingsGrpcChannel() {
        return ManagedChannelBuilder.forAddress(ratingsGrpcHost, ratingsGrpcPort)
                .usePlaintext()
                .build();
    }
}