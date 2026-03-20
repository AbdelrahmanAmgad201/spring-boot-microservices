package com.example.movieinfoservice.resources;

import org.springframework.data.mongodb.repository.MongoRepository;

public interface MovieCacheRepository extends MongoRepository<MovieCacheEntity, String> {}