import React from 'react'

import Popup from 'reactjs-popup';
import axios from 'axios';
import react,{ useState,Component, useEffect, useRef } from 'react'
import '../styles/main.css'


function MainApp() {
    const [imageList,setNewImage] = useState([])
    const [defaultImageList,setdefaultImageList] = useState([])
    const [imageListStack,setImageListStack] = useState([])
    const [temp,settemp] = useState(null)
    const [imageid,setimageid] = useState({file:null,i:0,clicked:false,name:null})
    const [base64,setdataurl] = useState({baseurl:null,height:0,width:0})
    const [currStack,setCurrStack] = useState(null)
    const [stackList,setstackList] = useState([])
    const [RepdoStackList,setRedoStackList] = useState([])
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
            insertToStack(imageid.i,newHeight,newWidth,newdata)
        }
    }

    function insertToStack(index,h,w,newdata){
        const StackElement = stackList.map((element,ind)=>{
            if(ind==index){
                var currelement = element
                currelement = [...currelement,newdata]
                return  currelement
            }
            else{
                return element
            }
        })
        setstackList(StackElement)
    }


    function OpenImage(index){
        const reader = new FileReader()
        reader.readAsDataURL(imageList[index])
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
            const angle  = document.getElementById('inputangle').value
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


    const [sX, setX] = useState(0);
    const [sY, setY] = useState(0);
    const [widthh, setwidth] = useState(0);
    const [heightt, setheight] = useState(0);
   


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
                //setdataurl(newdata)
                const link = document.createElement("a");
                setstackList(stackList)
                link.download = "image.png";
                link.href = canvas.toDataURL();
                link.click();

            };
            image.src = base64
        
        }
        
    }

    function insertToRedoStack(index,h,w,data){
        const StackElement = RepdoStackList.map((element,ind)=>{
            if(ind==imageid.index){
                var currelement = element
                currelement = [...currelement,data]
                return  currelement
            }
            else{
                
                return element
            }
        })
        setRedoStackList(StackElement)

    }
    const [toggle,settoggle] = useState(false)
    useEffect(()=>{
        loadData()
    },[toggle])
    
    function UndoOperation(){
        var currStack = stackList[imageid.i]
        var tempStack = currStack.pop()
        insertToRedoStack(imageid.i,tempStack)
        var currimg = currStack[-1]
        const img = new Image()
        img.src = currimg
        console.log(currStack.length,stackList)
        img.onload = function(){
            setdataurl({baseurl:currimg,height:img.height,width:img.width})
        }
        settoggle(true)
    }

    function loadData(){
        const baseurl = base64.baseurl
        const h = base64.height
        const w = base64.width
        const img = new Image()
        const canvas = document.getElementById('thecanvas')
        const ctx = canvas.getContext('2d')
        img.onload = function(){
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            canvas.width = w
            canvas.height = h
            ctx.drawImage(img,0,0)
            console.log("heyyyyy")
        }
        img.src = baseurl
        settoggle(false)
    }
    
    
    

  return (
    <div className='container'>
        <nav className='navbar'>
            <h1 className='title'>Image Editor</h1>
            <button className='Undobtn' onClick={UndoOperation}>Undo</button> 
            <Popup trigger=
                { <button className='uploadbtn'>Upload Image</button>}
                position="bottom center">
                <div className='popupbox'>
                <h1 className='text'>Select an Image to upload</h1>
                <input clasName = "form" type="file" onChange={(val)=>{settemp(val.target.files[0])}}></input>
                {temp && <button className="submit" onClick={()=>{
                    setNewImage(imageList =>[...imageList,temp])
                    setstackList(stackList=>[...stackList,[]])
                    setRedoStackList(RepdoStackList=>[...RepdoStackList,[]])
                    setdefaultImageList(defaultImageList=>[...defaultImageList,temp])
                    console.log(stackList)
                }}>Submit</button>}
                </div> 
            </Popup>
           
        </nav>
         <div className='maincontainer'>
            <div className='imagecontainer'>
                <div className='headerfile'>
                    <h1 className='imagecontainerheader'>Images List</h1>
                </div>
                <div className='allimages'>
                {
                    imageList.map((image,index)=>
                        <button className = "imagebtn" key = {image.id} onClick={()=>{
                            console.log("image clicked on this id "+image.id)
                            setimageid({file:image,i:index,clicked:true,name:image.name})

                            OpenImage(index)
                            }}>{image.name}</button>
                    )
                }

                </div>
                <h1 className='folderinfile'></h1>
            
            </div>
              <div className='imagedisplay'>
                <div className='imageview'>
                
                    <canvas id="thecanvas" width={2000} height={1100}       
                       ></canvas>

                    {/* //{base64 && <img src={base64}></img>} */}
                </div>
                <div className='imageedit'>
                    <span style={{color:"white"}}> set Height </span><input placeholder = {defaultdata.height} id='resize-height' type={'text'} ></input> <br/>
                    <span style={{color:"white"}}> set Width </span><input placeholder = {defaultdata.width} id='resize-width'type={'text'}></input> <br/>
                    <button className='resize' onClick={handleresize}>Resize and Save</button>

                    <input placeholder ="default angle: 0" id="inputangle"></input><br></br>
                    <button id="rotate" onClick={rotateImage}>Rotate</button><br></br>
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
    </div>
  )
}
export default MainApp