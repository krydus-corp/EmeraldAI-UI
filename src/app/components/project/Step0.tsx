import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { CLOCK_ICON, IMAGE_ICON, PROJECT_EMPTY } from '../../../constant/image';
import { AppDispatch } from '../../../store';
import CreateProjectModal from '../modals/CreateProjectModal';
import Layout from './layout/Layout';
import { clearContent } from './redux/content';
import { getProjectRequest } from './redux/project';

const capitalize = (s: string | any[]) => (s && s[0].toUpperCase() + s.slice(1)) || ""

const Step0 = () => {
  const [show, setShow] = useState(false);

  const closeModal = () => setShow(false);

  const { project } = useSelector((state: any) => state);

  const { project_id } = useParams();

  const dispatch: AppDispatch = useDispatch();

  const clearContentData = async () => {
    dispatch(clearContent());
  };

  useEffect(() => {
    clearContentData();
  }, [show]);

  useEffect(() => {
    if (project_id && !show) {
      dispatch(getProjectRequest({ id: project_id }));
    }
  }, [show]);

  return (
    <>
      <Layout>
        <div className='steps project-overview-wrapper'>
          <div className='page-header'>
            <div className='left-item'>
              <h3>Project Overview</h3>
            </div>
            <div className='right-item'>
              <button
                type='button'
                className='btn primary-btn edit-project-btn'
                onClick={() => {
                  setShow(true);
                }}
              >
                Edit Project Details
              </button>
            </div>
          </div>
          <div className='project-banner'>
            <img
              src={
                project.profile_100
                  ? `data:image/png;base64,${project.profile_640}`
                  : PROJECT_EMPTY
              }
              alt='banner img'
            />
          </div>
          <div className='page-header step-2'>
            <div className='left-item'>
              <h3>{project.name}</h3>
            </div>
            <div className='right-item'>
              <span>
                <img src={CLOCK_ICON} alt='clock' /> Modified{' '}
                {moment(project.updated_at).fromNow()}
              </span>
              <span>
                <img src={IMAGE_ICON} alt='image' /> {project.count} Images
              </span>
            </div>
          </div>
          <div className='project-data'>
            <div className='data-wrapper'>
              <h4>License Type:</h4>
              <p>{project.license}</p>
            </div>
            <div className='data-wrapper'>
              <h4>Annotation Type: </h4>
              <p>{ capitalize(project.annotation_type)}</p>
            </div>
            <div className='data-wrapper'>
              <h4>Project Description:</h4>
              <p>{project.description}</p>
            </div>
          </div>
        </div>

        {show && (
          <CreateProjectModal show={show} closeModal={closeModal} edit={show} />
        )}
      </Layout>
    </>
  );
};

export default Step0;
