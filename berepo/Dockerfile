# ---- Builder ----
FROM gradle:8.8-jdk17 AS builder
WORKDIR /app
COPY . .
RUN ./gradlew clean bootJar --no-daemon

# ---- Runtime ----
FROM eclipse-temurin:17-jre
WORKDIR /app
COPY --from=builder /app/build/libs/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["sh","-c","java $JAVA_OPTS -jar app.jar --spring.profiles.active=${SPRING_PROFILES_ACTIVE}"]
