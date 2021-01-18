import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import numeral from "numeral";

const options = {
  legend: {
    display: false,
  },
  elements: {
    point: {
      radius: 0,
    },
  },
  maintainAspectRatio: false,
  tooltips: {
    mode: "index",
    intersect: false,
    callbacks: {
      label: function (tooltipItem, data) {
        return numeral(tooltipItem.value).format("+0,0");
      },
    },
  },
  scales: {
    xAxes: [
      {
        type: "time",
        time: {
          format: "MM/DD/YY",
          tooltipFormat: "ll",
        },
      },
    ],
    yAxes: [
      {
        gridLines: {
          display: false,
        },
        ticks: {
          callback: function (value, index, values) {
            return numeral(value).format("0a");
          },
        },
      },
    ],
  },
};

const buildChartData = (data, category) => {
  console.log("Category = ", category);
  let chartData = [];
  let lastDataPoint;
  for (let date in data.cases) {
    if (lastDataPoint) {
      const newDataPoint = {
        x: date,
        y: data[category][date] - lastDataPoint,
      };
      chartData.push(newDataPoint);
    }
    lastDataPoint = data[category][date];
  }
  console.log("Chart data = ", chartData);

  return chartData;
};

function LineGraph({ category = "cases" }) {
  const [data, setData] = useState({});
  const categoryColor = {
    cases: {
      fillColor: "rgba(255, 153, 0, 0.4)",
      borderColor: "rgba(255, 153, 0, 1)",
    },
    recovered: {
      fillColor: "rgba(38, 166, 91, 0.4)",
      borderColor: "rgba(38, 166, 91, 1)",
    },
    deaths: {
      fillColor: "rgba(255,0,0,0.4)",
      borderColor: "rgba(255,0,0,1)",
    },
  };
  useEffect(() => {
    const fetchChartData = async () => {
      const url = "https://disease.sh/v3/covid-19/historical/all?lastdays=120";
      const response = await fetch(url);
      const data = await response.json();
      const chartData = buildChartData(data, category);
      setData(chartData);
    };

    fetchChartData();
  }, [category]);

  return (
    <div>
      {data?.length > 0 && (
        <Line
          options={options}
          data={{
            datasets: [
              {
                // backgroundColor: "rgba(204,16,52,0.5)",
                // borderColor: "#CC1034",
                backgroundColor: categoryColor[category].fillColor,
                borderColor: categoryColor[category].borderColor,
                data: data,
              },
            ],
          }}
        />
      )}
    </div>
  );
}

export default LineGraph;
