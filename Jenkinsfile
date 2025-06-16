pipeline {
    agent any

    environment {
        BACKEND_DIR = 'backend'
        FRONTEND_DIR = 'frontend'
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
            when {
                changeset "**/${BACKEND_DIR}/**"
            }
            steps {
                dir("${BACKEND_DIR}") {
                    sh './mvnw clean package -DskipTests'
                }
            }
        }

        stage('SonarQube Analysis') {
            when {
                changeset "**/${BACKEND_DIR}/**"
            }
            steps {
                dir("${BACKEND_DIR}") {
                    withSonarQubeEnv('sonar') {
                        sh './mvnw sonar:sonar'
                    }
                }
            }
        }

        stage('Build Frontend') {
            when {
                changeset "**/${FRONTEND_DIR}/**"
            }
            steps {
                dir("${FRONTEND_DIR}") {
                    sh 'npm install'
                    sh 'npm run build'
                }
            }
        }

        stage('Run Selenium Frontend Tests') {
            when {
                changeset "**/${FRONTEND_DIR}/**"
            }
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
