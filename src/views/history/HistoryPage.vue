<template>
  <el-table
    :row-style="changRed"
    ref="singleTableRef"
    :data="tableData"
    highlight-current-row
    style="width: 100%"
    @current-change="handleCurrentChange"
    @selection-change="handleSelectionChange"
  >
    <el-table-column type="selection" width="55" />
    <el-table-column type="index" width="100" label="序号" align="center" />
    <el-table-column property="created_time" label="时间" align="center" />
    <el-table-column property="alias" label="名称" align="center" />
    <el-table-column property="submit" label="完整性" align="center">
      <template v-slot="scope">
        <span>{{ scope.row.submit === -1 ? '不完整' : '完整' }}</span>
      </template>
    </el-table-column>
    <el-table-column label="操作" align="center">
      <template v-slot="scope">
        <el-button type="primary" @click="view(scope.row.afd_id)"
          >查看</el-button
        >
      </template>
    </el-table-column>
    <el-table-column label="选择" align="center">
      <template v-slot="scope">
        <el-button
          :disabled="scope.row.submit === -1"
          type="primary"
          @click="toOne(scope.row, scope.row.afd_id)"
          >传递</el-button
        >
      </template>
    </el-table-column>
  </el-table>
  <div class="demo-pagination-block">
    <el-pagination
      v-model:current-page="currentPage"
      :page-size="10"
      :background="true"
      layout="total, prev, pager, next"
      :total="total"
      @current-change="handleCurrentChange"
    />
  </div>
  <!-- <el-button
    type="danger"
    @click="removeHistory"
    :disabled="sections.length === 0"
    style="margin-top: 20px"
    >批量删除</el-button
  > -->

  <el-drawer
    size="90%"
    v-model="drawer"
    title="结果"
    direction="ttb"
    :before-close="handleClose"
  >
    <el-table
      :data="Data"
      border
      height="100%"
      :header-cell-style="{
        padding: '4px', // 设置Table表头单元内边距
        backgroundColor: '#e7f0ff', // 设置Table表头背景颜色
        borderColor: '#b6d1ff', // 设置Table表头边框颜色
        color: '#000', // 设置Table表头文字颜色
        fontSize: '13px', // 设置Table表头文字大小
        fontWeight: 'normal' // 设置Table表头文字粗细
      }"
      :span-method="handleSpanMethod"
      :row-class-name="handleRowClassName"
      @cell-mouse-enter="handleCellMouseEnter"
      @cell-mouse-leave="handleCellMouseLeave"
    >
      <el-table-column prop="firstAlias" label="一级指标"> </el-table-column>
      <el-table-column prop="firstWeight" label="一级指标权重">
      </el-table-column>
      <el-table-column prop="secondAlias" label="二级指标"> </el-table-column>
      <el-table-column prop="secondWeight" label="二级指标权重">
      </el-table-column>
      <el-table-column prop="score" label="评价"> </el-table-column>
      <el-table-column prop="comment" label="备注"> </el-table-column>
      <el-table-column label="查看文件" width="200">
        <template v-slot="scope">
          <el-button
            type="primary"
            @click="viewFile(scope.row.asdId, scope.row.secondAlias)"
            >查看</el-button
          >
        </template>
      </el-table-column>
    </el-table>
  </el-drawer>
  <el-empty v-show="tableData.length === 0" description="空历史" />
  <p class="commit">
    注：红色字体所在行为传递给管理员的最终数据(不完整数据无法传递)
  </p>
</template>

<script setup>
import {
  getPerlResultService,
  getFinalResultService,
  viewFileService,
  toOneService,
  removeHistoryService
} from '@/api/index'
</script>
<script>
import { ElMessage } from 'element-plus'
export default {
  data() {
    return {
      tableData: [],
      Data: [],
      drawer: false,
      afd_id: '',
      toOneFlag: false,
      selectRow: 1,
      currentPage: 1,
      total: 0,
      sections: []
    }
  },
  mounted() {
    this.getData()
    ElMessageBox.confirm(
      '请您选择一项历史记录传递给管理员，作为最终的执标评分数据吧！！',
      '温馨提示',
      {
        type: 'warning',
        confirmButtonText: '确认',
        cancelButtonText: '取消'
      }
    )
  },
  methods: {
    async removeHistory() {
      console.log(this.sections)
      const res = await removeHistoryService(this.sections)
      console.log(res)
      this.getData()
    },
    handleSelectionChange(section) {
      this.sections = section.map((item) => item.afd_id)
      console.log(this.sections)
    },
    changRed({ row }) {
      if (row.submit == '1') {
        // 变颜色的条件
        return {
          color: 'red' // 这个return的就是样式 可以是color 也可以是backgroundColor
        }
      }
    },
    async toOne(row, afd_id) {
      if (row.submit === -1) {
        ElMessage.error('该项数据不完整，无法传递，请重新选择')
        return
      }
      console.log(row, afd_id)
      this.selectRow = 1
      const res = await toOneService(afd_id)
      if (res.data.code === 200) {
        ElMessage.success('传递成功')
      }
      this.selectRow = 1
      console.log('toOne', res)
      this.getData()
    },
    async viewFile(asd_id, secondAlias) {
      // 查看文件接口
      console.log('afd_id', this.afd_id, asd_id, secondAlias)
      const res = await viewFileService(this.afd_id, asd_id, secondAlias)
      console.log('res', res)
    },
    async view(afd_id) {
      console.log('afd_id', afd_id)
      this.afd_id = afd_id
      const res = await getFinalResultService(afd_id)
      console.log('res', res)
      this.Data = res.data.data.result
      this.drawer = true
    },
    async getData() {
      const res = await getPerlResultService(this.currentPage)
      console.log('res', res)
      this.tableData = res.data.data
      this.total = res.data.total
    },
    handleCurrentChange() {
      this.getData()
    }
  }
}
</script>
<style lang="less" scoped>
.merge-cell {
  display: flex;
  flex-direction: column;
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;

  .merge-cell-navbar {
    position: relative;
    width: 100%;
    height: 100px;
    background-color: #686868;
    text-align: center;
    line-height: 100px;
    color: #fff;
    font-size: 25px;
  }

  .merge-cell-content {
    position: relative;
    flex: 1;
    padding: 100px;
    overflow: hidden;

    .merge-cell-content-container {
      position: relative;
      width: 100%;
      height: 100%;
      overflow: auto;
    }
  }

  :deep(.el-table) {
    td .cell {
      padding: 2.5px 0;
      color: #686868;
      font-size: 13px;
    }

    .first_row td:nth-child(1),
    .second_row td:nth-child(1),
    .first_row.second_row td:nth-child(2) {
      background: #f5f7fa !important;
    }
  }

  /* ^ 设置Table表格边框颜色 */
  :deep(.el-table--border) {
    &::before {
      background-color: #b6d1ff;
    }
    &::after {
      background-color: #b6d1ff;
    }
    .el-table__cell {
      border-color: #b6d1ff;
    }
    .el-table__inner-wrapper {
      &::before {
        background-color: #b6d1ff;
      }
      &::after {
        background-color: #b6d1ff;
      }
      .el-table__border-left-patch {
        background-color: #b6d1ff;
      }
    }
  }
  /* / 设置Table表格边框颜色 */
}

.el-table .warning-row {
  --el-table-tr-bg-color: var(--el-color-warning-light-9);
}
.el-table .success-row {
  --el-table-tr-bg-color: var(--el-color-success-light-9);
}
.el-table .warning-row {
  background: oldlace;
}

.el-table .success-row {
  background: #f0f9eb;
}
.commit {
  position: absolute;
  text-align: center;
  bottom: 50px;
  color: red;
}
.demo-pagination-block {
  position: absolute;
  bottom: 100px;
  right: 80px;
}
</style>
