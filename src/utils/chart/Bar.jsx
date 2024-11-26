import { SDGS_COLORS } from "../Constants";
import React, { useEffect, useRef } from "react";
import { Chart, registerables } from "chart.js";
import PropTypes from "prop-types";

const SDG_MAP = {
  "sdgs-18": "人",
  "sdgs-19": "文",
  "sdgs-20": "地",
  "sdgs-21": "產",
  "sdgs-22": "景",
  "sdgs-23": "德",
  "sdgs-24": "智",
  "sdgs-25": "體",
  "sdgs-26": "群",
  "sdgs-27": "美",
};

// Utility functions
const filterZeroItem = (data, backgroundColor, images) => {
  const newData = {};
  const newBackgroundColor = [];
  const newImages = [];
  const keys = Object.keys(data);

  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    if (data[key] === 0) continue;

    const index = i + 1;
    newData[`sdgs-${index}`] = data[key];
    if (Array.isArray(backgroundColor)) {
      newBackgroundColor.push(backgroundColor[i]);
    }

    if (Array.isArray(images)) {
      newImages.push(images[i]);
    }
  }

  return {
    data: newData,
    backgroundColor: newBackgroundColor,
    images: newImages,
  };
};

const getMappedSdgData = (data) => {
  const keys = Object.keys(data);
  const newData = {};

  for (const key of keys) {
    const newKey = SDG_MAP[key];
    if (newKey) {
      newData[newKey] = data[key];
    } else {
      newData[key] = data[key];
    }
  }

  return newData;
};

const SdgBarChart = ({
  data,
  title = "永續指標",
  backgroundColor = SDGS_COLORS,
  images = [],
  skipZero = true,
  yAxisTitle = "關係人口數",
  xAxisTitle = "指標",
  xAxisDisplay = true,
  titlePosition = "bottom",
  titleFontSize = 16,
  gridlineDisplay = false,
  canvasClassName,
  canvasStyle,
}) => {
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);

  useEffect(() => {
    // Register Chart.js components
    Chart.register(...registerables);

    // Get the canvas context
    const ctx = chartRef.current;

    // Filter out zero values if skipZero is true
    let processedData = data;
    let processedBackgroundColor = backgroundColor;
    let processedImages = images;

    if (skipZero) {
      const filtered = filterZeroItem(data, backgroundColor, images);
      processedData = filtered.data;
      processedBackgroundColor = filtered.backgroundColor;
      processedImages = filtered.images;
    }

    // Map SDG data
    const mappedData = getMappedSdgData(processedData);

    // Destroy existing chart if it exists
    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    // Create new chart
    chartInstanceRef.current = new Chart(ctx, {
      type: "bar",
      data: {
        labels: Object.keys(mappedData),
        datasets: [
          {
            label: title,
            data: Object.values(mappedData),
            backgroundColor: processedBackgroundColor,
            borderWidth: 1,
          },
        ],
      },
      options: {
        maintainAspectRatio: false,
        elements: {
          bar: {
            borderWidth: 2,
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: yAxisTitle,
            },
            ticks: {
              precision: 0,
            },
            grid: {
              display: gridlineDisplay,
            },
          },
          x: {
            title: {
              display: true,
              text: xAxisTitle,
            },
            display: xAxisDisplay,
            grid: {
              display: gridlineDisplay,
            },
          },
        },
        plugins: {
          legend: {
            display: false,
          },
          title: {
            display: true,
            text: title,
            font: { size: titleFontSize },
            position: titlePosition,
            padding: {
              bottom: 50,
            },
          },
        },
      },
    });

    // Cleanup function
    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
    };
  }, [
    data,
    title,
    backgroundColor,
    images,
    skipZero,
    yAxisTitle,
    xAxisTitle,
    xAxisDisplay,
    titlePosition,
    titleFontSize,
    gridlineDisplay,
  ]);

  return (
    <canvas
      ref={chartRef}
      className={canvasClassName}
      style={{
        position: "relative",
        height: "400px",
        width: "100%",
        ...canvasStyle,
      }}
    ></canvas>
  );
};

SdgBarChart.propTypes = {
  data: PropTypes.object.isRequired,
  title: PropTypes.string,
  backgroundColor: PropTypes.array,
  images: PropTypes.array,
  skipZero: PropTypes.bool,
  yAxisTitle: PropTypes.string,
  xAxisTitle: PropTypes.string,
  xAxisDisplay: PropTypes.bool,
  titlePosition: PropTypes.string,
  titleFontSize: PropTypes.number,
  gridlineDisplay: PropTypes.bool,
  canvasClassName: PropTypes.string,
  canvasStyle: PropTypes.object,
};

export default SdgBarChart;
