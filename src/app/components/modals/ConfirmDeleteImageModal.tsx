import { useEffect, useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { DELETE_ICON } from '../../../constant/image';
import ButtonComponent from '../common/ButtonComponent';
import DisplayTagName from '../../components/project/DisplayTagName';

interface Props {
  show: boolean;
  closeModal: Function;
  callBack: Function;
  headingText: string;
  bodyText: string;
  selectedImages?: any
  imagesList?:any
  dataSet?:boolean
  tagListData?:any
}

const ConfirmDeleteImageModal = ({ show, closeModal, callBack, 
    headingText, bodyText, selectedImages,imagesList,dataSet,tagListData }: Props) => {
      const [tags,setTags] = useState<any>([])
  const handleSubmit = async () => {
    callBack(show);
    closeModal();
  };
  
  useEffect(()=>{
    if(selectedImages?.length){
    setTags(()=>{
      let filteredImages = imagesList?.filter((image:any)=>selectedImages?.includes(image.id))
      let tags = filteredImages?.map((tag:any) => tag?.annotation[0]?.tagids)
      let flatTags = tags.flat(Infinity)
      let tagDetails = flatTags.map((tag:any)=>{
        let tagDetail = tagListData.find((tagId:any)=>tag===tagId.id)
        return tagDetail;
      })
      return tagDetails
    })
  }

  },[selectedImages])
  
  
  return (
    <Modal
      dialogClassName='dialog-400'
      className='delete-project-modal'
      centered
      show={show ? true : false}
      style={{display:"flex",alignItems:"center",justifyContent:"center"}}
    >
      <div className="main-head">
      <img src={DELETE_ICON} alt='delete' style={{marginTop:"15px"}} />
      <h3 style={{textAlign:"center"}}>{headingText}</h3>
      <Button
        variant='secondary'
        className='btn-close'
        onClick={() => {
          closeModal();
        }}
      ></Button>
      </div>
      <Modal.Body className='pt-0'>
        <div className="modal-delete-wrapper">
            <div className='sm-txt'>
              <div className='sm-txt-head' style={{textAlign:"center"}}>{bodyText}</div>
              {/* {
              selectedImages?.length &&  <div className='tag-scroll'>{
              tags.map((tag:any,index:number)=>(
                <div className='tag-box' key={`${tag}-${index}`}>
                  <div className='tag grey'>
                    {tag?.name ? tag.name : '-'}
                  </div>
                </div>
              ))}
            </div>
            } */}
          </div>
          <div className="text-footer">
            {/* <div className="left-text">*All classes will be deleted from the images</div> */}
            <div className="center-btn">
            <ButtonComponent
                  type='submit'
                  styling='btn red-btn btn-height'
                  action={() => {
                    handleSubmit();
                  }}
                  name='Delete' />
              <ButtonComponent
                type='button'
                styling='btn primary-btn'
                action={() => {
                  closeModal();
                }}
                name='Cancel' />
            </div>
          </div>

        </div>
      </Modal.Body>
    </Modal>
  );
};

export default ConfirmDeleteImageModal;
