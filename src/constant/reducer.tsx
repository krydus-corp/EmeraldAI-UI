import loginSlice from "../app/components/login/redux/login";
import userDetailsSlice from "../app/components/login/redux/user";
import projectSlice from "../app/components/project/redux/project";
import forgotPasswordSlice from "../app/components/login/redux/forgotPassword";
import toastSlice from "../app/components/common/redux/toast";
import updateProfileSlice from "../app/components/login/redux/updateProfile";
import uploadSlice from "../app/components/project/redux/upload";
import contentSlice from "../app/components/project/redux/content";
import datasetSlice from "../app/components/project/redux/dataset";
import projectListSlice from "../app/components/project/redux/projectList";
import annotateContentSlice from "../app/components/annotate/redux/annotateImage";
import annotateTagSlice from "../app/components/annotate/redux/annotateTags";
import statisticsSlice from "../app/components/project/redux/statistics";
import exportSlice from "../app/components/project/redux/export";

export const reducers = {
  loggegIn: loginSlice,
  userDetails: userDetailsSlice,
  project: projectSlice,
  projectUploads: uploadSlice,
  forgotPassword: forgotPasswordSlice,
  appToast: toastSlice,
  updateProfile: updateProfileSlice,
  content: contentSlice,
  dataSet: datasetSlice,
  projectList: projectListSlice,
  annotateContent: annotateContentSlice,
  annotateTag: annotateTagSlice,
  statistics: statisticsSlice,
  exports: exportSlice,
};
