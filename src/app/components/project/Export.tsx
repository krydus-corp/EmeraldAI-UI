import React, { useCallback, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch } from "../../../store";
import {
  initialiseExport,
  getStatusExport,
  downloadExport,
  downloadMetaExport,
} from "./redux/export";
import Layout from "./layout/Layout";
import dataset from "./redux/dataset";

interface IProject {
  id: string;
  name: string;
  updated_at: string;
  description: string;
  count: number;
}

interface IExport {
  id: string;
  content_keys: string[];
  path: string;
  project: IProject;
  state: string;
}

interface IAppState {
  project: IProject;
  exports: IExport[];
}

const INITIAL_EXPORT: IExport = {
  id: "",
  content_keys: [],
  path: "",
  project: {
    id: "",
    name: "",
    updated_at: "",
    count: 0,
    description: "",
  },
  state: "",
};

const ExportCard = (exportData: any, active: boolean, setActiveExport: any) => (
  <div
    onClick={() => setActiveExport(exportData)}
    className={`export-card ${active ? "active" : ""}`}
    key={exportData.id}
  >
    <div className="export-card-title">{exportData.name}</div>
    <div className="export-card-details">
      <div className="export-card-timestamp">
        Created On:
        <br />
        {new Date(exportData.updated_at).toLocaleString("en-US", {
          month: "2-digit",
          day: "2-digit",
          year: "numeric",
          hour: "numeric",
          minute: "numeric",
          hour12: true,
        })}
      </div>
      <div className="export-card-state">{exportData.state}</div>
    </div>
  </div>
);

const NewExportPrompt = ({ handleNewExport, generatingExport }: any) => (
  <div
    style={{ height: "200px", fontSize: "1.5em" }}
    className="centered-container"
  >
    <div className="centered-item">No Exports Found</div>
    <div className="centered-item">
      <button
        type="button"
        className="btn link-btn"
        onClick={handleNewExport}
        disabled={generatingExport}
      >
        {generatingExport ? "Generating..." : "Create Export"}
      </button>
    </div>
  </div>
);

const Export = () => {
  const { project, exports } = useSelector((state: IAppState) => state);
  const dispatch: AppDispatch = useDispatch();

  const [exportsLoaded, setExportsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [activeExport, setActiveExport] = useState(INITIAL_EXPORT);
  const [generatingExport, setGeneratingExport] = useState(false);
  const [error, setError] = useState(false);

  const updateStatusExport = useCallback(async () => {
    if (project?.id) {
      setActiveExport(INITIAL_EXPORT);
      await dispatch(getStatusExport(project.id));
      const newActiveExport = exports.find(
        (exp: IExport) => exp.id === activeExport.id
      );
      if (newActiveExport) {
        setActiveExport(newActiveExport);
      }
    }
  }, [dispatch, project, activeExport.id, exports]);

  useEffect(() => {
    if (!project?.id || exportsLoaded) {
      return;
    }
    dispatch(getStatusExport(project.id)).then(() => setIsLoading(false));
    setExportsLoaded(true);
  }, [dispatch, project?.id, exportsLoaded]);

  useEffect(() => {
    if (exports.length !== 0 && activeExport.id === "") {
      setActiveExport(exports[0]);
    }

    if (project?.id && !exportsLoaded) {
      updateStatusExport();
      setExportsLoaded(true);
    }
  }, [activeExport, exports, exportsLoaded, project?.id, updateStatusExport]);

  useEffect(() => {
    if (activeExport.state !== "COMPLETE") {
      const interval = setInterval(updateStatusExport, 2000);
      return () => clearInterval(interval);
    }
  }, [activeExport.state, updateStatusExport]);

  const handleNewExport = async () => {
    setGeneratingExport(true);
    const newExportRequest: any = await dispatch(
      initialiseExport({
        id: project.id,
        name: `${dataset.name}-${project.updated_at}`,
        export_type: "project",
      })
    );
    if (newExportRequest.payload.status !== 200) {
      setError(true);
    }

    updateStatusExport();
    setGeneratingExport(false);
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="app-container">
          <div></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="page-header">
        <div className="left-item">
          <h3>Exports</h3>
        </div>
        <div className="right-item">
          <button
            type="button"
            className="btn primary-btn"
            onClick={handleNewExport}
            disabled={generatingExport}
          >
            {generatingExport ? "Generating..." : "Create Export"}
          </button>
        </div>
      </div>
      <div className="app-container">
        {exports.length === 0 ? (
          <NewExportPrompt
            handleNewExport={handleNewExport}
            generatingExport={generatingExport}
          />
        ) : (
          <div style={{ display: "flex" }}>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "10px",
              }}
            >
              {exports.map((e: IExport) =>
                ExportCard(e, e.id === activeExport.id, setActiveExport)
              )}
            </div>
            <div className="download-widget">
              {activeExport.state !== "COMPLETE" ? (
                <div className="widget-content">
                  <div className="widget-item">
                    <span className="item-label">Loading...</span>
                  </div>
                </div>
              ) : (
                <div className="widget-content">
                  <div className="widget-item">
                    <span className="item-label">ID:</span> {activeExport.id}
                  </div>
                  <div className="widget-item">
                    <span className="item-label">Dataset Count:</span>{" "}
                    {activeExport.project.count}
                  </div>
                  <div className="widget-item">
                    {activeExport.project.description}
                  </div>
                  <div
                    className="download-link-primary"
                    onClick={() => {
                      dispatch(
                        downloadExport({
                          id: activeExport.id,
                          contentKey: activeExport.content_keys[0],
                        })
                      );
                    }}
                  >
                    Download Content
                  </div>
                  <div
                    className="download-link-secondary"
                    onClick={() => {
                      dispatch(downloadMetaExport(activeExport.id));
                    }}
                  >
                    Download Metadata
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Export;
