pipeline {
    agent any

    environment {
        BACKEND_DIR = 'backend'
        FRONTEND_DIR = 'frontend'
        DOCKER_IMAGE = 'grdf-back'
        DOCKER_TAG = "${BUILD_NUMBER}"
    }

    triggers {
        githubPush()
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build Backend') {
            steps {
                dir("${BACKEND_DIR}") {
                    sh './mvnw clean install'
                }
            }
        }

        stage('SonarQube Analysis') {
            steps {
                script {
                    withSonarQubeEnv('sonarqube') {
                        sh 'mvn sonar:sonar'
                    }
                }
            }
        }

        stage('Build Frontend') {
            steps {
                dir("${FRONTEND_DIR}") {
                    sh 'npm install'
                    sh 'npm run build'
                }
            }
        }

        stage('Run Selenium Frontend Tests') {
            steps {
                dir("${FRONTEND_DIR}") {
                    sh '''
                        npm install
                        npm run build-themes || true
                        npm start &
                        sleep 20
                        node selenium-tests/front-test.js
                    '''
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
