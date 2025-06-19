pipeline {
    agent any

    tools {
        maven 'mvn'
        nodejs 'NodeJS 20'
    }

    environment {
        BACKEND_BRANCH = 'backend'
        FRONTEND_BRANCH = 'frontend'
        FRONTEND_DIR = 'frontend'
    }
    stages {
        stage('📦 Checkout Backend') {
            steps {
                dir('backend') {
                    checkout([$class: 'GitSCM',
                        branches: [[name: "*/${env.BACKEND_BRANCH}"]],
                        userRemoteConfigs: [[url: 'https://github.com/elaa-hub/GRDF-tracker.git']]
                    ])
                }
            }
        }
        stage('🌐 Checkout Frontend') {
            steps {
                dir("${env.FRONTEND_DIR}") {
                    checkout([$class: 'GitSCM',
                        branches: [[name: "*/${env.FRONTEND_BRANCH}"]],
                        userRemoteConfigs: [[url: 'https://github.com/elaa-hub/GRDF-tracker.git']]
                    ])
                }
            }
        }

        stage('🔧 Build Backend') {
            steps {
                dir('backend') {
                    sh 'mvn clean install -DskipTests'
                }
            }
        }

        stage('🌐 Build Frontend') {
            steps {
                dir("${env.FRONTEND_DIR}") {
                    sh '''
                    if [ ! -d "node_modules" ]; then
                      echo "Installing dependencies..."
                      npm install
                    else
                      echo "Using existing node_modules"
                    fi
                    npm run build
                    '''
                }
            }
        }

        stage('🧪 Test Frontend') {
            steps {
                dir("${env.FRONTEND_DIR}") {
                    sh 'npm run test:login'
                }
            }
        }

        stage('📤 Envoi Rapport par Mail') {
            steps {
                dir("${env.FRONTEND_DIR}") {
                    sh 'node selenium-tests/send-report.js'
                }
            }
        }
        stage('📁 Archive Rapport HTML') {
            steps {
                dir("${env.FRONTEND_DIR}") {
                    archiveArtifacts artifacts: 'mochawesome-report/*.html', fingerprint: true
                }
            }
        }
    }
    post {
        success {
            echo '✅ Pipeline exécutée avec succès!'
        }
        failure {
            echo '❌ Échec de la pipeline.'
        }
    }
}
