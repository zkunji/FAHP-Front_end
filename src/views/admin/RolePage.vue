<template>
  <!-- d单个专家submit为1记录 -->
  <el-dialog
    v-model="dialogTableVisible"
    title="结果"
    destroy-on-close="true"
    width="80%"
  >
    <el-table
      :data="PersonData"
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
      <el-table-column prop="comment" label="备注" width="300">
      </el-table-column>
      <el-table-column label="查看文件">
        <template v-slot="scope">
          <el-button
            type="primary"
            @click="viewFile(scope.row.asdId, scope.row.secondAlias)"
            >查看</el-button
          >
        </template>
      </el-table-column>
    </el-table>
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
      <el-table-column type="selection" width="40" :selectable="selectable" />
      <el-table-column
        type="index"
        :index="indexMethod"
        label="序号"
        width="80"
      >
      </el-table-column>
      <el-table-column prop="account" label="账号" align="center">
      </el-table-column>
      <el-table-column prop="username" label="姓名" align="center">
      </el-table-column>
      <el-table-column
        prop="sex"
        label="性别"
        width="80"
        :formatter="genderFormatter"
        align="center"
      >
      </el-table-column>
      <el-table-column prop="phone" label="电话" width="180" align="center">
      </el-table-column>
      <el-table-column prop="email" label="邮箱" width="180" align="center">
      </el-table-column>
      <el-table-column
        prop="if_submit"
        label="是否完整"
        width="110"
        align="center"
      >
        <template v-slot="scope">
          <span>{{ scope.row.if_submit === 1 ? '是' : '否' }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column
        prop="if_scoring"
        label="是否打分"
        width="110"
        align="center"
      >
        <template v-slot="scope">
          <span>{{ scope.row.if_scoring === 1 ? '是' : '否' }}</span>
        </template>
      </el-table-column> -->
      <el-table-column label="操作" align="center">
        <template v-slot="scope">
          <el-button @click="view(scope.row.uid)" type="primary" size="small"
            >查看</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <div style="display: flex; margin-top: 20px; justify-content: center">
      <el-button
        :disabled="multipleSelection.length === 0"
        type="success"
        @click="calculate"
        >确定</el-button
      >
    </div>
    <!-- 空 -->
    <el-empty
      v-show="tableData.length === 0"
      description="请您稍等，加载人员较慢！！"
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
    <p class="commit">注： 请选择<strong>奇数</strong>个用户进行运算</p>
  </div>
</template>
<script setup>
import { ref } from 'vue'
import { onMounted } from 'vue'
import { userGetAllInfoService } from '@/api/user'
import { viewFileServiceByAdmin } from '@/api/admin'
import { getPerlResultServiceByAdmin } from '@/api/admin'
import { useRouter } from 'vue-router'
// import { ElMessage } from 'element-plus'
const router = useRouter()
const currentPage = ref(1)
const pageSize = ref(10)
const dialogTableVisible = ref(false)
const afd_id = ref(0)
const uids = []
const tableData = ref([])
const PersonData = ref([])

const multipleSelection = ref([])
const handleSelectionChange = (val) => {
  multipleSelection.value = val
  // console.log(val)
}
const indexMethod = (index) => {
  return index + 1
}
const selectable = (row) => {
  if (row.if_submit == 1) {
    return true
  } else {
    return false
  }
}
const calculate = () => {
  if (
    multipleSelection.value.length === 1 ||
    multipleSelection.value.length % 2 === 0
  ) {
    ElMessage.warning('请选择奇数数量的用户进行运算(数量最少为3)')
    return
  }
  uids.length = 0
  for (const iterator of multipleSelection.value) {
    uids.push(iterator.uid)
  }
  router.push({
    path: '/admin/record',
    query: { uids }
  })
}

onMounted(() => {
  getAllUsers()
})

async function getAllUsers() {
  const res = await userGetAllInfoService(currentPage.value, pageSize.value)
  // console.log('所有用户', res)
  tableData.value = res.data.data
}
function genderFormatter(value) {
  return value === '0' ? '女' : '男'
}
function handleSizeChange(val) {
  console.log(`每页 ${val} 条`)
  getAllUsers()
}

function handleCurrentChange(val) {
  console.log(`当前页: ${val}`)
  getAllUsers()
}
// 管理是查看专家转递历史
const view = async (uid) => {
  const loadingInstance = ElLoading.service({ fullscreen: true })
  const res = await getPerlResultServiceByAdmin(uid)
  // console.log('用户个人指标记录', res.data.data.result)
  if (res.data.code === 400) {
    loadingInstance.close()
    ElMessage.error('该用户没有传递数据！')
    return
  }
  dialogTableVisible.value = true
  //数组赋值动态更新
  PersonData.value = res.data.data.result
  loadingInstance.close()
}

const viewFile = async (asd_id, secondAlias) => {
  // 查看文件接口,需要后端传个afdid
  console.log('afd_id', afd_id, asd_id, secondAlias)
  const res = await viewFileServiceByAdmin(afd_id, asd_id, secondAlias)
  console.log('res', res)
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
