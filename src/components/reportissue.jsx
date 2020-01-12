import React, { Component } from "react";
import firebase from "../firebase";
import AppContext from "../context";

const liff = window.liff;
const db = firebase.firestore();

class ReportIssue extends Component {
  constructor() {
    super();
    this.typing = this.typing.bind(this);
    this.submitIssue = this.submitIssue.bind(this);

    this.state = {
      inputIssue: "",
      inputCategory: "แจ้งปัญหาการใช้งาน",
      complete: false,
      inputContact: "",
      inputEmail: "",
      submitButton: true
    };
  }

  submitIssue(event) {
    event.preventDefault();
    liff.init(data => {
      // add issue to Firebase cloudstore
      db.collection("issues")
        .add({
          linename: this.context.line.displayName,
          userId: this.context.line.userId,
          eid: this.context.user.currentUser,
          shopCode: this.context.user.staffShopCode,
          created: firebase.firestore.Timestamp.fromDate(new Date()),
          issueCat: this.state.inputCategory,
          issueDetail: this.state.inputIssue,
          contactNumber: this.state.inputContact,
          contactEmail: this.state.inputEmail,
          status: "open"
        })
        .then(() => {
          this.setState({
            complete: true
          });
          liff
            .sendMessages([
              {
                type: "flex",
                altText: "Flex Message",
                contents: {
                  type: "bubble",
                  hero: {
                    type: "image",
                    url: "https://pocketkpi1.web.app/images/issue-sm.png",
                    size: "full",
                    aspectMode: "cover",
                    aspectRatio: "9:5"
                  },
                  body: {
                    type: "box",
                    layout: "vertical",
                    spacing: "md",
                    contents: [
                      {
                        type: "text",
                        text: this.state.inputCategory,
                        wrap: true,
                        weight: "bold",
                        gravity: "center",
                        size: "xl"
                      },
                      {
                        type: "box",
                        layout: "baseline",
                        margin: "md",
                        contents: [
                          {
                            type: "text",
                            text:
                              this.context.user.staffName +
                              " (" +
                              this.context.user.currentUser +
                              ")",
                            size: "sm",
                            color: "#999999",
                            margin: "md",
                            flex: 0
                          }
                        ]
                      },
                      {
                        type: "box",
                        layout: "vertical",
                        margin: "lg",
                        spacing: "sm",
                        contents: [
                          {
                            type: "box",
                            layout: "baseline",
                            spacing: "sm",
                            contents: [
                              {
                                type: "text",
                                text: "Date",
                                color: "#aaaaaa",
                                size: "sm",
                                flex: 1
                              },
                              {
                                type: "text",
                                text: Date(),
                                wrap: true,
                                size: "sm",
                                color: "#666666",
                                flex: 4
                              }
                            ]
                          },
                          {
                            type: "box",
                            layout: "baseline",
                            spacing: "sm",
                            contents: [
                              {
                                type: "text",
                                text: "Tel.",
                                color: "#aaaaaa",
                                size: "sm",
                                flex: 1
                              },
                              {
                                type: "text",
                                text: this.state.inputContact,
                                wrap: true,
                                color: "#666666",
                                size: "sm",
                                flex: 4
                              }
                            ]
                          },
                          {
                            type: "box",
                            layout: "baseline",
                            spacing: "sm",
                            contents: [
                              {
                                type: "text",
                                text: "Email",
                                color: "#aaaaaa",
                                size: "sm",
                                flex: 1
                              },
                              {
                                type: "text",
                                text: this.state.inputEmail,
                                wrap: true,
                                color: "#666666",
                                size: "sm",
                                flex: 4
                              }
                            ]
                          },
                          {
                            type: "box",
                            layout: "baseline",
                            spacing: "sm",
                            contents: [
                              {
                                type: "text",
                                text: "Issue",
                                color: "#aaaaaa",
                                size: "sm",
                                flex: 1
                              },
                              {
                                type: "text",
                                text: this.state.inputIssue,
                                wrap: true,
                                color: "#666666",
                                size: "sm",
                                flex: 4
                              }
                            ]
                          }
                        ]
                      }
                    ]
                  }
                }
              }
            ])
            .then(() => {
              liff.closeWindow();
            })
            .catch(err => {
              console.log("error", err);
            });
        })
        .catch(function(error) {
          console.log("Error: ", error);
        });
    });
  }

  typing(event) {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;
    this.setState(
      {
        [name]: value
      },
      () => {
        if (
          this.state.inputIssue.length > 5 &&
          this.state.inputContact.length > 9 &&
          this.state.inputEmail.length >= 4
        )
          this.setState({
            submitButton: false
          });
        else
          this.setState({
            submitButton: true
          });
      }
    );
  }

  render() {
    return (
      <div className="col-10">
        <div className="card border-0 mt-4">
          <div className="card-body px-3">
            {this.state.complete ? (
              <div>
                <h5>
                  {" "}
                  <svg
                    className=""
                    style={{ fill: "rgba(123, 239, 178, 1)" }}
                    viewBox="0 0 20 20"
                  >
                    <path d="M10.219,1.688c-4.471,0-8.094,3.623-8.094,8.094s3.623,8.094,8.094,8.094s8.094-3.623,8.094-8.094S14.689,1.688,10.219,1.688 M10.219,17.022c-3.994,0-7.242-3.247-7.242-7.241c0-3.994,3.248-7.242,7.242-7.242c3.994,0,7.241,3.248,7.241,7.242C17.46,13.775,14.213,17.022,10.219,17.022 M15.099,7.03c-0.167-0.167-0.438-0.167-0.604,0.002L9.062,12.48l-2.269-2.277c-0.166-0.167-0.437-0.167-0.603,0c-0.166,0.166-0.168,0.437-0.002,0.603l2.573,2.578c0.079,0.08,0.188,0.125,0.3,0.125s0.222-0.045,0.303-0.125l5.736-5.751C15.268,7.466,15.265,7.196,15.099,7.03"></path>
                  </svg>{" "}
                  ขอบคุณสำหรับข้อมูล
                  ทีมงานขออนุญาตติดต่อกลับกรณีต้องการข้อมูลเพิ่มเติมครับ
                </h5>
              </div>
            ) : (
              <div>
                <h5 className="card-title">แจ้งปัญหาการใช้งานและข้อเสนอแนะ</h5>
                <form onSubmit={this.submitIssue} className="container">
                  <div className="row">
                    <div className="col-12">
                      <select
                        className="form-control border rounded p-2 mb-1"
                        name="inputCategory"
                        id="inputCategory"
                        value={this.state.inputCategory}
                        onChange={this.typing}
                      >
                        <option value="แจ้งปัญหาการใช้งาน">
                          แจ้งปัญหาการใช้งาน
                        </option>
                        <option value="ข้อเสนอแนะอื่นๆ">ข้อเสนอแนะอื่นๆ</option>
                      </select>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-12">
                      <textarea
                        name="inputIssue"
                        id="inputIssue"
                        value={this.state.inputIssue}
                        onChange={this.typing}
                        className="form-control border rounded p-2 mb-1"
                        rows="5"
                        placeholder="รายละเอียดปัญหาที่พบโดยละเอียด"
                      />
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-12">
                      <input
                        type="text"
                        name="inputContact"
                        id="inputContact"
                        value={this.state.inputContact.trim()}
                        onChange={this.typing}
                        className="form-control border rounded p-2 mb-1"
                        placeholder="หมายเลขติดต่อ"
                      />
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-12">
                      <input
                        type="text"
                        name="inputEmail"
                        id="inputEmail"
                        value={this.state.inputEmail.trim()}
                        onChange={this.typing}
                        className="form-control border rounded p-2 mb-1"
                        placeholder="E-Mail สำหรับแจ้งผล"
                      />
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-12">
                      <input
                        type="submit"
                        value="ส่งข้อมูล"
                        className="small btn btn-danger btn-xl"
                        disabled={this.state.submitButton}
                      />
                    </div>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}
ReportIssue.contextType = AppContext;
export default ReportIssue;
