import React, { Component } from "react";
import firebase from "../firebase";
import AppContext from "../context";

const liff = window.liff;
const db = firebase.firestore();

class NobodyIssue extends Component {
  constructor() {
    super();
    this.typing = this.typing.bind(this);
    this.submitIssue = this.submitIssue.bind(this);

    this.state = {
      inputIssue: "",
      inputCategory: "แจ้งปัญหาการใช้งาน",
      inputContact: "",
      inputID: "",
      inputName: "",
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
          eid: this.state.inputID,
          name: this.state.inputName,
          created: firebase.firestore.Timestamp.fromDate(new Date()),
          issueCat: this.state.inputCategory,
          issueDetail: this.state.inputIssue,
          contactNumber: this.state.inputContact,
          contactEmail: this.state.inputEmail,
          status: "open"
        })
        .then(() => {
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
                              this.state.inputName +
                              " (" +
                              this.state.inputID +
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
          this.state.inputID.length === 8 &&
          this.state.inputName.length >= 5 &&
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
      <div className="col-11">
        <div className="card border-0 m-0">
          <div className="card-body px-3">
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
                      rows="2"
                      placeholder="รายละเอียดปัญหาที่พบโดยละเอียด กรณีที่เข้าระบบไม่ได้กรุณาแจ้งข้อมูลที่กรอกเข้าระบบด้วย"
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="col-12">
                    <input
                      type="text"
                      name="inputID"
                      id="inputID"
                      value={this.state.inputID.trim()}
                      onChange={this.typing}
                      className="form-control border rounded p-2 mb-1"
                      placeholder="รหัสพนักงาน"
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="col-12">
                    <input
                      type="text"
                      name="inputName"
                      id="inputName"
                      value={this.state.inputName.trim()}
                      onChange={this.typing}
                      className="form-control border rounded p-2 mb-1"
                      placeholder="ชื่อ - นามสกุล"
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
          </div>
        </div>
      </div>
    );
  }
}
NobodyIssue.contextType = AppContext;
export default NobodyIssue;
