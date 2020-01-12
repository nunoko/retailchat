import React, { Component } from "react";
import {
  buildStyles,
  CircularProgressbarWithChildren
} from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import VisibilitySensor from "react-visibility-sensor";
import AppContext from "../context";

class YTD extends Component {
  render() {
    return (
      <div className="card border-0 mt-4 mb-n3">
        <div className="card-body px-3">
          <h5 className="card-title">
            PMS KPI{" "}
            <small className="badge-pill badge-sm bg-light">
              {this.context.appSettings.monthStart}
            </small>{" "}
            -{" "}
            <small className="badge-pill badge-sm bg-light">
              {this.context.appSettings.monthAsOf}
            </small>
          </h5>
          <h6 className="card-subtitle mb-2 text-muted">
            คะแนนสะสมเทียบกับ {this.context.user.staffFunction} ภายใน{" "}
            {this.context.appSettings.function === "RR"
              ? this.context.user.staffShop
              : this.context.appSettings.function === "RM" ||
                this.context.appSettings.function === "Management"
              ? this.context.user.staffRegion
              : this.context.user.staffDistrict}
          </h6>

          <div className="container">
            <VisibilitySensor>
              {({ isVisible }) => {
                return (
                  <div className="row">
                    <div className="col-4">
                      <CircularProgressbarWithChildren
                        value={isVisible && this.context.PMS.pmsYTD}
                        circleRatio={0.5}
                        strokeWidth={12}
                        styles={buildStyles({
                          rotation: 0.75,
                          strokeLinecap: "rounded",
                          trailColor: "rgba(242, 241, 239, 1)",
                          pathColor: "rgba(231, 112, 122, 1)",
                          pathTransitionDuration: 1.5
                        })}
                      >
                        <h3
                          className="font-weight-bold"
                          style={{
                            color: "rgba(231, 112, 122, 1)"
                          }}
                        >
                          <div style={{ marginTop: 10 }}>
                            {this.context.trends.selfTrend.length >= 1 ? (
                              Math.round(this.context.PMS.pmsYTD)
                            ) : (
                              <span className="h4">-</span>
                            )}
                            <small style={{ fontSize: "12px" }}>%</small>
                          </div>
                        </h3>
                        <h6 className="text-muted" style={{ marginTop: -10 }}>
                          Self
                        </h6>
                      </CircularProgressbarWithChildren>
                    </div>
                    <div className="col-4">
                      <CircularProgressbarWithChildren
                        value={
                          isVisible
                            ? this.context.appSettings.function === "RR"
                              ? Math.round(this.context.PMS.pmsAvgShop)
                              : this.context.appSettings.function === "RM" ||
                              this.context.appSettings.function === "Management"
                                ? Math.round(this.context.PMS.pmsAvgRegion)
                                : Math.round(this.context.PMS.pmsAvgDistrict)
                            : 0
                        }
                        circleRatio={0.5}
                        strokeWidth={12}
                        styles={buildStyles({
                          rotation: 0.75,
                          strokeLinecap: "rounded",
                          trailColor: "rgba(242, 241, 239, 1)",
                          pathColor: "rgba(254, 210, 102, 1)",
                          pathTransitionDuration: 1.5
                        })}
                      >
                        <h3
                          className="font-weight-bold"
                          style={{
                            color: "rgba(254, 210, 102, 1)"
                          }}
                        >
                          <div style={{ marginTop: 10 }}>
                            {this.context.appSettings.function === "RR"
                              ? Math.round(this.context.PMS.pmsAvgShop)
                              : this.context.appSettings.function === "RM" ||
                              this.context.appSettings.function === "Management"
                                ? Math.round(this.context.PMS.pmsAvgRegion)
                                : Math.round(this.context.PMS.pmsAvgDistrict)}
                              
                            <small style={{ fontSize: "12px" }}>%</small>
                          </div>
                        </h3>
                        <h6 className="text-muted" style={{ marginTop: -10 }}>
                          Average
                        </h6>
                      </CircularProgressbarWithChildren>
                    </div>
                    <div className="col-4">
                      <CircularProgressbarWithChildren
                        value={
                          isVisible
                            ? this.context.appSettings.function === "RR"
                              ? Math.round(this.context.PMS.pmsTopShop)
                              : this.context.appSettings.function === "RM" ||
                              this.context.appSettings.function === "Management"
                                ? Math.round(this.context.PMS.pmsTopRegion)
                                : Math.round(this.context.PMS.pmsTopDistrict)
                            : 0
                        }
                        circleRatio={0.5}
                        strokeWidth={12}
                        styles={buildStyles({
                          rotation: 0.75,
                          strokeLinecap: "rounded",
                          trailColor: "rgba(242, 241, 239, 1)",
                          pathColor: "rgba(111, 192, 122, 1)",
                          pathTransitionDuration: 1.5
                        })}
                      >
                        <h3
                          className="font-weight-bold"
                          style={{
                            color: "rgba(111, 192, 122, 1)"
                          }}
                        >
                          <div style={{ marginTop: 10 }}>
                          {this.context.appSettings.function === "RR"
                              ? Math.round(this.context.PMS.pmsTopShop)
                              : this.context.appSettings.function === "RM" ||
                              this.context.appSettings.function === "Management"
                                ? Math.round(this.context.PMS.pmsTopRegion)
                                : Math.round(this.context.PMS.pmsTopDistrict)}
                            <small style={{ fontSize: "12px" }}>%</small>
                          </div>
                        </h3>
                        <h6 className="text-muted" style={{ marginTop: -10 }}>
                          Top
                        </h6>
                      </CircularProgressbarWithChildren>
                    </div>
                  </div>
                );
              }}
            </VisibilitySensor>
          </div>
        </div>
      </div>
    );
  }
}
YTD.contextType = AppContext;
export default YTD;
