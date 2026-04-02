package com.example.trendingservice.config;

import com.example.trendingservice.grpc.TrendingMoviesGrpcService;
import io.grpc.Server;
import io.grpc.ServerBuilder;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

import javax.annotation.PostConstruct;
import javax.annotation.PreDestroy;
import java.io.IOException;

@Configuration
public class GrpcServerConfig {

    private static final Logger logger = LoggerFactory.getLogger(GrpcServerConfig.class);

    @Value("${grpc.server.port:9084}")
    private int grpcPort;

    private final TrendingMoviesGrpcService trendingMoviesGrpcService;
    private Server server;

    public GrpcServerConfig(TrendingMoviesGrpcService trendingMoviesGrpcService) {
        this.trendingMoviesGrpcService = trendingMoviesGrpcService;
    }

    @PostConstruct
    public void startGrpcServer() {
        try {
            server = ServerBuilder.forPort(grpcPort)
                    .addService(trendingMoviesGrpcService)
                    .build()
                    .start();
            logger.info("Trending Movies gRPC server started on port {}", grpcPort);

            Thread daemonThread = new Thread(() -> {
                try {
                    server.awaitTermination();
                } catch (InterruptedException e) {
                    Thread.currentThread().interrupt();
                }
            });
            daemonThread.setDaemon(true);
            daemonThread.start();
        } catch (IOException e) {
            logger.error("Failed to start Trending Movies gRPC server on port {}", grpcPort, e);
            throw new RuntimeException("Failed to start gRPC server", e);
        }
    }

    @PreDestroy
    public void stopGrpcServer() {
        if (server != null) {
            logger.info("Shutting down Trending Movies gRPC server on port {}", grpcPort);
            server.shutdown();
        }
    }
}