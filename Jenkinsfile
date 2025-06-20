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

        stage('🐳 Docker Build Frontend (avec dist)') {
            steps {
                dir('frontend') {
                    script {
                        // ✅ S'assurer que le dossier dist/DevExtreme-app est à l'intérieur du contexte Docker
                        sh 'cp -r dist/DevExtreme-app ./dist || echo "déjà présent"'
                        def app = docker.build('grdf-frontend:latest')
                    }
                }
            }
        }

        stage('🧪 Test Frontend (in Docker)') {
            steps {
                script {
                    docker.image('grdf-frontend:latest').inside {
                        sh 'npm run test:login'
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
            echo '✅ Pipeline exécutée avec succès!'
        }
        failure {
            echo '❌ Échec de la pipeline.'
        }
    }
}
