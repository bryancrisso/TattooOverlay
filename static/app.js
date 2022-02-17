let constraints = {video : { facingMode:"environment" }, audio:false}; //facingMode:"user" to make it face selfie
const   cameraView = document.querySelector("#camera--view"),
        cameraOutput = document.querySelector("#camera--output"),
        cameraSensor = document.querySelector("#camera--sensor"),
        cameraTrigger = document.querySelector("#camera--trigger");
        downloadTrigger = document.querySelector("#download--image");
        cancelTrigger = document.querySelector("#cancel--image");
        //flipCamera = document.querySelector("#flip--cam");
        overlayImage = document.querySelector("#overlay");
        //debugText = document.querySelector("#debug--text");

let pointerPos = {x:0,y:0}

let downloadCount = 0;
const delay = async ms => new Promise(res => setTimeout(res, ms));

//hide the canvas
cameraSensor.style.display="none";
//place the overlay tattoo
overlayImage.style.top = (window.innerHeight/2 - overlayImage.getBoundingClientRect().height/2)+"px";
overlayImage.style.left = (window.innerWidth/2 - overlayImage.getBoundingClientRect().width/2)+"px";

//track mouse movement
document.addEventListener('mousemove', (event) => 
{
	pointerPos.x = event.clientX;
    pointerPos.y = event.clientY;
});

//track touch movement
document.addEventListener('touchstart', (event) =>
{
    var touch = event.touches[0] || event.changedTouches[0];
    pointerPos.x = touch.clientX;
    pointerPos.y = touch.clientY;
});
document.addEventListener('touchmove', (event) => 
{
    
    var touch = event.touches[0] || event.changedTouches[0];
    pointerPos.x = touch.clientX;
    pointerPos.y = touch.clientY;
    
    //prevent scrolling and zooming
    event.preventDefault();

}, { passive: false });


let hammertime = new Hammer(overlay);
hammertime.on('pan', function(ev) 
{
    let xPos = ev.center.x - (pointerPos.x - overlayImage.getBoundingClientRect().left);
    overlayImage.style.left = xPos + "px";

    let yPos = ev.center.y - (pointerPos.y - overlayImage.getBoundingClientRect().top);
    overlayImage.style.top = yPos + "px";
});

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

cameraTrigger.onclick = async () => 
{
    cameraOutput.classList.remove("taken");

    cameraSensor.width = window.innerWidth;
    cameraSensor.height = window.innerHeight;

    //when browser window doesnt fit exact size of camera view, stretch it out in either width or height to maintain aspect ratio
    if (window.innerHeight<cameraView.videoHeight/(cameraView.videoWidth/window.innerWidth))
    {
        cameraSensor.getContext("2d").drawImage(cameraView,dx=0,dy=0-(cameraView.videoHeight/(cameraView.videoWidth/window.innerWidth)-window.innerHeight)/2, 
        dWidth = cameraView.videoWidth/(cameraView.videoWidth/window.innerWidth),
        dHeight = cameraView.videoHeight/(cameraView.videoWidth/window.innerWidth));
    }
    else
    {
        cameraSensor.getContext("2d").drawImage(cameraView,dx=0-(cameraView.videoWidth/(cameraView.videoHeight/window.innerHeight)-window.innerWidth)/2,dy=0, 
        dWidth = cameraView.videoWidth/(cameraView.videoHeight/window.innerHeight),
        dHeight = cameraView.videoHeight/(cameraView.videoHeight/window.innerHeight));
    }
    
    //draw the overlay onto the camera image
    let overlayBox = overlayImage.getBoundingClientRect();

    cameraSensor.getContext("2d").drawImage(overlayImage,
                                            dx=overlayBox.left,
                                            dy=overlayBox.top,
                                            dWidth = overlayBox.width,
                                            dHeight = overlayBox.height);

    let imageOutput = ReImg.fromCanvas(cameraSensor);
    cameraOutput.src = imageOutput.toImg().src;
    
    //show and setup download button
    downloadTrigger.style.display = "inline";
    downloadTrigger.onclick = () =>
    {
        imageOutput.downloadPng("tattoo" + downloadCount);
        downloadCount++;
    }

    //show and setup download button
    cancelTrigger.style.display = "inline";
    cancelTrigger.onclick = () =>
    {
        downloadTrigger.style.display = "none";
        cancelTrigger.style.display = "none";
        cameraOutput.classList.remove("taken");
        cameraOutput.src = "\\static\\transparency.png";
    }
    //wait for capture animation to reset
    await delay(100);

    //cameraOutput.src = cameraSensor.toDataURL("image/webp");
    cameraOutput.classList.add("taken");
};
/*
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
*/
window.addEventListener("load", cameraStart, false);