import React, { Component } from "react";
class Loading extends Component {
  render() {
    return (
      <div className="text-center">
        <div className="mt-5">
          <div
            className="spinner-grow text-danger mr-2"
            style={{ width: "2rem", height: "2rem" }}
          />
          <div
            className="spinner-grow text-warning mr-2"
            style={{ width: "3rem", height: "3rem" }}
          />
          <div
            className="spinner-grow text-success"
            style={{ width: "4rem", height: "4rem" }}
          />
        </div>
        <span className="lead text-muted">Loading...</span>
      </div>
    );
  }
}
export default Loading;
