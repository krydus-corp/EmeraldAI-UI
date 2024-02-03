import React, { useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.scss";
import Login from "./app/components/login/Login";
import ForgotPassword from "./app/components/login/ForgotPassword";
import ForgotPasswordCode from "./app/components/login/ForgotPasswordCode";
import ResetPassword from "./app/components/login/RestPassword";
import CompleteProfile from "./app/components/login/CompleteProfile";
import ProjectList from "./app/components/project/ProjectList";
import CreateProjectSteps from "./app/components/project/CreateProjectSteps";
import ViewAllDatasetimages from "./app/components/project/ViewAllDatasetimages";

import {
  ANNOTATION_IMAGE,
  COMPLETE_PROFILE,
  CREATE_PROJECT,
  CREATE_PROJECT_STEP1,
  CREATE_PROJECT_STEP2,
  CREATE_PROJECT_STEP3,
  CREATE_PROJECT_STEP4,
  CREATE_PROJECT_UPLOAD_COMPLETE,
  FORGOT_PASSWORD,
  FORGOT_PASSWORD_CODE,
  LOGIN,
  MODAL_TRANINING_COMPARE,
  PROJECT_LIST,
  PROJECT_OVERVIEW,
  PROJECT_OVERVIEW_STEP1,
  PROJECT_OVERVIEW_STEP2,
  PROJECT_OVERVIEW_STEP3,
  PROJECT_OVERVIEW_STEP4,
  PROJECT_OVERVIEW_UPLOAD_COMPLETE,
  RESET_PASSWORD,
  TERM_CONDITION,
  PRIVACY_POLICY,
  VIEW_ALL_DATA_SET,
} from "./utils/routeConstants";
import PrivateRoute from "./routes/PrivateRoute";
import PublicRoutes from "./routes/PublicRoutes";
import TermCondition from "./app/components/templates/TermCondition";
import PrivacyPolicy from "./app/components/templates/PrivacyPolicy";
import AnnotationImage from "./app/components/annotate/annotationImage";
import ModalTrainingCompare from "./app/components/project/ModalTrainingCompare";
import Export from "./app/components/project/Export";
import Step1 from "./app/components/project/Step1";
import Step2 from "./app/components/project/Step2";
import Step3 from "./app/components/project/Step3";
import Step4 from "./app/components/project/Step4";
import UploadComplete from "./app/components/project/UploadComplete";
import Step0 from "./app/components/project/Step0";
import { AUTH_TOKEN } from "./constant/static";
import { NumberLimit } from "./constant/number";
import { useDispatch } from "react-redux";
import { AppDispatch } from "./store";
import { updateAuthToken } from "./app/components/login/redux/login";
import { configureAxios } from "./service";

function App() {
  const dispatch: AppDispatch = useDispatch();
  const updateToken = () => {
    const authToken = localStorage.getItem(AUTH_TOKEN);
    if (authToken) {
      dispatch(updateAuthToken());
      configureAxios();
    }
  };
  setInterval(() => {
    updateToken();
  }, NumberLimit.EXPIRE_LIMIT);

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route
            path={LOGIN}
            element={
              <PublicRoutes>
                <Login />
              </PublicRoutes>
            }
          />
          <Route path={FORGOT_PASSWORD} element={<ForgotPassword />} />
          <Route path={FORGOT_PASSWORD_CODE} element={<ForgotPasswordCode />} />
          <Route path={RESET_PASSWORD} element={<ResetPassword />} />
          <Route
            path={COMPLETE_PROFILE}
            element={
              <PrivateRoute>
                <CompleteProfile />
              </PrivateRoute>
            }
          />
          <Route
            path={PROJECT_LIST}
            element={
              <PrivateRoute>
                <ProjectList />
              </PrivateRoute>
            }
          />
          <Route
            path={`${PROJECT_OVERVIEW_STEP2}/:project_id/:annotate`}
            element={
              <PrivateRoute>
                <Step2 />
              </PrivateRoute>
            }
          />
          <Route
            path={`${PROJECT_OVERVIEW}/:project_id`}
            element={
              <PrivateRoute>
                <Step0 />
              </PrivateRoute>
            }
          />
          <Route
            path={`${PROJECT_OVERVIEW_STEP1}/:project_id`}
            element={
              <PrivateRoute>
                <Step1 />
              </PrivateRoute>
            }
          />
          <Route
            path={`${PROJECT_OVERVIEW_UPLOAD_COMPLETE}/:project_id/:upload_id`}
            element={
              <PrivateRoute>
                <UploadComplete />
              </PrivateRoute>
            }
          />
          <Route
            path={`${PROJECT_OVERVIEW_STEP2}/:project_id`}
            element={
              <PrivateRoute>
                <Step2 />
              </PrivateRoute>
            }
          />
          <Route
            path={`${PROJECT_OVERVIEW_STEP3}/:project_id`}
            element={
              <PrivateRoute>
                <Step3 />
              </PrivateRoute>
            }
          />
          <Route
            path={`${PROJECT_OVERVIEW_STEP4}/:project_id`}
            element={
              <PrivateRoute>
                <Step4 />
              </PrivateRoute>
            }
          />
          <Route
            path={`/project/:project_id/export`}
            element={
              <PrivateRoute>
                <Export />
              </PrivateRoute>
            }
          />
          <Route
            path={CREATE_PROJECT}
            element={
              <PrivateRoute>
                <CreateProjectSteps />
              </PrivateRoute>
            }
          />
          <Route
            path={`${CREATE_PROJECT_STEP2}/:project_id/:annotate`}
            element={
              <PrivateRoute>
                <Step2 />
              </PrivateRoute>
            }
          />

          <Route
            path={`${CREATE_PROJECT_STEP1}/:project_id`}
            element={
              <PrivateRoute>
                <Step1 />
              </PrivateRoute>
            }
          />
          <Route
            path={`${CREATE_PROJECT_UPLOAD_COMPLETE}/:project_id/:upload_id`}
            element={
              <PrivateRoute>
                <UploadComplete />
              </PrivateRoute>
            }
          />
          <Route
            path={`${CREATE_PROJECT_STEP2}/:project_id`}
            element={
              <PrivateRoute>
                <Step2 />
              </PrivateRoute>
            }
          />
          <Route
            path={`${CREATE_PROJECT_STEP3}/:project_id`}
            element={
              <PrivateRoute>
                <Step3 isCreateView={true} />
              </PrivateRoute>
            }
          />
          <Route
            path={`${CREATE_PROJECT_STEP4}/:project_id`}
            element={
              <PrivateRoute>
                <Step4 />
              </PrivateRoute>
            }
          />

          <Route
            path={VIEW_ALL_DATA_SET}
            element={
              <PrivateRoute>
                <ViewAllDatasetimages />
              </PrivateRoute>
            }
          />
          <Route
            path={ANNOTATION_IMAGE}
            element={
              <PrivateRoute>
                <AnnotationImage />
              </PrivateRoute>
            }
          />
          <Route path={TERM_CONDITION} element={<TermCondition />} />
          <Route path={PRIVACY_POLICY} element={<PrivacyPolicy />} />
          <Route
            path={MODAL_TRANINING_COMPARE}
            element={<ModalTrainingCompare />}
          />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
