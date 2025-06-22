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
                        echo "[INFO] Lancement du backend Spring Boot..."
                        chmod +x ./mvnw
                        nohup ./mvnw spring-boot:run > backend.log 2>&1 &

                        echo "[INFO] Attente du démarrage du backend (port 8081)..."
                        n=0
                        until curl -s http://localhost:8081/actuator/health | grep -q UP; do
                            sleep 2
                            n=$((n+1))
                            if [ $n -ge 30 ]; then
                                echo "❌ Le backend ne s'est pas lancé après 60s."
                                cat backend.log
                                exit 1
                            fi
                        done
                        echo "✅ Backend démarré avec succès !"
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

       stage('🧪 Test Frontend') {
    steps {
        dir('frontend') {
            withEnv(["PATH+NODE=${tool 'NodeJS 20'}/bin"]) {
                sh '''
                    set -e
                    export DISPLAY=:99

                    echo "[INFO] Installation CLI Angular globale..."
                    npm install -g @angular/cli

                    echo "[INFO] Installation de Google Chrome Linux..."
                    cat <<EOF | sudo tee /etc/yum.repos.d/google-chrome.repo
[google-chrome]
name=google-chrome
baseurl=https://dl.google.com/linux/chrome/rpm/stable/x86_64
enabled=1
gpgcheck=1
gpgkey=https://dl.google.com/linux/linux_signing_key.pub
EOF

                    sudo yum install -y google-chrome-stable

                    echo "[INFO] Démarrage de Xvfb..."
                    sudo yum install -y xorg-x11-server-Xvfb > /dev/null 2>&1 || true
                    Xvfb :99 -screen 0 1920x1080x24 > /dev/null 2>&1 &

                    echo "[INFO] Lancement de l'app Angular..."
                    nohup npx serve -s dist --listen 4200 > angular.log 2>&1 &

                    echo "[INFO] Attente de démarrage de l'app Angular..."
                    n=0
                    until curl -s http://localhost:4200 > /dev/null; do
                        sleep 2
                        n=$((n+1))
                        if [ $n -ge 30 ]; then
                            echo "❌ Angular ne s'est pas lancé après 60s."
                            cat angular.log
                            exit 1
                        fi
                    done

                    echo "✅ Angular lancé, exécution des tests..."
                    npm run test:login

                    echo "🛑 Arrêt de l'app Angular..."
                    pkill -f "npx serve" || true
                '''
            }
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

        stage('🐳 Docker Build Frontend (avec dist)') {
            steps {
                dir('frontend') {
                    script {
                        sh '''
                            echo "[INFO] Listing dist directory contents:"
                            ls -l dist
                            echo "[INFO] Copie vers DockerDist"
                            rm -rf DockerDist
                            mkdir DockerDist
                            cp -r dist/* DockerDist/
                        '''
                        docker.build('grdf-frontend:latest', '--build-arg APP_DIR=DockerDist .')
                    }
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
        success {
            echo '✅ Pipeline exécutée avec succès!'
        }
        failure {
            echo '❌ Échec de la pipeline.'
        }
    }
}
