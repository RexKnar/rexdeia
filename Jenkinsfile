pipeline {
    agent any
    
    environment {
        DOCKER_IMAGE = "rexdeia"
        DOCKER_TAG = "latest"
        APP_PORT = "3000"
    }
    
    stages {
        stage('Checkout') {
            steps {
                // Clean workspace before build
                cleanWs()
                // Jenkins will use the branch and credentials from job configuration
                git url: 'git@github.com:RexKnar/rexdeia.git'
            }
        }
        
        stage('Build Docker Image') {
            steps {
                script {
                    try {
                        sh """
                            docker build -t ${DOCKER_IMAGE}:${DOCKER_TAG} \
                            --build-arg NODE_ENV=production \
                            .
                        """
                    } catch (Exception e) {
                        error "Docker build failed: ${e.getMessage()}"
                    }
                }
            }
        }
        
        stage('Deploy Application') {
            steps {
                script {
                    try {
                        sh """
                            docker stop ${DOCKER_IMAGE} || true
                            docker rm ${DOCKER_IMAGE} || true
                            docker run -d \
                            --name ${DOCKER_IMAGE} \
                            -p ${APP_PORT}:${APP_PORT} \
                            --restart unless-stopped \
                            ${DOCKER_IMAGE}:${DOCKER_TAG}
                        """
                    } catch (Exception e) {
                        error "Deployment failed: ${e.getMessage()}"
                    }
                }
            }
        }
        
        stage('Health Check') {
            steps {
                script {
                    // Wait for application to be ready
                    sh """
                        for i in `seq 1 30`; do
                            if curl -s http://localhost:${APP_PORT} >/dev/null; then
                                echo 'Application is up!'
                                exit 0
                            fi
                            echo 'Waiting for application to be ready...'
                            sleep 2
                        done
                        echo 'Application failed to start!'
                        exit 1
                    """
                }
            }
        }
    }
    
    post {
        success {
            echo 'Deployment successful!'
        }
        failure {
            script {
                echo 'Deployment failed!'
                // Cleanup on failure
                sh """
                    docker stop ${DOCKER_IMAGE} || true
                    docker rm ${DOCKER_IMAGE} || true
                """
            }
        }
        always {
            // Clean up dangling images only to preserve layer caching
            sh """
                docker image prune -f
            """
            cleanWs()
        }
    }
}
