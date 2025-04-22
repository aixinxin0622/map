<template>
  <div class="gradient-bar">
    <div class="gradient-colors" :style="gradientStyle">
      <div class="gradient-labels">
        <div v-for="(item, i) in lables[type]" :key="i">{{ item }}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      type: "",
      colors: {
        temp: [
          "#30123b",
          "#321543",
          "#33184a",
          "#341b51",
          "#351e58",
          "#36215f",
          "#372466",
          "#38276d",
          "#392a73",
          "#3a2d79",
          "#3b2f80",
          "#3c3286",
          "#3d358b",
          "#3e3891",
          "#3f3b97",
          "#3f3e9c",
          "#4040a2",
          "#4143a7",
          "#4146ac",
          "#4249b1",
          "#424bb5",
          "#434eba",
          "#4451bf",
          "#4454c3",
          "#4456c7",
          "#4559cb",
          "#455ccf",
          "#455ed3",
          "#4661d6",
          "#4664da",
          "#4666dd",
          "#4669e0",
          "#466be3",
          "#476ee6",
          "#4771e9",
          "#4773eb",
          "#4776ee",
          "#4778f0",
          "#477bf2",
          "#467df4",
          "#4680f6",
          "#4682f8",
          "#4685fa",
          "#4687fb",
          "#458afc",
          "#458cfd",
          "#448ffe",
          "#4391fe",
          "#4294ff",
          "#4196ff",
          "#4099ff",
          "#3e9bfe",
          "#3d9efe",
          "#3ba0fd",
          "#3aa3fc",
          "#38a5fb",
          "#37a8fa",
          "#35abf8",
          "#33adf7",
          "#31aff5",
          "#2fb2f4",
          "#2eb4f2",
          "#2cb7f0",
          "#2ab9ee",
          "#28bceb",
          "#27bee9",
          "#25c0e7",
          "#23c3e4",
          "#22c5e2",
          "#20c7df",
          "#1fc9dd",
          "#1ecbda",
          "#1ccdd8",
          "#1bd0d5",
          "#1ad2d2",
          "#1ad4d0",
          "#19d5cd",
          "#18d7ca",
          "#18d9c8",
          "#18dbc5",
          "#18ddc2",
          "#18dec0",
          "#18e0bd",
          "#19e2bb",
          "#19e3b9",
          "#1ae4b6",
          "#1ce6b4",
          "#1de7b2",
          "#1fe9af",
          "#20eaac",
          "#22ebaa",
          "#25eca7",
          "#27eea4",
          "#2aefa1",
          "#2cf09e",
          "#2ff19b",
          "#32f298",
          "#35f394",
          "#38f491",
          "#3cf58e",
          "#3ff68a",
          "#43f787",
          "#46f884",
          "#4af880",
          "#4ef97d",
          "#52fa7a",
          "#55fa76",
          "#59fb73",
          "#5dfc6f",
          "#61fc6c",
          "#65fd69",
          "#69fd66",
          "#6dfe62",
          "#71fe5f",
          "#75fe5c",
          "#79fe59",
          "#7dff56",
          "#80ff53",
          "#84ff51",
          "#88ff4e",
          "#8bff4b",
          "#8fff49",
          "#92ff47",
          "#96fe44",
          "#99fe42",
          "#9cfe40",
          "#9ffd3f",
          "#a1fd3d",
          "#a4fc3c",
          "#a7fc3a",
          "#a9fb39",
          "#acfb38",
          "#affa37",
          "#b1f936",
          "#b4f836",
          "#b7f735",
          "#b9f635",
          "#bcf534",
          "#bef434",
          "#c1f334",
          "#c3f134",
          "#c6f034",
          "#c8ef34",
          "#cbed34",
          "#cdec34",
          "#d0ea34",
          "#d2e935",
          "#d4e735",
          "#d7e535",
          "#d9e436",
          "#dbe236",
          "#dde037",
          "#dfdf37",
          "#e1dd37",
          "#e3db38",
          "#e5d938",
          "#e7d739",
          "#e9d539",
          "#ebd339",
          "#ecd13a",
          "#eecf3a",
          "#efcd3a",
          "#f1cb3a",
          "#f2c93a",
          "#f4c73a",
          "#f5c53a",
          "#f6c33a",
          "#f7c13a",
          "#f8be39",
          "#f9bc39",
          "#faba39",
          "#fbb838",
          "#fbb637",
          "#fcb336",
          "#fcb136",
          "#fdae35",
          "#fdac34",
          "#fea933",
          "#fea732",
          "#fea431",
          "#fea130",
          "#fe9e2f",
          "#fe9b2d",
          "#fe992c",
          "#fe962b",
          "#fe932a",
          "#fe9029",
          "#fd8d27",
          "#fd8a26",
          "#fc8725",
          "#fc8423",
          "#fb8122",
          "#fb7e21",
          "#fa7b1f",
          "#f9781e",
          "#f9751d",
          "#f8721c",
          "#f76f1a",
          "#f66c19",
          "#f56918",
          "#f46617",
          "#f36315",
          "#f26014",
          "#f15d13",
          "#f05b12",
          "#ef5811",
          "#ed5510",
          "#ec530f",
          "#eb500e",
          "#ea4e0d",
          "#e84b0c",
          "#e7490c",
          "#e5470b",
          "#e4450a",
          "#e2430a",
          "#e14109",
          "#df3f08",
          "#dd3d08",
          "#dc3b07",
          "#da3907",
          "#d83706",
          "#d63506",
          "#d43305",
          "#d23105",
          "#d02f05",
          "#ce2d04",
          "#cc2b04",
          "#ca2a04",
          "#c82803",
          "#c52603",
          "#c32503",
          "#c12302",
          "#be2102",
          "#bc2002",
          "#b91e02",
          "#b71d02",
          "#b41b01",
          "#b21a01",
          "#af1801",
          "#ac1701",
          "#a91601",
          "#a71401",
          "#a41301",
          "#a11201",
          "#9e1001",
          "#9b0f01",
          "#980e01",
          "#950d01",
          "#920b01",
          "#8e0a01",
          "#8b0902",
          "#880802",
          "#850702",
          "#810602",
          "#7a0403",
        ],
      },
      lables: {
        temp: [],
        salt: [],
        wave: [],
        current: [
          "m/s",
          "0",
          "0.1",
          "0.4",
          "0.6",
          "1.0",
          "1.5",
          "2.0",
          "2.5",
          "3.0",
        ],
        ssp: [
          "m/s",
          "100",
          "200",
          "300",
          "400",
          "500",
          "600",
          "700",
          "800",
          "900",
        ],
        ml_d: [],
        thc_lb: [],
        dscl_lb: [],
        dsca_d: [],
        dsca_c: [],
        thc_d: [], // 声跃层厚度
        thc_ub: [], // 声跃层上边界
        thc_s: [], //
        dscl_ub: [],
        sscl_ub: [],
        sscl_lb: [],
        ssca_d: [],
        sd_cf: [],
        sd_cmax: [],
        sd_d: [],
        hc_j: [],
        hc_cg: [],
        ssca_c: [], // 浅海声道轴声速
        Gm: [],
        Gmz: [],
        Giso: [],
        // "YN": ['hfs', '0', '0.09', '0.18', '0.27', '0.36', '0.45', '0.54', '0.63', '0.72', '0.81', '0.9'],
        DE: [
          "hfs",
          "0",
          "760",
          "1520",
          "2280",
          "3034",
          "3800",
          "4560",
          "5320",
          "6080",
          "6840",
          "7600",
        ],
        CZR: [],
        CZP: [],
        CZW: [],
        CZG: [],
        zone: ["hfs", "0", "10", "15", "20", "25", "30", "35", "40"],
        noise: ["db", "30", "40", "50", "60", "70", "80", "90", "100"],
        speed: [],
        density: [],
      },
    };
  },
  props: {
    fileType: {
      type: String,
      default: "temp",
    },
    listmax: {
      default: "",
    },
    listmin: {
      default: "",
    },
    listdata: {
      default: "",
    },
    sspType: {
      type: String,
      default: "",
    },
    zoneType: {
      type: String,
      default: "",
    },
  },
  computed: {
    gradientStyle() {
      console.log("1111:", this.type, this.fileType);
      let resultArray = this.listdata;
      // console.log(resultArray);
      // 使用 map 方法遍历数组并保留三位小数
      const newArr = resultArray.map((num) => {
        if (typeof num === "number") {
          return parseFloat(num.toFixed(3));
        }
        return num;
      });

      // 输出结果
      console.log(newArr);
      // 设置颜色带 比例值
      this.type === "temp" ? (this.lables.temp = ["℃", ...newArr]) : "";
      this.type === "wave" ? (this.lables.wave = ["m/s", ...newArr]) : "";
      this.type === "density"
        ? (this.lables.density = ["kg/m³", ...newArr])
        : "";
      this.type === "dscl_lb" ? (this.lables.dscl_lb = ["m", ...newArr]) : "";
      this.type === "dsca_d" ? (this.lables.dsca_d = ["m", ...newArr]) : "";
      this.type === "dsca_c" ? (this.lables.dsca_c = ["m/s", ...newArr]) : "";
      this.type === "speed" ? (this.lables.speed = ["m/s", ...newArr]) : "";
      this.type === "salt" ? (this.lables.salt = ["mg/L", ...newArr]) : "";
      this.type === "ml_d" ? (this.lables.ml_d = ["m", ...newArr]) : "";
      this.type === "thc_lb" ? (this.lables.thc_lb = ["m", ...newArr]) : "";
      this.type === "thc_d" ? (this.lables.thc_d = ["m", ...newArr]) : "";
      this.type === "thc_ub" ? (this.lables.thc_ub = ["m", ...newArr]) : "";
      this.type === "thc_s" ? (this.lables.thc_s = ["s-1", ...newArr]) : "";
      this.type === "dscl_ub" ? (this.lables.dscl_ub = ["m", ...newArr]) : "";
      this.type === "sscl_ub" ? (this.lables.sscl_ub = ["m", ...newArr]) : "";
      this.type === "sscl_lb" ? (this.lables.sscl_lb = ["m", ...newArr]) : "";
      this.type === "ssca_d" ? (this.lables.ssca_d = ["m", ...newArr]) : "";
      this.type === "sd_cf" ? (this.lables.sd_cf = ["Hz", ...newArr]) : "";
      this.type === "sd_cmax" ? (this.lables.sd_cmax = ["m/s", ...newArr]) : "";
      this.type === "sd_d" ? (this.lables.sd_d = ["m", ...newArr]) : "";
      this.type === "hc_j" ? (this.lables.hc_j = ["", ...newArr]) : "";
      this.type === "hc_cg" ? (this.lables.hc_cg = ["s-1", ...newArr]) : "";
      this.type === "ssca_c" ? (this.lables.ssca_c = ["m/s", ...newArr]) : "";
      let str = "linear-gradient(to right,";
      for (let i = 0; i < this.colors["temp"].length; i++) {
        if (i === this.colors["temp"].length - 1) {
          str += this.colors["temp"][i];
        } else {
          str += this.colors["temp"][i] + ",";
        }
      }

      str += ")";
      return {
        background: `${str}`,
        // background: `linear-gradient(to right, ${this.colors[this.fileType][0]},  ${this.colors[this.fileType][1]})`
      };
    },
  },
  watch() {},
  mounted() {
    console.log("1111:", this.type, this.fileType);
    if (this.fileType === "ssp") {
      this.type = this.sspType;
    } else if (this.fileType === "zone") {
      this.type = this.zoneType;
    } else {
      this.type = this.fileType;
    }
  },
};
</script>

<style scoped>
.gradient-bar {
  user-select: none;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  /*padding: 4px 5px;*/
  color: #ffe800;
}

.gradient-colors {
  width: calc(100%);
  height: 20px;
  border-radius: 10px;
  /*padding: 4px;*/
}

.gradient-labels {
  display: flex;
  justify-content: space-around;
  color: white;
  font-size: 12px;
  padding: 2px;
}
</style>
