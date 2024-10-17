import router from './router';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';

NProgress.configure({ showSpinner: false });

const whiteList = ['/map', '/echarts']; // 白名单

router.beforeEach(async (to, from, next) => {
  if (whiteList.indexOf(to.path as string) !== -1) {
    next();
  }
});

router.afterEach((to, from) => {
  NProgress.done();
});
