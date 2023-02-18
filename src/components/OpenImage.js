import React from 'react'

import Popup from 'reactjs-popup';
import { Link, useLocation } from "react-router-dom";
import react,{ useState,Component, useEffect, useRef } from 'react'
import '../styles/main.css'


function OpenImage(props) {
  const location = useLocation();
  const propsData = location.state;
  console.log("hiiiii "+props.list)

  const [imageList,setNewImage] = useState([])
    const [defaultImageList,setdefaultImageList] = useState([])

    const [temp,settemp] = useState(null)
    const [imageid,setimageid] = useState({file:null,i:0,clicked:false,name:null})
    const [base64,setdataurl] = useState({baseurl:null,height:0,width:0})
    const [angle,setangle] = useState(0)
    const [ctx,setcontext] = useState(null)
    const [canvass,setcanvass] = useState(null)
    const [stack,setstack] = useState([])
    const [defaultdata,setdefault] = useState({baseurl:null,height:0,width:0})

    function handleresize(){
        const canvas = document.getElementById("thecanvas")
        const newWidth = document.getElementById('resize-width').value
        const newHeight = document.getElementById('resize-height').value
        const context = canvas.getContext('2d') 
        let img =  new Image()
        img.src = base64.baseurl
        img.onload = ()=>{
            canvas.height = newHeight
            canvas.width = newWidth
            context.drawImage(img,0,0,newWidth,newHeight)
            let newdata = canvas.toDataURL()
            setdataurl({baseurl:newdata,height:canvas.height,width:canvas.width})
            let nfile = dataURLtoFile(newdata,imageid.name)
            setimageid({file:nfile,i:imageid.i,clicked:true,name:imageid.name})
            const changed = imageList.map((image,ind)=>{
                if(ind==imageid.i){
                    return nfile
                }
                else{
                    return image
                }
            })
            setNewImage(changed)
        }
    }
    function OpenImage(){
        const reader = new FileReader()
        reader.readAsDataURL(imageList[imageid.i])
        let base64 = null;
        reader.onload=(event)=>{
            const canvas = document.getElementById("thecanvas")
            base64 = event.target.result
            const context = canvas.getContext('2d')
            let img =  new Image()
            img.src = base64
            img.onload = ()=>{
                canvas.width = img.width
                canvas.height = img.height
                context.drawImage(img,0,0,img.width,img.height)
                setdataurl({baseurl:base64,height:img.height,width:img.width})
                setdefault({baseurl:base64,height:img.height,width:img.width})
                console.log("in openimage "+img.height,img.width)
            }
        }
        //console.log(base64)
    
    }
    
    function rotateImage(){
        
        const canvas = document.getElementById('thecanvas')
        const ctx = canvas.getContext('2d')
        const image = new Image();
        image.onload = function() {
            canvas.width = 1800
            canvas.height = 1200
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.translate((canvas.width / 2), (canvas.height / 2));
            ctx.rotate((angle* Math.PI) / 180);
            ctx.drawImage(image, -image.width / 2, -image.height / 2);
            const newdata = canvas.toDataURL()
            setdataurl({baseurl:newdata,height:image.height,width:image.width})
            let nfile = dataURLtoFile(newdata,imageid.name)
            setimageid({file:nfile,i:imageid.i,clicked:true,name:imageid.name})
                const changed = imageList.map((imagee,ind)=>{
                    if(ind==imageid.i){
                        return nfile
                    }
                    else{
                        return imagee
                    }
                })
                setNewImage(changed)
        };
        image.src = base64.baseurl

        }
    

    function dataURLtoFile(dataurl, filename) {
        var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
        while(n--){
        u8arr[n] = bstr.charCodeAt(n);
        }
      return new File([u8arr], filename, {type:mime});

     }

    const [dragging, setDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [startY, setStartY] = useState(0);
    const [isCropping, setIsCropping] = useState(false);
    const [sX, setX] = useState(0);
    const [sY, setY] = useState(0);
    const [widthh, setwidth] = useState(0);
    const [heightt, setheight] = useState(0);
    const canvasRef = useRef(null)
    const canvas = canvasRef.current

    // useEffect(()=>{
    //     loadData()
    // },[base64.baseurl])


    function loadData(){
        const canvas = document.getElementById('thecanvas')
        const ctx = canvas.getContext('2d')
        const img = new Image()
        img.src = base64.baseurl
        img.onload=function(){
            canvas.height = base64.height
            canvas.width = base64.width
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img,0,0)
            console.log("inside loaddata")
        }

      }
      function fixCrop(){
        const reader = new FileReader()

        reader.readAsDataURL(imageList[imageid.i])
        reader.onload=(event)=>{
            const base64 = event.target.result
            const canvas = document.getElementById('thecanvas')
            const context = canvas.getContext('2d')
            const image = new Image();
            image.onload = function() {
                
                context.clearRect(0, 0, canvas.width, canvas.height);
                console.log("yoooo" +sX,sY,widthh,heightt)
                canvas.height = heightt
                canvas.width = widthh
                context.drawImage(image,sX,sY,widthh,heightt,0,0,widthh,heightt);
    
                const newdata = canvas.toDataURL()
                setdataurl(newdata)
                const link = document.createElement("a");
                link.download = "image.png";
                link.href = canvas.toDataURL();
                link.click();

            };
            image.src = base64
            


        }
        
    }





  return (
    <div>
      <div className='imagedisplay'>
        <div className='imageview'>
            <canvas id="thecanvas" width={2000} height={1100}></canvas>
        </div>
        <div className='imageedit'>
            <span style={{color:"white"}}> set Height </span><input placeholder = {defaultdata.height} id='resize-height' type={'text'} ></input> <br/>
            <span style={{color:"white"}}> set Width </span><input placeholder = {defaultdata.width} id='resize-width'type={'text'}></input> <br/>
            <button className='resize' onClick={handleresize}>Resize and Save</button>

            <input placeholder ="default angle: 0" className="inputangle" onChange={(val)=>setangle(val.target.value)}></input><br></br>
            <button claaName="rotate" onClick={rotateImage}>Rotate</button><br></br>
              <input className="cropp" placeholder='x' onChange={(val)=>setX(val.target.value)}></input>
            <input placeholder='y' onChange={(val)=>setY(val.target.value)}></input>
            <input placeholder='width' onChange={(val)=>setwidth(val.target.value)}></input>
            <input placeholder='height' onChange={(val)=>setheight(val.target.value)}></input>
            
              <button onClick={fixCrop}>Crop Image</button> 
              <button onClick={()=>{
                setdataurl({baseurl:defaultdata.baseurl, height:defaultdata.height, width:defaultdata.width})
              }}>Reset</button>
        </div>
      </div>  
    </div>
  )
}

export default OpenImage
