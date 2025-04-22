import start from '@/assets/img/start.svg';
import end from '@/assets/img/end.svg';
import sportMarker from '@/assets/img/sportMarker.svg';
let map = null; // 地图对象
let layer = null;
let interval = null;
let newShipList = [];
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
 */
export function mapInit(Map) {
  map = Map;
}

export function addMarker(name, layer, lnglat, icon) {
  lnglat.forEach((item) => {
    let marker = L.marker([item.latitude, item.longitude], {
      icon: icon,
      rotationAngle: item.rotationAngle ? item.rotationAngle : 0,
      data: item
    });
    marker.addTo(layer);
    marker.on('click', (e) => {
      console.log('name', name);
    });
  });
}

// 自定义线
export function customPolyline() {}

// 自定义圆
export function customCircle() {}

// 自定义矩形
export function customRectangle() {}

// 自定义多边形
export function customPolygon() {}

// 绿点【根据zoom层级变化展示】
export function multiPoint(layer, lnglat, icon) {
  lnglat.forEach((item) => {
    let marker = L.marker([item.latitude, item.longitude], {
      icon: icon
    });
    marker.addTo(layer);
  });
}

// marker【根据zoom层级变化展示】
export function multiMarker(name, layer, lnglat, icon) {
  lnglat.forEach((item) => {
    let marker = L.marker([item.latitude, item.longitude], {
      icon: icon,
      rotationAngle: item.rotationAngle || 0,
      data: item
    });
    marker.addTo(layer);
    marker.on('click', function (e) {
      console.log('e', e.target.options.data);
      if (name == '船只') {
        console.log('船只点开事件');
      }
    });
  });
}

// 点聚合
export function markerCluster(name, layer, lnglat, icon) {
  lnglat.forEach((item) => {
    let marker = L.marker([item.latitude, item.longitude], {
      icon: icon,
      rotationAngle: item.rotationAngle ? item.rotationAngle : 0,
      data: item
    });
    layer.addLayer(marker);
    marker.on('click', (e) => {
      console.log('name', name);
    });
  });
}

// 轨迹回放【带有节点】
export function trackReplayNode(layer, lnglat) {
  let index = 0;
  let movemarker = null;
  L.marker([lnglat[0].latitude, lnglat[0].longitude], {
    icon: L.icon({
      iconUrl: start,
      iconSize: [28, 38],
      iconAnchor: [14, 19]
    })
  }).addTo(layer);
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
      ).addTo(layer);
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
      }).addTo(layer);
      // 画红色圆点
      L.circleMarker([lnglat[index].latitude, lnglat[index].longitude], {
        radius: 4,
        color: '#f03',
        fillColor: '#efeff6',
        fillOpacity: 1,
        weight: 2
      }).addTo(layer);
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
        }).addTo(layer);
      }
      index++;
    } else {
      L.marker([lnglat[lnglat.length - 1].latitude, lnglat[lnglat.length - 1].longitude], {
        icon: L.icon({
          iconUrl: end,
          iconSize: [28, 38],
          iconAnchor: [14, 19]
        })
      }).addTo(layer);
      clearInterval(interval);
      interval = null;
      index = 0;
    }
  }, 500);
}

export function stopTrackReplay() {
  clearInterval(interval);
  interval = null;
}

// 轨迹回放
export function trackReplay(layer, lnglat) {
  let data = lnglat.map((item) => {
    return [item.latitude, item.longitude];
  });
  L.motion
    .polyline(
      data,
      { color: 'red' },
      {
        auto: true,
        duration: 10000
        // easing: L.Motion.Ease.easeInOutQuart
      },
      {
        removeOnEnd: true,
        showMarker: true,
        icon: L.icon({
          iconUrl: sportMarker,
          iconSize: [20, 20],
          iconOffset: [10, 10]
        })
      }
    )
    .addTo(layer);
  setTimeout(() => {
    L.marker([lnglat[lnglat.length - 1].latitude, lnglat[lnglat.length - 1].longitude], {
      icon: L.icon({
        iconUrl: sportMarker,
        iconSize: [20, 20],
        iconOffset: [10, 10]
      })
    }).addTo(layer);
  }, 10000);
}

// 台风
export function typhoon() {}

/**
 * 更新标签数量与位置
 * @param { Arrar } shipList //船舶数据
 * @param { Number } offset  //标签垂直方向偏移
 * @param { Object } style   //标签样式，规则采用百度地图style规则 。*已废弃不准传
 * @returns
 */
export function updateMapMarkerTag(layers, shipList) {
  layer = layers;
  layer ? layer.clearLayers() : '';
  if (!map) return;
  let zoom = map.getZoom();
  if (zoom < 10) {
    return;
  }

  newShipList = [];
  for (let i = 0; i < shipList.length; i++) {
    // 获取 84转百度 经纬度
    let [lng, lat] = wgs84ToBD(parseFloat(shipList[i].longitude), parseFloat(shipList[i].latitude), false);
    let isDisplaying = map.getBounds().contains([lat, lng]);
    if (!isDisplaying) {
      continue;
    }
    // 获取名称字符串
    let str = shipList[i].shipName ? shipList[i].shipName : shipList[i].mmsi;
    //获取船舶点位
    let point = [lat, lng];

    //偏移长度
    // offsetLengthZoomMap 获取地图对角缩放大小
    let offsetLength = Math.pow(offsetLengthZoomMap[zoom], 2) / 10000; //Math.pow(19-zoom+1,2)/10000 0.00045
    //获取向左上角偏移量
    const [offsetLengthLngD, offsetLengthLatD] = getLAIAngle('negative', 'negative', offsetLength);
    //声明 将要渲染的数据对象
    let newShipTarget = { ...shipList[i] };
    // 设置偏移右上角经纬度
    newShipTarget.longitude = lng - offsetLengthLngD;
    newShipTarget.latitude = lat - offsetLengthLatD;
    //获取无碰撞旋转后的角度点位
    let [is, newPoint] = getAngleType(newShipTarget, getLenPx(str, 15.636) + 10 + 2); //宽度算上 padding,border
    //判断是否渲染
    if (is) {
      continue;
    }

    L.polyline([point, newPoint], {
      color: '#000',
      weight: 0.5
    }).addTo(layer);

    var icon = L.divIcon({
      className: 'ship-tag',
      html: `<div  style="display: inline-block;width: auto;background: rgba(255,255,255,0.22);border: 1px solid #9BCDE4;white-space: nowrap;color:#fff;padding:0 5px;">${str}</div>`
    });
    L.marker(newPoint, { icon: icon }).addTo(layer);
  }
}
/**
 * 获取角度（决定是否旋转，以及旋转多少）
 * @param { Objcet } item
 * @param {字符宽度} length
 * @returns
 */
function getAngleType(item, length, name) {
  let [lng, lat] = [item.longitude, item.latitude];
  // console.log(item,[ lng , lat ])
  //经纬度 转 平面坐标 X = Lng , y = Lat
  let { x, y } = getPixel(lng, lat);

  let width = length; // 宽度随字符长度变化
  let height = 18 + 2; // 高度固定不变

  let rect1 = {}; // 将要渲染的检测对象
  rect1.left = x;
  rect1.top = y;
  rect1.width = width;
  rect1.height = height;
  rect1.mmsi = item.mmsi; // 唯一标识

  let countAngle = 0; // 碰撞计数

  for (let j = 0; j < 4; j++) {
    // 四个角度检测
    // 不需要旋转标记
    let noSpin = true;

    for (let i = 0; i < newShipList.length; i++) {
      const ele = newShipList[i];
      //检测是否碰撞
      if (handleEgdeCollisions(rect1, ele)) {
        let [spinX, spinY] = getOffsetLAI(rect1.left, rect1.top, j)(rect1.left + width, rect1.top + height);
        rect1.left = spinX; //- width
        rect1.top = spinY; //- height
        //console.log(rect1)
        noSpin = false;
        break;
      }
    }
    if (noSpin) {
      //将已旋转的，放入列表
      newShipList.push(rect1);
      // 旋转次数大于三次就不渲染
      if (countAngle > 3) {
        return [true, {}];
      }
      return [false, map.containerPointToLatLng(L.point(rect1.left, rect1.top))];
    }
    countAngle++;
  }

  return [true, {}];
}

/**
 * 经纬度转平面坐标
 * @returns X = Lng , y = Lat
 * @param lng
 * @param lat
 */
function getPixel(lng, lat) {
  return map.latLngToContainerPoint(L.latLng(lat, lng));
}
/**
 * 碰撞检测
 * @param { Object } rect1
 * @param { Object } rect2
 * @returns Boolean
 */
function handleEgdeCollisions(rect1, rect2) {
  //console.log(rect1,rect2)
  if (
    rect1.left < rect2.left + rect2.width &&
    rect1.left + rect1.width > rect2.left &&
    rect1.top < rect2.top + rect2.height &&
    rect1.height + rect1.top > rect2.top
  ) {
    return true;
  } else {
    // console.log('没撞')
    return false;
  }
}
/**
 * 获取旋转角度（平面坐标系）
 * @param { Number } shipx // 船舶点位
 * @param { Number } shipy // X = Lng , y = Lat
 * @param { Number } offset  // 旋转次数
 * @returns 返回旋转后的点位
 */
function getOffsetLAI(shipx, shipy, offset) {
  let map = {
    0: (x, y, w, h) => [x, y + h + h * 3],
    1: (x, y, w, h) => [x - w * 1.1, y],
    2: (x, y, w, h) => [x, y - h * 4],
    3: (x, y, w, h) => [x, y]
  };
  /**
   * x2,y2 为对角坐标
   */
  return (x2, y2) => {
    let w = x2 - shipx;
    let h = y2 - shipy;
    //[x*cosA-y*sinA  x*sinA+y*cosA]
    return map[offset](shipx, shipy, w, h); //[shipx,(shipy+h)]
  };
}
/**
 * 根据字符 决定旋转 角度
 * @param { String } lngType //
 * @param { String } lonType //
 * @param { Number } num     //
 * @returns [lng,lat]
 */
function getLAIAngle(lngType, lonType, num) {
  let obj = {
    'negative': (num) => num - num * 2,
    'zero': (num) => num * 0,
    'positive': (num) => num
  };
  return [obj[lngType](num), obj[lonType](num)];
}
/**
 * 获取字符在屏幕中的像素
 * @param { String } str
 * @param { Number } font_size
 * @returns 字符宽度
 */
function getLenPx(str, font_size) {
  var str_leng = str.replace(/[^\x00-\xff]/gi, 'aa').length;
  return (str_leng * font_size) / 2;
}

/*
 *  下面的只是转换工具直接拿过来用就行
 *   wgs84ToBD 84坐标系   转 百度
 *   bd09towgs84 百度转 84坐标系
 */

//定义一些常量
var x_PI = (3.14159265358979324 * 3000.0) / 180.0;
var PI = 3.1415926535897932384626;
var a = 6378245.0;
var ee = 0.00669342162296594323;
/**
 * 百度坐标系 (BD-09) 与 火星坐标系 (GCJ-02)的转换
 * 即 百度 转 谷歌、高德
 */
function bd09togcj02(bd_lon, bd_lat) {
  var x_pi = (3.14159265358979324 * 3000.0) / 180.0;
  var x = bd_lon - 0.0065;
  var y = bd_lat - 0.006;
  var z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * x_pi);
  var theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * x_pi);
  var gg_lng = z * Math.cos(theta);
  var gg_lat = z * Math.sin(theta);
  return [gg_lng, gg_lat];
}
/**
 * 火星坐标系 (GCJ-02) 与百度坐标系 (BD-09) 的转换
 * 即谷歌、高德 转 百度
 */
function gcj02tobd09(lng, lat) {
  var z = Math.sqrt(lng * lng + lat * lat) + 0.00002 * Math.sin(lat * x_PI);
  var theta = Math.atan2(lat, lng) + 0.000003 * Math.cos(lng * x_PI);
  var bd_lng = z * Math.cos(theta) + 0.0065;
  var bd_lat = z * Math.sin(theta) + 0.006;
  return [bd_lng, bd_lat];
}
/**
 * WGS84转GCj02
 */
function wgs84togcj02(lng, lat) {
  if (out_of_china(lng, lat)) {
    return [lng, lat];
  } else {
    var dlat = transformlat(lng - 105.0, lat - 35.0);
    var dlng = transformlng(lng - 105.0, lat - 35.0);
    var radlat = (lat / 180.0) * PI;
    var magic = Math.sin(radlat);
    magic = 1 - ee * magic * magic;
    var sqrtmagic = Math.sqrt(magic);
    dlat = (dlat * 180.0) / (((a * (1 - ee)) / (magic * sqrtmagic)) * PI);
    dlng = (dlng * 180.0) / ((a / sqrtmagic) * Math.cos(radlat) * PI);
    var mglat = lat + dlat;
    var mglng = lng + dlng;
    return [mglng, mglat];
  }
}
function transformlat(lng, lat) {
  var ret = -100.0 + 2.0 * lng + 3.0 * lat + 0.2 * lat * lat + 0.1 * lng * lat + 0.2 * Math.sqrt(Math.abs(lng));
  ret += ((20.0 * Math.sin(6.0 * lng * PI) + 20.0 * Math.sin(2.0 * lng * PI)) * 2.0) / 3.0;
  ret += ((20.0 * Math.sin(lat * PI) + 40.0 * Math.sin((lat / 3.0) * PI)) * 2.0) / 3.0;
  ret += ((160.0 * Math.sin((lat / 12.0) * PI) + 320 * Math.sin((lat * PI) / 30.0)) * 2.0) / 3.0;
  return ret;
}
function transformlng(lng, lat) {
  var ret = 300.0 + lng + 2.0 * lat + 0.1 * lng * lng + 0.1 * lng * lat + 0.1 * Math.sqrt(Math.abs(lng));
  ret += ((20.0 * Math.sin(6.0 * lng * PI) + 20.0 * Math.sin(2.0 * lng * PI)) * 2.0) / 3.0;
  ret += ((20.0 * Math.sin(lng * PI) + 40.0 * Math.sin((lng / 3.0) * PI)) * 2.0) / 3.0;
  ret += ((150.0 * Math.sin((lng / 12.0) * PI) + 300.0 * Math.sin((lng / 30.0) * PI)) * 2.0) / 3.0;
  return ret;
}
/**
 * 判断是否在国内，不在国内则不做偏移
 */
function out_of_china(lng, lat) {
  return lng < 72.004 || lng > 137.8347 || lat < 0.8293 || lat > 55.8271 || false;
}
/**
 *  84坐标系   转 百度
 */
function wgs84ToBD(lng, lat, whether = true) {
  var jo2 = wgs84togcj02(lng, lat);
  return whether ? gcj02tobd09(jo2[0], jo2[1]) : [lng, lat];
}

/**
 * GCJ02 转换为 WGS84
 */
function gcj02towgs84(lng, lat) {
  if (out_of_china(lng, lat)) {
    return [lng, lat];
  } else {
    var dlat = transformlat(lng - 105.0, lat - 35.0);
    var dlng = transformlng(lng - 105.0, lat - 35.0);
    var radlat = (lat / 180.0) * PI;
    var magic = Math.sin(radlat);
    magic = 1 - ee * magic * magic;
    var sqrtmagic = Math.sqrt(magic);
    dlat = (dlat * 180.0) / (((a * (1 - ee)) / (magic * sqrtmagic)) * PI);
    dlng = (dlng * 180.0) / ((a / sqrtmagic) * Math.cos(radlat) * PI);
    let mglat = lat + dlat;
    let mglng = lng + dlng;
    return [lng * 2 - mglng, lat * 2 - mglat];
  }
}

/**
 * 百度转 84坐标系
 */
let bd09towgs84 = (lng, lat) => {
  let arr = bd09togcj02(lng, lat);
  return gcj02towgs84(arr[0], arr[1]);
};

// 静态点
export function point(name, layer, lnglat, icon) {
  lnglat.forEach((item) => {
    let marker = L.marker([item.latitude, item.longitude], {
      icon: icon,
      rotationAngle: item.rotationAngle || 0,
      data: item
    });
    marker.addTo(layer);
    marker.on('click', function (e) {
      console.log('e', e.target.options.data);
      if (name == '静态点') {
        console.log('静态点点开事件');
      }
    });
  });
}

// 静态线
export function polyline() {}

// 静态圆
export function circle() {}

// 静态多边形
export function polygon() {}

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
    marker.addTo(layer);
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
  }).addTo(layer);
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
      ).addTo(layer);
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
      }).addTo(layer);
      // 画红色圆点
      L.circleMarker([lnglat[index].latitude, lnglat[index].longitude], {
        radius: 4,
        color: '#f03',
        fillColor: '#efeff6',
        fillOpacity: 1,
        weight: 2
      }).addTo(layer);
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
        }).addTo(layer);
      }
      index++;
    } else {
      L.marker([lnglat[lnglat.length - 1].latitude, lnglat[lnglat.length - 1].longitude], {
        icon: L.icon({
          iconUrl: end,
          iconSize: [28, 38],
          iconAnchor: [14, 19]
        })
      }).addTo(layer);
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
      ).addTo(layer);
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
