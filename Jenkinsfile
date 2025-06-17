pipeline {
    agent any

    triggers {
        githubPush()
    }

    stages {
        stage('Build Backend') {
            steps {
                sh './mvnw clean package -DskipTests || mvn clean package -DskipTests'
            }
        }

     
        
        stage('SonarQube Analysis') {
            steps {
                withSonarQubeEnv('sonarqube') {
                    sh 'mvn sonar:sonar'
                }
            }
        }

        stage('Deploy') {
            steps {
                echo 'Déploiement fictif backend...'
            }
        }
    }

    post {
        success {
            echo '✅ Build Backend Success!'
        }
        failure {
            echo '❌ Build Backend Failed!'
        }
    }
}
