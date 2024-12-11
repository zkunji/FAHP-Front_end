<script setup>
import stardTable from '@/components/stardTable.vue'
// import {el-icon-error} from '@element-plus/icons'
import { ref } from 'vue'
defineProps({
  title: {
    required: true,
    type: String
  }
})
const tableFlag = ref(false)
const closeTable = () => {
  tableFlag.value = !tableFlag.value
}
</script>

<template>
  <el-card class="page-container">
    <template #header>
      <div class="header">
        <span>{{ title }}</span>
        <div class="extra">
          <slot name="extra"></slot>
        </div>
      </div>
    </template>
    <slot></slot>
    <div class="table-container">
      <el-button type="primary" icon="el-icon-close" @click="closeTable"
        >切换</el-button
      >
      <stardTable v-if="tableFlag"></stardTable>
    </div>
  </el-card>
</template>

<style lang="scss" scoped>
.page-container {
  min-height: 100%;
  box-sizing: border-box;
  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
}
.table-container {
  // 缩小为0.5倍
  transform: scale(0.5);
  width: 400px;
  height: 200px;
  position: absolute;
  left: 120px;
  bottom: 60px;
  opacity: 0.8;
}
</style>
