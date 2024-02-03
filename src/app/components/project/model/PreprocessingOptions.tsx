import { Modal, Button } from 'react-bootstrap';
import { PREPROCESSING_OPTION } from '../../../../constant/static';
import { STRETCH_TO, FILL_CENTER, FIT_WITHIN, STATIC_CROP, INFO_ICON} from '../../../../constant/image';

interface Props {
    show: boolean;
    closeModal: Function;
    setPreprocessiongFilter: Function;
    setFilterType: Function;
}

const PreprocessingOptions = ({ show, closeModal, setPreprocessiongFilter,
    setFilterType }: Props) => {
   
   return <>
        {/* Preprocessing Options modal*/}
        <Modal
            dialogClassName='dialog-544'
            className='preprocessing-modal'
            centered
            show={show ? true : false}
        >
            
            <div className='modal-header-section'>
            <div className='modal-head'>
                <h3>
                Preprocessing Options{' '}
                <Button variant='secondary' className='btn-close' onClick={() => {closeModal();}}></Button>
                </h3>
            </div>
            </div>
            <Modal.Body>
            <p>
                Preprocessing can decrease training time and increase inference
                speed.
            </p>
            <div className='upload-gallery'>
                <div className='img-container'>
                <div className='img-wrapper' onClick={() => {
                        setFilterType(PREPROCESSING_OPTION.resize);
                        setPreprocessiongFilter(true);
                    }}>
                    <div className='img-box'>
                    <img
                        src={STRETCH_TO}
                        alt='gallery images'
                    />
                    </div>
                    <div className='tooltip-info'><img src={INFO_ICON} alt="info" />
                    Resize images based on set mode
</div>
                    <div className='img-caption'>Resize</div>
                </div>
                <div className='img-wrapper d-none' onClick={() => {
                        setFilterType(PREPROCESSING_OPTION.fill);
                        setPreprocessiongFilter(true);
                    }}>
                    <div className='img-box'>
                    <img
                        src={FILL_CENTER}
                        alt='gallery images'
                    />
                    </div>
                    <div className='img-caption'>Fill with Center crop</div>
                </div>
                <div className='img-wrapper d-none' onClick={() => {
                        setFilterType(PREPROCESSING_OPTION.fit);
                        setPreprocessiongFilter(true);
                    }}>
                    <div className='img-box'>
                    <img
                        src={FIT_WITHIN}
                        alt='gallery images'
                    />
                    </div>
                    <div className='img-caption'>Fit Within</div>
                </div>
                <div className='img-wrapper' onClick={() => {
                        setFilterType(PREPROCESSING_OPTION.static);
                        setPreprocessiongFilter(true);
                    }}>
                    <div className='img-box'>
                    <img
                        src={STATIC_CROP}
                        alt='gallery images'
                    />
                    </div>
                    <div className='tooltip-info'><img src={INFO_ICON} alt="info" /> 	
                    Crop images
</div>
                    <div className='img-caption'>Static Crop</div>
                </div>
                </div>
            </div>
            </Modal.Body>
            <Modal.Footer className='modal-custom-footer'>
            <button className='btn white-btn' onClick={() => {closeModal();}}>Cancel</button>
            </Modal.Footer>
        </Modal>
    </>;
};
export default PreprocessingOptions;
