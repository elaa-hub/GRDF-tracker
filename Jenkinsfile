pipeline {
    agent any
    environment {
        MAVEN_HOME = '/usr/share/maven'
        PATH = "${env.MAVEN_HOME}/bin:${env.PATH}"
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build Backend') {
            steps {
                dir('backend') {
                    sh 'mvn clean install'
                }
            }
        }

        stage('SonarQube Analysis') {
            steps {
                withSonarQubeEnv('SonarQube') {
                    dir('backend') {
                        sh 'mvn sonar:sonar'
                    }
                }
            }
        }

        stage('Build Frontend') {
            steps {
                dir('frontend') {
                    sh 'npm install'
                    sh 'npm run build'
                }
            }
        }

        stage('Run Selenium Frontend Tests') {
            steps {
                dir('frontend') {
                    sh 'npm run test'
                }
            }
        }

        stage('Deploy') {
            steps {
                echo "✅ Déploiement fictif ici. À personnaliser."
            }
        }
    }

    post {
        success {
            echo "✅ Build succeeded!"
        }
        failure {
            echo "❌ Build failed!"
        }
    }
}
