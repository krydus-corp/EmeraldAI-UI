import { Row, Col, ListGroup, Dropdown } from 'react-bootstrap';
import NavBar from '../templates/NavBar';
import { CLOSE_WHITE, SMALL_CIRCLE, DRAG_IMGES } from '../../../constant/image';
import { useNavigate } from 'react-router-dom';
import { PROJECT_OVERVIEW_STEP4 } from '../../../utils/routeConstants';
import { NumberLimit } from '../../../constant/number';
import { useEffect, useState } from 'react';
import { getModelDetail } from '../../../service/model';
import { getAnnotateStats } from '../../../service/annotate';
import ModelDetailData from './model/ModelDetailData';
import PreprocessingData from './model/PreprocessingData';
import AugmentationData from './model/AugmentationData';
import { MODEL_IMAGE_FILTER, MODEL_STATUS } from '../../../constant/static';
import ChartDataView from './ChartDataView';
import Loader from '../common/Loader';
import ImagesCount from './model/ImagesCount';
import AnnotationCount from './model/AnnotationCount';
import AverageImageSize from './model/AverageImageSize';
import MedianImageRatio from './model/MedianImageRatio';
import ClassBalance from './model/ClassBalance';
import SizeDistribution from './model/SizeDistribution';
import { getCurrentDataSetApi } from '../../../service/project';
import TrainTestSplit from './model/TrainTestSplit';
import { useSelector } from 'react-redux';

const ModalTrainingCompare = () => {
  const { project } = useSelector((state: any) => state);
  const parm = new URLSearchParams(window.location.search);
  const previousRouter = parm.get('from')
    ? parm.get('from')
    : PROJECT_OVERVIEW_STEP4;
  const comid = parm.get('comid') ? parm.get('comid') : '';
  const pid = parm.get('pid') ? parm.get('pid') : '';
  const navigate = useNavigate();
  const modelsId = comid ? comid?.split(',') : [];
  const [isLoader, setIsLoader] = useState(false);
  const [isStatsLoader, setIsStatsLoader] = useState(false);
  const modelOne = modelsId[NumberLimit.ZERO] || '';
  const modelTwo = modelsId[NumberLimit.ONE] || '';
  const [datasetOne, setDatasetOne] = useState('');
  const [datasetTwo, setDatasetTwo] = useState('');
  const [datasetOneDetail, setDatasetOneDetail] = useState(Object);
  const [datasetTwoDetail, setDatasetTwoDetail] = useState(Object);
  const [modelOneData, setModelOneData] = useState(Object);
  const [modelTwoData, setModelTwoData] = useState(Object);
  const [statsOneData, setStatsOneData] = useState(Object);
  const [statsTwoData, setStatsTwoData] = useState(Object);
  const [trainLoader, setTrainLoader] = useState(false);
  const [trainedPercent, setTrainPercent] = useState(NumberLimit.ZERO);
  const [validPercent, setValidPercent] = useState(NumberLimit.ZERO);
  const [testPercent, setTestPercent] = useState(NumberLimit.ZERO);
  const [trainedCount, setTrainCount] = useState(NumberLimit.ZERO);
  const [validCount, setValidCount] = useState(NumberLimit.ZERO);
  const [testCount, setTestCount] = useState(NumberLimit.ZERO);
  const [trainedPercentTwo, setTrainPercentTwo] = useState(NumberLimit.ZERO);
  const [validPercentTwo, setValidPercentTwo] = useState(NumberLimit.ZERO);
  const [testPercentTwo, setTestPercentTwo] = useState(NumberLimit.ZERO);
  const [trainedCountTwo, setTrainCountTwo] = useState(NumberLimit.ZERO);
  const [validCountTwo, setValidCountTwo] = useState(NumberLimit.ZERO);
  const [testCountTwo, setTestCountTwo] = useState(NumberLimit.ZERO);
 
  const fetchModelData = (
    mId: string | null,
    setData: Function,
    setDatasetId: Function
  ) => {
    if (mId) {
      setIsLoader(true);
      getModelDetail(mId)
        .then((res) => {
          if (res.data) {
            setData(res.data);
            setDatasetId(res?.data?.datasetid);
          }
          setIsLoader(false);
        })
        .catch((e) => {
          setIsLoader(false);
        });
    }
  };

  useEffect(() => {
    if (modelOne) {
      fetchModelData(modelOne, setModelOneData, setDatasetOne);
    }
    if (modelTwo) {
      fetchModelData(modelTwo, setModelTwoData, setDatasetTwo);
    }
  }, [modelOne, modelTwo]);

  const fetchDataForStats = (datasetid = '', setStatsData: Function) => {
    setIsStatsLoader(true);
    getAnnotateStats(pid || '', datasetid)
      .then((res: any) => {
        setIsStatsLoader(false);
        if (res?.data?.statistics) {
          setStatsData(res?.data?.statistics);
        }
      })
      .catch(() => {
        setIsStatsLoader(false);
      });
  };

  useEffect(() => {
    datasetOne && fetchDataForStats(datasetOne, setStatsOneData);
  }, [datasetOne]);

  useEffect(() => {
    datasetTwo && fetchDataForStats(datasetTwo, setStatsTwoData);
  }, [datasetTwo]);

  const fetchDatasetDetail = (datasetid = '', setDatasetDetail: Function) => {
    setTrainLoader(true);
    getCurrentDataSetApi(datasetid)
      .then((res) => {
        if (res?.data?.dataset) {
          setDatasetDetail(res?.data?.dataset);
        }
        setTrainLoader(false);        
      })
      .catch((err) => {
        setTrainLoader(false);
      });
  };

  useEffect(() => {
    datasetOne && fetchDatasetDetail(datasetOne, setDatasetOneDetail);
  }, [datasetOne]);

  useEffect(() => {
    datasetTwo && fetchDatasetDetail(datasetTwo, setDatasetTwoDetail);
  }, [datasetTwo]);

  const closeCompareModel = () => {
    navigate(`${previousRouter}/${pid}?comid=${comid}`);
  };

  const isEmptyObjData = (objValue = {}) => {
    return !Object.keys(objValue).length;
  };

  const isStatsEmpty = (statisticsData: Object) => {
    return statisticsData ? !('total_annotations' in statisticsData) : true;
  };

  const classesCount = (stats: any) => {
    return isStatsEmpty(stats)
      ? NumberLimit.ZERO
      : Object.keys(stats?.annotations_per_class).length;
  };

  const calcuateImgSizeInMB = (stats: any) => {
    if (stats?.average_image_size_bytes) {
      const average= (stats?.average_image_size_bytes /
        Math.pow(NumberLimit.THOUSAND_TWENTY_FOUR, NumberLimit.TWO)
      ).toFixed(NumberLimit.TWO) 
      return `${average}`;
    } else {
      return `${NumberLimit.ZERO}`;
    }
  };

  const calcuateMaxImgSize = (stats: any) => {
    if (stats?.max_image_size_bytes) {

      const max= (
        stats?.max_image_size_bytes /
        Math.pow(NumberLimit.THOUSAND_TWENTY_FOUR, NumberLimit.TWO)
      ).toFixed(NumberLimit.TWO);
      return `${max}`;

    } else {
      return `${NumberLimit.ZERO}`;
    }
  };

  const calcuateMinImgSize = (stats: any) => {
    if (stats?.min_image_size_bytes) {
      const min = (
        stats?.min_image_size_bytes /
        Math.pow(NumberLimit.THOUSAND_TWENTY_FOUR, NumberLimit.TWO)
      ).toFixed(NumberLimit.TWO);
      return `${min}`;

    } else {
      return `${NumberLimit.ZERO}`;
    }
  };

  const setTrainTestValidData = (dataset: any, stats: any) => {
    const trainValue = dataset?.split?.train
      ? Math.round(dataset?.split?.train * NumberLimit.ONE_HUNDRED)
      : NumberLimit.ZERO;
    const testValue = dataset?.split?.test
      ? Math.round(dataset?.split?.test * NumberLimit.ONE_HUNDRED)
      : NumberLimit.ZERO;
    const validValue = dataset?.split?.validation
      ? Math.round(dataset?.split?.validation * NumberLimit.ONE_HUNDRED)
      : NumberLimit.ZERO;
    const trainCount = Math.round(
      (stats?.total_annotated_images / NumberLimit.ONE_HUNDRED) * trainValue
    );
    const validCountValue = Math.round(
      (stats?.total_annotated_images / NumberLimit.ONE_HUNDRED) * validValue
    );
    const testCountValue = testValue === NumberLimit.ZERO ? NumberLimit.ZERO : stats?.total_annotated_images - (trainCount + validCountValue)
    return {
      trainValue,
      testValue,
      validValue,
      trainCount,
      testCountValue,
      validCountValue,
    };
  };

  useEffect(() => {
    const dataObj = setTrainTestValidData(datasetOneDetail, statsOneData);
    setTrainPercent(dataObj?.trainValue);
    setTestPercent(dataObj?.testValue);
    setValidPercent(dataObj?.validValue);
    setTrainCount(dataObj?.trainCount);
    setTestCount(dataObj?.testCountValue);
    setValidCount(dataObj?.validCountValue);
  }, [datasetOneDetail, statsOneData]);

  useEffect(() => {
    const dataObj = setTrainTestValidData(datasetTwoDetail, statsTwoData);
    setTrainPercentTwo(dataObj?.trainValue);
    setTestPercentTwo(dataObj?.testValue);
    setValidPercentTwo(dataObj?.validValue);
    setTrainCountTwo(dataObj?.trainCount);
    setTestCountTwo(dataObj?.testCountValue);
    setValidCountTwo(dataObj?.validCountValue);
  }, [datasetTwoDetail, statsTwoData]);


  return (
    <>
     {isStatsLoader && (
        <div className='loader'>
          <div className='loader-inner'></div>
        </div>
      )}
    <NavBar>
      <div className='modal-compare-container'>
        <Loader isLoading={isLoader} />
        <div className='page-header'>
          <h3>Compare Models</h3>
          <button
            type='button'
            className='btn link-btn'
            onClick={() => {
              closeCompareModel();
            }}
          >
            <img src={CLOSE_WHITE} alt='close' /> Close Compare Models
          </button>
        </div>

        <Row className='compare-header-box step-1'>
          <Col sm='2'></Col>
          <Col sm='5'>
            <h3>
              {modelOneData?.name}
              {modelOneData?.state === MODEL_STATUS.TRAINED && (
                <span className='sm-txt'>
                  Traning completed <img src={SMALL_CIRCLE} alt='close' />
                </span>
              )}
            </h3>
          </Col>
          <Col sm='5'>
            <h3>
              {modelTwoData?.name}
              {modelTwoData?.state === MODEL_STATUS.TRAINED && (
                <span className='sm-txt'>
                  Traning completed <img src={SMALL_CIRCLE} alt='close' />
                </span>
              )}
            </h3>
          </Col>
        </Row>

        <Row className='compare-box step-2'>
          <Col sm='2'>
            <h4>Details</h4>
          </Col>
          <Col sm='5'>
            <ModelDetailData modelData={modelOneData} project={project} />
          </Col>
          <Col sm='5'>
            <ModelDetailData modelData={modelTwoData} project={project} />
          </Col>
        </Row>

        {MODEL_IMAGE_FILTER && (
          <>
            <Row className='compare-box step-3'>
              <Col sm='2'>
                <h4>Preprocessing</h4>
              </Col>
              <Col sm='5'>
                <PreprocessingData
                  modelData={modelOneData}
                  isEmptyObj={isEmptyObjData}
                />
              </Col>
              <Col sm='5'>
                <PreprocessingData
                  modelData={modelTwoData}
                  isEmptyObj={isEmptyObjData}
                />
              </Col>
            </Row>
            <Row className='compare-box step-4'>
              <Col sm='2'>
                <h4>Augmentations</h4>
              </Col>
              <Col sm='5'>
                <AugmentationData
                  modelData={modelOneData}
                  isEmptyObj={isEmptyObjData}
                />
              </Col>
              <Col sm='5'>
                <AugmentationData
                  modelData={modelTwoData}
                  isEmptyObj={isEmptyObjData}
                />
              </Col>
            </Row>
          </>
        )}

        <Row className='compare-box step-5 d-none'>
          <Col sm='2'>
            <h4>File-Drop</h4>
          </Col>
          <Col sm='5'>
            <div className='detail-box'>
              <p>Select a random image and run a test against that image.</p>
              <div className='file-upload-box'>
                <ListGroup horizontal>
                  <ListGroup.Item>
                    <img src={DRAG_IMGES} alt='images' /> Drag & drop image
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <button type='button' className='btn link-btn'>
                      <input type='file' />
                      Import from computer
                    </button>
                  </ListGroup.Item>
                </ListGroup>
              </div>
            </div>
          </Col>
          <Col sm='5'>
            <div className='detail-box'>
              <p>Select a random image and run a test against that image.</p>
              <div className='file-upload-box'>
                <ListGroup horizontal>
                  <ListGroup.Item>
                    <img src={DRAG_IMGES} alt='images' /> Drag & drop image
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <button type='button' className='btn link-btn'>
                      <input type='file' />
                      Import from computer
                    </button>
                  </ListGroup.Item>
                </ListGroup>
              </div>
            </div>
          </Col>
        </Row>

        <Row className='compare-box step-6'>
          <Col sm='2'>
            <h4>Train/Valid Split</h4>
          </Col>
          <Col sm='5'>
            <Row className='train-wrapper'>
              {!trainLoader && (
                <TrainTestSplit
                  trainedPercent={trainedPercent}
                  trainedCount={trainedCount}
                  validPercent={validPercent}
                  validCount={validCount}
                  testPercent={testPercent}
                  testCount={testCount}
                />
              )}
            </Row>
          </Col>
          <Col sm='5'>
            <Row className='train-wrapper'>
              {!trainLoader && (
                <TrainTestSplit
                  trainedPercent={trainedPercentTwo}
                  trainedCount={trainedCountTwo}
                  validPercent={validPercentTwo}
                  validCount={validCountTwo}
                  testPercent={testPercentTwo}
                  testCount={testCountTwo}
                />
              )}
            </Row>
          </Col>
        </Row>

        <Row className='compare-box step-7'>
          <Col sm='2'>
            <h4>Deployment Info</h4>
          </Col>
          <Col sm='5'>
            <div className='drop-box d-none'>
              <Dropdown>
                <Dropdown.Toggle
                  className='btn secondary-btn'
                  id='dropdown-basic'
                >
                  All
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  <Dropdown.Item href='#/action-1'>Action</Dropdown.Item>
                  <Dropdown.Item href='#/action-2'>
                    Another action
                  </Dropdown.Item>
                  <Dropdown.Item href='#/action-3'>
                    Something else
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>

            <div className='detail-box'>
              <p>How uncertain on average for a particular class</p>
              <div className='chart-box mb32'>
                {!isStatsLoader && statsOneData && (
                  <ChartDataView
                    statsData={statsOneData}
                    isModalPopup={false}
                    isBarChart={true}
                    setBarChart={() => {}}
                    isChartOnly={true}
                    height={`${NumberLimit.TWO_HUNDRED_FIFTY}px`}
                  />
                )}
              </div>
              {/* <p className='mt40'>Class Distribution (Count per class)</p>
              <div className='chart-box'>
                {!isStatsLoader && statsOneData && (
                  <ChartDataView
                    statsData={statsOneData}
                    isModalPopup={false}
                    isBarChart={false}
                    setBarChart={() => {}}
                    isChartOnly={true}
                  />
                )}
              </div> */}
            </div>
          </Col>
          <Col sm='5'>
            <div className='drop-box d-none'>
              <Dropdown>
                <Dropdown.Toggle
                  className='btn secondary-btn'
                  id='dropdown-basic'
                >
                  All
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  <Dropdown.Item href='#/action-1'>Action</Dropdown.Item>
                  <Dropdown.Item href='#/action-2'>
                    Another action
                  </Dropdown.Item>
                  <Dropdown.Item href='#/action-3'>
                    Something else
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>

            <div className='detail-box'>
              <p>How uncertain on average for a particular class</p>
              <div className='chart-box mb32'>
                {!isStatsLoader && statsTwoData && (
                  <ChartDataView
                    statsData={statsTwoData}
                    isModalPopup={false}
                    isBarChart={true}
                    setBarChart={() => {}}
                    isChartOnly={true}
                    height={`${NumberLimit.TWO_HUNDRED_FIFTY}px`}
                  />
                )}
              </div>
              {/* <p className='mt40'>Class Distribution (Count per class)</p>
              <div className='chart-box'>
                {!isStatsLoader && statsTwoData && (
                  <ChartDataView
                    statsData={statsTwoData}
                    isModalPopup={false}
                    isBarChart={false}
                    setBarChart={() => {}}
                    isChartOnly={true}
                  />
                )}
              </div> */}
            </div>
          </Col>
        </Row>

        <Row className='compare-header-box step-8'>
          <Col sm='6'>
            <h4>Model Insights</h4>
          </Col>
          <Col sm='6'>
            <div className='drop-box d-none'>
              <Dropdown>
                <Dropdown.Toggle
                  className='btn secondary-btn'
                  id='dropdown-basic'
                >
                  All
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  <Dropdown.Item href='#/action-1'>Action</Dropdown.Item>
                  <Dropdown.Item href='#/action-2'>
                    Another action
                  </Dropdown.Item>
                  <Dropdown.Item href='#/action-3'>
                    Something else
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>
          </Col>
        </Row>

        <Row className='compare-box step-9'>
          <Col sm='2'>
            <h4>Images</h4>
          </Col>
          <Col sm='5'>
            <div className='detail-box sm-box'>
              <ImagesCount
                imagesCount={statsOneData?.total_annotated_images}
                missingAnnotation={NumberLimit.ZERO}
                nullExample={statsOneData?.annotated_null_images}
              />
            </div>
          </Col>
          <Col sm='5'>
            <div className='detail-box sm-box'>
              <ImagesCount
                imagesCount={statsTwoData?.total_annotated_images}
                missingAnnotation={NumberLimit.ZERO}
                nullExample={statsTwoData?.annotated_null_images}
              />
            </div>
          </Col>
        </Row>

        <Row className='compare-box step-10'>
          <Col sm='2'>
            <h4>Annotation</h4>
          </Col>
          <Col sm='5'>
            <div className='detail-box sm-box'>
              <AnnotationCount
                annotationCount={statsOneData?.total_annotations}
                averagePerImage={statsOneData?.average_annotations_per_image}
                classesCount={classesCount(statsOneData)}
              />
            </div>
          </Col>
          <Col sm='5'>
            <div className='detail-box sm-box'>
              <AnnotationCount
                annotationCount={statsTwoData?.total_annotations}
                averagePerImage={statsTwoData?.average_annotations_per_image}
                classesCount={classesCount(statsTwoData)}
              />
            </div>
          </Col>
        </Row>

        <Row className='compare-box step-11'>
          <Col sm='2'>
            <h4>Average Image Size</h4>
          </Col>
          <Col sm='5'>
            <div className='detail-box sm-box'>
              <AverageImageSize
                calcuateAvgImgSize={() => {
                  return calcuateImgSizeInMB(statsOneData);
                }}
                calcuateMaxImgSize={() => {
                  return calcuateMaxImgSize(statsOneData);
                }}
                calcuateMinImgSize={() => {
                  return calcuateMinImgSize(statsOneData);
                }}
              />
            </div>
          </Col>
          <Col sm='5'>
            <div className='detail-box sm-box'>
              <AverageImageSize
                calcuateAvgImgSize={() => {
                  return calcuateImgSizeInMB(statsTwoData);
                }}
                calcuateMaxImgSize={() => {
                  return calcuateMaxImgSize(statsTwoData);
                }}
                calcuateMinImgSize={() => {
                  return calcuateMinImgSize(statsTwoData);
                }}
              />
            </div>
          </Col>
        </Row>

        <Row className='compare-box step-12'>
          <Col sm='2'>
            <h4>Median Image Ratio</h4>
          </Col>
          <Col sm='5'>
            <div className='detail-box sm-box'>
              <MedianImageRatio
                averageImageHeightPixels={statsOneData?.insights?.median_height}
                averageImageWidthPixels={statsOneData?.insights?.median_width}
              />
            </div>
          </Col>
          <Col sm='5'>
            <div className='detail-box sm-box'>
              <MedianImageRatio
                averageImageHeightPixels={statsTwoData?.insights?.median_height}
                averageImageWidthPixels={statsTwoData?.insights?.median_width}
              />
            </div>
          </Col>
        </Row>

        <Row className='compare-box step-13'>
          <Col sm='2'>
            <h4>Class Balance</h4>
          </Col>
          <Col sm='5'>
            <div className='classblance-inner'>
              <ClassBalance
                statistics={statsOneData}
                classesCount={classesCount(statsOneData)}
              />
            </div>
          </Col>
          <Col sm='5'>
            <div className='classblance-inner'>
              <ClassBalance
                statistics={statsTwoData}
                classesCount={classesCount(statsTwoData)}
              />
            </div>
          </Col>
        </Row>

        <Row className='compare-box step-14'>
          <Col sm='2'>
            <h4>Dimension Insights</h4>
          </Col>
          <Col sm='5'>
            <SizeDistribution
              statistics={statsOneData}
              classesCount={classesCount(statsOneData)}
            />
          </Col>
          <Col sm='5'>
            <SizeDistribution
              statistics={statsTwoData}
              classesCount={classesCount(statsTwoData)}
            />
          </Col>
        </Row>

        <Row className='compare-box step-14 d-none'>
          <Col sm='2'>
            <h4>Dimension Insights</h4>
          </Col>
          <Col sm='5'>
            <div className='tag-box'>
              <span className='tag green'>All</span>
              <span className='tag grey green-txt'>Fighter Jet</span>
              <span className='tag grey purple-txt'>Cargo plane</span>
              <span className='tag grey blue-txt'>Army Chopper</span>
            </div>
            <div className='chart-box'>{/* chart code here */}</div>
          </Col>
        </Row>
      </div>
      {/* modal-compare-container */}
    </NavBar>
    </>
  );
};
export default ModalTrainingCompare;
