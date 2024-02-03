import React, { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import InfiniteScroll from "react-infinite-scroll-component";
import { NumberLimit } from "../../../constant/number";
import { useParams } from "react-router-dom";
import { getContentApi } from "../../../service/project";
import DisplayTagName from "./DisplayTagName";
import {
  deleteContent,
  deleteLabels,
  finishAnnotation,
} from "../annotate/redux/annotateImage";
import { AppDispatch } from "../../../store";
import { addImagesList, clearContent, getContent } from "./redux/content";
import ConfirmModal from "../modals/ConfirmModal";
import { getTagsList } from "../../../service/tags";
import AnnotateFilterModal from "../modals/AnnotateFilterModal";
import { DATASET_ID, NAME } from "../../../constant/static";
import { getTagsQuery } from "../annotate/redux/annotateTags";
import ConfirmDeleteImageModal from "../modals/ConfirmDeleteImageModal";
import { annotateImages } from "../../../service/annotate";
import { showToast } from "../common/redux/toast";

interface Props {
  isSortList?: boolean;
  setAnnotatedContent?: Function;
  isCreateView?: boolean;
  setIsAllImagesSelected?: Function;
  setSelectedImages?: Function;
  selectedImages?: any;
  setShowConfirmDialogForImage?: Function;
  setShowConfirmDialogForLabel?: Function;
  showConfirmDialogForImage?: boolean;
  hideViewAll?: Function;
  fetchDataForStats?: Function;
  showConfirmDialogForLabel?: boolean;
  isAllImagesSelected?: boolean;
  isOpen?: boolean;
  isLoading?: boolean;
  setIsLoading?: Function;
  filterModal?: boolean;
  setFilterModal?: any;
  filterTagId?: any;
  setFilterTagId?: any;
  setAnnotatedImageCount?: any;
  imagesList: any;
  setImages: any;
  filterEnable?: boolean;
  setFilterEnable?: any;
  callStats?: boolean;
}

const DatasetImageListing = ({
  isSortList,
  setAnnotatedContent = () => [],
  isCreateView,
  setIsAllImagesSelected = () => false,
  setSelectedImages = () => [],
  showConfirmDialogForImage = false,
  setShowConfirmDialogForLabel = () => false,
  hideViewAll = () => [],
  setShowConfirmDialogForImage = () => [],
  fetchDataForStats = () => [],
  selectedImages = [],
  showConfirmDialogForLabel = false,
  isAllImagesSelected = false,
  isLoading = false,
  setIsLoading = () => {},
  filterModal = false,
  setFilterModal = () => {},
  filterTagId,
  setFilterTagId,
  setAnnotatedImageCount,
  isOpen,
  imagesList,
  setImages,
  filterEnable,
  setFilterEnable,
  callStats = true,
}: Props) => {
  const [pageNo, setPage] = useState(NumberLimit.ZERO);
  const { id } = useParams();
  const dispatch: AppDispatch = useDispatch();
  const [tagListData, setTagList] = useState<any>([]);
  const [isImageLoading, setImageLoading] = useState(false);
  const [annotated, setAnnotateContent] = useState(Object);
  // const [imagesList, setImages] = useState<any>([]);
  const [imageLoading, setImageIsLoading] = useState<boolean>(true);
  const scrollRef = useRef<any>();
  const [strict, setStrict] = useState<boolean>(false);
  const [deleteProgress, setDeleteProgress] = useState<boolean>(false);
  // const [filterTagId, setFilterTagId] = useState<Array<string>>([]);

  useEffect(() => {
    if (
      imagesList?.length === NumberLimit.ZERO &&
      pageNo === NumberLimit.ZERO &&
      filterTagId === NumberLimit.ZERO
    ) {
      hideViewAll();
    }
  }, [selectedImages]);

  const { project, content, dataSet, annotateTag, statistics } = useSelector(
    (state: any) => {
      return state;
    }
  );

  const setFilterImages = (tagData: any) => {
    setIsLoading(true);
    strict ? setFilterEnable(true) : setFilterEnable(false);
    setSelectedImages([]);
    setIsAllImagesSelected(false);
    setFilterTagId(tagData);
    const tagIdData = tagData.reduce((finalStr: any, currVal: any) => {
      return (finalStr = `${finalStr}&tag_id=${currVal}`);
    }, "");
    const operator = strict ? "and" : "or";
    dispatch(
      getContent({
        limit: NumberLimit.FIFTY,
        page: 0,
        project_id: project?.id,
        dataset_id: dataSet.id,
        tag_id: tagIdData,
        operator,
      })
    )
      .then((res) => {
        setPage(NumberLimit.ZERO);
        if (res.payload.content) {
          setAnnotatedImageCount(res.payload?.count.toString());
          setAnnotateContent(res.payload);
          setImages(res.payload.content);
          strict ? setStrict(true) : setStrict(false);
          scrollRef.current.scrollTo(0, 0);
        } else {
          setImages([]);
        }
        setIsLoading(false);
      })
      .catch((err) => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    if (!strict) {
      setImages(content.imagesList);
    } else {
      setImages(() => {
        const data = content.imagesList.filter((image: any) => {
          if (image.annotation[0].tagids.length === filterTagId.length) {
            const tags = image.annotation[0].tagids.every((ele: any) =>
              filterTagId.includes(ele)
            );
            return tags;
          }
        });
        return data;
      });
    }
  }, [content]);

  const deleteImage = async () => {
    const payloadData = {
      data: {
        content_ids: selectedImages,
        project_id: project?.id,
      },
    };
    if (selectedImages.length > 0) {
      await dispatch(deleteContent(payloadData)).then(async () => {
        setIsLoading(true);
        fetchUpdatedImageData({ page: 0 });
        setPage(NumberLimit.ZERO);
        setFilterEnable(false);
        setStrict(false);
      });
    }
  };

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

  const fetchUpdatedImageData = async (pagenumber?: any) => {
    const projectId = id || project?.id;
    const dataSetId = dataSet?.id || "";
    const contentData = await getContentApi(
      NumberLimit.FIFTY,
      pagenumber ? pagenumber.page : pageNo,
      projectId,
      dataSetId
    );
    setIsAllImagesSelected(false);
    setSelectedImages([]);
    if (contentData?.data) {
      const filteredImagesList: any = imagesList.filter((el: any) => {
        return !selectedImages.includes(el.id);
      });
      setAnnotateContent(contentData.data);
      setImages(contentData.data.content);
      callStats && fetchDataForStats();
      dispatch(addImagesList(contentData.data.content));
      // setImages(filteredImagesList);
      // dispatch(addImagesList(filteredImagesList));
      contentData.data.content = filteredImagesList;
      //setAnnotatedContent(contentData?.data);
      setAnnotatedImageCount(contentData.data.count);
      setAnnotatedContent(contentData.data);
      setFilterTagId([]);
      setIsLoading(false);
    }
  };

  const deletebatchLabel = (data: any, annotate: any) => {
    return new Promise(async (resolve: any, reject: any) => {
      if (data.tagids.length === 0) {
        const payloadData = {
          data: {
            ids: [annotate.annotation[0].id],
          },
        };
        // if (payloadData.data.ids.length > 0) {
        await dispatch(deleteLabels(payloadData));
        resolve();
        //}
      } else {
        resolve();
      }
    });
  };

  const batchProcessing = (
    annotate: any,
    index: number,
    selectedTags: any = [],
    filteredImages: any = []
  ) => {
    return new Promise(async (resolve: any, reject) => {
      try {
        const metadata =
          annotate.annotation[0]?.metadata?.bounding_boxes?.filter(
            (ele: any) => {
              const tag = selectedTags.find(
                (tag: any) => tag.tagId === ele.tagid
              );
              return !tag;
            }
          );
        const tagIds = annotate.annotation[0]?.tagids?.filter((ele: any) => {
          const tag = selectedTags.find((tag: any) => tag.tagId === ele);
          return !tag;
        });
        const payload = {
          content_id: annotate.annotation[0].contentid,
          dataset_id: annotate.annotation[0].datasetid,
          metadata: {
            bounding_boxes: metadata,
          },
          project_id: annotate.annotation[0].projectid,
          tag_id: tagIds,
        };
        const { data } = await annotateImages(payload);

        await deletebatchLabel(data, annotate);
        resolve();
      } catch (error) {
        reject(error);
      }
    });
  };

  const deleteLabel = async (tags: any = []) => {
    const selectedTags = [...tags];
    const imageList = [...imagesList];
    const filteredImages = imageList.filter((ele: any) =>
      selectedImages.includes(ele.id)
    );
    // setPage(NumberLimit.ZERO)
    const promiseArray: any = [];
    let startPoint = 0;
    let endPoint = 5;
    const batches = Math.ceil(filteredImages.length / 5);
    setDeleteProgress(true);
    setPage(NumberLimit.ZERO);
    for (let i = batches; i >= 0; i--) {
      setIsLoading(true);
      const newBatch = filteredImages.slice(startPoint, endPoint);
      newBatch.forEach(async (annotate, index) => {
        promiseArray.push(
          batchProcessing(annotate, index, selectedTags, filteredImages)
        );
      });
      await Promise.allSettled(promiseArray);
      startPoint += 5;
      endPoint += 5;
      if (i === 0) {
        dispatch(
          showToast({ message: "Label deleted successfully", type: "success" })
        );
        setFilterEnable(false);
        setStrict(false);
        fetchUpdatedImageData({ page: 0 });

        //setIsLoading(false)
      }
    }
    setDeleteProgress(false);
  };

  const setImageData = (content: { content: Array<Object>; count: number }) => {
    const contentData = content?.content;
    const updatedData = contentData?.map((ele: any) => ({
      ...ele,
      checked: ele.checked || false,
    }));
    setAnnotateContent(content);
    if (updatedData && setAnnotatedContent) {
      setAnnotatedContent(content);
    }
    if (updatedData && updatedData?.length) {
      if (!imagesList?.length) {
        setImages(updatedData);
        dispatch(addImagesList(updatedData));
      } else {
        const mergedArray = [...imagesList, ...updatedData];
        const ids = mergedArray.map((o) => o.id);
        const filtered = mergedArray.filter(
          ({ id }, index) => !ids.includes(id, index + 1)
        );
        if (!strict) {
          setImages(filtered);
        } else {
          setImages(() => {
            const data = filtered.filter((image: any) => {
              if (image.annotation[0].tagids.length === filterTagId.length) {
                const tags = image.annotation[0].tagids.every((ele: any) =>
                  filterTagId.includes(ele)
                );
                return tags;
              }
            });
            return data;
          });
        }
        dispatch(addImagesList(filtered));
      }
    }
  };

  const closeDeleteImageModal = () => {
    setShowConfirmDialogForImage(false);
  };

  const closeDeleteLabelModal = () => {
    setShowConfirmDialogForLabel(false);
  };

  const fetchDatasetImages = async () => {
    const projectId = id || project?.id;
    const dataSetId = dataSet?.id || "";
    if (
      dataSetId &&
      projectId &&
      (imagesList?.length === NumberLimit.ZERO ||
        imagesList?.length < annotated?.count) &&
      !isImageLoading
    ) {
      setImageLoading(true);
      pageNo === 0 && !deleteProgress && setIsLoading(true);
      setTagList((prev: any) => [...prev]);
      setImageIsLoading(true);
      const tagIdData = filterTagId?.reduce((finalStr: any, currVal: any) => {
        return (finalStr = `${finalStr}&tag_id=${currVal}`);
      }, "");
      let operator = strict ? "and" : "or";
      const contentData = await getContentApi(
        NumberLimit.FIFTY,
        pageNo,
        projectId,
        dataSetId,
        tagIdData,
        operator
      );
      const { data } = await getTagsList(project.id, dataSet.id);
      contentData?.data && setImageData(contentData?.data);
      setTagList((prev: any) => {
        let flattered = [...prev, data?.tags].flat(Infinity);
        return flattered;
      });
      setImageLoading(false);
      pageNo === 0 && !deleteProgress && setIsLoading(false);
      setImageIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDatasetImages();
  }, [dataSet, project.id, pageNo, id]);

  const renderSortImages = () => {
    const countLimit = isCreateView ? NumberLimit.ELEVEN : NumberLimit.TEN;
    return imagesList
      ?.slice(NumberLimit.ZERO, countLimit)
      ?.map((ele: any, ind: number) => {
        const imageAnnotation = ele?.annotation[0].b64_image;
        return (
          <div className="img-box" key={`sort-list-${ele?.id}-${ind}`}>
            <img
              src={`data:image/png;base64,${
                imageAnnotation !== "" ? imageAnnotation : ele?.b64_image
              }`}
              alt=""
            />
          </div>
        );
      });
  };

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

  useEffect(() => {
    if (isAllImagesSelected && selectedImages.length === imagesList.length) {
      updatedImages();
    }
  }, [isAllImagesSelected]);

  // function to handle the selection and deselection of images
  const updatedImages = (id: string = "") => {
    let _selectedImages = [...selectedImages];

    if (id) {
      const imageExisted = selectedImages.includes(id);
      if (imageExisted) {
        _selectedImages = selectedImages.filter(
          (imageId: string) => imageId !== id
        );
      } else {
        _selectedImages.push(id);
      }
    }

    setSelectedImages(_selectedImages);
    if (_selectedImages.length === imagesList?.length) {
      setIsAllImagesSelected(true);
    } else {
      setIsAllImagesSelected(false);
    }
  };

  const renderMoreImages = () => {
    return imagesList?.map((eled: any, index: number) => {
      const imageAnnotation = eled?.annotation[0].b64_image;
      return (
        <div
          className="img-wrapper with-tag"
          key={`more-list-${eled?.id}-${index}`}
        >
          <div className="img-box">
            <label>
              <input
                type="checkbox"
                onChange={() => {}}
                checked={selectedImages.includes(eled.id)}
              />
              <span className="checkbox">
                <img
                  src={`data:image/png;base64,${
                    imageAnnotation !== "" ? imageAnnotation : eled?.b64_image
                  }`}
                  alt="gallery images"
                  onClick={() => updatedImages(eled?.id)}
                />
              </span>
            </label>
          </div>
          <div className="tag-box">
            {eled?.annotation?.length &&
            eled?.annotation[NumberLimit.ZERO]?.tagids?.length >
              NumberLimit.ZERO ? (
              <>
                {!!(
                  eled?.annotation?.length &&
                  eled?.annotation[NumberLimit.ZERO]?.tagids?.length
                ) && (
                  <div className="tag grey">
                    {getTagsName(eled?.annotation[NumberLimit.ZERO].tagids)}
                  </div>
                )}
                {!!(
                  eled?.annotation?.length &&
                  eled?.annotation[NumberLimit.ZERO]?.tagids?.length >
                    NumberLimit.ONE
                ) && (
                  <div className="tag grey count">
                    +
                    {eled?.annotation[NumberLimit.ZERO]?.tagids?.length -
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

  return (
    <>
      {imageLoading && !isOpen ? (
        <>
          <div className="image-loader">Loading...</div>
        </>
      ) : isSortList && !imageLoading ? (
        <div className="dataset-gallery">{renderSortImages()}</div>
      ) : (
        <div className="annotation-gallery">
          <div className="img-container" id="scrollableDiv" ref={scrollRef}>
            {imagesList.length ? (
              <InfiniteScroll
                dataLength={imagesList?.length}
                next={() => setPage(pageNo + NumberLimit.ONE)}
                className="inner-content"
                hasMore={imagesList?.length !== annotated?.count}
                loader={
                  imageLoading && (
                    <div className="loader-inline">
                      <div className="loader-inner"></div>
                    </div>
                  )
                }
                scrollableTarget="scrollableDiv"
              >
                {renderMoreImages()}
              </InfiniteScroll>
            ) : (
              <div className="total-txt no-data justify-display-center">
                No annotated image found!
              </div>
            )}
          </div>
        </div>
      )}
      <ConfirmDeleteImageModal
        show={showConfirmDialogForImage}
        closeModal={closeDeleteImageModal}
        callBack={deleteImage}
        selectedImages={selectedImages}
        imagesList={imagesList}
        tagListData={tagListData}
        headingText={"Delete Selected Image ?"}
        bodyText={
          "The selected Images will be deleted permanently from the project"
        }
      />
      <ConfirmModal
        show={showConfirmDialogForLabel}
        closeModal={closeDeleteLabelModal}
        callBack={deleteLabel}
        selectedImages={selectedImages}
        imagesList={imagesList}
        tagListData={tagListData}
        headingText={"Remove Class"}
        bodyText={
          "Select the classes you want to remove from the images you have selected."
        }
      />
      {filterModal && (
        <AnnotateFilterModal
          open={filterModal}
          closeModal={() => {
            setFilterModal(false);
            setStrict(false);
          }}
          queryTags={annotateTag.queryTags}
          selectedTagId={setFilterImages}
          existingTagId={filterTagId}
          searchTag={searchTagQuery}
          strictMode={true}
          strict={strict}
          setStrict={setStrict}
          filterEnable={filterEnable}
          setFilterEnable={setFilterEnable}
        />
      )}
    </>
  );
};
export default DatasetImageListing;
