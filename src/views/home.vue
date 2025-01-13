<script setup lang="ts">
import LeafletMap from '@/components/leafletMap.vue';
import logo from '@/assets/img/logo.png';

const refMap = ref<InstanceType<typeof LeafletMap>>();
let lnglat = ref([
  {
    name: 'a1',
    latitude: 29.05136777451729,
    longitude: 122.15423583984376
  },
  {
    name: 'a2',
    latitude: 29.221699149280646,
    longitude: 122.29156494140626
  },
  {
    name: 'a3',
    latitude: 29.38456832654707,
    longitude: 122.40142822265626
  },
  {
    name: 'a4',
    latitude: 29.506549442788593,
    longitude: 122.69531250000001
  },
  {
    name: 'a5',
    latitude: 29.506549442788593,
    longitude: 123.04138183593751
  },
  {
    name: 'a6',
    latitude: 29.671349002200948,
    longitude: 123.00018310546876
  },
  {
    name: 'a7',
    latitude: 29.714295887474798,
    longitude: 123.29132080078126
  },
  {
    name: 'a8',
    latitude: 29.835878945929952,
    longitude: 123.15948486328126
  },
  {
    name: 'a9',
    latitude: 29.847790904477122,
    longitude: 123.55773925781251
  },
  {
    name: 'a10',
    latitude: 29.971590978566113,
    longitude: 123.35449218750001
  },
  {
    name: 'a11',
    latitude: 29.888280933159265,
    longitude: 123.78845214843751
  },
  {
    name: 'a12',
    latitude: 29.923993777627715,
    longitude: 124.002685546875
  },
  {
    name: 'a13',
    latitude: 29.923993777627715,
    longitude: 124.17572021484376
  },
  {
    name: 'a14',
    latitude: 29.92637417863576,
    longitude: 124.35699462890626
  },
  {
    name: 'a15',
    latitude: 30.318358689813856,
    longitude: 124.21966552734376
  },
  {
    name: 'a16',
    latitude: 30.268556249047727,
    longitude: 123.99444580078126
  },
  {
    name: 'a17',
    latitude: 30.351546261929034,
    longitude: 123.68408203125
  },
  {
    name: 'a18',
    latitude: 30.44393799829119,
    longitude: 123.48907470703126
  },
  {
    name: 'a19',
    latitude: 30.413150465068878,
    longitude: 123.14300537109376
  }
]);

const clear = () => {
  refMap.value.clear();
};

const setZoomData = () => {
  refMap.value.addMarker('marker', lnglat.value, logo, 20, 20, '');
};

const pulsePonit = () => {
  refMap.value.addMarker('pulsePoint', lnglat.value, '', 12, 12, 'red');
};

const trajectory = () => {
  refMap.value.addTrajectory('trajectory', lnglat.value);
};

const addPolyline = () => {
  refMap.value.addPolyline('polyline', lnglat.value, '#f03', '#efeff6');
};

const measureRange = () => {
  refMap.value.measure();
};

onMounted(() => {});
</script>
<template>
  <div class="home">
    <LeafletMap ref="refMap"></LeafletMap>
    <div class="map-handle">
      <div @click="clear">清除</div>
      <div @click="setZoomData">画点</div>
      <div @click="pulsePonit">闪烁点</div>
      <div @click="trajectory">轨迹</div>
      <div @click="addPolyline">画线</div>
      <div @click="measureRange">测距</div>
      <!-- <div @click="customizeCircle">自定义画圆</div>
      <div @click="customizeRectangle">自定义画矩形</div>
      <div @click="customizePolygon">自定义画多边形</div>
      <div @click="pmCircle">pm画圆</div>
      <div @click="pmRectangle">pm画矩形</div>
      <div @click="pmPolygon">pm画多边形</div> -->
    </div>
  </div>
</template>

<style lang="less" scoped>
.home {
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
  flex-direction: row;
  width: 100%;
  padding: 10px;

  div {
    padding: 10px;
    border: 1px dashed #ccc;
    border-radius: 5px;
    background-color: #fff;
    cursor: pointer;
    margin-right: 10px;
  }
}
</style>
