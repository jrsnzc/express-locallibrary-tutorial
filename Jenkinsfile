pipeline {
    agent {
        docker {
            image 'selenium/node-firefox'
            args '-p 3000:3000'
        }
    }
    environment {
        CI = 'true'
    }
    stages {
        stage('Build') {
            steps {
                sh 'apt install node npm -y'
                sh 'npm install'
            }
        }
        stage('Test') {
            steps {
                sh 'npm run testbdd'
            }
        }
        stage('Deliver') {
            steps {
                sh './jenkins/scripts/deliver.sh'
                input message: 'Finished using the web site? (Click "Proceed" to continue)'
                sh './jenkins/scripts/kill.sh'
            }
        }
    }
}
