import start from '@/assets/img/start.svg';
import end from '@/assets/img/end.svg';
import sportMarker from '@/assets/img/sportMarker.svg';
let map = null; // 地图对象
// 图层对象
let layer = {
  'marker': null,
  'pulsePoint': null,
  'trajectory': null,
  'polyline': null,
  'polygon': null,
  'circle': null,
  'rectangle': null,
  'tag': null
};
let interval = null;
// 地图缩放等级对应关系
let offsetLengthZoomMap = {
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
/**
 * 初始化，必须调用
 * @param Map
 * @param layer
 */
export function mapInit(Map) {
  map = Map;
}

/**
 * 判断是否存在指定名称的图层，若存在则清空该图层，否则创建一个新的图层组。
 *
 * @param {string} name - 图层的名称。
 * @returns {void}
 */
export function isLayer(name) {
  if (layer[name]) {
    layer[name].clearLayers();
  } else {
    layer[name] = L.layerGroup().addTo(map);
  }
}

/**
 * 指定图标
 *
 * @param {string} iconUrl - 图标的路径
 * @param {number} iconSize - 图标的尺寸
 * @returns {L.Icon} 返回包含指定图标信息的对象
 */
export function specifyIcon(iconUrl, iconSize0, iconSize1) {
  const image = new URL(iconUrl, import.meta.url).href;
  return L.icon({
    iconUrl: image,
    iconSize: [iconSize0, iconSize1],
    iconAnchor: [iconSize0 / 2, iconSize1 / 2]
  });
}

/**
 * 生成地图标记
 *
 * @param name 标记名称
 * @param latlng 坐标数组，每个元素包含纬度、经度和旋转角度信息
 * @param iconUrl 自定义图标URL
 * @param iconSize 图标大小
 * @param color 图标颜色
 */
export function generateMarker(name, latlng, iconUrl, iconSize0, iconSize1, color) {
  isLayer(name);
  let icons = null;
  if (name == 'marker') {
    icons = specifyIcon(iconUrl, iconSize0, iconSize1);
  } else if (name == 'pulsePoint') {
    icons = L.icon.pulse({
      iconSize: [iconSize0, iconSize1],
      color: color
    });
  }
  latlng.forEach((item) => {
    let marker = L.marker([item.latitude, item.longitude], {
      icon: icons,
      rotationAngle: item.rotationAngle ? item.rotationAngle : 0,
      data: item
    });
    marker.addTo(layer[name]);
    marker.on('click', (e) => {
      generateMarkerClick(e.target.options.data);
    });
    marker.bindTooltip(`<p>名称：${item.name}</p><p>纬度：${item.latitude}</p><p>经度：${item.longitude}</p>`);
  });
}

/**
 * 【标记点】点击事件
 */
export function generateMarkerClick(data) {}

/**
 * 轨迹
 */
export function trajectory(name, lnglat) {
  isLayer(name);
  let index = 0;
  let movemarker = null;
  L.marker([lnglat[0].latitude, lnglat[0].longitude], {
    icon: L.icon({
      iconUrl: start,
      iconSize: [28, 38],
      iconAnchor: [14, 19]
    })
  }).addTo(layer[name]);
  interval = setInterval(() => {
    if (index < lnglat.length - 1) {
      // 画带箭头的红色线
      let arrow = L.polyline(
        [
          [lnglat[index].latitude, lnglat[index].longitude],
          [lnglat[index + 1].latitude, lnglat[index + 1].longitude]
        ],
        {
          color: '#f03',
          fillColor: '#efeff6'
        }
      ).addTo(layer[name]);
      L.polylineDecorator(arrow, {
        patterns: [
          {
            offset: '50%',
            repeat: '50%',
            symbol: L.Symbol.arrowHead({
              pixelSize: 12,
              pathOptions: { fillOpacity: 1, weight: 0, fillColor: '#f03' }
            })
          }
        ]
      }).addTo(layer[name]);
      // 画红色圆点
      L.circleMarker([lnglat[index].latitude, lnglat[index].longitude], {
        radius: 4,
        color: '#f03',
        fillColor: '#efeff6',
        fillOpacity: 1,
        weight: 2
      }).addTo(layer[name]);
      // 移动的marker
      if (movemarker) {
        movemarker.setLatLng([lnglat[index + 1].latitude, lnglat[index + 1].longitude]);
      } else {
        movemarker = L.marker([lnglat[index + 1].latitude, lnglat[index + 1].longitude], {
          icon: L.icon({
            iconUrl: sportMarker,
            iconSize: [20, 20],
            iconOffset: [10, 10]
          })
        }).addTo(layer[name]);
      }
      index++;
    } else {
      L.marker([lnglat[lnglat.length - 1].latitude, lnglat[lnglat.length - 1].longitude], {
        icon: L.icon({
          iconUrl: end,
          iconSize: [28, 38],
          iconAnchor: [14, 19]
        })
      }).addTo(layer[name]);
      clearInterval(interval);
      interval = null;
      index = 0;
    }
  }, 500);
}

/**
 * 标记线
 */
export function generatePolyline(name, lnglat, color, fillColor) {
  isLayer(name);
  for (let i = 0; i < lnglat.length; i++) {
    if (i < lnglat.length - 1) {
      L.polyline(
        [
          [lnglat[i].latitude, lnglat[i].longitude],
          [lnglat[i + 1].latitude, lnglat[i + 1].longitude]
        ],
        {
          color: color,
          fillColor: fillColor
        }
      ).addTo(layer[name]);
    }
  }
}

/**
 * 测距
 */
export function measureRange() {}

/**
 * 标记面
 */
export function generatePolygon() {}

/**
 * 标记点标签：根据zoom层级显示隐藏
 */
export function generateTag() {}

export function clearLayer() {
  for (let key in layer) {
    if (layer[key]) {
      layer[key].clearLayers();
    }
  }
  clearInterval(interval);
}
