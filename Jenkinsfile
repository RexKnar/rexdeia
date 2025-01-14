pipeline {
    agent any

    environment {
        DOCKER_IMAGE = "rexdeia"           // Image name
        DOCKER_TAG = "latest"                  // Tag for the image
    }

    stages {
        stage('Clone Repository') {
            steps {
                // Clone the repository
                git 'https://github.com/RexKnar/rexdeia.git'
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    // Build Docker image locally
                    sh 'docker build -t $DOCKER_IMAGE:$DOCKER_TAG .'
                }
            }
        }

        stage('Deploy on Local Server') {
            steps {
                script {
                    // Directly deploy the Docker container on the same machine
                    sh """
                        docker stop rexdeia-container || true
                        docker rm rexdeia-container || true
                        docker run -d -p 3000:3000 --name rexdeia-container $DOCKER_IMAGE:$DOCKER_TAG
                    """
                }
            }
        }
    }

    post {
        always {
            // Clean up if necessary
            cleanWs()
        }
    }
}
