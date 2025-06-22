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

        stage('⚙️ Build Backend') {
            steps {
                dir('backend') {
                    sh 'mvn clean package -DskipTests'
                }
            }
        }

        stage('🚀 Lancer Backend Spring') {
            steps {
                dir('backend') {
                    sh '''
                        echo "[INFO] Lancement du backend Spring Boot..."
                        nohup java -jar target/GRDFBack-0.0.1-SNAPSHOT.jar > backend.log 2>&1 &

                        echo "[INFO] Attente que le backend soit prêt..."
                        n=0
                        until curl -s http://localhost:8080/api/auth/login -X POST -H "Content-Type: application/json" -d '{}' | grep -q "Bad Request"; do
                          sleep 2
                          n=$((n+1))
                          if [ $n -ge 30 ]; then
                            echo "❌ Backend ne répond pas après 60s"
                            cat backend.log
                            exit 1
                          fi
                        done
                        echo "✅ Backend prêt, on continue..."
                    '''
                }
            }
        }

        stage('🧪 Test Frontend') {
            steps {
                dir('frontend') {
                    sh '''
                        echo "[INFO] Installation des dépendances Angular..."
                        npm install --cache ${NPM_CACHE} --prefer-offline

                        echo "[INFO] Lancement de l'app Angular..."
                        nohup npm run start > angular.log 2>&1 &

                        echo "[INFO] Attente que l'app Angular soit prête..."
                        n=0
                        until curl -s http://localhost:4200 | grep -q "email"; do
                          sleep 2
                          n=$((n+1))
                          if [ $n -ge 30 ]; then
                            echo "❌ Angular ne répond pas après 60s"
                            cat angular.log
                            exit 1
                          fi
                        done
                        echo "✅ Angular est prêt ! Lancement des tests Selenium..."

                        npm run test:login
                    '''
                }
            }
        }
    }
}
