import { createApp } from 'vue';
// global css
import 'virtual:uno.css';
import '@/assets/styles/index.scss';
import 'element-plus/theme-chalk/dark/css-vars.css';

import 'leaflet';
import 'leaflet/dist/leaflet.css';
import '@/utils/pulse/L.Icon.Pulse';
import '@/utils/pulse/L.Icon.Pulse.css';
import 'leaflet-polylinedecorator'; //折线带箭头
import 'leaflet.markercluster'; //聚合
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import '@geoman-io/leaflet-geoman-free'; //图形绘制
import '@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css';
import '@/utils/leaflet.canvas-markers';
import '@/utils/leaflet-heat';
import 'leaflet-rotatedmarker';
import '@/utils/leaflet.motion';

// App、router、store
import App from './App.vue';
import store from './store';
import router from './router';

import './utils/leaflet.canvas-markers';

// 高亮组件
// import 'highlight.js/styles/a11y-light.css';
import 'highlight.js/styles/atom-one-dark.css';
import 'highlight.js/lib/common';
import HighLight from '@highlightjs/vue-plugin';

// svg图标
import 'virtual:svg-icons-register';
import ElementIcons from '@/plugins/svgicon';

import './permission';

// 国际化
import i18n from '@/lang/index';

// vxeTable
import VXETable from 'vxe-table';
import 'vxe-table/lib/style.css';
VXETable.setConfig({
  zIndex: 999999
});

// 修改 el-dialog 默认点击遮照为不关闭
import { ElDialog } from 'element-plus';
ElDialog.props.closeOnClickModal.default = false;

const app = createApp(App);

app.use(HighLight);
app.use(ElementIcons);
app.use(router);
app.use(store);
app.use(i18n);
app.use(VXETable);

app.mount('#app');
