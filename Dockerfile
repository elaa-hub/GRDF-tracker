FROM openjdk:17-jdk-slim

WORKDIR /app

# Copier le fichier JAR de votre application dans le conteneur
COPY target/GRDFBack-0.0.1-SNAPSHOT.jar /app/GRDFBack.jar

# Exposer le port sur lequel l'applicati    on écoute
EXPOSE 8082

# Commande pour exécuter l'application
ENTRYPOINT ["java", "-jar", "GRDFBack.jar"]
