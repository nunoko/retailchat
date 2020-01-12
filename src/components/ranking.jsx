import React, { Component } from "react";
import AppContext from "../context";
import imgMan from "./img/man.png";

class Ranking extends Component {
  state = {};
  render() {
    let rankingShopShow = null;
    let rankingRegionShow = null;
    if (this.context.appSettings.function === "RR") {
      rankingShopShow = (
        <div className="col-3 text-center">
          <h2 className="text-dark font-weight-bold p-0">
            <span className="">
              <small className="text-muted" style={{ fontSize: "16px" }}>
                #
              </small>
              {this.context.ranking.rankShop}
            </span>
          </h2>
          <h6 className="pb-0 mb-0">
            <small className=" badge-pill badge-light">
              <img
                src={imgMan}
                width="10"
                height="10"
                className="d-inline-block align-text-middle"
                alt=""
              />{" "}
              {this.context.ranking.shopCount}
            </small>
          </h6>
          <small className="p-0 m-0">{this.context.user.staffShop}</small>
        </div>
      );
    }
    if (
      this.context.appSettings.function === "Management" ||
      this.context.appSettings.function === "RM" ||
      this.context.appSettings.function === "RR"
    ) {
      rankingRegionShow = (
        <div className="col-3 text-center">
          <h2 className="text-dark font-weight-bold p-0">
            <span className="">
              <small className="text-muted" style={{ fontSize: "16px" }}>
                #
              </small>
              {this.context.ranking.rankRegion}
            </span>
          </h2>
          <h6 className="pb-0 mb-0">
            <small className=" badge-pill badge-light">
              <img
                src={imgMan}
                width="10"
                height="10"
                className="d-inline-block align-text-middle"
                alt=""
              />{" "}
              {this.context.ranking.regionCount}
            </small>
          </h6>
          <small className="p-0 m-0">{this.context.user.staffRegion}</small>
        </div>
      );
    }
    return (
      <div className="card border-0 mt-0">
        <div className="card-body px-3">
          <h5 className="card-title">
            {this.context.user.staffFunction} Ranking
          </h5>
          <h6 className="card-subtitle mb-2 text-muted">
            ลำดับคะแนนเทียบกับพนักงานตำแหน่งเดียวกัน
          </h6>
          <div className="container px-0 mx-0">
            <div className="row justify-content-between no-gutters mx-0">
              {rankingShopShow}
              {rankingRegionShow}
              <div className="col-3 text-center">
                <h2 className="text-dark font-weight-bold p-0">
                  <span className="">
                    <small className="text-muted" style={{ fontSize: "16px" }}>
                      #
                    </small>
                    {this.context.ranking.rankDistrict}
                  </span>
                </h2>
                <h6 className="pb-0 mb-0">
                  <small className=" badge-pill badge-light">
                    <img
                      src={imgMan}
                      width="10"
                      height="10"
                      className="d-inline-block align-text-middle"
                      alt=""
                    />{" "}
                    {this.context.ranking.districtCount}
                  </small>
                </h6>
                <small className="p-0 m-0">
                  {this.context.user.staffDistrict}
                </small>
              </div>
              <div className="col-3 text-center">
                <h2 className="text-dark font-weight-bold p-0">
                  <span className="">
                    <small className="text-muted" style={{ fontSize: "16px" }}>
                      #
                    </small>
                    {this.context.ranking.rankNationwide}
                  </span>
                </h2>
                <h6 className="pb-0 mb-0">
                  <small className=" badge-pill badge-light">
                    <img
                      src={imgMan}
                      width="10"
                      height="10"
                      className="d-inline-block align-text-middle"
                      alt=""
                    />{" "}
                    {this.context.ranking.nationCount}
                  </small>
                </h6>
                <small className="p-0 m-0">Nationwide</small>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
Ranking.contextType = AppContext;
export default Ranking;
