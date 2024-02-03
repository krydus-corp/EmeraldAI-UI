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

const ConfirmModal = ({ show, closeModal, callBack, 
    headingText, bodyText, selectedImages,imagesList,dataSet,tagListData }: Props) => {
      const [tags,setTags] = useState<any>([])
      const [selectedTags, setSelectedTags] = useState<any>([])
  const handleSubmit = async () => {
    callBack(selectedTags);
    closeModal();
  };
  
  useEffect(()=>{
    if(selectedImages?.length){
    setTags(()=>{
      let filteredImages = imagesList?.filter((image:any)=>selectedImages?.includes(image.id))
      let tags = filteredImages?.map((tag:any) => {
        let tagObj = tag?.annotation[0]?.tagids.map((ele:any) =>{
          return {
            contentId:tag.id,
            tagId:ele
          }
        })
        return tagObj
      })
      let flatTags = tags.flat(Infinity)
      const tagDetails = flatTags.map((tag:any)=>{
        let tagDetail = tagListData.find((tagId:any)=>tag.tagId===tagId.id)
        let data={...tagDetail,contentId:tag.contentId}
        return data;
      })

      const unique = tagDetails.map((item:any) => item.id).filter((value:any, index:number, self:any) => self.indexOf(value) === index);
      const data = unique.map((item:any)=>tagDetails.find((val:any)=>val.id===item))
      return data
    })
  }

  },[selectedImages])

  useEffect(()=>{
    setSelectedTags([])
  },[closeModal])

  const handleCheckBox = (e:any,tag:any) => {  
    if (e.target.checked) {
      setSelectedTags((prev:any)=>[...prev,{tagId:tag.id,contentId:tag.contentId}]);
      //setIsAllImagesSelected(true);
    } else {
      setSelectedTags((prev:any)=>{
        const tagdata = prev?.filter((eled:any) => eled.tagId === tag.id && eled.contentId !== tag.contentId)
        return tagdata;
      });
      // setSelectedImages([]);
      // setIsAllImagesSelected(false);
    }
  };
  return (
    <Modal
      dialogClassName='dialog-600'
      className='delete-project-modal'
      centered
      show={show ? true : false}
    >
      <div className="main-head">
      <h3>{headingText}</h3>
      <Button
        variant='secondary'
        className='btn-close'
        onClick={() => {
          closeModal();
        }}
      ></Button>
      </div>
      <Modal.Body>
        <div className="modal-delete-wrapper">
            <div className='sm-txt'>
              <div className='sm-txt-head'>{bodyText}</div>
              <hr />
              {
              selectedImages?.length &&  <div className='tag-scroll checkbox-scroll'>{
              tags.map((tag:any,index:number)=>(
                <div className='tag-box' key={`${tag}-${index}`}>
                  <div className='checkbox-panel'>
                  <input
                      type='checkbox'
                      style={{top:"10px"}}
                      checked={selectedTags?.find((ele:any)=>ele.tagId===tag.tagId && ele.contentId===tag.contentId)}
                      onClick={(e) => handleCheckBox(e,tag)}
                    />
                    <span className='checkbox' ></span>
                    </div>
                  <div className='tag grey'>
                    {tag?.name ? tag.name : '-'}
                  </div>
                </div>
              ))}
            </div>
            }
          <hr/>
          </div>
          <div className="text-footer">
            <div className="left-text"></div>
            <div className="right-text">
              <ButtonComponent
                type='button'
                styling='btn link-btn text-white btn-text'
                action={() => {
                  closeModal();
                }}
                name='Cancel' />
            <ButtonComponent
                  type='submit'
                  styling='btn red-btn btn-height'
                  action={() => {
                    handleSubmit();
                  }}
                  //disabled={selectedTags.length===0}
                  name='Delete' />
            </div>
          </div>

        </div>
      </Modal.Body>
    </Modal>
  );
};

export default ConfirmModal;
