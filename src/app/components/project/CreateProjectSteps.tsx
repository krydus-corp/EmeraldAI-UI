import React, { useEffect, useState } from "react";
import { ListGroup } from "react-bootstrap";
import { EDIT_ICON_BIG } from "../../../constant/image";
import NavBar from "../templates/NavBar";

import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  CREATE_PROJECT_STEP1,
  CREATE_PROJECT_STEP2,
  CREATE_PROJECT_STEP3,
  CREATE_PROJECT_STEP4,
  CREATE_PROJECT_UPLOAD_COMPLETE,
} from "../../../utils/routeConstants";
import { NumberLimit } from "../../../constant/number";
import { createBrowserHistory } from "history";
import { PROJECT_TYPE } from "../../../constant/static";

const CreateProjectSteps = ({ children }: any) => {
  const parm = new URLSearchParams(window.location.search);
  const projectStep = parm.get("step")
    ? Number(parm.get("step"))
    : NumberLimit.ONE;
  const [showPageHeader, setShowPageHeader] = useState(true);
  const navigate = useNavigate();
  const { annotate, project_id } = useParams();
  const [step, setStep] = useState<any>(projectStep);
  const [splitPromt, setSplitPromt] = useState(false);

  const history = createBrowserHistory();
  const location = history.location.pathname;
  const { project, dataSet, statistics } = useSelector((state: any) => state);
  const backActive = "back-active";

  useEffect(() => {
    if (annotate) {
      setStep(NumberLimit.TWO);
    }
  }, []);

  const navigateToAnnotation = () => {
    if (annotate) {
      navigate(`${CREATE_PROJECT_STEP2}/${project_id}/annotate`);
    } else {
      navigate(`${CREATE_PROJECT_STEP2}/${project_id}`);
    }
  };

  const handleModal = () => {
    if (
      statistics.total_annotated_images > 0 &&
      dataSet.split.validation === 0 &&
      dataSet.split.test === 0
    ) {
      return setSplitPromt(true);
    } else {
      navigate(`${CREATE_PROJECT_STEP4}/${project_id}`);
    }
  };

  const isUploadComplete = () => {
    return (
      location.includes(CREATE_PROJECT_STEP2) ||
      location.includes(CREATE_PROJECT_STEP3) ||
      location.includes(CREATE_PROJECT_STEP4)
    );
  };

  const isAnnotateComplete = () => {
    return (
      location.includes(CREATE_PROJECT_STEP3) ||
      location.includes(CREATE_PROJECT_STEP4)
    );
  };

  const isDatasetComplete = () => {
    return location.includes(CREATE_PROJECT_STEP4);
  };
  const getProjectType = (project: any, type: string) => project[type];

  return (
    <>
      <NavBar>
        <div className="create-project-container">
          <>
            <div className={`page-head ${!showPageHeader && "d-none"}`}>
              <div className="left-item">
                <h3>
                  {project && project.name}{" "}
                  <img className="d-none" src={EDIT_ICON_BIG} alt="edit icon" />
                </h3>
                <h5>
                  {project?.annotation_type &&
                    `Project Type : ${getProjectType(
                      PROJECT_TYPE,
                      project?.annotation_type
                    )}`}
                </h5>
              </div>
              <div className="right-item d-none">
                {(step === NumberLimit.THREE ||
                  location.includes(CREATE_PROJECT_STEP3)) && (
                  <button
                    type="button"
                    className="btn primary-btn gen-btn"
                    onClick={() => {
                      navigate(`${CREATE_PROJECT_STEP4}/${project_id}`);
                    }}
                  >
                    Generate New Model
                  </button>
                )}
              </div>
            </div>

            <div className={`step-bar-wrapper ${!showPageHeader && "d-none"}`}>
              <ListGroup horizontal>
                <ListGroup.Item
                  active={
                    location.includes(CREATE_PROJECT_STEP1) ||
                    location.includes(CREATE_PROJECT_UPLOAD_COMPLETE)
                  }
                  onClick={() => {
                    navigate(`${CREATE_PROJECT_STEP1}/${project_id}`);
                  }}
                  className={`${isUploadComplete() && backActive}`}
                >
                  <span className={`data`}>
                    <span className="upload-icon"></span> Upload
                  </span>
                </ListGroup.Item>
                <ListGroup.Item>
                  <span className="bar"></span>
                </ListGroup.Item>
                <ListGroup.Item
                  active={location.includes(CREATE_PROJECT_STEP2)}
                  className={`${isAnnotateComplete() && backActive}`}
                >
                  <span
                    className={`data`}
                    onClick={() => navigateToAnnotation()}
                  >
                    <span className="annotation-icon"></span> Annotation
                  </span>
                </ListGroup.Item>
                <ListGroup.Item>
                  <span className="bar"></span>
                </ListGroup.Item>
                <ListGroup.Item
                  active={location.includes(CREATE_PROJECT_STEP3)}
                  className={`${isDatasetComplete() && backActive}`}
                >
                  <span
                    className={`data`}
                    onClick={() => {
                      navigate(`${CREATE_PROJECT_STEP3}/${project_id}`);
                    }}
                  >
                    <span className="dataset-icon"></span> Dataset
                  </span>
                </ListGroup.Item>
                <ListGroup.Item>
                  <span className="bar"></span>
                </ListGroup.Item>
                <ListGroup.Item
                  active={location.includes(CREATE_PROJECT_STEP4)}
                >
                  <span
                    className="data"
                    onClick={() => {
                      navigate(`${CREATE_PROJECT_STEP4}/${project_id}`);
                    }}
                  >
                    <span className="model-icon"></span> Models
                  </span>
                </ListGroup.Item>
              </ListGroup>
            </div>
            {/* step-bar-wrapper */}
            {children}
          </>
        </div>
      </NavBar>
    </>
  );
};
export default CreateProjectSteps;
