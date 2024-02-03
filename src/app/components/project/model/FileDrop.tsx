import { ListGroup } from 'react-bootstrap';
import { DRAG_IMGES } from '../../../../constant/image';
import Dropzone from 'react-dropzone';
import { useState } from 'react';
import UploadErrModal from '../../modals/UploadErrModal';
import { uploadModalContent } from '../redux/upload';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../../../store';
interface Props {
    modelData: any;
    setData: Function;
    getImages: Function;
    predictionResult: Function;
    showLoader: Function;
};

const FileDrop = ({ modelData, setData, getImages, predictionResult, showLoader }: Props) => {
  const dispatch: AppDispatch = useDispatch();  

  const [errData, setErrData] = useState('');
  const [showUploadErr, setShowUploadErr] = useState(false);
  const [dataFromApi, setDataFromApi] = useState(false);

  const closeErrModal = () => {
    setErrData('');
    setShowUploadErr(false);
  };

    const openErrModal = (message: string) => {
        setErrData(message);
        setShowUploadErr(true);
      };

    const handleDrop = async (acceptedFiles: any, fileRejections: any) => {
      if (fileRejections[0]) {
        setShowUploadErr(true);
      }
      const files = acceptedFiles.map((file: any) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        )
        files.length && handleSubmit(files)
      };

      const handleSubmit = async (file: any) => {
        showLoader(true);
          dispatch(uploadModalContent({ id: modelData.id, data: file })).then((res) => {
            showLoader(false);
            if(res.payload?.length > 0) {
              setDataFromApi(true);
              setData();
              getImages(file);
              predictionResult(res.payload);
            }
          })
      };

  return (<>
            <p>
            <span className='grey'>
              You can select random images and run the test against the images
            </span>
            </p>
            <div className='file-upload-box'>
            <Dropzone
                onDrop={handleDrop}
                accept= {{
                  'image/*': ['.png','.jpeg','.jpg'],
                }}
              >
            {({ getRootProps, getInputProps }) => (
                <div style={{ display: '' }}
                {...getRootProps()} >
            <ListGroup horizontal >
                <ListGroup.Item>
                <img src={DRAG_IMGES} alt='images' /> Drag &
                drop image
                </ListGroup.Item>
                <ListGroup.Item>
                <button
                    type='button'
                    className='btn link-btn'
                >
                    <input type='file' {...getInputProps()}/>
                    Import from computer
                </button>
                </ListGroup.Item>
            </ListGroup>
            </div>
            )}
            </Dropzone>
            </div>
            <UploadErrModal
          show={showUploadErr}
          message={errData}
          closeModal={closeErrModal}
          header="Error while uploading!"
        />
        </>);
};

export default FileDrop;
