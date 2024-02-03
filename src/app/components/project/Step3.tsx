import React, { useCallback, useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { NumberLimit } from "../../../constant/number";
import DatasetSplitChart from "../charts/DatasetSplitChart";
import ViewMoreChart from "../modals/ViewMoreChart";
import ChartDataView from "./ChartDataView";
import DatasetImageListing from "./DatasetImageListing";
import ViewAllDatasetimages from "./ViewAllDatasetimages";
import { EDIT_ICON } from "../../../constant/image";
import Layout from "./layout/Layout";
import { AppDispatch } from "../../../store";
import Split from "../modals/Split";
import { getAnnotateStatistics } from "./redux/statistics";
import { useLocation, useNavigate } from "react-router-dom";
import {
  CREATE_PROJECT,
  CREATE_PROJECT_STEP1,
  CREATE_PROJECT_STEP4,
  PROJECT_OVERVIEW_STEP1,
  PROJECT_OVERVIEW_STEP4,
} from "../../../utils/routeConstants";
import { clearUpload } from "./redux/upload";
import SplitConfirm from "./model/SplitConfirm";
import { ChartBackgroundColor } from "../charts/CommonChart";
import { getContent } from "./redux/content";
import { AUTH_TOKEN, HTTPS_REPLACE } from "../../../constant/static";
interface Props {
  setShowPageHeader?: Function;
  isViewPage?: boolean;
  isCreateView?: boolean;
}

const DatasetFunctions = {
  isStatsEmpty: (statsData: Object) => {
    return statsData ? !("total_annotations" in statsData) : true;
  },
  isCountKeyExist: (annotatedContent: Object) => {
    return "count" in annotatedContent;
  },
  isViewMoreDisable: (annotatedContent: { count: number }) => {
    return !annotatedContent?.count;
  },
  setShowPageHeader: (
    action: boolean,
    setShowPageHeader: Function | undefined
  ) => {
    setShowPageHeader && setShowPageHeader(action);
  },
  displayViewAll: (isViewAllImage: boolean) => {
    return isViewAllImage && "d-none";
  },
  viewMoreChartOpen: (isOpen: boolean) => {
    return isOpen ? true : false;
  },
  uploadMoreImages: (isViewPage = false, funcCall: Function) => {
    return (
      !isViewPage && (
        <button
          type="button"
          className="btn secondary-btn upload-more-btn"
          onClick={() => funcCall()}
        >
          Upload More Images
        </button>
      )
    );
  },
  generateNewModal: (isViewPage = false, callBack: Function) => {
    return (
      !isViewPage && (
        <button
          type="button"
          className="btn primary-btn gen-btn"
          onClick={() => {
            callBack();
          }}
        >
          Generate New Model
        </button>
      )
    );
  },
};

const Step3 = ({ setShowPageHeader, isViewPage, isCreateView }: Props) => {
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(false);
  const [isViewAllImage, setViewAllImage] = useState(false);
  const [annotatedContent, setAnnotatedContent] = useState(Object);
  const [statsData, setStatsData] = useState(Object);
  const [isStatsLoading, setStatsLoading] = useState(true);
  const [isBarChart, setBarChart] = useState(true);
  const { project, content, dataSet, statistics } = useSelector(
    (state: any) => state
  );
  const [imagesList, setImages] = useState<any>([]);
  const [opensplitConfirm, setSplitConfirm] = useState(false);
  const [chartColor, setChartColor] = useState([]);
  const [unannotatedcount, setUnAnnotatedCount] = useState(0);

  const closeSplitConfirm = () => {
    setSplitConfirm(false);
    //setSplit(true);
  };

  const openRebalance = () => {
    setSplitConfirm(false);
    setSplit(true);
  };

  const [split, setSplit] = useState(false);
  const closeSplit = () => setSplit(false);

  const prevLocation: any = useLocation();

  const fetchDataForStats = () => {
    if (project?.id && project?.datasetid) {
      setStatsLoading(true); //for disabling two loader visible
      dispatch(
        getAnnotateStatistics({
          project_id: project?.id,
          dataset_id: project?.datasetid,
        })
      )
        .then((res: any) => {
          setStatsLoading(false);
          if (res.payload) {
            setStatsData(res.payload);
          }
        })
        .catch(() => {
          setStatsLoading(false);
        });
    }
  };

  useEffect(() => {
    setTimeout(() => {
      setStatsLoading(false);
    }, 20000);
  }, []);

  useEffect(() => {
    if (project?.id && dataSet?.id && isStatsLoading) {
      fetchDataForStats();
    }
  }, [project]);

  useEffect(() => {
    project?.id &&
      dispatch(
        getContent({
          limit: NumberLimit.FIFTY,
          page: 1,
          project_id: project?.id,
        })
      ).then((res) => {
        setUnAnnotatedCount(res.payload.count);
      });
  }, [content?.imagesList]);

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

  /**
   * function used for view all images
   */
  const viewAllImage = () => {
    setViewAllImage(true);
    DatasetFunctions.setShowPageHeader(false, setShowPageHeader);
  };

  /**
   * function used for close view all images
   */
  const closeViewAllImage = () => {
    setViewAllImage(false);
    DatasetFunctions.setShowPageHeader(true, setShowPageHeader);
  };

  const isEmptyImageList = () => {
    return (
      DatasetFunctions.isCountKeyExist(annotatedContent) &&
      DatasetFunctions.isViewMoreDisable(annotatedContent)
    );
  };

  const navigateToUpload = () => {
    dispatch(clearUpload());

    navigate &&
      prevLocation.pathname.includes(CREATE_PROJECT) &&
      navigate(`${CREATE_PROJECT_STEP1}/${project.id}`);

    navigate &&
      !prevLocation.pathname.includes(CREATE_PROJECT) &&
      navigate(`${PROJECT_OVERVIEW_STEP1}/${project.id}`);
  };

  const calcuateImageSizeInMB = (bytes: number) => {
    if (bytes) {
      return (
        bytes / Math.pow(NumberLimit.THOUSAND_TWENTY_FOUR, NumberLimit.TWO)
      ).toFixed(NumberLimit.TWO);
    } else {
      return "0";
    }
  };

  const isStatsDataLoaded = () => {
    return statsData && "total_annotated_images" in statsData;
  };

  const backgroundColor = () => {
    const colorArr: any = [];
    for (const key in statsData?.annotations_per_class) {
      const random = Math.floor(Math.random() * ChartBackgroundColor.length);
      colorArr.push(ChartBackgroundColor[random]);
    }
    setChartColor(colorArr);
  };

  useEffect(() => {
    backgroundColor();
  }, [statsData]);

  const getClassesCount = () =>
    statsData &&
    statsData?.annotations_per_class &&
    Object.keys(statsData?.annotations_per_class).length > 0
      ? Object.keys(statsData?.annotations_per_class).length - 1
      : NumberLimit.ZERO;

  return (
    <Layout>
      <div>
        {isStatsLoading && (
          <div className="loader">
            <div className="loader-inner"></div>
          </div>
        )}
        <div
          className={`steps dataset-step-3 ${DatasetFunctions.displayViewAll(
            isViewAllImage
          )}`}
        >
          <div className="page-header">
            <div className="left-item">
              <h3>Dataset</h3>
            </div>
            <div className="right-item">
              {DatasetFunctions.uploadMoreImages(isViewPage, navigateToUpload)}
              {DatasetFunctions.generateNewModal(isViewPage, () => {
                if (statsData?.total_annotated_images < NumberLimit.TEN) {
                  alert(
                    "Annotation images are less than 10, you have to upload more images to start the training"
                  );
                } else if (
                  dataSet.split.validation === NumberLimit.POINT_TWENTY_FIVE &&
                  dataSet.split.test === NumberLimit.ZERO
                ) {
                  setSplitConfirm(true);
                } else {
                  prevLocation.pathname.includes(CREATE_PROJECT)
                    ? navigate(`${CREATE_PROJECT_STEP4}/${project?.id}`)
                    : navigate(`${PROJECT_OVERVIEW_STEP4}/${project?.id}`);
                }
              })}
            </div>
          </div>
          {/* page-header */}

          <div className="img-data-wrapper">
            <div className="page-header">
              <div className="left-item">
                <h3>
                  Image Data{" "}
                  <span className="sm-txt">
                    Upload images you want to include in your dataset{" "}
                    <span className="tag">
                      {statistics?.total_annotated_images ||
                        annotatedContent?.count}{" "}
                      Images
                    </span>{" "}
                    <span className="tag">{getClassesCount()} Classes</span>
                  </span>
                </h3>
              </div>
              <div className="right-item">
                <button
                  disabled={DatasetFunctions.isViewMoreDisable(
                    annotatedContent
                  )}
                  type="button"
                  className="btn link-btn"
                  onClick={viewAllImage}
                >
                  Manage Images
                </button>
              </div>
            </div>
            {isEmptyImageList() ? (
              <div className="total-txt no-data">No annotated image found!</div>
            ) : (
              <DatasetImageListing
                isLoading={isStatsLoading}
                setIsLoading={setStatsLoading}
                isSortList={true}
                setAnnotatedContent={setAnnotatedContent}
                isCreateView={isCreateView}
                imagesList={imagesList}
                setImages={setImages}
              />
            )}
          </div>
          {/* img-data-wrapper */}

          <div className="chart-wrapper">
            <Row>
              <Col className="colums" sm="6">
                <ChartDataView
                  statsData={statsData}
                  viewMoreChart={viewMoreChart}
                  isModalPopup={false}
                  isBarChart={isBarChart}
                  setBarChart={setBarChart}
                  backgroundColor={chartColor}
                />
              </Col>
              <Col className="colums" sm="3">
                <div className="chart-box">
                  <div className="page-header">
                    <div className="left-item">
                      <h3>Dataset Split</h3>
                    </div>
                  </div>
                  <div className="split-chart-wrapper">
                    {!isStatsLoading && isStatsDataLoaded() && (
                      <DatasetSplitChart
                        chartData={dataSet}
                        imageCount={statsData?.total_annotated_images}
                      />
                    )}
                    <button
                      type="button"
                      className="btn link-btn rebalance-btn"
                      disabled={
                        statsData?.total_annotated_images < NumberLimit.TEN
                      }
                      onClick={() => {
                        setSplit(true);
                      }}
                    >
                      <img src={EDIT_ICON} alt="edit" /> Rebalance Dataset
                    </button>
                  </div>
                </div>
              </Col>
              <Col className="colums" sm="3">
                <div className="chart-box">
                  <div className="page-header">
                    <div className="left-item">
                      <h3>Dataset Details</h3>
                    </div>
                  </div>
                  <div className="chart-data-box">
                    <p className="chart-data">
                      Minimum Image Size{" "}
                      <span>
                        {statsData?.min_image_height_pixels || NumberLimit.ZERO}
                        x{statsData?.min_image_width_pixels || NumberLimit.ZERO}{" "}
                        |{" "}
                        {calcuateImageSizeInMB(statsData.min_image_size_bytes)}
                        MB
                      </span>
                    </p>
                    <p className="chart-data">
                      Average Image Size{" "}
                      <span>
                        {statsData?.average_image_height_pixels ||
                          NumberLimit.ZERO}
                        x
                        {statsData?.average_image_width_pixels ||
                          NumberLimit.ZERO}{" "}
                        |{" "}
                        {calcuateImageSizeInMB(
                          statsData.average_image_size_bytes
                        )}
                        MB
                      </span>
                    </p>
                    <p className="chart-data">
                      Maximum Image Size{" "}
                      <span>
                        {statsData?.max_image_height_pixels || NumberLimit.ZERO}
                        x{statsData?.max_image_width_pixels || NumberLimit.ZERO}{" "}
                        |{" "}
                        {calcuateImageSizeInMB(statsData.max_image_size_bytes)}
                        MB
                      </span>
                    </p>
                    <p className="chart-data">
                      Total Annotated Images{" "}
                      <span>
                        {statsData?.total_annotated_images || NumberLimit.ZERO}{" "}
                        images
                      </span>
                    </p>
                    <p className="chart-data">
                      Total Annotations{" "}
                      <span>
                        {statsData?.total_annotations || NumberLimit.ZERO}{" "}
                        {statsData?.total_annotations > NumberLimit.ZERO
                          ? "annotations"
                          : "annotation"}
                      </span>
                    </p>
                    <p className="chart-data">
                      Unannotated{" "}
                      <span>
                        {unannotatedcount ||
                          statsData?.total_unannotated_images ||
                          NumberLimit.ZERO}{" "}
                        images
                      </span>
                    </p>

                    <p className="chart-data">
                      Size Distributions{" "}
                      <span>
                        {statsData?.insights &&
                          statsData?.insights?.size_distributions &&
                          Object.keys(
                            statsData?.insights?.size_distributions
                          ).map(function (key) {
                            return (
                              <span key={key}>
                                {key} :{" "}
                                {
                                  statsData?.insights?.size_distributions[key]
                                    ?.count
                                }
                              </span>
                            );
                          })}
                      </span>
                    </p>

                    <p className="chart-data">
                      Aspect Ratio Distributions{" "}
                      <span>
                        {statsData?.insights &&
                          statsData?.insights?.aspect_ratio_distributions &&
                          Object.keys(
                            statsData?.insights?.aspect_ratio_distributions
                          ).map(function (key) {
                            return (
                              <span key={key}>
                                {key} :{" "}
                                {
                                  statsData?.insights
                                    ?.aspect_ratio_distributions[key]?.count
                                }
                              </span>
                            );
                          })}
                      </span>
                    </p>
                  </div>
                </div>
              </Col>
            </Row>
          </div>
          {/* chart-wrapper */}
          {isOpen && (
            <ViewMoreChart
              show={DatasetFunctions.viewMoreChartOpen(isOpen)}
              closeModal={closeViewMoreChart}
              statsData={statsData}
              isBarChart={isBarChart}
              setBarChart={setBarChart}
            />
          )}
        </div>
        {split && <Split show={split} closeModal={closeSplit} />}
        <ViewAllDatasetimages
          isLoading={isStatsLoading}
          setIsLoading={setStatsLoading}
          isOpen={isViewAllImage}
          hideViewAll={closeViewAllImage}
          setAnnotatedContent={setAnnotatedContent}
          annotatedContent={annotatedContent}
          fetchDataForStats={fetchDataForStats}
        />
      </div>

      <SplitConfirm
        openRebalance={openRebalance}
        show={opensplitConfirm}
        closeModal={closeSplitConfirm}
      />
    </Layout>
  );
};

export default Step3;
