import { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { FILTER_ICON } from "../../../constant/image";
import { NumberLimit } from "../../../constant/number";
import { DATASET_ID, NAME } from "../../../constant/static";
import { getTagsQuery } from "../annotate/redux/annotateTags";
import AnnotateFilterModal from "../modals/AnnotateFilterModal";
import DatasetImageListing from "./DatasetImageListing";
import { getImagesList } from "./redux/content";
import { AppDispatch } from "../../../store";
import { showToast } from "../common/redux/toast";
interface Props {
  isOpen?: boolean;
  hideViewAll?: Function;
  setAnnotatedContent?: Function;
  fetchDataForStats?: Function;
  annotatedContent?: { count: string; content: any[] };
  isLoading?: any;
  setIsLoading?: any;
  callStats?: boolean;
}

const ViewAllDatasetimages = ({
  isOpen,
  hideViewAll,
  fetchDataForStats,
  setAnnotatedContent,
  annotatedContent,
  isLoading,
  setIsLoading,
  callStats = true,
}: Props) => {
  const [isAllImagesSelected, setIsAllImagesSelected] =
    useState<boolean>(false);
  const [selectedImages, setSelectedImages] = useState<any>([]);
  //const imagesList = useSelector(getImagesList);
  const [imagesList, setImages] = useState<any>([]);
  const [showConfirmDialogForImage, setShowConfirmDialogForImage] =
    useState<boolean>(false);
  const [showConfirmDialogForLabel, setShowConfirmDialogForLabel] =
    useState<boolean>(false);
  const { statistics, dataSet, annotateTag } = useSelector(
    (state: any) => state
  );
  const dispatch: AppDispatch = useDispatch();
  const [filterModal, setFilterModal] = useState<boolean>(false);
  const [filterTagId, setFilterTagId] = useState<Array<string>>([]);
  const [annotatedImageCount, setAnnotatedImageCount] = useState<any>(
    annotatedContent?.count
  );
  const [filterEnable, setFilterEnable] = useState<boolean>(false);

  const handleCheckBox = (e: any) => {
    if (e.target.checked) {
      setSelectedImages(
        imagesList.length > NumberLimit.ZERO
          ? imagesList?.map((ele: any) => ele.id)
          : annotatedContent?.content.map((ele: any) => ele.id)
      );
      setIsAllImagesSelected(true);
      dispatch(
        showToast({
          message: `${imagesList.length} images has been selected`,
          type: "success",
        })
      );
    } else {
      setSelectedImages([]);
      setIsAllImagesSelected(false);
    }
  };
  return (
    <>
      <div className={`full-view-dataset ${!isOpen && "d-none"}`}>
        <div className="dataset-step-3">
          <div className="img-data-wrapper">
            <div className="page-header img-data-header">
              <div className="left-item">
                <h3>
                  Manage Images{" "}
                  <span className="tag grey">
                    {annotatedImageCount?.toString() ||
                      statistics?.total_annotated_images}{" "}
                    Images
                  </span>
                  <div className="checkbox-panel">
                    <label>
                      <input
                        type="checkbox"
                        onClick={(e) => handleCheckBox(e)}
                        checked={isAllImagesSelected}
                        onChange={() => {}}
                      />
                      <span className="checkbox">Select All</span>
                    </label>
                  </div>
                </h3>
              </div>
              <div className="right-item">
                {/* <div className='filter-section-right' >
                  <button type='button' className='btn link-btn filter-btn'>
                  <span className='filter-dot'></span>
                    <img src={FILTER_ICON} alt='sort icon' /> Filter</button>
                </div> */}
                <Button
                  className="btn filters-btn filter-icon"
                  variant="link"
                  onClick={() => setFilterModal(true)}
                >
                  {(filterTagId.length !== 0 || filterEnable) && (
                    <span className="filter-dot"></span>
                  )}
                  <img
                    src={FILTER_ICON}
                    alt="sort icon"
                    style={{ marginRight: "14px" }}
                  />{" "}
                  Filter
                </Button>
                <Button
                  className="btn primary-btn delete-label"
                  variant="link"
                  onClick={() => setShowConfirmDialogForLabel(true)}
                  disabled={!selectedImages.length}
                >
                  Delete labels only
                </Button>
                <Button
                  className="delete-btn"
                  variant="link"
                  onClick={() => setShowConfirmDialogForImage(true)}
                  disabled={!selectedImages.length}
                >
                  Delete images with labels
                </Button>
                <Button
                  variant="secondary"
                  className="btn-close white-close-btn"
                  onClick={() => {
                    hideViewAll && hideViewAll();
                    setSelectedImages([]);
                    setIsAllImagesSelected(false);
                    fetchDataForStats && fetchDataForStats();
                  }}
                ></Button>
              </div>
            </div>
            <DatasetImageListing
              isOpen={isOpen}
              isSortList={false}
              setIsAllImagesSelected={setIsAllImagesSelected}
              isAllImagesSelected={isAllImagesSelected}
              setAnnotatedContent={setAnnotatedContent}
              selectedImages={selectedImages}
              setSelectedImages={setSelectedImages}
              setShowConfirmDialogForImage={setShowConfirmDialogForImage}
              setShowConfirmDialogForLabel={setShowConfirmDialogForLabel}
              showConfirmDialogForLabel={showConfirmDialogForLabel}
              showConfirmDialogForImage={showConfirmDialogForImage}
              hideViewAll={hideViewAll}
              fetchDataForStats={fetchDataForStats}
              filterModal={filterModal}
              setFilterModal={setFilterModal}
              filterTagId={filterTagId}
              setFilterTagId={setFilterTagId}
              setAnnotatedImageCount={setAnnotatedImageCount}
              isLoading={isLoading}
              setIsLoading={setIsLoading}
              imagesList={imagesList}
              setImages={setImages}
              filterEnable={filterEnable}
              setFilterEnable={setFilterEnable}
              callStats={callStats}
            />
          </div>
          {/* img-data-wrapper */}
        </div>
      </div>
    </>
  );
};
export default ViewAllDatasetimages;
