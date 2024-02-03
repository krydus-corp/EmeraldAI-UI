import React, { useEffect, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../../store";
import {
  downloadExport,
  downloadMetaExport,
  getStatusExport,
  initialiseExport,
} from "../project/redux/export";

interface Props {
  show: boolean;
  closeModal: any;
  initiateExport: any;
}

const Export = ({ show, closeModal, initiateExport }: Props) => {
  const dispatch: AppDispatch = useDispatch();

  const { project, dataSet, exportData } = useSelector((state: any) => state);
  useEffect(() => {
    project?.id && dispatch(getStatusExport(project.id));
  }, [dataSet]);

  const handleExport = (type: string) => {
    if (type === "content") {
      const data: any = {
        id: exportData.id,
        contentKey: exportData.content_keys[0],
      };
      dispatch(downloadExport(data));
    } else if (type === "meta") {
      dispatch(downloadMetaExport(exportData.id));
    } else {
      dispatch(
        initialiseExport({
          id: project.id,
          name: `${project.name}-${dataSet.updated_at}`,
          export_type: "project",
        })
      );
    }
    closeModal();
  };

  return (
    <Modal
      dialogClassName="dialog-400"
      className="common-modal export-modal"
      show={show}
      onHide={() => {
        closeModal();
      }}
      centered
    >
      <Modal.Body>
        <div className="page-header">
          <h3>
            Initiate Export Dataset
            <br />
            {exportData?.state !== "COMPLETE" && (
              <span className="export-info">
                You can download content from here once the export dataset
                initialization will be completed.
              </span>
            )}
          </h3>
          <Button
            variant="secondary"
            className="btn-close"
            onClick={() => {
              closeModal();
            }}
          ></Button>
        </div>
        <div className="from-flex">
          <div className="row">
            <div className="col-md-12">
              <div className="center-btn">
                {exportData?.project?.count === 0 && (
                  <button
                    type="button"
                    className="btn secondary-btn initiate-btn"
                    onClick={() => {
                      handleExport("initiate");
                    }}
                  >
                    Initiate Download
                  </button>
                )}
                {exportData?.project?.count > 0 && (
                  <>
                    <button
                      type="button"
                      className="btn secondary-btn"
                      onClick={() => {
                        handleExport("meta");
                      }}
                    >
                      Download Meta Data
                    </button>
                    <button
                      type="button"
                      className="btn secondary-btn"
                      onClick={() => {
                        handleExport("content");
                      }}
                      disabled={exportData?.state !== "COMPLETE"}
                    >
                      Download Content
                    </button>
                    <button
                      type="button"
                      className="btn secondary-btn"
                      onClick={() => {
                        initiateExport();
                      }}
                    >
                      Re-initiate Download
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default Export;
