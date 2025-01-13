/**
 * 船舶添加标签(碰撞检测)
 */
let map = null; // 地图对象
let tagLayer = null; // 地图对象
let offsetLengthZoomMap = {
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

let newShipList = []; // 储存临时船舶坐标数据
/**
 * 初始化，必须调用
 * @param Map
 * @param layer
 */
export function mapMarkerTagInit(Map, layer) {
  map = Map;
  tagLayer = layer;
  //map.centerAndZoom(new window.BMap.Point(121.826, 29.99), 16) // 初始化地图,设置中心点坐标和地图级别
}
/**
 * 更新标签数量与位置
 * @param { Arrar } shipList //船舶数据
 * @param { Number } offset  //标签垂直方向偏移
 * @param { Object } style   //标签样式，规则采用百度地图style规则 。*已废弃不准传
 * @returns
 */
export function updateMapMarkerTag(
  shipList,
  offset = -10,
  style = { backgroundColor: ' rgb(255 255 255 / 75%)', 'border': '1px solid rgb(255 255 255 / 80%)' }
) {
  // removeOverlay('markerTag')
  tagLayer.clearLayers();
  let zoom = map.getZoom();
  //console.log()
  if (zoom <= 13) {
    return;
  }
  newShipList = [];
  // console.log(shipList)
  for (let i = 0; i < shipList.length; i++) {
    // 获取 84转百度 经纬度
    let [lng, lat] = wgs84ToBD(parseFloat(shipList[i].lon), parseFloat(shipList[i].lat), false);
    // 获取名称字符串
    let str = shipList[i].name ? shipList[i].name : shipList[i].mmsi;
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
    newShipTarget.lon = lng - offsetLengthLngD;
    newShipTarget.lat = lat - offsetLengthLatD;
    //获取无碰撞旋转后的角度点位
    let [is, newPoint] = getAngleType(newShipTarget, getLenPx(str, 15.636) + 10 + 2); //宽度算上 padding,border
    //判断是否渲染
    if (is) {
      continue;
    }
    // console.log('point:',point,'newPoint：',newPoint)
    var polyline = L.polyline([point, newPoint], { color: '#000', weight: 0.5 }).addTo(tagLayer);
    if (shipList[i].targettype === 3) {
      //雷达目标
      var icon = L.divIcon({
        className: 'ship-tag',
        html: `<div  style="display: inline-block;width: auto;;background: #fffaa7;border: #ffda4b 1px solid;white-space: nowrap;" title="${str.length}">${shipList[i].targetid}</div>`
        // , iconAnchor: [50,50],
        // iconSize:[100,100],
      });
      var marker = L.marker(newPoint, { icon: icon }).addTo(tagLayer);
    } else {
      //船舶目标
      var icon = L.divIcon({
        className: 'ship-tag',
        html: `<div  style="display: inline-block;width: auto;;background: #0fe3fe;border: #2ac06d 1px solid;white-space: nowrap;" title="${str.length}">${str}</div>`
        // , iconAnchor: [50,50],
        // iconSize:[100,100],
      });
      var marker = L.marker(newPoint, { icon: icon }).addTo(tagLayer);
    }
    // // --- 渲染标签 ---
    // let offsetPoint = newPoint
    // let label  = new BMap.Label(str,{
    //   position:offsetPoint,
    //   offset: new BMap.Size(0, offset)
    // })
    // label.imei = '船舶名称标签'
    // label.setZIndex(9999)
    // label.setStyle(style)
    // label.markName = 'markerTag'
    // let pois = []
    //     pois.push(point);
    //     pois.push(offsetPoint);
    //
    // let polyline =new BMap.Polyline(pois, {
    //     enableEditing: false,//是否启用线编辑，默认为false
    //     //enableClicking: true,//是否响应点击事件，默认为true
    //     strokeWeight:'1',//折线的宽度，以像素为单位
    //     strokeOpacity: 1,//折线的透明度，取值范围0 - 1
    //     strokeColor:"#222" //折线颜色
    // });
    // polyline.imei = '船舶名称标签'
    // polyline.markName = 'markerTag'
    // map.addOverlay(label)
    // map.addOverlay(polyline)
  }
}
/**
 * 获取角度（决定是否旋转，以及旋转多少）
 * @param { Objcet } item
 * @param {字符宽度} length
 * @returns
 */
function getAngleType(item, length) {
  let [lng, lat] = [item.lon, item.lat];
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
 * 删除覆盖物
 * @param { String } imei
 * @returns undefined
 */
function removeOverlay(imei) {
  if (imei == '') {
    //取消所有覆盖物
    map.clearOverlays();
  } else {
    if (map === null) {
      return;
    }
    let allOverlay = map.getOverlays();
    //console.log(allOverlay);
    //console.log(this.map.getPanes());
    for (let i = 0; i < allOverlay.length; i++) {
      if (allOverlay[i].markName === imei) {
        //allOverlay[i].enableMassClear();
        // console.log(allOverlay[i])
        //console.log('删除执行')
        map.removeOverlay(allOverlay[i]); //
      }
    }
  }
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

/*-------( - _-)------------转换工具--------(-_ - )-----------------------*/
/*
 *  下面的只是工具直接拿过来用就行
 *
 *   wgs84ToBD 84坐标系   转 百度
 *
 *   bd09towgs84 百度转 84坐标系
 *
 *
 *
 *
 *
 *
 */
/*-----------------------------------------------------------------------*/

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
 * 百度转 84坐标系
 */
let bd09towgs84 = (lng, lat) => {
  let arr = bd09togcj02(lng, lat);
  return gcj02towgs84(arr[0], arr[1]);
};
