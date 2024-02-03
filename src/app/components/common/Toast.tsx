import React, { useEffect } from 'react';
import { connect,useDispatch } from 'react-redux';
import { hideToast } from './redux/toast';
import { TOAST_DELAY } from '../../../constant/number';
import { useSnackbar } from 'notistack';
import { AppDispatch } from '../../../store';

interface Props {
  toast: any;
}

const ToastBody = ({ toast }: Props) => {
  const dispatch: AppDispatch = useDispatch();

  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  useEffect(() => {
    if (toast.message) {
      enqueueSnackbar(toast.message, {
        variant: toast.type,
        action: (key) => (
          <i
            className='icon-cross'
            onClick={() => {
              closeSnackbar(key);
            }}
          ></i>
        ),
      });
      setTimeout(() => dispatch(hideToast()), TOAST_DELAY);
    }
  }, [toast.message]);

  return <></>;
};

const mapStateToProps = (state: { appToast: any }) => ({
  toast: state.appToast,
});



export const ToastWrapper = connect(
  mapStateToProps,
)(ToastBody);

