<script setup lang="ts">
import { mapInit, generateMarker, trajectory, generatePolyline, measureRange, generatePolygon, generateTag, clearLayer } from '@/utils/leaflet.js';

import sateMap from '@/assets/img/sateMap.png';
import commonMap from '@/assets/img/map.png';
import seaMap from '@/assets/img/seaMap.png';

let map = ref(null);
let tileLayers = ref({});
let baseLayer = ref(null);
let isMapType = ref(false);
let maptype = ref('卫星图');
let mapTypeList = [
  {
    name: '卫星图',
    url: sateMap
  },
  {
    name: '地图',
    url: commonMap
  },
  {
    name: '海图',
    url: seaMap
  }
];
// 初始化地图
const initMap = () => {
  map.value = L.map('map', {
    crs: L.CRS.EPSG3857,
    attributionControl: false,
    center: [30.36339623960374, 122.39318847656251],
    minZoom: 3,
    maxZoom: 18,
    zoom: 7,
    zoomControl: false,
    doubleClickZoom: false
  });
  mapInit(map.value);
  initTileLayer();
  mapTypeClick(mapTypeList[0]);
  map.value.on('click', (e: any) => {
    console.log(e.latlng);
  });
  map.value.on('zoomend', () => {
    console.log(map.value.getZoom());
  });
};
// 初始化地图类型
const initTileLayer = () => {
  // 定义地图瓦片URL模板
  const url = 'http://t{s}.tianditu.gov.cn/DataServer?x={x}&y={y}&l={z}';
  // 定义子域名列表
  const subdomains = ['0', '1', '2', '3', '4', '5', '6', '7'];
  // 定义天地图的访问令牌
  const tk = '5ff914129ad4071a378f67e5857e5bb5';

  // 初始化卫星图层
  // 创建图层组并添加卫星图层
  tileLayers.value['卫星图'] = L.layerGroup([
    // 添加卫星影像图层
    L.tileLayer(`${url}&T=img_w&tk=${tk}`, {
      // 设置子域名
      subdomains: subdomains
    }),
    // 添加CIA影像图层
    L.tileLayer(`${url}&T=cia_w&tk=${tk}`, {
      // 设置子域名
      subdomains: subdomains
    })
  ]);

  // 初始化地图图层
  // 创建图层组并添加地图图层
  tileLayers.value['地图'] = L.layerGroup([
    // 添加矢量地图图层
    L.tileLayer(`${url}&T=vec_w&tk=${tk}`, {
      // 设置子域名
      subdomains: subdomains
    }),
    // 添加CVA影像图层
    L.tileLayer(`${url}&T=cva_w&tk=${tk}`, {
      // 设置子域名
      subdomains: subdomains
    })
  ]);
};
// 地图类型切换
const mapTypeClick = (item: any) => {
  maptype.value = item.name;
  if (baseLayer.value) {
    map.value.removeLayer(baseLayer.value);
  }
  baseLayer.value = tileLayers.value[item.name].addTo(map.value);
};

// 生成标记点集合
const addMarker = (name: string, lnglat: any, img: string, iconSize0: number, iconSize1: number, color: string) => {
  generateMarker(name, lnglat, img, iconSize0, iconSize1, color);
};
// 生成标记线集合
const addPolyline = (name: string, lnglat: any, color, fillColor) => {
  generatePolyline('polyline', lnglat, color, fillColor);
};
// 生成轨迹
const addTrajectory = (name: string, lnglat: any) => {
  trajectory(name, lnglat);
};

// 测距
const measure = () => {
  measureRange();
};

const clear = () => {
  clearLayer();
};

onMounted(() => {
  initMap();
});

defineExpose({
  addMarker,
  addPolyline,
  addTrajectory,
  measure,
  clear
});
</script>
<template>
  <div class="leafletMap">
    <div id="map"></div>
    <div class="mapType" @mouseenter="isMapType = true" @mouseleave="isMapType = false" :class="[isMapType ? 'mapTypeActive' : '']">
      <div class="mapType-item" v-for="item in mapTypeList" :key="item.name" @click="mapTypeClick(item)">
        <img :src="item.url" />
        <div
          class="mapType-item-title"
          :style="{
            backgroundColor: item.name == maptype ? '#2276FF' : 'rgba(0, 0, 0, 0.4)'
          }"
        >
          {{ item.name }}
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
$n: 3; //tab 个数
$h: 78px; //tab 高度
$w: 120px; //tab 宽度
$g: 10px; //tab 间隙
$t: 0.5s; //tab 动画时间

.mapType {
  width: calc($w / $n) * ($n - 1) + $w + $g;
  height: $h;
  position: absolute;
  z-index: 20;
  right: 30px;
  bottom: 30px;
  cursor: pointer;

  &-item {
    position: absolute;
    width: $w;
    height: $h;
    top: 0;
    right: $g;
    opacity: 0.7;
    display: inline-block;
    transition: transform $t ease;
    border: 1px solid white;

    &-title {
      position: absolute;
      right: 0;
      bottom: 0;
      padding: 2px 5px;
      color: #fff;
      font-size: 12px;
    }

    &:first-of-type {
      opacity: 1;
    }

    @for $i from 1 through $n {
      &:nth-of-type(#{$i}) {
        transform: scaleX(1) translate3d(-(calc($w/$n) * ($i - 1)), 0, 0);
        z-index: 50-$i;
      }
    }
    // @for $i from 1 through $n {
    //   &:nth-of-type(#{$i}) {
    //     transform: scaleX(1) translate3d((($w / $n) * ($i - 1)), 0, 0);
    //     z-index: 50-$i;
    //   }
    // }
  }

  img {
    position: relative;
    width: 100%;
    height: 100%;
  }
}
.mapTypeActive {
  width: ($n * $w + ($g * ($n + 1)));

  .mapType-item {
    @for $i from 1 through $n {
      &:nth-of-type(#{$i}) {
        transform: scaleX(1) translate3d(-(($w + 10px) * ($i - 1)), 0, 0);
        opacity: 1;
        z-index: 50-$i;
      }
    }
  }
  // .mapType-item {
  //   @for $i from 1 through $n {
  //     &:nth-of-type(#{$i}) {
  //       transform: scaleX(1) translate3d((($w + 10px) * ($i - 1)), 0, 0);
  //       opacity: 1;
  //       z-index: 50-$i;
  //     }
  //   }
  // }
}
.leafletMap {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

#map {
  position: relative;
  width: 100%;
  height: 100%;
  z-index: 1;
}
</style>
