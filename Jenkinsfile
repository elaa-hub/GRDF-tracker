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

stage('🔧 Install Chrome') {
  steps {
    sh '''
      echo "[INFO] Installation de Google Chrome dans Jenkins..."

      mkdir -p /opt/google/chrome || true
      cd /tmp
      wget -q https://dl.google.com/linux/direct/google-chrome-stable_current_x86_64.rpm

      # Installer rpm2cpio et cpio s'ils ne sont pas déjà là (silencieusement)
      which rpm2cpio || yum install -y rpm2cpio || true
      which cpio || yum install -y cpio || true

      # Extraire Chrome sans installation système
      rpm2cpio google-chrome-stable_current_x86_64.rpm | cpio -idmv
      cp -r opt/google/chrome/* /opt/google/chrome/

      # Lien symbolique temporaire dans /usr/local/bin
      mkdir -p /usr/local/bin || true
      ln -sf /opt/google/chrome/google-chrome /usr/local/bin/google-chrome

      echo "[INFO] Chrome installé manuellement."
      /usr/local/bin/google-chrome --version || true
    '''
  }
}
        
stage('📋 Vérif Chrome') {
  steps {
    sh 'which google-chrome || echo "Chrome pas encore installé"'
  }
}

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
