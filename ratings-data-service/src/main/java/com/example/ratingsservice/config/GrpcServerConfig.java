package com.example.ratingsservice.config;

import com.example.ratingsservice.grpc.TopKService;
import io.grpc.Server;
import io.grpc.ServerBuilder;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.io.IOException;

@Configuration
public class GrpcServerConfig {

    private static final Logger logger = LoggerFactory.getLogger(GrpcServerConfig.class);

    @Value("${grpc.server.port:9083}")
    private int grpcPort;

    @Bean
    public Server grpcServer(TopKService topKService) throws IOException {
        Server server = ServerBuilder.forPort(grpcPort)
                .addService(topKService)
                .build();
        
        new Thread(() -> {
            try {
                server.start();
                logger.info("gRPC server started on port {}", grpcPort);
                server.awaitTermination();
            } catch (IOException e) {
                logger.error("Failed to start gRPC server", e);
            } catch (InterruptedException e) {
                logger.error("gRPC server interrupted", e);
                Thread.currentThread().interrupt();
            }
        }).start();
        
        return server;
    }
}
