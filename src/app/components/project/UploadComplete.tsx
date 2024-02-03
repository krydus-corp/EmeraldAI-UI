import { ProgressBar } from 'react-bootstrap';
import { ERROR_ICON } from '../../../constant/image';
import { Scrollbars } from 'react-custom-scrollbars-2';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../../../store';
import { clearUpload,uploadProjectStatus } from './redux/upload';
import { NumberLimit } from '../../../constant/number';
import { useNavigate, useParams } from 'react-router-dom';
import {
  CREATE_PROJECT,
  CREATE_PROJECT_STEP1,
  CREATE_PROJECT_STEP2,
  PROJECT_OVERVIEW_STEP1,
  PROJECT_OVERVIEW_STEP2,
} from '../../../utils/routeConstants';
import Layout from './layout/Layout';
import { createBrowserHistory } from 'history';
import { useEffect } from 'react';

const UploadComplete = () => {
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();
  const { project_id } = useParams();
  const { projectUploads, project } = useSelector((state: any) => state);

  const uploadedId = localStorage.getItem('upload');
  const jsonFileCount = projectUploads?.labels_file ? uploadedId?.split(',').length : NumberLimit.ZERO;
  const getTotalProcessed=()=> projectUploads?.total_images !== (projectUploads?.total_images_succeeded + projectUploads?.total_images_failed+ jsonFileCount);
  const history = createBrowserHistory();
  const location = history.location.pathname;
  useEffect(()=>{
  const intervalId =  setInterval(()=>{
      if(projectUploads?.total_images !== (projectUploads?.total_images_succeeded + projectUploads?.total_images_failed + jsonFileCount)){
        dispatch(uploadProjectStatus(uploadedId));
      }
    },NumberLimit.FIFTY_THOUSAND)
    return()=>{
       clearInterval(intervalId);
    }
  },[])
 
  const handleUploadMore = async () => {
    dispatch(clearUpload());
    location.includes(CREATE_PROJECT)
      ? navigate(`${CREATE_PROJECT_STEP1}/${project.id}`)
      : navigate(`${PROJECT_OVERVIEW_STEP1}/${project.id}`);
  };
  return (
    <Layout>
      <div className='steps upload-step-1'>
        <div className='page-header'>
          <div className='left-item'>
            <h3>
              Upload Images
              <span className='sm-txt'>
                Please upload images here in order to proceed with annotation
              </span>
            </h3>
          </div>
          <div className='right-item'>
          {getTotalProcessed() && <div className='loader-inline me-3'>
                <span className='loader-percentage'></span>
                <div className='loader-inner'></div>
              </div>}
            <button
              type='button'
              className='btn secondary-btn mr20'
              onClick={() => {
                handleUploadMore();
              }}
            >
              Upload More
            </button>
            <button
              type='button'
              className='btn primary-btn'
              disabled={getTotalProcessed()}
              onClick={() => {
                localStorage.removeItem('upload');
                location.includes(CREATE_PROJECT)
                  ? navigate(`${CREATE_PROJECT_STEP2}/${project_id}`)
                  : navigate(`${PROJECT_OVERVIEW_STEP2}/${project_id}`);
              }}
            >
              Start Annotation
            </button>
          </div>
        </div>
        {/* page-header */}

        <div className='drag-box-wrapper'>
          <div className='step-2'>
            {/* page-header */}

            {
              <div className='progress-bar-box'>
                <div className='progress-bar-upload'>
                  <h3>{getTotalProcessed() ? 'Uploading...':'Uploaded' }</h3>
                  <div className='counting'>
                    {(projectUploads?.total_images_succeeded - projectUploads?.total_images_duplicate) || NumberLimit.ZERO}/{projectUploads?.total_images || NumberLimit.ZERO}
                  </div>
                </div>
                <ProgressBar
                  variant='success'
                  now={
                    ((projectUploads?.total_images_succeeded + projectUploads?.total_images_failed) / projectUploads?.total_images) *
                    NumberLimit.ONE_HUNDRED
                  }
                />
              </div>
            }

            {projectUploads && (
              <div className='file-upload-wrapper'>
                <div className='upload-box-inner'>
                  <div className='upload-box'>
                    <h3>{projectUploads?.total_images || NumberLimit.ZERO}</h3>
                    <p>Total Images Selected</p>
                  </div>
                  <div className='upload-box'>
                    <h3>{(projectUploads?.total_images_succeeded - projectUploads?.total_images_duplicate) || NumberLimit.ZERO}</h3>
                    <p>Total Images Uploaded</p>
                  </div>
                  <div className='upload-box'>
                    <h3 className='fail-images'>
                      {projectUploads?.total_images_failed || NumberLimit.ZERO}
                    </h3>
                    <p>Total Images Failed to Upload</p>
                  </div>
                  <div className='upload-box'>
                    <h3 className='fail-images'>
                      {projectUploads?.total_images_duplicate || NumberLimit.ZERO}
                    </h3>
                    <p>Total Duplicate Images</p>
                  </div>
                </div>
                {projectUploads && projectUploads?.total_images_failed > 0 && (
                  <div className='upload-error-state'>
                    <p>
                      <img src={ERROR_ICON} alt='error' /> Below images failed
                      to upload
                    </p>
                    <div className='error-strip-box'>
                      <Scrollbars className='custom-scrollbar'>
                        {projectUploads?.total_images_failed > 0 &&
                          Object.keys(projectUploads?.failed).map(
                            (keyName: any, i: any) => (
                              <div className='error-strip' key={i}>
                                <p>{keyName} </p>
                                <p>{projectUploads?.failed[keyName]}</p>
                              </div>
                            )
                          )} 
                      </Scrollbars>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
          {/* step-2 */}
        </div>
      </div>
    </Layout>
  );
};

export default UploadComplete;
