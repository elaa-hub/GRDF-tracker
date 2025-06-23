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
    CHROME_BIN = "/usr/bin/google-chrome"
    SONARQUBE_ENV = "sonarqube"
    DOCKER_IMAGE = 'elaa25/grdf-backend:latest'
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

    stage('🔍 Analyse SonarQube') {
      steps {
        dir('backend') {
          withSonarQubeEnv("${env.SONARQUBE_ENV}") {
            withCredentials([string(credentialsId: 'sonarqube-token', variable: 'SONAR_TOKEN')]) {
              sh 'mvn verify sonar:sonar -Dsonar.token=$SONAR_TOKEN'
            }
          }
        }
      }
    }

    stage('🐳 Docker Build & Push') {
      steps {
        dir('backend') {
          withCredentials([usernamePassword(credentialsId: 'docker-hub-credentials', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
            sh '''
              echo "[INFO] 🔧 Construction de l'image Docker..."
              docker build -t $DOCKER_USER/grdf-backend:latest .

              echo "[INFO] 🔐 Connexion à Docker Hub..."
              echo "$DOCKER_PASS" | docker login -u "$DOCKER_USER" --password-stdin

              echo "[INFO] 🚀 Push de l'image vers Docker Hub..."
              docker push $DOCKER_USER/grdf-backend:latest
            '''
          }
        }
      }
    }


    stage('🚀 Déploiement Ansible Backend') {
      steps {
        dir('backend') {
          withCredentials([sshUserPrivateKey(credentialsId: 'ssh-key-grdf', keyFileVariable: 'SSH_KEY')]) {
            sh '''
              echo "[INFO] Déploiement backend avec Ansible..."
              chmod 600 "$SSH_KEY"
              ansible-playbook -i inventory.ini playbook.yml \
                --private-key "$SSH_KEY" -u ec2-user
            '''
          }
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

    stage('🧪 Run Selenium Tests (Frontend déployé S3)') {
      steps {
        dir('frontend') {
          sh '''
            echo "[INFO] Installation des dépendances..."
            npm ci

            echo "[INFO] Exécution du test Selenium..."
            npx mocha selenium-tests/login.spec.js --reporter mochawesome
          '''
        }
      }
    }

    stage('📄 Archive Rapport Mocha') {
      steps {
        dir('frontend') {
          publishHTML(target: [
            allowMissing: true,
            alwaysLinkToLastBuild: true,
            keepAll: true,
            reportDir: 'mochawesome-report',
            reportFiles: 'mochawesome.html',
            reportName: 'Rapport Selenium - Mocha'
          ])
        }
      }
    }
  }

  post {
    always {
      archiveArtifacts artifacts: 'frontend/page-source.html', allowEmptyArchive: true
    }
    failure {
      echo '❌ Échec de la pipeline.'
    }
    success {
      echo '✅ Pipeline terminée avec succès.'
    }
  }
}
