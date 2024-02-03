import React, { useEffect, useState } from "react";
import { Button, Modal, Nav, Tab } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { MINUS_ICON, REFRESH_ICON } from "../../../constant/image";
import { AppDispatch } from "../../../store";
import { addSelectedContent } from "../annotate/redux/annotateImage";
import { NumberLimit } from "../../../constant/number";
import { ANNOTATE } from "../../../constant/static";
import AddRandomlyModal from "../modals/AddRandomlyModal";
import { showToast } from "../common/redux/toast";
import { createBrowserHistory } from "history";
import { getPredictionsImages } from "../../../service/model";
import ViewMoreUncertainTag from "./ViewMoreUncertainTags";

interface Props {
  show: boolean;
  images: any;
  closeModal: Function;
  setImages: Function;
  range: any;
  modelId: string;
  tagIdData: any;
  loader: boolean;
  fetchImgData?: any;
  refreshDisabled: boolean;
}

const UncertainImgModal = ({
  show,
  images,
  closeModal,
  setImages,
  range,
  modelId,
  tagIdData,
  loader,
  fetchImgData,
  refreshDisabled,
}: Props) => {
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();
  const { project_id, annotate } = useParams();

  const [randomImages, setRandomImages] = useState<number | string>(
    NumberLimit.ZERO
  );
  const [selectedImagesCount, setSelectedImagesCount] = useState<number>(
    NumberLimit.ZERO
  );
  const [selectedImages, setSelectedImages] = useState<any[]>([]);
  const [tab, setTab] = useState(annotate === ANNOTATE ? "second" : "first");
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [manualValue, setManualImgValue] = useState<string>("");
  const [manualChecked, setManualIsChecked] = useState<boolean>(false);
  const [showRandomToast, setShowRandomToast] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipData, setTooltipData] = useState<any>([]);

  const { project, annotateContent } = useSelector((state: any) => state);

  useEffect(() => {
    dispatch(addSelectedContent([]));
  }, []);

  useEffect(() => {
    setSelectedImagesCount(selectedImagesCount);
  }, [images]);

  // function to set the random selection count
  const setRandomNumber = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const value = e.target.value;
    if (Number(value) >= NumberLimit.ZERO) {
      setRandomImages(value.replace(/^0+/, ""));
    } else {
      e.preventDefault();
    }
  };

  const closeModalFunc = () => {
    dispatch(addSelectedContent([]));
    closeModal();
  };

  // function to call api to fetch the random images count
  const addRandomImageCheck = () => {
    const selectedData = images.filter((ele: any) => ele.checked);
    if (selectedData.length > NumberLimit.ZERO) {
      setOpenModal(true);
    } else if (randomImages !== selectedImagesCount) {
      addRandomImages();
    }
  };

  const addRandomImages = () => {
    deleteSelectedImages();
    const payload = {
      model_id: modelId,
      uncertainty_threshold: range / NumberLimit.ONE_HUNDRED,
      count: randomImages,
      tag_id: tagIdData,
    };
    getPredictionsImages(payload).then((res: any) => {
      const content: any = [];
      res.data?.predictions.map((ele: any) => {
        const contentId = ele.contentid;
        let found = false;
        for (let i = 0; i < content.length; i++) {
          if (content[i].id === contentId) {
            found = true;
            break;
          }
        }
        if (!found) {
          content.push({ id: contentId });
        }
      });
      dispatch(
        showToast({
          message: `${content?.length} images have been added randomly successfully.`,
          type: "success",
        })
      );
      dispatch(addSelectedContent(content));
      setRandomImages(content?.length);
      setSelectedImagesCount(content.length);
    });
  };

  useEffect(() => {
    if (randomImages > images.length && showRandomToast) {
      dispatch(
        showToast({
          message: "Random count cannot be greater than the total images count",
          type: "success",
        })
      );
    }
  }, [randomImages]);

  useEffect(() => {
    if (selectedImagesCount === NumberLimit.ZERO) {
      setRandomImages(NumberLimit.ZERO);
    }
  }, [selectedImagesCount]);

  // function to handle the selection and deselection of images
  const updatedImages = (value: number, isChecked: boolean, id: string) => {
    const selectedData = images.filter((ele: any) => ele.checked);
    if (
      selectedData.length === NumberLimit.ZERO &&
      annotateContent.selectedImages.length > NumberLimit.ZERO
    ) {
      setOpenModal(true);
      setManualImgValue(id);
      setManualIsChecked(isChecked);
    } else {
      setManualImages(id, isChecked);
    }
  };

  // function to handle the deselection of random images
  const removeRandomItem = (value: number) => {
    const data = [...annotateContent.selectedImages];
    data.splice(value, 1);
    setSelectedImagesCount(data.length);
    dispatch(addSelectedContent(data));
  };

  const setManualImages = async (value: string, isChecked: boolean) => {
    setRandomImages(NumberLimit.ZERO);
    let updatedData: any = [];
    images.forEach((ele: any, index: number) => {
      updatedData[index] = { ...ele };
    });
    let obj = updatedData.find((f: any) => f.id === value);
    if (obj) {
      obj.checked = isChecked;
    }
    const newData = updatedData.filter((ele: any) => ele.checked);
    setImages(updatedData);
    await setSelectedImagesCount(newData.length);
    dispatch(addSelectedContent(newData));
  };

  const showTagModal = (index: number) => {
    setShowTooltip(!showTooltip);
    setTooltipData(images[index].className);
  };

  // function to render the images on UI
  const renderImages = () => {
    return images.map((ele: any, index: number) => {
      return (
        <div className="img-main-wrapper" key={index}>
          <div className="img-wrapper">
            <div className="img-box">
              <label>
                <input
                  type="checkbox"
                  onChange={() => {}}
                  onClick={(e: any) => {
                    updatedImages(index, e.target.checked, ele.id);
                  }}
                  checked={ele.checked}
                />
                <span className="checkbox">
                  <img
                    src={`data:image/jpeg;charset=utf-8;base64,${ele.data.b64_image}`}
                    alt="gallery images"
                  />
                </span>
              </label>
            </div>
          </div>
          <div className="tag-box">
            {project.annotation_type === "bounding_box" && (
              <>
                {ele.classes.slice(0, 2).map((item: any, index: number) => (
                  <span key={`${item.className}-${index}`} className="tag grey">
                    {item.className} ({item.count})
                  </span>
                ))}
              </>
            )}
            {project.annotation_type !== "bounding_box" && (
              <>
                {ele.classes.slice(0, 2).map((item: any, index: number) => (
                  <span key={`${item.className}-${index}`} className="tag grey">
                    {item.className} - {item.confidence}%
                  </span>
                ))}
              </>
            )}

            {ele.classes.length > 2 && (
              <span
                className="tag grey plus-tag"
                onClick={() => showTagModal(index)}
              >{`+${ele.classes.slice(2).length}`}</span>
            )}
          </div>
        </div>
      );
    });
  };

  const renderSelectedImages = (selectedData: any, isSelected: boolean) => {
    return selectedData.map((ele: any, index: number) => (
      <div className="img-main-wrapper" key={index}>
        <div className="img-wrapper">
          <div className="img-box">
            {isSelected && (
              <button
                type="button"
                className="btn btn-close btn-secondary"
                onClick={(e: any) => {
                  updatedImages(index, e.target.checked, ele.id);
                }}
              ></button>
            )}
            {!isSelected && (
              <button
                type="button"
                className="btn btn-close btn-secondary"
                onClick={(e: any) => {
                  removeRandomItem(index);
                }}
              ></button>
            )}
            <img
              src={`data:image/jpeg;charset=utf-8;base64,${ele.content}`}
              alt="gallery images"
            />
          </div>
        </div>
        <div className="tag-box">
          {ele.classes.slice(0, 2).map((item: any, index: number) => (
            <span key={`${item.className}-${index}`} className="tag grey">
              {item.className} ({item.count}) - {item.confidence}%
            </span>
          ))}
          {ele.classes.length > 2 && (
            <span
              className="tag grey plus-tag"
              onClick={() => showTagModal(index)}
            >{`+${ele.classes.slice(2).length}`}</span>
          )}
        </div>
      </div>
    ));
  };

  // function to delete all the selected images
  const deleteSelectedImages = async () => {
    let updatedData: any = [];
    images.forEach((ele: any, index: number) => {
      updatedData[index] = { ...ele };
    });
    updatedData.map((item: any) => {
      if (item.checked) {
        item.checked = false;
      }
    });
    setImages(updatedData);
    await setSelectedImagesCount(0);
    if (annotateContent.selectedImages.length > NumberLimit.ZERO) {
      dispatch(addSelectedContent([]));
    }
  };

  const history = createBrowserHistory();

  const navigateToAnnotate = () => {
    navigate(`/imageAnnotate/${project_id}/${project.datasetid}`, {
      state: history.location,
    });
  };

  const showUnAnnotateScrollar = () => {
    return tab === "first" && renderImages();
  };

  const showAnnotateScrollar = () => {
    let randomData: any = [];
    const selectedData = images.filter((ele: any) => ele.checked);
    if (selectedData.length === 0) {
      annotateContent?.selectedImages.map((item: any) => {
        const data = images.filter((ele: any) => ele.id === item.id);
        data.length > 0 && randomData.push(data[0]);
      });
    }
    return (
      tab === "second" &&
      renderSelectedImages(
        selectedData.length > 0 ? selectedData : randomData,
        selectedData.length > 0 ? true : false
      )
    );
  };

  return (
    <Modal className="inspect-image-modal" centered show={show}>
      <div className="modal-head-section">
        <div className="modal-head">
          <h3>
            Inspect Images{" "}
            <Button
              variant="secondary"
              className="btn-close"
              onClick={() => closeModalFunc()}
            ></Button>
          </h3>
        </div>
      </div>
      <Modal.Body>
        {/* <Layout> */}
        <>
          {isLoading && (
            <div className="loader">
              <div className="loader-inner"></div>
            </div>
          )}
          <div className="steps annotation-step-2">
            <div className="tab-wrapper">
              <Tab.Container id="left-tabs-example" defaultActiveKey={tab}>
                <Nav variant="pills">
                  <Nav.Item
                    onClick={() => {
                      setTab("first");
                    }}
                  >
                    <Nav.Link eventKey="first">
                      {`All Images (${images.length}`})
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link
                      eventKey="second"
                      disabled={selectedImagesCount === 0}
                      onClick={() => {
                        setTab("second");
                      }}
                    >
                      {`Selected (${selectedImagesCount}`})
                    </Nav.Link>
                  </Nav.Item>
                </Nav>

                {/* filter-section-right */}

                <Tab.Content>
                  <Tab.Pane eventKey="first">
                    <>
                      <div className={`loader-inline ${!loader && "d-none"}`}>
                        <div className="loader-inner"></div>
                      </div>
                      <div className="annotation-gallery">
                        {images.length > NumberLimit.ZERO &&
                          tab === "first" && (
                            <>
                              <div className="img-container">
                                {showUnAnnotateScrollar()}
                              </div>
                            </>
                          )}
                      </div>
                    </>
                  </Tab.Pane>

                  <Tab.Pane eventKey="second">
                    <>
                      <div className={`loader-inline ${!loader && "d-none"}`}>
                        <div className="loader-inner"></div>
                      </div>
                      <div className="annotation-gallery">
                        {images.length > NumberLimit.ZERO &&
                          tab === "second" && (
                            <>
                              <div className="img-container">
                                {showAnnotateScrollar()}
                              </div>
                            </>
                          )}
                      </div>
                    </>
                  </Tab.Pane>
                </Tab.Content>
              </Tab.Container>
            </div>

            <div className="annotation-footer">
              <div className="annotation-inner">
                {tab === "first" && (
                  <div className="left-item">
                    <div className="refresh-icon">
                      <button disabled={refreshDisabled} onClick={fetchImgData}>
                        Refresh
                      </button>
                    </div>
                    {/* <div className='add-img-box add-img-box-re'>
                      <input
                        className='form-control'
                        value={randomImages}
                        type='number'
                        placeholder='0'
                        onChange={setRandomNumber}
                        onKeyDown={(e) => {
                          if (e.key === '.') {
                            e.preventDefault();
                          } else if (e.key === 'Backspace') {
                            setShowRandomToast(false);
                          } else {
                            setShowRandomToast(true);
                          }
                        }}
                      />
                      <button
                        type='button'
                        className='btn link-btn green'
                        disabled={
                          randomImages === NumberLimit.ZERO || randomImages > images.length
                        }
                        onClick={() => addRandomImageCheck()}
                      >
                        Re-sample
                      </button>
                    </div> */}
                  </div>
                )}
                <div className="right-item">
                  <button
                    type="button"
                    className="btn minus-btn"
                    onClick={() => deleteSelectedImages()}
                  >
                    <img src={MINUS_ICON} /> {selectedImagesCount} Images
                  </button>
                  <button
                    type="button"
                    className="btn primary-btn re-annotate-btn"
                    disabled={
                      selectedImages?.length === NumberLimit.ZERO &&
                      annotateContent.selectedImages.length === NumberLimit.ZERO
                    }
                    onClick={() => navigateToAnnotate()}
                  >
                    Re-annotate
                  </button>
                </div>
              </div>
            </div>
            {/* annotation-footer */}
          </div>

          {openModal && (
            <AddRandomlyModal
              show={openModal}
              closeModal={() => setOpenModal(false)}
              addContent={() => addRandomImages()}
              addManualContent={() =>
                setManualImages(manualValue, manualChecked)
              }
              images={images}
            />
          )}
          {showTooltip && (
            <ViewMoreUncertainTag
              show={showTooltip}
              closeModal={() => setShowTooltip(false)}
              data={tooltipData}
            />
          )}
        </>
        {/* </Layout> */}
      </Modal.Body>
    </Modal>
  );
};

export default UncertainImgModal;
