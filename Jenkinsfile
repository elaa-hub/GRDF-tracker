pipeline {
    agent any

    tools {
        maven 'mvn'
        nodejs 'NodeJS 20'
    }

    environment {
        BACKEND_BRANCH = 'backend'
        FRONTEND_BRANCH = 'frontend'
        NODE_OPTIONS = "--max-old-space-size=8192"
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
                        nohup ./mvnw spring-boot:run > backend.log 2>&1 &
                        echo '[INFO] Attente du démarrage du backend (port 8081)...'
                        n=0
                        until curl -s http://localhost:8081/actuator/health | grep -q UP; do
                            sleep 2
                            n=$((n+1))
                            if [ $n -ge 30 ]; then
                                echo '❌ Timeout backend non démarré'
                                cat backend.log
                                exit 1
                            fi
                        done
                        echo '✅ Backend démarré avec succès !'
                    '''
                }
            }
        }

        stage('⚙️ Build Angular App') {
            steps {
                dir('frontend') {
                    sh '''
                        npm ci --prefer-offline --no-audit
                        npm run build -- --configuration production --no-progress
                        echo '[INFO] Vérification du contenu dist/'
                        ls -l dist
                    '''
                }
            }
        }

        stage('📦 Install Chrome & Xvfb') {
            steps {
                sh '''
                    echo '[INFO] Installation de Google Chrome et ChromeDriver...'
                    sudo yum install -y epel-release
                    sudo yum install -y wget unzip xorg-x11-server-Xvfb

                    mkdir -p /opt/google/chrome
                    cd /tmp
                    wget https://dl.google.com/linux/direct/google-chrome-stable_current_x86_64.rpm
                    rpm2cpio google-chrome-stable_current_x86_64.rpm | cpio -idmv
                    cp -r opt/google/chrome/* /opt/google/chrome/
                    ln -sf /opt/google/chrome/google-chrome /usr/local/bin/google-chrome
                    google-chrome --version
                '''
            }
        }

        stage('▶️ Start Angular App') {
            steps {
                dir('frontend') {
                    sh '''
                        echo '[INFO] Lancement Xvfb...'
                        Xvfb :99 -screen 0 1920x1080x24 > /dev/null 2>&1 &
                        export DISPLAY=:99

                        echo '[INFO] Lancement Angular dist/ avec serve...'
                        nohup npx serve -s dist --listen 4200 > angular.log 2>&1 &

                        echo '[INFO] Attente de l\'app Angular...'
                        n=0
                        until curl -s http://localhost:4200 > /dev/null; do
                            sleep 2
                            n=$((n+1))
                            if [ $n -ge 30 ]; then
                                echo '❌ Angular ne s\'est pas lancé'
                                cat angular.log
                                exit 1
                            fi
                        done
                        echo '✅ Angular disponible sur http://localhost:4200'
                    '''
                }
            }
        }

        stage('🧪 Selenium Tests') {
            steps {
                dir('frontend') {
                    sh '''
                        echo '[INFO] Exécution des tests...'
                        DISPLAY=:99 npx mocha selenium-tests/*.spec.js || {
                            echo '[❌] Échec des tests';
                            cat selenium-tests/*.log || true;
                            exit 1;
                        }
                    '''
                }
            }
        }

        stage('📁 Archive Rapport') {
            steps {
                dir('frontend') {
                    archiveArtifacts artifacts: 'selenium-tests/*.html', fingerprint: true
                }
            }
        }

        stage('🐳 Docker Build Frontend') {
            steps {
                dir('frontend') {
                    sh '''
                        mkdir -p DockerDist
                        cp -r dist/* DockerDist/
                        docker build -t grdf-frontend:latest --build-arg APP_DIR=DockerDist .
                    '''
                }
            }
        }

        stage('📤 Envoi Rapport') {
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
            echo '✅ Pipeline exécutée avec succès !'
        }
    }
}
