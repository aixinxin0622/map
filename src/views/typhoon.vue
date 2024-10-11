<template>
    <div class="homes">
        <div class="home" id="map"></div>
        <div class="typhoon">
            <el-select v-model="value" placeholder="请选择" @change="mychange">
                <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"> </el-option>
            </el-select>
        </div>
        <div class="typhoon1">
            <el-select v-model="value1" placeholder="请选择" @change="mychange1">
                <el-option v-for="item in typhoonList" :key="item.value" :label="item.label" :value="item.value"> </el-option>
            </el-select>
        </div>
    </div>
</template>

<script>
import * as L from "leaflet";
import axios from "axios";
export default {
    // eslint-disable-next-line vue/multi-word-component-names
    name: "typhoon",
    components: {},
    data() {
        return {
            map: null,
            options: [
                { value: "2024", label: "2024" },
                { value: "2023", label: "2023" },
                { value: "2022", label: "2022" },
                { value: "2021", label: "2021" },
                { value: "2020", label: "2020" },
                { value: "2019", label: "2019" },
                { value: "2018", label: "2018" },
            ],
            value: "2024",
            typhoonList: [],
            value1: "",
            TyphoonLineLayer: null, //台风图层
            typhoonArea: null, // 台风圈-预测-图层
            warningLayer: null, // 警戒线-图层
        };
    },
    mounted() {
        this.setupMap();
        this.TyphoonLineLayer = L.featureGroup([]);
        this.map.addLayer(this.TyphoonLineLayer);

        this.typhoonArea = L.featureGroup([]);
        this.map.addLayer(this.typhoonArea);

        this.warningLayer = L.featureGroup([]);
        this.map.addLayer(this.warningLayer);

        this.warning();
        this.mychange();
    },
    methods: {
        // 初始化 地图
        setupMap() {
            this.map = L.map("map", {
                attributionControl: false,
                zoomControl: false,
                maxZoom: 19,
                crs: L.CRS.EPSG3857,
                center: [33.24068253457369, 121.73950195312501],
                zoom: 5,
            });
            L.tileLayer("http://t5.tianditu.gov.cn/DataServer?T=ter_w&X={x}&Y={y}&L={z}&tk=189e6787797aa91b77083f384a289820", {}).addTo(
                this.map
            );
            this.map.on("zoomend", () => {
                if (this.map.getZoom() === 4) {
                    this.warningLayer !== null ? this.warningLayer.clearLayers() : "";
                } else if (this.map.getZoom() === 5) {
                    this.warning();
                }
            });
        },
        mychange() {
            axios.get(`https://typhoon.slt.zj.gov.cn/Api/TyphoonList/${this.value}`, {}).then((res) => {
                // 在这里处理返回的数据
                console.log(res.data);
                let temp = res.data;
                this.typhoonList = [];
                temp.forEach((res) => {
                    let item = {
                        value: res.tfid,
                        label: res.name,
                    };
                    this.typhoonList.push(item);
                });
            });
        },
        mychange1() {
            axios.get(`https://typhoon.slt.zj.gov.cn/Api/TyphoonInfo/${this.value1}`, {}).then((res) => {
                // 在这里处理返回的数据
                console.log(res.data);
                this.TyphoonLineLayer !== null ? this.TyphoonLineLayer.clearLayers() : "";
                this.typhoonArea !== null ? this.typhoonArea.clearLayers() : "";
                this.typhoonTrack(res.data);
            });
        },
        // 台风轨迹动画
        typhoonTrack(data) {
            // eslint-disable-next-line no-import-assign
            L.Typhoon = L.Polygon.extend({
                initialize: function (t, e, i) {
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
                        var path_svg = "M" + t.x + "," + (t.y - e_northeast);
                        var path_vml = "M" + t.x + "," + (t.y - e_northeast);
                        path_svg += "A" + e_northeast + "," + e_northeast + ",0,0,1," + (t.x + e_northeast) + "," + t.y;
                        path_vml += " ae " + t.x + "," + t.y + " " + e_northeast + "," + e_northeast + " " + 65535 * 450 + "," + -5898150;
                        var e_southeast = this._radius_southeast;
                        path_svg += "L" + (t.x + e_southeast) + "," + t.y;
                        path_svg += "A" + e_southeast + "," + e_southeast + ",0,0,1," + t.x + "," + (t.y + e_southeast);
                        path_vml += " ae " + t.x + "," + t.y + " " + e_southeast + "," + e_southeast + " " + 65535 * 360 + "," + -5898150;
                        var e_southwest = this._radius_southwest;
                        path_svg += "L" + t.x + "," + (t.y + e_southwest);
                        path_svg += "A" + e_southwest + "," + e_southwest + ",0,0,1," + (t.x - e_southwest) + "," + t.y;
                        path_vml += " ae " + t.x + "," + t.y + " " + e_southwest + "," + e_southwest + " " + 65535 * 270 + "," + -5898150;
                        var e_northwest = this._radius_northwest;
                        path_svg += "L" + (t.x - e_northwest) + "," + t.y;
                        path_svg += "A" + e_northwest + "," + e_northwest + ",0,0,1," + t.x + "," + (t.y - e_northwest) + "z";
                        path_vml +=
                            " ae " + t.x + "," + t.y + " " + e_northwest + "," + e_northwest + " " + 65535 * 180 + "," + -5898150 + "X";
                        this.svgPath = L.Browser.svg ? path_svg : path_vml;
                        return L.Browser.svg ? path_svg : path_vml;
                    }
                    return "";
                },
                beforeAdd: function (map) {
                    this._renderer = map.getRenderer(this);
                },
                onAdd: function (map) {
                    this.projectLatlngs();
                    this.getTyphoonPath();
                    this._renderer._initPath(this);
                    this._reset();
                    this._path.setAttribute("d", this.svgPath);
                    this._renderer._addPath(this);
                    this._setStyle(this._style);

                    map.on({
                        moveend: () => {
                            this.projectLatlngs();
                            this.getTyphoonPath();
                            this._path.setAttribute("d", this.svgPath);
                        },
                        zoomstart: () => {
                            this._path.setAttribute("d", this.svgPath);
                        },
                    });
                },

                getLatLng: function () {
                    return this._latlng;
                },
                _setStyle: function (style) {
                    L.setOptions(this, style);
                    if (this._renderer) {
                        this._renderer._updateStyle(this);
                    }
                    return this;
                },
                _getLatRadius: function (r) {
                    return (r / 40075017) * 360;
                },
                _getLngRadius: function (lr) {
                    return lr / Math.cos((Math.PI / 180) * this._latlng.lat);
                },
            });

            // eslint-disable-next-line no-import-assign
            L.typhoon = function (t, e, i) {
                return new L.Typhoon(t, e, i);
            };

            this.map.setView([data.points[0].lat, data.points[0].lng], 5);
            // 添加一个线数组
            var polyline = L.polyline([], { color: "black", weight: 1 }).addTo(this.TyphoonLineLayer);
            let temp = [];
            data.points.forEach((item) => {
                temp.push([item.lat, item.lng]);
            });
            var index = 0;
            var self = this;
            var intervalId = setInterval(function () {
                if (index < temp.length) {
                    polyline.addLatLng(L.latLng(temp[index][0], temp[index][1]));
                    L.circleMarker(temp[index], { radius: 6, color: "#434343", fillColor: "#0062fe", fillOpacity: 1 }).addTo(
                        self.TyphoonLineLayer
                    ).bindTooltip(`
                         台风经度:${data.points[index].lng}<br>
                         台风纬度:${data.points[index].lat}<br>
                         台风气压:${data.points[index].pressure}<br>
                         台风强度:${data.points[index].strong}<br>
                         台风速度:${data.points[index].speed}<br>
                         台风时间:${data.points[index].time}<br>
                        `);
                    self.typhoonArea !== null ? self.typhoonArea.clearLayers() : ""; //移除预测风圈
                    L.marker(temp[index], {
                        icon: L.icon({
                            iconUrl: require("../assets/typhoon.gif"),
                            className: "typhoon-icon",
                            iconSize: [40, 40],
                            iconAnchor: [20, 20],
                        }),
                    }).addTo(self.typhoonArea);
                    // 添加预测轨迹
                    let tfyc = data.points[index].forecast;
                    tfyc.forEach((res) => {
                        let colorArr = {
                            中国: "red",
                            中国香港: "#febd00",
                            中国台湾: "#ff00fe",
                            日本: "#24bc00",
                            美国: "#04faf7",
                        };
                        let color = colorArr[res.tm];
                        let a = [];
                        res.forecastpoints.forEach((item) => {
                            a.push([item.lat, item.lng]);
                            L.circleMarker([item.lat, item.lng], { radius: 2, color: color, fillColor: color, fillOpacity: 1 }).addTo(
                                self.typhoonArea
                            );
                        });
                        L.polyline(a, { weight: 1, color: color, dashArray: [6, 6] }).addTo(self.typhoonArea);
                    });
                    let center = temp[index];
                    // 判断风圈是否有值
                    if (data.points[index].radius7 !== "") {
                        let values = data.points[index].radius7.split("|");
                        let result = {
                            ne: parseInt(values[0]),
                            nw: parseInt(values[1]),
                            se: parseInt(values[2]),
                            sw: parseInt(values[3]),
                        };
                        let e = result;
                        let color = {
                            color: "#F4D000",
                            weight: 1,
                            opacity: 1,
                            fill: true,
                            fillColor: "#F4D000",
                            fillOpacity: 0.3,
                            clickable: true,
                        };
                        L.typhoon(center, e, color).addTo(self.typhoonArea);
                    }
                    index++;
                } else {
                    clearInterval(intervalId);
                }
            }, 100);
        },
        // 警戒线
        warning() {
            //24小时警戒线
            var poline24 = [
                [34, 127],
                [22, 127],
                [18, 119],
                [11, 119],
                [4.5, 113],
                [0, 105],
            ];

            L.polyline([poline24], { color: "#ee8c06", weight: "1.5" }).addTo(this.map);
            var content = "<div style='color:#ee8c06'>24小时警戒线</div>";
            var myIcon = L.divIcon({
                html: content,
                className: "my-div-icon",
                iconSize: 10,
            });
            //中心点位
            L.marker([31, 127], { icon: myIcon }).addTo(this.warningLayer);
            //48小时警戒线
            var poline48 = [
                [34, 132],
                [15, 132],
                [0, 120],
                [0, 105],
            ];
            L.polyline([poline48], { color: "#949312", weight: "2", dashArray: [5, 6] }).addTo(this.map);
            var content1 = "<div style='color:#1ddb63;'>48小时警戒线</div>";
            var myIcon1 = L.divIcon({
                html: content1,
                className: "my-div-icon",
                iconSize: 10,
            });
            //中心点位
            L.marker([28, 132], { icon: myIcon1 }).addTo(this.warningLayer);
        },
    },
    directives: {
        drag: function (el) {
            let dragBox = el; //获取当前元素
            dragBox.onmousedown = (e) => {
                //算出鼠标相对元素的位置
                let disX = e.clientX - dragBox.offsetLeft;
                let disY = e.clientY - dragBox.offsetTop;
                document.onmousemove = (e) => {
                    //用鼠标的位置减去鼠标相对元素的位置，得到元素的位置
                    let left = e.clientX - disX;
                    let top = e.clientY - disY;

                    // 判断是否超出界面，如果超出则限制在界面内
                    if (top < 0) {
                        top = 0;
                    }
                    if (left < 0) {
                        left = 0;
                    }
                    if (top + dragBox.offsetHeight > window.innerHeight) {
                        top = window.innerHeight - dragBox.offsetHeight;
                    }
                    if (left + dragBox.offsetWidth > window.innerWidth) {
                        left = window.innerWidth - dragBox.offsetWidth;
                    }

                    //移动当前元素
                    dragBox.style.cursor = "all-scroll";
                    dragBox.style.left = left + "px";
                    dragBox.style.top = top + "px";
                };
                document.onmouseup = () => {
                    //鼠标弹起来的时候不再移动
                    dragBox.style.cursor = "default";

                    document.onmousemove = null;
                    //预防鼠标弹起来后还会循环（即预防鼠标放上去的时候还会移动）
                    document.onmouseup = null;
                };
            };
        },
    },
};
</script>
<style lang="less" scoped>
.homes {
    width: 100%;
    height: 100vh;
    .home {
        width: 100%;
        height: 100%;
    }
    .typhoon {
        width: 200px;
        position: absolute;
        top: 30px;
        left: 30px;
        z-index: 403;
    }
    .typhoon1 {
        width: 200px;
        position: absolute;
        top: 30px;
        left: 250px;
        z-index: 403;
    }
}
</style>
