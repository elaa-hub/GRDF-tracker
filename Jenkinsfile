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

        stage('🌐  Build Frontend (optimisé)') {
            steps {
                dir('frontend') {
                    sh '''
                        echo "📦 Initialisation des caches"
                        mkdir -p $NPM_CACHE
                        mkdir -p $NPM_MODULES_CACHE

                        echo "🔁 Restauration de node_modules depuis le cache (si présent)"
                        if [ -d "$NPM_MODULES_CACHE/node_modules" ]; then
                            cp -R $NPM_MODULES_CACHE/node_modules ./ || true
                        fi

                        echo "⚙️ Configuration du cache NPM"
                        npm config set cache $NPM_CACHE --global

                        echo "📥 Installation rapide des dépendances"
                        npm ci || npm install

                        echo "💾 Sauvegarde node_modules vers cache"
                        rm -rf $NPM_MODULES_CACHE/node_modules
                        cp -R node_modules $NPM_MODULES_CACHE/ || true

                        echo "🚀 Build Angular optimisé"
                        time NODE_OPTIONS=--max_old_space_size=2048 npm run build -- --configuration development --no-progress
                    '''
                }
            }
        }

        stage('🧪 Test Frontend') {
            steps {
                dir('frontend') {
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
            echo '✅ Pipeline exécutée avec succès!'
        }
        failure {
            echo '❌ Échec de la pipeline.'
        }
    }
}
