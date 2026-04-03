# ── Build stage ──────────────────────────────────────────────────
FROM maven:3.8.6-openjdk-11 AS build
WORKDIR /app
COPY pom.xml .
RUN mvn dependency:go-offline -q
COPY src ./src
RUN mvn package -DskipTests -q

# ── Runtime stage ─────────────────────────────────────────────────
FROM eclipse-temurin:11-jre-alpine
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
# Expose REST port and gRPC server port
EXPOSE 8084 9084
ENTRYPOINT ["java", "-jar", "app.jar"]
