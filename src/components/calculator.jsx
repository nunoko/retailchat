import React, { Component } from "react";
import firebase from "../firebase";
import imgDie from "./img/die.png";
import imgTMH from "./img/truemoveh.png";
import imgTOL from "./img/trueonline.png";
import imgTVS from "./img/truevisions.png";
import imgTID from "./img/trueid.png";
import imgTMW from "./img/truemoney.png";
import logo from "./img/pkpi.png";
import { Bar } from "react-chartjs-2";
import AppContext from "../context";

const db = firebase.firestore();

const churnTiers = {
  super: 0.15,
  stretch: 0.3,
  target: 1,
  minimum: 1.2,
  base: 1.5
};

const trueidConversionTiers = {
  stretch: 0.95,
  target: 0.8,
  minimum: 0.56,
  base: 0.4
};

const truemoneywalletConversionTiers = {
  stretch: 0.325,
  target: 0.25,
  minimum: 0.175,
  base: 0.125
};

const tmTiers = {
  super: 1,
  stretch: 0.95,
  target: 0.9,
  minimum: 0.85
};

const icsatTiersBMA = {
  super: 0.97,
  stretch: 0.93,
  target: 0.9,
  minimum: 0.85
};

const icsatTiersUPC = {
  super: 0.995,
  stretch: 0.98,
  target: 0.95,
  minimum: 0.9
};

const incentiveRates = {
  rrMulti: 2000
};

const competencyRates = {
  "4": 0.2,
  "3": 0.1,
  "2": 0,
  "1": -0.1,
  "0": -0.2
};

const productivityRates = {
  A: {
    "2": 0.33,
    "1.5": 0.24,
    "1": 0.17,
    "0.5": 0.12,
    "0": 0
  },
  B: {
    "2": 0.27,
    "1.5": 0.19,
    "1": 0.13,
    "0.5": 0.1,
    "0": 0
  },
  C: {
    "2": 0.22,
    "1.5": 0.15,
    "1": 0.1,
    "0.5": 0.08,
    "0": 0
  },
  D: {
    "2": 0.17,
    "1.5": 0.11,
    "1": 0.07,
    "0.5": 0.05,
    "0": 0
  }
};

class Calculator extends Component {
  constructor() {
    super();
    this.state = {
      staffFunction: "rrMulti",
      KPIWeight: {
        rrMulti: {
          revenue: {
            total: 40,
            postpaid: ((23.5 / 100) * 40).toFixed(2),
            prepaid: ((6 / 100) * 40).toFixed(2),
            device: ((23.5 / 100) * 40).toFixed(2),
            tol: ((23.5 / 100) * 40).toFixed(2),
            tvs: ((23.5 / 100) * 40).toFixed(2)
          },
          retention: {
            total: 20,
            postpaid: ((35 / 100) * 20).toFixed(2),
            tol: ((35 / 100) * 20).toFixed(2),
            tvs: ((30 / 100) * 20).toFixed(2)
          },
          digitalPlatform: {
            total: 15,
            trueidConversion: 3.75,
            trueidAccount: 3.75,
            truemoneywalletConversion: 3.75,
            truemoneywalletAccount: 3.75
          },
          tm: {
            total: 5
          },
          icsat: { total: 20 }
        }
      },
      revenuePostpaid: null,
      revenuePrepaid: null,
      revenueDevice: null,
      revenueTOL: null,
      revenueTVS: null,
      retentionPostpaid: null,
      retentionTOL: null,
      retentionTVS: null,
      trueidConversion: null,
      trueidAccount: null,
      truemoneywalletConversion: null,
      truemoneywalletAccount: null,
      tm: null,
      icsat: null,
      knowledgeVerify: false,
      knowledgeSpot: false,
      knowledgeEl: false,
      caseGroup: "A",
      caseYours: null,
      caseAvg: 50,
      KPIScore: {
        revenue: {
          postpaid: 0,
          prepaid: 0,
          device: 0,
          tol: 0,
          tvs: 0
        },
        retention: {
          postpaid: 0,
          tol: 0,
          tvs: 0
        },
        digitalPlatform: {
          trueidConversion: 0,
          trueidAccount: 0,
          truemoneywalletConversion: 0,
          truemoneywalletAccount: 0
        },
        tm: 0,
        icsat: 0,
        total: {
          revenue: 0,
          retention: 0,
          digitalPlatform: 0,
          tm: 0,
          icsat: 0,
          totalKPI: 0,
          totalIncentive: 0
        }
      },
      KPIAchievement: {
        retention: {
          postpaid: 0,
          tol: 0,
          tvs: 0
        },
        digitalPlatform: {
          trueidConversion: 0,
          trueidAccount: 0,
          truemoneywalletConversion: 0,
          truemoneywalletAccount: 0
        },
        tm: 0,
        icsat: 0
      },
      incentive: {
        total: 0,
        basic: 0,
        competency: 0,
        productivity: 0
      },
      competency: {
        total: 0,
        rate: -0.2
      },
      productivity: {
        compare: 0,
        comparePercent: 0,
        rate: 0
      }
    };

    this.typing = this.typing.bind(this);
    this.formIncentive = this.formIncentive.bind(this);
    this.calculate = this.calculate.bind(this);
    this.calScore = this.calScore.bind(this);
    this.randomRevenue = this.randomRevenue.bind(this);
    this.randomRetention = this.randomRetention.bind(this);
    this.randomDigital = this.randomDigital.bind(this);
    this.randomTM = this.randomTM.bind(this);
    this.randomiCSAT = this.randomiCSAT.bind(this);
    this.randomProductivity = this.randomProductivity.bind(this);
    this.randomAll = this.randomAll.bind(this);
  }

  typing(event) {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;
    this.setState({
      [name]: value
    });
    this.calScore(name, value);
  }

  calScore(name, value) {
    const KPIGroup = {
      revenuePostpaid: "revenue",
      revenuePrepaid: "revenue",
      revenueDevice: "revenue",
      revenueTOL: "revenue",
      revenueTVS: "revenue",
      retentionPostpaid: "retention",
      retentionTOL: "retention",
      retentionTVS: "retention",
      trueidConversion: "digitalPlatform",
      trueidAccount: "digitalPlatform",
      truemoneywalletConversion: "digitalPlatform",
      truemoneywalletAccount: "digitalPlatform",
      tm: "tm",
      icsat: "icsat"
    };
    const KPIProduct = {
      revenuePostpaid: "postpaid",
      revenuePrepaid: "prepaid",
      revenueDevice: "device",
      revenueTOL: "tol",
      revenueTVS: "tvs",
      retentionPostpaid: "postpaid",
      retentionTOL: "tol",
      retentionTVS: "tvs",
      trueidConversion: "trueidConversion",
      trueidAccount: "trueidAccount",
      truemoneywalletConversion: "truemoneywalletConversion",
      truemoneywalletAccount: "truemoneywalletAccount",
      tm: "total",
      icsat: "total"
    };
    const KPICalType = {
      revenue: "achievement",
      retention: "churn",
      digitalPlatform: "digital",
      tm: "tm",
      icsat: "icsat"
    };
    let KPIG = KPIGroup[name];
    let KPIP = KPIProduct[name];
    let KPIC = KPICalType[KPIG];

    if (KPIC === "achievement") {
      // calculate from %achievement
      this.state.KPIScore[KPIG][KPIP] = (
        (value / 100) *
        this.state["KPIWeight"][this.state.staffFunction][KPIG][KPIP]
      ).toFixed(2);

      // sum total scores
      let KPIGroupSumMap = this.state.KPIScore[KPIG];
      let KPIGroupSum = 0;
      Object.keys(KPIGroupSumMap).map(function(key, index) {
        KPIGroupSum += Number(KPIGroupSumMap[key]);
        return null;
      });
      this.state.KPIScore["total"][KPIG] = KPIGroupSum.toFixed(2);
    } else if (KPIC === "churn") {
      // calculate from %churn
      let achievement = 0;
      let churnRate = value / 100;
      if (churnRate <= churnTiers["super"]) {
        achievement = 200;
      } else if (churnRate <= churnTiers["stretch"]) {
        achievement =
          130 +
          ((churnTiers["stretch"] - churnRate) * (200 - 130)) /
            (churnTiers["stretch"] - churnTiers["super"]);
      } else if (churnRate <= churnTiers["target"]) {
        achievement =
          100 +
          ((churnTiers["target"] - churnRate) * (130 - 100)) /
            (churnTiers["target"] - churnTiers["stretch"]);
      } else if (churnRate <= churnTiers["minimum"]) {
        achievement =
          70 +
          ((churnTiers["minimum"] - churnRate) * (100 - 70)) /
            (churnTiers["minimum"] - churnTiers["target"]);
      } else if (churnRate <= churnTiers["base"]) {
        achievement =
          50 +
          ((churnTiers["base"] - churnRate) * (70 - 50)) /
            (churnTiers["base"] - churnTiers["minimum"]);
      } else {
        achievement = 0;
      }

      // send achievement value to state
      this.state.KPIAchievement[KPIG][KPIP] = achievement.toFixed(2);

      // calculate score from %achievement
      this.state.KPIScore[KPIG][KPIP] = (
        (achievement / 100) *
        this.state["KPIWeight"][this.state.staffFunction][KPIG][KPIP]
      ).toFixed(2);

      // sum total scores
      let KPIGroupSumMap = this.state.KPIScore[KPIG];
      let KPIGroupSum = 0;
      Object.keys(KPIGroupSumMap).map(function(key, index) {
        KPIGroupSum += Number(KPIGroupSumMap[key]);
        return null;
      });
      this.state.KPIScore["total"][KPIG] = KPIGroupSum.toFixed(2);
    } else if (KPIC === "digital") {
      // calculate from %conversion
      let achievement = 0;
      let kpi = value / 100;

      if (KPIP === "trueidConversion") {
        if (kpi >= trueidConversionTiers["stretch"]) {
          achievement = 130;
        } else if (kpi >= trueidConversionTiers["target"]) {
          achievement =
            100 +
            ((kpi - trueidConversionTiers["target"]) * (130 - 100)) /
              (trueidConversionTiers["stretch"] -
                trueidConversionTiers["target"]);
        } else if (kpi >= trueidConversionTiers["minimum"]) {
          achievement =
            70 +
            ((kpi - trueidConversionTiers["minimum"]) * (100 - 70)) /
              (trueidConversionTiers["target"] -
                trueidConversionTiers["minimum"]);
        } else if (kpi >= trueidConversionTiers["base"]) {
          achievement =
            50 +
            ((kpi - trueidConversionTiers["base"]) * (70 - 50)) /
              (trueidConversionTiers["minimum"] -
                trueidConversionTiers["base"]);
        } else {
          achievement = 0;
        }
      } else if (KPIP === "trueidAccount") {
        achievement = kpi * 100;
      } else if (KPIP === "truemoneywalletConversion") {
        if (kpi >= truemoneywalletConversionTiers["stretch"]) {
          achievement = 130;
        } else if (kpi >= truemoneywalletConversionTiers["target"]) {
          achievement =
            100 +
            ((kpi - truemoneywalletConversionTiers["target"]) * (130 - 100)) /
              (truemoneywalletConversionTiers["stretch"] -
                truemoneywalletConversionTiers["target"]);
        } else if (kpi >= truemoneywalletConversionTiers["minimum"]) {
          achievement =
            70 +
            ((kpi - truemoneywalletConversionTiers["minimum"]) * (100 - 70)) /
              (truemoneywalletConversionTiers["target"] -
                truemoneywalletConversionTiers["minimum"]);
        } else if (kpi >= truemoneywalletConversionTiers["base"]) {
          achievement =
            50 +
            ((kpi - truemoneywalletConversionTiers["base"]) * (70 - 50)) /
              (truemoneywalletConversionTiers["minimum"] -
                truemoneywalletConversionTiers["base"]);
        } else {
          achievement = 0;
        }
      } else if (KPIP === "truemoneywalletAccount") {
        achievement = kpi * 100;
      }

      // send achievement value to state
      this.state.KPIAchievement[KPIG][KPIP] = achievement.toFixed(2);

      // calculate score from %achievement
      this.state.KPIScore[KPIG][KPIP] = (
        (achievement / 100) *
        this.state["KPIWeight"][this.state.staffFunction][KPIG][KPIP]
      ).toFixed(2);

      // sum total scores
      let KPIGroupSumMap = this.state.KPIScore[KPIG];
      let KPIGroupSum = 0;
      Object.keys(KPIGroupSumMap).map(function(key, index) {
        KPIGroupSum += Number(KPIGroupSumMap[key]);
        return null;
      });
      this.state.KPIScore["total"][KPIG] = KPIGroupSum.toFixed(2);
    } else if (KPIC === "tm") {
      // calculate from %tm
      let achievement = 0;
      let tmScore = value / 100;
      if (tmScore >= tmTiers["super"]) {
        achievement = 100;
      } else if (tmScore >= tmTiers["stretch"]) {
        achievement =
          90 +
          ((tmScore - tmTiers["stretch"]) * (100 - 90)) /
            (tmTiers["super"] - tmTiers["stretch"]);
      } else if (tmScore >= tmTiers["target"]) {
        achievement =
          80 +
          ((tmScore - tmTiers["target"]) * (90 - 80)) /
            (tmTiers["stretch"] - tmTiers["target"]);
      } else if (tmScore >= tmTiers["minimum"]) {
        achievement =
          70 +
          ((tmScore - tmTiers["minimum"]) * (80 - 70)) /
            (tmTiers["target"] - tmTiers["minimum"]);
      } else {
        achievement = 0;
      }

      // send achievement value to state
      this.state.KPIAchievement[KPIG] = achievement.toFixed(2);

      // calculate score from %achievement
      this.state.KPIScore[KPIG] = (
        (achievement / 100) *
        this.state["KPIWeight"][this.state.staffFunction][KPIG][KPIP]
      ).toFixed(2);

      this.state.KPIScore["total"][KPIG] = this.state.KPIScore[KPIG];
    } else if (KPIC === "icsat") {
      // calculate from %icsat
      let achievement = 0;
      let icsatScore = value / 100;
      let icsatTiers = null;
      this.context.user.staffDistrict === "BMA"
        ? (icsatTiers = icsatTiersBMA)
        : (icsatTiers = icsatTiersUPC);
      if (icsatScore >= icsatTiers["super"]) {
        achievement = 200;
      } else if (icsatScore >= icsatTiers["stretch"]) {
        achievement =
          130 +
          ((icsatScore - icsatTiers["stretch"]) * (200 - 130)) /
            (icsatTiers["super"] - icsatTiers["stretch"]);
      } else if (icsatScore >= icsatTiers["target"]) {
        achievement =
          100 +
          ((icsatScore - icsatTiers["target"]) * (130 - 100)) /
            (icsatTiers["stretch"] - icsatTiers["target"]);
      } else if (icsatScore >= icsatTiers["minimum"]) {
        achievement =
          70 +
          ((icsatScore - icsatTiers["minimum"]) * (100 - 70)) /
            (icsatTiers["target"] - icsatTiers["minimum"]);
      } else {
        achievement = 0 + (icsatScore * (70 - 0)) / icsatTiers["target"];
      }

      // send achievement value to state
      this.state.KPIAchievement[KPIG] = achievement.toFixed(2);

      // calculate score from %achievement
      this.state.KPIScore[KPIG] = (
        (achievement / 100) *
        this.state["KPIWeight"][this.state.staffFunction][KPIG][KPIP]
      ).toFixed(2);

      this.state.KPIScore["total"][KPIG] = this.state.KPIScore[KPIG];
    }

    // sum total KPI
    this.state.KPIScore.total.totalKPI = 0;
    let totalKPIGroup = this.state.KPIScore.total;
    let totalKPISum = 0;
    Object.keys(totalKPIGroup).map(function(key, index) {
      if (key !== "totalKPI" && key !== "totalIncentive")
        totalKPISum += Number(totalKPIGroup[key]);
      return null;
    });
    this.state.KPIScore.total.totalKPI = totalKPISum.toFixed(2);

    // calculate incentive
    this.state.KPIScore.total.totalIncentive = (
      ((Number(this.state.KPIScore.total.digitalPlatform) +
        Number(this.state.KPIScore.total.tm) +
        Number(this.state.KPIScore.total.icsat)) /
        40) *
      100
    ).toFixed(2);
    this.state.incentive.basic = this.calIncentiveBasic().toFixed(0);
    this.state.incentive.competency = this.calIncentiveCompetency().toFixed(0);
    this.state.incentive.productivity = this.calIncentiveProductivity().toFixed(
      0
    );
    this.state.incentive.total =
      Number(this.state.incentive.basic) +
      Number(this.state.incentive.competency) +
      Number(this.state.incentive.productivity);

    // display the resulting scores
    this.setState({
      KPIScore: {
        revenue: {
          postpaid: this.state.KPIScore.revenue.postpaid,
          prepaid: this.state.KPIScore.revenue.prepaid,
          device: this.state.KPIScore.revenue.device,
          tol: this.state.KPIScore.revenue.tol,
          tvs: this.state.KPIScore.revenue.tvs
        },
        retention: {
          postpaid: this.state.KPIScore.retention.postpaid,
          tol: this.state.KPIScore.retention.tol,
          tvs: this.state.KPIScore.retention.tvs
        },
        digitalPlatform: {
          trueidConversion: this.state.KPIScore.digitalPlatform
            .trueidConversion,
          trueidAccount: this.state.KPIScore.digitalPlatform.trueidAccount,
          truemoneywalletConversion: this.state.KPIScore.digitalPlatform
            .truemoneywalletConversion,
          truemoneywalletAccount: this.state.KPIScore.digitalPlatform
            .truemoneywalletAccount
        },
        tm: this.state.KPIScore.tm,
        icsat: this.state.KPIScore.icsat,
        total: {
          revenue: this.state.KPIScore.total.revenue,
          retention: this.state.KPIScore.total.retention,
          digitalPlatform: this.state.KPIScore.total.digitalPlatform,
          tm: this.state.KPIScore.total.tm,
          icsat: this.state.KPIScore.total.icsat,
          totalKPI: this.state.KPIScore.total.totalKPI,
          totalIncentive: this.state.KPIScore.total.totalIncentive
        }
      },
      KPIAchievement: {
        retention: {
          postpaid: this.state.KPIAchievement.retention.postpaid,
          tol: this.state.KPIAchievement.retention.tol,
          tvs: this.state.KPIAchievement.retention.tvs
        },
        digitalPlatform: {
          trueidConversion: this.state.KPIAchievement.digitalPlatform
            .trueidConversion,
          truemoneywalletConversion: this.state.KPIAchievement.digitalPlatform
            .truemoneywalletConversion,
          trueidAccount: this.state.KPIAchievement.digitalPlatform
            .trueidAccount,
          truemoneywalletAccount: this.state.KPIAchievement.digitalPlatform
            .truemoneywalletAccount
        },
        tm: this.state.KPIAchievement.tm,
        icsat: this.state.KPIAchievement.icsat
      },
      incentive: {
        total: this.state.incentive.total,
        basic: this.state.incentive.basic,
        competency: this.state.incentive.competency,
        productivity: this.state.incentive.productivity
      }
    });
    // end of calScore function
  }

  formIncentive(event) {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;
    this.setState({
      [name]: value
    });

    target.type === "checkbox"
      ? this.calCompetencyScore(name, value)
      : this.calProductivityScore(name, value);
  }

  calCompetencyScore(name, value) {
    const competencyTypes = {
      knowledgeVerify: "verify",
      knowledgeSpot: "spot",
      knowledgeEl: "el"
    };
    let competencyType = competencyTypes[name];

    if (competencyType === "verify" && value) {
      this.state.competency.total += 2;
    } else if (competencyType === "verify" && !value) {
      this.state.competency.total -= 2;
    } else if (
      (competencyType === "spot" || competencyType === "el") &&
      value
    ) {
      this.state.competency.total += 1;
    } else if (
      (competencyType === "spot" || competencyType === "el") &&
      !value
    ) {
      this.state.competency.total -= 1;
    }

    // get competency pay rate to be used to calculate incentive
    this.state.competency.rate = competencyRates[this.state.competency.total];

    this.state.incentive.basic = this.calIncentiveBasic().toFixed(0);
    this.state.incentive.competency = this.calIncentiveCompetency().toFixed(0);
    this.state.incentive.productivity = this.calIncentiveProductivity().toFixed(
      0
    );
    this.state.incentive.total =
      Number(this.state.incentive.basic) +
      Number(this.state.incentive.competency) +
      Number(this.state.incentive.productivity);

    this.setState({
      competency: {
        total: this.state.competency.total,
        rate: this.state.competency.rate
      },
      incentive: {
        total: this.state.incentive.total,
        basic: this.state.incentive.basic,
        competency: this.state.incentive.competency,
        productivity: this.state.incentive.productivity
      },
      productivity: {
        compare: this.state.productivity.compare,
        comparePercent: this.state.productivity.comparePercent,
        rate: this.state.productivity.rate
      }
    });
  }

  calProductivityScore(name, value) {
    let skip = true;
    let caseCompare = 0;
    if (name === "caseYours") {
      caseCompare = value / this.state.caseAvg;
      skip = false;
    } else if (name === "caseGroup" && this.state.caseYours !== null) {
      caseCompare = value / this.state.caseAvg;
      skip = false;
    } else skip = true;

    if (!skip) {
      if (caseCompare >= 2) this.state.productivity.compare = 2;
      else if (caseCompare >= 1.5) this.state.productivity.compare = 1.5;
      else if (caseCompare >= 1) this.state.productivity.compare = 1;
      else if (caseCompare >= 0.5) this.state.productivity.compare = 0.5;
      else this.state.productivity.compare = 0;

      this.state.productivity.rate =
        productivityRates[this.state.caseGroup][
          this.state.productivity.compare
        ];
      this.state.productivity.comparePercent = caseCompare;
      this.state.incentive.basic = this.calIncentiveBasic().toFixed(0);
      this.state.incentive.competency = this.calIncentiveCompetency().toFixed(
        0
      );
      this.state.incentive.productivity = this.calIncentiveProductivity().toFixed(
        0
      );
      this.state.incentive.total =
        Number(this.state.incentive.basic) +
        Number(this.state.incentive.competency) +
        Number(this.state.incentive.productivity);

      this.setState({
        competency: {
          total: this.state.competency.total,
          rate: this.state.competency.rate
        },
        incentive: {
          total: this.state.incentive.total,
          basic: this.state.incentive.basic,
          competency: this.state.incentive.competency,
          productivity: this.state.incentive.productivity
        },
        productivity: {
          compare: this.state.productivity.compare,
          comparePercent: this.state.productivity.comparePercent,
          rate: this.state.productivity.rate
        }
      });
    }
  }

  calculate(event) {
    event.preventDefault();
  }

  randomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
  }

  randomAll() {
    this.randomRevenue();
    this.randomRetention();
    this.randomDigital();
    this.randomTM();
    this.randomiCSAT();
    this.randomProductivity();
  }

  randomRevenue() {
    let max = 200; //define max %achievement for each KPI
    this.state.revenuePostpaid = this.randomInt(max);
    this.state.revenuePrepaid = this.randomInt(max);
    this.state.revenueDevice = this.randomInt(max);
    this.state.revenueTOL = this.randomInt(max);
    this.state.revenueTVS = this.randomInt(max);

    this.calScore("revenuePostpaid", this.state.revenuePostpaid);
    this.calScore("revenuePrepaid", this.state.revenuePrepaid);
    this.calScore("revenueDevice", this.state.revenueDevice);
    this.calScore("revenueTOL", this.state.revenueTOL);
    this.calScore("revenueTVS", this.state.revenueTVS);

    this.setState({
      revenuePostpaid: this.state.revenuePostpaid,
      revenuePrepaid: this.state.revenuePrepaid,
      revenueDevice: this.state.revenueDevice,
      revenueTOL: this.state.revenueTOL,
      revenueTVS: this.state.revenueTVS
    });
  }

  randomRetention() {
    let max = 200; //define max %achievement for each KPI
    this.state.retentionPostpaid = this.randomInt(max);
    this.state.retentionTOL = this.randomInt(max);
    this.state.retentionTVS = this.randomInt(max);

    this.calScore("retentionPostpaid", this.state.retentionPostpaid);
    this.calScore("retentionTOL", this.state.retentionTOL);
    this.calScore("retentionTVS", this.state.retentionTVS);

    this.setState({
      retentionPostpaid: this.state.retentionPostpaid,
      retentionTOL: this.state.retentionTOL,
      retentionTVS: this.state.retentionTVS
    });
  }

  randomDigital() {
    let max = 130; //define max %achievement for each KPI
    this.state.trueidConversion = this.randomInt(100);
    this.state.trueidAccount = this.randomInt(max);
    this.state.truemoneywalletConversion = this.randomInt(100);
    this.state.truemoneywalletAccount = this.randomInt(max);

    this.calScore("trueidConversion", this.state.trueidConversion);
    this.calScore("trueidAccount", this.state.trueidAccount);
    this.calScore(
      "truemoneywalletConversion",
      this.state.truemoneywalletConversion
    );
    this.calScore("truemoneywalletAccount", this.state.truemoneywalletAccount);

    this.setState({
      trueidConversion: this.state.trueidConversion,
      trueidAccount: this.state.trueidAccount,
      truemoneywalletConversion: this.state.truemoneywalletConversion,
      truemoneywalletAccount: this.state.truemoneywalletAccount
    });
  }

  randomTM() {
    let max = 100; //define max %tm for each KPI
    this.state.tm = this.randomInt(max);

    this.calScore("tm", this.state.tm);

    this.setState({
      tm: this.state.tm
    });
  }

  randomiCSAT() {
    let max = 100; //define max %topbox for each KPI
    this.state.icsat = this.randomInt(max);

    this.calScore("icsat", this.state.icsat);

    this.setState({
      icsat: this.state.icsat
    });
  }

  randomProductivity() {
    let max = 100; //define max %topbox for each KPI
    this.state.caseYours = this.randomInt(max);

    this.calProductivityScore("caseYours", this.state.caseYours);

    this.setState({
      caseYours: this.state.caseYours
    });
  }

  calIncentiveBasic() {
    let incentiveRate = Number(incentiveRates[this.state.staffFunction]);
    let totalKPIIncentiveAch = this.state.KPIScore.total.totalIncentive / 100;

    if (totalKPIIncentiveAch < 0.5) {
      return 0;
    } else if (totalKPIIncentiveAch < 0.7) {
      return (totalKPIIncentiveAch * incentiveRate) / 2;
    } else {
      return totalKPIIncentiveAch * incentiveRate;
    }
  }

  calIncentiveCompetency() {
    return this.state.incentive.basic * this.state.competency.rate;
  }

  calIncentiveProductivity() {
    return this.state.incentive.basic * this.state.productivity.rate;
  }

  formatNumber(num) {
    return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
  }

  componentDidMount() {
    this.logActivity("calculator");
  }

  logActivity(activity) {
    // log user activity to Firebase cloudstore
    db.collection("logs")
      .add({
        userId: this.context.line.userId,
        eid: this.context.user.currentUser,
        function: this.context.user.staffFunction,
        shopCode: this.context.user.staffShopCode,
        created: firebase.firestore.Timestamp.fromDate(new Date()),
        activity: activity
      })
      .then(function() {})
      .catch(function(error) {
        console.log("Error: ", error);
      });
  }

  render() {
    let KPIScoreData = [
      this.state.KPIScore.total.revenue,
      this.state.KPIScore.total.retention,
      this.state.KPIScore.total.digitalPlatform,
      this.state.KPIScore.total.tm,
      this.state.KPIScore.total.icsat
    ];
    let KPIWeightData = [
      this.state["KPIWeight"][this.state.staffFunction]["revenue"]["total"] -
        this.state.KPIScore.total.revenue,
      this.state["KPIWeight"][this.state.staffFunction]["retention"]["total"] -
        this.state.KPIScore.total.retention,
      this.state["KPIWeight"][this.state.staffFunction]["digitalPlatform"][
        "total"
      ] - this.state.KPIScore.total.digitalPlatform,
      this.state["KPIWeight"][this.state.staffFunction]["tm"]["total"] -
        this.state.KPIScore.total.tm,
      this.state["KPIWeight"][this.state.staffFunction]["icsat"]["total"] -
        this.state.KPIScore.total.icsat
    ];
    Object.keys(KPIWeightData).map(function(key, index) {
      if (KPIWeightData[key] < 0) KPIWeightData[key] = 0;
      return null;
    });
    let chartData = {
      labels: ["Revenue", "Retention", "Digital Platform", "TM", "iCSAT"],
      datasets: [
        {
          label: "KPI Score",
          data: KPIScoreData,
          borderWidth: 0,
          backgroundColor: "#dc3545"
        },
        {
          label: "KPI Gap",
          data: KPIWeightData,
          borderColor: "rgba(191, 191, 191, 0.5)",
          borderWidth: 0,
          backgroundColor: "rgba(191, 191, 191, 0.5)"
        }
      ]
    };

    const chartOptions = {
      maintainAspectRatio: true,
      legend: {
        display: false
      },
      scales: {
        yAxes: [
          {
            display: false,
            stacked: true
          }
        ],
        xAxes: [
          {
            gridLines: {
              display: false
            },
            stacked: true
          }
        ]
      },
      tooltips: {
        mode: "index",
        intersect: false,
        backgroundColor: "rgba(228, 233, 237, 0.9)",
        borderColor: "rgba(228, 233, 237, 1)",
        bodyFontColor: "#333",
        titleFontColor: "#333"
      }
    };

    // check which KPI calculator to display
    if (
      this.context.appSettings.function === "Management" ||
      this.context.appSettings.function === "RM" ||
      this.context.appSettings.function === "RR" ||
      this.context.appSettings.function === "Area"
    ) {
      return (
        <form onSubmit={this.calculate} className="">
          <div className="container m-0 p-0 pt-2 fixed-top bg-white shadow-sm">
            <div className="row justify-content-between no-gutters">
              <div className="card col-2 border-0">
                <div className="card-body p-0 text-center text-nowrap">
                  <h6 className="text-center">
                    <small className="text-secondary">RR Multi</small>
                  </h6>
                </div>
              </div>
              <div className="card col-3 border-0">
                <div className="card-body p-0 text-center">
                  <h5 className="m-0">
                    <span className=" badge-pill badge-success">
                      {this.formatNumber(this.state.incentive.total)}
                    </span>
                  </h5>
                  <small className="m-0">Incentive</small>
                </div>
              </div>
              <div className="card col-3 border-0">
                <div className="card-body p-0 text-center">
                  <h5 className="m-0">
                    <span className=" badge-pill badge-success">
                      {this.state.KPIScore.total.totalIncentive}
                    </span>
                  </h5>
                  <small className="m-0">KPI Incentive</small>
                </div>
              </div>
              <div className="card col-3 border-0">
                <div className="card-body p-0 text-center">
                  <h5 className="m-0">
                    <span className=" badge-pill badge-success">
                      {this.state.KPIScore.total.totalKPI}
                    </span>
                  </h5>
                  <small className="m-0">PMS</small>
                </div>
              </div>
            </div>
          </div>

          <div style={{ height: 55 }} />
          <h3 className="lead text-center mt-2">
            <img
              src={logo}
              width="35"
              height="35"
              className="rounded-circle"
              alt=""
            />{" "}
            pocket KPI Calculator
          </h3>
          <p>
            <small>
              เวอร์ชั่นปัจจุบันรองรับเฉพาะระบบคำนวณ KPI ของตำแหน่ง RR Multi
              และจะมีการพัฒนาเพิ่มขึ้นอีกในอนาคต
            </small>
          </p>

          {/* ------------ KPI CARD START ------------ */}
          <div className="card border-0 mb-4">
            <div className="card-body px-2">
              <h5 className="card-title">
                KPI Summary{" "}
                <img
                  src={imgDie}
                  width="20"
                  height="20"
                  alt="random"
                  className="d-inline-block align-middle"
                  onClick={this.randomAll}
                />
              </h5>

              <div className="mt-3">
                คะแนนเต็ม{" "}
                <span className="h4">
                  <span className="lead font-weight-bold text-light badge badge-danger">
                    100
                  </span>
                </span>{" "}
                ทำได้{" "}
                <span className="h4">
                  <span className="lead font-weight-bold text-light badge badge-danger">
                    {this.state.KPIScore.total.totalKPI}
                  </span>
                </span>
                <div className="mt-5">
                  <Bar data={chartData} options={chartOptions} />
                </div>
              </div>
            </div>
          </div>
          {/* ------------ KPI CARD END ------------ */}

          {/* ------------ KPI CARD START ------------ */}
          <div className="card border-0 mb-4">
            <div className="card-body px-2">
              <h5 className="card-title">
                Sales Revenue{" "}
                <img
                  src={imgDie}
                  width="20"
                  height="20"
                  alt="random"
                  className="d-inline-block align-middle"
                  onClick={this.randomRevenue}
                />
              </h5>
              <h6 className="card-subtitle my-3 text-muted font-weight-light">
                กรอกข้อมูล %Revenue Achievement (0-200%) คำนวณจาก Revenue Actual
                ÷ Revenue Target
              </h6>

              <div className="form-group row mx-0 p-0 mb-1 mt-2">
                <small className="col-4 p-0 text-center font-weight-bold text-danger">
                  Product
                </small>
                <small className="col-2 p-0 text-center font-weight-bold text-danger">
                  Weight
                </small>
                <small className="col-2 p-0 text-center font-weight-bold text-danger" />
                <small className="col-2 p-0 text-center font-weight-bold text-danger">
                  %Ach
                </small>
                <small className="col-2 p-0 text-center font-weight-bold text-danger">
                  Score
                </small>
              </div>

              {/*start of product row*/}
              <div className="form-group row mx-0 p-0 mb-1">
                <div className="col-1 px-0 text-center">
                  <img src={imgTMH} height="25" alt="" />
                </div>
                <label
                  htmlFor="revenuePostpaid"
                  className="col-form-label col-3 mx-0 px-1 d-inline-block text-truncate"
                >
                  Postpaid
                </label>
                <span className="col-2 pt-2 px-0 text-center">
                  {this.state.KPIWeight.rrMulti.revenue.postpaid}%
                </span>
                <span className="col-2" />
                <div className="col-2 px-1">
                  <input
                    type="text"
                    name="revenuePostpaid"
                    id="revenuePostpaid"
                    value={this.state.revenuePostpaid}
                    onChange={this.typing}
                    className="form-control border rounded px-1"
                    placeholder=""
                  />
                </div>
                <span className="col-2 pt-2 px-0 text-center">
                  {this.state.KPIScore.revenue.postpaid}
                </span>
              </div>
              {/*end of product row*/}

              {/*start of product row*/}
              <div className="form-group row mx-0 p-0 mb-1">
                <div className="col-1 px-0 text-center">
                  <img src={imgTMH} height="25" alt="" />
                </div>
                <label
                  htmlFor="revenuePrepaid"
                  className="col-form-label col-3 mx-0 px-1 d-inline-block text-truncate"
                >
                  Prepaid
                </label>
                <span className="col-2 pt-2 px-0 text-center">
                  {this.state.KPIWeight.rrMulti.revenue.prepaid}%
                </span>
                <span className="col-2" />
                <div className="col-2 px-1">
                  <input
                    type="text"
                    name="revenuePrepaid"
                    id="revenuePrepaid"
                    value={this.state.revenuePrepaid}
                    onChange={this.typing}
                    className="form-control border rounded px-1"
                    placeholder=""
                  />
                </div>
                <span className="col-2 pt-2 px-0 text-center">
                  {this.state.KPIScore.revenue.prepaid}
                </span>
              </div>
              {/*end of product row*/}

              {/*start of product row*/}
              <div className="form-group row mx-0 p-0 mb-1">
                <div className="col-1 px-0 text-center">
                  <img src={imgTMH} height="25" alt="" />
                </div>
                <label
                  htmlFor="revenueDevice"
                  className="col-form-label col-3 mx-0 px-1 d-inline-block text-truncate"
                >
                  Device
                </label>
                <span className="col-2 pt-2 px-0 text-center">
                  {this.state.KPIWeight.rrMulti.revenue.device}%
                </span>
                <span className="col-2" />
                <div className="col-2 px-1">
                  <input
                    type="text"
                    name="revenueDevice"
                    id="revenueDevice"
                    value={this.state.revenueDevice}
                    onChange={this.typing}
                    className="form-control border rounded px-1"
                    placeholder=""
                  />
                </div>
                <span className="col-2 pt-2 px-0 text-center">
                  {this.state.KPIScore.revenue.device}
                </span>
              </div>
              {/*end of product row*/}

              {/*start of product row*/}
              <div className="form-group row mx-0 p-0 mb-1">
                <div className="col-1 px-0 text-center">
                  <img src={imgTOL} height="25" alt="" />
                </div>
                <label
                  htmlFor="revenueTOL"
                  className="col-form-label col-3 mx-0 px-1 d-inline-block text-truncate"
                >
                  TOL
                </label>
                <span className="col-2 pt-2 px-0 text-center">
                  {this.state.KPIWeight.rrMulti.revenue.tol}%
                </span>
                <span className="col-2" />
                <div className="col-2 px-1">
                  <input
                    type="text"
                    name="revenueTOL"
                    id="revenueTOL"
                    value={this.state.revenueTOL}
                    onChange={this.typing}
                    className="form-control border rounded px-1"
                    placeholder=""
                  />
                </div>
                <span className="col-2 pt-2 px-0 text-center">
                  {this.state.KPIScore.revenue.tol}
                </span>
              </div>
              {/*end of product row*/}

              {/*start of product row*/}
              <div className="form-group row mx-0 p-0 mb-1">
                <div className="col-1 px-0 text-center">
                  <img src={imgTVS} height="25" alt="" />
                </div>
                <label
                  htmlFor="revenueTVS"
                  className="col-form-label col-3 mx-0 px-1 d-inline-block text-truncate"
                >
                  TVS
                </label>
                <span className="col-2 pt-2 px-0 text-center">
                  {this.state.KPIWeight.rrMulti.revenue.tvs}%
                </span>
                <span className="col-2" />
                <div className="col-2 px-1">
                  <input
                    type="text"
                    name="revenueTVS"
                    id="revenueTVS"
                    value={this.state.revenueTVS}
                    onChange={this.typing}
                    className="form-control border rounded px-1"
                    placeholder=""
                  />
                </div>
                <span className="col-2 pt-2 px-0 text-center">
                  {this.state.KPIScore.revenue.tvs}
                </span>
              </div>
              {/*end of product row*/}

              <div className="mt-3">
                คะแนนเต็ม{" "}
                <span className="h4">
                  <span className="lead font-weight-bold text-light badge badge-danger">
                    {this.state.KPIWeight.rrMulti.revenue.total}
                  </span>
                </span>{" "}
                ทำได้{" "}
                <span className="h4">
                  <span className="lead font-weight-bold text-light badge badge-danger">
                    {this.state.KPIScore.total.revenue}
                  </span>
                </span>
              </div>
            </div>
          </div>
          {/* ------------ KPI CARD END ------------ */}

          {/* ------------ KPI CARD START ------------ */}
          <div className="card border-0 mb-4">
            <div className="card-body  px-1">
              <h5 className="card-title">
                Retention{" "}
                <img
                  src={imgDie}
                  width="20"
                  height="20"
                  alt="random"
                  className="d-inline-block align-middle"
                  onClick={this.randomRetention}
                />{" "}
              </h5>
              <h6 className="card-subtitle my-3 text-muted font-weight-light">
                กรอกข้อมูล %ChurnCap คำนวณจาก Actual Churn ÷ Churn Cap Target
              </h6>

              <div className="form-group row mx-0 p-0 mb-1 mt-2">
                <small className="col-4 p-0 text-center font-weight-bold text-danger">
                  Product
                </small>
                <small className="col-2 p-0 text-center font-weight-bold text-danger">
                  Weight
                </small>
                <small className="col-2 p-0 text-center font-weight-bold text-danger">
                  %Churn
                </small>
                <small className="col-2 p-0 text-center font-weight-bold text-danger">
                  %Ach
                </small>
                <small className="col-2 p-0 text-center font-weight-bold text-danger">
                  Score
                </small>
              </div>

              {/*start of product row*/}
              <div className="form-group row mx-0 p-0 mb-1">
                <div className="col-1 px-0 text-center">
                  <img src={imgTMH} height="25" alt="" />
                </div>
                <label
                  htmlFor="retentionPostpaid"
                  className="col-form-label col-3 mx-0 px-1 d-inline-block text-truncate"
                >
                  Postpaid
                </label>
                <span className="col-2 pt-2 px-0 text-center">
                  {this.state.KPIWeight.rrMulti.retention.postpaid}%
                </span>
                <div className="col-2 px-1">
                  <input
                    type="text"
                    name="retentionPostpaid"
                    id="retentionPostpaid"
                    value={this.state.retentionPostpaid}
                    onChange={this.typing}
                    className="form-control border rounded px-1"
                    placeholder=""
                  />
                </div>
                <span className="col-2 pt-2 px-0 text-center">
                  {this.state.KPIAchievement.retention.postpaid}
                </span>
                <span className="col-2 pt-2 px-0 text-center">
                  {this.state.KPIScore.retention.postpaid}
                </span>
              </div>
              {/*end of product row*/}

              {/*start of product row*/}
              <div className="form-group row mx-0 p-0 mb-1">
                <div className="col-1 px-0 text-center">
                  <img src={imgTOL} height="25" alt="" />
                </div>
                <label
                  htmlFor="retentionTOL"
                  className="col-form-label col-3 mx-0 px-1 d-inline-block text-truncate"
                >
                  TOL
                </label>
                <span className="col-2 pt-2 px-0 text-center">
                  {this.state.KPIWeight.rrMulti.retention.tol}%
                </span>
                <div className="col-2 px-1">
                  <input
                    type="text"
                    name="retentionTOL"
                    id="retentionTOL"
                    value={this.state.retentionTOL}
                    onChange={this.typing}
                    className="form-control border rounded px-1"
                    placeholder=""
                  />
                </div>
                <span className="col-2 pt-2 px-0 text-center">
                  {this.state.KPIAchievement.retention.tol}
                </span>
                <span className="col-2 pt-2 px-0 text-center">
                  {this.state.KPIScore.retention.tol}
                </span>
              </div>
              {/*end of product row*/}

              {/*start of product row*/}
              <div className="form-group row mx-0 p-0 mb-1">
                <div className="col-1 px-0 text-center">
                  <img src={imgTVS} height="25" alt="" />
                </div>
                <label
                  htmlFor="retentionTVS"
                  className="col-form-label col-3 mx-0 px-1 d-inline-block text-truncate"
                >
                  TVS
                </label>
                <span className="col-2 pt-2 px-0 text-center">
                  {this.state.KPIWeight.rrMulti.retention.tvs}%
                </span>
                <div className="col-2 px-1">
                  <input
                    type="text"
                    name="retentionTVS"
                    id="retentionTVS"
                    value={this.state.retentionTVS}
                    onChange={this.typing}
                    className="form-control border rounded px-1"
                    placeholder=""
                  />
                </div>
                <span className="col-2 pt-2 px-0 text-center">
                  {this.state.KPIAchievement.retention.tvs}
                </span>
                <span className="col-2 pt-2 px-0 text-center">
                  {this.state.KPIScore.retention.tvs}
                </span>
              </div>
              {/*end of product row*/}

              <div className="mt-3">
                คะแนนเต็ม{" "}
                <span className="h4">
                  <span className="lead font-weight-bold text-light badge badge-danger">
                    {this.state.KPIWeight.rrMulti.retention.total}
                  </span>
                </span>{" "}
                ทำได้{" "}
                <span className="h4">
                  <span className="lead font-weight-bold text-light badge badge-danger">
                    {this.state.KPIScore.total.retention}
                  </span>
                </span>
              </div>
            </div>
          </div>
          {/* ------------ KPI CARD END ------------ */}

          {/* ------------ KPI CARD START ------------ */}
          <div className="card border-0 mb-4">
            <div className="card-body px-2">
              <h5 className="card-title">
                Digital Platform{" "}
                <img
                  src={imgDie}
                  width="20"
                  height="20"
                  alt="random"
                  className="d-inline-block align-middle"
                  onClick={this.randomDigital}
                />{" "}
              </h5>
              <h6 className="card-subtitle my-3 text-muted font-weight-light">
                กรอกข้อมูล %Conversion คำนวณจาก ยอดApp ÷ ยอดขายPostและPre
              </h6>

              <div className="form-group row mx-0 p-0 mb-1 mt-2">
                <small className="col-4 p-0 text-center font-weight-bold text-danger">
                  Product
                </small>
                <small className="col-2 p-0 text-center font-weight-bold text-danger">
                  Weight
                </small>
                <small className="col-2 p-0 text-center font-weight-bold text-danger">
                  %Convert
                </small>
                <small className="col-2 p-0 text-center font-weight-bold text-danger">
                  %Ach
                </small>
                <small className="col-2 p-0 text-center font-weight-bold text-danger">
                  Score
                </small>
              </div>

              {/*start of product row*/}
              <div className="form-group row mx-0 p-0 mb-1">
                <div className="col-1 px-0 text-center">
                  <img src={imgTID} height="25" alt="" />
                </div>
                <label
                  htmlFor="trueidConversion"
                  className="col-form-label col-3 mx-0 px-1 d-inline-block text-truncate"
                >
                  Conversion
                </label>
                <span className="col-2 pt-2 px-0 text-center">
                  {
                    this.state.KPIWeight.rrMulti.digitalPlatform
                      .trueidConversion
                  }
                  %
                </span>
                <div className="col-2 px-1">
                  <input
                    type="text"
                    name="trueidConversion"
                    id="trueidConversion"
                    value={this.state.trueidConversion}
                    onChange={this.typing}
                    className="form-control border rounded px-1"
                    placeholder=""
                  />
                </div>
                <span className="col-2 pt-2 px-0 text-center">
                  {this.state.KPIAchievement.digitalPlatform.trueidConversion}
                </span>
                <span className="col-2 pt-2 px-0 text-center">
                  {this.state.KPIScore.digitalPlatform.trueidConversion}
                </span>
              </div>
              {/*end of product row*/}

              {/*start of product row*/}
              <div className="form-group row mx-0 p-0 mb-1">
                <div className="col-1 px-0 text-center">
                  <img src={imgTMW} height="25" alt="" />
                </div>
                <label
                  htmlFor="truemoneywalletConversion"
                  className="col-form-label col-3 mx-0 px-1 d-inline-block text-truncate"
                >
                  Conversion
                </label>
                <span className="col-2 pt-2 px-0 text-center">
                  {
                    this.state.KPIWeight.rrMulti.digitalPlatform
                      .truemoneywalletConversion
                  }
                  %
                </span>
                <div className="col-2 px-1">
                  <input
                    type="text"
                    name="truemoneywalletConversion"
                    id="truemoneywalletConversion"
                    value={this.state.truemoneywalletConversion}
                    onChange={this.typing}
                    className="form-control border rounded px-1"
                    placeholder=""
                  />
                </div>
                <span className="col-2 pt-2 px-0 text-center">
                  {
                    this.state.KPIAchievement.digitalPlatform
                      .truemoneywalletConversion
                  }
                </span>
                <span className="col-2 pt-2 px-0 text-center">
                  {
                    this.state.KPIScore.digitalPlatform
                      .truemoneywalletConversion
                  }
                </span>
              </div>
              {/*end of product row*/}

              <h6 className="card-subtitle my-3 text-muted font-weight-light">
                กรอกข้อมูล %Achievement Account คำนวณจาก ยอดApp ÷ เป้าที่กำหนด
              </h6>
              <div className="form-group row mx-0 p-0 mb-1 mt-2">
                <small className="col-4 p-0 text-center font-weight-bold text-danger">
                  Product
                </small>
                <small className="col-2 p-0 text-center font-weight-bold text-danger">
                  Weight
                </small>
                <small className="col-2 p-0 text-center font-weight-bold text-danger" />
                <small className="col-2 p-0 text-center font-weight-bold text-danger">
                  %Ach
                </small>
                <small className="col-2 p-0 text-center font-weight-bold text-danger">
                  Score
                </small>
              </div>

              {/*start of product row*/}
              <div className="form-group row mx-0 p-0 mb-1">
                <div className="col-1 px-0 text-center">
                  <img src={imgTID} height="25" alt="" />
                </div>
                <label
                  htmlFor="trueidAccount"
                  className="col-form-label col-3 mx-0 px-1 d-inline-block text-truncate"
                >
                  Account
                </label>
                <span className="col-2 pt-2 px-0 text-center">
                  {this.state.KPIWeight.rrMulti.digitalPlatform.trueidAccount}%
                </span>
                <span className="col-2" />
                <div className="col-2 px-1">
                  <input
                    type="text"
                    name="trueidAccount"
                    id="trueidAccount"
                    value={this.state.trueidAccount}
                    onChange={this.typing}
                    className="form-control border rounded px-1"
                    placeholder=""
                  />
                </div>
                <span className="col-2 pt-2 px-0 text-center">
                  {this.state.KPIScore.digitalPlatform.trueidAccount}
                </span>
              </div>
              {/*end of product row*/}

              {/*start of product row*/}
              <div className="form-group row mx-0 p-0 mb-1">
                <div className="col-1 px-0 text-center">
                  <img src={imgTMW} height="25" alt="" />
                </div>
                <label
                  htmlFor="truemoneywalletAccount"
                  className="col-form-label col-3 mx-0 px-1 d-inline-block text-truncate"
                >
                  Account
                </label>
                <span className="col-2 pt-2 px-0 text-center">
                  {
                    this.state.KPIWeight.rrMulti.digitalPlatform
                      .truemoneywalletAccount
                  }
                  %
                </span>
                <span className="col-2" />
                <div className="col-2 px-1">
                  <input
                    type="text"
                    name="truemoneywalletAccount"
                    id="truemoneywalletAccount"
                    value={this.state.truemoneywalletAccount}
                    onChange={this.typing}
                    className="form-control border rounded px-1"
                    placeholder=""
                  />
                </div>
                <span className="col-2 pt-2 px-0 text-center">
                  {this.state.KPIScore.digitalPlatform.truemoneywalletAccount}
                </span>
              </div>
              {/*end of product row*/}

              <div className="mt-3">
                คะแนนเต็ม{" "}
                <span className="h4">
                  <span className="lead font-weight-bold text-light badge badge-danger">
                    {this.state.KPIWeight.rrMulti.digitalPlatform.total}
                  </span>
                </span>{" "}
                ทำได้{" "}
                <span className="h4">
                  <span className="lead font-weight-bold text-light badge badge-danger">
                    {this.state.KPIScore.total.digitalPlatform}
                  </span>
                </span>
              </div>
            </div>
          </div>
          {/* ------------ KPI CARD END ------------ */}

          {/* ------------ KPI CARD START ------------ */}
          <div className="card border-0 mb-4">
            <div className="card-body px-2">
              <h5 className="card-title">
                Transaction Monitoring{" "}
                <img
                  src={imgDie}
                  width="20"
                  height="20"
                  alt="random"
                  className="d-inline-block align-middle"
                  onClick={this.randomTM}
                />{" "}
              </h5>
              <h6 className="card-subtitle my-3 text-muted font-weight-light">
                กรอกคะแนน TM (0-100%)
              </h6>

              <div className="form-group row mx-0 p-0 mb-1 mt-2">
                <small className="col-4 p-0 text-center font-weight-bold text-danger">
                  KPI
                </small>
                <small className="col-2 p-0 text-center font-weight-bold text-danger">
                  Weight
                </small>
                <small className="col-2 p-0 text-center font-weight-bold text-danger">
                  %TM
                </small>
                <small className="col-2 p-0 text-center font-weight-bold text-danger">
                  %Ach
                </small>
                <small className="col-2 p-0 text-center font-weight-bold text-danger">
                  Score
                </small>
              </div>

              {/*start of product row*/}
              <div className="form-group row mx-0 p-0 mb-1">
                <label
                  htmlFor="tm"
                  className="col-form-label col-4 mx-0 px-1 d-inline-block text-truncate"
                >
                  TM
                </label>
                <span className="col-2 pt-2 px-0 text-center">
                  {this.state.KPIWeight.rrMulti.tm.total}%
                </span>
                <div className="col-2 px-1">
                  <input
                    type="text"
                    name="tm"
                    id="tm"
                    value={this.state.tm}
                    onChange={this.typing}
                    className="form-control border rounded px-1"
                    placeholder=""
                  />
                </div>
                <span className="col-2 pt-2 px-0 text-center">
                  {this.state.KPIAchievement.tm}
                </span>
                <span className="col-2 pt-2 px-0 text-center">
                  {this.state.KPIScore.tm}
                </span>
              </div>
              {/*end of product row*/}

              <div className="mt-3">
                คะแนนเต็ม{" "}
                <span className="h4">
                  <span className="lead font-weight-bold text-light badge badge-danger">
                    {this.state.KPIWeight.rrMulti.tm.total}
                  </span>
                </span>{" "}
                ทำได้{" "}
                <span className="h4">
                  <span className="lead font-weight-bold text-light badge badge-danger">
                    {this.state.KPIScore.total.tm}
                  </span>
                </span>
              </div>
            </div>
          </div>
          {/* ------------ KPI CARD END ------------ */}

          {/* ------------ KPI CARD START ------------ */}
          <div className="card border-0 mb-4">
            <div className="card-body px-2">
              <h5 className="card-title">
                iCSAT{" "}
                <img
                  src={imgDie}
                  width="20"
                  height="20"
                  alt="random"
                  className="d-inline-block align-middle"
                  onClick={this.randomiCSAT}
                />{" "}
              </h5>
              <h6 className="card-subtitle my-3 text-muted font-weight-light">
                กรอกคะแนน iCSAT %TopBox (0-100%)
              </h6>

              <div className="form-group row mx-0 p-0 mb-1 mt-2">
                <small className="col-4 p-0 text-center font-weight-bold text-danger">
                  KPI
                </small>
                <small className="col-2 p-0 text-center font-weight-bold text-danger">
                  Weight
                </small>
                <small className="col-2 p-0 text-center font-weight-bold text-danger">
                  %TopBox
                </small>
                <small className="col-2 p-0 text-center font-weight-bold text-danger">
                  %Ach
                </small>
                <small className="col-2 p-0 text-center font-weight-bold text-danger">
                  Score
                </small>
              </div>

              {/*start of product row*/}
              <div className="form-group row mx-0 p-0 mb-1">
                <label
                  htmlFor="icsat"
                  className="col-form-label col-4 mx-0 px-1 d-inline-block text-truncate"
                >
                  iCSAT
                </label>
                <span className="col-2 pt-2 px-0 text-center">
                  {this.state.KPIWeight.rrMulti.icsat.total}%
                </span>
                <div className="col-2 px-1">
                  <input
                    type="text"
                    name="icsat"
                    id="icsat"
                    value={this.state.icsat}
                    onChange={this.typing}
                    className="form-control border rounded px-1"
                    placeholder=""
                  />
                </div>
                <span className="col-2 pt-2 px-0 text-center">
                  {this.state.KPIAchievement.icsat}
                </span>
                <span className="col-2 pt-2 px-0 text-center">
                  {this.state.KPIScore.icsat}
                </span>
              </div>
              {/*end of product row*/}

              <div className="mt-3">
                คะแนนเต็ม{" "}
                <span className="h4">
                  <span className="lead font-weight-bold text-light badge badge-danger">
                    {this.state.KPIWeight.rrMulti.icsat.total}
                  </span>
                </span>{" "}
                ทำได้{" "}
                <span className="h4">
                  <span className="lead font-weight-bold text-light badge badge-danger">
                    {this.state.KPIScore.total.icsat}
                  </span>
                </span>
              </div>
            </div>
          </div>
          {/* ------------ KPI CARD END ------------ */}

          {/* ------------ KPI CARD START ------------ */}
          <div className="card border-0 mb-4">
            <div className="card-body px-2">
              <h5 className="card-title">Knowledge</h5>
              <h6 className="card-subtitle my-3 text-muted font-weight-light">
                เลือกประเภทการสอบที่ผ่าน
              </h6>

              {/*start of product row*/}
              <div className="form-group row mx-0 p-0 mb-1">
                <div className="custom-control custom-switch">
                  <input
                    type="checkbox"
                    className="custom-control-input"
                    id="knowledgeVerify"
                    name="knowledgeVerify"
                    checked={this.state.knowledgeVerify}
                    onChange={this.formIncentive}
                  />
                  <label className="custom-control-label" for="knowledgeVerify">
                    Verify Skill{" "}
                    {this.state.knowledgeVerify ? (
                      <span className="badge badge-success">+2pt</span>
                    ) : (
                      ""
                    )}
                  </label>
                </div>
              </div>
              {/*end of product row*/}
              <div className="form-group row mx-0 p-0 mb-1">
                <div className="custom-control custom-switch">
                  <input
                    type="checkbox"
                    className="custom-control-input"
                    id="knowledgeSpot"
                    name="knowledgeSpot"
                    checked={this.state.knowledgeSpot}
                    onChange={this.formIncentive}
                  />
                  <label className="custom-control-label" for="knowledgeSpot">
                    Spot Test{" "}
                    {this.state.knowledgeSpot ? (
                      <span className="badge badge-success">+1pt</span>
                    ) : (
                      ""
                    )}
                  </label>
                </div>
              </div>
              {/*end of product row*/}
              <div className="form-group row mx-0 p-0 mb-1">
                <div className="custom-control custom-switch">
                  <input
                    type="checkbox"
                    className="custom-control-input"
                    id="knowledgeEl"
                    name="knowledgeEl"
                    checked={this.state.knowledgeEl}
                    onChange={this.formIncentive}
                  />
                  <label className="custom-control-label" for="knowledgeEl">
                    E-Learning{" "}
                    {this.state.knowledgeEl ? (
                      <span className="badge badge-success">+1pt</span>
                    ) : (
                      ""
                    )}
                  </label>
                </div>
              </div>
              {/*end of product row*/}

              <div className="mt-3">
                ทำคะแนน Competency ได้{" "}
                <span className="h4">
                  <span className="lead font-weight-bold text-light badge badge-danger">
                    {this.state.competency.total}
                  </span>
                </span>{" "}
                ได้ Incentive เพิ่ม/ลด{" "}
                <span className="h4">
                  <span className="lead font-weight-bold text-light badge badge-danger">
                    {this.state.competency.rate * 100}%
                  </span>
                </span>
              </div>
            </div>
          </div>
          {/* ------------ KPI CARD END ------------ */}

          {/* ------------ KPI CARD START ------------ */}
          <div className="card border-0 mb-4">
            <div className="card-body px-2">
              <h5 className="card-title">
                Productivity{" "}
                <img
                  src={imgDie}
                  width="20"
                  height="20"
                  alt="random"
                  className="d-inline-block align-middle"
                  onClick={this.randomProductivity}
                />{" "}
              </h5>
              <h6 className="card-subtitle my-3 text-muted font-weight-light">
                กรอกจำนวน On-time Case ที่รับ
              </h6>

              <div className="form-group row mx-0 p-0 mb-1 mt-2">
                <small className="col-3 p-0 text-center font-weight-bold text-danger">
                  Group
                </small>
                <small className="col-3 p-0 text-center font-weight-bold text-danger">
                  On-time Cases
                </small>
                <small className="col-3 p-0 text-center font-weight-bold text-danger">
                  Shop Avg.
                </small>
              </div>

              {/*start of product row*/}
              <div className="form-group row mx-0 p-0 mb-1 text-center">
                <div className="col-3">
                  <select
                    className="form-control"
                    value={this.state.caseGroup}
                    onChange={this.formIncentive}
                    readOnly
                  >
                    <option value="A">A</option>
                    <option value="B">B</option>
                    <option value="C">C</option>
                    <option value="D">D</option>
                  </select>
                </div>
                <div className="col-3 px-1">
                  <input
                    type="text"
                    name="caseYours"
                    id="caseYours"
                    value={this.state.caseYours}
                    onChange={this.formIncentive}
                    className="form-control border rounded px-1"
                    placeholder=""
                  />
                </div>
                <div className="col-3 px-1">
                  <input
                    type="text"
                    name="caseAvg"
                    id="caseAvg"
                    value={this.state.caseAvg}
                    onChange={this.formIncentive}
                    className="form-control border rounded px-1 form-control-plaintext"
                    placeholder=""
                    readOnly
                  />
                </div>
              </div>
              {/*end of product row*/}

              <div className="mt-3">
                %เคสเทียบค่าเฉลี่ย{" "}
                <span className="h4">
                  <span className="lead font-weight-bold text-light badge badge-danger">
                    {Math.round(this.state.productivity.comparePercent * 100)}%
                  </span>
                </span>{" "}
                ได้ Incentive เพิ่ม{" "}
                <span className="h4">
                  <span className="lead font-weight-bold text-light badge badge-danger">
                    {this.state.productivity.rate * 100}%
                  </span>
                </span>
              </div>
            </div>
          </div>
          {/* ------------ KPI CARD END ------------ */}

          {/* ------------ KPI CARD START ------------ */}
          <div className="card border-0 mb-4">
            <div className="card-body px-2">
              <h5 className="card-title">KPI Incentive</h5>
              <h6 className="card-subtitle my-3 text-muted font-weight-light">
                ค่าตอบแทน KPI Incentive คำนวณจาก KPI Digital Paltform, TM, iCSAT
                รวมกับ Competency และ Productivity Pay
              </h6>
              <div className="row">
                <div className="col-4">Basic:</div>
                <div className="col-4">
                  ({this.state.KPIScore.total.totalIncentive}% x{" "}
                  {this.formatNumber(
                    Number(incentiveRates[this.state.staffFunction])
                  )}
                  {this.state.KPIScore.total.totalIncentive / 100 < 0.7 &&
                  this.state.KPIScore.total.totalIncentive / 100 >= 0.5
                    ? " ÷ 2"
                    : ""}
                  {this.state.KPIScore.total.totalIncentive / 100 < 0.5 &&
                  this.state.KPIScore.total.totalIncentive / 100 > 0
                    ? " x 0"
                    : ""}
                  )
                </div>
                <div className="col-4">
                  {this.formatNumber(this.state.incentive.basic)} THB
                </div>
              </div>
              <div className="row">
                <div className="col-4">Competency:</div>
                <div className="col-4">
                  ({this.formatNumber(this.state.incentive.basic)} x{" "}
                  {this.state.competency.rate * 100}%)
                </div>
                <div className="col-4">
                  {this.formatNumber(this.state.incentive.competency)} THB
                </div>
              </div>
              <div className="row">
                <div className="col-4">Productivity:</div>
                <div className="col-4">
                  ({this.formatNumber(this.state.incentive.basic)} x{" "}
                  {this.state.productivity.rate * 100}%)
                </div>
                <div className="col-4">
                  {this.formatNumber(this.state.incentive.productivity)} THB
                </div>
              </div>
              <div className="row">
                <div className="col-4">Total:</div>
                <div className="col-4" />
                <div className="col-4">
                  {this.formatNumber(this.state.incentive.total)} THB
                </div>
              </div>
            </div>
          </div>
          {/* ------------ KPI CARD END ------------ */}

          <div style={{ height: 80 }} />
        </form>
      );
    } else {
      return <div>Calculator RR</div>;
    }
  }
}
Calculator.contextType = AppContext;
export default Calculator;
