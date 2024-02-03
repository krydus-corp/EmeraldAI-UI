import React, { useEffect, useRef, useState } from 'react';
import { Col, OverlayTrigger, Row, Tooltip } from 'react-bootstrap';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import 'react-dropdown/style.css';
import {
  PLUS_CIRCLE_ICON,
  BIG_CLOCK,
  SMALL_CIRCLE,
  TICK_ICON_BIG,
  ICON_SETTING,
  CROSS_WHITE,
} from '../../../constant/image';
import Layout from './layout/Layout';
import * as yup from 'yup';
import { NumberLimit } from '../../../constant/number';
import {
  AUGMENTATION_OPTION,
  AUTH_TOKEN,
  HTTPS_REPLACE,
  MODEL_ACTION,
  MODEL_IMAGE_FILTER,
  MODEL_STATUS,
  PREPROCESSING_OPTION,
} from '../../../constant/static';
import { SERVER_ALERT, SUCCESS_MESSAGE } from '../../../constant/validations';
import {
  createNewModel,
  deleteModelData,
  getModelData,
  getModelDetail,
  startModelTraining,
  updateModelData,
} from '../../../service/model';
import {
  changeDateFormat,
  displayIntensity,
  displayNumberValue,
} from '../../../utils/common';
import Loader from '../common/Loader';
import { showToast } from '../common/redux/toast';
import { useNavigate, useParams } from 'react-router-dom';
import {
  CREATE_PROJECT,
  CREATE_PROJECT_STEP1,
  CREATE_PROJECT_STEP4,
  MODAL_TRANINING_COMPARE,
  PROJECT_OVERVIEW_STEP1,
  PROJECT_OVERVIEW_STEP4,
} from '../../../utils/routeConstants';
import { createBrowserHistory } from 'history';
import ShortUniqueId from 'short-unique-id';
import ModelName from './model/ModelName';
import ConfirmModal from '../modals/ConfirmModal';
import PreprocessingOptions from './model/PreprocessingOptions';
import PreprocessingFilter from './model/PreprocessingFilter';
import AugmentationOptions from './model/AugmentationOptions';
import AugmentationFilter from './model/AugmentationFilter';
import PreprocessingFilterList from './model/PreprocessingFilterList';
import AugmentationFilterList from './model/AugmentationFilterList';
import ViewAllDatasetimages from './ViewAllDatasetimages';
import DatasetImageListing from './DatasetImageListing';
import ButtonComponent from '../common/ButtonComponent';
import Split from '../modals/Split';
import { getAnnotateStatistics } from './redux/statistics';
import { AppDispatch } from '../../../store';
import { clearUpload } from './redux/upload';
import ModelDetail from './model/ModelDetail';
import TrainTestSplit from './model/TrainTestSplit';
import { getCurrentDataSet } from './redux/dataset';
import { clearContent } from './redux/content';
import DeleteEndpoint from '../modals/DeleteEndpointModal';
import Dropdown from 'react-bootstrap/Dropdown';
import UploadErrModal from '../modals/UploadErrModal';
import ConfirmParameterModal from '../modals/ConfirmParameterModal';

const uid = new ShortUniqueId({ length: NumberLimit.FOUR });
let socketRef: any={};

const ModelFun = {
  isStepOne: (modelStep: number) => {
    return modelStep === NumberLimit.ONE;
  },
  isStepTwo: (modelStep: number) => {
    return modelStep === NumberLimit.TWO;
  },
  isStepThree: (modelStep: number) => {
    return modelStep === NumberLimit.THREE;
  },
  isStepFour: (modelStep: number) => {
    return modelStep === NumberLimit.FOUR;
  },
  isStepFive: (modelStep: number) => {
    return modelStep === NumberLimit.FIVE;
  },
  isModelView: (modelAction = '') => {
    return modelAction === MODEL_ACTION.view;
  },
  isStepComplete: (modelStep: number, step: number) => {
    return modelStep > step;
  },
  isCurrentStep: (modelStep: number, step: number) => {
    return modelStep === step;
  },
};

const Step4 = () => {
  const dispatch: AppDispatch = useDispatch();
  const parm = new URLSearchParams(window.location.search);
  const currentStep = parm.get('mstep')
    ? Number(parm.get('mstep'))
    : NumberLimit.ONE;
  const currentAction = parm.get('action')
    ? parm.get('action')
    : MODEL_ACTION.create;
  const comid = parm.get('comid') ? parm.get('comid') : '';
  const modelId = parm.get('mid') ? parm.get('mid') : '';
  const { project, dataSet, statistics, content } = useSelector((state: any) => state);
  const [modelStep, setModelStep] = useState(currentStep);
  const [modelAction, setModelAction] = useState(currentAction || '');
  const [modelList, setModelList] = useState<any>([]);
  const [modelData, setModelData] = useState(Object);
  const [isEditName, setIsEditName] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [confirDelete, setConfrimDelete] = useState(false);
  const [openPreprocessing, setOpenPreprocessiong] = useState(false);
  const [preprocessingFilter, setPreprocessiongFilter] = useState(false);
  const [openAugmentation, setOpenAugmentation] = useState(false);
  const [augmentationFilter, setAugmentationFilter] = useState(false);
  const [filterType, setFilterType] = useState('');
  const [isUpdate, setIsUpdate] = useState(false);
  const [flipHorizontal, setFlipHorizontal] = useState(false);
  const [flipVertical, setFlipVertical] = useState(false);
  const [degree, setDegree] = useState(NumberLimit.ZERO);
  const [noiseIntensity, setNoiseIntensity] = useState(NumberLimit.ZERO);
  const [jitterIntensity, setJitterIntensity] = useState(NumberLimit.ZERO);
  const [gaussianIntensity, setGaussianIntensity] = useState(NumberLimit.ZERO);
  const [classificationDrop, setClassificationDrop] = useState<boolean>(false)
  const [compareId, setCompareId] = useState<Array<string>>(
    comid ? comid.split(',') : []
  );
  const [payload,setPayloadData] = useState<any>({})
  const [showParameterAlert,setShowParameterAlert] = useState<boolean>(false)
  const [isInsight, setIsInsight] = useState(false);
  const [modelDataset, setModelDataset] = useState<any>(null);
  const [isSwitchData, setIsDataSwitch] = useState(false);
  const [confirmParameter, setShowConfirmParameter] = useState<boolean>(false)
  const [hyperparameters, setHyperParameters] = useState<any>({
    max_runtime_seconds:"",
    maximum_retry_attempts:"",
    max_number_training_jobs:"",
    instance_type:"",
    epochs:"",
    lr_scheduler_step:"",
    lr_scheduler_factor:"",
    overlap_threshold:"",
    nms_threshold:"",
    learning_rate:"",
    weight_decay:"",
    num_layers:""
  })  

  const schema =yup.object().shape({
    max_runtime_seconds: yup.lazy((value) =>isNaN(value) || value==="" ? yup.string().transform((value) => (isNaN(value) || value === null || value === undefined) ? "" : value) :yup.number().integer().positive().min(0).max(86400)),
    maximum_retry_attempts: yup.lazy((value) =>isNaN(value) || value==="" ? yup.string().transform((value) => (isNaN(value) || value === null || value === undefined) ? "" : value) :yup.number().integer().positive().min(0).max(10)),
    max_number_training_jobs:yup.lazy((value) =>isNaN(value) || value==="" ? yup.string().transform((value) => (isNaN(value) || value === null || value === undefined) ? "" : value) :yup.number().integer().positive().min(0).max(100)),
    epochs:yup.lazy((value) =>isNaN(value) || value==="" ? yup.string().transform((value) => (isNaN(value) || value === null || value === undefined) ? "" : value) :yup.number().integer().positive().min(0).max(1000)),
    // lr_scheduler_step:yup.lazy((value) =>isNaN(value) || value==="" ? yup.string().transform((value) => (isNaN(value) || value === null || value === undefined) ? "" : value) :yup.number().integer().positive().min(0)),
    lr_scheduler_factor:yup.lazy((value) =>isNaN(value) || value==="" ? yup.string().transform((value) => (isNaN(value) || value === null || value === undefined) ? "" : value) :yup.number().positive().min(0).max(1)),
    num_layers:yup.lazy((value) =>isNaN(value) || value==="" ? yup.string().transform((value) => (isNaN(value) || value === null || value === undefined) ? "" : value) :yup.number().integer().positive().min(0)),
    overlap_threshold: yup.lazy((value) =>isNaN(value) || value==="" ? yup.string().transform((value) => (isNaN(value) || value === null || value === undefined) ? "" : value) :yup.number().positive().min(0).max(1)),
    nms_threshold: yup.lazy((value) =>isNaN(value) || value==="" ? yup.string().transform((value) => (isNaN(value) || value === null || value === undefined) ? "" : value) :yup.number().positive().min(0).max(1)),
    learning_rate: yup.lazy((value) =>isNaN(value) || value==="" ? yup.string().transform((value) => (isNaN(value) || value === null || value === undefined) ? "" : value) :yup.number().positive().min(0).max(1)),
    weight_decay: yup.lazy((value) =>isNaN(value) || value==="" ? yup.string().transform((value) => (isNaN(value) || value === null || value === undefined) ? "" : value) :yup.number().positive())
  });

  let modelPrevData=useRef<any>();
  let modelParamId=useRef<any>();
  let modelListData=useRef<any>();

  useEffect(()=>{ 
    modelParamId.current = modelId
    modelPrevData.current = modelData;
    modelListData.current = modelList
    // if(modelData?.deployment?.status === "IN_SERVICE"){
    //   modelData.id && getModelList(false,modelData?.id)
    // }
    // if(modelData?.status === "TRAINED"){
    //   modelData.id && getModelList(false,modelData?.id)
    // }
    // return()=>{
    //   if(modelData?.deployment?.status !== "CREATING" && (!['TRAINING','INITIALIZED'].includes(modelData?.state))){
    //     disconnectModelSocket();
    //   }
    // }
  },[modelData,modelData?.state,modelData?.deployment,JSON.stringify(modelList),modelList?.length,modelId])

  const defaultFilterValue = {
    augmentations: {},
    name: '',
    preprocessors: {},
    project_id: '',
  };
  const [defaulData, setDefaultData] = useState<any>(defaultFilterValue);
  const [annotatedContent, setAnnotatedContent] = useState(Object);
  const [isViewAllImage, setViewAllImage] = useState(false);
  const [statsData, setStatsData] = useState<any>(null);
  const [trainedPercent, setTrainPercent] = useState(0);
  const [validPercent, setValidPercent] = useState(0);
  const [testPercent, setTestPercent] = useState(0);
  const [trainedCount, setTrainCount] = useState(0);
  const [validCount, setValidCount] = useState(0);
  const [testCount, setTestCount] = useState(0);
  const [split, setSplit] = useState(false);
  const [imagesList, setImages] = useState<any>([]);
  const [streachRange, setStreachRange] = useState([NumberLimit.ZERO]);
  const [staticCropRange, setStaticCropRange] = useState([
    NumberLimit.ZERO,
    NumberLimit.ONE_HUNDRED,
  ]);
  const [staticCropVerRange, setStaticCropVerRange] = useState([
    NumberLimit.ZERO,
    NumberLimit.ONE_HUNDRED,
  ]);
  const [degreeRange, setDegreeRange] = useState([NumberLimit.ZERO]);

  const { project_id } = useParams();
  const navigate = useNavigate();
  const history = createBrowserHistory();
  const location = history.location.pathname;

  const disconnectModelSocket = (id:string,toast=false) => {
    try {
      socketRef[id] && socketRef[id].close();
      // socketRef[id] && delete socketRef[id];
    } catch (err) {
    }
  };

  const connectWithModelSocket = (id = '') => {
    disconnectModelSocket(id);
    let apiUrl = process.env.REACT_APP_API_ENDPOINT || '';
    apiUrl = apiUrl.replace(HTTPS_REPLACE, '');
    const url = `wss://${apiUrl}/v1/models/${id}?websocket=true&Authorization=${localStorage.getItem(
      AUTH_TOKEN
      )}`;
      try {
        socketRef[id] = new WebSocket(url);
        socketRef[id]?.addEventListener('message', (event: any) => {
          
          const dataObj = event?.data ? JSON.parse(event?.data) : null;
          if (dataObj?.id) {          
          if(dataObj?.id===modelPrevData?.current?.id && modelPrevData?.current?.state==='TRAINING' && dataObj?.state==='ERR'){
            dispatch(showToast({'message':'Training Failed!', type:'error'}));
            getModelList(false,dataObj?.id);
            disconnectModelSocket(id);
          }      
          if(dataObj?.id===modelPrevData?.current?.id && modelPrevData?.current?.state==='TRAINING' && dataObj?.state==='TRAINED'){
            dispatch(showToast({'message':'Training Completed Successfully', type:'success'}));
            getModelList(false,dataObj?.id);
            disconnectModelSocket(id);
          }
          if(dataObj?.id===modelPrevData?.current?.id && modelPrevData?.current?.deployment?.status==='CREATING' && dataObj?.deployment?.status==='ERR'){
            dispatch(showToast({'message':'Deployment Failed!', type:'error'}));
            disconnectModelSocket(id);
          }
          
          dataObj.id === modelParamId.current && setModelData(dataObj);
          //dataObj.id === modelParamId.current && updateModelState(dataObj?.state, dataObj?.id,dataObj);
          if(dataObj?.id===modelPrevData?.current?.id && modelPrevData?.current?.deployment?.status==='CREATING' && dataObj?.deployment?.status==='IN_SERVICE'){
            dispatch(showToast({'message':'Deployment Completed Successfully', type:'success'}));
            getModelList(false,dataObj?.id);
            disconnectModelSocket(id);
          }
          
          if(dataObj?.id !== modelPrevData?.current?.id){
            modelListData.current?.forEach((model:any)=>{

              if(dataObj?.id===model?.id && model?.state==='TRAINING' && dataObj?.state==='ERR'){
                dispatch(showToast({'message':'Training Failed!', type:'error'}));
                getModelList(false,dataObj?.id);
                disconnectModelSocket(model.id);
              } 

              if(dataObj?.id===model?.id && model?.state==='TRAINING' && dataObj?.state==='TRAINED'){
                dispatch(showToast({'message':'Training Completed Successfully', type:'success'}));
                getModelList(false,dataObj?.id);
                disconnectModelSocket(model?.id);
              }

              if(dataObj?.id===model?.id && model?.deployment?.status==='CREATING' && dataObj?.deployment?.status==='ERR'){
                dispatch(showToast({'message':'Deployment Failed!', type:'error'}));
                disconnectModelSocket(model?.id);
              }

              if(dataObj?.id===model?.id && model?.deployment?.status==='CREATING' && dataObj?.deployment?.status==='IN_SERVICE'){
                dispatch(showToast({'message':'Deployment Completed Successfully', type:'success'}));
                getModelList(false,dataObj?.id);
                disconnectModelSocket(model.id);
              }
            })
          }
        }
      });
    } catch (err) {
      dispatch(showToast({'message':'Training Failed!', type:'error'}));
      disconnectModelSocket(id);
    }
  };

  const isCountKeyExist = (annotatedContent: Object) => 'count' in annotatedContent;
  

  const isViewMoreDisable = (annotatedContent: { count: number }) => !annotatedContent?.count;
  

  const isEmptyImageList = () => {
    return (
     isCountKeyExist(annotatedContent) &&
     isViewMoreDisable(annotatedContent)
    );
  };

  const closeSplit = () => setSplit(false);

  const fetchDataForStats = async (datasetId = '') => {
    if (project?.id && datasetId) {
      setIsLoading(true)
      await dispatch(
        getAnnotateStatistics({ project_id: project.id, dataset_id: datasetId })
      ).then((resd: any) => {
        if (resd?.payload) {
          setStatsData(resd?.payload);
        }
        setIsLoading(false)
      });
    }
  };

  const fetchTrainTestData = (datasetId = '') => {
    setIsLoading(true)
    dispatch(getCurrentDataSet({ id: datasetId })).then((res:any) => {
      if (res?.payload) {
        setModelDataset(res?.payload);
        setIsLoading(false)
      }
    });
  };

  const initialStats=()=>{
    if (modelData?.datasetid) {
      fetchDataForStats(modelData?.datasetid);
      fetchTrainTestData(modelData?.datasetid);
    } else if (project?.datasetid && !modelData?.datasetid) {
      fetchDataForStats(project?.datasetid);
    }
  }

  useEffect(() => {
    initialStats()
    // return () => { // Clearing due reseting of data
    //   dispatch(clearContent())
    // }
  }, [modelData?.datasetid, isSwitchData, project]);

  useEffect(() => {
    const selectedDataSet = dataSet;
    const selectedStats = statsData ? statsData : statistics;
    const trainValue = selectedDataSet?.split?.train
      ? Math.round(selectedDataSet?.split?.train * NumberLimit.ONE_HUNDRED)
      : NumberLimit.ZERO;
    const testValue = selectedDataSet?.split?.test
      ? Math.round(selectedDataSet?.split?.test * NumberLimit.ONE_HUNDRED)
      : NumberLimit.ZERO;
    const validValue = selectedDataSet?.split?.validation
      ? Math.round(selectedDataSet?.split?.validation * NumberLimit.ONE_HUNDRED)
      : NumberLimit.ZERO;
    const trainCount = Math.round(
      (selectedStats?.total_annotated_images / NumberLimit.ONE_HUNDRED) *
      trainValue
    );
    const validCountValue = selectedStats?.total_annotated_images - trainCount
    // const validCountValue = Math.round(
    //   (selectedStats?.total_annotated_images / NumberLimit.ONE_HUNDRED) *
    //   validValue
    // );
    // const testCountValue = testValue === NumberLimit.ZERO ? NumberLimit.ZERO : selectedStats?.total_annotated_images - (trainCount + validCountValue)

    setTrainPercent(trainValue);
    setTestPercent(testValue);
    setValidPercent(validValue);
    setTrainCount(trainCount);
    // setTestCount(testCountValue);
    setValidCount(validCountValue);
  }, [statistics, dataSet, statsData, modelData]);

  const clearModelList = () => {
    setModelList([]);
    setModelAction(MODEL_ACTION.create);
    setModelStep(NumberLimit.ONE);
    setGaussianIntensity(NumberLimit.ZERO);
    setJitterIntensity(NumberLimit.ZERO);
    setNoiseIntensity(NumberLimit.ZERO);
    disconnectModelSocket(modelId || modelData?.id || '');
  };

  const fetchModelDetail = (mId: string | null) => {
    if (mId) {
      setIsLoading(true);
      getModelDetail(mId)
        .then((res) => { 
          if (res.data) {
            setModelData(res.data);
            const modId = res?.data?.id;
            updateModelState(res?.data?.state, modId);
            setModelAction(MODEL_ACTION.view); 
            connectWithModelSocket(modId);
          }
          setIsLoading(false);
        })
        .catch((e) => {
          setIsLoading(false);
        });
    }
  };

  useEffect(() => {
    fetchModelDetail(modelId);
  }, [modelId]);

  const getRouterName = () => {
    return location.includes(CREATE_PROJECT)
      ? CREATE_PROJECT_STEP4
      : PROJECT_OVERVIEW_STEP4;
  };

  const navigateToFirstModel = (mid = '') => {
    navigate(`${getRouterName()}/${project_id}?mid=${mid}`);
  };

  const getModelList = (isNavigate = false, mid=null) => {
    if (project?.id) {
      //setIsLoading(true);
      getModelData(project?.id)
        .then((res) => {
          if (res?.data?.models) {
            setModelList(res?.data?.models);
          if (isNavigate)  {
            const index = res?.data?.models.findIndex((m:any)=> m?.id === mid);
            setModelData(res?.data?.models[index === -1 ? NumberLimit.ZERO : index]);
            if (res?.data?.models[index === -1 ? NumberLimit.ZERO : index]) {
              const modelIdValue = (mid!== null) ? mid : res?.data?.models[NumberLimit.ZERO].id;
              navigateToFirstModel(modelIdValue);
              setModelAction(MODEL_ACTION.view);
              //connectWithModelSocket(modelIdValue);
            }
          }
          } else {
            clearModelList();
          }
          //setIsLoading(false);
        })
        .catch((err) => {
          setIsLoading(false);
        });
    }
  };

  useEffect(() => {
    getModelList();
  }, [project]);

  const getDefaultName = () => {
    return `${uid()} - ${moment().format('DD MMM YYYY')}`;
  };

  const resetGenerateModel = () => {
    setDefaultData(defaultFilterValue);
    resetOhterFilter();
    setModelStep(NumberLimit.ONE);
  };

  const generateNewModel = () => {
    if (annotatedContent?.count < NumberLimit.TEN) {
      alert(
        'Annotation images are less than 10, you have to upload more images for start the training'
      );
    } else {
      defaulData.name = getDefaultName();
      defaulData.project_id = project?.id;
      defaulData.dataset_id = dataSet?.id;
      setIsLoading(true);
      createNewModel(defaulData)
        .then((res) => {
          dispatch(
            showToast({
              message: SUCCESS_MESSAGE.MODEL_GENERATED,
              type: 'success',
            })
          );
          setIsLoading(false);
          resetGenerateModel();
          getModelList(true);
        })
        .catch((err) => {
          setIsLoading(false);
          let msg = SERVER_ALERT;
          if (err?.response?.status === NumberLimit.FOUR_ZERO_NINE) {
            msg = SUCCESS_MESSAGE.MODEL_ALREADY_EXISTS;
          }
          dispatch(showToast({ message: msg, type: 'error' }));
        });
    }
  };

  const updateNameInList = (name = '') => {
    if (modelList?.length) {
      const modelListData = modelList;
      modelListData.forEach((ele: any) => {
        if (ele?.id === modelData?.id) {
          ele.name = name;
        }
      });
      // setModelList(modelListData);
      setIsUpdate(!isUpdate);
    }
  };

  const updateModelState = (state = '', id = '',data='') => {
    if (modelList?.length) {
      let modelListData = JSON.parse(JSON.stringify(modelList));
      const modelIdVal = id || modelData?.id;
      modelListData = modelListData.map((eles: any) => {
        if (eles?.id === modelIdVal) {
          eles.state = state;
          if(data){
            eles = JSON.parse(JSON.stringify(data))
          }
        }
        return eles
      });
      
      setModelList(modelListData);
      setIsUpdate(!isUpdate);
    }
  };

  const getModelName = (name = '') => {
    let nameValue = getDefaultName();
    if (name) {
      nameValue = name;
    } else if (modelData?.name) {
      nameValue = modelData?.name;
    }
    return nameValue;
  };

  const forUpdateModelData = (name = '') => {
    defaulData.name = getModelName(name);
    defaulData.project_id = project?.id;
    //setIsLoading(true);
    updateModelData(defaulData, modelData?.id)
      .then((res) => {
        dispatch(
          showToast({ message: SUCCESS_MESSAGE.MODEL_UPDATED, type: 'success' })
        );
        if (res?.data) {
          setModelData(res?.data);
        }
        //setIsLoading(false);
        setIsEditName(false);
        updateNameInList(name);
      })
      .catch((err) => {
        setIsLoading(false);
        let msgText = SERVER_ALERT;
        if (err?.response?.status === NumberLimit.FOUR_ZERO_NINE) {
          msgText = SUCCESS_MESSAGE.MODEL_NAME_ALREADY_EXISTS;
        }
        dispatch(showToast({ message: msgText, type: 'error' }));
      });
  };

  const resetOhterFilter = () => {
    setFlipVertical(false);
    setFlipHorizontal(false);
    setDegreeRange([NumberLimit.ZERO]);
    setDegree(NumberLimit.ZERO);
  };

  const deleteModel = () => {
    setIsLoading(true);
    deleteModelData(modelData?.id)
      .then((res) => {
        dispatch(
          showToast({ message: SUCCESS_MESSAGE.MODEL_DELETED, type: 'success' })
        );
        setModelAction(MODEL_ACTION.create);
        setIsLoading(false);
        setDefaultData(defaultFilterValue);
        resetOhterFilter();
        getModelList(true);
      })
      .catch((err) => {
        setIsLoading(false);
        dispatch(showToast({ message: SERVER_ALERT, type: 'error' }));
      });
  };

  const openConfirmDelete = () => {
    setConfrimDelete(true);
  };

  const closeDelete = () => {
    setConfrimDelete(false);
  };

  const handleAddImage = () => {
    dispatch(clearUpload());

    location.includes(CREATE_PROJECT)
      ? navigate(`${CREATE_PROJECT_STEP1}/${project_id}`)
      : navigate(`${PROJECT_OVERVIEW_STEP1}/${project_id}`);
  };

  const applyPreprocessigFilter = (data: {
    percent_crop?: Object;
    resize?: Object;
  }) => {
    let preprocessingData = defaulData;
    if (data?.percent_crop) {
      preprocessingData = {
        ...preprocessingData,
        preprocessors: {
          ...preprocessingData.preprocessors,
          percent_crop: data?.percent_crop,
        },
      };
    }
    if (data?.resize) {
      preprocessingData = {
        ...preprocessingData,
        preprocessors: {
          ...preprocessingData.preprocessors,
          resize: data?.resize,
        },
      };
    }
    setDefaultData(preprocessingData);
  };

  const removePreprocessing = (filType: string) => {
    if (filType === PREPROCESSING_OPTION.static) {
      delete defaulData.preprocessors.percent_crop;
      setStaticCropRange([NumberLimit.ZERO, NumberLimit.ONE_HUNDRED]);
      setStaticCropVerRange([NumberLimit.ZERO, NumberLimit.ONE_HUNDRED]);
    } else if (
      filType === PREPROCESSING_OPTION.fill ||
      filType === PREPROCESSING_OPTION.fit ||
      filType === PREPROCESSING_OPTION.stretch
    ) {
      delete defaulData.preprocessors.resize;
    }
    setDefaultData(defaulData);
  };

  const editPreprocessingFilter = (filtType: string) => {
    setFilterType(filtType);
    setPreprocessiongFilter(true);
  };

  const displayPercentCrop = (dataObject: any) => {
    if (dataObject?.preprocessing?.percent_crop) {
      return (
        <p>
          <span>Percent Crop</span> - Width:{' '}
          {displayNumberValue(
            dataObject?.preprocessing?.percent_crop?.width *
            NumberLimit.ONE_HUNDRED
          )}
          , Height:{' '}
          {displayNumberValue(
            dataObject?.preprocessing?.percent_crop?.height *
            NumberLimit.ONE_HUNDRED
          )}
        </p>
      );
    } else {
      return <></>;
    }
  };

  const isEmptyObj = (objVal = {}) => {
    return !Object.keys(objVal).length;
  };
  const viewAllImage = () => {
    setViewAllImage(true);
  };

  const removeAugementaionSecond = (filtType = '') => {
    switch (filtType) {
      case AUGMENTATION_OPTION.random_crop:
        delete defaulData.augmentations.random_crop;
        break;
      case AUGMENTATION_OPTION.random_erasing:
        delete defaulData.augmentations.random_erasing;
        break;
      case AUGMENTATION_OPTION.rotate:
        {
          delete defaulData.augmentations.rotate;
          setDegree(NumberLimit.ZERO);
        }
        break;
      case AUGMENTATION_OPTION.rotation:
        {
          delete defaulData.augmentations.rotate;
          setDegreeRange([NumberLimit.ZERO]);
          setDegree(NumberLimit.ZERO);
        }
        break;
      default:
        break;
    }
  };

  const removeAugementaion = (filtType = '') => {
    switch (filtType) {
      case AUGMENTATION_OPTION.flip:
        {
          delete defaulData.augmentations.flip;
          setFlipVertical(false);
          setFlipHorizontal(false);
        }
        break;
      case AUGMENTATION_OPTION.color_jitter:
        delete defaulData.augmentations.color_jitter;
        setJitterIntensity(NumberLimit.ZERO);
        break;
      case AUGMENTATION_OPTION.gaussian_blur:
        delete defaulData.augmentations.gaussian_blur;
        setGaussianIntensity(NumberLimit.ZERO);
        break;
      case AUGMENTATION_OPTION.grayscale:
        delete defaulData.augmentations.greyscale;
        break;
      case AUGMENTATION_OPTION.jpeg_compression:
        delete defaulData.augmentations.jpeg_compression;
        break;
      case AUGMENTATION_OPTION.noise:
        delete defaulData.augmentations.noise;
        setNoiseIntensity(NumberLimit.ZERO);
        break;
      default:
        removeAugementaionSecond(filtType);
        break;
    }
  };

  const editAugmentationFilter = (filtType = '') => {
    setFilterType(filtType);
    setAugmentationFilter(true);
  };

  const fetchCurrentDataSet = () => {
    fetchDataForStats(project?.datasetid);
    fetchTrainTestData(project?.datasetid);
  };

  const startTraining = () => {
    setIsLoading(true);
    startModelTraining(modelData?.id)
      .then((res) => {
        setIsLoading(false);
        if (res?.data) {
          res.data.state = MODEL_STATUS.TRAINING;
          setModelData(res?.data);
          updateModelState(MODEL_STATUS.TRAINING);
        }
        dispatch(
          showToast({
            message: SUCCESS_MESSAGE.MODEL_TRAINING,
            type: 'success',
          })
        );
      })
      .catch((err) => {
        setIsLoading(false);
        dispatch(
          showToast({
            message: err?.response?.data?.message || SERVER_ALERT,
            type: 'error',
          })
        );
      });
  };

  const checkModelState = (stateType = '') => {
    return modelData?.state === stateType;
  };

  const stepHeaderClass = (step: number) => {
    return ModelFun.isCurrentStep(modelStep, step) ? '' : 'fill';
  };

  const countAugmentationFilter = () => {
    return defaulData?.augmentations
      ? Object.keys(defaulData?.augmentations).length
      : NumberLimit.ZERO;
  };

  const hideCreateView = () => {
    return checkModelState(MODEL_STATUS.TRAINED) ? 'd-none' : '';
  };

  const modelStateType = (currentState = '', stateType = '') => {
    return currentState === stateType;
  };

  const compareModel = () => {
    navigate(
      `${MODAL_TRANINING_COMPARE}?pid=${project_id}&from=${getRouterName()}&comid=${compareId.toString()}`
    );
  };

  const onChangeCompare = (compId = '') => {
    const exists = compareId.includes(compId);
    let compArr = compareId;
    if (exists) {
      compArr = compareId.filter((c) => {
        return c !== compId;
      });
    } else {
      if (compareId.length === NumberLimit.TWO) {
        compArr[NumberLimit.ONE] = compId;
      } else {
        compArr.push(compId);
      }
    }

    setCompareId(compArr);
    if (compArr.length === 0) return reset();
  };

  const reset = () => {
    disconnectModelSocket(modelId || modelData?.id || '');
    setModelDataset(null);
    setModelData(null);
    setCompareId([]);
    setModelAction(MODEL_ACTION.create);
    navigate(`${getRouterName()}/${project_id}`);
    fetchCurrentDataSet();
  };

  const setClassificationData = () => {
    !classificationDrop && setShowParameterAlert(true)
    setHyperParameters({
      max_runtime_seconds:modelData?.parameters?.runtime?.max_runtime_seconds?.toString() ? modelData?.parameters?.runtime?.max_runtime_seconds:"",
      maximum_retry_attempts:modelData?.parameters?.runtime?.maximum_retry_attempts?.toString() ? modelData?.parameters?.runtime?.maximum_retry_attempts:"",
      max_number_training_jobs:modelData?.parameters?.runtime?.max_number_training_jobs?.toString() ? modelData?.parameters?.runtime?.max_number_training_jobs:"",
      instance_type:modelData?.parameters?.resource?.instance_type?.toString() ? modelData?.parameters?.resource?.instance_type:"",
      epochs:modelData?.parameters?.hyperparameters?.epochs?.toString() ? modelData?.parameters?.hyperparameters?.epochs:"",
      lr_scheduler_step:modelData?.parameters?.hyperparameters?.lr_scheduler_step?.toString() ? modelData?.parameters?.hyperparameters?.lr_scheduler_step:"",
      lr_scheduler_factor:modelData?.parameters?.hyperparameters?.lr_scheduler_factor?.toString() ? modelData?.parameters?.hyperparameters?.lr_scheduler_factor:"",
      overlap_threshold:modelData?.parameters?.hyperparameters?.overlap_threshold?.toString() ? modelData?.parameters?.hyperparameters?.overlap_threshold :"",
      nms_threshold:modelData?.parameters?.hyperparameters?.nms_threshold?.toString() ? modelData?.parameters?.hyperparameters?.nms_threshold :"",
      learning_rate:modelData?.parameters?.hyperparameters?.learning_rate?.toString() ? modelData?.parameters?.hyperparameters?.learning_rate : "",
      weight_decay:modelData?.parameters?.hyperparameters?.weight_decay?.toString() ? modelData?.parameters?.hyperparameters?.weight_decay : "",
      num_layers:modelData?.parameters?.hyperparameters?.num_layers?.toString() ? modelData?.parameters?.hyperparameters?.num_layers : "",
    })
    setClassificationDrop(!classificationDrop)
  }

  const isActiveCompare = () => {
    return compareId?.length === NumberLimit.TWO;
  };

  const saveBoundingHyperparameters = () => {
    schema.validate({
      max_runtime_seconds:hyperparameters.max_runtime_seconds,
      maximum_retry_attempts:hyperparameters.maximum_retry_attempts,
      max_number_training_jobs: hyperparameters.max_number_training_jobs,
      epochs:hyperparameters.epochs,
      // lr_scheduler_step:hyperparameters.lr_scheduler_step,
      lr_scheduler_factor:hyperparameters.lr_scheduler_factor,
      overlap_threshold:hyperparameters.overlap_threshold,
      nms_threshold:hyperparameters.nms_threshold,
      learning_rate:hyperparameters.learning_rate,
      weight_decay:hyperparameters.weight_decay
    }).then((res)=>{
      const payloadData = {
        parameters: {
          hyperparameters: {
            epochs:res.epochs?.toString() ? res.epochs :null,
            lr_scheduler_step:hyperparameters.lr_scheduler_step ? hyperparameters.lr_scheduler_step :null,
            lr_scheduler_factor:res.lr_scheduler_factor?.toString() ? res.lr_scheduler_factor :null,
            overlap_threshold:res.overlap_threshold?.toString() ? res.overlap_threshold :null,
            nms_threshold:res.nms_threshold?.toString() ? res.nms_threshold :null,
            learning_rate:res.learning_rate?.toString() ? res.learning_rate :null,
            weight_decay:res.weight_decay?.toString() ? res.weight_decay :null
          },
          resource: {
            instance_type: hyperparameters.instance_type ? hyperparameters.instance_type :null
          },
          runtime: {
            max_number_training_jobs: res.max_number_training_jobs?.toString() ? res.max_number_training_jobs:null,
            max_runtime_seconds: res.max_runtime_seconds?.toString() ? res.max_runtime_seconds:null,
            maximum_retry_attempts: res.maximum_retry_attempts?.toString() ? res.maximum_retry_attempts:null
          }
        },
      }
      setPayloadData(payloadData)
      setShowConfirmParameter(true)
    }).catch((err)=>{
      dispatch(
        showToast({ message:err.errors[0] , type: 'error' })
      );
    })
  }

  const confirmSaveParams = () => {
    updateModelData(payload, modelData?.id)
        .then((res) => {
          dispatch(
            showToast({ message: project.annotation_type==="bounding_box"?"Object Detection Parameters have been updated ":"Classification Parameters have been updated", type: 'success' })
          );
          setClassificationDrop(false)
        })
  }

  const saveClassificationHyperparameters = () => {
    schema.validate({
      max_runtime_seconds:hyperparameters.max_runtime_seconds,
      maximum_retry_attempts:hyperparameters.maximum_retry_attempts,
      max_number_training_jobs: hyperparameters.max_number_training_jobs,
      num_layers:hyperparameters.num_layers,
      epochs:hyperparameters.epochs,
      // lr_scheduler_step:hyperparameters.lr_scheduler_step,
      lr_scheduler_factor:hyperparameters.lr_scheduler_factor
    }).then((res)=>{
      const payloadData = {
        parameters: {
          hyperparameters: {
            num_layers:res.num_layers?.toString() ? res.num_layers:null,
            epochs:res.epochs?.toString() ? res.epochs:null,
            lr_scheduler_step:hyperparameters.lr_scheduler_step ? hyperparameters.lr_scheduler_step:null,
            lr_scheduler_factor:res.lr_scheduler_factor?.toString() ? res.lr_scheduler_factor:null
          },
          resource: {
            instance_type: hyperparameters.instance_type ? hyperparameters.instance_type:null
          },
          runtime: {
            max_number_training_jobs: res.max_number_training_jobs?.toString()? res.max_number_training_jobs:null,
            max_runtime_seconds: res.max_runtime_seconds?.toString() ?res.max_runtime_seconds:null,
            maximum_retry_attempts: res.maximum_retry_attempts?.toString() ? res.maximum_retry_attempts:null
          }
        },
      }
      setPayloadData(payloadData)
      setShowConfirmParameter(true)
    }).catch((err)=>{
      dispatch(
        showToast({ message:err.errors[0] , type: 'error' })
      );
    })
  }

  useEffect(()=>{
    if(isViewAllImage){
      disconnectModelSocket(modelData?.id)
    }else{
      connectWithModelSocket(modelId || modelData?.id)
    }
    
    
  },[isViewAllImage])

  const tooltip = {
    max_runtime_seconds:(
      <Tooltip id="tooltip">
        Specifies a limit to how long a model hyperparameter training job can run.
      </Tooltip>
    ),
    maximum_retry_attempts:(
      <Tooltip id="tooltip">
        The number of times to retry the job if it fails due to an internal server error.
      </Tooltip>
    ),
    max_number_training_jobs:(
      <Tooltip id="tooltip">
        Max number of train jobs.
      </Tooltip>
    ),
    instance_type:(
      <Tooltip id="tooltip">
        AWS instance type to train on.
      </Tooltip>
    ),
    epochs:(
      <Tooltip id="tooltip">
        The number of training epochs.
      </Tooltip>
    ),
    lr_scheduler_step:(
      <Tooltip id="tooltip">
        The epochs at which to reduce the learning rate.
      </Tooltip>
    ),
    lr_scheduler_factor:(
      <Tooltip id="tooltip">
        The ratio to reduce learning rate.
      </Tooltip>
    ),
    overlap_threshold:(
      <Tooltip id="tooltip">
        The evaluation overlap threshold.
      </Tooltip>
    ),
    nms_threshold:(
      <Tooltip id="tooltip">
        he non-maximum suppression threshold.
      </Tooltip>
    ),
    learning_rate:(
      <Tooltip id="tooltip">
        The initial learning rate.
      </Tooltip>
    ),
    weight_decay:(
      <Tooltip id="tooltip">
        The weight decay coefficient for sgd and rmsprop. Ignored for other optimizers.
      </Tooltip>
    ),
    num_layers:(
      <Tooltip id="tooltip">
         Number of layers for the network.
      </Tooltip>
    ),
  }
  
  const numberInputOnWheelPreventChange = (e:any) => {
    // Prevent the input value change
    e.currentTarget.blur()

    // Prevent the page/container scrolling
    e.stopPropagation()

    // Refocus immediately, on the next tick (after the current function is done)
      setTimeout(() => {
        e.target.focus()
    }, 0)
}

const preventKey = (e:any) => {
  e?.which === 101 && e?.preventDefault()
}
  const getCount = () => statistics && statistics?.annotations_per_class
    && Object.keys(statistics?.annotations_per_class).length > 0 ?
    Object.keys(statistics?.annotations_per_class).length -1 : NumberLimit.ZERO;
    
  return (
    <Layout>
      <>
          <Loader isLoading={isLoading} />
        <div className={`steps model-version-4 ${isViewAllImage && 'd-none'}`}>
          <Row>
            <Col sm='3'>
              <div className='modal-left-item'>
                <div
                  className={`gen-new-modal ui-cursor-pointer ${!modelId && 'active'
                    }`}
                  onClick={() => {
                    reset();
                  }}
                >
                  <img src={PLUS_CIRCLE_ICON} alt='plus icon' /> Generate New
                  Model
                </div>

                <div className='modal-data-wrapper'>
                  {!!modelList?.length && (
                    <>
                      <div className='sm-head'>
                        <p>Models</p>
                        <p
                          className={
                            isActiveCompare() ? `ui-cursor-pointer active` : ''
                          }
                          onClick={() => {
                            if (isActiveCompare()) {
                              compareModel();
                            }
                          }}
                        >
                          Compare
                        </p>
                      </div>
                      {modelList.map(
                        (res: {
                          name: string;
                          created_at: string;
                          id: string;
                          state: string;
                          deployment:any
                        }) => (
                          <div
                            key={res.id}
                            className={`project-date step-1 ui-cursor-pointer ${modelId === res?.id && 'active'
                              }`}
                            onClick={(evt) => {
                              evt.stopPropagation();
                              navigate(
                                `${getRouterName()}/${project_id}?mid=${res?.id
                                }`
                              );
                             setClassificationDrop(false)
                              setModelAction(MODEL_ACTION.view);
                              setIsDataSwitch(!isSwitchData);
                            }}
                          >
                            {modelStateType(
                              res?.state,
                              MODEL_STATUS.TRAINED
                            ) && (
                                <div className='checkbox-panel'>
                                  <label>
                                    <input
                                      checked={compareId.includes(res?.id)}
                                      id={`compare-${res?.id}`}
                                      type='checkbox'
                                      onChange={(evt) => {
                                        onChangeCompare(res?.id);
                                      }}
                                    />
                                    <span className='checkbox'>
                                      <span className='value'>{res?.name}</span>
                                    </span>
                                  </label>
                                </div>
                              )}
                            {!modelStateType(
                              res?.state,
                              MODEL_STATUS.TRAINED
                            ) && <p className='active-date'>{res?.name}</p>}
                            <p
                              className={`date ${modelStateType(
                                res?.state,
                                MODEL_STATUS.TRAINED
                              ) && 'indent'
                                }`}
                            >
                              {' '}
                              {changeDateFormat(res?.created_at)}
                            </p>

                         {res.deployment?.status==='IN_SERVICE' && <p
                              className="deployed"
                            >Deployed
                            </p>}

                              <div className={`training-loader-box loader-box-right ${!modelStateType(
                                res?.state,
                                MODEL_STATUS.TRAINING
                              ) && !modelStateType(
                                res?.deployment?.status,
                                MODEL_STATUS.CREATING
                              ) && 'd-none'
                                }`}>
                          {res.state !== MODEL_STATUS.TRAINED && <div className='loader-inline'>
                            <div className='loader-inner'></div>
                          </div>}
                        </div>
                            {modelStateType(
                              res?.state,
                              MODEL_STATUS.TRAINED
                            ) && (
                                <img
                                  className='time'
                                  src={TICK_ICON_BIG}
                                  alt='images'
                                />
                              )}
                          </div>
                        )
                      )}
                    </>
                  )}
                  <div className='project-date checked d-none'>
                    <div className='checkbox-panel'>
                      <label>
                        <input type='checkbox' onChange={()=>{}} />
                        <span className='checkbox'>20 Jan 2022</span>
                      </label>
                    </div>
                    <p className='date'>20 Jan 2022 | 3:30 PM</p>
                    <img className='time' src={SMALL_CIRCLE} alt='images' />
                  </div>
                </div>
              </div>
            </Col>

            <Col sm='9'>
              <div
                className={`modal-right-item edit-mode ${ModelFun.isModelView(modelAction) && 'd-none'
                  }`}
              >
                <div className='page-header pdt0'>
                  <div className='left-item'>
                    <h3 className='mgb0'>
                      Generate New Version{' '}
                      <span className='sm-txt'>
                        Prepare your images and data for training by compiling
                        them into a model.
                        <br />
                        Experiment with different configurations to achieve
                        better training results.
                      </span>
                    </h3>
                  </div>
                </div>
                {/* page-header */}

                <div className='accordion'>
                  <div className='accordion-steps accordion-item'>
                    <div className='accordion-body'>
                      <div className='step-1'>
                        <div className='img-data-wrapper'>
                          <div className='page-header'>
                            <div className='left-item'>
                              <div
                                className={`count-circle ${ModelFun.isStepComplete(
                                  modelStep,
                                  NumberLimit.ONE
                                ) &&
                                  !ModelFun.isStepOne(modelStep) &&
                                  'active'
                                  }`}
                              >
                                <span>{NumberLimit.ONE}</span>
                              </div>
                              <div className='heading'>
                                <h3>
                                  Image Data
                                  <div
                                    className={`head-btn ${ModelFun.isStepOne(modelStep) && 'd-none'
                                      }`}
                                  >
                                    <span className='tag grey'>
                                      {annotatedContent?.count ||
                                        NumberLimit.ZERO}{' '}
                                      Images
                                    </span>
                                    <span className='tag grey'>
                                      {getCount()}{' '}
                                      Classes
                                    </span>
                                    <button
                                      type='button'
                                      className='btn link-btn'
                                      onClick={() => {
                                        setModelStep(NumberLimit.ONE);
                                      }}
                                    >
                                      View
                                    </button>
                                  </div>
                                </h3>
                                <div
                                  className={`sm-txt ${!ModelFun.isStepOne(modelStep) && 'd-none'
                                    }`}
                                >
                                  Upload images you want to include in your
                                  dataset
                                  <span className='tag grey'>
                                    {statistics?.total_annotated_images ||
                                      NumberLimit.ZERO}{' '}
                                    Images
                                  </span>
                                  <span className='tag grey'>
                                    { getCount() }{' '}
                                    Classes
                                  </span>
                                  <button
                                    disabled={!annotatedContent?.count}
                                    type='button'
                                    className='btn link-btn view-all-btn'
                                    onClick={viewAllImage}
                                  >
                                    Manage Images
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div
                            className={`hide-body step-1-body ${!ModelFun.isStepOne(modelStep) && 'd-none'
                              }`}
                          >
                            {/* common code reuse it  */}
                            {isEmptyImageList() ? (
                              <div className='total-txt no-data'>No annotated image found!</div>
                            ) : (
                              <DatasetImageListing
                                isSortList={true}
                                setAnnotatedContent={setAnnotatedContent}
                                isLoading
                                setIsLoading={(val:boolean)=>setIsLoading(val)}
                                imagesList={imagesList}
                                setImages={setImages}
                              />
                            )}
                            <div className='btn-space'>
                              <button
                                type='button'
                                className='btn secondary-btn'
                                onClick={() => {
                                  handleAddImage();
                                }}
                              >
                                Add Images
                              </button>
                              <button
                                type='button'
                                className='btn primary-btn continue-btn'
                                onClick={() => {
                                  setModelStep(NumberLimit.TWO);
                                }}
                              >
                                Continue
                              </button>
                            </div>
                          </div>
                        </div>
                        {/* img-data-wrapper */}
                      </div>
                    </div>
                  </div>
                  {/* accordion-steps */}

                  <div className='accordion-steps accordion-item'>
                    <div className='accordion-body'>
                      <div className='step-2'>
                        <div className='img-data-wrapper'>
                          <div className='page-header'>
                            <div className='left-item'>
                              <div
                                className={`count-circle ${ModelFun.isStepComplete(
                                  modelStep,
                                  NumberLimit.TWO
                                ) && !ModelFun.isStepTwo(modelStep)
                                    ? 'active'
                                    : stepHeaderClass(NumberLimit.TWO)
                                  }`}
                              >
                                <span>{NumberLimit.TWO}</span>
                              </div>
                              <div className='heading'>
                                <h3>
                                  Train/Valid Split
                                  {ModelFun.isStepComplete(
                                    modelStep,
                                    NumberLimit.TWO
                                  ) && (
                                      <div
                                        className={`tag-box ${ModelFun.isStepTwo(modelStep) &&
                                          'd-none'
                                          }`}
                                      >
                                        <span className='tag green'>
                                          Training - {trainedCount}
                                        </span>
                                        <span className='tag yellow'>
                                          Validation - {validCount}
                                        </span>
                                        {/* <span className='tag blue'>
                                          Test - {testCount}
                                        </span> */}
                                        <button
                                          type='button'
                                          className='btn link-btn'
                                          onClick={() => {
                                            setModelStep(NumberLimit.TWO);
                                          }}
                                        >
                                          View
                                        </button>
                                      </div>
                                    )}
                                </h3>
                                <div
                                  className={`sm-txt ${!ModelFun.isStepTwo(modelStep) && 'd-none'
                                    }`}
                                >
                                  Here is your images split
                                  <ButtonComponent
                                    type='button'
                                    styling='btn secondary-btn rebalance-btn'
                                    disabled={
                                      statistics.total_annotated_images <
                                      NumberLimit.TEN
                                    }
                                    action={() => {
                                      setSplit(true);
                                    }}
                                    name='Rebalance Dataset'
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                          {/* common code reuse it  */}
                          <Row
                            className={`hide-body train-wrapper ${!ModelFun.isStepTwo(modelStep) && 'd-none'
                              }`}
                          >
                            <TrainTestSplit
                              trainedPercent={trainedPercent}
                              trainedCount={trainedCount}
                              validPercent={validPercent}
                              validCount={validCount}
                              testPercent={testPercent}
                              testCount={testCount}
                            />
                            <div className='button-panel'>
                              <button
                                type='button'
                                className='btn primary-btn continue-btn'
                                onClick={() => {
                                  const stepNum = MODEL_IMAGE_FILTER
                                    ? NumberLimit.THREE
                                    : NumberLimit.FIVE;
                                  setModelStep(stepNum);
                                }}
                              >
                                Continue
                              </button>
                            </div>
                          </Row>
                        </div>
                        {/* img-data-wrapper */}
                      </div>
                    </div>
                  </div>
                  {/* accordion-steps */}

                  {MODEL_IMAGE_FILTER && (
                    <>
                      <div className='accordion-steps accordion-item'>
                        <div className='accordion-body'>
                          <div className='step-3'>
                            <div className='img-data-wrapper'>
                              <div className='page-header'>
                                <div className='left-item'>
                                  <div
                                    className={`count-circle ${ModelFun.isStepComplete(
                                      modelStep,
                                      NumberLimit.THREE
                                    ) && !ModelFun.isStepThree(modelStep)
                                        ? 'active'
                                        : stepHeaderClass(NumberLimit.THREE)
                                      }`}
                                  >
                                    <span>{NumberLimit.THREE}</span>
                                  </div>
                                  <div className='heading'>
                                    <h3>
                                      Preprocessing
                                      {ModelFun.isStepComplete(
                                        modelStep,
                                        NumberLimit.THREE
                                      ) && (
                                          <div
                                            className={`head-btn ${ModelFun.isStepThree(modelStep) &&
                                              'd-none'
                                              }`}
                                          >
                                            <div className='pro-data'>
                                              {defaulData?.preprocessors
                                                ?.percent_crop && (
                                                  <p>
                                                    <span>Percent Crop</span> -
                                                    Width:{' '}
                                                    {displayNumberValue(
                                                      defaulData?.preprocessors
                                                        ?.percent_crop?.width *
                                                      NumberLimit.ONE_HUNDRED
                                                    )}
                                                    , Height:{' '}
                                                    {displayNumberValue(
                                                      defaulData?.preprocessors
                                                        ?.percent_crop?.height *
                                                      NumberLimit.ONE_HUNDRED
                                                    )}
                                                  </p>
                                                )}
                                              {defaulData?.preprocessors
                                                ?.resize && (
                                                  <p>
                                                    <span>Resize</span> -{' '}
                                                    {
                                                      defaulData?.preprocessors
                                                        ?.resize?.mode
                                                    }{' '}
                                                    to&nbsp;
                                                    {
                                                      defaulData?.preprocessors
                                                        ?.resize?.size?.height
                                                    }
                                                    x
                                                    {
                                                      defaulData?.preprocessors
                                                        ?.resize?.size?.width
                                                    }
                                                  </p>
                                                )}
                                            </div>
                                            <button
                                              type='button'
                                              className='btn link-btn'
                                              onClick={() => {
                                                setModelStep(NumberLimit.THREE);
                                              }}
                                            >
                                              View
                                            </button>
                                          </div>
                                        )}
                                    </h3>
                                    <div
                                      className={`sm-txt ${!ModelFun.isStepThree(modelStep) &&
                                        'd-none'
                                        }`}
                                    >
                                      Decrease training time and increase
                                      performance by applying image
                                      transformations to all images in this
                                      dataset.
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div
                                className={`hide-body preprocessing-wrapper ${!ModelFun.isStepThree(modelStep) && 'd-none'
                                  }`}
                              >
                                <PreprocessingFilterList
                                  setOpenPreprocessiong={setOpenPreprocessiong}
                                  modelData={defaulData}
                                  removePreprocessing={removePreprocessing}
                                  editPreprocessingFilter={
                                    editPreprocessingFilter
                                  }
                                />
                                <button
                                  type='button'
                                  className='btn primary-btn continue-btn'
                                  onClick={() => {
                                    setModelStep(NumberLimit.FOUR);
                                  }}
                                >
                                  Continue
                                </button>
                              </div>
                            </div>
                            {/* img-data-wrapper */}
                          </div>
                        </div>
                      </div>
                      {/* accordion-steps */}
                      <div className='accordion-steps accordion-item'>
                        <div className='accordion-body'>
                          <div className='step-4'>
                            <div className='img-data-wrapper'>
                              <div className='page-header'>
                                <div className='left-item'>
                                  <div
                                    className={`count-circle ${ModelFun.isStepComplete(
                                      modelStep,
                                      NumberLimit.FOUR
                                    ) && !ModelFun.isStepFour(modelStep)
                                        ? 'active'
                                        : stepHeaderClass(NumberLimit.FOUR)
                                      }`}
                                  >
                                    <span>{NumberLimit.FOUR}</span>
                                  </div>
                                  <div className='heading'>
                                    <h3>
                                      Augmentation
                                      {ModelFun.isStepComplete(
                                        modelStep,
                                        NumberLimit.FOUR
                                      ) && (
                                          <>
                                            {!ModelFun.isStepFour(modelStep) && (
                                              <>
                                                <div className='mlp50'>
                                                  {!!countAugmentationFilter() && (
                                                    <span className='tag grey'>
                                                      Filter Count:{' '}
                                                      {countAugmentationFilter()}
                                                    </span>
                                                  )}
                                                </div>
                                                <button
                                                  type='button'
                                                  className='btn link-btn'
                                                  onClick={() => {
                                                    setModelStep(
                                                      NumberLimit.FOUR
                                                    );
                                                  }}
                                                >
                                                  View
                                                </button>
                                              </>
                                            )}
                                          </>
                                        )}
                                    </h3>
                                    <div
                                      className={`sm-txt ${!ModelFun.isStepFour(modelStep) &&
                                        'd-none'
                                        }`}
                                    >
                                      Create new training examples for your
                                      model to learn from by generating
                                      augmented versions of each image in your
                                      training set.
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div
                                className={`hide-body step-4-body ${!ModelFun.isStepFour(modelStep) && 'd-none'
                                  }`}
                              >
                                <div className='preprocessing-wrapper'>
                                  <AugmentationFilterList
                                    editAugmentationFilter={
                                      editAugmentationFilter
                                    }
                                    removeAugementaion={removeAugementaion}
                                    modelData={defaulData}
                                    setIsUpdate={setIsUpdate}
                                    isUpdate={isUpdate}
                                    degreeRange={degreeRange}
                                  />
                                  <button
                                    type='button'
                                    className='btn link-btn preprocessing-btn'
                                    onClick={() => {
                                      setOpenAugmentation(true);
                                    }}
                                  >
                                    <img
                                      src={PLUS_CIRCLE_ICON}
                                      alt='plus icon'
                                    />{' '}
                                    Add Augmentation Step
                                  </button>
                                  <Col className='footer-btn' sm={12}>
                                    <button
                                      type='button'
                                      className='btn primary-btn continue-btn'
                                      onClick={() => {
                                        setModelStep(NumberLimit.FIVE);
                                      }}
                                    >
                                      Continue
                                    </button>
                                  </Col>
                                </div>
                              </div>
                            </div>
                            {/* img-data-wrapper */}
                          </div>
                        </div>
                      </div>
                      {/* accordion-steps */}```
                    </>
                  )}

                  <div className='accordion-steps accordion-item'>
                    <div className='accordion-body'>
                      <div className='step-5'>
                        <div className='img-data-wrapper'>
                          <div className='page-header'>
                            <div className='left-item'>
                              <div
                                className={`count-circle ${stepHeaderClass(
                                  NumberLimit.FIVE
                                )}`}
                              >
                                <span>
                                  {MODEL_IMAGE_FILTER
                                    ? NumberLimit.FIVE
                                    : NumberLimit.THREE}
                                </span>
                              </div>
                              <div className='heading'>
                                <h3>Generate</h3>
                                <div
                                  className={`sm-txt ${!ModelFun.isStepFive(modelStep) && 'd-none'
                                    }`}
                                >
                                  Review your selections, then click 'Generate' to create a moment-in-time snapshot of your dataset with the 
applied pre-processing steps.
                                </div>
                              </div>
                            </div>
                          </div>
                          <div
                            className={`hide-body step-5-body ${!ModelFun.isStepFive(modelStep) && 'd-none'
                              }`}
                          >
                            <Col className='footer-btn' sm={12}>
                              <button
                                type='button'
                                className='btn primary-btn continue-btn'
                                onClick={() => generateNewModel()}
                              >
                                Generate New Model
                              </button>
                            </Col>
                          </div>
                        </div>
                        {/* img-data-wrapper */}
                      </div>
                    </div>
                  </div>
                  {/* accordion-steps */}
                </div>
              </div>
              {/* right-item */}

              <div
                className={`modal-right-item view-mode  ${!ModelFun.isModelView(modelAction) && 'd-none'
                  }`}
              >
                <ModelName
                  modelData={modelData}
                  isEditName={isEditName}
                  setIsEditName={setIsEditName}
                  deleteModel={openConfirmDelete}
                  forUpdateModelData={forUpdateModelData}
                  checkModelState={checkModelState}
                />
                {/* section */}
                <div className={`section section-2 ${hideCreateView()}`}>
                  {(checkModelState(MODEL_STATUS.INITIALIZED) || checkModelState(MODEL_STATUS.ERR)) && (
                    <div className='page-header'>
                      <div className='left-item'>
                        <h3>
                          Start training your model{' '}
                          <span className='sm-txt'>
                          Let us train your model and get results within 2-4 hours, along with a hosted API endpoint for making predictions. 
                          </span>
                        </h3>
                      </div>
                      <div className='right-item display-icon-setting'>
                        <button
                          type='button'
                          className='btn primary-btn start-btn'
                          disabled={isEditName}
                          onClick={() => {
                            startTraining();
                          }}
                        >
                          Start Training
                        </button>

                        {/* for Object Detection Parameters */}
                        <Dropdown className='setting-dropdown' autoClose={false} show={classificationDrop}>
                          <Dropdown.Toggle variant="success"  id="dropdown-basic" className='setting-dropdown-btn'>
                            <img src={ICON_SETTING} alt='Icon Setting' onClick={setClassificationData} />
                          </Dropdown.Toggle>
                          <Dropdown.Menu>
                            <div className='setting-wrraper'>
                              <div className='header-wrapper'>
                                <div className='header-sec'>
                                  {project.annotation_type==="classification"?<div className='header-title'>Classification Parameters</div>:<div className='header-title'>Object Detection Parameters</div>}
                                  <div className='header-close'>
                                    <img src={CROSS_WHITE} alt='Cross White' style={{cursor:"pointer"}} onClick={()=>setClassificationDrop(false)}/>
                                  </div>
                                </div>
                                <div className='header-subtitle'>You can adjust these default parameters for train as per your preference</div>
                              </div>
                              <div className='body-sec'>
                                <div className='row row-margin'>
                                  <div className='col-6 col-padding'>
                                    <div className='modal-input-sec'>
                                      <OverlayTrigger placement="top" overlay={tooltip.max_runtime_seconds}>
                                        <div className='modal-input-label'>Max runtime Seconds</div>
                                      </OverlayTrigger>
                                      <input type="number" onKeyPress={preventKey} onWheel={numberInputOnWheelPreventChange} onChange={(e)=>setHyperParameters({...hyperparameters,[e.target.name]:e.target.value})} value={hyperparameters.max_runtime_seconds} name="max_runtime_seconds" className="form-control" />
                                    </div>
                                   {/* <span className='error'>{"email is required"}</span> */}
                                  </div>
                                  <div className='col-6 col-padding'>
                                    <div className='modal-input-sec'>
                                      <OverlayTrigger placement="top" overlay={tooltip.maximum_retry_attempts}>
                                        <div className='modal-input-label'>Max retry attempts</div>
                                      </OverlayTrigger>
                                      <input type="number" onKeyPress={preventKey} onWheel={numberInputOnWheelPreventChange} value={hyperparameters.maximum_retry_attempts} name="maximum_retry_attempts" onChange={(e)=>setHyperParameters({...hyperparameters,[e.target.name]:e.target.value})} className="form-control"></input>
                                    </div>
                                  </div>
                                  <div className='col-6 col-padding'>
                                    <div className='modal-input-sec'>
                                      <OverlayTrigger placement="top" overlay={tooltip.max_number_training_jobs}>
                                        <div className='modal-input-label'>Max number training jobs</div>
                                      </OverlayTrigger>
                                      <input type="number" onKeyPress={preventKey} onWheel={numberInputOnWheelPreventChange} value={hyperparameters.max_number_training_jobs} name="max_number_training_jobs" onChange={(e)=>setHyperParameters({...hyperparameters,[e.target.name]:e.target.value})} className="form-control"></input>
                                    </div>
                                  </div>
                                  <div className='col-6 col-padding'>
                                    <div className='modal-input-sec'>
                                      <OverlayTrigger placement="top" overlay={tooltip.instance_type}>
                                        <div className='modal-input-label'>Instance Type</div>
                                      </OverlayTrigger>
                                      <input type="text" value={hyperparameters.instance_type} name="instance_type" onChange={(e)=>setHyperParameters({...hyperparameters,[e.target.name]:e.target.value})} className="form-control"></input>
                                    </div>
                                  </div>
                                  {project.annotation_type==="classification" &&<div className='col-6 col-padding'>
                                    <div className='modal-input-sec'>
                                      <OverlayTrigger placement="top" overlay={tooltip.num_layers}>
                                        <div className='modal-input-label'>num layers</div>
                                      </OverlayTrigger>
                                      <input type="number" onKeyPress={preventKey} onWheel={numberInputOnWheelPreventChange} value={hyperparameters.num_layers} name="num_layers" onChange={(e)=>setHyperParameters({...hyperparameters,[e.target.name]:e.target.value})} className="form-control"></input>
                                    </div>
                                  </div>}
                                  <div className='col-6 col-padding'>
                                    <div className='modal-input-sec'>
                                      <OverlayTrigger placement="top" overlay={tooltip.epochs}>
                                        <div className='modal-input-label'>epochs</div>
                                      </OverlayTrigger>
                                      <input type="number" onKeyPress={preventKey} onWheel={numberInputOnWheelPreventChange} value={hyperparameters.epochs} name="epochs" onChange={(e)=>setHyperParameters({...hyperparameters,[e.target.name]:e.target.value})} className="form-control"></input>
                                    </div>
                                  </div>
                                  <div className='col-6 col-padding'>
                                    <div className='modal-input-sec'>
                                      <OverlayTrigger placement="top" overlay={tooltip.lr_scheduler_step}>
                                        <div className='modal-input-label'>lr scheduler step</div>
                                      </OverlayTrigger>
                                      <input type="text" value={hyperparameters.lr_scheduler_step} name='lr_scheduler_step' onChange={(e)=>setHyperParameters({...hyperparameters,[e.target.name]:e.target.value})} className="form-control"></input>
                                    </div>
                                  </div>
                                  <div className='col-6 col-padding'>
                                    <div className='modal-input-sec'>
                                      <OverlayTrigger placement="top" overlay={tooltip.lr_scheduler_factor}>
                                        <div className='modal-input-label'>lr scheduler factor</div>
                                      </OverlayTrigger>
                                      <input type="number" onKeyPress={preventKey} onWheel={numberInputOnWheelPreventChange} step="0.01" value={hyperparameters.lr_scheduler_factor} name="lr_scheduler_factor" onChange={(e)=>setHyperParameters({...hyperparameters,[e.target.name]:e.target.value})} className="form-control"></input>
                                    </div>
                                  </div>
                                  {project.annotation_type==="bounding_box" && <><div className='col-6 col-padding'>
                                    <div className='modal-input-sec'>
                                      <OverlayTrigger placement="top" overlay={tooltip.overlap_threshold}>
                                        <div className='modal-input-label'>Overlap Threshold</div>
                                      </OverlayTrigger>
                                      <input type="number" onKeyPress={preventKey} onWheel={numberInputOnWheelPreventChange} value={hyperparameters.overlap_threshold} name="overlap_threshold" onChange={(e)=>setHyperParameters({...hyperparameters,[e.target.name]:e.target.value})} className="form-control"></input>
                                    </div>
                                  </div>
                                  <div className='col-6 col-padding'>
                                    <div className='modal-input-sec'>
                                      <OverlayTrigger placement="top" overlay={tooltip.nms_threshold}>
                                        <div className='modal-input-label'>NMS Threshold</div>
                                      </OverlayTrigger>
                                      <input type="number" onKeyPress={preventKey} onWheel={numberInputOnWheelPreventChange} value={hyperparameters.nms_threshold} name="nms_threshold" onChange={(e)=>setHyperParameters({...hyperparameters,[e.target.name]:e.target.value})} className="form-control"></input>
                                    </div>
                                  </div>
                                  <div className='col-6 col-padding'>
                                    <div className='modal-input-sec'>
                                      <OverlayTrigger placement="top" overlay={tooltip.learning_rate}>
                                        <div className='modal-input-label'>learning Rate</div>
                                      </OverlayTrigger>
                                      <input type="number" onKeyPress={preventKey} onWheel={numberInputOnWheelPreventChange} value={hyperparameters.learning_rate} name="learning_rate" onChange={(e)=>setHyperParameters({...hyperparameters,[e.target.name]:e.target.value})} className="form-control"></input>
                                    </div>
                                  </div>
                                  <div className='col-6 col-padding'>
                                    <div className='modal-input-sec'>
                                      <OverlayTrigger placement="top" overlay={tooltip.weight_decay}>
                                        <div className='modal-input-label'>Weight Decay</div>
                                      </OverlayTrigger>
                                      <input type="number" onKeyPress={preventKey} onWheel={numberInputOnWheelPreventChange} value={hyperparameters.weight_decay} name="weight_decay" onChange={(e)=>setHyperParameters({...hyperparameters,[e.target.name]:e.target.value})} className="form-control"></input>
                                    </div>
                                  </div></>}
                                </div>
                              </div>
                              <div className='footer-sec'>
                                <div className='footer-btn'>
                                  <button className='btn link-btn btn-text' onClick={()=>setClassificationDrop(false)}>Cancel</button>
                                  <button className='btn secondary-btn' onClick={project.annotation_type === "classification" ? saveClassificationHyperparameters: saveBoundingHyperparameters}>Save</button>
                                </div>
                              </div>
                            </div>
                          </Dropdown.Menu>
                        </Dropdown>

                        {/* for Classification Parameters */}
                       
                      </div>
                    </div>
                  )}

                  {checkModelState(MODEL_STATUS.TRAINING) && (
                    <div className='page-header training-header'>
                      <div className='left-item flex'>
                        <div className='training-loader-box'>
                          <div className='loader-inline'>
                            <div className='loader-inner'></div>
                          </div>
                        </div>
                        <h3>
                          Training in progress{' '}
                          <span className='sm-txt'>
                          Let us train your model and get results within 2-4 hours, along with a hosted API endpoint for making predictions. 
                          </span>
                        </h3>
                      </div>
                    </div>
                  )}
                </div>
               
                {/* section */}

                <div
                  className={`section section-3 img-data-wrapper ${hideCreateView()}`}
                >
                  <div className='page-header'>
                    <div className='left-item'>
                      <h3>
                        Image Data{' '}
                        <span className='tag grey'>
                          {annotatedContent?.count} Images
                        </span>{' '}
                        <span className='tag grey'>
                          {getCount()} Classes{' '}
                        </span>
                      </h3>
                    </div>
                    <div className='right-item'>
                      <button
                        disabled={!annotatedContent?.count}
                        type='button'
                        className='btn link-btn view-all-btn'
                        onClick={viewAllImage}
                      >
                        Manage Images
                      </button>
                    </div>
                  </div>

                {isEmptyImageList() ? (
                  <div className='total-txt no-data'>No annotated image found!</div>
                ) : (
                  <DatasetImageListing
                    isSortList={true}
                    setAnnotatedContent={setAnnotatedContent}
                    imagesList={imagesList}
                    setImages={setImages}
                    callStats={false}
                  />
                )}
                </div>
                {/* section */}

                <div className={`section section-4 ${hideCreateView()}`}>
                  <div className='page-header'>
                    <div className='left-item'>
                      <h3>Train/Valid Split</h3>
                    </div>
                  </div>
                  {/* common code reuse it  */}
                  <Row className='train-wrapper'>
                    <TrainTestSplit
                      trainedPercent={trainedPercent}
                      trainedCount={trainedCount}
                      validPercent={validPercent}
                      validCount={validCount}
                      testPercent={testPercent}
                      testCount={testCount}
                    />
                  </Row>
                </div>
                {/* section */}

                {MODEL_IMAGE_FILTER && (
                  <>
                    <div className={`section section-5 ${hideCreateView()}`}>
                      <Row>
                        <Col sm={4}>
                          <h5>Preprocessing</h5>
                        </Col>
                        <Col sm={8}>
                          {displayPercentCrop(modelData)}
                          {modelData?.preprocessing?.resize && (
                            <p>
                              <span>Resize</span> -{' '}
                              {modelData?.preprocessing?.resize?.mode} to&nbsp;
                              {modelData?.preprocessing?.resize?.size?.height}x
                              {modelData?.preprocessing?.resize?.size?.width}
                            </p>
                          )}
                          {isEmptyObj(modelData?.preprocessing) && (
                            <p>No preprocessing were applied.</p>
                          )}
                          <p className='d-none'>
                            <span>Auto-Orient</span> - Applied
                          </p>
                        </Col>
                      </Row>
                    </div>
                    {/* section */}

                    <div className={`section section-5 ${hideCreateView()}`}>
                      <Row>
                        <Col sm={4}>
                          <h5>Augmentations</h5>
                        </Col>
                        <Col sm={8}>
                          {modelData?.augmentation?.flip?.horizontal && (
                            <p>
                              <span>Horizontal Flip</span> - Applied
                            </p>
                          )}
                          {modelData?.augmentation?.flip?.vertical && (
                            <p>
                              <span>Vertical Flip</span> - Applied
                            </p>
                          )}
                          {!isEmptyObj(
                            modelData?.augmentation?.color_jitter
                          ) && (
                              <p>
                                <span>Color Jitter</span>&nbsp;-&nbsp; Brightness:{' '}
                                {displayIntensity(
                                  modelData?.augmentation?.color_jitter
                                    ?.brightness
                                )}
                                &nbsp; Contrast:{' '}
                                {displayIntensity(
                                  modelData?.augmentation?.color_jitter?.contrast
                                )}
                                &nbsp; Hue:{' '}
                                {displayIntensity(
                                  modelData?.augmentation?.color_jitter?.hue
                                )}
                                &nbsp; Saturation:{' '}
                                {displayIntensity(
                                  modelData?.augmentation?.color_jitter
                                    ?.saturation
                                )}
                              </p>
                            )}
                          {modelData?.augmentation?.gaussian_blur
                            ?.intensity && (
                              <p>
                                <span>Gaussian Blur Intensity</span> -{' '}
                                {displayIntensity(
                                  modelData?.augmentation?.gaussian_blur
                                    ?.intensity
                                )}
                              </p>
                            )}
                          {modelData?.augmentation?.greyscale?.enabled && (
                            <p>
                              <span>Greyscale</span> - Applied
                            </p>
                          )}
                          {modelData?.augmentation?.jpeg_compression
                            ?.enabled && (
                              <p>
                                <span>Jpeg Compression</span> - Applied
                              </p>
                            )}
                          {modelData?.augmentation?.noise?.intensity && (
                            <p>
                              <span>Noise Intensity</span> -{' '}
                              {displayIntensity(
                                modelData?.augmentation?.noise?.intensity
                              )}
                            </p>
                          )}
                          {modelData?.augmentation?.random_crop?.enabled && (
                            <p>
                              <span>Random Crop</span> - Applied
                            </p>
                          )}
                          {modelData?.augmentation?.random_erasing?.enabled && (
                            <p>
                              <span>Random Erasing</span> - Applied
                            </p>
                          )}
                          {modelData?.augmentation?.rotate?.degree && (
                            <p>
                              <span>Rotate</span> -{' '}
                              {modelData?.augmentation?.rotate?.degree} degree
                            </p>
                          )}
                          {isEmptyObj(modelData?.augmentation) && (
                            <p>No augmentations were applied.</p>
                          )}
                        </Col>
                      </Row>
                    </div>
                    {/* section */}
                  </>
                )}

                <div className={`section section-5 ${hideCreateView()}`}>
                  <Row>
                    <Col sm={4}>
                      <h5>Details</h5>
                    </Col>
                    <Col sm={8}>
                      <p>
                        <span>Model Name</span> - {modelData?.name}
                      </p>
                      <p>
                        <span>Model ID</span> - {modelData?.id || '-'}
                      </p>
                      <p>
                        <span>Generated</span> -{' '}
                        {changeDateFormat(modelData?.created_at)}
                      </p>
                    </Col>
                  </Row>
                </div>
                {/* section model detail*/}

                {modelData?.state === MODEL_STATUS.TRAINED && (
                  <ModelDetail
                    trainedPercent={trainedPercent}
                    trainedCount={trainedCount}
                    validPercent={validPercent}
                    validCount={validCount}
                    testPercent={testPercent}
                    testCount={testCount}
                    modelData={modelData}
                    isEmptyObj={isEmptyObj}
                    statistics={statistics}
                    fetchModelDetail={fetchModelDetail}
                    setIsLoading={setIsLoading}
                    project={project}
                    disconnectModelSocket={disconnectModelSocket}
                    connectWithModelSocket={connectWithModelSocket}
                    setIsInsight={setIsInsight}
                    isInsight={isInsight}
                    getModelList={getModelList}
                  />
                )}
                {/* section model detail */}
              </div>
            </Col>
          </Row>
        </div>

        {openPreprocessing && (
          <PreprocessingOptions
            show={openPreprocessing}
            closeModal={() => {
              setOpenPreprocessiong(false);
            }}
            setPreprocessiongFilter={setPreprocessiongFilter}
            setFilterType={setFilterType}
          />
        )}
        {preprocessingFilter && (
          <PreprocessingFilter
            show={preprocessingFilter}
            closeModal={() => {
              setPreprocessiongFilter(false);
            }}
            filterType={filterType}
            applyPreprocessigFilter={applyPreprocessigFilter}
            closeModalParent={() => {
              setOpenPreprocessiong(false);
            }}
            streachRange={streachRange}
            setStreachRange={setStreachRange}
            staticCropRange={staticCropRange}
            setStaticCropRange={setStaticCropRange}
            staticCropVerRange={staticCropVerRange}
            setStaticCropVerRange={setStaticCropVerRange}
            setFilterType={setFilterType}
            defaulData={defaulData}
          />
        )}

        {openAugmentation && (
          <AugmentationOptions
            show={openAugmentation}
            closeModal={() => {
              setOpenAugmentation(false);
            }}
            setAugmentationFilter={setAugmentationFilter}
            setFilterType={setFilterType}
          />
        )}
        {augmentationFilter && (
          <AugmentationFilter
            filterType={filterType}
            show={augmentationFilter}
            closeModal={() => {
              setAugmentationFilter(false);
            }}
            closeModalParent={() => {
              setOpenAugmentation(false);
            }}
            flipHorizontal={flipHorizontal}
            setFlipHorizontal={setFlipHorizontal}
            flipVertical={flipVertical}
            setFlipVertical={setFlipVertical}
            setIsUpdate={setIsUpdate}
            isUpdate={isUpdate}
            degree={degree}
            setDegree={setDegree}
            defaulData={defaulData}
            setDefaultData={setDefaultData}
            degreeRange={degreeRange}
            setDegreeRange={setDegreeRange}
            noiseIntensity={noiseIntensity}
            setNoiseIntensity={setNoiseIntensity}
            jitterIntensity={jitterIntensity}
            setJitterIntensity={setJitterIntensity}
            gaussianIntensity={gaussianIntensity}
            setGaussianIntensity={setGaussianIntensity}
          />
        )}

        {confirDelete && (
          <DeleteEndpoint
            show={confirDelete}
            closeModal={closeDelete}
            callBack={deleteModel}
            headingText={'Delete Model'}
            bodyText={'Are you sure you want to delete this model?'}
          />
        )}
        <ViewAllDatasetimages
          isOpen={isViewAllImage}
          hideViewAll={() => {
            setViewAllImage(false);
          }}
          setAnnotatedContent={setAnnotatedContent}
          annotatedContent={annotatedContent}
          fetchDataForStats={initialStats}
          setIsLoading={setIsLoading}
          isLoading={isLoading}
          callStats={false}
        />
        <UploadErrModal
          show={showParameterAlert}
          message={'Changing these setting may incur additional cost'}
          closeModal={()=>setShowParameterAlert(false)}
        />
        <ConfirmParameterModal 
          show={confirmParameter}
          closeModal={()=>setShowConfirmParameter(false)}
          submit={confirmSaveParams}
          />
        {split && <Split show={split} closeModal={closeSplit} />}
      </>
    </Layout>
  );
};

export default Step4;
