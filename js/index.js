const video = document.getElementById('video');

function IniciarVideo(){
    navigator.mediaDevices.getUserMedia({
        video: true
    })
    .then((stream) => {
        video.srcObject = stream;
    })
    .catch((err) => {
        console.log(err);
    })
}

Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri('../models'),
    faceapi.nets.faceLandmark68Net.loadFromUri('../models'),
    faceapi.nets.faceRecognitionNet.loadFromUri('../models'),
    faceapi.nets.faceExpressionNet.loadFromUri('../models')
])
.then(
    () => {
        IniciarVideo();
    }
)
.catch(
    () => {
        console.log('error no cargaron los models');
    }
)