import React, {useState, useEffect, useRef} from 'react';
import { Button, Modal } from 'react-bootstrap';
import 'react-dropdown/style.css';
import { NumberLimit } from '../../../constant/number';
import BarChart from '../charts/BarChart';
import { ChartBackgroundColor } from '../charts/CommonChart';
import Carousel from "react-multi-carousel";
import _ from 'lodash';
import { useSelector } from 'react-redux';


interface Props {
  show: boolean;
  imagesData: any;
  closeModal: Function;
  resultedData: any;
}

const responsive = {
  desktop: {
    breakpoint: { max: 3000, min: 1280 },
    items: 6,
  },
  smallScreen: {
    breakpoint: { max: 1279, min: 851 },
    items: 3,
  },
  tablet: {
    breakpoint: { max: 850, min: 601 },
    items: 2,
  },
  mobile: {
    breakpoint: { max: 600, min: 0 },
    items: 1,
  },
};

const FileDropModal = ({ show, imagesData, closeModal, resultedData}: Props) => {
  const labelText = [];
  const dataImageCount = [];
  const [index, setIndex] = useState(0);
  const [colorData, setColorData] = useState<any>();
  const { project } = useSelector((state: any) => state);
  const scaleRef = useRef<any>()


  useEffect(() => {
    setColorData(backgroundColorData);
    // drawing boxes for file drop
    const image_element = new Image();
    image_element.src = `${imagesData[index]?.preview}`
    image_element.onload = function () {
      let element =document.getElementById('newImage')
      let height = image_element.height
      let width = image_element.width
        let scaling = 1;
        while(height > scaleRef?.current?.offsetHeight || width > scaleRef?.current?.offsetWidth){
          scaling -= 0.1
          height = image_element.height * scaling
          width = image_element.width * scaling
        }
        if(scaling < 0.1){
          scaling=0.05
        }
        if(element){
          element.style.backgroundImage = `url(${imagesData[index].preview})`
          element.style.width = `${image_element.width}px`
          element.style.height = `${image_element.height}px`
          element.style.scale = `${scaling}`
        }
      if(resultedData[index]?.predictions && project.annotation_type === "bounding_box"){
        resultedData[index].predictions.forEach((predict:any) => {
          let obj  ={
            left:predict?.bounding_boxes?.xmin,
            top:predict?.bounding_boxes?.ymin,
            height:predict?.bounding_boxes?.ymax - predict?.bounding_boxes?.ymin,
            width:predict?.bounding_boxes?.xmax - predict?.bounding_boxes?.xmin,
          }
            let box = document.createElement('div')
            let text = document.createElement('div')

            text.innerText =predict?.class_name
            text.className = "text_box_file"
            box.className = "append"
            box.style.left =obj.left+"px";
            box.style.top =obj.top+"px";
            box.style.height =obj.height+"px"
            box.style.width = obj.width+"px"
            box.appendChild(text)
            element && element.appendChild(box) 
        });
    }
  }
    
  }, [index,resultedData,imagesData[index]]);

  const sortedPredictions = resultedData[index]?.predictions && _.sortBy(resultedData[index]?.predictions,'confidence').reverse();  

   if (sortedPredictions) {    
    for (const key in sortedPredictions) {
        if (sortedPredictions[key].confidence) {
            labelText.push(sortedPredictions[key].class_name);
            dataImageCount.push(Math.floor(sortedPredictions[key].confidence * (NumberLimit.ONE_HUNDRED)));
        }
    }   
   }
  
  const handleClose = () => {
    closeModal();
  };

  const backgroundColorData = labelText.map(() => {
    const random = Math.floor(Math.random() * ChartBackgroundColor.length);
    return ChartBackgroundColor[random];
  });

  const thumbnailWrapper = (ind:any) =>{
    if(ind !== index){
      const removePredict = document.querySelectorAll('.append')
      removePredict.forEach((removeElement:any) => {
        removeElement.remove()
      });
    }
    setIndex(ind)
  }

  return (
    <>
      <Modal
        className='file-drop-modal'
        show={show}
        centered
        backdrop="static"
      >
        <div className='modal-head-section'>
          <div className='modal-head'>
            <h3>
              File Drop Prediction Results
              <Button
                variant='secondary'
                className='btn-close'
                onClick={() => {
                  handleClose();
                }}
              ></Button>
            </h3>
          </div>
        </div>
        <Modal.Body>
          <div className='file-drop-img-body'>
            <div className='img-gallery'>
              <div ref={scaleRef}>
                <div className='upload-img' id="filedrop-scale">
                  <div className={`img-box`} id="newImage">
                  </div>
                </div>
              </div>
              <div className='thumbnail-wrapper'>
                <Carousel
                  arrows={true}
                  responsive={responsive}
                  ssr={true}
                  //  infinite= {true}
                  containerClass="carousel-container"
                  draggable={false}
                  itemClass="image-item">
                  {imagesData?.map((image:any,ind: number)=>(<div key={`${image.size}-${ind}`} className={`thumbnail-cards ${ind===index && 'active'}`} onClick={() => thumbnailWrapper(ind)}><img src={image.preview} alt="thumbnails" /></div>))}
            
              </Carousel>
               </div>
            </div>
           <div className="chart-box">
              <BarChart labelText={labelText} backgroundColorData={ChartBackgroundColor} 
             dataImageCount={dataImageCount} valueText='Confidence' height={`${NumberLimit.TWO_HUNDRED_FIFTY}px`} />
           </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default FileDropModal;
