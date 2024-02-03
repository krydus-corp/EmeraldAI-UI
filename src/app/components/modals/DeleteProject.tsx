import React, { useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { DELETE_ICON } from '../../../constant/image';
import * as Yup from 'yup';
import { Formik, Form, Field } from 'formik';
import { clearProjectList, deleteProject } from '../project/redux/projectList';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../../store';

interface Props {
  show: boolean;
  closeModal: any;
  setPage: any;
  setDeleted: any;
}

const DeleteSchema = Yup.object().shape({
  id: Yup.string().required('Project ID is required!'),
});

const initialValues = { id: '' };

const DeleteProject = ({ show, closeModal, setPage, setDeleted }: Props) => {
  const dispatch: AppDispatch = useDispatch();
  const [isDisabled, setIsDisabled] = useState(false);

  const handleSubmit = async (values: any) => {
    setIsDisabled(true);
    await dispatch(deleteProject(values)).then(async (res) => {
      setIsDisabled(false);
      if (res && res.payload && res.payload.message) {
        await dispatch(clearProjectList());
        setPage(0);
        setDeleted(res.payload.message);
        closeModal();
      }
    }).catch(() => { setIsDisabled(false); });
  };
  return (
    <Modal
      dialogClassName='dialog-400'
      className='delete-project-modal'
      centered
      show={show}
    >
      <Button
        variant='secondary'
        className='btn-close'
        onClick={() => {
          closeModal();
        }}
      ></Button>
      <Modal.Body>
        <div className='from-flex'>
          <Formik
            initialValues={initialValues}
            validationSchema={DeleteSchema}
            onSubmit={(values) => handleSubmit(values)}
          >
            {({ errors, touched, values }) => (
              <Form>
                <div className='row'>
                  <div className='col-md-12'>
                    <img src={DELETE_ICON} alt='delete' />
                    <h3>Delete Project?</h3>
                    <div className='sm-txt'>
                      Type the project ID in order to delete the project
                      <br />
                      Project ID: <span>{show}</span>
                    </div>
                  </div>
                  <div className='col-md-12'>
                    <div className='form-group'>
                      <div
                        className={`floating-input password-main ${values.id && 'move'
                          } `}
                      >
                        <label>Project ID</label>
                        <Field
                          className='form-control'
                          name='id'
                          autoComplete='new-password'
                        />
                        {/* <input type='text' className='form-control' name='project id' /> */}
                      </div>
                      {errors.id && touched.id ? (
                        <span className='error'>{errors.id}</span>
                      ) : null}
                    </div>
                  </div>
                  <div className='col-md-12'>
                    <div className='center-btn'>
                      <button type='submit' className='btn red-btn' disabled={isDisabled}>
                        Delete
                      </button>
                      <button
                        type='button'
                        className='btn primary-btn'
                        disabled={isDisabled}
                        onClick={() => {
                          closeModal();
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                  {isDisabled && <div className="delete-project-loader">
                    <div className='loader-outer'>
                      <div className='loader-inline'>
                        <div className='loader-inner'></div>
                      </div>
                    </div>
                    <span>Please wait, the project is being deleted.</span>
                  </div>}
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default DeleteProject;
