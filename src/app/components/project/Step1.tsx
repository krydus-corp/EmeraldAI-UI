import { createBrowserHistory } from "history";
import { createRef, useEffect, useRef, useState } from "react";
import { ProgressBar } from "react-bootstrap";
import { Scrollbars } from "react-custom-scrollbars-2";
import Dropzone from "react-dropzone";
import ReactImageFallback from "react-image-fallback";
import { useDispatch, useSelector } from "react-redux";
import pLimit from 'p-limit';
import {
    Prompt,
    useNavigate,
    useParams,
} from "react-router-dom";
import {
    ARROW_LEFT_ICON,
    DRAG_IMG,
    ERROR_ICON,
    PROJECT_EMPTY,
} from "../../../constant/image";
import { NumberLimit } from "../../../constant/number";
import {
    AUTH_TOKEN,
    FIVE_GB_SIZE,
    LIMIT_EXCEED_5GB,
    UNSUPPORTED_IMG_FORMAT
} from "../../../constant/static";
import { AppDispatch } from "../../../store";
import {
    CREATE_PROJECT,
    CREATE_PROJECT_STEP2,
    PROJECT_OVERVIEW_STEP2,
} from "../../../utils/routeConstants";
import { showToast } from "../common/redux/toast";
import UploadErrModal from "../modals/UploadErrModal";
import Layout from "./layout/Layout";
import {
    clearUpload
} from "./redux/upload";

const Step1 = () => {
  const [files, setFiles]: any[] = useState([]);

  const [showUploadErr, setShowUploadErr] = useState(false);
  const [errData, setErrData] = useState("");
  const [submit, setSubmit] = useState(false);
  const [apiFetch, setApiFetch] = useState(false);
  const { projectUploads, project } = useSelector((state: any) => state);
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();
  const { project_id } = useParams();
  let batchArr: any[] = [[]];
  const [totalImages, setTotalImages] = useState(NumberLimit.ZERO);
  const [imageUploadedSize, setImageUploadedSize] = useState(NumberLimit.ZERO);
  const [uploadedCount, setuploadedCount] = useState(NumberLimit.ZERO);
  const [failedCount, setFailedCount] = useState(NumberLimit.ZERO);
  const [imagesSize, setImagesSize] = useState(NumberLimit.ZERO);
  const history = createBrowserHistory();
  const location = history.location.pathname;
  const [startValue, setStartValue] = useState(NumberLimit.ZERO);
  const [endValue, setEndValue] = useState(NumberLimit.ONE_HUNDRED);
  const [currentPage, setCurrentPage] = useState<number>(NumberLimit.ONE);
  const imageContainer = createRef<Scrollbars>();
  const [duplicateCount, setDuplicateCount] = useState(NumberLimit.ZERO);
  const [loader, setLoader] = useState<boolean>(false);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [failedData, setFailedData] = useState([]);
  const [isUploadCompleted, setIsUploadCompleted] = useState<boolean>(false);
  let uniqueBatchId = useRef<any>({});
  let batchData = useRef<any | null>();
  const limit = NumberLimit.ONE_HUNDRED;

  useEffect(() => {
    if (files?.length > NumberLimit.ZERO) {
      setLoader(false);
    }
    const totalPage = Math.ceil(totalPages);
    if (currentPage > totalPage && totalPage > NumberLimit.ZERO) {
      setCurrentPage(totalPage);
    }
  }, [files]);

  useEffect(() => {
    const uploadId = projectUploads.id;
    const jsonFile = files.filter((fl: any) => fl.type === "application/json");
    const labelsFile =
      jsonFile.length > NumberLimit.ZERO ? batchArr.length : NumberLimit.ZERO;
    const totalSum = uploadedCount + failedCount + labelsFile;
    if (totalSum === totalImages && uploadId) {
      setIsUploading(false);
      setIsUploadCompleted(true);
    }
  }, [uploadedCount, failedCount]);

  useEffect(() => {
    dispatch(clearUpload());
  }, []);

  const handleDrop = (acceptedFiles: any, fileRejections: any) => {
    if (fileRejections[NumberLimit.ZERO]) {
      openErrModal(UNSUPPORTED_IMG_FORMAT);
    }
    const result = acceptedFiles.filter(
      (file1: any) => !files.some((file2: any) => file1.name === file2.name)
    );
    setFiles(() => [
      ...files,
      ...result.map((file: any) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      ),
    ]);
    setLoader(false);
  };

  const handleRemoveFile = (name: string) => {
    const newFiles = [...files];
    const imageIndex = files.findIndex((file: any) => file.name === name);
    newFiles.splice(imageIndex, 1);
    setFiles(newFiles);
  };

  const closeErrModal = () => {
    setErrData("");
    setShowUploadErr(false);
  };
  const openErrModal = (message: string) => {
    setErrData(message);
    setShowUploadErr(true);
  };

  const parallelUploading = async (
    index: any,
    jsonFiles: any
  ) => {
    return new Promise(async (resolve, reject) => {
      if (window.Worker) {
        const workerThread = new Worker(
          new URL("./worker.js", import.meta.url)
        );
        const message = {
          upload: {
            index,
            jsonFiles,
            projectId: project?.id,
            batchArr,
            token: localStorage.getItem(AUTH_TOKEN),
          },
        };
        workerThread.postMessage(message);
        workerThread.onmessage = function (e) {
          const { data } = e;
          batchData.current = {
            ...batchData.current,
            total_images_succeeded:
              batchData.current.total_images_succeeded +
              data.total_files_succeeded,
            total_images_failed:
              batchData.current.total_images_failed + data.total_files_failed,
            total_images_duplicate:
              batchData.current.total_images_duplicate +
              data.total_files_duplicate,
            failed: batchData.current.failed.concat(data.errors),
            total_bytes_uploaded:
              batchData.current.total_bytes_uploaded + data.total_bytes,
          };
          updateCounts(batchData.current);
          workerThread.terminate();
          resolve(data);
        };
      }
    });
  };

  const updateCounts = (currentBatchData: any) => {
    setuploadedCount(currentBatchData.total_images_succeeded);
    setImagesSize(currentBatchData.total_bytes_uploaded);
    setFailedCount(currentBatchData.total_images_failed);
    setDuplicateCount(currentBatchData.total_images_duplicate);
    setFailedData(currentBatchData.failed);
  };

  const handleSubmit = async () => {
    setIsUploading(true);
    localStorage.removeItem("upload");
    const totalSize = files.reduce((a: any, b: any) => a + b.size, 0);
    setImageUploadedSize(totalSize);
    getFilesBatch();

    if (totalSize > FIVE_GB_SIZE) {
      return openErrModal(LIMIT_EXCEED_5GB);
    }

    setApiFetch(true);
    setSubmit(true);

    const jsonFiles = files.filter((fl: any) => fl.type === "application/json");
    setIsUploading(true);
    batchData.current = {
      total_images_succeeded: 0,
      total_images_failed: 0,
      total_images: 0,
      total_images_duplicate: 0,
      failed: [],
      total_bytes_uploaded: 0,
    };

    const limit = pLimit(10);
    let promiseArr = [];

    for (let index = 0; index < batchArr.length; index++) {
      const jsonFileIndex = batchArr[index].findIndex(
        (fl: any) => fl.type === "application/json"
      );
      if (jsonFiles[0] && jsonFileIndex === -1) {
        batchArr[index].push(jsonFiles[0]);
      }


      promiseArr.push(limit(() => parallelUploading(index, jsonFiles)));
    }

    try {
      await Promise.allSettled(promiseArr);
      setIsUploading(false);
      setIsUploadCompleted(true);
      dispatch(showToast({ message: "Upload Completed", type: "success" }));
    } catch (error) {
      // handle errors here
      setIsUploading(false);
      setIsUploadCompleted(false);
      dispatch(showToast({ message: "Upload Failed", type: "error" }));
    }
  };

  // Organize files into batches of length `limit`
  const getFilesBatch = () => {
    let count = NumberLimit.ZERO;
    let size = NumberLimit.ZERO;
    let index = NumberLimit.ZERO;

    files.forEach((file: any) => {
      if (count < limit) {
        size = size + file.size;
        count = count + NumberLimit.ONE;
        batchArr[index].push(file);
      } else {
        batchArr = [...batchArr, [file]];
        index = index + NumberLimit.ONE;
        size = NumberLimit.ZERO;
        count = NumberLimit.ZERO;
      }
    });
  };

  const getProgressValue = () => {
    let totalProgress = NumberLimit.ZERO;
    if (totalImages) {
      let newSum = uploadedCount + failedCount + duplicateCount;
      totalProgress = (newSum / totalImages) * NumberLimit.ONE_HUNDRED;
    }
    return Math.ceil(totalProgress);
  };

  const getBytesProgress = () => {
    let totalProgress = NumberLimit.ZERO;
    if (totalImages > 0) {
      const totalSum = uploadedCount + duplicateCount + failedCount;
      totalProgress = (totalSum / totalImages) * NumberLimit.ONE_HUNDRED;
    }
    const progress =
      Math.round(totalProgress) > 100 ? 100 : Math.round(totalProgress);
    return progress;
  };

  const calculateImgSizeInMB = (byts: number) => {
    if (byts) {
      return (
        byts / Math.pow(NumberLimit.THOUSAND_TWENTY_FOUR, NumberLimit.TWO)
      ).toFixed(NumberLimit.TWO);
    } else {
      return "0";
    }
  };

  const totalPages = files?.length / NumberLimit.ONE_HUNDRED;

  useEffect(() => {
    const startVal =
      currentPage * NumberLimit.ONE_HUNDRED - NumberLimit.ONE_HUNDRED;
    setStartValue(startVal);
    setEndValue(currentPage * NumberLimit.ONE_HUNDRED);
    imageContainer.current?.scrollToTop();
  }, [currentPage]);

  const displayImageName = (name: any) => {
    return name.length > NumberLimit.THIRTY_FIVE
      ? name.slice(NumberLimit.ZERO, NumberLimit.THIRTY_FOUR) + "..."
      : name;
  };

  const handleUploadMore = async () => {
    setFiles([]);
    dispatch(clearUpload());
    setApiFetch(false);
    setIsUploadCompleted(false);
    setSubmit(false);
    setuploadedCount(0);
    setFailedCount(0);
    setDuplicateCount(0);
    setImagesSize(0);
    uniqueBatchId.current = {};
  };

  return (
    <>
      <Layout>
        {loader && (
          <div className="loader">
            <div className="loader-inner"></div>
          </div>
        )}
        <div className="steps upload-step-1">
          <div className="page-header">
            <div className="left-item">
              <h3>
                Upload Images
                <span className="sm-txt">
                  Please upload images here to proceed with the annotation
                </span>
              </h3>
            </div>
            <div className="right-item upload-with-loader-right">
              {submit && !isUploadCompleted && (
                <>
                  <div className="mb-txt">
                    {calculateImgSizeInMB(imagesSize)} MB/
                    {calculateImgSizeInMB(imageUploadedSize)} MB
                  </div>
                  <div className="loader-inline">
                    <span className="loader-percentage">
                      {getBytesProgress()}%
                    </span>
                    <div className="loader-inner"></div>
                  </div>
                </>
              )}
              {files.length > NumberLimit.ZERO && (
                <button
                  type="button"
                  className="btn primary-btn"
                  hidden={isUploadCompleted}
                  onClick={() => {
                    handleSubmit();
                  }}
                  disabled={submit}
                >
                  Finish Uploading
                </button>
              )}
              {isUploadCompleted && (
                <>
                  <button
                    type="button"
                    className="btn secondary-btn mr20"
                    onClick={() => {
                      handleUploadMore();
                    }}
                  >
                    Upload More
                  </button>
                  <button
                    type="button"
                    className="btn primary-btn"
                    onClick={() => {
                      handleUploadMore();
                      localStorage.removeItem("upload");
                      location.includes(CREATE_PROJECT)
                        ? navigate(`${CREATE_PROJECT_STEP2}/${project_id}`)
                        : navigate(`${PROJECT_OVERVIEW_STEP2}/${project_id}`);
                    }}
                  >
                    Start Annotation
                  </button>
                </>
              )}
            </div>
          </div>
          {/* page-header */}

          <div className="drag-box-wrapper">
            {(!files || files.length === NumberLimit.ZERO) && (
              <Dropzone
                onDrop={handleDrop}
                accept={{
                  "image/*": [".json", ".png", ".jpeg", ".jpg"],
                }}
              >
                {({ getRootProps, getInputProps }) => (
                  <div
                    className="step-1"
                    style={{ display: "" }}
                    {...getRootProps()}
                  >
                    <img src={DRAG_IMG} alt="drage img" />
                    <h3>
                      Drag and drop file
                      <span className="sm-txt">
                        JPG, JPEG and PNG images only | Maximum up to 5 GB per
                        upload
                      </span>
                      <span className="sm-txt">Or</span>
                    </h3>
                    <button type="button" className="btn secondary-btn">
                      <input type="file" {...getInputProps()} /> Import from
                      computer
                    </button>
                  </div>
                )}
              </Dropzone>
            )}
            {/* step-1 */}

            {files && files.length > NumberLimit.ZERO && (
              <Dropzone
                disabled={submit}
                onDrop={handleDrop}
                accept={{
                  "image/*": [".json", ".png", ".jpeg", ".jpg"],
                }}
              >
                {({ getRootProps, getInputProps }) => (
                  <div className="step-2">
                    {!apiFetch && (
                      <div className="page-header" {...getRootProps()}>
                        <div className="left-item">
                          <img src={DRAG_IMG} alt="drage img" />
                          <h3>
                            Drag and drop file
                            <span className="sm-txt">
                              JPG, JPEG and PNG images only | Maximum up to 5 GB
                              per upload
                            </span>
                          </h3>
                        </div>
                        <div className="right-item">
                          <button
                            type="button"
                            className="btn secondary-btn import-btn"
                            disabled={submit}
                          >
                            <input type="file" {...getInputProps()} /> Import
                            from computer
                          </button>
                        </div>
                      </div>
                    )}

                    {/* page-header */}
                    {apiFetch && (
                      <div className="progress-bar-box">
                        <div className="progress-bar-upload">
                          <h3>
                            {isUploadCompleted ? "Uploaded" : "Processing..."}
                          </h3>
                          <div className="counting">
                            {uploadedCount + failedCount + duplicateCount}/
                            {totalImages}
                          </div>
                        </div>
                        <ProgressBar
                          variant="success"
                          now={getProgressValue()}
                        />
                      </div>
                    )}

                    {!apiFetch && (
                      <div className="upload-gallery">
                        <Scrollbars
                          ref={imageContainer}
                          className="custom-scrollbar"
                          renderThumbVertical={() => (
                            <div className="thumb-horizontal" />
                          )}
                        >
                          <div className="img-container">
                            {files
                              ?.slice(startValue, endValue)
                              .map((file: any, index: any) => (
                                <div className="img-wrapper" key={file.name}>
                                  <div className="img-box">
                                    <ReactImageFallback
                                      src={file.preview}
                                      fallbackImage={PROJECT_EMPTY}
                                      initialImage={PROJECT_EMPTY}
                                      alt="gallery images"
                                    />
                                    {}
                                    {!submit && (
                                      <span
                                        className="del-btn"
                                        onClick={() => {
                                          handleRemoveFile(file.name);
                                        }}
                                      ></span>
                                    )}
                                  </div>
                                  <div className="img-caption">
                                    {displayImageName(file.name)}
                                  </div>
                                </div>
                              ))}
                          </div>
                        </Scrollbars>
                        <div className="upload-pagination">
                          <div className="count-txt">
                            Total Images: {files?.length}
                          </div>
                          <div className="count-no">
                            <div className="count-txt">
                              Page: {currentPage}/{Math.ceil(totalPages)}
                            </div>
                            <button
                              type="button"
                              className="btn secondary-btn"
                              onClick={() =>
                                currentPage > NumberLimit.ONE
                                  ? setCurrentPage(
                                      currentPage - NumberLimit.ONE
                                    )
                                  : setCurrentPage(NumberLimit.ONE)
                              }
                              disabled={currentPage === NumberLimit.ONE}
                            >
                              <img src={ARROW_LEFT_ICON} alt="images" />
                            </button>

                            <button
                              type="button"
                              className="btn secondary-btn"
                              onClick={() =>
                                setCurrentPage(currentPage + NumberLimit.ONE)
                              }
                              disabled={currentPage >= Math.ceil(totalPages)}
                            >
                              <img src={ARROW_LEFT_ICON} alt="images" />
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                    {apiFetch && projectUploads && (
                      <div className="file-upload-wrapper">
                        <div className="upload-box-inner">
                          <div className="upload-box">
                            <h3>{totalImages}</h3>
                            <p>Total Images Selected</p>
                          </div>
                          <div className="upload-box">
                            <h3>{uploadedCount}</h3>
                            <p>Total Images Uploaded</p>
                          </div>
                          <div className="upload-box">
                            <h3 className="fail-images">{failedCount}</h3>
                            <p>Total Images Failed to Upload</p>
                          </div>
                          <div className="upload-box">
                            <h3 className="fail-images">{duplicateCount}</h3>
                            <p>Total Duplicate Images</p>
                          </div>
                        </div>
                        {projectUploads && failedCount > NumberLimit.ZERO && (
                          <div className="upload-error-state">
                            <p>
                              <img src={ERROR_ICON} alt="error" /> Below images
                              failed to upload
                            </p>
                            <div className="error-strip-box">
                              <Scrollbars
                                className="custom-scrollbar"
                                renderThumbVertical={() => (
                                  <div className="thumb-horizontal" />
                                )}
                              >
                                {failedCount > NumberLimit.ZERO &&
                                  failedData.length > NumberLimit.ZERO &&
                                  failedData.map((keyName: any, i: any) => (
                                    <div className="error-strip" key={i}>
                                      <p>{keyName.Filename} </p>
                                      <p>{keyName.Message}</p>
                                    </div>
                                  ))}
                              </Scrollbars>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </Dropzone>
            )}
            {/* step-2 */}
          </div>
        </div>

        {/* error while uploading modal */}
        <UploadErrModal
          show={showUploadErr}
          message={errData}
          closeModal={closeErrModal}
          header="Error while uploading!"
        />
      </Layout>
      <Prompt
        when={isUploading}
        message="We are going to continue this upload in the background, but you won't be able to view the progress, but you will get a notification once it is completed."
      />
      {}
    </>
  );
};
export default Step1;
