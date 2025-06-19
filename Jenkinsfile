pipeline {
    agent any

    tools {
        maven 'mvn'
        nodejs 'NodeJS 20'
    }

    environment {
        BACKEND_BRANCH = 'backend'
        FRONTEND_BRANCH = 'frontend'
    }

    triggers {
        githubPush()
    }

    stages {
        stage('📦 Checkout Backend') {
            steps {
                dir('backend') {
                    checkout([$class: 'GitSCM',
                        branches: [[name: '**']], 
                        userRemoteConfigs: [[url: 'https://github.com/elaa-hub/GRDF-tracker.git']]
                    ])
                    sh "git checkout ${env.BACKEND_BRANCH}" 
                }
            }
        }

        stage('🌐 Checkout Frontend') {
            steps {
                dir('frontend') {
                    checkout([$class: 'GitSCM',
                        branches: [[name: '**']],
                        userRemoteConfigs: [[url: 'https://github.com/elaa-hub/GRDF-tracker.git']]
                    ])
                    sh "git checkout ${env.FRONTEND_BRANCH}"
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
                dir('frontend') {
                    sh 'npm install'
                    sh 'npm run build'
                }
            }
        }

        stage('🧪 Test Frontend') {
            steps {
                dir('frontend') {
                    sh 'npm install'
                    sh 'npm run test:login'
                }
            }
        }

        stage('📤 Envoi Rapport par Mail') {
            steps {
                dir('frontend') {
                    sh 'node selenium-tests/send-report.js'
                }
            }
        }

        stage('📁 Archive Rapport HTML') {
            steps {
                dir('frontend') {
                    archiveArtifacts artifacts: 'mochawesome-report/*.html', fingerprint: true
                }
            }
        }
    }

    post {
        success {
            echo '  ✅ Pipeline exécutée avec succès!'
        }
        failure {
            echo '❌ Échec de la pipeline.'
        }
    }
}
