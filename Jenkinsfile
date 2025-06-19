pipeline {
    agent any

    environment {
    BACKEND_DIR = '.'   
    FRONTEND_DIR = 'GRDF'
        NODE_HOME = '/usr/local/bin'
        PATH = "${env.NODE_HOME}:${env.PATH}"
    }

    tools {
        maven 'mvn'               
        nodejs 'NodeJS 20'       
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

        stage('🔧 Build Backend') {
            steps {
                dir("${BACKEND_DIR}") {
                    sh './mvnw clean install -DskipTests || mvn clean install -DskipTests'
                }
            }
        }

        stage('🌐 Build Frontend') {
            steps {
                dir("${FRONTEND_DIR}") {
                    sh 'npm install'
                    sh 'npm run build'
                }
            }
        }

        stage('🧪 Test Selenium') {
            steps {
                dir("${FRONTEND_DIR}") {
                    sh 'npm install'
                    sh 'npm run test:login'
                }
            }
        }

        stage('📤 Envoi Rapport par Mail') {
            steps {
                dir("${FRONTEND_DIR}") {
                    sh 'node selenium-tests/send-report.js'
                }
            }
        }

        stage('📁 Archive Rapport HTML') {
            steps {
                dir("${FRONTEND_DIR}") {
                    archiveArtifacts artifacts: 'mochawesome-report/*.html', fingerprint: true
                }
            }
        }
    }

    post {
        success {
            echo "✅ Pipeline exécutée avec succès !"
        }
        failure {
            echo "❌ Échec de la pipeline"
        }
    }
}
