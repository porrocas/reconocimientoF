const canvas1 = document.getElementById('canvas1');
const canvas2 = document.getElementById('canvas2');

function IniciarVideo(){
    player = new JSMpeg.Player('ws://localhost:9999', {
        canvas: canvas1 // Canvas should be a canvas DOM element
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

canvas1.addEventListener('loadeddata', ()=>{
    const ctx = canvas2.getContext('2d');
    canvas2.width = canvas1.width;
    canvas2.height = canvas1.height;
    const displaySize = { width: canvas2.width, height: canvas2.height }
    faceapi.matchDimensions(canvas, displaySize);

    setInterval(async ()=>{
        const detections = await faceapi.detectAllFaces(canvas1, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions();
        const resizedDetections = faceapi.resizeResults(detections, displaySize);
        ctx.clearRect(0, 0, canvas2.width, canvas2.height);
        faceapi.draw.drawDetections(canvas2, resizedDetections);
        faceapi.draw.drawFaceLandmarks(canvas2, resizedDetections);
        faceapi.draw.drawFaceExpressions(canvas2, resizedDetections);
    }, 40);
});