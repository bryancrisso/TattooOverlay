let constraints = {video : { facingMode:"user" }, audio:false}; //facingMode:"environment" to make it face rear cam
const   cameraView = document.querySelector("#camera--view"),
        cameraOutput = document.querySelector("#camera--output"),
        cameraSensor = document.querySelector("#camera--sensor"),
        cameraTrigger = document.querySelector("#camera--trigger");
        downloadTrigger = document.querySelector("#download--image");

let downloadCount = 0;

function cameraStart()
{
    navigator.mediaDevices
        .getUserMedia(constraints)
        .then((stream)=>
        {
            track = stream.getTracks()[0];
            cameraView.srcObject = stream;
        })
        .catch(function(error)
        {
            console.error("oops, something broke", error);
        });
}

cameraTrigger.onclick = () => 
{
    cameraSensor.width = cameraView.videoWidth;
    cameraSensor.height = cameraView.videoHeight;
    cameraSensor.getContext("2d").drawImage(cameraView,0,0);
    let imageOutput = ReImg.fromCanvas(cameraSensor);
    cameraOutput.src = imageOutput.toImg().src;
    downloadTrigger.style.display = "inline";
    downloadTrigger.onclick = () =>
    {
        imageOutput.downloadPng("tattoo" + downloadCount);
        downloadCount++;
    }

    //cameraOutput.src = cameraSensor.toDataURL("image/webp");
    cameraOutput.classList.add("taken");
};

window.addEventListener("load", cameraStart, false);