import React, { Component } from "react";
import AppContext from "../context";
import Collapse from "@kunukn/react-collapse";
import StaffDetails from "./staffdetails";

const functionGroup = {
  "Admin Service": "RR",
  AM: "Area",
  ASST_Sales: "Management",
  ASST_Services: "Management",
  Assist: "Management",
  Director: "Area",
  FC_Sales: "Area",
  ITF_Multi: "RR",
  Ret_chpn_1: "RR",
  RM: "RM",
  RR_ITF: "RR",
  RR_Sales: "RR",
  RR_Sales_New: "RR",
  RR_Services: "RR",
  Sector: "Area",
  Supervisor: "Management"
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

class StaffRanking extends Component {
  state = {
    isOnState: [
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false
    ]
  };

  addDefaultSrc(ev) {
    ev.target.src = "https://pocketkpi1.web.app/images/user.png";
  }

  toggle = index => {
    let currentState = this.state.isOnState;
    let i = 0;
    currentState.map(item => {
      if (i === index) currentState[i] = !currentState[i];
      else currentState[i] = false;
      i++;
      return null;
    });
    this.setState({
      isOnState: currentState
    });
  };

  render() {
    if (
      this.context.appSettings.function === "Management" ||
      this.context.appSettings.function === "RM"
    ) {
      let userFunction = this.context.appSettings.function;
      return (
        <div>
          <div className="card border-0 mt-4">
            <div className="card-body px-3 pb-0">
              <h5 className="card-title">
                {this.context.user.staffShop} Leaderboard
              </h5>
              <h6 className="card-subtitle mb-2 text-muted">
                พนักงานในสังกัดเรียงตามคะแนนสะสม แตะเพื่อดูข้อมูลเพิ่มเติม
              </h6>
            </div>
            <div className="card-body p-1">
              <div className="container-fluid p-0">
                {this.context.ranking.staffRanks.map((staff, index) => {
                  if (Object.keys(staff.pmsScore).length >= 1) {
                    let monthAsOfNum = Object.keys(staff.pmsScore)[
                      Object.keys(staff.pmsScore).length - 1
                    ];
                    let monthAsOf = null;
                    if (monthAsOfNum.substr(0, 1) === "1") {
                      monthAsOf =
                        monthDesc[monthAsOfNum.substr(2, 2)] +
                        monthAsOfNum.substr(0, 2);
                    }
                    if (
                      functionGroup[staff.function] === "RR" ||
                      (userFunction === "RM" &&
                        functionGroup[staff.function] === "Management")
                    ) {
                      let staffProfile =
                        "https://hr.truecorp.co.th/empimg/" +
                        staff.eid +
                        ".jpg";
                      return (
                        <div
                          key={staff.fname}
                          className="card mt-1"
                          style={
                            this.state.isOnState[index]
                              ? { borderColor: "rgba(242, 241, 239, 1)" }
                              : { borderColor: "rgba(242, 241, 239, 0.3)" }
                          }
                          onClick={() => this.toggle(index)}
                        >
                          <div className="card-body p-2 justify-content-center">
                            <div className="row no-gutters">
                              <div className="col-2 align-middle">
                                <img
                                  src={staffProfile}
                                  width="50"
                                  height="50"
                                  className="d-inline-block align-top rounded-circle"
                                  alt=""
                                  onError={this.addDefaultSrc}
                                />
                              </div>
                              <div className="col-5 align-middle">
                                <h6 className="text-dark mb-0">
                                  {staff.fname}
                                </h6>
                                <small className="text-secondary">
                                  {staff.eid.toString().substr(3, 5)} |{" "}
                                  {staff.function}
                                </small>
                              </div>
                              <div className="col-2 text-center">
                                <h6
                                  className="font-weight-bold mb-0"
                                  style={{ color: "rgba(231, 112, 122, 1)" }}
                                >
                                  {staff.pmsScore[monthAsOfNum]}
                                </h6>
                                <small className="text-secondary">
                                  {monthAsOf}
                                </small>
                              </div>
                              <div className="col-2 text-center">
                                <h6
                                  className="font-weight-bold mb-0"
                                  style={{ color: "rgba(111, 192, 122, 1)" }}
                                >
                                  {staff.pmsYTD}
                                </h6>
                                <small className="text-secondary">YTD</small>
                              </div>
                              <div className="col-1 text-center">
                                {this.state.isOnState[index] ? (
                                  <svg class="svg-icon" viewBox="0 0 20 20">
                                    <path d="M13.889,11.611c-0.17,0.17-0.443,0.17-0.612,0l-3.189-3.187l-3.363,3.36c-0.171,0.171-0.441,0.171-0.612,0c-0.172-0.169-0.172-0.443,0-0.611l3.667-3.669c0.17-0.17,0.445-0.172,0.614,0l3.496,3.493C14.058,11.167,14.061,11.443,13.889,11.611 M18.25,10c0,4.558-3.693,8.25-8.25,8.25c-4.557,0-8.25-3.692-8.25-8.25c0-4.557,3.693-8.25,8.25-8.25C14.557,1.75,18.25,5.443,18.25,10 M17.383,10c0-4.07-3.312-7.382-7.383-7.382S2.618,5.93,2.618,10S5.93,17.381,10,17.381S17.383,14.07,17.383,10"></path>
                                  </svg>
                                ) : (
                                  <svg class="svg-icon" viewBox="0 0 20 20">
                                    <path d="M13.962,8.885l-3.736,3.739c-0.086,0.086-0.201,0.13-0.314,0.13S9.686,12.71,9.6,12.624l-3.562-3.56C5.863,8.892,5.863,8.611,6.036,8.438c0.175-0.173,0.454-0.173,0.626,0l3.25,3.247l3.426-3.424c0.173-0.172,0.451-0.172,0.624,0C14.137,8.434,14.137,8.712,13.962,8.885 M18.406,10c0,4.644-3.763,8.406-8.406,8.406S1.594,14.644,1.594,10S5.356,1.594,10,1.594S18.406,5.356,18.406,10 M17.521,10c0-4.148-3.373-7.521-7.521-7.521c-4.148,0-7.521,3.374-7.521,7.521c0,4.147,3.374,7.521,7.521,7.521C14.148,17.521,17.521,14.147,17.521,10"></path>
                                  </svg>
                                )}
                              </div>
                            </div>
                            <div className="row no-gutters">
                              <div className="col-12">
                                <Collapse
                                  isOpen={this.state.isOnState[index]}
                                  className="collapse-css-transition"
                                >
                                  <div className="app__content">
                                    {this.state.isOnState[index] ? (
                                      <StaffDetails
                                        eid={staff.eid}
                                        id={staff.eid}
                                        name={staff.eid}
                                      />
                                    ) : (
                                      ""
                                    )}
                                  </div>
                                </Collapse>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }
                  return null;
                })}
              </div>
            </div>
          </div>
        </div>
      );
    } else if (this.context.appSettings.function === "Area") {
      let userFunction = this.context.appSettings.function;
      return (
        <div>
          <div className="card border-0 mt-4">
            <div className="card-body px-3 pb-0">
              <h5 className="card-title">
                {this.context.user.staffRegion} Leaderboard
              </h5>
              <h6 className="card-subtitle mb-2 text-muted">
                พนักงานในสังกัดเรียงตามคะแนนสะสม แตะเพื่อดูข้อมูลเพิ่มเติม
              </h6>
            </div>
            <div className="card-body p-1">
              <div className="container-fluid p-0">
                {this.context.ranking.areaStaffRanks.map((staff, index) => {
                  if (Object.keys(staff.pmsScore).length >= 1) {
                    let monthAsOfNum = Object.keys(staff.pmsScore)[
                      Object.keys(staff.pmsScore).length - 1
                    ];
                    let monthAsOf = null;
                    if (monthAsOfNum.substr(0, 1) === "1") {
                      monthAsOf =
                        monthDesc[monthAsOfNum.substr(2, 2)] +
                        monthAsOfNum.substr(0, 2);
                    }
                    if (staff.function !== "AM") {
                      let staffProfile =
                        "https://hr.truecorp.co.th/empimg/" +
                        staff.eid +
                        ".jpg";
                      return (
                        <div
                          key={staff.fname}
                          className="card mt-1"
                          style={
                            this.state.isOnState[index]
                              ? { borderColor: "rgba(242, 241, 239, 1)" }
                              : { borderColor: "rgba(242, 241, 239, 0.3)" }
                          }
                          onClick={() => this.toggle(index)}
                        >
                          <div className="card-body p-2 justify-content-center">
                            <div className="row no-gutters">
                              <div className="col-2 align-middle">
                                <img
                                  src={staffProfile}
                                  width="50"
                                  height="50"
                                  className="d-inline-block align-top rounded-circle"
                                  alt=""
                                  onError={this.addDefaultSrc}
                                />
                              </div>
                              <div className="col-5 align-middle">
                                <h6 className="text-dark mb-0">
                                  {staff.fname}
                                </h6>
                                <small className="text-secondary">
                                  {staff.eid.toString().substr(3, 5)} |{" "}
                                  {staff.function}
                                </small>
                              </div>
                              <div className="col-2 text-center">
                                <h6
                                  className="font-weight-bold mb-0"
                                  style={{ color: "rgba(231, 112, 122, 1)" }}
                                >
                                  {staff.pmsScore[monthAsOfNum]}
                                </h6>
                                <small className="text-secondary">
                                  {monthAsOf}
                                </small>
                              </div>
                              <div className="col-2 text-center">
                                <h6
                                  className="font-weight-bold mb-0"
                                  style={{ color: "rgba(111, 192, 122, 1)" }}
                                >
                                  {staff.pmsYTD}
                                </h6>
                                <small className="text-secondary">YTD</small>
                              </div>
                              <div className="col-1 text-center">
                                {this.state.isOnState[index] ? (
                                  <svg class="svg-icon" viewBox="0 0 20 20">
                                    <path d="M13.889,11.611c-0.17,0.17-0.443,0.17-0.612,0l-3.189-3.187l-3.363,3.36c-0.171,0.171-0.441,0.171-0.612,0c-0.172-0.169-0.172-0.443,0-0.611l3.667-3.669c0.17-0.17,0.445-0.172,0.614,0l3.496,3.493C14.058,11.167,14.061,11.443,13.889,11.611 M18.25,10c0,4.558-3.693,8.25-8.25,8.25c-4.557,0-8.25-3.692-8.25-8.25c0-4.557,3.693-8.25,8.25-8.25C14.557,1.75,18.25,5.443,18.25,10 M17.383,10c0-4.07-3.312-7.382-7.383-7.382S2.618,5.93,2.618,10S5.93,17.381,10,17.381S17.383,14.07,17.383,10"></path>
                                  </svg>
                                ) : (
                                  <svg class="svg-icon" viewBox="0 0 20 20">
                                    <path d="M13.962,8.885l-3.736,3.739c-0.086,0.086-0.201,0.13-0.314,0.13S9.686,12.71,9.6,12.624l-3.562-3.56C5.863,8.892,5.863,8.611,6.036,8.438c0.175-0.173,0.454-0.173,0.626,0l3.25,3.247l3.426-3.424c0.173-0.172,0.451-0.172,0.624,0C14.137,8.434,14.137,8.712,13.962,8.885 M18.406,10c0,4.644-3.763,8.406-8.406,8.406S1.594,14.644,1.594,10S5.356,1.594,10,1.594S18.406,5.356,18.406,10 M17.521,10c0-4.148-3.373-7.521-7.521-7.521c-4.148,0-7.521,3.374-7.521,7.521c0,4.147,3.374,7.521,7.521,7.521C14.148,17.521,17.521,14.147,17.521,10"></path>
                                  </svg>
                                )}
                              </div>
                            </div>
                            <div className="row no-gutters">
                              <div className="col-12">
                                <Collapse
                                  isOpen={this.state.isOnState[index]}
                                  className="collapse-css-transition"
                                >
                                  <div className="app__content">
                                    {this.state.isOnState[index] ? (
                                      <StaffDetails
                                        eid={staff.eid}
                                        id={staff.eid}
                                        name={staff.eid}
                                      />
                                    ) : (
                                      ""
                                    )}
                                  </div>
                                </Collapse>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }
                  return null;
                })}
              </div>
            </div>
          </div>
        </div>
      );
    } else {
      return null;
    }
  }
}

StaffRanking.contextType = AppContext;
export default StaffRanking;
