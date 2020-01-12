import React, { Component } from "react";
import AppContext from "../context";
import { AutoSizer } from "react-virtualized";
import { ResponsiveRadar } from "@nivo/radar";

class SkillRadar extends Component {
  state = {};
  render() {
    let selfData = this.context.radar.selfRadar;
    let averageData = this.context.radar.avgRadar;
    let topData = this.context.radar.topRadar;
    let radarDepartment = null;
    let labels = [
      "Sales",
      "Retention",
      "Digital Platform",
      "iCSAT",
      "Knowledge"
    ];
    if (this.context.appSettings.function === "RR") {
      radarDepartment = this.context.user.staffShop;
    } else if (
      this.context.appSettings.function === "Management" ||
      this.context.appSettings.function === "RM"
    ) {
      radarDepartment = this.context.user.staffRegion;
    } else {
      radarDepartment = this.context.user.staffDistrict;
    }
    let radarData = [
      {
        kpi: labels[0],
        Self: Math.round(selfData[0]),
        Average: Math.round(averageData[0]),
        Top: Math.round(topData[0])
      },
      {
        kpi: labels[1],
        Self: Math.round(selfData[1]),
        Average: Math.round(averageData[1]),
        Top: Math.round(topData[1])
      },
      {
        kpi: labels[2],
        Self: Math.round(selfData[2]),
        Average: Math.round(averageData[2]),
        Top: Math.round(topData[2])
      },
      {
        kpi: labels[3],
        Self: Math.round(selfData[3]),
        Average: Math.round(averageData[3]),
        Top: Math.round(topData[3])
      },
      {
        kpi: labels[4],
        Self: Math.round(selfData[4]),
        Average: Math.round(averageData[4]),
        Top: Math.round(topData[4])
      }
    ];

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

    return (
      <div className="card border-0 mt-4">
        <div className="card-body">
          <h5 className="card-title">Skill Chart</h5>
          <h6 className="card-subtitle mb-2 text-muted">
            เทียบคะแนนเฉลี่ย 3 เดือนย้อนหลังแต่ละด้าน กับ{" "}
            {this.context.user.staffFunction} ใน {radarDepartment}
          </h6>
          <div>
            <AutoSizer disableHeight>
              {({ width }) => (
                <div className="" style={{ height: 300, width: width }}>
                  <ResponsiveRadar
                    data={radarData}
                    keys={["Top", "Average", "Self"]}
                    indexBy="kpi"
                    maxValue="auto"
                    margin={{ top: 70, right: 80, bottom: 40, left: 80 }}
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
                    colors={[
                      "rgba(111, 192, 122, 1)",
                      "rgba(254, 210, 102, 1)",
                      "rgba(231, 112, 122, 1)"
                    ]}
                    fillOpacity={0.1}
                    blendMode="normal"
                    animate={true}
                    motionStiffness={90}
                    motionDamping={15}
                    isInteractive={true}
                    theme={theme}
                    legends={[
                      {
                        anchor: "top-left",
                        direction: "column",
                        translateX: -50,
                        translateY: -40,
                        itemWidth: 80,
                        itemHeight: 20,
                        itemTextColor: "#999",
                        symbolSize: 12,
                        symbolShape: "circle"
                      }
                    ]}
                  />
                </div>
              )}
            </AutoSizer>
          </div>
          <div />
        </div>
      </div>
    );
  }
}

SkillRadar.contextType = AppContext;
export default SkillRadar;
