<script setup lang="ts">
import jsonData from '@/assets/json/lnglat.json';
import jsonData2 from '@/assets/json/lnglat2.json';
import LeafletMap from '@/components/leafletMap.vue';
import logo from '@/assets/img/logo.png';
import greenPoint from '@/assets/img/green.png';

const refMap = ref<InstanceType<typeof LeafletMap>>();

const marker = () => {
  let icon = L.icon({
    iconUrl: logo,
    iconSize: [20, 26],
    iconAnchor: [10, 13]
  });
  refMap.value.marker('单点marker', 'markerLayer', jsonData2, icon);
};
const aisMarker = () => {
  let pointIcon = L.icon({
    iconUrl: greenPoint,
    iconSize: [6, 6],
    iconAnchor: [3, 3]
  });
  let markerIcon = L.icon({
    iconUrl: logo,
    iconSize: [20, 26],
    iconAnchor: [10, 13]
  });
  refMap.value.tagLayer('船只');
  refMap.value.aisMarkers('船只', pointIcon, markerIcon, jsonData);
};
const pulsePonit = () => {
  let icon = L.icon.pulse({
    iconSize: [12, 12],
    color: 'red'
  });
  refMap.value.marker('脉冲点', 'pulseLayer', jsonData2, icon);
};

const markerCluster = () => {
  let icon = L.icon({
    iconUrl: logo,
    iconSize: [20, 26],
    iconAnchor: [10, 13]
  });
  refMap.value.markerClusters('聚合点', 'clusterLayer', jsonData2, icon);
};

const trackReplayNode = () => {
  refMap.value.trackReplayNodes('trackReplayNodeLayer', jsonData);
};

const trackReplay = () => {
  refMap.value.trackReplays('trackReplayLayer', jsonData);
};
// const point = () => {
//   let icon = L.icon({
//     iconUrl: logo,
//     iconSize: [20, 26], // 设置图标大小
//     iconAnchor: [10, 13] // 设置锚点位置，即图标中心点相对于标记位置的偏移量
//   });
//   refMap.value.points('静态点', 'pointLayer', jsonData, icon);
// };

// const polyline = () => {
//   refMap.value.polylines('静态线', 'polylineLayer', jsonData);
// };

// const circle = () => {};

// const polygon = () => {};
// const clear = () => {
//   refMap.value.clear();
// };

// const setZoomData = () => {
//   refMap.value.addMarker('marker', lnglat.value, logo, 20, 20, '');
// };

// const pulsePonit = () => {
//   refMap.value.addMarker('pulsePoint', lnglat.value, '', 12, 12, 'red');
// };

// const trajectory = () => {
//   refMap.value.addTrajectory('trajectory', lnglat.value);
// };

// const addPolyline = () => {
//   refMap.value.addPolyline('polyline', lnglat.value, '#f03', '#efeff6');
// };

// const measureRange = () => {
//   refMap.value.measure();
// };

const clear = () => {
  refMap.value.clearLayer();
};

onMounted(() => {});
</script>
<template>
  <div class="home">
    <LeafletMap ref="refMap"></LeafletMap>
    <div class="map-handle">
      <div class="map-handle-item">
        <div @click="marker">marker</div>
        <div @click="aisMarker">AIS marker</div>
        <div @click="pulsePonit">闪烁点</div>
        <div @click="markerCluster">点聚合</div>
        <div @click="trackReplayNode">带有【节点】轨迹回放</div>
        <div @click="trackReplay">无【节点】轨迹回放</div>
      </div>
      <div class="map-handle-item">
        <div>自定义线</div>
        <div>自定义圆</div>
        <div>自定义矩形</div>
        <div>自定义多边形</div>
      </div>

      <!-- <div @click="clear">清除</div>
      <div @click="setZoomData">画点</div>
      <div @click="pulsePonit">闪烁点</div>
      <div @click="trajectory">轨迹</div>
      <div @click="addPolyline">画线</div>
      <div @click="measureRange">测距</div> -->
      <!-- <div @click="customizeCircle">自定义画圆</div>
      <div @click="customizeRectangle">自定义画矩形</div>
      <div @click="customizePolygon">自定义画多边形</div>
      <div @click="pmCircle">pm画圆</div>
      <div @click="pmRectangle">pm画矩形</div>
      <div @click="pmPolygon">pm画多边形</div> -->
    </div>
    <div class="clear" @click="clear">清除</div>
  </div>
</template>

<style lang="less" scoped>
.home {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}
.map-handle {
  position: absolute;
  top: 20px;
  left: 20px;
  z-index: 20;
  display: flex;
  flex-direction: column;

  &-item {
    display: flex;
    flex-direction: row;
    margin-bottom: 10px;

    div {
      padding: 10px;
      border: 1px dashed #ccc;
      border-radius: 5px;
      background-color: #fff;
      cursor: pointer;
      margin-right: 10px;
      text-align: center;
    }
  }
}

.clear {
  position: absolute;
  top: 20px;
  right: 20px;
  z-index: 20;
  padding: 10px;
  border: 1px dashed #ccc;
  border-radius: 5px;
  background-color: #fff;
  cursor: pointer;
  text-align: center;
  letter-spacing: 10px;
  text-indent: 10px;
}
</style>
