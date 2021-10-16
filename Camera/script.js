let video = document.querySelector("video"); 
let body = document.querySelector("body");
let vidbtn = document.querySelector("button#record");
let capbtn = document.querySelector("button#capture");
let filter = document.querySelectorAll(".filter");

let zoomIn = document.querySelector(".zoom-in");
let zoomOut = document.querySelector(".zoom-out");
let gallerybtn = document.querySelector("#gallery");

let constraints = {video : true , Audio : true };
let mediaRecorder ;
let isRecording = false;
let chunks = [];

let minZoom = 1;
let maxZoom = 3;
let currentZoom = 1;


gallerybtn.addEventListener("click", function(){
    location.assign("gallery.html");
});


let filters = "";  // canvas use img filter put that
for(let i =0 ; i < filter.length ; i++){
    filter[i].addEventListener("click" , function(e){
        filters = e.currentTarget.style.backgroundColor ;
     removeFilter();
     applyFiter(filters);
    });
}


zoomIn.addEventListener("click",function(){
    let vidCurrScale = video.style.transform.split("(")[1].split(")")[0];
    if(vidCurrScale > maxZoom){
        return;
    }
    else{
        currentZoom = Number(vidCurrScale) +0.1;
        video.style.transform = `scale(${currentZoom})`;
    }
});


zoomOut.addEventListener("click",function(){
    if(currentZoom > minZoom){
        currentZoom -=0.1;
        video.style.transform = `scale(${currentZoom})`;
    }
});


vidbtn.addEventListener("click" , function(){
    let innerDiv = vidbtn.querySelector("div");  

    if(isRecording){
        mediaRecorder.stop();
        isRecording = false; 
        innerDiv.classList.remove("record-animation");      
    }
    else{
        mediaRecorder.start();
        filters = ""
        removeFilter();
       video.style.transform = `scale(1)`
        currentZoom =1;
        isRecording = true ;
        innerDiv.classList.add("record-animation");      
    }
});

capbtn.addEventListener("click" , function(){
    let innerDiv = capbtn.querySelector("div");
    innerDiv.classList.add("capture-animation");
    setTimeout(function(){
        innerDiv.classList.remove("capture-animation");       
    } , 500)
    capture();
});


 
navigator.mediaDevices.getUserMedia(constraints).then(function(mediaStream){
    video.srcObject = mediaStream;     
    let options = {mimeType : "video/webm ; codescs= vp9" }
   mediaRecorder = new MediaRecorder(mediaStream , options);  //media record obj   
   
   mediaRecorder.addEventListener("dataavailable" , function(e){
        chunks.push(e.data);
    });

    mediaRecorder.addEventListener("stop" , function(){
      let blob = new Blob(chunks , {type:"video/mp4"})
      addMedia("video", blob);
      chunks = [] ;  
    
    // let url = URL.createObjectURL(blob);
    // let a = document.createElement("a");
    // a.href = url ;
    // a.download = "video.mp4";
    // a.click();
    // a.remove();
    }); 
});

function capture(){
    let c = document.createElement("canvas");
    c.width = video.videoWidth;
    c.height = video.videoHeight;
    let ctx = c.getContext("2d");

    ctx.translate(c.width/2 , c.height/2);  //origin center
    ctx.scale(currentZoom , currentZoom);  //center zoom
    ctx.translate(-c.width/2 , -c.height/2); // origin back

    ctx.drawImage(video , 0, 0);
    if(filters != ""){
        ctx.fillStyle = filters;
        ctx.fillRect(0,0,c.width , c.height);
    }

//    let a = document.createElement("a");
//     a.download = "image.jpg"; 
//     a.href = c.toDataURL();
    addMedia("img" , c.toDataURL());
    // a.click();
    // a.remove();
}


function applyFiter(filterColor){
    let filterdiv = document.createElement("div");
    filterdiv.classList.add("filter-div");
    filterdiv.style.backgroundColor = filterColor;
    body.appendChild(filterdiv);
}

function removeFilter(){
    let filterdiv  = document.querySelector(".filter-div");
    if(filterdiv)   filterdiv.remove();
}