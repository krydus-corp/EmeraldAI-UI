import { Field, Form, Formik } from 'formik';
import React, { useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import Dropzone from 'react-dropzone';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import {
  ANNOTATION_REQUIRED,
  PROJECT_NAME_REQUIRED,
  UNSUPPORTED_IMG_FORMAT,
} from '../../../constant/static';
import { AppDispatch } from '../../../store';
import { CREATE_PROJECT_STEP1 } from '../../../utils/routeConstants';
import {
  createProjectRequest,
  updateProjectRequest,
  uploadProjectProfile,
} from '../project/redux/project';
import UploadErrModal from './UploadErrModal';
import { clearUpload } from '../project/redux/upload';

import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';
import TextareaAutosize from 'react-textarea-autosize';
import { NumberLimit } from '../../../constant/number';
interface Props {
  show: boolean;
  closeModal: any;
  edit?: boolean;
  closeWithoutSave?:any
}

const ProjectSchema = Yup.object().shape({
  name: Yup.string().trim().required(PROJECT_NAME_REQUIRED).min(NumberLimit.THREE),
  description: Yup.string(),
  license: Yup.string(),
  annotation_type: Yup.string().required(ANNOTATION_REQUIRED),
});

const CreateProjectModal = ({ show, closeModal, edit ,closeWithoutSave}: Props) => {
  const annotationOptions = [
    { value: 'classification', label: 'Classification' },
    { value: 'bounding_box', label: 'Bounding Box' },
  ];

  const project = useSelector((state: any) => state.project);
  const navigate = useNavigate();

  const [profileImage, setProfileImage]: any[] = useState([]);
  const [showUploadErr, setShowUploadErr] = useState(false);
  const [disableCreateBtn,setDisableCreateBtn]=useState<boolean>(false);

  const closeErrModal = () => {
    setShowUploadErr(false);
  };

  const dispatch: AppDispatch = useDispatch();

  const initialValues = {
    name: edit ? String(project.name) : '',
    description: edit ? String(project.description) : '',
    license: edit ? String(project.license) : '',
    annotation_type: edit ? String(project.annotation_type) : '',
  };

  const handleSubmit = async (value: any) => {
    localStorage.removeItem('upload');
    if (edit) {
      dispatch(
        updateProjectRequest({
          id: project.id,
          data: value,
          page: window.location.href,
        })
      ).then((res: any) => {
        if (res.payload.id && profileImage && profileImage[0]) {
          dispatch(
            uploadProjectProfile({ id: res.payload.id, data: profileImage })
          ).then((resImg: any) => {
            closeModal();
          });
        } else if (res.payload.id && (!profileImage || !profileImage[0])) {
          closeModal();
        }
      });
    } else {
      setDisableCreateBtn(true);
      dispatch(clearUpload());
      dispatch(createProjectRequest(value)).then((res: any) => {
        setDisableCreateBtn(false);
        if (res.payload.id && profileImage && profileImage[0]) {
          dispatch(
            uploadProjectProfile({ id: res.payload.id, data: profileImage })
          ).then((resImg: any) => {
            navigate(`${CREATE_PROJECT_STEP1}/${res.payload.id}`);
          });
        } else if (res.payload.id && (!profileImage || !profileImage[0])) {
          navigate(`${CREATE_PROJECT_STEP1}/${res.payload.id}`);
        }
      }).catch(()=> {setDisableCreateBtn(false);} );
    }
  };

  const handleDrop = (acceptedFiles: any, fileRejections: any) => {
    if (fileRejections[0]) {
      setShowUploadErr(true);
    }
    setProfileImage(() =>
      acceptedFiles.map((file: any) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      )
    );
  };

  const handleClose = () => {
    setProfileImage([]);
    closeWithoutSave()
    // closeModal();
  };

  return (
    <>
      <Modal
        className='create-project-modal'
        show={show}
        onHide={() => {
          handleClose();
        }}
      >
        <div className='modal-head-section'>
          <div className='modal-head'>
            <h3>
              {edit ? 'Update Project' : 'Create New Project'}
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
          <div className='from-flex create-project-form'>
            <Formik
              initialValues={initialValues}
              validationSchema={ProjectSchema}
              onSubmit={(values) => handleSubmit(values)}
            >
              {({ errors, touched, values, setFieldValue }) => (
                <Form>
                  <div className='row'>
                    <div className='col-md-12'>
                      <div className='upload-wrapper'>
                        {(!edit || !project || !project.profile_640) &&
                          (!profileImage || !profileImage[0]) && (
                            <Dropzone
                              onDrop={handleDrop}
                              accept= {{
                                'image/*': ['.json','.png','.jpeg','.jpg','.tiff','.tif'],
                              }}
                            >
                              {({ getRootProps, getInputProps }) => (
                                <div
                                  className='upload-step-1'
                                  {...getRootProps()}
                                >
                                  <span className='empty-img'></span>
                                  <div className='big-head'>
                                    Upload Cover Photo
                                  </div>
                                  <div className='sm-data'>
                                    Drag and drop image or
                                    <span>
                                      <input type='file' {...getInputProps()} />
                                      browse
                                    </span>
                                  </div>
                                </div>
                              )}
                            </Dropzone>
                          )}
                        {((edit && project && project.profile_640) ||
                          (profileImage && profileImage[0])) && (
                          <div className='upload-step-2'>
                            {project && project.profile_640 ? (
                              <Dropzone
                                onDrop={handleDrop}
                                accept= {{
                                  'image/*': ['.json','.png','.jpeg','.jpg','.tiff','.tif'],
                                }}
                              >
                                {({ getRootProps, getInputProps }) => (
                                  <button
                                    type='button'
                                    className='btn primary-btn'
                                    {...getRootProps()}
                                  >
                                    <input type='file' {...getInputProps()} />{' '}
                                    Update Cover
                                  </button>
                                )}
                              </Dropzone>
                            ) : (
                              <button
                                type='button'
                                className='btn primary-btn'
                                onClick={() => {
                                  setProfileImage([]);
                                }}
                              >
                                Remove Cover
                              </button>
                            )}
                            <div className='upload-img'>
                              <img
                                src={
                                  profileImage && profileImage[0]
                                    ? profileImage[0].preview
                                    : `data:image/png;base64,${project.profile_640}`
                                }
                                alt='upload-img'
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className='col-md-12'>
                      <div className='form-group'>
                        <div
                          className={`floating-input ${values.name && 'move'}`}
                        >
                          <label>Project Name</label>
                          <Field
                            className='form-control'
                            type='text'
                            name='name'
                            value={values.name.trim().length === NumberLimit.ZERO ? values.name.trim() : values.name}
                          />
                        </div>
                        {errors.name && touched.name ? (
                          <span className='error'>{errors.name}</span>
                        ) : null}
                      </div>
                    </div>
                    <div className='col-md-6'>
                      <div className='form-group'>
                        <div
                          className={`floating-input ${
                            values.license && 'move'
                          }`}
                        >
                          <label>License Type</label>
                          <Field
                            className='form-control'
                            type='text'
                            name='license'
                            maxLength='30'
                          />
                        </div>
                        {errors.license && touched.license ? (
                          <span className='error'>{errors.license}</span>
                        ) : null}
                      </div>
                    </div>
                    <div className='col-md-6'>
                      <div className='form-group'>
                        <div
                          className={`floating-input ${
                            values.annotation_type && 'move'
                          }`}
                          tabIndex={0}
                        >
                          <label>Annotation Type</label>
                          <Dropdown
                            value={values.annotation_type}
                            className='form-control'
                            onChange={(e) =>
                              setFieldValue('annotation_type', e.value)
                            }
                            options={annotationOptions}
                            disabled={edit}
                          />
                        </div>
                        {errors.annotation_type && touched.annotation_type ? (
                          <span className='error'>
                            {errors.annotation_type}
                          </span>
                        ) : null}
                      </div>
                    </div>
                    <div className='col-md-12'>
                      <div className='form-group'>
                        <div
                          className={`floating-input ${
                            values.description && 'move'
                          } discription-box`}
                          // className='floating-input move '
                        >
                          <label>Project Description</label>
                          <TextareaAutosize
                            className='form-control'
                            onChange={(e) => {
                              setFieldValue('description', e.target.value);
                            }}
                            name='description'
                            value={values.description.trim().length === NumberLimit.ZERO ? values.description.trim() : values.description}
                          />
                          <span className='char-count'>320</span>
                        </div>
                      </div>
                    </div>
                    <div className='col-md-12'>
                      <div className='form-group'>
                        <div className='button-panel'>
                          <button
                            type='button'
                            className='btn secondary-btn'
                            onClick={() => {
                              handleClose();
                            }}
                          >
                            Cancel
                          </button>
                          <button type='submit' className='btn primary-btn' disabled={disableCreateBtn} >
                            {edit ? 'Update Project' : 'Create Project'}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </Modal.Body>
      </Modal>
      <UploadErrModal
        show={showUploadErr}
        message={UNSUPPORTED_IMG_FORMAT}
        closeModal={closeErrModal}
        header="Error while uploading!"
      />
    </>
  );
};

export default CreateProjectModal;
