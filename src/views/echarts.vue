<script setup lang="ts">
import * as echarts from 'echarts';
import dataConnectUnit from '@/components/dataConnectUnit.vue';
import model from '@/components/model.vue';
</script>

<template>
  <div class="ecahrtsBox">
    <div>
      <dataConnectUnit></dataConnectUnit>
    </div>
    <div>
      <model></model>
    </div>
  </div>
</template>

<style lang="less" scoped>
.ecahrtsBox {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;

  div {
    width: 50%;
    height: 500px;
  }
}
</style>
