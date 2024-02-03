import moment from "moment";
import React from "react";
import { ListGroup } from "react-bootstrap";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import NavBar from "../templates/NavBar";
import { createBrowserHistory } from "history";
import {
  PROJECT_OVERVIEW,
  PROJECT_OVERVIEW_STEP1,
  PROJECT_OVERVIEW_STEP2,
  PROJECT_OVERVIEW_STEP3,
  PROJECT_OVERVIEW_STEP4,
  PROJECT_OVERVIEW_UPLOAD_COMPLETE,
} from "../../../utils/routeConstants";
import { PROJECT_TYPE } from "../../../constant/static";
import { useDispatch } from "react-redux";
import { clearDataset } from "./redux/dataset";
import { clearContent } from "./redux/content";
const ProjectOverview = ({ children }: any) => {
  const { project } = useSelector((state: any) => state);
  const { annotate, project_id } = useParams();

  const history = createBrowserHistory();
  const location = history.location.pathname;

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const navigateToAnnotation = () => {
    localStorage.removeItem("upload");
    dispatch(clearDataset());
    if (annotate) {
      navigate(`${PROJECT_OVERVIEW_STEP2}/${project_id}/annotate`);
    } else {
      navigate(`${PROJECT_OVERVIEW_STEP2}/${project_id}`);
    }
  };
  const getProjectType = (project: any, type: string) => project[type];
  return (
    <>
      {project.loading && (
        <div className="loader">
          <div className="loader-inner"></div>
        </div>
      )}
      <NavBar>
        <div className="dashboard-full-container">
          <div className="dashboard-left-container">
            <ListGroup>
              <ListGroup.Item>
                <h3>{project && project.name}</h3>
                {project?.annotation_type && (
                  <p className="project-type">
                    Project Type :{" "}
                    {getProjectType(PROJECT_TYPE, project?.annotation_type)}
                  </p>
                )}
                <p>Last modified {moment(project.updated_at).fromNow()}</p>
              </ListGroup.Item>
              <ListGroup.Item
                active={location === `${PROJECT_OVERVIEW}/${project_id}`}
                onClick={() => {
                  localStorage.removeItem("upload");
                  navigate(`${PROJECT_OVERVIEW}/${project_id}`);
                }}
              >
                <span className="overview-icon"></span> Overview
              </ListGroup.Item>
              <ListGroup.Item
                active={
                  location.includes(PROJECT_OVERVIEW_STEP1) ||
                  location.includes(PROJECT_OVERVIEW_UPLOAD_COMPLETE)
                }
                onClick={() => {
                  localStorage.removeItem("upload");
                  navigate(`${PROJECT_OVERVIEW_STEP1}/${project_id}`);
                }}
              >
                <span className="upload-icon"></span> Upload
              </ListGroup.Item>
              <ListGroup.Item
                active={location.includes(PROJECT_OVERVIEW_STEP2)}
                onClick={() => navigateToAnnotation()}
              >
                <span className="annotation-icon"></span> Annotation
              </ListGroup.Item>
              <ListGroup.Item
                active={location.includes(PROJECT_OVERVIEW_STEP3)}
                onClick={() => {
                  localStorage.removeItem("upload");
                  dispatch(clearContent());
                  dispatch(clearDataset());
                  navigate(`${PROJECT_OVERVIEW_STEP3}/${project_id}`);
                }}
              >
                <span className="dataset-icon"></span> Dataset
              </ListGroup.Item>
              <ListGroup.Item
                active={location.includes(PROJECT_OVERVIEW_STEP4)}
                onClick={() => {
                  localStorage.removeItem("upload");
                  navigate(`${PROJECT_OVERVIEW_STEP4}/${project_id}`);
                }}
              >
                <span className="model-icon"></span> Models
              </ListGroup.Item>
              <ListGroup.Item
                active={location.includes("export")}
                onClick={() => {
                  localStorage.removeItem("upload");
                  navigate(`/project/${project_id}/export`);
                }}
              >
                <span className="export-icon"></span> Exports
              </ListGroup.Item>
            </ListGroup>
          </div>
          {/* dashboard-left-container */}
          <div className="dashboard-right-container project-detail-wrapper">
            {children}

            {/* steps */}
          </div>
          {/* dashboard-right-container */}
        </div>
      </NavBar>
      {/* edit project */}
    </>
  );
};
export default ProjectOverview;
