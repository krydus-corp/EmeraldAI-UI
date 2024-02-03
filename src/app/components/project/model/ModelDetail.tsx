import React, { useEffect, useState } from "react";
import { Col, Row, Tab, Nav, Dropdown as DropdownCode } from "react-bootstrap";
import Dropdown from "react-dropdown";
import { Buffer } from "buffer";
import "react-dropdown/style.css";
import * as curlconverter from "curlconverter";
import { useSelector, useDispatch } from "react-redux";
import { CodeBlock, a11yDark } from "react-code-blocks";
import { FILTER_ICON, DROP_DOWN } from "../../../../constant/image";
import { NumberLimit } from "../../../../constant/number";
import {
  DATASET_ID,
  MODEL_IMAGE_FILTER,
  MODEL_STATUS,
  NAME,
} from "../../../../constant/static";
import {
  SERVER_ALERT,
  SUCCESS_MESSAGE,
} from "../../../../constant/validations";
import {
  applyToProject,
  deleteTheModelDeploy,
  deployTheModel,
  getApplyToProject,
  getPredictionsImages,
  getPredictionsStatistics,
} from "../../../../service/model";
import { AppDispatch } from "../../../../store";
import MultiRange from "../../../../utils/MultiRange";
import { getTagsQuery } from "../../annotate/redux/annotateTags";
import PredictionsChart from "../../charts/PredictionsChart";
import { showToast } from "../../common/redux/toast";
import AnnotateFilterModal from "../../modals/AnnotateFilterModal";
import ConfirmModal from "../../modals/ConfirmModal";
import FileDropModal from "../../modals/FileDropModal";
import UncertainImgModal from "../../modals/uncertainImgModal";
import { getSingleContent } from "../redux/content";
import AnnotationCount from "./AnnotationCount";
import AugmentationData from "./AugmentationData";
import AverageImageSize from "./AverageImageSize";
import ClassBalance from "./ClassBalance";
import FileDrop from "./FileDrop";
import ImagesCount from "./ImagesCount";
import MedianImageRatio from "./MedianImageRatio";
import ModelDetailData from "./ModelDetailData";
import PreprocessingData from "./PreprocessingData";
import SizeDistribution from "./SizeDistribution";
import TrainTestSplit from "./TrainTestSplit";
import ViewMoreModelChart from "./ViewMoreModelData";
import { getContentApi } from "../../../../service/project";
import DeleteEndpoint from "../../modals/DeleteEndpointModal";

const deploymentInfo = [
  { value: "all", label: "All" },
  { value: "project", label: "Project" },
  { value: "external", label: "External" },
];

interface Props {
  trainedPercent: number;
  trainedCount: number;
  validPercent: number;
  validCount: number;
  testPercent: number;
  testCount: number;
  modelData: any;
  isEmptyObj: Function;
  statistics: any;
  fetchModelDetail: Function;
  setIsLoading: Function;
  project: any;
  disconnectModelSocket: Function;
  connectWithModelSocket: Function;
  setIsInsight: Function;
  isInsight: boolean;
  getModelList: Function;
}

const ModelDetail = ({
  trainedPercent,
  trainedCount,
  validPercent,
  validCount,
  testPercent,
  testCount,
  modelData,
  isEmptyObj,
  statistics,
  fetchModelDetail,
  setIsLoading,
  project,
  disconnectModelSocket,
  connectWithModelSocket,
  setIsInsight,
  isInsight,
  getModelList,
}: Props) => {
  const dispatch: AppDispatch = useDispatch();
  let resultedData: any = [];

  const { annotateTag, dataSet, content } = useSelector((state: any) => state);
  const [refreshDisabled, setRefreshDisabled] = useState<boolean>(false);
  const [applyStatus, setApplyStatus] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [imagesUploaded, setImagesUploaded] = useState([]);
  const [resultData, setResultData] = useState([{}]);
  const [applyLoader, setApplyLoader] = useState(false);
  const [isLoader, setIsLoader] = useState(false);
  const [uncertainImgLoader, setUncertainImgLoader] = useState(false);
  const [confirDelete, setConfrimDelete] = useState(false);
  const [isApplyProject, setIsApplyProject] = useState(false);
  const [predictionsData, setPredictionsData] = useState<any>(null);
  const [fetchPrediction, setFetchPrediction] = useState(false);
  const [filterModal, setFilterModal] = useState<boolean>(false);
  const [filterTagId, setFilterTagId] = useState<Array<string>>([]);
  const [range, setRange] = useState([90]);
  const [selectedTagData, setSelectedTagData] = useState<Array<string>>([]);
  const [showUncertainImg, setShowUncertainImg] = useState(false);
  const [imgToDisplay, setImgToDisplay] = useState<any>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isBarChart, setBarChart] = useState(true);
  const [tagData, setTagData] = useState<any>();
  const [uncertainLoader, setIsUncertainLoader] = useState<boolean>(false);
  const [unAnnotatedCount, setUnAnnotatedCount] = useState(NumberLimit.ZERO);
  const [colorIndex, setColorIndex] = useState<Array<number>>([]);
  const [duplicatePredictions, setDuplicatePredictions] = useState<any>(null);
  const [snippetCode, setSnippetCode] = useState<any>([]);
  const [codeSelected, setCodeSelected] = useState<any>("Python");
  const [copyCode, setCopyCode] = useState<any>("");
  useEffect(() => {
    if (showUncertainImg && isOpen) {
      setIsOpen(false);
    }
  }, [showUncertainImg]);

  useEffect(() => {
    setIsLoading(true);
    getContentApi(NumberLimit.FIFTY, NumberLimit.ZERO, project.id)
      .then((res: any) => {
        setUnAnnotatedCount(res.data.count);
        setIsLoading(false);
      })
      .catch((err) => {
        setIsLoading(false);
      });
  }, []);

  const isStatsEmpty = (statisticsData: Object) => {
    return statisticsData ? !("total_annotations" in statisticsData) : true;
  };

  const classesCount = isStatsEmpty(statistics)
    ? NumberLimit.ZERO
    : Object.keys(statistics?.annotations_per_class).length;

  const calcuateImgSizeInMB = () => {
    if (statistics?.average_image_size_bytes) {
      return (
        statistics?.average_image_size_bytes /
        Math.pow(NumberLimit.THOUSAND_TWENTY_FOUR, NumberLimit.TWO)
      ).toFixed(NumberLimit.TWO);
    } else {
      return `${NumberLimit.ZERO} MB`;
    }
  };

  const calcuateMaxImgSize = () => {
    if (statistics?.max_image_size_bytes) {
      return (
        statistics?.max_image_size_bytes /
        Math.pow(NumberLimit.THOUSAND_TWENTY_FOUR, NumberLimit.TWO)
      ).toFixed(NumberLimit.TWO);
    } else {
      return `${NumberLimit.ZERO} MB`;
    }
  };

  const calcuateMinImgSize = () => {
    if (statistics?.min_image_size_bytes) {
      return (
        statistics?.min_image_size_bytes /
        Math.pow(NumberLimit.THOUSAND_TWENTY_FOUR, NumberLimit.TWO)
      ).toFixed(NumberLimit.TWO);
    } else {
      return `${NumberLimit.ZERO} MB`;
    }
  };

  const forCopyCurl = async () => {
    if (modelData?.deployment?.endpoint_curl) {
      await navigator.clipboard.writeText(modelData?.deployment?.endpoint_curl);
      dispatch(
        showToast({
          message: "Copied",
          type: "success",
        })
      );
    }
  };

  const forCopySnippet = async () => {
    if (snippetCode) {
      await navigator.clipboard.writeText(copyCode);
      dispatch(
        showToast({
          message: "Copied",
          type: "success",
        })
      );
    }
  };

  const showSnippet = async (code: any) => {
    if (modelData?.deployment?.endpoint_curl) {
      let indent;
      if (code === "Python") {
        const data = curlconverter.toPython(
          modelData?.deployment?.endpoint_curl
        );
        indent = data;
        setCopyCode(data);
      } else if (code === "Go") {
        const data = curlconverter.toGo(modelData?.deployment?.endpoint_curl);
        indent = data;
        setCopyCode(data);
      } else if (code === "Nodejs") {
        const data = curlconverter.toNode(modelData?.deployment?.endpoint_curl);
        indent = data;
        setCopyCode(data);
      }
      setSnippetCode(indent);
    }
  };

  const displayTostError = () => {
    dispatch(
      showToast({
        type: "error",
        message: SERVER_ALERT,
      })
    );
  };

  const forApplyToProject = () => {
    applyToProject(modelData?.id)
      .then((res) => {
        setIsApplyProject(true);
        setIsLoader(false);
        dispatch(
          showToast({
            message: SUCCESS_MESSAGE.APPLY_TO_PROJECT,
            type: "success",
          })
        );
        fetchModelDetail(modelData?.id);
      })
      .catch((e) => {
        displayTostError();
      });
  };

  const forDeployModel = () => {
    setIsLoading(true);
    deployTheModel(modelData?.id)
      .then((res) => {
        dispatch(
          showToast({
            message: SUCCESS_MESSAGE.CURL_END_POINT,
            type: "success",
          })
        );
        fetchModelDetail(modelData?.id);
        getModelList(true, modelData?.id);
      })
      .catch((err) => {
        displayTostError();
        setIsLoading(false);
      });
  };

  const forDeleteModelDeploy = () => {
    setIsLoading(true);
    deleteTheModelDeploy(modelData?.id)
      .then((resd) => {
        dispatch(
          showToast({
            message: SUCCESS_MESSAGE.CURL_END_POINT_DELETE,
            type: "success",
          })
        );
        fetchModelDetail(modelData?.id);
        getModelList(true, modelData?.id);
      })
      .catch((err) => {
        displayTostError();
        setIsLoading(false);
      });
  };

  const isEndPointDeployed = () => {
    return (
      !!modelData?.deployment?.status &&
      modelData?.deployment?.status !== MODEL_STATUS.DELETED &&
      modelData?.deployment?.status !== MODEL_STATUS.DELETING
    );
  };

  const isTextboxDeployed = () => {
    return isEndPointDeployed() && !!modelData?.deployment?.endpoint_curl;
  };

  const checkEndpointAction = (status = "") => {
    return modelData?.deployment?.status === status;
  };

  const setPreviewImages = (data: any) => {
    setImagesUploaded(data);
  };

  const getPredictionResult = (data: Array<object>) => {
    setResultData(data);
  };

  const setLoaderOption = (value: boolean) => {
    setIsLoader(value);
  };

  const closeDeleteModel = () => {
    setConfrimDelete(false);
  };

  const isModelInService = () => {
    return modelData?.deployment?.status === "IN_SERVICE";
  };

  const getBatchStatus = () => {
    return modelData?.batch?.status;
  };

  const fetchDeployInfo = (
    tagData?: Array<string>,
    newData?: boolean | false
  ) => {
    setApplyLoader(true);
    setSelectedTagData([]);
    let payload = {};
    if (tagData && tagData.length > NumberLimit.ZERO) {
      const tagIdData = tagData.reduce((finalStr, currVal) => {
        return (finalStr = `${finalStr}&tag_id=${currVal}`);
      }, "");
      payload = {
        model_id: modelData?.id,
        tag_id: tagIdData,
        uncertainty_threshold: range[0] / NumberLimit.ONE_HUNDRED,
      };
      setFilterTagId(tagData);
    } else {
      payload = {
        model_id: modelData?.id,
        uncertainty_threshold: range[0] / NumberLimit.ONE_HUNDRED,
      };
      setFilterTagId([]);
    }
    if (modelData?.id) {
      setFetchPrediction(false);
      getPredictionsStatistics(payload)
        .then((res) => {
          setApplyLoader(false);
          setFetchPrediction(true);
          if (res?.data) {
            setPredictionsData(res?.data.Body);
            if (!filterModal) {
              setDuplicatePredictions(res?.data.Body);
              setColorIndex([]);
            }
          }
        })
        .catch(() => {
          setApplyLoader(false);
          setFetchPrediction(true);
        });
    }
  };

  useEffect(() => {
    const batchStatus = getBatchStatus();
    const batchStatusComplete =
      batchStatus === MODEL_STATUS.COMPLETE ||
      batchStatus === MODEL_STATUS.COMPLETE_WITH_ERROR;
    if (batchStatusComplete || isApplyProject) {
      fetchDeployInfo();
    }
    showSnippet(codeSelected);
  }, [
    modelData?.batch?.status,
    isApplyProject,
    project,
    modelData?.deployment?.endpoint_curl,
  ]);

  const searchTagQuery = async (value: string) => {
    const payload = {
      limit: NumberLimit.ONE_CRORE,
      page: NumberLimit.ZERO,
      filters: [
        {
          key: NAME,
          regex: {
            enable: true,
          },
          value,
        },
        {
          key: DATASET_ID,
          value: dataSet.id,
        },
      ],
    };
    await dispatch(getTagsQuery(payload));
  };

  const fetchFullImg = async (data: Array<object>) => {
    const content: any = [];
    setImgToDisplay([]);
    await Promise.allSettled(
      data.map(async (ele: any) => {
        const classes: Array<any> = [];
        const contentId = ele.contentid;
        await Promise.allSettled(
          ele.predictions?.map(async (item: any) => {
            let found = false;
            for (let i = 0; i < classes.length; i++) {
              if (classes[i].className === item.class_name) {
                found = true;
                break;
              }
            }
            const calculatedCount = ele.predictions.filter(
              (ele: any) => ele.class_name === item.class_name
            );
            if (!found) {
              await classes.push({
                className: item.class_name,
                count: calculatedCount.length,
                confidence: Math.floor(
                  item.confidence * NumberLimit.ONE_HUNDRED
                ),
              });
            }
          })
        );

        let found = false;
        for (let i = 0; i < content.length; i++) {
          if (content[i].id === contentId) {
            found = true;
            break;
          }
        }
        if (!found) {
          content.push({ id: contentId, classes: classes, data: ele });
        }
      })
    );
    setImgToDisplay(content);
  };

  const selectedClassData = (tagid: string) => {
    const inputData = predictionsData?.predictions_per_class;
    setSelectedTagData((prevState: any) => {
      const data = [...selectedTagData];
      if (data.includes(tagid)) {
        const inputIndex = data.indexOf(tagid);
        data.splice(inputIndex, 1);
      } else {
        data.push(tagid);
      }
      return data;
    });
  };

  const selectAll = () => {
    const inputData = predictionsData?.predictions_per_class;
    setSelectedTagData((prevState: any) => {
      let data = [...selectedTagData];
      if (data.includes(inputData[0].tagid)) {
        data = [];
      } else {
        inputData.map((ele: any, index: number) => {
          data.push(predictionsData?.predictions_per_class[index].tagid);
        });
      }
      return data;
    });
  };

  const fetchImgData = () => {
    setIsUncertainLoader(true);
    setRefreshDisabled(true);
    let payload = {};
    if (modelData?.id) {
      if (selectedTagData && selectedTagData.length > NumberLimit.ZERO) {
        const tagIdData = selectedTagData.reduce((finalStr, currVal) => {
          return (finalStr = `${finalStr}&tag_id=${currVal}`);
        }, "");
        payload = {
          model_id: modelData?.id,
          tag_id: tagIdData,
          uncertainty_threshold: range[0] / NumberLimit.ONE_HUNDRED,
        };
        setTagData(tagIdData);
      }
      getPredictionsImages(payload)
        .then((res) => {
          if (res?.data) {
            setIsUncertainLoader(false);
            fetchFullImg(res?.data.predictions);
            setShowUncertainImg(true);
            setRefreshDisabled(false);
          }
        })
        .catch(() => {
          setIsUncertainLoader(false);
          setRefreshDisabled(false);
        });
    }
  };

  const setImagesData = (data: any) => {
    setImgToDisplay(data);
  };

  /**
   * function used for view more charts
   */
  const viewMoreChart = () => {
    setIsOpen(true);
  };

  /**
   * function used for close charts
   */
  const closeViewMoreChart = () => {
    setIsOpen(false);
  };

  const viewMoreChartOpen = (isOpen: boolean) => {
    return isOpen ? true : false;
  };

  const closePopUp = () => {
    setShowUncertainImg(false);
    // setSelectedTagData([]);
  };

  return (
    <div className="section section-6">
      {((!isEndPointDeployed() && !isInsight) ||
        (checkEndpointAction(MODEL_STATUS.ERR) && !isInsight)) && (
        <button
          type="button"
          className="btn primary-btn deploy-top-btn"
          onClick={forDeployModel}
        >
          Deploy
        </button>
      )}

      <Tab.Container id="left-tabs-example" defaultActiveKey="first">
        <div className="tab-nav-bar">
          <Nav variant="pills">
            <Nav.Item>
              <Nav.Link
                onClick={() => {
                  setIsInsight(false);
                  connectWithModelSocket(modelData?.id);
                }}
                eventKey="first"
              >
                Model Details
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link
                onClick={() => {
                  setIsInsight(true);
                  //disconnectModelSocket();
                }}
                eventKey="second"
              >
                Model Insights
              </Nav.Link>
            </Nav.Item>
          </Nav>
        </div>

        <Tab.Content>
          <Tab.Pane eventKey="first">
            <Row className="detail-row">
              <Col sm="6" className="details-col">
                <div className="detail-box">
                  <h4>Details</h4>
                  <ModelDetailData modelData={modelData} project={project} />
                </div>
              </Col>
              <Col sm="6" className="preprocessing-col">
                {MODEL_IMAGE_FILTER && (
                  <>
                    <div className="detail-box">
                      <h4>Preprocessing</h4>
                      <PreprocessingData
                        modelData={modelData}
                        isEmptyObj={isEmptyObj}
                      />
                    </div>
                    <div className="detail-box">
                      <h4>Augmentations</h4>
                      <AugmentationData
                        modelData={modelData}
                        isEmptyObj={isEmptyObj}
                      />
                    </div>
                  </>
                )}
              </Col>
            </Row>

            <Row>
              <Col sm="12">
                <div className="section section-4 train-repeat">
                  <div className="page-header">
                    <div className="left-item">
                      <h3>Train/Valid Split</h3>
                    </div>
                  </div>
                  {/* common code reuse it  */}
                  <Row className="train-wrapper">
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
              </Col>
              <Col sm="12">
                <div
                  className={`section deploy-section ${
                    (!isEndPointDeployed() ||
                      checkEndpointAction(MODEL_STATUS.ERR)) &&
                    "d-none"
                  }`}
                >
                  <div className="page-header">
                    <div className="left-item">
                      <h3>Deploy</h3>
                    </div>
                  </div>

                  <Row>
                    <Col sm="12" className={`endpoint`}>
                      <div className="detail-box flex-column">
                        <Tab.Container
                          id="left-tabs-example"
                          defaultActiveKey="third"
                        >
                          <div className="tab-nav-bar deploy-tab">
                            <Nav variant="pills">
                              <Nav.Item>
                                <Nav.Link eventKey="third">
                                  Curl Endpoint
                                </Nav.Link>
                              </Nav.Item>
                              <Nav.Item>
                                <Nav.Link eventKey="fourth">Snippet</Nav.Link>
                              </Nav.Item>
                            </Nav>
                          </div>

                          <Tab.Content style={{ marginTop: "20px" }}>
                            <Tab.Pane eventKey="third">
                              {!checkEndpointAction(MODEL_STATUS.CREATING) && (
                                <h4>Curl Endpoint</h4>
                              )}
                              {checkEndpointAction(MODEL_STATUS.CREATING) && (
                                <h4>Model Deployment In Progress</h4>
                              )}
                              <p>
                                <span className="grey">
                                  {checkEndpointAction(
                                    MODEL_STATUS.COMPLETE
                                  ) && (
                                    <>
                                      Use the following curl command to run
                                      inference on an image
                                    </>
                                  )}
                                </span>
                                {isEndPointDeployed() &&
                                  !checkEndpointAction(
                                    MODEL_STATUS.CREATING
                                  ) && (
                                    <button
                                      type="button"
                                      className="btn link-btn reds-btn"
                                      onClick={() => {
                                        setConfrimDelete(true);
                                      }}
                                    >
                                      Delete
                                    </button>
                                  )}
                                {checkEndpointAction(MODEL_STATUS.CREATING) && (
                                  <div className="enpoint-loader curl-loader">
                                    <div className="loader-inline">
                                      <div className="loader-inner"></div>
                                    </div>
                                    <span>In Progress</span>
                                  </div>
                                )}
                              </p>
                              {isTextboxDeployed() && (
                                <div className="url-box">
                                  <div className="left-item">
                                    <input
                                      type="text"
                                      className="form-control"
                                      readOnly={true}
                                      value={
                                        modelData?.deployment?.endpoint_curl ||
                                        ""
                                      }
                                    />
                                  </div>
                                  <div className="right-item">
                                    <button
                                      type="button"
                                      className="btn link-btn"
                                      onClick={forCopyCurl}
                                    >
                                      Copy
                                    </button>
                                  </div>
                                </div>
                              )}
                            </Tab.Pane>
                            <Tab.Pane eventKey="fourth">
                              <div className="code-wrapper">
                                <div className="code-wrapper-left">
                                  <span className="grey">
                                    Use the following code snippet to run
                                    inference on an image
                                  </span>
                                </div>
                                <div className="code-wrapper-right">
                                  <div className="round-dropdwon">
                                    <DropdownCode>
                                      <DropdownCode.Toggle
                                        className="card-dropdown"
                                        variant="success"
                                        id="dropdown-basic"
                                      >
                                        <span className="text-code">
                                          {codeSelected}
                                        </span>
                                        <img src={DROP_DOWN} alt="profile" />
                                      </DropdownCode.Toggle>
                                      <DropdownCode.Menu>
                                        <DropdownCode.Item
                                          onClick={() => {
                                            showSnippet("Python");
                                            setCodeSelected("Python");
                                          }}
                                        >
                                          Python
                                        </DropdownCode.Item>
                                        <DropdownCode.Item
                                          onClick={() => {
                                            showSnippet("Nodejs");
                                            setCodeSelected("Nodejs");
                                          }}
                                        >
                                          Node js
                                        </DropdownCode.Item>
                                        <DropdownCode.Item
                                          onClick={() => {
                                            showSnippet("Go");
                                            setCodeSelected("Go");
                                          }}
                                        >
                                          Go
                                        </DropdownCode.Item>
                                      </DropdownCode.Menu>
                                    </DropdownCode>
                                  </div>
                                </div>
                              </div>
                              {checkEndpointAction(MODEL_STATUS.CREATING) ? (
                                <div className="enpoint-loader curl-loader">
                                  <div className="loader-inline">
                                    <div className="loader-inner"></div>
                                  </div>
                                  <span>In Progress</span>
                                </div>
                              ) : (
                                <div className="snippet-box">
                                  <div className="left-item">
                                    <CodeBlock
                                      text={snippetCode}
                                      language={"javascript"}
                                      theme={a11yDark}
                                    />
                                    {/* {
                                                snippetCode?.map((ele:any)=>(
                                                    <p>{ele}</p>
                                                ))
                                             } */}
                                  </div>
                                  <div className="right-item">
                                    <button
                                      type="button"
                                      className="btn link-btn"
                                      onClick={forCopySnippet}
                                    >
                                      Copy
                                    </button>
                                  </div>
                                </div>
                              )}
                            </Tab.Pane>
                          </Tab.Content>
                        </Tab.Container>
                      </div>
                    </Col>
                    <Col sm="8" className="flip-drop-col">
                      {isModelInService() && (
                        <div className="detail-box flex-column">
                          <h4>File-Drop</h4>
                          <FileDrop
                            modelData={modelData}
                            setData={() => setOpenModal(true)}
                            getImages={setPreviewImages}
                            predictionResult={getPredictionResult}
                            showLoader={setLoaderOption}
                          />
                          <FileDropModal
                            show={openModal}
                            imagesData={imagesUploaded}
                            closeModal={() => setOpenModal(false)}
                            resultedData={resultData}
                          />
                          {isLoader && (
                            <div className="enpoint-loader">
                              <div className="loader-inline">
                                <div className="loader-inner"></div>
                              </div>
                              <span>In Progress</span>
                            </div>
                          )}
                        </div>
                      )}
                    </Col>
                    {isModelInService() && content?.unAnnotateCount !== 0 && (
                      <Col sm="4">
                        <div className={`detail-box flex-column`}>
                          <h4>Apply to Project</h4>
                          <p>
                            <span className="grey">
                              You can apply this model to the project from here.
                            </span>
                          </p>
                          <button
                            type="button"
                            className="btn primary-btn apply-btn"
                            onClick={forApplyToProject}
                            disabled={
                              isModelInService() &&
                              getBatchStatus() === MODEL_STATUS.RUNNING
                            }
                          >
                            Apply to Project
                          </button>
                        </div>
                      </Col>
                    )}
                    {modelData?.deployment?.status === "IN_SERVICE" &&
                      modelData?.batch?.status === MODEL_STATUS.RUNNING && (
                        <Col sm="12">
                          <div
                            className={`detail-box flex-column apply-section`}
                          >
                            <div className="project-progress">
                              <div className="image-icon">
                                <div className="enpoint-loader">
                                  <div className="loader-inline">
                                    <div className="loader-inner"></div>
                                  </div>
                                  <span></span>
                                </div>
                              </div>
                              <div className="heading">
                                <h4>Apply to Project in Progress</h4>
                                <p>
                                  <span className="grey">
                                    This might take up to 1 hour, results will
                                    be available after the progress is done.
                                  </span>
                                </p>
                              </div>
                            </div>
                          </div>
                        </Col>
                      )}
                  </Row>
                </div>
              </Col>

              <Col sm="12">
                <div
                  className={`section deploy-info-section ${
                    ((getBatchStatus() !== MODEL_STATUS.COMPLETE &&
                      getBatchStatus() !== MODEL_STATUS.COMPLETE_WITH_ERROR) ||
                      !isModelInService()) &&
                    "d-none"
                  }`}
                >
                  <div className="page-header">
                    <div className="left-item">
                      <h3>Deployment Info</h3>
                    </div>
                    <div className="right-item">
                      <div className="filter-section-right">
                        <button
                          type="button"
                          className="btn link-btn filter-btn"
                          style={{ position: "relative" }}
                          onClick={() => setFilterModal(true)}
                        >
                          {filterTagId.length > NumberLimit.ZERO && (
                            <span className="filter-dot-modal"></span>
                          )}
                          <img src={FILTER_ICON} alt="sort icon" /> Filter
                        </button>
                      </div>
                    </div>

                    <div className="right-item d-none">
                      <div className="form-group">
                        <div className="floating-input">
                          <Dropdown
                            className="form-control info-select"
                            options={deploymentInfo}
                            placeholder="Select..."
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* page-header */}
                  <Row className="info-inner-wrapper">
                    <div className="page-header">
                      <div className="left-item">
                        <h3>Class Distribution (Count per class)</h3>
                      </div>
                      <div className="right-item">
                        <h3>Confidence Threshold</h3>
                        <div className="bar">
                          <span className="percentage">{range}%</span>
                          <MultiRange range={range} setRange={setRange} />
                        </div>
                        <button
                          type="button"
                          disabled={range[0] === 0}
                          className="btn link-btn"
                          onClick={() => fetchDeployInfo()}
                        >
                          Apply
                        </button>
                      </div>
                    </div>

                    <div className="chart-content">
                      {applyLoader && (
                        <div className="enpoint-loader">
                          <div className="loader-inline">
                            <div className="loader-inner"></div>
                          </div>
                          <span></span>
                        </div>
                      )}
                      {uncertainLoader && (
                        <div className="enpoint-loader">
                          <div className="loader-inline">
                            <div className="loader-inner"></div>
                          </div>
                          <span></span>
                        </div>
                      )}
                      {predictionsData?.predictions_per_class === null &&
                        !applyLoader &&
                        !uncertainLoader && (
                          <p>
                            No data available. Please try to change threshold
                            value.
                          </p>
                        )}
                      {fetchPrediction &&
                        predictionsData?.predictions_per_class !== null &&
                        !uncertainLoader && (
                          <PredictionsChart
                            colorIndex={colorIndex}
                            isModalPopup={isOpen}
                            predictionsData={predictionsData}
                            getImageData={selectedClassData}
                            selectAll={selectAll}
                            viewMoreChart={viewMoreChart}
                            selectedData={selectedTagData}
                          />
                        )}
                    </div>

                    <div className="info-footer">
                      <button
                        type="button"
                        className="btn secondary-btn"
                        disabled={selectedTagData.length === 0}
                        onClick={fetchImgData}
                      >
                        Inspect Selected
                      </button>
                      <button
                        type="button"
                        className="btn link-btn"
                        onClick={() => {
                          viewMoreChart && viewMoreChart();
                        }}
                      >
                        View More
                      </button>
                      <div className="count">
                        Processed: {modelData?.batch?.total_content} /{" "}
                        {unAnnotatedCount || NumberLimit.ZERO}
                      </div>
                    </div>
                  </Row>
                </div>
              </Col>
            </Row>
          </Tab.Pane>
          <Tab.Pane className="insights-container" eventKey="second">
            <Row className="mg0 step-1">
              <Col sm="3">
                <div className="detail-box flex-column">
                  <h4>Images</h4>
                  <ImagesCount
                    imagesCount={statistics?.total_annotated_images}
                    missingAnnotation={NumberLimit.ZERO}
                    nullExample={statistics?.annotated_null_images}
                  />
                </div>
              </Col>
              <Col sm="3">
                <div className="detail-box flex-column">
                  <h4>Annotation</h4>
                  <AnnotationCount
                    annotationCount={statistics?.total_annotations}
                    averagePerImage={statistics?.average_annotations_per_image}
                    classesCount={classesCount}
                  />
                </div>
              </Col>
              <Col sm="3">
                <div className="detail-box flex-column">
                  <h4>Average Image Size</h4>
                  <AverageImageSize
                    calcuateAvgImgSize={calcuateImgSizeInMB}
                    calcuateMaxImgSize={calcuateMaxImgSize}
                    calcuateMinImgSize={calcuateMinImgSize}
                  />
                </div>
              </Col>
              <Col sm="3">
                <div className="detail-box flex-column">
                  <h4>Median Image Ratio</h4>
                  <MedianImageRatio
                    averageImageHeightPixels={
                      statistics?.insights?.median_height
                    }
                    averageImageWidthPixels={statistics?.insights?.median_width}
                  />
                </div>
              </Col>
            </Row>
            <Row className="step-2">
              <Col sm="12">
                <div className="detail-box flex-column">
                  <h4>Class Balance</h4>
                  <ClassBalance
                    statistics={statistics}
                    classesCount={classesCount}
                  />
                </div>
              </Col>
            </Row>
            <Row className="step-3">
              <Col sm="12">
                <div className="detail-box flex-column">
                  <h4>Dimension Insights</h4>
                  <SizeDistribution
                    statistics={statistics}
                    classesCount={classesCount}
                  />
                </div>
              </Col>
            </Row>

            <Row className="step-4 d-none">
              <Col sm="12">
                <div className="detail-box flex-column">
                  <h4>Annotation Heatmap</h4>
                  <div className="tag-box">
                    <span className="tag green">All</span>
                    <span className="tag grey green-txt">Fighter Jet</span>
                    <span className="tag grey purple-txt">Cargo plane</span>
                    <span className="tag grey blue-txt">Army Chopper</span>
                  </div>
                  <div className="chart-box">{/* chart code here */}</div>
                </div>
              </Col>
            </Row>
          </Tab.Pane>
        </Tab.Content>
      </Tab.Container>
      {confirDelete && (
        <DeleteEndpoint
          show={confirDelete}
          closeModal={closeDeleteModel}
          callBack={forDeleteModelDeploy}
          headingText={"Delete Curl Endpoint"}
          bodyText={"Are you sure you want to delete this curl endpoint?"}
        />
      )}
      {filterModal && (
        <AnnotateFilterModal
          open={filterModal}
          closeModal={() => setFilterModal(false)}
          queryTags={annotateTag.queryTags}
          selectedTagId={fetchDeployInfo}
          existingTagId={filterTagId}
          searchTag={searchTagQuery}
          predictionData={duplicatePredictions}
          setColorIndex={setColorIndex}
        />
      )}
      {showUncertainImg && (
        <UncertainImgModal
          loader={uncertainImgLoader}
          show={showUncertainImg}
          images={imgToDisplay}
          closeModal={closePopUp}
          setImages={setImagesData}
          range={range[0]}
          modelId={modelData.id}
          tagIdData={tagData}
          fetchImgData={fetchImgData}
          refreshDisabled={refreshDisabled}
        />
      )}
      {/* chart-wrapper */}
      {isOpen && (
        <ViewMoreModelChart
          show={viewMoreChartOpen(isOpen)}
          closeModal={closeViewMoreChart}
          predictionsData={predictionsData}
          isBarChart={isBarChart}
          setBarChart={setBarChart}
          getImagesData={selectedClassData}
          setFilterModal={() => setFilterModal(true)}
          range={range}
          setRange={setRange}
          fetchDeployInfo={fetchDeployInfo}
          fetchImgData={fetchImgData}
          selectedTagData={selectedTagData}
          selectAll={selectAll}
          modelData={modelData}
          content={content}
          applyLoader={applyLoader}
          filterTagId={filterTagId}
          colorIndex={colorIndex}
        />
      )}
    </div>
  );
};

export default React.memo(ModelDetail);
