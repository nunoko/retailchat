import React, { Component } from "react";
import AppContext from "../context";
import imgPin from "./img/pin.png";

class User extends Component {
  addDefaultSrc(ev) {
    ev.target.src = "https://pocketkpi1.web.app/images/user.png";
  }
  render() {
    return (
      <nav className="container">
        <div className="row">
          <span className="col-2">
            <img
              src={this.context.user.staffProfile}
              width="50"
              height="50"
              className="rounded-circle"
              alt=""
              onError={this.addDefaultSrc}
            />
          </span>
          <div className="col-10 pl-3">
            <span className="lead font-weight-bold row">
              {this.context.user.staffName}
            </span>
            <small className="text-muted row">
              <img
                src={imgPin}
                width="15"
                height="15"
                className="d-inline-block align-text-bottom"
                alt=""
              />
              {this.context.user.currentUser.toString().substr(3, 5)} |{" "}
              {this.context.user.staffFunction} |{" "}
              {this.context.appSettings.function === "Area"
                ? this.context.user.staffRegion
                : this.context.user.staffShop}
            </small>
          </div>
        </div>
      </nav>
    );
  }
}
User.contextType = AppContext;
export default User;
