import { CREATE_PROJECT_URL } from "../../../constant/api";

/* eslint-disable no-restricted-globals */
self.onmessage = async function (e) {
  if (e.data.upload) {
    const { index, jsonFiles, projectId, batchArr, token } =
      e.data.upload;
    await parallelUploading(
      index,
      jsonFiles,
      projectId,
      batchArr,
      token
    );
  }
};

const parallelUploading = (
  index,
  jsonFiles,
  projectId,
  batchArr,
  token
) => {
  return new Promise((resolve, reject) => {
    const data = new FormData();
    batchArr[index].forEach((file) => {
      data.append("files", file);
    });
    const xhr = new XMLHttpRequest();
    let uploadUrl = `${CREATE_PROJECT_URL}/${projectId}/upload`;
    if (jsonFiles[0]?.name) {
      uploadUrl = `${uploadUrl}?labels_file=${jsonFiles[0]?.name}`;
    }
    xhr.open("POST", uploadUrl);
    xhr.setRequestHeader("Authorization", `Bearer ${token}`);

    xhr.onreadystatechange = () => {
      if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
        // Request finished. Do processing here.
        resolve(self.postMessage(JSON.parse(xhr.response)));
      }
    };
    xhr.send(data);
  });
};

export { };

