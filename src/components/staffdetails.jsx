import React, { Component } from "react";
import AppContext from "../context";
import { AutoSizer } from "react-virtualized";
import { ResponsiveRadar } from "@nivo/radar";
import { ResponsiveLine } from "@nivo/line";
import dbKPI from "../data/kpiradar.json";
import dbPMS from "../data/staffpms.json";

let labels = ["Sales", "Retention", "Digital Platform", "iCSAT", "Knowledge"];
let radarData = [];
let scores = null;
let trendData = [];
const theme = {
  axis: {
    ticks: {
      text: {
        fill: "#333"
      }
    }
  },
  grid: {
    line: {
      stroke: "#cfcfcf",
      strokeDasharray: "6 4"
    }
  },
  dots: {
    text: {
      fill: "#fff",
      fontSize: 12,
      fontWeight: 800
    }
  }
};
const monthDesc = {
  "01": "Jan",
  "02": "Feb",
  "03": "Mar",
  "04": "Apr",
  "05": "May",
  "06": "Jun",
  "07": "Jul",
  "08": "Aug",
  "09": "Sep",
  "10": "Oct",
  "11": "Nov",
  "12": "Dec"
};

class StaffDetails extends Component {
  state = {
    loading: true
  };

  loader() {
    return (
      <div className="text-center">
        <div className="m-0">
          <div
            className="spinner-grow text-danger mr-2"
            style={{ width: "1rem", height: "1rem" }}
          />
          <div
            className="spinner-grow text-warning mr-2"
            style={{ width: "2rem", height: "2rem" }}
          />
          <div
            className="spinner-grow text-success"
            style={{ width: "3rem", height: "3rem" }}
          />
        </div>
      </div>
    );
  }

  componentDidMount() {
    let dbKPISelf = dbKPI[this.props.eid];
    let selfData = [
      dbKPISelf["Sales"],
      dbKPISelf["Retention"],
      dbKPISelf["Digital Platform"],
      dbKPISelf["iCSAT"],
      dbKPISelf["Knowledge"]
    ];
    radarData = [
      {
        kpi: labels[0],
        Self: Math.round(selfData[0])
      },
      {
        kpi: labels[1],
        Self: Math.round(selfData[1])
      },
      {
        kpi: labels[2],
        Self: Math.round(selfData[2])
      },
      {
        kpi: labels[3],
        Self: Math.round(selfData[3])
      },
      {
        kpi: labels[4],
        Self: Math.round(selfData[4])
      }
    ];

    //get trend data
    let selfTrend = [];
    scores = dbPMS[this.props.eid];
    Object.keys(scores.pmsScore).map(key => {
      let dataMonth = {
        x: monthDesc[key.substr(2, 2)] + key.substr(0, 2),
        y: Math.round(scores.pmsScore[key])
      };
      selfTrend.push(dataMonth);
      return null;
    });
    trendData = [
      {
        id: "Self",
        color: "rgba(231, 112, 122, 1)",
        data: selfTrend
      }
    ];

    this.setState({
      loading: false
    });
  }

  render() {
    if (this.state.loading) return this.loader();
    else
      return (
        <div className="container m-0 p-0">
          <div className="row  no-gutters mx-n1 p-0">
            <div className="col-12">
              <AutoSizer disableHeight>
                {({ width }) => (
                  <div className="" style={{ height: 100, width: width }}>
                    <ResponsiveLine
                      id={"trend" + this.props.eid}
                      data={trendData}
                      margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
                      xScale={{ type: "point" }}
                      yScale={{
                        type: "linear",
                        stacked: false,
                        min: "auto",
                        max: "auto"
                      }}
                      curve="natural"
                      axisBottom={{
                        orient: "ิbottom",
                        tickSize: 0,
                        tickPadding: 5,
                        tickRotation: 0
                      }}
                      axisRight={null}
                      axisTop={null}
                      axisLeft={null}
                      enableGridX={false}
                      enableGridY={false}
                      pointSize={20}
                      pointColor={d => d.color}
                      pointBorderWidth={2}
                      pointBorderColor={{ from: "serieColor" }}
                      colors={d => d.color}
                      lineWidth={4}
                      enablePointLabel={true}
                      pointLabel="y"
                      pointLabelYOffset={4}
                      enableArea={true}
                      areaOpacity={0.1}
                      isInteractive={false}
                      enableSlices="x"
                      crosshairType="bottom"
                      useMesh={true}
                      theme={theme}
                    />
                  </div>
                )}
              </AutoSizer>
            </div>
          </div>
          <div className="row">
            <div className="col-12">
              <AutoSizer disableHeight>
                {({ width }) => (
                  <div className="" style={{ height: 250, width: width }}>
                    <ResponsiveRadar
                      id={"radar" + this.props.eid}
                      data={radarData}
                      keys={["Self"]}
                      indexBy="kpi"
                      maxValue="auto"
                      margin={{ top: 40, right: 80, bottom: 40, left: 80 }}
                      curve="linearClosed"
                      borderWidth={2}
                      borderColor={{ from: "color" }}
                      gridLevels={5}
                      gridShape="circular"
                      gridLabelOffset={15}
                      enableDots={true}
                      dotSize={20}
                      dotColor={{ from: "color" }}
                      dotBorderWidth={2}
                      dotBorderColor={{ from: "color" }}
                      enableDotLabel={true}
                      dotLabel="value"
                      dotLabelYOffset={4}
                      colors={["rgba(231, 112, 122, 1)"]}
                      fillOpacity={0.1}
                      blendMode="normal"
                      animate={true}
                      motionStiffness={90}
                      motionDamping={15}
                      isInteractive={false}
                      theme={theme}
                    />
                  </div>
                )}
              </AutoSizer>
            </div>
          </div>
        </div>
      );
  }
}

StaffDetails.contextType = AppContext;
export default StaffDetails;
