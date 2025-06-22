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
        NODE_OPTIONS = "--max-old-space-size=8192"
        CHROME_BIN = "$HOME/chrome/google-chrome" // 🆕 Pour les tests headless avec Chrome
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
                        nohup ./mvnw spring-boot:run & // 🆕 Lance Spring Boot en arrière-plan
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

        stage('🔧 Install Chrome') {
            steps {
                sh '''
                    echo "[INFO] Installation de Google Chrome dans Jenkins (dossier personnel)..." // 🆕
                    cd /tmp
                    wget -q https://dl.google.com/linux/direct/google-chrome-stable_current_x86_64.rpm
                    rpm2cpio google-chrome-stable_current_x86_64.rpm | cpio -idmv
                    mkdir -p $HOME/chrome
                    cp -r ./opt/google/chrome/* $HOME/chrome/
                    echo "[INFO] Chrome installé dans $HOME/chrome"
                    $HOME/chrome/google-chrome --version || true
                '''
            }
        }

        stage('🧪 Serve & Run Frontend Tests (Selenium)') {
            steps {
                dir('frontend') {
                    sh '''
                        export CHROME_BIN=$HOME/chrome/google-chrome
                        npm run start:dist &> server.log & // 🆕 Démarrage du serveur Angular avec http-server
                        SERVER_PID=$!
                        n=0
                        until curl -s http://localhost:4200 > /dev/null; do
                          sleep 1
                          n=$((n+1))
                          if [ $n -gt 30 ]; then
                            echo "❌ Le serveur frontend n'a pas démarré dans 30s"
                            kill $SERVER_PID || true
                            exit 1
                          fi
                        done
                        echo "✅ Frontend servi sur http://localhost:4200"
                        npm run test:login || TEST_EXIT=$? // 🆕 Lancement des tests Selenium
                        kill $SERVER_PID || true // 🆕 Arrêt du serveur
                        exit ${TEST_EXIT:-0}
                    '''
                }
            }
        }

        stage('🐳 Docker Build Frontend (avec dist)') {
            steps {
                dir('frontend') {
                    sh 'docker build -t grdf-frontend .' // Build Docker final
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
