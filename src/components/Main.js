import React from 'react'
import Popup from 'reactjs-popup';
import axios from 'axios';
import react,{ useState,Component, useEffect, useRef } from 'react'
import '../styles/main.css'
//import sharp from 'sharp';
import OpenImage from './OpenImage';
import ReactCrop from 'react-image-crop'

function Main() {

    //to load all the images list 
    useEffect(()=>{
        fetchData();
    },[]);
    const [imagelist,setData] = useState([]);
    const fetchData = async () =>{
        try{
            const images = await axios.get("http://localhost:8080/3c2f4143-b17c-4ef3-b7ad-e92e4f7644a0");
            setData(images.data);
            //console.log(images.data);
        }catch(err){
            console.log(err);
        }
    }

    //uploading new image
    const [image,setImage] = useState("")
    function addImage(){
        const formData = new FormData()
        formData.append('file',image)   
        axios.post("http://localhost:8080/3c2f4143-b17c-4ef3-b7ad-e92e4f7644a0",formData).then((res)=>{
            console.log("image uploaded successfully "+res)
            fetchData();
        })
    }


    //after clicking on the image
    const [imageid,setimageid] = useState({val:null,clicked:false,name:null})
    useEffect(()=>{
        if(imageid.clicked){
            retrivedata1();
        }
    },[imageid.val])
    const [imageData, setImageData] = useState(null);
    const [newdims,setdims] = useState({height:null,width:null})
    const retrivedata1=async()=>{
        const response = await fetch(`http://localhost:8080/3c2f4143-b17c-4ef3-b7ad-e92e4f7644a0/${imageid.val}`)
        const dataa = await response.json()
        const imgdata = `data:image/png;base64,${dataa.data}`
        setImageData(imgdata)
        OpenImage(imgdata)
        
     }


    //displaying clicked image
    const canvasRef = useRef(null)
    const canvas = canvasRef.current
    useEffect(()=>{
        if(imageid.clicked){
            displayImage();
        }
    },[displayImage])
    
    function displayImage(){

        const context = canvas.getContext('2d')
        let img = new Image()
        img.src = imageData
        img.onload = ()=>{
            console.log(img.height,img.width)
            let height = img.height
            let width = window.innerWidth
            const canvass = document.getElementById("thecanvas")
            canvass.width = width
            canvass.height = height
            console.log("hello "+imageData)
            context.drawImage(img,0,0,width,height)

        }
    }
   
    

     
    //after assigning new dimensions and clicking on resize btn
    const handleResize = () => {
        if(imageid.clicked){
            resize()
        }
      };
    const [newHeight,setHeight] = useState([])
    const [newWidth,setWidth] = useState([])
    function resize(){
        const context = canvas.getContext('2d')
        let img =  new Image()
        img.src = imageData
        img.onload = ()=>{
            console.log(img.height,img.width)
            const canvass = document.getElementById("thecanvas")
            canvass.width = newWidth
            canvass.height = newHeight
            context.drawImage(img,0,0,newWidth,newHeight)
            let newdata = canvass.toDataURL()
            setImageData(newdata)
        }
        displayImage()

        const formData = new FormData()

            const dataaa = dataURLtoFile(imageData,'heyyy.png')
            formData.append('imgUpdate',dataaa)
         
            axios.put(`http://localhost:8080/update_image/3c2f4143-b17c-4ef3-b7ad-e92e4f7644a0/${imageid.val}`,formData).then((res)=>{
                console.log("image updated successfully "+res)
                fetchData();
            })
    }
    
    function dataURLtoFile(dataurl, filename) {
        var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
        while(n--){
        u8arr[n] = bstr.charCodeAt(n);
        }
      return new File([u8arr], filename, {type:mime});
     }
   


    




  return (
    <div className='container'>
        <nav className='navbar'>
            <h1 className='title'>Image Editor</h1>
            <Popup trigger=
                { <button className='uploadbtn'>Upload Image</button>}
                position="bottom center">
                <div className='popupbox'>
                <h1 className='text'>Select an Image to upload</h1>
                <input clasName = "form" type="file" onChange={(val)=>{
                    setImage(val.target.files[0])
                    console.log(val.target.files[0])
                    // setImageData(URL.createObjectURL(val.target.files[0]))
                    }
                    }></input>

                <button className="submit" onClick={addImage}>Submit</button>
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
                    imagelist.map(image=>
                        <button className = "imagebtn" key = {image.id} onClick={()=>{
                            console.log("image clicked on this id "+image.id)
                            setimageid({val:image.id,clicked:true,name:image.name})
                            }}>{image.name}</button>
                    )
                }

                </div>
                  
                
                <h1 className='folderinfile'></h1>
            
            </div>
            <div className='imagedisplay'>
                <div className='imageview'>
                {imageData && <img className="image" styles={{width:`${newdims.width}`,height:`${newdims.height}`}}src={`data:image/png;base64,${imageData}`} alt="Output"/>}

                {/* {imageData && 
                // <img className="image" src={imageData} alt="Output"/>
               // <img id="my-img"></img>
               // <canvas ref={canvasRef} />
            } */}
            {/* <canvas id="thecanvas" width={100} height={100} ref={canvasRef}  ></canvas> */}
                </div>
                <div className='imageedit'>
                     <span style={{color:"white"}}> set Height </span><input className='resizer__input resizer__input--height' type={'text'} onChange={(val)=> setHeight(val.target.value)}></input> <br/>
                     <span style={{color:"white"}}> set Width </span><input className='resizer__input resizer__input--width'type={'text'} onChange={(val)=> setWidth(val.target.value)}></input> <br/>
                    <button className='resize' onClick={()=>{
                        setdims({height:newHeight,width:newWidth})
                    }}>Resize and Save</button>

                </div>

            </div>
        </div>
    </div>
  )
}

//folderid - 3c2f4143-b17c-4ef3-b7ad-e92e4f7644a0

export default Main
