pipeline {
    agent any
    
    environment {
        DOCKER_IMAGE = "rexdeia"
        DOCKER_TAG = "latest"
        CONTAINER_NAME = "rexdeia-container"
        APP_PORT = "3000"
    }
    
    stages {
        stage('Checkout') {
            steps {
                // Clean workspace before build
                cleanWs()
                git credentialsId: 'rexdeia_ssh_key', // Use your SSH credentials ID here
                    branch: 'main',
                    url: 'git@github.com:RexKnar/rexdeia.git' // SSH URL for the repository
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
        
        stage('Stop & Remove Existing Container') {
            steps {
                script {
                    try {
                        sh """
                            if docker ps -a | grep -q ${CONTAINER_NAME}; then
                                docker stop ${CONTAINER_NAME} || true
                                docker rm ${CONTAINER_NAME} || true
                            fi
                        """
                    } catch (Exception e) {
                        echo "Warning: Could not remove existing container: ${e.getMessage()}"
                    }
                }
            }
        }
        
        stage('Deploy Container') {
            steps {
                script {
                    try {
                        sh """
                            docker run -d \
                            --name ${CONTAINER_NAME} \
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
                // Rollback on failure
                sh """
                    docker stop ${CONTAINER_NAME} || true
                    docker rm ${CONTAINER_NAME} || true
                """
            }
        }
        always {
            // Clean up old images
            sh """
                docker system prune -f
                docker image prune -f
            """
            cleanWs()
        }
    }
}
