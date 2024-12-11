<template>
  <div>
    <el-table
      :row-style="changRed"
      :data="tableData"
      border
      height="100%"
      align="center"
      :header-cell-style="{
        padding: '4px', // 设置Table表头单元内边距
        backgroundColor: '#e7f0ff', // 设置Table表头背景颜色
        borderColor: '#b6d1ff', // 设置Table表头边框颜色
        color: '#000', // 设置Table表头文字颜色
        fontSize: '16px', // 设置Table表头文字大小
        fontWeight: 'normal' // 设置Table表头文字粗细
      }"
      :row-class-name="handleRowClassName"
      @cell-mouse-enter="handleCellMouseEnter"
      @cell-mouse-leave="handleCellMouseLeave"
    >
      <!-- :span-method="handleSpanMethod"   行合并 -->
      <el-table-column prop="firstAlias" label="一级指标"> </el-table-column>
      <el-table-column prop="firstWeight" label="一级指标权重">
      </el-table-column>
      <el-table-column prop="secondAlias" label="二级指标"> </el-table-column>
      <el-table-column prop="secondWeight" label="二级指标权重">
      </el-table-column>
      <el-table-column prop="score" label="评价"> </el-table-column>
      <el-table-column prop="comment" label="备注"> </el-table-column>
      <el-table-column prop="uid" label="选择文件" width="200">
        <template v-slot="scope">
          <el-upload
            class="upload"
            ref="upload"
            action=""
            :before-upload="beforeUpload"
            :file-list="fileList"
            :auto-upload="false"
            :http-request="uploadFile"
            :on-change="handleChange"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :show-file-list="false"
            multiple="multiple"
          >
            <el-button
              @click="controlShow(scope.row)"
              type="primary"
              width="200"
            >
              选择文件<el-icon class="el-icon--right"
                ><Upload
              /></el-icon> </el-button
          ></el-upload>
        </template>
      </el-table-column>
      <el-table-column prop="uid" label="保存" width="200">
        <template v-slot="scope">
          <!-- 准备一个提交按钮 -->
          <el-button
            type="primary"
            @click="onSubmit(scope, scope.row.asdId, scope.row.secondAlias)"
            width="200"
            >提交<el-icon class="el-icon--right"><Checked /></el-icon
          ></el-button>
        </template>
      </el-table-column>
    </el-table>
    <p class="commit">注：红色字体所在行为为已传文件</p>
  </div>
</template>

<script setup>
import axios from 'axios'
import { Checked, Upload } from '@element-plus/icons-vue'
import { getFinalResultService } from '@/api/index'
import { userUploadFiles } from '@/api/user'
</script>
<script>
export default {
  data() {
    return {
      tableData: [],
      fileList: [],
      multiple: true,
      formArray: [],
      afdId: ''
    }
  },
  mounted() {
    this.getData()
    ElMessageBox.confirm(
      '请您请评价为"非优秀"的指标，上传文件说明吧！！',
      '温馨提示',
      {
        type: 'warning',
        confirmButtonText: '确认',
        cancelButtonText: '取消'
      }
    )
  },
  methods: {
    // 使用上传文件之前的钩子来进行自定义文件上传
    beforeUpload(file, id) {
      let fd = new FormData()
      fd.append('file', file)
      const obj = {
        name: '',
        file: ''
      }
      dataSet.fileList = []
      axios
        .post('/api/common/upload', fd, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
        .then((res) => {
          // 上传成功，返回图片完整路径
          console.log(res)
        })
      // 阻止默认的上传操作, 就不会产生如下图action为空报404错误的情况
      return false
    },
    //点击上传文件触发的额外事件,清空fileList
    delFile() {
      // this.fileList = []
    },
    handleChange(file, fileList) {
      this.fileList = fileList
      console.log('fileList:', this.fileList)
    },
    //自定义上传文件
    uploadFile(file) {
      this.formData.append(file.name, file.file)
      console.log('file', file.file)
    },
    //删除文件
    handleRemove(file, fileList) {
      console.log(file, fileList)
    },
    // 点击文件
    handlePreview(file) {
      console.log(file)
    },
    controlShow(row) {
      console.dir(row)
    },
    changRed({ row }) {
      if (row.isUpload === true) {
        // 变颜色的条件
        return {
          color: 'red' // 这个return的就是样式 可以是color 也可以是backgroundColor
        }
      }
    },
    //保存按钮
    async onSubmit(scope, asd_id, secondAlias) {
      if (!this.fileList.length) {
        ElMessage.error('请先选择要上传的文件')
        return
      }
      console.log('afdId,asd_id', this.afdId, asd_id)
      let formData = new FormData()
      for (let i = 0; i < this.fileList.length; i++) {
        console.log('this.fileList[i].raw', this.fileList[i].raw)
        formData.append('files', this.fileList[i].raw) //拿到存在fileList的文件存放到formData中
      }
      // 添加其他字段到 FormData 对象
      formData.append('afd_id', this.afdId)
      formData.append('asd_id', asd_id) // 假设 asd_id 是一个变量
      formData.append('second_alias', secondAlias)
      const res = await userUploadFiles(formData)
      this.fileList = []
      if (res.data.code == 200) {
        ElMessage.success('文件上传成功')
        scope.row.isUpload = true
        console.log('row', scope)
        this.changRed(scope.row)
      } else {
        ElMessage.warning('文件上传失败')
      }
    },
    async getData() {
      console.log('this.tableData', this.tableData)
      const res = await getFinalResultService()
      console.log('res', res)
      this.tableData = res.data.data.result
      this.afdId = res.data.data.afdId
      console.log('this.afdId', this.afdId, 'this.tableData', this.tableData)
    },
    handleSpanMethod({
      row, // 行
      column, // 列
      rowIndex, // 行索引
      columnIndex // 列索引
    }) {
      if (columnIndex === 0 || columnIndex === 1) {
        // 获取当前单元格的值
        const currentValue = row[column.property]

        // 获取上一行相同列的值
        const preRow = this.tableData[rowIndex - 1]
        const preValue = preRow ? preRow[column.property] : null

        // 如果当前值和上一行的值相同，则将当前单元格隐藏
        if (currentValue === preValue) {
          return { rowspan: 0, colspan: 0 }
        } else {
          // 否则计算当前单元格应该跨越多少行
          let rowspan = 1
          for (let i = rowIndex + 1; i < this.tableData.length; i++) {
            const nextRow = this.tableData[i]
            const nextValue = nextRow[column.property]
            if (nextValue === currentValue) {
              rowspan++
            } else {
              break
            }
          }
          return { rowspan, colspan: 1 }
        }
      }
    },
    handleCellMouseEnter(row, column, cell, event) {
      this.second_row = this.tableData.filter((item) => {
        return this.filterSameKeys(item, row, ['zone', 'career'])
      })[0]

      this.first_row = this.tableData.filter((item) => {
        return this.filterSameKeys(item, row, ['zone'])
      })[0]
    },
    handleCellMouseLeave() {
      this.currentIndex = ''
      this.currentColumnIndex = ''
      this.first_row = {}
      this.second_row = {}
    },
    filterSameKeys(item, row, keys) {
      let flag = true
      keys.forEach((key) => {
        flag = flag && item[key] === row[key]
      })
      return flag
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
.commit {
  position: absolute;
  text-align: center;
  bottom: 20px;
  color: red;
}
</style>
