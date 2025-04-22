<script setup lang="ts">
import axios from 'axios';
import '../utils/leaflet-heat';
import 'leaflet-rotatedmarker';
import '../utils/leaflet.canvas-markers';
import '@/utils/pulse/L.Icon.Pulse.js';
import '@/utils/pulse/L.Icon.Pulse.css';
import svgs from '../assets/img/hxqx.svg';

import typhoonIcon from '../assets/img/typhoon.gif';

const offsetLengthZoomMap = {
  // 地图缩放等级对应关系
  1: 19,
  2: 18,
  3: 17,
  4: 16,
  5: 15,
  6: 14,
  7: 13,
  8: 12,
  9: 11,
  10: 10,
  11: 9,
  12: 8 + 1.5,
  13: 7 + 1,
  14: 6 + 0.5,
  15: 5,
  16: 4,
  17: 3,
  18: 2,
  19: 1 + 0.5
};
const map = ref<L.Map>(); //地图对象
const markerLayer = ref<L.canvasIconLayer>(); //marker图层
const typhoonLayer = ref<L.FeatureGroup>(); // 台风图层
const typhoonGifLayer = ref<L.FeatureGroup>(); // 动态台风圈图层
const flashingPointLayer = ref<L.FeatureGroup>(); // 闪烁点图层
const markPointLayer = ref<L.FeatureGroup>(); // 标记点图层

const radioValue: any = ref(null);
const typhoonBox: any = ref(false); // 台风操作框
const typhoonList: any = ref([]); // 台风名称列表
const typhoonYear = ref(null); // 台风年份
const typhoonName: any = ref(''); // 台风名称

const buttonList = reactive([
  {
    label: '台风',
    value: 1
  },
  {
    label: '闪烁点',
    value: 2
  }
  // {
  //   label: '标记点',
  //   value: 3
  // }
]);
const lnglat = reactive([
  {
    lnglat: [20.818, 109.472],
    name: '北部湾东北部沿岸'
  },
  {
    lnglat: [21.45, 108.7],
    name: '北部湾西北部沿岸'
  },
  {
    lnglat: [40.47, 121.1],
    name: '渤海北部沿岸'
  },
  {
    lnglat: [38.1, 120.85],
    name: '渤海海峡中南部沿岸'
  },
  {
    lnglat: [38, 119.633],
    name: '渤海南部沿岸'
  }
]);

// 初始化地图
const initMap = () => {
  map.value = L.map('map', {
    crs: L.CRS.EPSG3857,
    attributionControl: false,
    center: [30.339694848974272, 120.97045898437501],
    minZoom: 3,
    maxZoom: 18,
    zoom: 8,
    zoomControl: false,
    doubleClickZoom: false
  });
  const url = 'http://t{s}.tianditu.gov.cn/DataServer?x={x}&y={y}&l={z}';
  const subdomains = ['0', '1', '2', '3', '4', '5', '6', '7'];
  L.tileLayer(`${url}&T=vec_w&tk=5a0b14f38b73d08668496bdd51375af2`, {
    subdomains: subdomains
  }).addTo(map.value);
  // L.Tooltip.prototype._animateZoom = function (e: any) {
  //   if (!this._map) {
  //     return;
  //   }
  //   let pos = this._map._latLngToNewLayerPoint(this._latlng, e.zoom, e.center);
  //   this._setPosition(pos);
  // };

  // L.Tooltip.prototype._updatePosition = function () {
  //   if (!this._map) {
  //     return;
  //   }
  //   let pos = this._map.latLngToLayerPoint(this._latlng);
  //   this._setPosition(pos);
  // };

  markerLayer.value = L.canvasIconLayer().addTo(map.value);
  typhoonGifLayer.value = L.featureGroup().addTo(map.value);
  typhoonLayer.value = L.featureGroup().addTo(map.value);
  flashingPointLayer.value = L.featureGroup().addTo(map.value);
  markPointLayer.value = L.featureGroup().addTo(map.value);

  map.value.on('click', function (e: any) {
    console.log('click', e.latlng);
  });
  map.value.on('zoomend', function (e: any) {
    console.log('zoomend', e.target.getZoom());
  });
};

const radioChange = (data: any) => {
  clear();
  if (data.label == '台风') {
    dateChange();
    typhoonBox.value = true;
  }
  if (data.label == '闪烁点') {
    let zoom = map.value.getZoom();
    lnglat.forEach((item: any) => {
      const marker = L.marker([item.lnglat[0], item.lnglat[1]], {
        icon: L.icon.pulse({
          iconSize: [10, 10],
          color: '#23d96e',
          fillColor: '#23d96e',
          heartbeat: 0.8,
          animate: true
        })
      });
      marker.bindPopup(item.name);
      marker.addTo(flashingPointLayer.value);
    });
  }
};
// 台风日期改变
const dateChange = () => {
  clear();
  axios.get(`https://typhoon.slt.zj.gov.cn/Api/TyphoonList/${typhoonYear.value}`, {}).then((res) => {
    console.log('日期', res.data);
    typhoonList.value = res.data.map((item: any) => {
      return {
        label: item.name,
        value: item.tfid
      };
    });
  });
};
// 台风名字改变
const nameChange = () => {
  clear();
  axios.get(`https://typhoon.slt.zj.gov.cn/Api/TyphoonInfo/${typhoonName.value}`, {}).then((res) => {
    console.log('台风', res.data);
    typhoonTrajectory(res.data);
  });
};
// 台风路径
const typhoonTrajectory = (data: any) => {
  L.Typhoon = L.Polygon.extend({
    initialize: function (
      t: L.LatLngLiteral | L.LatLngTuple | [number, number, number] | { lat: number; lng: number; alt?: number | undefined },
      e: any,
      i: any
    ) {
      L.Polygon.prototype.initialize.call(this, e), (this._latlng = L.latLng(t)), (this._circle = e), (this._style = i);
    },
    options: { fill: !0 },
    projectLatlngs: function () {
      try {
        var e = this._latlng;
        this._point = this._map.latLngToLayerPoint(e);
        var t_northeast = this._getLngRadius(this._getLatRadius(this._circle.ne * 1000)),
          i_northeast = this._map.latLngToLayerPoint([e.lat, e.lng - t_northeast]);
        this._radius_northeast = Math.max(this._point.x - i_northeast.x, 1);
        var t_southeast = this._getLngRadius(this._getLatRadius(this._circle.se * 1000)),
          i_southeast = this._map.latLngToLayerPoint([e.lat, e.lng - t_southeast]);
        this._radius_southeast = Math.max(this._point.x - i_southeast.x, 1);
        var t_southwest = this._getLngRadius(this._getLatRadius(this._circle.sw * 1000)),
          i_southwest = this._map.latLngToLayerPoint([e.lat, e.lng - t_southwest]);
        this._radius_southwest = Math.max(this._point.x - i_southwest.x, 1);
        var t_northwest = this._getLngRadius(this._getLatRadius(this._circle.nw * 1000)),
          i_northwest = this._map.latLngToLayerPoint([e.lat, e.lng - t_northwest]);
        this._radius_northwest = Math.max(this._point.x - i_northwest.x, 1);
      } catch (e) {
        this._radius_northeast = null;
        this._radius_southeast = null;
        this._radius_southwest = null;
        this._radius_northwest = null;
      }
    },
    getTyphoonPath: function () {
      if (this._radius_northeast && this._radius_southeast && this._radius_southwest && this._radius_northwest) {
        var t = this._point;
        var e_northeast = this._radius_northeast;
        var path_svg = 'M' + t.x + ',' + (t.y - e_northeast);
        var path_vml = 'M' + t.x + ',' + (t.y - e_northeast);
        path_svg += 'A' + e_northeast + ',' + e_northeast + ',0,0,1,' + (t.x + e_northeast) + ',' + t.y;
        path_vml += ' ae ' + t.x + ',' + t.y + ' ' + e_northeast + ',' + e_northeast + ' ' + 65535 * 450 + ',' + -5898150;
        var e_southeast = this._radius_southeast;
        path_svg += 'L' + (t.x + e_southeast) + ',' + t.y;
        path_svg += 'A' + e_southeast + ',' + e_southeast + ',0,0,1,' + t.x + ',' + (t.y + e_southeast);
        path_vml += ' ae ' + t.x + ',' + t.y + ' ' + e_southeast + ',' + e_southeast + ' ' + 65535 * 360 + ',' + -5898150;
        var e_southwest = this._radius_southwest;
        path_svg += 'L' + t.x + ',' + (t.y + e_southwest);
        path_svg += 'A' + e_southwest + ',' + e_southwest + ',0,0,1,' + (t.x - e_southwest) + ',' + t.y;
        path_vml += ' ae ' + t.x + ',' + t.y + ' ' + e_southwest + ',' + e_southwest + ' ' + 65535 * 270 + ',' + -5898150;
        var e_northwest = this._radius_northwest;
        path_svg += 'L' + (t.x - e_northwest) + ',' + t.y;
        path_svg += 'A' + e_northwest + ',' + e_northwest + ',0,0,1,' + t.x + ',' + (t.y - e_northwest) + 'z';
        path_vml += ' ae ' + t.x + ',' + t.y + ' ' + e_northwest + ',' + e_northwest + ' ' + 65535 * 180 + ',' + -5898150 + 'X';
        this.svgPath = L.Browser.svg ? path_svg : path_vml;
        return L.Browser.svg ? path_svg : path_vml;
      }
      return '';
    },
    beforeAdd: function (map: { getRenderer: (arg0: any) => any }) {
      this._renderer = map.getRenderer(this);
    },
    onAdd: function (map: { on: (arg0: { moveend: () => void; zoomstart: () => void }) => void }) {
      this.projectLatlngs();
      this.getTyphoonPath();
      this._renderer._initPath(this);
      this._reset();
      this._path.setAttribute('d', this.svgPath);
      this._renderer._addPath(this);
      this._setStyle(this._style);

      map.on({
        moveend: () => {
          this.projectLatlngs();
          this.getTyphoonPath();
          this._path.setAttribute('d', this.svgPath);
        },
        zoomstart: () => {
          this._path.setAttribute('d', this.svgPath);
        }
      });
    },

    getLatLng: function () {
      return this._latlng;
    },
    _setStyle: function (style: any) {
      L.setOptions(this, style);
      if (this._renderer) {
        this._renderer._updateStyle(this);
      }
      return this;
    },
    _getLatRadius: function (r: number) {
      return (r / 40075017) * 360;
    },
    _getLngRadius: function (lr: number) {
      return lr / Math.cos((Math.PI / 180) * this._latlng.lat);
    }
  });

  L.typhoon = function (t: any, e: any, i: any) {
    return new L.Typhoon(t, e, i);
  };
  map.value.setView([data.points[0].lat, data.points[0].lng], 5);
  let polyline = L.polyline([], { color: 'black', weight: 1 }).addTo(typhoonLayer.value);
  let temp = data.points.map((item: any) => {
    return [item.lat, item.lng];
  });
  let index = 0;
  let intervalId = setInterval(function () {
    if (index < temp.length) {
      polyline.addLatLng(L.latLng(temp[index][0], temp[index][1]));
      L.circleMarker(temp[index], { radius: 6, color: '#434343', fillColor: '#0062fe', fillOpacity: 1 }).addTo(typhoonLayer.value).bindTooltip(`
        <div class="detailBox" style="width:250px;">
          <div class="detailBox-title">${data.name}</div>
          <div class="detailBox-item">台风经度:${data.points[index].lng}</div>
          <div class="detailBox-item">台风纬度:${data.points[index].lat}</div>
          <div class="detailBox-item">台风气压:${data.points[index].pressure}</div>
          <div class="detailBox-item">台风强度:${data.points[index].strong}</div>
          <div class="detailBox-item">台风速度:${data.points[index].speed}</div>
          <div class="detailBox-item">台风时间:${data.points[index].time}</div>
        </div>`);
      typhoonGifLayer.value !== null ? typhoonGifLayer.value.clearLayers() : '';
      L.marker(temp[index], {
        icon: L.icon({
          iconUrl: typhoonIcon,
          className: 'typhoon-icon',
          iconSize: [40, 40],
          iconAnchor: [20, 20]
        })
      }).addTo(typhoonGifLayer.value);
      // 添加预测轨迹
      let tfyc = data.points[index].forecast;
      tfyc.forEach((res: any) => {
        let colorArr = {
          中国: 'red',
          中国香港: '#febd00',
          中国台湾: '#ff00fe',
          日本: '#24bc00',
          美国: '#04faf7'
        };
        let color = colorArr[res.tm];
        let a = [];
        res.forecastpoints.forEach((item: any) => {
          a.push([item.lat, item.lng]);
          L.circleMarker([item.lat, item.lng], { radius: 2, color: color, fillColor: color, fillOpacity: 1 }).addTo(typhoonGifLayer.value);
        });
        L.polyline(a, { weight: 1, color: color, dashArray: [6, 6] }).addTo(typhoonGifLayer.value);
      });
      // 判断风圈是否有值
      let center = temp[index];
      if (data.points[index].radius7 !== '') {
        let values = data.points[index].radius7.split('|');
        let result = {
          ne: parseInt(values[0]),
          nw: parseInt(values[1]),
          se: parseInt(values[2]),
          sw: parseInt(values[3])
        };
        let e = result;
        let color = {
          color: '#F4D000',
          weight: 1,
          opacity: 1,
          fill: true,
          fillColor: '#F4D000',
          fillOpacity: 0.3,
          clickable: true
        };
        L.typhoon(center, e, color).addTo(typhoonGifLayer.value);
      }
      index++;
    } else {
      clearInterval(intervalId);
    }
  }, 100);
};
const clear = () => {
  typhoonBox.value = false;
  markerLayer.value.clearLayers();
  typhoonLayer.value.clearLayers();
  typhoonGifLayer.value.clearLayers();
  flashingPointLayer.value.clearLayers();
  markPointLayer.value.clearLayers();
};

onMounted(() => {
  typhoonYear.value = new Date().getFullYear();
  initMap();
});
</script>
<template>
  <div class="mapBox">
    <div id="map"></div>
    <div class="mapBox_btn">
      <el-radio-group v-model="radioValue">
        <el-radio v-for="item in buttonList" :key="item.value" :value="item.value" @change="radioChange(item)">{{ item.label }}</el-radio>
      </el-radio-group>
    </div>
    <!-- 台风 -->
    <div v-show="typhoonBox" class="typhoonbox">
      <div class="typhoonbox-item">
        <div>日期：</div>
        <el-input v-model="typhoonYear" placeholder="请输入年份" @change="dateChange"></el-input>
      </div>
      <div class="typhoonbox-item">
        <div>台风名称：</div>
        <el-select v-model="typhoonName" placeholder="请选择" @change="nameChange">
          <el-option v-for="item in typhoonList" :key="item.value" :label="item.label" :value="item.value"> </el-option>
        </el-select>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
:deep(.leaflet-heatmap-layer) {
  z-index: -10 !important;
}

:deep(.leaflet-tooltip) {
  border: none;
  box-shadow: none;
  background: transparent !important;
}
// el-radio
:deep(.el-radio) {
  height: 45px;
  margin: 0;
}
:deep(.el-radio-group) {
  flex-direction: column;
  align-items: flex-start;
}
:deep(.el-radio__label) {
  color: #fff;
  font-size: 18px;
}

// el-select
:deep(.el-select .el-select__wrapper) {
  width: 150px;
  height: 35px;
  background: rgba(9, 31, 72, 0.72);
}
:deep(.el-select .el-select__placeholder) {
  color: #fff;
}

:deep(.el-input) {
  width: 150px;
}
:deep(.typhoonbox-item .el-input__wrapper) {
  background: rgba(9, 31, 72, 0.72);
  box-shadow: none;
}
:deep(.typhoonbox-item .el-input__inner) {
  color: #fff;
}
:deep(.typhoonbox-item .el-date-editor.el-input__wrapper) {
  height: 35px;
}
:deep(.detailBox) {
  background: white !important;

  .detailBox-title {
    width: 100%;
    white-space: pre-wrap;
    line-break: anywhere;
    background: #09557c;
    box-sizing: border-box;
    padding: 10px;
    color: white;
    font-size: 12px;
  }
  .detailBox-item {
    width: 100%;
    padding: 2px 10px;
    box-sizing: border-box;
    white-space: pre-wrap;
    line-break: anywhere;
  }
  .detailBox-item2 {
    width: 100%;
    padding: 2px 10px;
    display: flex;
    flex-direction: row;

    span {
      width: 50%;
    }
  }
}

.mapBox,
#map {
  position: relative;
  width: 100%;
  height: 100%;
  z-index: 1;
}
.mapBox_btn {
  position: absolute;
  top: 100px;
  right: 20px;
  padding: 20px 25px;
  border: 1px solid #2a96e8;
  background: rgba(7, 33, 82, 0.72);
  z-index: 100;
  display: flex;
  flex-direction: column;

  .active {
    background: rgb(7, 33, 82);
  }
}
.typhoonbox {
  position: absolute;
  z-index: 600;
  top: 100px;
  left: 150px;
  box-sizing: border-box;
  padding: 10px;
  display: flex;
  flex-direction: row;

  .typhoonbox-item {
    display: flex;
    flex-direction: row;
    color: #000;
    font-weight: bold;
    height: 35px;
    line-height: 35px;
    margin-right: 20px;

    div {
      white-space: nowrap;
    }
  }
}
</style>
