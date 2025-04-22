<script setup lang="ts">
import sateMap from '@/assets/img/sateMap.png';
import commonMap from '@/assets/img/map.png';
import dxtMap from '@/assets/img/dxtMap.png';
import leafletMap from '@/assets/img/leafletMap.png';
import blackMap from '@/assets/img/blackMap.png';
import {
  mapInit,
  updateMapMarkerTag,
  addMarker,
  customPolyline,
  customCircle,
  customRectangle,
  customPolygon,
  multiPoint,
  multiMarker,
  markerCluster,
  trackReplayNode,
  stopTrackReplay,
  trackReplay,
  typhoon
} from '@/utils/leaflet';
let map = ref(null);
let tileLayers = ref({});
let baseLayer = ref(null);
let isMapType = ref(false);
let maptype = ref('卫星图');
let layer = ref({});
let tagObjLayer = ref({});
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
    name: '地形图',
    url: dxtMap
  },
  {
    name: 'leaflet地图',
    url: leafletMap
  },
  {
    name: '黑色地图',
    url: blackMap
  }
];
/**
 * 初始化地图
 */
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
  L.Marker.prototype._animateZoom = function (e: any) {
    if (!this._map) {
      return;
    }
    var pos = this._map._latLngToNewLayerPoint(this._latlng, e.zoom, e.center).round();
    this._setPos(pos);
  };
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
/**
 * 初始化地图瓦片图层
 */
const initTileLayer = () => {
  // 定义地图瓦片URL模板
  const url = 'http://t{s}.tianditu.gov.cn/DataServer?x={x}&y={y}&l={z}';
  // 定义子域名列表
  const subdomains = ['0', '1', '2', '3', '4', '5', '6', '7'];
  // 定义天地图的访问令牌
  const tk = 'ca8a7ac4ffa1d8b87df051eb5f0dc7a6';

  // 卫星地图
  tileLayers.value['卫星图'] = L.layerGroup([
    // 添加卫星影像图层
    L.tileLayer(`${url}&T=img_w&tk=${tk}`, {
      subdomains: subdomains
    }),
    // 添加CIA影像图层
    L.tileLayer(`${url}&T=cia_w&tk=${tk}`, {
      subdomains: subdomains
    })
  ]);

  // 基础地图
  tileLayers.value['地图'] = L.layerGroup([
    L.tileLayer(`${url}&T=vec_w&tk=${tk}`, {
      subdomains: subdomains
    }),
    L.tileLayer(`${url}&T=cva_w&tk=${tk}`, {
      subdomains: subdomains
    })
  ]);

  // 地形图
  tileLayers.value['地形图'] = L.layerGroup([
    L.tileLayer(`${url}&T=ter_w&tk=${tk}`, {
      subdomains: subdomains
    }),
    L.tileLayer(`${url}&T=cta_w&tk=${tk}`, {
      subdomains: subdomains
    })
  ]);

  //leaflet地图
  tileLayers.value['leaflet地图'] = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png');

  // 黑色地图
  tileLayers.value['黑色地图'] = L.tileLayer('http://mapnew.geoq.cn/ArcGIS/rest/services/ChinaOnlineStreetPurplishBlue/MapServer/tile/{z}/{y}/{x}');
};
/**
 * 处理地图类型点击事件
 *
 * @param obj 点击的地图类型项
 */
const mapTypeClick = (obj: any) => {
  maptype.value = obj.name;
  if (baseLayer.value) {
    map.value.removeLayer(baseLayer.value);
  }
  baseLayer.value = tileLayers.value[obj.name].addTo(map.value);
};

const clearLayer = () => {
  for (const key in layer.value) {
    layer.value[key].clearLayers();
  }

  for (let name in tagObjLayer.value) {
    for (let key in tagObjLayer.value[name]) {
      if (key === 'data') {
        tagObjLayer.value[name][key] = [];
      } else {
        tagObjLayer.value[name][key].clearLayers();
      }
    }
  }

  stopTrackReplay();
};

/**
 * 根据名称判断是否存在图层，若存在则清空该图层，否则创建并添加到地图上
 *
 * @param name 图层名称
 */
const isLayer = (name: string) => {
  if (layer.value[name]) {
    layer.value[name].clearLayers();
  } else {
    layer.value[name] = L.featureGroup().addTo(map.value);
  }
};

const marker = (name: string, layerName: any, lnglat: any, icon: any) => {
  isLayer(layerName);
  addMarker(name, layer.value[layerName], lnglat, icon);
};

/**
 *初始化图层：包含点图层、marker图层、标签图层
 *
 * @param name 图层名称
 */
const tagLayer = (name: string) => {
  if (tagObjLayer.value[name]) {
    tagObjLayer.value[name].point.clearLayers();
    tagObjLayer.value[name].marker.clearLayers();
    tagObjLayer.value[name].tag.clearLayers();
  } else {
    tagObjLayer.value[name] = {};
    tagObjLayer.value[name].point = L.featureGroup().addTo(map.value);
    tagObjLayer.value[name].marker = L.featureGroup().addTo(map.value);
    tagObjLayer.value[name].tag = L.featureGroup().addTo(map.value);
  }
};

/**
 * 添加AIS标记图层
 *
 * @param name 标记名称
 * @param pointIcon 点图标
 * @param markerIcon 标记图标
 * @param lnglat 经纬度坐标
 */
const aisMarkers = (name: string, pointIcon: any, markerIcon: any, lnglat: any) => {
  tagLayer(name);
  tagObjLayer.value[name].data = lnglat;
  aisMarkersPublic(name, pointIcon, markerIcon);
  map.value.on('zoomend', () => {
    aisMarkersPublic(name, pointIcon, markerIcon);
  });
};

/**
 * 在地图上绘制标记点、点集
 *
 * @param name 标记点的名称
 * @param pointIcon 点集的图标
 * @param markerIcon 标记点的图标
 */
const aisMarkersPublic = (name: string, pointIcon: any, markerIcon: any) => {
  tagLayer(name);
  if (map.value.getZoom() >= 10) {
    multiMarkers(name, tagObjLayer.value[name].marker, tagObjLayer.value[name].data, markerIcon);
  } else {
    multiPoints(tagObjLayer.value[name].point, tagObjLayer.value[name].data, pointIcon);
  }
  updateMapMarkerTag(tagObjLayer.value[name].tag, tagObjLayer.value[name].data);
};

const multiMarkers = (name: string, layer: string, lnglat: any, icon: any) => {
  multiMarker(name, layer, lnglat, icon);
};

const multiPoints = (layer: string, lnglat: any, icon: any) => {
  multiPoint(layer, lnglat, icon);
};

const markerClusters = (name: string, layerName: string, lnglat: any, icon: any) => {
  isLayer(layerName);
  let group = L.markerClusterGroup({
    showCoverageOnHover: false,
    zoomToBoundsOnClick: true,
    chunkedLoading: true,
    maxClusterRadius: 40 //默认80
  });
  layer.value[layerName].addLayer(group);
  markerCluster(name, group, lnglat, icon);
};

const trackReplayNodes = (layerName: string, lnglat: any) => {
  isLayer(layerName);
  trackReplayNode(layer.value[layerName], lnglat);
};

const trackReplays = (layerName: string, lnglat: any) => {
  isLayer(layerName);
  trackReplay(layer.value[layerName], lnglat);
};

const typhoons = () => {};

const customPolylines = () => {};

const customCircles = () => {};

const customRectangles = () => {};

const customPolygons = () => {};

onMounted(() => {
  initMap();
});

defineExpose({ clearLayer, marker, tagLayer, aisMarkers, markerClusters, trackReplayNodes, trackReplays });
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
$n: 6; //tab 个数
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
