package com.moviecatalogservice.config;

import io.grpc.ManagedChannel;
import io.grpc.ManagedChannelBuilder;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class TrendingGrpcClientConfig {

    @Value("${trending.grpc.host:localhost}")
    private String trendingGrpcHost;

    @Value("${trending.grpc.port:9084}")
    private int trendingGrpcPort;

    @Bean(destroyMethod = "shutdownNow")
    public ManagedChannel trendingGrpcChannel() {
        return ManagedChannelBuilder.forAddress(trendingGrpcHost, trendingGrpcPort)
                .usePlaintext()
                .build();
    }
}