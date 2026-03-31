package com.example.trendingservice;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest(properties = "eureka.client.enabled=false")
class TrendingMoviesServiceApplicationTests {

    @Test
    void contextLoads() {
    }
}
