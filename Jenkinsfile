pipeline {
    agent any

    tools {
        maven 'mvn'
        nodejs 'NodeJS 20'
    }

    environment {
        BACKEND_BRANCH = 'backend'
        FRONTEND_BRANCH = 'frontend'
        NPM_CACHE = "${WORKSPACE}/.npm"
        NPM_MODULES_CACHE = "/mnt/jenkins_data/cache_node_modules"
    }

    triggers {
        githubPush()
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
                dir('frontend') {
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

        stage('▶️ Start Backend') {
            steps {
                dir('backend') {
                    sh '''
                        echo '[INFO] Lancement du backend Spring Boot...'
                        chmod +x ./mvnw
                        nohup ./mvnw spring-boot:run &
                        echo '[INFO] Attente du démarrage du backend (port 8081)...'
                        n=0
                        until curl -s http://localhost:8081/actuator/health | grep -q UP; do
                          sleep 2
                          n=$((n+1))
                          if [ $n -ge 30 ]; then
                            echo '❌ Timeout backend non démarré'
                            exit 1
                          fi
                        done
                        echo '✅ Backend démarré avec succès !'
                    '''
                }
            }
        }

        stage('⚙️ Build Angular App (hors Docker)') {
            steps {
                dir('frontend') {
                    sh '''
                        npm ci --prefer-offline --no-audit
                        rm -f ./node_modules/.ngcc_lock_file
                        npm run build -- --configuration production --no-progress
                    '''
                }
            }
        }

        stage('📦 Install Frontend Dependencies') {
            steps {
                dir('frontend') {
                    sh 'npm install'
                }
            }
        }

        // 🔧 ÉTAPE SUPPRIMÉE ICI : Préparation environnement avec sudo

        stage('🧪 Test Frontend') {
            steps {
                dir('frontend') {
                    sh 'npx mocha selenium-tests/*.spec.js'
                }
            }
        }

        stage('📁 Archive Rapport HTML') {
            steps {
                archiveArtifacts artifacts: 'frontend/selenium-tests/report.html', fingerprint: true
            }
        }

        stage('🐳 Docker Build Frontend (avec dist)') {
            steps {
                dir('frontend') {
                    sh 'docker build -t grdf-frontend .'
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

    }

    post {
        failure {
            echo '❌ Échec de la pipeline.'
        }
        success {
            echo '✅ Pipeline terminée avec succès.'
        }
    }
}
