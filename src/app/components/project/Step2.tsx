import React, { useEffect, useState } from "react";
import { Nav, Tab } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  FILTER_ICON,
  MINUS_ICON,
  ARROW_LEFT_ICON,
} from "../../../constant/image";
import { AppDispatch } from "../../../store";
import { getContent, getRandomContent } from "./redux/content";
import { addSelectedContent } from "../annotate/redux/annotateImage";
import { NumberLimit } from "../../../constant/number";
import { ANNOTATE, NAME, DATASET_ID } from "../../../constant/static";
import DisplayTagName from "./DisplayTagName";
import AddRandomlyModal from "../modals/AddRandomlyModal";
import { showToast } from "../common/redux/toast";
import Layout from "./layout/Layout";
import AnnotateFilterModal from "../modals/AnnotateFilterModal";
import { getTagsQuery } from "../annotate/redux/annotateTags";
import { createBrowserHistory } from "history";
import {
  CREATE_PROJECT,
  CREATE_PROJECT_STEP3,
  PROJECT_OVERVIEW_STEP3,
} from "../../../utils/routeConstants";
import { getAnnotateStatistics } from "./redux/statistics";
import { getTagsList } from "../../../service/tags";

const Step2: React.FunctionComponent = () => {
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();
  const { project_id, annotate } = useParams();
  const [randomImages, setRandomImages] = useState<number | string>(
    NumberLimit.ZERO
  );
  const [images, setImages] = useState<any[]>([]);
  const [annotateImages, setAnnotateImages] = useState<any[]>([]);
  const [filterAnnotateImages, setFilterAnnotateImages] = useState<
    Array<object>
  >([]);
  const [selectedImagesCount, setSelectedImagesCount] = useState<number>(
    NumberLimit.ZERO
  );
  const [selectedImages, setSelectedImages] = useState<any[]>([]);
  const [pageNo, setPage] = useState<number>(NumberLimit.ZERO);
  const [annotatePage, setAnnotatePage] = useState<number>(NumberLimit.ZERO);
  const [filterAnnotatePage, setFilterAnnotatePage] = useState<number>(
    NumberLimit.ZERO
  );
  const [tab, setTab] = useState(annotate === ANNOTATE ? "second" : "first");
  const [annotatedCount, setAnnotatedCount] = useState<number>(
    NumberLimit.ZERO
  );
  const [unAnnotatedCount, setUnAnnotatedCount] = useState<number>(
    NumberLimit.ZERO
  );
  const [filterAnnotatedCount, setFilterAnnotatedCount] = useState<number>(
    NumberLimit.ZERO
  );
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [manualValue, setManualImgValue] = useState<string>("");
  const [manualChecked, setManualIsChecked] = useState<boolean>(false);
  const [filterModal, setFilterModal] = useState<boolean>(false);
  const [filterTagId, setFilterTagId] = useState<Array<string>>([]);
  const [showRandomToast, setShowRandomToast] = useState<boolean>(false);
  const [startUnannote, setStartUnannote] = useState(NumberLimit.ZERO);
  const [endUnnotate, setEndUnnotate] = useState(NumberLimit.TWINTY_FOUR);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [disableRandom, setDisableRandom] = useState<boolean>(false);
  const [tagListData, setTagList] = useState<any>([]);

  const { project, annotateContent, dataSet, annotateTag, content } =
    useSelector((state: any) => state);

  useEffect(() => {
    searchTagQuery("");
  }, []);

  useEffect(() => {
    if (
      (annotateImages.length === NumberLimit.ZERO || tab === "second") &&
      dataSet.id
    ) {
      dispatch(
        getAnnotateStatistics({
          project_id: project_id,
          dataset_id: dataSet.id,
        })
      );
      getAnnotatedImages();
    }
  }, [dataSet]);

  useEffect(() => {
    const count = content?.unAnnotateCount
      ? content.unAnnotateCount
      : unAnnotatedCount; // sometimes content is undefined
    if (
      project_id &&
      (images.length < count || randomImages > NumberLimit.ZERO) // condition applied to prevent duplicate entries in img array
    ) {
      getUnAnnotatedImages();
    }
    const page =
      pageNo === NumberLimit.ZERO ? NumberLimit.ONE : pageNo + NumberLimit.ONE;
    setStartUnannote(page * NumberLimit.TWINTY_FOUR - NumberLimit.TWINTY_FOUR);
    setEndUnnotate(page * NumberLimit.TWINTY_FOUR);
  }, [pageNo]);

  useEffect(() => {
    setAnnotatePage(annotatePage);
    if (
      project_id &&
      tab === "second" &&
      (annotateImages.length === NumberLimit.ZERO ||
        annotateImages.length < content.annotateCount)
    ) {
      getAnnotatedImages();
    }
  }, [project, annotatePage]);

  useEffect(() => {
    if (
      project_id &&
      (filterAnnotateImages.length === NumberLimit.ZERO ||
        filterAnnotateImages.length < filterAnnotatedCount)
    ) {
      getAnnotatedImages(filterTagId);
    }
  }, [filterAnnotatePage]);

  useEffect(() => {
    setPage(NumberLimit.ZERO);
    setFilterTagId([]);
    if (tab === "first") {
      setImages([]);
      setPage(NumberLimit.ZERO);
      setFilterAnnotateImages([]);
      getUnAnnotatedImages();
    } else if (tab === "second") {
      setAnnotateImages([]);
      setAnnotatePage(NumberLimit.ZERO);
      getAnnotatedImages();
    }
  }, [tab]);

  useEffect(() => {
    const data = annotateContent.selectedImages;
    const unique: any[] = [];
    data.map((x: { name: any }) =>
      unique.filter((a) => a.name == x.name).length > NumberLimit.ZERO
        ? null
        : unique.push(x)
    );
    setSelectedImages(unique);
    setSelectedImagesCount(unique?.length);
  }, [annotateContent]);

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

  // function to integrate the get unannotated images api
  const getUnAnnotatedImages = () => {
    setIsLoading(true);
    dispatch(
      getContent({
        limit: NumberLimit.TWINTY_FOUR,
        page: pageNo,
        project_id,
      })
    )
      .then(async (res) => {
        const uniqueData: any[] = [];
        const items = await ImageData(res.payload.content, images);
        const updatedData = items.map((ele: any) => ({
          ...ele,
          checked: ele.checked || false,
        }));
        updatedData.map((x: { name: any }) =>
          uniqueData.filter((a) => a.name == x.name).length > NumberLimit.ZERO
            ? null
            : uniqueData.push(x)
        );
        setImages(uniqueData);
        setIsLoading(false);
        setUnAnnotatedCount(res.payload.count);
      })
      .catch(() => {
        setIsLoading(false);
      });
  };

  // function to integrate the annotated images api
  const getAnnotatedImages = async (
    tagData?: Array<string>,
    newData?: boolean | false
  ) => {
    let payload = {};
    if (tagData && tagData.length > NumberLimit.ZERO) {
      const tagIdData = tagData.reduce((finalStr, currVal) => {
        return (finalStr = `${finalStr}&tag_id=${currVal}`);
      }, "");
      payload = {
        limit: NumberLimit.TWINTY_FOUR,
        page: filterAnnotatePage,
        project_id,
        dataset_id: dataSet.id,
        tag_id: tagIdData,
      };
      setFilterTagId(tagData);
    } else if (dataSet.id) {
      payload = {
        limit: NumberLimit.TWINTY_FOUR,
        page: annotatePage,
        project_id,
        dataset_id: dataSet.id,
      };
    }
    if (newData && tagData && tagData.length > NumberLimit.ZERO) {
      setFilterAnnotateImages([]);
      setFilterAnnotatePage(NumberLimit.ZERO);
    }
    if (project_id && dataSet.id) {
      setIsLoading(true);
      const { data } = await getTagsList(project.id, dataSet.id);
      setTagList((prev: any) => {
        let flattered = [...prev, data?.tags].flat(Infinity);
        return flattered;
      });
      dispatch(getContent(payload))
        .then((res) => {
          setIsLoading(false);
          if (res.meta.arg.tag_id) {
            setFilterAnnotateImages(res.payload.content);
            setFilterAnnotatedCount(res.payload.count);
          } else {
            const items = ImageData(res.payload.content, annotateImages);
            setFilterAnnotateImages([]);
            setFilterTagId([]);
            setAnnotateImages(res.payload.content);
            setAnnotatedCount(res.payload.count);
          }
        })
        .catch(() => {
          setIsLoading(false);
        });
    }
  };

  // function to set the random selection count
  const setRandomNumber = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const value = e.target.value;
    if (Number(value) >= NumberLimit.ZERO) {
      setRandomImages(value.replace(/^0+/, "").toString());
    } else {
      e.preventDefault();
    }
  };

  // function to call api to fetch the random images count
  const addRandomImageCheck = () => {
    const selectedData = images.filter((ele) => ele.checked);
    if (selectedData.length > NumberLimit.ZERO) {
      setOpenModal(true);
    } else if (randomImages !== selectedImagesCount) {
      addRandomImages();
    }
  };

  const addRandomImages = () => {
    deleteSelectedImages();
    setDisableRandom(true);
    dispatch(getRandomContent({ project_id, count: randomImages })).then(
      (res: any) => {
        if (res.payload) {
          setDisableRandom(false);
          const data = res.payload.content;
          dispatch(addSelectedContent(data));
          setRandomImages(data?.length);
        }
      }
    );
  };

  const ImageData = (result: Array<any>, originalData: Array<any>) => {
    const data: any[] = [...originalData];
    if (data.length === NumberLimit.ZERO) {
      data.push(...result);
    }
    if (
      data.length > NumberLimit.ZERO &&
      (data.length !== result.length ||
        data[NumberLimit.ZERO].id !== result[NumberLimit.ZERO].id)
    ) {
      data.push(...result);
    }
    return data;
  };

  // sets the selected images count on the change of images array
  useEffect(() => {
    if (randomImages === NumberLimit.ZERO) {
      const selectedData = images.filter((ele) => ele.checked);
      setSelectedImagesCount(selectedData.length);
      dispatch(addSelectedContent(selectedData));
    }
  }, [images]);

  useEffect(() => {
    if (randomImages > unAnnotatedCount && showRandomToast) {
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

  const getTagsName = (annotationData: Array<string>) => {
    if (annotationData?.length) {
      let data = tagListData?.find(
        (tag: any) => tag?.id === annotationData[NumberLimit.ZERO]
      );
      return data?.name;
      //return <DisplayTagName tagListData={tagListData} tag_id={annotationData[NumberLimit.ZERO]} />;
    }
    return "-";
  };

  // function to handle the selection and deselection of images
  const updatedImages = (value: number, isChecked: boolean, id: string) => {
    const selectedData = images.filter((ele) => ele.checked);
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

  const setManualImages = (value: string, isChecked: boolean) => {
    setRandomImages(NumberLimit.ZERO);
    setImages((prev) =>
      prev.map((img, index) =>
        img.id === value
          ? {
              ...img,
              checked: isChecked,
            }
          : img
      )
    );
  };

  // function to render the images on UI
  const renderImages = () => {
    return images?.slice(startUnannote, endUnnotate).map((ele, index) => (
      <div className="img-wrapper" key={ele.id}>
        <div className="img-box">
          <label>
            <input
              type="checkbox"
              onChange={() => {}}
              disabled={disableRandom}
              onClick={(e: any) => {
                updatedImages(index, e.target.checked, ele.id);
              }}
              checked={ele.checked}
            />
            <span className="checkbox">
              <img
                src={`data:image/png;base64,${ele.b64_image}`}
                alt="gallery images"
              />
            </span>
          </label>
        </div>
      </div>
    ));
  };

  // function to render the images on UI
  const renderAnnotateImages = (data: any) => {
    return data.map((ele: any, ind: number) => {
      const image_preview_b64 = ele.annotation[0].b64_image || ele.b64_image;
      return (
        <div className="img-wrapper with-tag" key={`${ele.id}-${ind}`}>
          <div className="img-box">
            <img
              src={`data:image/png;base64,${image_preview_b64}`}
              alt="gallery images"
            />
          </div>
          <div className="tag-box annotate">
            {ele?.annotation?.length &&
            ele?.annotation[NumberLimit.ZERO]?.tagids?.length >
              NumberLimit.ZERO ? (
              <>
                {" "}
                {!!(
                  ele?.annotation?.length &&
                  ele?.annotation[NumberLimit.ZERO]?.tagids?.length
                ) && (
                  <div className="tag grey">
                    {getTagsName(ele?.annotation[NumberLimit.ZERO].tagids)}
                  </div>
                )}
                {!!(
                  ele?.annotation?.length &&
                  ele?.annotation[NumberLimit.ZERO]?.tagids?.length >
                    NumberLimit.ONE
                ) && (
                  <div className="tag grey count">
                    +
                    {ele?.annotation[NumberLimit.ZERO]?.tagids?.length -
                      NumberLimit.ONE}
                  </div>
                )}
              </>
            ) : (
              <div className="tag grey">null</div>
            )}
          </div>
        </div>
      );
    });
  };

  // function to delete all the selected images
  const deleteSelectedImages = () => {
    images.map((item, index) => {
      if (item.checked) {
        updatedImages(index, false, item.id);
      }
    });
    if (annotateContent.selectedImages.length > NumberLimit.ZERO) {
      dispatch(addSelectedContent([]));
    }
  };

  const history = createBrowserHistory();
  const location = history.location.pathname;

  const navigateToAnnotate = () => {
    navigate(`/imageAnnotate/${project_id}/${dataSet.id}`, {
      state: history.location,
    });
  };

  // function to set unannotate page count
  const fetchData = (page: number) => {
    setPage(page);
  };

  // function to set annotate page count
  const fetchAnnotateData = (pageNo: number) => {
    setAnnotatePage(pageNo);
  };

  // function to set filter annotate page count
  const fetchFilterAnnotateData = (page: number) => {
    setFilterAnnotatePage(page);
  };

  const showUnAnnotateScrollar = (data: any, count: number) => {
    return tab === "first" && renderImages();
  };

  const showAnnotateScrollar = (data: any, count: number) => {
    return renderAnnotateImages(annotateImages);
  };

  const showFilterAnnotateScrollar = (data: any, count: number) => {
    return renderAnnotateImages(filterAnnotateImages);
  };

  return (
    <Layout>
      <>
        {isLoading && (
          <div className="loader">
            <div className="loader-inner"></div>
          </div>
        )}
        <div className="steps annotation-step-2">
          <div className="page-header">
            <div className="left-item">
              <h3>
                Annotate Images
                <span className="sm-txt">
                  {tab === "first"
                    ? "You can select the images manually or add randomly to start annotation"
                    : "You can now move the images to Dataset"}
                </span>
              </h3>
            </div>
            <div className="right-item">
              {tab === "second" && (
                <button
                  type="button"
                  className="btn primary-btn dataset-btn"
                  onClick={() => {
                    location.includes(CREATE_PROJECT)
                      ? navigate(`${CREATE_PROJECT_STEP3}/${project_id}`)
                      : navigate(`${PROJECT_OVERVIEW_STEP3}/${project_id}`);
                  }}
                >
                  Move to Dataset
                </button>
              )}
            </div>
          </div>
          {/* page-header */}
          <div className="tab-wrapper">
            <Tab.Container id="left-tabs-example" defaultActiveKey={tab}>
              <Nav variant="pills">
                <Nav.Item
                  onClick={() => {
                    setTab("first");
                  }}
                >
                  <Nav.Link eventKey="first">
                    Un-annotated ({unAnnotatedCount || content?.unAnnotateCount}
                    )
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link
                    eventKey="second"
                    onClick={() => {
                      setTab("second");
                    }}
                  >
                    Annotated (
                    {filterTagId.length !== NumberLimit.ZERO
                      ? filterAnnotatedCount
                      : annotatedCount}
                    )
                  </Nav.Link>
                </Nav.Item>
              </Nav>

              {tab === "second" && (
                <div
                  className="filter-section-right"
                  onClick={() => setFilterModal(true)}
                >
                  <button type="button" className="btn link-btn filter-btn">
                    {filterTagId.length !== NumberLimit.ZERO && (
                      <span className="filter-dot"></span>
                    )}
                    <img src={FILTER_ICON} alt="sort icon" /> Filter
                  </button>
                </div>
              )}
              {/* filter-section-right */}

              <Tab.Content>
                <Tab.Pane eventKey="first">
                  <div className="annotation-gallery">
                    {images.length > NumberLimit.ZERO && tab === "first" && (
                      <div className="img-container">
                        {showUnAnnotateScrollar(images, unAnnotatedCount)}
                      </div>
                    )}
                  </div>
                </Tab.Pane>

                <Tab.Pane eventKey="second">
                  <>
                    <div className="annotation-gallery">
                      {annotateImages.length > NumberLimit.ZERO &&
                        tab === "second" &&
                        filterTagId.length === NumberLimit.ZERO && (
                          <>
                            <div className="img-container">
                              {showAnnotateScrollar(
                                annotateImages,
                                annotatedCount
                              )}
                            </div>
                          </>
                        )}
                      {filterAnnotateImages.length > NumberLimit.ZERO &&
                        tab === "second" &&
                        filterTagId.length !== NumberLimit.ZERO && (
                          <div className="img-container">
                            {showFilterAnnotateScrollar(
                              filterAnnotateImages,
                              filterAnnotatedCount
                            )}
                          </div>
                        )}
                      {(annotatedCount === NumberLimit.ZERO ||
                        (filterTagId.length !== NumberLimit.ZERO &&
                          filterAnnotateImages.length ===
                            NumberLimit.ZERO)) && (
                        <div className="empty-box">
                          <h4>No annotated images</h4>
                        </div>
                      )}
                    </div>
                  </>
                </Tab.Pane>
              </Tab.Content>
            </Tab.Container>
          </div>

          {tab === "first" && (
            <div className="annotation-footer">
              <div className="annotation-inner">
                <div className="left-item">
                  <div className="add-img-box">
                    <input
                      className="form-control"
                      value={randomImages}
                      type="number"
                      placeholder="0"
                      onChange={setRandomNumber}
                      onKeyDown={(e) => {
                        if (e.key === ".") {
                          e.preventDefault();
                        } else if (e.key === "Backspace") {
                          setShowRandomToast(false);
                        } else {
                          setShowRandomToast(true);
                        }
                      }}
                    />
                    <button
                      type="button"
                      className="btn link-btn green"
                      disabled={
                        !randomImages ||
                        randomImages === NumberLimit.ZERO ||
                        randomImages > unAnnotatedCount ||
                        disableRandom
                      }
                      onClick={() => addRandomImageCheck()}
                    >
                      Add Randomly
                    </button>
                  </div>
                </div>
                {unAnnotatedCount > NumberLimit.ZERO && (
                  <div className="upload-pagination">
                    <div className="count-no">
                      <div className="count-txt">
                        Page: {pageNo + NumberLimit.ONE}/
                        {Math.ceil(unAnnotatedCount / NumberLimit.TWINTY_FOUR)}
                      </div>
                      <button
                        type="button"
                        className="btn secondary-btn"
                        onClick={() => fetchData(pageNo - NumberLimit.ONE)}
                        disabled={pageNo + NumberLimit.ONE === NumberLimit.ONE}
                      >
                        <img src={ARROW_LEFT_ICON} alt="images" />
                      </button>
                      <button
                        type="button"
                        className="btn secondary-btn"
                        onClick={() => fetchData(pageNo + NumberLimit.ONE)}
                        disabled={
                          pageNo + NumberLimit.ONE ===
                          Math.ceil(unAnnotatedCount / NumberLimit.TWINTY_FOUR)
                        }
                      >
                        <img src={ARROW_LEFT_ICON} alt="images" />
                      </button>
                    </div>
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
                    className="btn primary-btn"
                    disabled={selectedImages?.length === NumberLimit.ZERO}
                    onClick={() => navigateToAnnotate()}
                  >
                    Start Annotation
                  </button>
                </div>
              </div>
            </div>
          )}

          {tab === "second" && (
            <div className="annotation-footer">
              <div className="annotation-inner">
                {filterAnnotateImages.length > NumberLimit.ZERO &&
                tab === "second" ? (
                  <div className="upload-pagination tab-2-pagination">
                    <div className="count-no">
                      <div className="count-txt">
                        Page: {filterAnnotatePage + NumberLimit.ONE}/
                        {Math.ceil(
                          filterAnnotatedCount / NumberLimit.TWINTY_FOUR
                        )}
                      </div>
                      <button
                        type="button"
                        className="btn secondary-btn"
                        onClick={() =>
                          fetchFilterAnnotateData(
                            filterAnnotatePage - NumberLimit.ONE
                          )
                        }
                        disabled={
                          filterAnnotatePage + NumberLimit.ONE ===
                          NumberLimit.ONE
                        }
                      >
                        <img src={ARROW_LEFT_ICON} alt="images" />
                      </button>
                      <button
                        type="button"
                        className="btn secondary-btn"
                        onClick={() =>
                          fetchFilterAnnotateData(
                            filterAnnotatePage + NumberLimit.ONE
                          )
                        }
                        disabled={
                          filterAnnotatePage + NumberLimit.ONE ===
                          Math.ceil(
                            filterAnnotatedCount / NumberLimit.TWINTY_FOUR
                          )
                        }
                      >
                        <img src={ARROW_LEFT_ICON} alt="images" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    {annotatedCount > NumberLimit.ZERO && (
                      <div className="upload-pagination tab-2-pagination">
                        <div className="count-no">
                          <div className="count-txt">
                            Page: {annotatePage + NumberLimit.ONE}/
                            {Math.ceil(
                              annotatedCount / NumberLimit.TWINTY_FOUR
                            )}
                          </div>
                          <button
                            type="button"
                            className="btn secondary-btn"
                            onClick={() =>
                              fetchAnnotateData(annotatePage - NumberLimit.ONE)
                            }
                            disabled={
                              annotatePage + NumberLimit.ONE === NumberLimit.ONE
                            }
                          >
                            <img src={ARROW_LEFT_ICON} alt="images" />
                          </button>
                          <button
                            type="button"
                            className="btn secondary-btn"
                            onClick={() =>
                              fetchAnnotateData(annotatePage + NumberLimit.ONE)
                            }
                            disabled={
                              annotatePage + NumberLimit.ONE ===
                              Math.ceil(
                                annotatedCount / NumberLimit.TWINTY_FOUR
                              )
                            }
                          >
                            <img src={ARROW_LEFT_ICON} alt="images" />
                          </button>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          )}
          {/* annotation-footer */}
        </div>

        {openModal && (
          <AddRandomlyModal
            show={openModal}
            closeModal={() => setOpenModal(false)}
            addContent={() => addRandomImages()}
            addManualContent={() => setManualImages(manualValue, manualChecked)}
            images={images}
          />
        )}
        {filterModal && (
          <AnnotateFilterModal
            open={filterModal}
            closeModal={() => setFilterModal(false)}
            queryTags={annotateTag.queryTags}
            selectedTagId={getAnnotatedImages}
            existingTagId={filterTagId}
            searchTag={searchTagQuery}
          />
        )}
      </>
    </Layout>
  );
};

export default Step2;
