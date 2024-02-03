import { createBrowserHistory } from "history";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { AppDispatch } from "../../../../store";
import { CREATE_PROJECT, PROJECT_LIST } from "../../../../utils/routeConstants";
import CreateProjectSteps from "../CreateProjectSteps";
import ProjectOverview from "../ProjectOverview";
import { getProjectRequest } from "../redux/project";
import { uploadProjectStatus } from "../redux/upload";

const Layout = ({ children }: any) => {
  const history = createBrowserHistory();
  const location = history.location;

  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();
  const { project_id, upload_id } = useParams();

  useEffect(() => {
    async function getProjectLayout() {
      project_id && (await dispatch(getProjectRequest({ id: project_id })));
      const id = localStorage.getItem("upload");
      upload_id && (await dispatch(uploadProjectStatus(id)));
    }
    getProjectLayout();
  }, []);

  useEffect(() => {
    if (!project_id) {
      navigate(PROJECT_LIST);
    }
  }, [project_id]);

  return (
    <>
      {location &&
        location.pathname &&
        location.pathname.includes(CREATE_PROJECT) && (
          <CreateProjectSteps>{children}</CreateProjectSteps>
        )}
      {location &&
        location.pathname &&
        !location.pathname.includes(CREATE_PROJECT) && (
          <ProjectOverview>{children}</ProjectOverview>
        )}
    </>
  );
};

export default Layout;
