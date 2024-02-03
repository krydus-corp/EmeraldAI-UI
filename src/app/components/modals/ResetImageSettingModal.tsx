import React, { useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { AppDispatch } from '../../../store';
import { CREATE_PROJECT, CREATE_PROJECT_STEP2, PROJECT_OVERVIEW_STEP2 } from '../../../utils/routeConstants';
import { addSelectedContent } from '../annotate/redux/annotateImage';
import { getRandomContent } from '../project/redux/content';

interface Props {
  show: boolean;
  closeModal: VoidFunction;
  prevLocation: any;
  contentData?: any;
  projectId: string | undefined;
  finishAnnotationFunc: Function;
}

const ResetImageSetting = ({ show, closeModal, prevLocation, contentData, projectId, finishAnnotationFunc }: Props) => {
    const dispatch: AppDispatch = useDispatch();
    const navigate = useNavigate();

  const [randomImages, setRandomImages] = useState<any>(0);
  const [choiceValue, setChoiceValue] = useState<string>('');

    // function to set the random selection count
    const setRandomNumber = (e: React.ChangeEvent<HTMLInputElement>): void => {
        const value = e.target.value;
        setRandomImages(Number(value));
      };

      const setChoiceOption = (e: any) => {
        setChoiceValue(e.target.value);
      };

        // function to call api to fetch the random images count
  const addRandomImageCheck = () => {
      if (choiceValue === 'random') {
        addRandomImages();
      } else {
      prevLocation.state.pathname.includes(CREATE_PROJECT) &&
      navigate(`${CREATE_PROJECT_STEP2}/${projectId}`);

      !prevLocation.state.pathname.includes(CREATE_PROJECT) &&
      navigate(`${PROJECT_OVERVIEW_STEP2}/${projectId}`);
      }
      closeModal();
  };

  const addRandomImages = () => {
    dispatch(
      getRandomContent({ project_id: projectId, count: randomImages })
    ).then((res: any) => {
      const data = res.payload?.content;
      dispatch(addSelectedContent(data));
      setRandomImages(data?.length);
    });
  };

  return (
    <Modal
    dialogClassName='dialog-500'
    className='more-content-modal'
    centered
    show={show}
  >
    <div className='modal-head-section'>
      <div className='modal-head'>
        <h3>
          Add More Content{' '}
          <Button variant='secondary' className='btn-close' onClick={() => closeModal()}></Button>
        </h3>
      </div>
    </div>
    <Modal.Body>
      <div className='content-box'>
        <div className='checkbox-panel'>
          <label>
            <input type='radio' value='random' checked={choiceValue === 'random'} onChange={(e) => setChoiceOption(e)} />
            <span className='radio'>Add Un-annotated Images randomly</span>
          </label>
        </div>
        {contentData && <span className='img-count'>{contentData} images</span>}
        <div className='form-group'>
          <input type='number' className='form-control' value={randomImages} onChange={setRandomNumber}/>
          {(contentData && (randomImages > contentData || randomImages === 0)) &&
            <span className='error'>Insufficient images</span>
          }
        </div>
      </div>
      <div className='content-box'>
        <div className='checkbox-panel'>
          <label>
            <input type='radio' value='manual' checked={choiceValue === 'manual'} onChange={(e) => setChoiceOption(e)}/>
            <span className='radio'>Choose from Un-annotated images</span>
          </label>
        </div>
      </div>
      
        <div className='button-panel'>
        <button
          type='button'
          className='btn secondary-btn'
          onClick={() => finishAnnotationFunc()}>
            Finish Annotation
        </button>
        <button
          type='button'
          className='btn primary-btn'
          disabled={(choiceValue === '' || (choiceValue === 'random' && (contentData && (randomImages > contentData || randomImages === 0))))}
          onClick={() => addRandomImageCheck()}>
            Add Content
        </button>
      </div>
    </Modal.Body>
  </Modal>
  );
};

export default ResetImageSetting;
