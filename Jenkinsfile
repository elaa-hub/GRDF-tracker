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
