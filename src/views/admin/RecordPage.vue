<template>
  <el-drawer
    v-model="dialog"
    title="专家评审任务考核指标体系"
    direction="ltr"
    class="demo-drawer"
    size="50%"
  >
    <div class="demo-drawer__content">
      <table>
        <tr>
          <th>考核指标</th>
          <th>考核内容</th>
          <th>目标分值</th>
          <th>得分</th>
        </tr>
        <tr>
          <td rowspan="5">工作态度(20分)</td>
          <td>按时参加评审工作</td>
          <td>3</td>
          <td><input type="number" name="" id="" class="playInput" /></td>
        </tr>
        <tr>
          <td>按时参加评审前的业务培训</td>
          <td>3</td>
          <td><input type="number" name="" id="" class="playInput" /></td>
        </tr>
        <tr>
          <td>能按时提交评价结果</td>
          <td>5</td>
          <td><input type="number" name="" id="" class="playInput" /></td>
        </tr>
        <tr>
          <td>能协助系统管理员及时完成调查问卷</td>
          <td>4</td>
          <td><input type="number" name="" id="" class="playInput" /></td>
        </tr>
        <tr>
          <td>遵守评审职业操守、工作纪律和廉洁纪律</td>
          <td>5</td>
          <td><input type="number" name="" id="" class="playInput" /></td>
        </tr>
        <tr>
          <td rowspan="5">专业素质 （30分）</td>
          <td>在人事、财务、资产、后勤、基建、部门担任过领导职务</td>
          <td>7</td>
          <td><input type="number" name="" id="" class="playInput" /></td>
        </tr>
        <tr>
          <td>在人事、财务、资产、后勤、基建、部门关键工作岗位工作超过3年</td>
          <td>5</td>
          <td><input type="number" name="" id="" class="playInput" /></td>
        </tr>
        <tr>
          <td>从事内部控制专业方向的研究人员</td>
          <td>5</td>
          <td><input type="number" name="" id="" class="playInput" /></td>
        </tr>
        <tr>
          <td>具有高级职称</td>
          <td>6</td>
          <td><input type="number" name="" id="" class="playInput" /></td>
        </tr>
        <tr>
          <td>具备相关职业资格证书</td>
          <td>7</td>
          <td><input type="number" name="" id="" class="playInput" /></td>
        </tr>
        <tr>
          <td rowspan="7">职责履行 （50分）</td>
          <td>参加调查问卷能提出有建设性的卷外建议</td>
          <td>5</td>
          <td><input type="number" name="" id="" class="playInput" /></td>
        </tr>
        <tr>
          <td>对调查问卷需要调整的内容进行标注</td>
          <td>5</td>
          <td><input type="number" name="" id="" class="playInput" /></td>
        </tr>
        <tr>
          <td>能对复杂事项给出合理化建议及解决方案</td>
          <td>10</td>
          <td><input type="number" name="" id="" class="playInput" /></td>
        </tr>
        <tr>
          <td>对评审结果能提供详细说明的工作底稿，分析准确、全面、透彻</td>
          <td>10</td>
          <td><input type="number" name="" id="" class="playInput" /></td>
        </tr>
        <tr>
          <td>对评审结果上传的支撑材料详尽、充分、有足够的说服力</td>
          <td>10</td>
          <td><input type="number" name="" id="" class="playInput" /></td>
        </tr>
        <tr>
          <td>对系统管理员提出的疑问，准确合理地回复</td>
          <td>5</td>
          <td><input type="number" name="" id="" class="playInput" /></td>
        </tr>
        <tr>
          <td>对出现的不恰当的评价能及时纠正</td>
          <td>5</td>
          <td><input type="number" name="" id="" class="playInput" /></td>
        </tr>
        <tr>
          <th colspan="2">合计</th>
          <td>100</td>
          <td><input type="number" name="" id="" class="playInput" /></td>
        </tr>
      </table>
      <div class="demo-drawer__footer">
        <el-button v-show="defaultFlag" type="primary" @click="setData">
          默认
        </el-button>
        <el-button v-show="modifyFlag" type="success" @click="modify">
          修改
        </el-button>
        <el-button @click="cancelForm">取消</el-button>
        <el-button
          v-show="postFlag"
          type="primary"
          :loading="loading"
          @click="onClick"
        >
          {{ loading ? '提交中 ...' : '提交' }}
        </el-button>
      </div>
    </div>
  </el-drawer>
  <div>
    <!-- 表格内容显示区域   -->
    <el-table
      ref="multipleTableRef"
      :data="tableData"
      border
      style="width: 100%"
      :filter-method="filterHandler"
      @selection-change="handleSelectionChange"
      :row-class-name="tableRowClassName"
    >
      <!-- <el-table-column type="selection" width="40" :selectable="selectable" /> -->
      <el-table-column
        type="index"
        :index="indexMethod"
        label="序号"
        width="80"
      >
      </el-table-column>
      <!-- <el-table-column label="uid" prop="uid">
        <template v-slot="scope">
          <span v-if="includedInArray(scope.row.uid, uids)">{{
            scope.row.uid
          }}</span>
        </template>
      </el-table-column> -->
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
      <!-- <el-table-column
        prop="if_submit"
        label="是否完整"
        width="110"
        align="center"
      >
        <template v-slot="scope">
          <span>{{ scope.row.if_submit === 1 ? '是' : '否' }}</span>
        </template>
      </el-table-column> -->
      <el-table-column
        prop="if_scoring"
        label="是否打分"
        width="110"
        align="center"
      >
        <template v-slot="scope">
          <span>{{ scope.row.if_scoring === 1 ? '是' : '否' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="180" align="center">
        <template v-slot="scope">
          <!-- <el-button @click="view(scope.row.uid)" type="primary" size="small"
            >查看</el-button
          > -->
          <el-button
            @click="playRecord(scope.row.uid)"
            type="primary"
            size="small"
            >打分</el-button
          >
          <el-button
            @click="lookRecord(scope.row.uid)"
            type="primary"
            size="small"
            >查分</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <div style="display: flex; margin-top: 20px; justify-content: center">
      <el-button type="success" @click="calculate">运算</el-button>
    </div>
    <!-- <div>{{ multipleSelection }}</div> -->
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
    <p class="commit">
      注：请问所有专家打分<strong>完成后</strong>，再进行运算
    </p>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { onMounted } from 'vue'
import { userGetAllInfoService } from '@/api/user'
import { setEndObj } from '@/utils/storage'
import {
  assessment,
  lookAssessment,
  entropyWeight,
  updataassessment
} from '@/api/mohu'
import { ElMessage } from 'element-plus'
import { useRoute, useRouter } from 'vue-router'
const route = useRoute()
// 拿到路由携带的参数
const uids = route.query.uids || []
console.log('uids:', uids)
const router = useRouter()
const currentPage = ref(1)
const pageSize = ref(10)
const tableData = ref([])
const defaultFlag = ref(true)
const modifyFlag = ref(true)
const postFlag = ref(true)
var isUpdata = false

function tableRowClassName({ row }) {
  if (!row.isShow) {
    return 'hidden-row'
  }
  return ''
}

const multipleSelection = ref([])
const handleSelectionChange = (val) => {
  multipleSelection.value = val
}

const indexMethod = (index) => {
  return index + 1
}
const selectable = (row) => {
  if (row.if_submit == 1 || row.if_scoring === 1) {
    return true
  } else {
    return false
  }
}

const calculate = async () => {
  const res = await entropyWeight(uids)
  const weight = res.data.data.expert_weight
  console.log(weight)
  ElMessage.success(`专家${uids}的熵权法结果依次为${weight}`)
  ElMessageBox.prompt('请为本次评比赋记录名称吧', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消'
  })
    .then(async ({ value }) => {
      ElMessage({
        type: 'success',
        message: `本次记录名称是:${value}`
      })
      setEndObj({ uids, arr: weight, title: value })
      router.push({
        path: '/admin/end',
        query: {
          uids,
          arr: weight,
          value: value
        }
      })
    })
    .catch(() => {
      ElMessage({
        type: 'warning',
        message: '输入取消'
      })
    })
}

onMounted(() => {
  getAllUsers()
})

async function getAllUsers() {
  const res = await userGetAllInfoService(currentPage.value, pageSize.value)
  console.log('所有用户', res)
  tableData.value = res.data.data
  tableData.value.forEach((item) => {
    if (uids.includes(String(item.uid))) {
      item.isShow = true
    }
  })
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

// 给专家打分
let timer
const uuid = ref(0)
const dialog = ref(false)
const loading = ref(false)

const onClick = async () => {
  loading.value = true
  modifyFlag.value = false
  const inputs = document.querySelectorAll('input[type="number"]')
  const data = []
  for (let i = 0; i < 17; i++) {
    if (inputs[i].value === '') {
      ElMessage.warning('请填写所有分数')
      loading.value = false
      return
    }
    data.push(inputs[i].value)
  }
  console.log('uuid', uuid.value, data)
  console.log('isUpdata', isUpdata)
  if (!isUpdata) {
    const res = await assessment(uuid.value, data)
  } else {
    const res = await updataassessment(uuid.value, data)
    isUpdata = false
  }
  setTimeout(() => {
    loading.value = false
    dialog.value = false
  }, 400)
  ElMessage.success('打分成功！')
  // getAllUsers()
}

const setData = () => {
  const inputs = document.querySelectorAll('input[type="number"]')
  for (let i = 0; i < 17; i++) {
    inputs[i].value = '1'
  }
  ElMessage.success('默认分数为1，已设置成功！')
}
const lookRecord = async (uid) => {
  const res = await lookAssessment(uid)
  const arr = res.data.data.assessment
  dialog.value = true
  uuid.value = uid
  ElMessage.success('请查看分数！')
  modifyFlag.value = true
  defaultFlag.value = false
  postFlag.value = false
  const inputs = document.querySelectorAll('input[type="number"]')
  for (let i = 0; i < 17; i++) {
    inputs[i].value = arr[i]
    // 禁止书写
    inputs[i].disabled = true
  }
}
const modify = () => {
  ElMessage.success('请修改分数')
  isUpdata = true
  const inputs = document.querySelectorAll('input[type="number"]')
  modifyFlag.value = false
  postFlag.value = true
  for (let i = 0; i < 17; i++) {
    inputs[i].disabled = false
  }
}

const cancelForm = () => {
  loading.value = false
  dialog.value = false
  clearTimeout(timer)
}
const playRecord = async (uid) => {
  isUpdata = false
  uuid.value = uid
  dialog.value = true
  postFlag.value = true
  defaultFlag.value = true
  modifyFlag.value = false
  const inputs = document.querySelectorAll('input[type="number"]')
  for (let i = 0; i < 17; i++) {
    inputs[i].value = ''
  }
  ElMessage.success('请您开始为专家打分！')
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
::v-deep .el-table .hidden-row {
  display: none !important;
}
</style>
