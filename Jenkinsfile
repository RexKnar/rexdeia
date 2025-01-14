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
                // Clone the repository using SSH
                git credentialsId: 'rexdeia_ssh_key', // Replace with your Jenkins SSH credentials ID
                    branch: 'main',
                    url: 'git@github.com:RexKnar/rexdeia.git' // SSH URL for the repository
            }
        }
        
        stage('Build Docker Image') {
            steps {
                script {
                    try {
                        // Run docker build on the host system (outside the container)
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
                        // Run the application directly (outside of Docker)
                        // Assuming your application is run via npm or node
                        sh """
                            nohup npm start --port ${APP_PORT} &
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
                // Rollback on failure (if necessary)
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
