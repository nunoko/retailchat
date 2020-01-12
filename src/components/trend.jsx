import React, { Component } from "react";
import { ResponsiveLine } from "@nivo/line";
import { AutoSizer } from "react-virtualized";
import AppContext from "../context";

class Trend extends Component {
  state = {};
  render() {
    let trendDepartment = null;
    let averageData = null;
    let selfData = this.context.trends.selfTrend;
    let topData = null;
    if (this.context.appSettings.function === "RR") {
      trendDepartment = this.context.user.staffShop;
      averageData = this.context.trends.avgTrend;
      topData = this.context.trends.topTrend;
    } else if (
      this.context.appSettings.function === "RM" ||
      this.context.appSettings.function === "Management"
    ) {
      trendDepartment = this.context.user.staffRegion;
      averageData = this.context.trends.avgRegionTrend;
      topData = this.context.trends.topRegionTrend;
    } else if (this.context.appSettings.function === "Area") {
      trendDepartment = this.context.user.staffDistrict;
      averageData = this.context.trends.avgDistrictTrend;
      topData = this.context.trends.topDistrictTrend;
    }

    const chartData = [
      {
        id: "Top",
        color: "rgba(111, 192, 122, 1)",
        data: topData
      },
      {
        id: "Average",
        color: "rgba(254, 210, 102, 1)",
        data: averageData
      },
      {
        id: "Self",
        color: "rgba(231, 112, 122, 1)",
        data: selfData
      }
    ];

    const theme = {
      dots: {
        text: {
          fill: "#fff",
          fontSize: 12,
          fontWeight: 800
        }
      }
    };

    return (
      <div className="card border-0 mt-4 mx-0 px-0">
        <div className="card-body px-1 mx-0">
          <h5 className="card-title ml-3">PMS Score Trends</h5>
          <h6 className="card-subtitle ml-3 mb-2 text-muted">
            คะแนนรายเดือน เทียบกับ {this.context.user.staffFunction} ใน{" "}
            {trendDepartment}
          </h6>
          <div>
            <AutoSizer disableHeight>
              {({ width }) => (
                <div className="" style={{ height: 300, width: width }}>
                  <ResponsiveLine
                    data={chartData}
                    margin={{ top: 60, right: 25, bottom: 50, left: 25 }}
                    xScale={{ type: "point" }}
                    yScale={{
                      type: "linear",
                      stacked: false,
                      min: "auto",
                      max: "auto"
                    }}
                    curve="natural"
                    axisBottom={null}
                    axisRight={null}
                    axisTop={{
                      orient: "top",
                      tickSize: 0,
                      tickPadding: 30,
                      tickRotation: 0
                    }}
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
                    legends={[
                      {
                        anchor: "top",
                        direction: "row",
                        justify: false,
                        translateX: 0,
                        translateY: -60,
                        itemsSpacing: 0,
                        itemDirection: "left-to-right",
                        itemWidth: 80,
                        itemHeight: 20,
                        itemOpacity: 0.75,
                        symbolSize: 12,
                        symbolShape: "circle"
                      }
                    ]}
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

Trend.contextType = AppContext;
export default Trend;
