import React, { useState, useEffect, useRef } from "react";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import { ListGroup, Tab, Dropdown, Modal, Button } from "react-bootstrap";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Buffer } from "buffer";
import Draggable from "react-draggable";
import { AppDispatch } from "../../../store";
import {
  DRAG_IMGES,
  CALENDAR_ICON,
  PLUS_GREY,
  MINUS_GREY,
  DOT_ICON,
  RESET_ICON,
  DEL_ICON,
  MAKE_ICON,
} from "../../../constant/image";
import NavBar from "../templates/NavBar";
import {
  deleteContent,
  changeCoverPhoto,
  finishAnnotation,
  addSelectedContent,
} from "./redux/annotateImage";
import {
  createTag,
  getAnnotateTagsData,
  getTagsQuery,
} from "./redux/annotateTags";
import { setLocal, getLocal } from "../../../utils/localStorage";
import { NumberLimit } from "../../../constant/number";
import AnnotateTags from "./annotateTags";
import { CONTENT_ID, DATASET_ID, NAME } from "../../../constant/static";
import { getContent, getSingleContent } from "../project/redux/content";
import {
  CREATE_PROJECT,
  CREATE_PROJECT_STEP2,
  PROJECT_OVERVIEW_STEP2,
} from "../../../utils/routeConstants";
import { getAnnotateStatistics } from "../project/redux/statistics";
import { BBoxAnnotator } from "./bbox_annotator";
import {
  getProjectAnnotationRequest,
  getProjectRequest,
} from "../project/redux/project";
import ResetImageSetting from "../modals/ResetImageSettingModal";
import AnnotateImgConfirmModal from "../modals/AnnotateImgConfirmModal";

const AnnotationImage = () => {
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();
  const imgRef = useRef<HTMLImageElement>(null);
  const [scale, setScale] = useState<number>(1);
  const [currentIndex, setCurrentIndex] = useState<number>(NumberLimit.ZERO);
  const [height, setHeight] = useState<number>(NumberLimit.ZERO);
  const [width, setWidth] = useState<number>(NumberLimit.ZERO);
  const [imgResolution, setImgResolution] = useState<string>("0");
  const [zoomLevel, setZoomLevel] = useState<any>(NumberLimit.ONE_HUNDRED);
  const [images, setImages] = useState<any>([]);
  const [currentImage, setCurrentImage] = useState<any>();
  const [isZoom, setIsZoom] = useState<boolean>(false);
  const [imgToDisplay, setImgToDisplay] = useState<any>();
  const [tagIds, setTagIds] = useState<string[]>([]);
  const [isLoader, setIsLoader] = useState<boolean>(true);
  const [fullImg, setFullImg] = useState<boolean>(true);
  const [resetOption, setResetOption] = useState<boolean>(false);
  const [unAnnotateCount, setUnAnnotateCount] = useState<number>(
    NumberLimit.ZERO
  );
  const [showTagSubmitModal, setShowTagSubmitModal] = useState<boolean>(false);
  const [originalTagIds, setOriginalTagIds] = useState<string[]>([]);
  const [origBoundingData, setOrigBoundingData] = useState<string[]>([]);
  const [backClick, setBackClick] = useState<boolean>(false);
  const [nextClick, setNextClick] = useState<boolean>(false);
  const [annotator, setAnnotator] = useState<any>();
  const [currentTagId, setCurrentTagId] = useState<string>("");
  const [boundingData, setBoundingData] = useState<Array<object>>([]);
  const [isFinishAnnotation, setIsFinishAnnotation] = useState<boolean>(false);
  const [draggable, setDraggable] = useState<boolean>(false);
  const [eventlistners, setEventListners] = useState<any>({});
  const [imageDimension, setImageDimension] = useState<any>({
    imgHeight: 0,
    imgWidth: 0,
  });
  const [restrictZoomout, setRestrictZoomout] = useState<number>(1.6);
  const [deleteimg, setDeleteImg] = useState<boolean>(false);
  const boxRef = useRef<any>();

  const { id, dataSetId } = useParams();
  const { annotateContent, annotateTag, project, content } = useSelector(
    (state: any) => state
  );

  const annotateNew = useRef(annotateTag);
  const prevLocation: any = useLocation();

  useEffect(() => {
    if (
      imgToDisplay &&
      project?.annotation_type === "bounding_box" &&
      document.getElementsByClassName("image_frame").length === 0
    ) {
      // added for Shubham zoom in code
      let scaling = 1;
      const image = new Image();
      image.src = `data:image/jpeg;charset=utf-8;base64,${imgToDisplay}`;
      image.onload = function () {
        let height = image.height;
        let width = image.width;
        while (
          height > boxRef?.current?.offsetHeight ||
          width > boxRef?.current?.offsetWidth
        ) {
          scaling -= 0.1;
          height = image.height * scaling;
          width = image.width * scaling;
        }
        if (scaling < 0.1) {
          scaling = 0.1;
        }
        let scaleElement = document.getElementById("frame");
        if (scaleElement) {
          scaleElement.style.scale = `${scaling}`;
        }
        setRestrictZoomout(scaling);
        setScale(scaling);
        setZoomLevel((scaling * 100).toFixed(0).toString());
      };
      const annotatorBox = new BBoxAnnotator({
        url: `data:image/jpeg;charset=utf-8;base64,${imgToDisplay}`,
        image_element: image,
        input_method: "text", // Can be one of ['text', 'select', 'fixed']
        show_label: true,
        labels:
          annotateNew.current.queryTags?.length > 0
            ? annotateNew.current.queryTags?.map((ele: any) => ele.name)
            : "",
        guide: false,
        width: width,
        height: height,
        scale: scaling || scale,
        onchange: async (entries: any, index?: number) => {
          if (index !== undefined) {
            removeFromTagList(index);
          } else if (entries.length !== 0) {
            const tagExist = annotateNew.current.queryTags?.filter(
              (ele: any) => ele.name === entries[entries.length - 1].label
            );
            if (tagExist?.length > 0) {
              setCurrentTagId(tagExist[0].id);
              addToTagList(tagExist[0].id);
              getDimensions(entries, tagExist[0].id);
            } else {
              createAnnotateTag(entries[entries.length - 1].label, entries);
            }
          }
        },
      });
      setAnnotator(annotatorBox);
      isFinishAnnotation && finishAnnotationApi();
    }
  }, [imgToDisplay, project, annotateTag, isFinishAnnotation]);

  useEffect(() => {
    dispatch(getProjectAnnotationRequest({ id }));
    searchTagQuery("");
    setUnAnnotateCount(content.unAnnotateCount);
  }, []);

  useEffect(() => {
    annotateNew.current = annotateTag;
  }, [annotateTag]);

  useEffect(() => {
    if (content.unAnnotateCount) {
      setUnAnnotateCount(content.unAnnotateCount);
    }
  }, [content]);

  useEffect(() => {
    if (id) {
      dispatch(getProjectAnnotationRequest({ id }));
    }
  }, [id]);

  useEffect(() => {
    try {
      if (annotateContent.selectedImages.length > 0) {
        setIsLoader(true);
        !deleteimg && setCurrentIndex((index) => NumberLimit.ZERO);
        setImages(() => annotateContent.selectedImages);
        setLocal("images", annotateContent.selectedImages);
      } else if (getLocal("images").length > 0) {
        dispatch(addSelectedContent(getLocal("images")));
      }
      if (
        (annotateContent.selectedImages.length || getLocal("images").length) ===
        currentIndex
      ) {
        setIsLoader(true);
        !deleteimg &&
          setCurrentIndex((index) => {
            if (index > 0) {
              return index - 1;
            }
            return 0;
          });
      }
      setDeleteImg(false);
    } catch (error) {
      console.log(error);
    }
  }, [annotateContent]);

  useEffect(() => {
    setCurrentImage(images && images[currentIndex]);
    setBackClick(false);
    setNextClick(false);
  }, [images, currentIndex]);

  useEffect(() => {
    try {
      const contentId = currentImage && currentImage.id;
      if (
        contentId ===
          (images && images[currentIndex] && images[currentIndex].id) &&
        !isFinishAnnotation
      ) {
        existingAssociatedTags();
      }
      if (contentId && !isFinishAnnotation) {
        const payload = {
          content_id: contentId,
          project_id: id,
          dataset_id: dataSetId,
        };
        dispatch(getSingleContent(payload)).then((response: any) => {
          setIsLoader(false);
          setImgToDisplay(
            Buffer.from(response.payload, "binary").toString("base64")
          );
        });
      }
      setHeight(currentImage && currentImage.height);
      setWidth(currentImage && currentImage.width);
    } catch (error) {
      console.log(error);
    }
  }, [currentImage, isFinishAnnotation]);

  useEffect(() => {
    const resolution = (height * width) / NumberLimit.ONE_CRORE;
    setImgResolution(resolution.toFixed(NumberLimit.TWO));
  }, [width, height]);

  useEffect(() => {
    setTagIds(tagIds);
  }, [tagIds]);

  useEffect(() => {
    setCurrentTagId(currentTagId);
  }, [currentTagId]);

  useEffect(() => {
    try {
      if (!isFinishAnnotation) {
        const resultedData: Array<object> = [];
        boundingData?.map((ele: any) => {
          let tagname = "";
          annotateTag.queryTags?.map((item: any) => {
            if (ele.tagid && item.id === ele.tagid) {
              tagname = item.name;
            }
          });
          resultedData.push({
            left: ele.xmin || 0,
            top: ele.ymin || 0,
            width: (ele.xmax || 0) - (ele.xmin || 0),
            height: (ele.ymax || 0) - (ele.ymin || 0),
            label: tagname,
          });
        });
        annotator &&
          resultedData.map((ele: object) => annotator.add_entry(ele));
      }
    } catch (error) {
      console.log(error);
    }
  }, [annotator]);

  const getDimensions = (entries: any, TagId?: string) => {
    const entry = entries[entries.length - 1];
    setBoundingData((prevState) => {
      const data = [...prevState];
      const dataToAdd = {
        tagid: TagId !== undefined ? TagId : currentTagId,
        xmax: entry.width + entry.left,
        xmin: entry.left,
        ymax: entry.height + entry.top,
        ymin: entry.top,
      };
      data.push(dataToAdd);
      return data;
    });
  };

  const goToPrevSlide = () => {
    setFullImg(true);
    setIsZoom(false);
    setDraggable(false);
    //setZoomLevel(NumberLimit.ONE_HUNDRED);
    if (
      currentIndex !== 0 &&
      JSON.stringify(
        project?.annotation_type !== "bounding_box"
          ? originalTagIds
          : origBoundingData
      ) ===
        JSON.stringify(
          project?.annotation_type !== "bounding_box" ? tagIds : boundingData
        )
    ) {
      setIsLoader(true);
      setTagIds([]);
      setBoundingData([]);
      setCurrentIndex((current) => current - 1);
    }
    if (
      JSON.stringify(
        project?.annotation_type !== "bounding_box"
          ? originalTagIds
          : origBoundingData
      ) !==
      JSON.stringify(
        project?.annotation_type !== "bounding_box" ? tagIds : boundingData
      )
    ) {
      setShowTagSubmitModal(true);
      setBackClick(true);
    }
    //setScale(NumberLimit.ONE)
  };

  const submitAnnotate = async () => {
    setIsLoader(true);
    setFullImg(true);
    setDraggable(false);
    if (
      currentIndex !== images.length - 1 &&
      project?.annotation_type === "bounding_box"
    ) {
      setIsFinishAnnotation(() => true); // flag to call the bounding constructor again in order to change the image
    }
    if (
      currentIndex === images.length - 1 &&
      JSON.stringify(originalTagIds) === JSON.stringify(tagIds) &&
      unAnnotateCount !== 0 &&
      project?.annotation_type !== "bounding_box"
    ) {
      setResetOption(true);
      setIsLoader(false);
    } else if (
      currentIndex === images.length - 1 &&
      JSON.stringify(origBoundingData) === JSON.stringify(boundingData) &&
      unAnnotateCount !== 0 &&
      project?.annotation_type === "bounding_box"
    ) {
      setResetOption(true);
      setIsLoader(false);
    } else if (
      currentIndex === images.length - 1 &&
      !backClick &&
      project?.annotation_type === "bounding_box"
    ) {
      // !backclick applied coz in case of backclick enabled, we have to change the image
      finishAnnotationApi(true);
    } else if (
      currentIndex === images.length - 1 &&
      backClick &&
      project?.annotation_type === "bounding_box"
    ) {
      setIsFinishAnnotation(() => true);
    } else if (project?.annotation_type !== "bounding_box") {
      finishAnnotationApi(true);
    }
    if (currentIndex !== images.length - 1) {
      !backClick && setCurrentIndex((current) => current + 1);
    }
    if (backClick) {
      setCurrentIndex((current) => current - 1);
    }
    //setScale(NumberLimit.ONE)
    //setZoomLevel(NumberLimit.ONE_HUNDRED)
  };

  const goToNextSlide = async () => {
    //setZoomLevel(NumberLimit.ONE_HUNDRED);
    setIsZoom(false);
    setFullImg(true);
    setDraggable(false);
    if (
      currentIndex !== images.length - 1 &&
      JSON.stringify(
        project?.annotation_type !== "bounding_box"
          ? originalTagIds
          : origBoundingData
      ) ===
        JSON.stringify(
          project?.annotation_type !== "bounding_box" ? tagIds : boundingData
        )
    ) {
      setIsLoader(true);
      setCurrentIndex((current) => current + 1);
    } else if (
      currentIndex === images.length - 1 &&
      (tagIds.length === 0 ||
        JSON.stringify(originalTagIds) === JSON.stringify(tagIds)) &&
      unAnnotateCount !== 1 &&
      project?.annotation_type !== "bounding_box"
    ) {
      setResetOption(true);
    } else if (
      currentIndex === images.length - 1 &&
      (boundingData.length === 0 ||
        JSON.stringify(origBoundingData) === JSON.stringify(boundingData)) &&
      unAnnotateCount !== 1 &&
      project?.annotation_type === "bounding_box"
    ) {
      setResetOption(true);
    }
    if (
      JSON.stringify(
        project?.annotation_type !== "bounding_box"
          ? originalTagIds
          : origBoundingData
      ) !==
      JSON.stringify(
        project?.annotation_type !== "bounding_box" ? tagIds : boundingData
      )
    ) {
      setShowTagSubmitModal(true);
      setNextClick(true);
    }
    //setScale(NumberLimit.ONE)
  };

  const finishAnnotationApi = async (isSingleImg?: boolean | false) => {
    let payload = {};
    let contentId = "";
    if (isSingleImg || project?.annotation_type === "classification") {
      contentId = currentImage && currentImage.id;
    } else {
      if (backClick) {
        contentId = images && images[currentIndex + 1].id;
      } else if (!backClick && currentIndex > 0) {
        contentId = images && images[currentIndex - 1].id;
      } else {
        contentId = images && images[currentIndex].id;
      }
    }
    if (project?.annotation_type === "bounding_box") {
      payload = {
        content_id: contentId,
        dataset_id: dataSetId,
        metadata: {
          bounding_boxes: boundingData,
        },
        project_id: id,
        tag_id: tagIds,
      };
    } else {
      payload = {
        content_id: currentImage && currentImage.id,
        dataset_id: dataSetId,
        project_id: id,
        tag_id: tagIds,
      };
    }
    await dispatch(finishAnnotation(payload));
    dispatch(
      getContent({
        limit: NumberLimit.TWINTY_FOUR,
        page: NumberLimit.ZERO,
        project_id: id,
      })
    );
    setIsFinishAnnotation(() => false);
    if (currentIndex === images.length - 1 && isSingleImg) {
      setIsLoader(false);
      setBoundingData([]);
      existingAssociatedTags();
    }
  };

  const navigateOnFinishAnnotation = () => {
    prevLocation.state.pathname.includes(CREATE_PROJECT) &&
      navigate(`${CREATE_PROJECT_STEP2}/${id}/annotate`);
    !prevLocation.state.pathname.includes(CREATE_PROJECT) &&
      navigate(`${PROJECT_OVERVIEW_STEP2}/${id}/annotate`);
  };

  useEffect(() => {
    if (
      project?.annotation_type === "bounding_box" &&
      scale >= restrictZoomout &&
      scale < 1.6
    ) {
      annotator && annotator?.handle_zoomin({ scale: scale });
      setZoomLevel((scale * 100).toFixed(0));
    } else if (
      project?.annotation_type === "classification" &&
      scale > 1 &&
      scale < 1.6
    ) {
      setHeight(imageDimension?.imgHeight);
      setWidth(imageDimension?.imgWidth);
      setZoomLevel(scale * 100);
    }
  }, [scale, imageDimension.height]);

  const handleZoomIn = () => {
    setIsZoom(true);
    setFullImg(false);
    let imgHeight = 0;
    let imgWidth = 0;
    let imageframe = document.getElementsByClassName("image_frame");
    // Fetching current height and width
    if (
      imageframe.length !== 0 &&
      project?.annotation_type === "bounding_box" &&
      scale < 1.5
    ) {
      setScale((prev: any) => prev + 0.1);
    } else if (
      project?.annotation_type === "classification" &&
      imgRef.current !== null &&
      scale < 1.5
    ) {
      imgHeight = imgRef.current.clientHeight;
      imgWidth = imgRef.current.clientWidth;
      setScale((prev: any) => prev + 0.2);
    }
    if (project?.annotation_type === "bounding_box" && scale > 1.5) {
      return;
    }
    if (project?.annotation_type === "classification" && scale > 1.5) {
      return;
    }

    // Increase dimension(Zooming)
    if (project?.annotation_type === "classification") {
      setImageDimension({
        imgHeight: imgHeight + NumberLimit.FIVE_HUNDRED,
        imgWidth: imgWidth + NumberLimit.FIVE_HUNDRED,
      });
    }
  };

  // Event handler callback zoom out
  const handleZoomOut = () => {
    setIsZoom(true);
    setFullImg(false);
    let imgHeight = 0;
    let imgWidth = 0;
    let imageframe = document.getElementsByClassName("image_frame");
    // Fetching current height and width
    if (
      imageframe.length !== 0 &&
      project?.annotation_type === "bounding_box" &&
      scale > restrictZoomout
    ) {
      setScale((prev: any) => prev - 0.1);
    } else if (
      imgRef.current !== null &&
      project?.annotation_type === "classification" &&
      scale >= 1
    ) {
      imgHeight = imgRef.current.clientHeight;
      imgWidth = imgRef.current.clientWidth;
      setScale((prev: any) => prev - 0.2);
    }
    if (
      scale < restrictZoomout &&
      project?.annotation_type === "bounding_box"
    ) {
      setIsZoom(false);
      setFullImg(true);
      // setScale(NumberLimit.ONE)
      // setZoomLevel(NumberLimit.ONE_HUNDRED)
      return;
    } else if (project?.annotation_type === "classification" && scale <= 1) {
      setZoomLevel(NumberLimit.ONE_HUNDRED);
      setScale(NumberLimit.ONE);
      setIsZoom(false);
      setFullImg(true);
      return;
    }
    if (project?.annotation_type === "classification") {
      setImageDimension({
        imgHeight: imgHeight - NumberLimit.FIVE_HUNDRED,
        imgWidth: imgWidth - NumberLimit.FIVE_HUNDRED,
      });
    }
  };

  // function  to delete the image by making redux call
  const deleteImage = async () => {
    setDeleteImg(true);
    setIsLoader(true);
    const payloadData = {
      data: {
        content_ids: [currentImage && currentImage.id],
        project_id: id,
      },
    };
    await dispatch(deleteContent(payloadData));
    getStatisticsData();
    setCurrentIndex((current) =>
      current !== 0 ? current - 1 : images?.length - 2
    );
    setCurrentImage((image: any) =>
      currentIndex !== 0
        ? images && images[currentIndex - 1]
        : images && images[images?.length - 1]
    );
  };

  // common function to make statistics data count to get the tag count used
  const getStatisticsData = () => {
    if (id && dataSetId) {
      dispatch(
        getAnnotateStatistics({
          project_id: id,
          dataset_id: dataSetId,
          options: "annotations_per_class",
        })
      );
    }
  };

  // function to make redux call to change the cover photo
  const makeCoverPhoto = async () => {
    const formData = new FormData();
    const res: Response = await fetch(
      `data:image/png;base64,${currentImage && currentImage.b64_image}`
    );
    const blob: Blob = await res.blob();
    const result = new File([blob], currentImage.name, { type: "jpeg/png" });
    formData.append("file", result);
    const payload = {
      data: formData,
      id,
    };
    dispatch(changeCoverPhoto(payload));
  };

  // function called to create new tag
  const createAnnotateTag = async (value: string, entries?: any) => {
    const payload = {
      dataset_id: dataSetId,
      name: value,
      project_id: id,
    };
    await dispatch(createTag(payload))
      .then((res) => {
        setCurrentTagId(res.payload.id);
        if (
          (entries && project?.annotation_type === "bounding_box") ||
          project?.annotation_type !== "bounding_box"
        ) {
          addToTagList(res.payload.id);
        }
        searchTagQuery("");
        entries && getDimensions(entries, res.payload.id);
      })
      .catch(() => {
        if (entries) {
          setBoundingData((prevState) => {
            const data = [...prevState];
            data.splice(entries.length - 1);
            return data;
          });
          const elem = document.getElementsByClassName(
            "annotated_bounding_box"
          );
          elem[elem.length - 1].className += " d-none";
        }
        searchTagQuery("");
      });
  };

  // function to get the data of existing associated tags with an image
  const existingAssociatedTags = async () => {
    setTagIds([]);
    !isFinishAnnotation && setBoundingData([]);
    const payload = {
      limit: NumberLimit.TEN,
      page: NumberLimit.ZERO,
      operator: "and",
      filters: [
        {
          key: DATASET_ID,
          value: dataSetId,
        },
        {
          key: CONTENT_ID,
          value: currentImage && currentImage.id,
        },
      ],
    };
    await dispatch(getAnnotateTagsData(payload)).then((res) => {
      const data: Array<any> = [];
      const resData = res.payload.annotations;
      if (resData === null) {
        setOriginalTagIds([]);
        setOrigBoundingData([]);
      }
      if (resData && resData.length > 0 && data.length === 0) {
        data.push(...resData[0].tagids);
        setOriginalTagIds(resData[0].tagids);
        resData[0].metadata &&
          resData[0].metadata.bounding_boxes &&
          setBoundingData(resData[0].metadata.bounding_boxes);
        resData[0].metadata &&
          resData[0].metadata &&
          setOrigBoundingData(
            resData[0].metadata.bounding_boxes
              ? resData[0].metadata.bounding_boxes
              : []
          );
        setTagIds(data);
      }
    });
    getStatisticsData();
  };

  // function to make redux call when we search for a tag in existing list
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
          value: dataSetId,
        },
      ],
    };
    await dispatch(getTagsQuery(payload));
  };

  const addToTagList = (key: string) => {
    setTagIds((prevState) => {
      const data = [...prevState];
      !data.includes(key) && data.push(key);
      return data;
    });
  };

  const removeFromTagList = (key: string | number) => {
    if (project?.annotation_type === "bounding_box") {
      setBoundingData((prevState) => {
        const data = [...prevState];
        key !== undefined && typeof key === "number" && data.splice(key, 1);
        const filteredArr = data.reduce((acc: any, current: any) => {
          const x = acc.find((item: any) => item.tagid === current.tagid);
          if (!x) {
            return acc.concat([current]);
          } else {
            return acc;
          }
        }, []);
        const resultedArr = filteredArr.map((ele: any) => ele.tagid);
        setTagIds(resultedArr);
        return data;
      });
    } else {
      setTagIds((prevState) => {
        const data = [...prevState];
        if (typeof key === "string") {
          const index = data.indexOf(key);
          data.splice(index, 1);
        } else if (typeof key === "number") {
          data.splice(key, 1);
        }
        return data;
      });
    }
  };

  const updateTagId = (updatedTagId: string) => {
    const data = [...tagIds];
    const index = data.indexOf(updatedTagId);
    if (index > -1) {
      data.splice(index, 1);
    }
    const deletedTag = boundingData.filter(
      (ele: any) => ele.tagid !== updatedTagId
    );
    setBoundingData(deletedTag);
    setTagIds(data);
    annotator.clear_all();
    const resultedData: Array<object> = [];
    deletedTag?.map((ele: any) => {
      let tagname = "";
      annotateTag.queryTags?.map((item: any) => {
        if (ele.tagid && item.id === ele.tagid) {
          tagname = item.name;
        }
      });
      resultedData.push({
        left: ele.xmin,
        top: ele.ymin,
        width: ele.xmax - ele.xmin,
        height: ele.ymax - ele.ymin,
        label: tagname,
      });
    });
    annotator && resultedData.map((ele: object) => annotator.add_entry(ele));
  };

  const resetAnnotator = () => {
    annotator.clear_all();
    setTagIds([]);
    setBoundingData([]);
  };

  //dragElement Function is for drag functionality for bounding-box
  const dragElement = (element: any, dragzone: any) => {
    let pos1 = 0,
      pos2 = 0,
      pos3 = 0,
      pos4 = 0;
    //MouseUp occurs when the user releases the mouse button
    const dragMouseUp = () => {
      document.onmouseup = null;
      //onmousemove attribute fires when the pointer is moving while it is over an element.
      document.onmousemove = null;
    };

    const dragMouseMove = (event: any) => {
      event.preventDefault();

      //clientX property returns the horizontal coordinate of the mouse pointer
      pos1 = pos3 - event.clientX;
      //clientY property returns the vertical coordinate of the mouse pointer
      pos2 = pos4 - event.clientY;
      pos3 = event.clientX;
      pos4 = event.clientY;
      //offsetTop property returns the top position relative to the parent

      element.style.top = `${element.offsetTop - pos2}px`;
      element.style.left = `${element.offsetLeft - pos1}px`;
    };

    const dragMouseDown = (event: any) => {
      event.preventDefault();
      annotator.hit_menuitem = true;

      pos3 = event.clientX;
      pos4 = event.clientY;

      document.onmouseup = dragMouseUp;
      document.onmousemove = dragMouseMove;
    };
    setEventListners((prev: any) => {
      return {
        ...prev,
        mouseDown: dragMouseDown,
        mouseUp: dragMouseUp,
        mouseMove: dragMouseMove,
      };
    });
    dragzone?.addEventListener("mousedown", dragMouseDown, true);
  };

  // this useEffect is to initialize drag functionality
  useEffect(() => {
    let dragable = document.getElementById("frame");
    let dragzone = document.getElementById("bbox_annotator");
    if (draggable) {
      dragElement(dragable, dragzone);
      annotator && annotator.annotator_element.css({ overflow: "hidden" });
    } else {
      dragzone?.removeEventListener("mousedown", eventlistners.mouseDown, true);
    }
  }, [draggable]);

  // setting draggable state to true hence useEffcet will run
  const setIsDraggable = async (status: boolean) => {
    setDraggable(status);
  };

  const resetImg = () => {
    if (project?.annotation_type === "bounding_box" && !draggable) {
      // this return statement is for boundin-box only
      return (
        <div className="bounding-img-box" id="demo">
          <div
            id="bbox_annotator"
            style={{ display: "inline-block" }}
            ref={imgRef}
          />
        </div>
      );
    } else {
      if (!draggable) {
        // this return statement is for classification only
        return (
          <div className="classification-img-box">
            <img
              className={`${fullImg && "full-img"}`}
              ref={imgRef}
              src={`data:image/jpeg;charset=utf-8;base64,${imgToDisplay}`}
              width={width}
              height={height}
            />
          </div>
        );
      } else {
        // before we were using react-draggable component replaced the plugin with this eturn statement so that we can drag and draw boxes
        return (
          <div className="bounding-img-box">
            <div
              id="bbox_annotator"
              style={{ display: "inline-block" }}
              ref={imgRef}
            />
          </div>
        );
      }
    }
  };

  // function to close the reset modal
  const closeResetModal = () => {
    setResetOption(false);
    setIsLoader(false);
  };

  const skipAnnotate = () => {
    setTagIds(originalTagIds);
    setIsLoader(true);
    if (currentIndex !== images.length - 1) {
      nextClick && setCurrentIndex((current) => current + 1);
    } else if (currentIndex === images.length - 1 && nextClick) {
      // applies for last image and skip on next
      setIsLoader(false);
      setBoundingData([]);
    }
    backClick && setCurrentIndex((current) => current - 1);
  };

  const closeImgConfirmModal = () => {
    setShowTagSubmitModal(false);
    setBackClick(false);
    setNextClick(false);
  };

  const draggablePointerStyle = draggable
    ? `
  #bbox_annotator{
    cursor: pointer!important;
  }
  `
    : "";

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: draggablePointerStyle }} />
      <NavBar project={project}>
        <div className="annotation-container">
          <div className="right-item">
            <div className="annotion-right-container">
              <div className="large-img-box">
                <div className="large-img-inner">
                  <div
                    className={`img-box ${!fullImg && "bounding-zoom"}`}
                    ref={boxRef}
                  >
                    {/* add plugin here */}
                    {isLoader && (
                      <div className="loader-inline">
                        <div className="loader-inner"></div>
                      </div>
                    )}
                    {!isLoader && resetImg()}
                  </div>
                  {project?.annotation_type === "bounding_box" && (
                    <div className="annotations-icons-box">
                      <ul>
                        <li
                          className={`${!draggable && "active"}`}
                          onClick={() => setIsDraggable(false)}
                        >
                          <span className="icon annotation-icon"></span>
                        </li>
                        <li
                          className={`${draggable && "active"}`}
                          onClick={() => setIsDraggable(true)}
                        >
                          <span className="icon hand-icon"></span>
                        </li>

                        <>
                          <li>
                            <span
                              className="icon rotate-icon"
                              onClick={() => resetAnnotator()}
                            ></span>
                          </li>
                        </>
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
            {/* annotion-right-container */}
          </div>
          <div className="left-item">
            <Tab.Container defaultActiveKey="#link2">
              <Tab.Content>
                <Tab.Pane eventKey="#link2">
                  <div className="annotion-left-container">
                    <AnnotateTags
                      createTag={createAnnotateTag}
                      searchTag={searchTagQuery}
                      queryTags={annotateTag.queryTags}
                      tagId={addToTagList}
                      removeTag={removeFromTagList}
                      tagData={tagIds}
                      deleteTagId={updateTagId}
                      boundingData={boundingData}
                    />
                  </div>
                  <div className="image-wrapper">
                    <div className="img-row">
                      <div className="img-box">
                        <img src={DRAG_IMGES} alt="images" />
                      </div>
                      <div className="img-content">
                        {currentImage && currentImage.name}
                        <span>
                          {`${currentImage && currentImage.height}x${
                            currentImage && currentImage.width
                          }`}{" "}
                          | {imgResolution}MP
                        </span>
                      </div>
                    </div>
                    <div className="img-row">
                      <div className="img-box">
                        <img src={CALENDAR_ICON} alt="images" />
                      </div>
                      <div className="img-content">
                        Updated{" "}
                        {moment(currentImage && currentImage.updated_at).format(
                          "MMM DD, YYYY"
                        )}
                        <span>
                          {moment(
                            currentImage && currentImage.updated_at
                          ).format("hh:mm a")}
                        </span>
                      </div>
                    </div>
                  </div>
                </Tab.Pane>
              </Tab.Content>
            </Tab.Container>
          </div>
        </div>
        <div className="right-footer">
          <div className="footer-left-item">
            <div className="zoom-box">
              <button
                type="button"
                className="btn"
                disabled={width <= currentImage && currentImage.width}
                onClick={() => handleZoomOut()}
              >
                <img src={MINUS_GREY} alt="image" />
              </button>
              <span>{zoomLevel}%</span>
              <button
                type="button"
                className="btn"
                onClick={() => handleZoomIn()}
              >
                <img src={PLUS_GREY} alt="image" />
              </button>
            </div>
            <div className="page-count">{`${currentIndex + 1}/${
              images.length
            }`}</div>
          </div>
          <div className="footer-mid-item">
            <ListGroup as="ul" horizontal>
              <ListGroup.Item as="li" active={currentIndex !== 0}>
                <button
                  id="previous_btn"
                  type="button"
                  className="btn link-btn"
                  disabled={currentIndex === 0 || isLoader}
                  onClick={() => goToPrevSlide()}
                >
                  <i className="icon ri-arrow-left-line"></i> Back
                </button>
              </ListGroup.Item>
              <ListGroup.Item as="li">
                <button
                  id="submit_btn"
                  type="button"
                  className="btn primary-btn submit-btn"
                  onClick={() => submitAnnotate()}
                  disabled={isFinishAnnotation || isLoader}
                >
                  Submit
                </button>
              </ListGroup.Item>
              <ListGroup.Item
                as="li"
                active={currentIndex !== images.length - 1}
              >
                <button
                  id="next_btn"
                  type="button"
                  disabled={isLoader}
                  className="btn link-btn next-btn"
                  onClick={() => goToNextSlide()}
                >
                  Next
                  <i className="icon ri-arrow-right-line"></i>
                </button>
              </ListGroup.Item>
            </ListGroup>
          </div>
          <div className="footer-right-item">
            <button
              type="button"
              className="btn secondary-btn finish-btn"
              onClick={() => navigateOnFinishAnnotation()}
            >
              Finish Annotation
            </button>
            <div className="round-dropdwon">
              <Dropdown>
                <Dropdown.Toggle
                  className="card-dropdown"
                  variant="success"
                  id="dropdown-basic"
                >
                  <img src={DOT_ICON} alt="profile" />
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item
                    disabled={isLoader}
                    onClick={() => makeCoverPhoto()}
                  >
                    <img src={MAKE_ICON} alt="profile" /> Make Cover
                  </Dropdown.Item>
                  {images.length > 1 && (
                    <Dropdown.Item
                      disabled={isLoader}
                      onClick={() => deleteImage()}
                    >
                      <img src={DEL_ICON} alt="profile" /> Delete Image
                    </Dropdown.Item>
                  )}
                  {/* <Dropdown.Item href='#/action-2'>
                          <img src={RESET_ICON} alt='profile' /> Reset Add Image
                          Setting
                        </Dropdown.Item> */}
                </Dropdown.Menu>
              </Dropdown>
            </div>
          </div>
        </div>
        {/* annotation-container */}
      </NavBar>

      {resetOption && (
        <ResetImageSetting
          show={resetOption}
          closeModal={() => closeResetModal()}
          prevLocation={prevLocation}
          contentData={unAnnotateCount}
          projectId={id}
          finishAnnotationFunc={() => navigateOnFinishAnnotation()}
        />
      )}

      {showTagSubmitModal && (
        <AnnotateImgConfirmModal
          show={showTagSubmitModal}
          closeModal={() => closeImgConfirmModal()}
          skipAnnotate={() => skipAnnotate()}
          submitAnnotate={() => submitAnnotate()}
        />
      )}
    </>
  );
};
export default AnnotationImage;
