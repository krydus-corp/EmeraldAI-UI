import React, { useState, useEffect } from "react";
import { ListGroup, Dropdown } from "react-bootstrap";
import { DOT_ICON, DEL_ICON } from "../../../constant/image";
import { Scrollbars } from "react-custom-scrollbars-2";
import DeleteModal from "../modals/DeleteModal";
import { useSelector, useDispatch } from "react-redux";
import { NumberLimit } from "../../../constant/number";
import { deleteAnnotateTag } from "./redux/annotateTags";
import { AppDispatch } from "../../../store";
import { ChartBackgroundColor } from "../charts/CommonChart";

interface Provider {
  id: string;
  count: number;
}
interface IProps {
  createTag: (value: string) => void;
  searchTag: (value: string) => void;
  queryTags: Array<Object>;
  tagId: (value: string) => void;
  removeTag: (value: string) => void;
  tagData: Array<string>;
  deleteTagId: Function;
  boundingData: any;
}

const AnnotateTags = (props: IProps) => {
  const dispatch: AppDispatch = useDispatch();
  const [deleteClass, setDeleteClass] = useState("");
  const [tag, setTag] = useState<string>("");
  const [associatedTags, setAssociatedTags] = useState<any>([]);
  const [counterArray, setCounterArray] = useState<Array<Provider>>([]);
  const [boundingAssociatedTags, setBoundingAssociatedTags] = useState<any>([]);

  const { statistics, project } = useSelector((state: any) => state);

  useEffect(() => {
    const data: any = [];
    for (const bounding of props.boundingData) {
      const filteredData = props.boundingData.filter(
        (ele: any) => ele.tagid === bounding.tagid
      );
      const found = data.some((el: any) => el.id === bounding.tagid);
      !found &&
        data.push({
          id: bounding.tagid,
          count: filteredData.length,
        });
    }
    setCounterArray(data);
  }, [props.boundingData]);

  useEffect(() => {
    const data: Array<object> = [];
    props.queryTags?.map((ele: any) => {
      props.boundingData.filter((item: any) => {
        if (item.tagid === ele.id) {
          !data.includes(ele) && data.push(ele);
        }
      });
    });
    setBoundingAssociatedTags(data);
  }, [props.queryTags, props.boundingData]);

  useEffect(() => {
    setCounterArray(counterArray);
  }, [counterArray]);

  useEffect(() => {
    const data: Array<object> = [];
    props.queryTags?.map((ele: any) => {
      props.tagData.filter((item) => {
        if (item === ele.id) {
          data.push(ele);
        }
      });
    });
    setAssociatedTags(data);
  }, [props.tagData, props.queryTags]);

  const closeDeleteModal = () => {
    setDeleteClass("");
  };

  const handleCount = (tagId: string | number) =>
    (statistics &&
      statistics.annotations_per_class &&
      statistics.annotations_per_class[tagId] &&
      statistics.annotations_per_class[tagId].count) ||
    NumberLimit.ZERO;

  const findTag = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setTag(value);
    props.searchTag(value);
  };

  const createTag = (item: string) => {
    setTag("");
    props.createTag(item);
  };

  const clearTag = () => {
    setTag("");
    props.searchTag("");
  };

  const deleteTag = async (id: string) => {
    await dispatch(deleteAnnotateTag({ id }));
    props.searchTag("");
    props.deleteTagId(id);
  };

  const findTagCount = (item: any, element: any) => {
    return item.id === element.id;
  };

  let queryTagsCorrected: any = [];
  if (props.queryTags) {
    queryTagsCorrected = [...props.queryTags].reverse();
  }

  return (
    <>
      <div className="annotaion-box">
        <div className="input-box">
          <input
            type="text"
            className="form-control"
            value={tag}
            placeholder="Create new label"
            onChange={(e) => findTag(e)}
            onKeyPress={(event) => event.key === "Enter" && createTag(tag)}
          />
          {tag && <span className="close-icon" onClick={clearTag}></span>}
        </div>
        {/* <div className='btn-space'> */}
        <button
          type="button"
          className="btn primary-btn"
          disabled={tag === ""}
          onClick={() => createTag(tag)}
        >
          Save (↵)
        </button>
        {/* </div> */}
        <div className="footer-tag">
          {project?.annotation_type !== "bounding_box" && (
            <div id="classify_hotkey"></div>
          )}
          <Scrollbars
            className="custom-scrollbar"
            renderThumbVertical={() => <div className="thumb-horizontal" />}
          >
            <ListGroup>
              {props.queryTags &&
                props.queryTags.length &&
                queryTagsCorrected.map((ele: any, index: number) => (
                  <ListGroup.Item key={index}>
                    {project?.annotation_type !== "bounding_box" && (
                      <div
                        className="inline-tag hotKeyManualClick"
                        style={{ color: ChartBackgroundColor[index] }}
                        onClick={() => props.tagId(ele.id)}
                      >
                        <div
                          className="hotkey"
                          data-hotkey_trigger={index}
                          data-hotkey_value={ele.name}
                          data-hotkey_classification="true"
                          data-color={ChartBackgroundColor[index]}
                        >
                          {index}
                        </div>
                        <span className="tagName">{ele.name}</span>
                        <span className="tag-count">
                          &nbsp;({handleCount(ele.id)})
                        </span>
                      </div>
                    )}
                    {project?.annotation_type === "bounding_box" && (
                      <div
                        className="inline-tag hotKeyManualClick"
                        style={{ color: ChartBackgroundColor[index] }}
                      >
                        <div
                          className="hotkey"
                          data-hotkey_trigger={index}
                          data-hotkey_value={ele.name}
                          data-hotkey_classification="false"
                          data-color={ChartBackgroundColor[index]}
                        >
                          {index}
                        </div>
                        <span className="tagName">{ele.name}</span>
                        <span className="tag-count">
                          &nbsp;({handleCount(ele.id)})
                        </span>
                      </div>
                    )}
                    <div className="tag-dropdown">
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
                            onClick={() => {
                              setDeleteClass(ele.id);
                            }}
                          >
                            <img src={DEL_ICON} alt="profile" /> Delete
                          </Dropdown.Item>
                        </Dropdown.Menu>
                      </Dropdown>
                    </div>
                  </ListGroup.Item>
                ))}
            </ListGroup>
          </Scrollbars>
        </div>
      </div>
      <div className="annotation-tag-wrapper">
        <Scrollbars
          className="custom-scrollbar"
          renderThumbVertical={() => <div className="thumb-horizontal" />}
        >
          <div className="tag-box">
            {project?.annotation_type === "bounding_box" &&
              boundingAssociatedTags.map((ele: any) => (
                <div className="tag" key={ele.id}>
                  {ele.name} {"-"}{" "}
                  {counterArray.length > 0 &&
                    counterArray.find((item) => findTagCount(item, ele))?.count}
                </div>
              ))}
            {project?.annotation_type !== "bounding_box" &&
              associatedTags.map((ele: any) => (
                <div className="tag" key={ele.id}>
                  {ele.name}
                  <span
                    className="close"
                    onClick={() => props.removeTag(ele.id)}
                  ></span>
                </div>
              ))}
          </div>
        </Scrollbars>
      </div>
      {deleteClass && (
        <DeleteModal
          show={deleteClass}
          closeModal={closeDeleteModal}
          deleteTag={deleteTag}
        />
      )}
    </>
  );
};

export default AnnotateTags;
