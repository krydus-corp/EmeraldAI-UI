import React, { useEffect, useState } from "react";
import { Form } from "react-bootstrap";
import { NumberLimit } from "../../../constant/number";
import BarChart from "../charts/BarChart";
import { ChartBackgroundColor } from "../charts/CommonChart";
import PieChart from "../charts/PieChart";
import ClassBalance from "./model/ClassBalance"
import _ from "lodash";
import getObjectSortedBy from '../../../utils/objects'

interface Props {
  isModalPopup?: boolean;
  viewMoreChart?: Function;
  isBarChart: boolean;
  setBarChart?: Function;
  statsData?: any;
  isChartOnly?: boolean;
  backgroundColor?: any;
  height?: string;
}
const ChartDataView = ({
  viewMoreChart,
  isModalPopup,
  statsData,
  isBarChart,
  setBarChart,
  isChartOnly,
  backgroundColor,
  height,
}: Props) => {
  const labelText: any = [];
  const dataImageCount = [];
  const sortedAnnotations =
    statsData?.annotations_per_class &&
    _.sortBy(statsData?.annotations_per_class, "count").reverse();

  const UNDER_REPRESENTED = "↓";

  const OVER_REPRESENTED = "↑";

  const BALANCED = "✓";

  if (sortedAnnotations) {
    for (const key in sortedAnnotations) {
      if (sortedAnnotations[key].count) {

        labelText.push(`${sortedAnnotations[key].name}`);
        dataImageCount.push(sortedAnnotations[key].count);
      }
    }
  }

  const getClassCount = () =>
    statsData &&
      statsData?.annotations_per_class &&
      Object.keys(statsData?.annotations_per_class).length > NumberLimit.ZERO
      ? Object.keys(statsData?.annotations_per_class).length - NumberLimit.ONE
      : NumberLimit.ZERO;

  const isStatsEmpty = (statisticsData: Object) => {
    return statisticsData ? !('total_annotations' in statisticsData) : true;
  };
  let classesCount = NumberLimit.ZERO
  let sortedStatsData: any = {}

  if(!isStatsEmpty(statsData)) {
    classesCount = Object.keys(statsData?.annotations_per_class).length;
    const annotationsSortedBy = getObjectSortedBy(statsData.annotations_per_class, 'count')
    sortedStatsData = structuredClone(statsData)
    sortedStatsData.annotations_per_class = annotationsSortedBy
  }

  return (
    <>
      <div className="chart-box">
        {!isChartOnly && (
          <>
            <div className="page-header">
              <div className="left-item">
                <h3>Classes by # of Annotations</h3>
                {/* {!isModalPopup && !isChartOnly && (
                  <button
                    type="button"
                    className="btn link-btn view-more-btn"
                    onClick={() => {
                      viewMoreChart && viewMoreChart();
                    }}
                  >
                    View More
                  </button>
                )} */}
              </div>
              <div className="right-item">
                <h3>
                  Total Classes: {getClassCount() || NumberLimit.ZERO} | 
                  Total Annotations: {statsData?.total_annotations || NumberLimit.ZERO}
                </h3>
              </div>
            </div>
          </>
        )}
        <div className="chart-content">
          {isBarChart && (
            <ClassBalance statistics={sortedStatsData} classesCount={classesCount} />

          )}
          {!isBarChart && (
            <PieChart
              labelText={labelText}
              backgroundColorData={ChartBackgroundColor}
              statsData={statsData}
              dataImageCount={dataImageCount}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default React.memo(ChartDataView);
