let constraints = {video : { facingMode:"user" }, audio:false}; //facingMode:"environment" to make it face rear cam
const   cameraView = document.querySelector("#camera--view"),
        cameraOutput = document.querySelector("#camera--output"),
        cameraSensor = document.querySelector("#camera--sensor"),
        cameraTrigger = document.querySelector("#camera--trigger");
        downloadTrigger = document.querySelector("#download--image");
        cancelTrigger = document.querySelector("#cancel--image");
        flipCamera = document.querySelector("#flip--cam");

let downloadCount = 0;
const delay = async ms => new Promise(res => setTimeout(res, ms));

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
    //hide the canvas
    cameraSensor.style.display="none";
}

cameraTrigger.onclick = async () => 
{
    cameraOutput.classList.remove("taken");

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

    cancelTrigger.style.display = "inline";
    cancelTrigger.onclick = () =>
    {
        downloadTrigger.style.display = "none";
        cancelTrigger.style.display = "none";
        cameraOutput.classList.remove("taken");
        cameraOutput.src = "transparency.png";
    }
    //wait for capture animation to reset
    await delay(100);

    //cameraOutput.src = cameraSensor.toDataURL("image/webp");
    cameraOutput.classList.add("taken");
};

flipCamera.onclick = () =>
{
    if (constraints.video.facingMode == "user")
    {
        constraints.video.facingMode = "environment";
        cameraView.style.transform = "scaleX(1)";
        cameraSensor.style.transform = "scaleX(1)";
        cameraOutput.style.transform = "scaleX(1)";
    }
    else
    {
        constraints.video.facingMode = "user";
        cameraView.style.transform = "scaleX(-1)";
        cameraSensor.style.transform = "scaleX(-1)";
        cameraOutput.style.transform = "scaleX(-1)";
    }
    cameraStart();
}

window.addEventListener("load", cameraStart, false);