const video = document.getElementById('video');
const canvas = document.getElementById('canvas');

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
    faceapi.nets.tinyFaceDetector.loadFromUri('./models'),
    faceapi.nets.faceLandmark68Net.loadFromUri('./models'),
    faceapi.nets.faceRecognitionNet.loadFromUri('./models'),
    faceapi.nets.faceExpressionNet.loadFromUri('./models')
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

video.addEventListener('loadeddata', ()=>{
    const ctx = canvas.getContext('2d');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const displaySize = { width: video.videoWidth, height: video.videoHeight }
    faceapi.matchDimensions(canvas, displaySize);

    setInterval(async ()=>{
        const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions();
        const resizedDetections = faceapi.resizeResults(detections, displaySize);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        faceapi.draw.drawDetections(canvas, resizedDetections);
        faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
        faceapi.draw.drawFaceExpressions(canvas, resizedDetections);
    }, 100);
});