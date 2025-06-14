FROM openjdk:17-jdk-slim

WORKDIR /app

COPY target/GRDFBack-0.0.1-SNAPSHOT.jar /app/GRDFBack.jar

EXPOSE 8081

ENTRYPOINT ["java", "-jar", "GRDFBack.jar"]
