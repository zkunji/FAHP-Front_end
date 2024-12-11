<template>
  <!-- d单个专家submit为1记录 -->
  <el-dialog
    v-model="dialogTableVisible"
    title="计算过程"
    destroy-on-close="true"
    width="80%"
  >
    <div class="container">
      <div class="box" v-for="(value, key) in AcommentsNumber" :key="key">
        <div>{{ key }}的模糊矩阵为={{ value }}</div>
        <hr />
      </div>
    </div>
    <br />
    <div class="container">
      <div class="box" v-for="(value, key) in AcommentsMatrix" :key="key">
        <div>{{ key }}的模糊矩阵为={{ value }}</div>
        <hr />
      </div>
    </div>
    <br />
    <div class="container">
      <div class="box" v-for="(value, key) in AfuzzyMatrix" :key="key">
        <div>{{ key }}的模糊矩阵为={{ value }}</div>
        <hr />
      </div>
    </div>
    <br />
    <div class="container">
      <div class="box" v-for="(value, key) in AmetricsWeight" :key="key">
        <div>{{ key }}的模糊矩阵为={{ value }}</div>
        <hr />
      </div>
    </div>
    <br />

    <div class="container">
      <div class="box" v-for="(value, key) in obj" :key="key">
        <div>{{ key }}的模糊矩阵为={{ value }}</div>
        <hr />
      </div>
    </div>
    <br />
    <p>结果为:{{ AcommentsResult }}</p>
    <hr />
  </el-dialog>
  <div>
    <!-- 表格内容显示区域   -->
    <el-table
      ref="multipleTableRef"
      :data="tableData"
      border
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        type="index"
        :index="indexMethod"
        label="序号"
        width="80"
      >
      </el-table-column>
      <el-table-column prop="uids" label="uids" align="center">
      </el-table-column>
      <el-table-column prop="username" label="姓名" align="center">
      </el-table-column>
      <el-table-column prop="faf_id" label="ID" align="center">
      </el-table-column>
      <el-table-column prop="expert_weights" label="权重" align="center">
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template v-slot="scope">
          <el-button @click="view(scope.row.faf_id)" type="primary" size="small"
            >查看</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <!-- <div>{{ multipleSelection }}</div> -->
    <!-- 空 -->
    <el-empty
      v-show="tableData.length === 0"
      description="请您稍等，加载较慢！！"
    />
    <!--   分页 -->
    <el-pagination
      style="position: absolute; bottom: 40px; right: 50px"
      v-model:current-page="currentPage"
      v-model:page-size="pageSize"
      :page-sizes="[1, 2, 5, 10]"
      :total="50"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      layout="sizes, prev, pager, next, jumper"
    >
    </el-pagination>
  </div>
</template>
<script setup>
import { ref } from 'vue'
import { onMounted } from 'vue'
import {
  fuzzyAlgorithmDataDetails,
  fuzzyAlgorithmDataSubject
} from '@/api/mohu'
import { ElMessage } from 'element-plus'
const currentPage = ref(1)
const pageSize = ref(10)
const dialogTableVisible = ref(false)
const uids = []
const tableData = ref([])
const AcommentsNumber = ref({})
const AcommentsMatrix = ref({})
const AcommentsResult = ref([])
const AfuzzyMatrix = ref({})
const AmetricsWeight = ref({})
const obj = ref({
  决策机制: [
    [1, 2],
    [3, 4]
  ],
  会计控制: [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9]
  ]
})
console.log(obj.value[12])
const multipleSelection = ref([])
const handleSelectionChange = (val) => {
  multipleSelection.value = val
  // console.log(val)
}
const indexMethod = (index) => {
  return index + 1
}
onMounted(() => {
  getAllUsers()
})
const view = async (faf_id) => {
  const res = await fuzzyAlgorithmDataSubject(faf_id)
  console.log(res.data)
  const {
    commentsNumber,
    commentsMatrix,
    commentsResult,
    fuzzyMatrix,
    metricsWeight
  } = res.data.data
  console.log(
    'commentsNumber:',
    commentsNumber,
    'commentsMatrix:',
    commentsMatrix,
    'commentsResult:',
    commentsResult,
    'fuzzyMatrix:',
    fuzzyMatrix,
    'metricsWeight:',
    metricsWeight
  )
  dialogTableVisible.value = true
  AcommentsNumber.value = commentsNumber
  AcommentsMatrix.value = commentsMatrix
  AcommentsResult.value = commentsResult
  AfuzzyMatrix.value = fuzzyMatrix
  AmetricsWeight.value = metricsWeight
}
async function getAllUsers() {
  //   const res = await userGetAllInfoService(currentPage.value, pageSize.value)
  console.log('1131', currentPage.value, pageSize.value)
  const res = await fuzzyAlgorithmDataDetails(currentPage.value, pageSize.value)
  console.log('历史数据：', res)
  tableData.value = res.data.data
}
function handleSizeChange(val) {
  console.log(`每页 ${val} 条`)
  getAllUsers()
}

function handleCurrentChange(val) {
  console.log(`当前页: ${val}`)
  getAllUsers()
}
</script>
<style scoped>
.commit {
  position: absolute;
  text-align: center;
  bottom: 50px;
  color: red;
}
td,
th {
  width: 300px;
  height: 20px;
  padding: 4px;
  border: 1px solid#000;
  text-align: auto;
}
table {
  margin: 0 auto;
  box-sizing: border-box;
  border-collapse: collapse;
  border: 1px solid #000;
  /* background: #e9eff7; */
  text-align: center;
}
input {
  border: none;
  /* background: #e9eff7; */
  text-align: center;
  outline: none;
  font-size: 18px;
  width: 100%;
}
.demo-drawer__footer {
  margin-top: 18px;
}
</style>
