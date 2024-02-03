import React, { useEffect, useRef, useState } from "react";
import { Dropdown } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import {
  DOT_ICON,
  FILTER_ICON,
  IMAGE_ICON,
  CLOCK_ICON,
  DEL_ICON,
  EDIT_ICON,
  DASHBOARD_EMPTY,
  PROJECT_EMPTY,
} from "../../../constant/image";
import { AppDispatch } from "../../../store";
import CreateProjectModal from "../modals/CreateProjectModal";
import DeleteProject from "../modals/DeleteProject";
import ProjectFilter from "../modals/ProjectFilter";
import NavBar from "../templates/NavBar";
import {
  clearProjectList,
  projectListLoading,
  searchProjectList,
} from "./redux/projectList";
import InfiniteScroll from "react-infinite-scroll-component";
import { addProject, clearProject } from "./redux/project";
import { useNavigate } from "react-router-dom";
import { PROJECT_OVERVIEW } from "../../../utils/routeConstants";
import { capitalizeFirstLetter } from "../../../utils/common";
import { NumberLimit } from "../../../constant/number";
import moment from "moment";
import { clearContent } from "./redux/content";
import { getUserDetails } from "../login/redux/user";
const ProjectList = () => {
  const {
    projects,
    page: count,
    loading,
  } = useSelector((state: any) => state.projectList);

  const { projectList: projectCount } = useSelector((state: any) => state);

  const [page, setPage] = useState<number>(0);
  const [deleted, setDeleted] = useState<any>("");
  const [deleteModal, setDeleteModal] = useState<any>("");
  const [filterModal, setFilterModal] = useState<boolean>(false);
  const [projectList, setProjectList] = useState<any>([]);
  const [search, setSearch] = useState<any>("");
  const filter = useRef("");
  const date = useRef([]);
  const navigate = useNavigate();

  const { userDetails } = useSelector((state: any) => state);

  const [isSearch, setIsSearch] = useState<boolean>(false);
  const [noData, setNoData] = useState<boolean>(false);

  const dispatch: AppDispatch = useDispatch();

  const fetchMore = async () => {
    dispatch(projectListLoading());
    await dispatch(
      searchProjectList({
        limit: NumberLimit.EIGHT,
        page,
        search,
        annotation: filter.current,
        date: date.current,
      })
    );
    dispatch(clearProjectList());
  };

  const closeDeleteModal = () => setDeleteModal("");

  const closeFilterModal = () => setFilterModal(false);

  useEffect(() => {
    if (projects && projects[0] && count > 0) {
      setProjectList((prevState: any) => [...prevState, ...projects]);
    } else if (projects && projects[0] && count === 0) {
      setProjectList(projects);
    }
  }, [count, projects]);

  useEffect(() => {
    dispatch(getUserDetails());
  }, []);

  useEffect(() => {
    fetchMore();
  }, [page, deleted]);

  const handleEdit = async (editProject: any) => {
    dispatch(addProject(editProject));
    openModal("edit");
  };

  const handleOverview = async (editProject: any) => {
    dispatch(addProject(editProject));
    navigate(`${PROJECT_OVERVIEW}/${editProject.id}`);
  };

  const onSearchChange = (value: string, close?: any) => {
    setSearch(value);
    setNoData(true);
    filter.current = "";
    date.current = [];
    setIsSearch(true);
    if (close) {
      setNoData(false);
    }
  };

  const onFilterChange = (value: string, dateData: any) => {
    setSearch("");
    filter.current = value;
    date.current = dateData;
    setFilterModal(false);
    setIsSearch(true);
    setPage(NumberLimit.ZERO);
  };

  useEffect(() => {
    if (isSearch) {
      setPage(NumberLimit.ZERO);
      handleSearch();
    }
  }, [isSearch]);

  const handleSearch = async () => {
    setIsSearch(false);
    dispatch(clearProjectList());
    await dispatch(
      searchProjectList({
        limit: NumberLimit.EIGHT,
        page,
        search,
        annotation: filter.current,
        date: date.current,
      })
    );
  };

  const [isOpen, setIsOpen] = useState("");
  const openModal = (type: string) => setIsOpen(type);
  const closeModal = async () => {
    dispatch(clearProject());
    dispatch(projectListLoading());
    setIsOpen("");
    setPage(0);
    await fetchMore();
  };

  const closeWithoutSave = () => {
    setIsOpen("");
  };

  const createNewProject = () => {
    dispatch(clearProject());
    dispatch(clearContent());
    openModal("create");
  };

  const renderProjects = () => {
    return projectList.map((project: any, index: number) => (
      <div className="card dashboard-card" key={index}>
        <div className="img-box">
          <div
            className={`card-tag ${
              project.annotation_type === "bounding_box" ? "secondary" : ""
            }`}
          >
            {project.annotation_type === "bounding_box"
              ? "Bounding Box"
              : "Classification"}
          </div>
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
                className="dropdrown-item-right"
                onClick={() => {
                  handleEdit(project);
                }}
              >
                <img src={EDIT_ICON} alt="profile" /> Edit Project
              </Dropdown.Item>
              <Dropdown.Item
                className="dropdrown-item-right"
                onClick={() => {
                  setDeleteModal(project.id);
                }}
              >
                <img src={DEL_ICON} alt="profile" /> Delete
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
          <img
            src={
              project.profile_100
                ? `data:image/png;base64,${project.profile_640}`
                : PROJECT_EMPTY
            }
            className="card-img-top"
            alt="image"
          />
        </div>
        <div className="card-body">
          <div className="card-data">
            <h5
              onClick={() => {
                handleOverview(project);
              }}
              className="card-title"
            >
              {project.name}
            </h5>
            <p
              onClick={() => {
                handleOverview(project);
              }}
              className="card-text"
            >
              {project.description.substring(0, NumberLimit.ONE_FOURTY)}
              {project.description.length > NumberLimit.ONE_FOURTY && "..."}
            </p>
          </div>
          <div className="card-footer">
            <a href="#" className="card-link">
              <img src={CLOCK_ICON} alt="clock" /> Modified{" "}
              {moment(project.updated_at).fromNow()}
            </a>
            <a href="#" className="card-link">
              <img src={IMAGE_ICON} alt="clock" /> {project.count}
            </a>
          </div>
        </div>
      </div>
    ));
  };

  return (
    <>
      {loading && !projects && (
        <div className="loader">
          <div className="loader-inner"></div>
        </div>
      )}
      <NavBar>
        <>
          <div className="dashboard-container">
            <div className="dashboard-header">
              <div className="big-head">
                Hi{" "}
                {userDetails &&
                  userDetails?.first_name &&
                  capitalizeFirstLetter(userDetails?.first_name)}
                <span className="sm-txt">
                  Here are your <span>projects</span>
                </span>
              </div>
              <div className="right-item">
                <div className="search-wrapper">
                  <div className="search-box">
                    <span
                      className="search-icon"
                      onClick={() => {
                        search !== "" ? onSearchChange(search) : "";
                      }}
                    ></span>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Search Projects"
                      // onChange={(e) => onSearchChange(e.target.value)}
                      value={search}
                      onChange={(e) => {
                        setSearch(e.target.value);
                      }}
                      onKeyPress={(event) =>
                        event.key === "Enter" && onSearchChange(search)
                      }
                    />
                    {search && (
                      <span
                        className="close-icon"
                        onClick={() => {
                          onSearchChange("", "close");
                        }}
                      ></span>
                    )}
                  </div>
                </div>
                <button
                  type="button"
                  className="btn filter-btn"
                  onClick={() => setFilterModal(true)}
                >
                  {(filter.current !== "" ||
                    date.current.length !== NumberLimit.ZERO) && (
                    <span className="filter-dot"></span>
                  )}
                  <img src={FILTER_ICON} alt="filter" />
                </button>
                <button
                  type="button"
                  className="btn primary-btn create-project-btn"
                  onClick={() => createNewProject()}
                >
                  Create New Project
                </button>
              </div>
            </div>
            {/* dashboard-header */}

            <div className="inner-card-section">
              {page === 0 && !loading && projects?.length === 0 ? (
                <div className="empty-box">
                  <img src={DASHBOARD_EMPTY} alt="images" />
                  <h4>
                    {noData ? (
                      <>
                        <span>Try again with different keywords</span>
                      </>
                    ) : (
                      "You don’t have any project yet. Create your first project!"
                    )}
                  </h4>
                </div>
              ) : (
                <div className="card-section">
                  <InfiniteScroll
                    className="scroll"
                    scrollThreshold="200px"
                    dataLength={projectList.length}
                    next={() => setPage(page + NumberLimit.ONE)}
                    hasMore={projects ? true : false}
                    loader={
                      projectCount.count > projectList?.length && (
                        <div className="loader-inline">
                          <div className="loader-inner"></div>
                        </div>
                      )
                    }
                  >
                    {renderProjects()}
                  </InfiniteScroll>
                </div>
              )}
            </div>
          </div>

          {/* create project */}
          {isOpen && (
            <CreateProjectModal
              show={isOpen ? true : false}
              closeModal={closeModal}
              edit={isOpen === "edit" ? true : false}
              closeWithoutSave={closeWithoutSave}
            />
          )}
          {/*filter  */}
          {filterModal && (
            <ProjectFilter
              show={filterModal}
              closeModal={closeFilterModal}
              filter={filter.current}
              date={date.current}
              submit={onFilterChange}
            />
          )}

          {/* delete-project-modal*/}
          {deleteModal && (
            <DeleteProject
              show={deleteModal}
              closeModal={closeDeleteModal}
              setPage={setPage}
              setDeleted={setDeleted}
            />
          )}
        </>
      </NavBar>
    </>
  );
};
export default ProjectList;
