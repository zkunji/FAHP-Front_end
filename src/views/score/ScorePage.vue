<script setup>
import { driver } from 'driver.js'
import 'driver.js/dist/driver.css'
import { useUserStore } from '@/stores'
import { postScoreData } from '@/api'
import { onMounted } from 'vue'
import { ElMessage } from 'element-plus'

onMounted(() => {
  ElMessageBox.confirm(
    '请对指标进行评分，有优秀、良好、警戒、危险四个等级，非优秀等级须填写备注！！',
    '温馨提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  )
    .then(() => {
      ElMessage({
        type: 'success',
        message: '请按要求进行评分！'
      })
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '请按要求进行评分！'
      })
    })
})
const userStore = useUserStore()

const getSecondData = async () => {
  for (let i = 0; i < 14; i++) {
    console.log(userStore.resultFlag[i])
    if (userStore.resultFlag[i] === undefined) {
      ElMessage.warning('指标' + (i + 0) + '未完成提交！请先提交指标' + (i + 0))
      return
    }
  }
  console.log('userStore.asdId', userStore.asdId.slice(-13))
  console.log('userStore.afdId', userStore.afdId.slice(-1))
  const radios = document.querySelectorAll('input[type="radio"]')
  let selectedValue = []
  let selectedName = []
  for (const radio of radios) {
    if (radio.checked) {
      selectedValue.push(radio.value)
      selectedName.push(radio.name)
    }
  }

  console.log(selectedValue)
  console.log(selectedName)
  if (selectedValue.length !== 58) {
    ElMessage.error('您有单选框未勾选,本此提交失败，请全部勾选后再提交')
    return // 跳出整个循环
  }
  const selectedValue1 = selectedValue.map(function (item) {
    if (item === 'excellent') return '优秀'
    if (item === 'good') return '良好'
    if (item === 'warning') return '警告'
    if (item === 'danger') return '危险'
  })
  // console.log(selectedValue1)
  const inputs = document.querySelectorAll('input[type="text"]')
  let inputValue = []
  inputs.forEach((input) => {
    inputValue.push(input.value)
  })
  console.log(inputValue)
  var asd_comments = []
  var asdARR = []
  for (var i = 0; i < 58; i++) {
    var obj = {
      // asd_id: userStore.asdId[userStore.asdId.length - 1],
      alias: selectedName[i],
      level: selectedValue1[i],
      comment: inputValue[i],
      asd_id: []
    }
    if (i < 3) {
      asdARR[i] = userStore.asdId[userStore.asdId.length - 13]
    } else if (i < 7) {
      asdARR[i] = userStore.asdId[userStore.asdId.length - 12]
    } else if (i < 11) {
      asdARR[i] = userStore.asdId[userStore.asdId.length - 11]
    } else if (i < 15) {
      asdARR[i] = userStore.asdId[userStore.asdId.length - 10]
    } else if (i < 18) {
      asdARR[i] = userStore.asdId[userStore.asdId.length - 9]
    } else if (i < 20) {
      asdARR[i] = userStore.asdId[userStore.asdId.length - 8]
    } else if (i < 24) {
      asdARR[i] = userStore.asdId[userStore.asdId.length - 7]
    } else if (i < 30) {
      asdARR[i] = userStore.asdId[userStore.asdId.length - 6]
    } else if (i < 39) {
      asdARR[i] = userStore.asdId[userStore.asdId.length - 5]
    } else if (i < 43) {
      asdARR[i] = userStore.asdId[userStore.asdId.length - 4]
    } else if (i < 49) {
      asdARR[i] = userStore.asdId[userStore.asdId.length - 3]
    } else if (i < 53) {
      asdARR[i] = userStore.asdId[userStore.asdId.length - 2]
    } else {
      asdARR[i] = userStore.asdId[userStore.asdId.length - 1]
    }
    obj.asd_id = asdARR[i]
    asd_comments.push(obj)
  }

  const scoreResult = await postScoreData(
    userStore.afdId[userStore.afdId.length - 1],
    asd_comments
  )
  console.log(scoreResult)
  userStore.resultFlag.push(true)
  ElMessage.success('提交成功')
}

const setExcellent = () => {
  const radios = document.querySelectorAll('input[type="radio"]')
  radios.forEach((radio) => {
    if (radio.value === 'excellent') {
      radio.checked = true
    }
  })
  const inputs = document.querySelectorAll('input[type="text"]')
  inputs.forEach((input) => (input.value = '优秀！！'))
}
const cleanExcellent = () => {
  ElMessageBox.confirm('您确定要清除数据吗？', '温馨提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    const radios = document.querySelectorAll('input[type="radio"]')
    radios.forEach((radio) => {
      radio.checked = false
    })
    const inputs = document.querySelectorAll('input[type="text"]')
    inputs.forEach((input) => (input.value = ''))
  })
}
const steps = [
  {
    element: '#primary',
    popover: {
      title: '默认数据',
      description: '点击我，设置优秀默认数据！',
      nextBtnText: '下一步',
      prevBtnText: '上一步'
    }
  },
  {
    element: '#warning',
    popover: {
      title: '清空数据',
      description: '点击我，所有的数据都会清空哦，谨慎操作！',
      nextBtnText: '下一步',
      prevBtnText: '上一步'
    }
  },
  {
    element: '#success',
    popover: {
      title: '分析结果',
      description: '完成所有数据的填写后，就可以点击我！',
      nextBtnText: '下一步',
      prevBtnText: '上一步'
    }
  },
  {
    element: '.container',
    popover: {
      title: '温馨提示',
      description: '请为所有的二级指标评分吧',
      nextBtnText: '完成',
      prevBtnText: '上一步'
    }
  }
]
const driverobj = () => {
  const driverObj = driver({
    allowClose: false,
    steps: steps
  })
  driverObj.drive()
  driver.start()
}
</script>

<template>
  <div class="container">
    <el-button class="driverBtn" @click="driverobj">步骤条向导</el-button>
    <!-- 状态 -->
    <el-row class="resultFlag">
      <!-- :sm="8" :lg="6" -->
      <el-col v-if="userStore.resultFlag[14]">
        <el-result icon="success"> </el-result>
      </el-col>
      <el-col v-else>
        <el-result icon="info"></el-result>
      </el-col>
    </el-row>
    <h2>内部控制有效性评价指标权重值表</h2>
    <table>
      <tr>
        <th>目标层</th>
        <th>一级指标</th>
        <th>二级指标</th>
        <th>评分</th>
        <th>备注</th>
      </tr>
      <tr>
        <th
          rowspan="59"
          style="
            writing-mode: vertical-rl;
            number-orientation: upright;
            white-space: nowrap;
          "
        >
          业务层级内部控制有效性评价指标体系
        </th>
      </tr>
      <div class="content">
        <tr>
          <th rowspan="3">组织架构（Q1）</th>
          <th>职责分工（Q11）</th>
          <td>
            <div class="select">
              <input type="radio" value="excellent" name="职责分工" />优秀
              <input type="radio" value="good" name="职责分工" />良好
              <input type="radio" value="warning" name="职责分工" />警戒
              <input type="radio" value="danger" name="职责分工" />危险
            </div>
          </td>
          <td>
            <input
              class="comment"
              type="text"
              placeholder="优秀无需填写此备注！"
            />
          </td>
        </tr>

        <tr>
          <th>三权分立（Q12）</th>
          <td>
            <div class="select">
              <input type="radio" value="excellent" name="三权分立" />优秀
              <input type="radio" value="good" name="三权分立" />良好
              <input type="radio" value="warning" name="三权分立" />警戒
              <input type="radio" value="danger" name="三权分立" />危险
            </div>
          </td>
          <td>
            <input
              class="comment"
              type="text"
              placeholder="优秀无需填写此备注！"
            />
          </td>
        </tr>
        <tr>
          <th>关键岗位责任制（Q13）</th>
          <td>
            <div class="select">
              <input type="radio" value="excellent" name="关键岗位责任制" />优秀
              <input type="radio" value="good" name="关键岗位责任制" />良好
              <input type="radio" value="warning" name="关键岗位责任制" />警戒
              <input type="radio" value="danger" name="关键岗位责任制" />危险
            </div>
          </td>
          <td>
            <input
              class="comment"
              type="text"
              placeholder="优秀无需填写此备注！"
            />
          </td>
        </tr>
        <!--  -->
        <tr>
          <th rowspan="4">决策机制(Q2)</th>
          <th>风险评估（Q21）</th>
          <td>
            <div class="select">
              <input type="radio" value="excellent" name="风险评估" />优秀
              <input type="radio" value="good" name="风险评估" />良好
              <input type="radio" value="warning" name="风险评估" />警戒
              <input type="radio" value="danger" name="风险评估" />危险
            </div>
          </td>
          <td>
            <input
              class="comment"
              type="text"
              placeholder="优秀无需填写此备注！"
            />
          </td>
        </tr>
        <tr>
          <th>专家论证（Q22）</th>
          <td>
            <div class="select">
              <input type="radio" value="excellent" name="专家论证" />优秀
              <input type="radio" value="good" name="专家论证" />良好
              <input type="radio" value="warning" name="专家论证" />警戒
              <input type="radio" value="danger" name="专家论证" />危险
            </div>
          </td>
          <td>
            <input
              class="comment"
              type="text"
              placeholder="优秀无需填写此备注！"
            />
          </td>
        </tr>
        <tr>
          <th>审核审批（Q23）</th>
          <td>
            <div class="select">
              <input type="radio" value="excellent" name="审核审批" />优秀
              <input type="radio" value="good" name="审核审批" />良好
              <input type="radio" value="warning" name="审核审批" />警戒
              <input type="radio" value="danger" name="审核审批" />危险
            </div>
          </td>
          <td>
            <input
              class="comment"
              type="text"
              placeholder="优秀无需填写此备注！"
            />
          </td>
        </tr>
        <tr>
          <th>集体决策 （Q24）</th>
          <td>
            <div class="select">
              <input type="radio" value="excellent" name="集体决策" />优秀
              <input type="radio" value="good" name="集体决策" />良好
              <input type="radio" value="warning" name="集体决策" />警戒
              <input type="radio" value="danger" name="集体决策" />危险
            </div>
          </td>
          <td>
            <input
              class="comment"
              type="text"
              placeholder="优秀无需填写此备注！"
            />
          </td>
        </tr>
        <tr>
          <th rowspan="4">执行机制（Q3）</th>
          <th>内控实施责任制（Q31）</th>
          <td>
            <div class="select">
              <input type="radio" value="excellent" name="内控实施责任制" />优秀
              <input type="radio" value="good" name="内控实施责任制" />良好
              <input type="radio" value="warning" name="内控实施责任制" />警戒
              <input type="radio" value="danger" name="内控实施责任制" />危险
            </div>
          </td>
          <td>
            <input
              class="comment"
              type="text"
              placeholder="优秀无需填写此备注！"
            />
          </td>
        </tr>
        <tr>
          <th>权责分工明确 （Q32）</th>
          <td>
            <div class="select">
              <input type="radio" value="excellent" name="权责分工明确" />优秀
              <input type="radio" value="good" name="权责分工明确" />良好
              <input type="radio" value="warning" name="权责分工明确" />警戒
              <input type="radio" value="danger" name="权责分工明确" />危险
            </div>
          </td>
          <td>
            <input
              class="comment"
              type="text"
              placeholder="优秀无需填写此备注！"
            />
          </td>
        </tr>
        <tr>
          <th>控制制度体系化（Q33）</th>
          <td>
            <div class="select">
              <input type="radio" value="excellent" name="控制制度体系化" />优秀
              <input type="radio" value="good" name="控制制度体系化" />良好
              <input type="radio" value="warning" name="控制制度体系化" />警戒
              <input type="radio" value="danger" name="控制制度体系化" />危险
            </div>
          </td>
          <td>
            <input
              class="comment"
              type="text"
              placeholder="优秀无需填写此备注！"
            />
          </td>
        </tr>
        <tr>
          <th>信息系统（Q34）</th>
          <td>
            <div class="select">
              <input type="radio" value="excellent" name="信息系统" />优秀
              <input type="radio" value="good" name="信息系统" />良好
              <input type="radio" value="warning" name="信息系统" />警戒
              <input type="radio" value="danger" name="信息系统" />危险
            </div>
          </td>
          <td>
            <input
              class="comment"
              type="text"
              placeholder="优秀无需填写此备注！"
            />
          </td>
        </tr>
        <tr>
          <th rowspan="4">监督机制（Q4）</th>
          <th>日常监督（Q41）</th>
          <td>
            <div class="select">
              <input type="radio" value="excellent" name="日常监督" />优秀
              <input type="radio" value="good" name="日常监督" />良好
              <input type="radio" value="warning" name="日常监督" />警戒
              <input type="radio" value="danger" name="日常监督" />危险
            </div>
          </td>
          <td>
            <input
              class="comment"
              type="text"
              placeholder="优秀无需填写此备注！"
            />
          </td>
        </tr>
        <tr>
          <th>绩效考评（Q42）</th>
          <td>
            <div class="select">
              <input type="radio" value="excellent" name="绩效考评" />优秀
              <input type="radio" value="good" name="绩效考评" />良好
              <input type="radio" value="warning" name="绩效考评" />警戒
              <input type="radio" value="danger" name="绩效考评" />危险
            </div>
          </td>
          <td>
            <input
              class="comment"
              type="text"
              placeholder="优秀无需填写此备注！"
            />
          </td>
        </tr>
        <tr>
          <th>内部审计（Q43）</th>
          <td>
            <div class="select">
              <input type="radio" value="excellent" name="内部审计" />优秀
              <input type="radio" value="good" name="内部审计" />良好
              <input type="radio" value="warning" name="内部审计" />警戒
              <input type="radio" value="danger" name="内部审计" />危险
            </div>
          </td>
          <td>
            <input
              class="comment"
              type="text"
              placeholder="优秀无需填写此备注！"
            />
          </td>
        </tr>
        <tr>
          <th>纪检监察制度（Q44）</th>
          <td>
            <div class="select">
              <input type="radio" value="excellent" name="纪检监察制度" />优秀
              <input type="radio" value="good" name="纪检监察制度" />良好
              <input type="radio" value="warning" name="纪检监察制度" />警戒
              <input type="radio" value="danger" name="纪检监察制度" />危险
            </div>
          </td>
          <td>
            <input
              class="comment"
              type="text"
              placeholder="优秀无需填写此备注！"
            />
          </td>
        </tr>
        <tr>
          <th rowspan="3">协调机制 （Q5）</th>
          <th>机构和人员的协调机制 （Q51）</th>
          <td>
            <div class="select">
              <input
                type="radio"
                value="excellent"
                name="机构和人员的协调机制"
              />优秀
              <input
                type="radio"
                value="good"
                name="机构和人员的协调机制"
              />良好
              <input
                type="radio"
                value="warning"
                name="机构和人员的协调机制"
              />警戒
              <input
                type="radio"
                value="danger"
                name="机构和人员的协调机制"
              />危险
            </div>
          </td>
          <td>
            <input
              class="comment"
              type="text"
              placeholder="优秀无需填写此备注！"
            />
          </td>
        </tr>
        <tr>
          <th>业务流程的协调机制 （Q52）</th>
          <td>
            <div class="select">
              <input
                type="radio"
                value="excellent"
                name="业务流程的协调机制"
              />优秀
              <input type="radio" value="good" name="业务流程的协调机制" />良好
              <input
                type="radio"
                value="warning"
                name="业务流程的协调机制"
              />警戒
              <input
                type="radio"
                value="danger"
                name="业务流程的协调机制"
              />危险
            </div>
          </td>
          <td>
            <input
              class="comment"
              type="text"
              placeholder="优秀无需填写此备注！"
            />
          </td>
        </tr>
        <tr>
          <th>信息沟通的协调机制 （Q53）</th>
          <td>
            <div class="select">
              <input
                type="radio"
                value="excellent"
                name="信息沟通的协调机制"
              />优秀
              <input type="radio" value="good" name="信息沟通的协调机制" />良好
              <input
                type="radio"
                value="warning"
                name="信息沟通的协调机制"
              />警戒
              <input
                type="radio"
                value="danger"
                name="信息沟通的协调机制"
              />危险
            </div>
          </td>
          <td>
            <input
              class="comment"
              type="text"
              placeholder="优秀无需填写此备注！"
            />
          </td>
        </tr>
        <tr>
          <th rowspan="2">评价机制 （Q6）</th>
          <th>自我评价机制 （Q61）</th>
          <td>
            <div class="select">
              <input type="radio" value="excellent" name="自我评价机制" />优秀
              <input type="radio" value="good" name="自我评价机制" />良好
              <input type="radio" value="warning" name="自我评价机制" />警戒
              <input type="radio" value="danger" name="自我评价机制" />危险
            </div>
          </td>
          <td>
            <input
              class="comment"
              type="text"
              placeholder="优秀无需填写此备注！"
            />
          </td>
        </tr>
        <tr>
          <th>自我评价反馈 （Q62）</th>
          <td>
            <div class="select">
              <input type="radio" value="excellent" name="自我评价反馈" />优秀
              <input type="radio" value="good" name="自我评价反馈" />良好
              <input type="radio" value="warning" name="自我评价反馈" />警戒
              <input type="radio" value="danger" name="自我评价反馈" />危险
            </div>
          </td>
          <td>
            <input
              class="comment"
              type="text"
              placeholder="优秀无需填写此备注！"
            />
          </td>
        </tr>
        <tr>
          <th rowspan="4">预算控制 （Q7）</th>
          <th>预算编审 （Q71）</th>
          <td>
            <div class="select">
              <input type="radio" value="excellent" name="预算编审" />优秀
              <input type="radio" value="good" name="预算编审" />良好
              <input type="radio" value="warning" name="预算编审" />警戒
              <input type="radio" value="danger" name="预算编审" />危险
            </div>
          </td>
          <td>
            <input
              class="comment"
              type="text"
              placeholder="优秀无需填写此备注！"
            />
          </td>
        </tr>
        <tr>
          <th>预算批复 （Q72）</th>
          <td>
            <div class="select">
              <input type="radio" value="excellent" name="预算批复" />优秀
              <input type="radio" value="good" name="预算批复" />良好
              <input type="radio" value="warning" name="预算批复" />警戒
              <input type="radio" value="danger" name="预算批复" />危险
            </div>
          </td>
          <td>
            <input
              class="comment"
              type="text"
              placeholder="优秀无需填写此备注！"
            />
          </td>
        </tr>
        <tr>
          <th>预算执行 （Q73）</th>
          <td>
            <div class="select">
              <input type="radio" value="excellent" name="预算执行" />优秀
              <input type="radio" value="good" name="预算执行" />良好
              <input type="radio" value="warning" name="预算执行" />警戒
              <input type="radio" value="danger" name="预算执行" />危险
            </div>
          </td>
          <td>
            <input
              class="comment"
              type="text"
              placeholder="优秀无需填写此备注！"
            />
          </td>
        </tr>
        <tr>
          <th>决算与考评 （Q74）</th>
          <td>
            <div class="select">
              <input type="radio" value="excellent" name="决算与考评" />优秀
              <input type="radio" value="good" name="决算与考评" />良好
              <input type="radio" value="warning" name="决算与考评" />警戒
              <input type="radio" value="danger" name="决算与考评" />危险
            </div>
          </td>
          <td>
            <input
              class="comment"
              type="text"
              placeholder="优秀无需填写此备注！"
            />
          </td>
        </tr>
        <tr>
          <th rowspan="6">收支控制 （Q8）</th>
          <th>收入预算 （Q81）</th>
          <td>
            <div class="select">
              <input type="radio" value="excellent" name="收入预算" />优秀
              <input type="radio" value="good" name="收入预算" />良好
              <input type="radio" value="warning" name="收入预算" />警戒
              <input type="radio" value="danger" name="收入预算" />危险
            </div>
          </td>
          <td>
            <input
              class="comment"
              type="text"
              placeholder="优秀无需填写此备注！"
            />
          </td>
        </tr>
        <tr>
          <th>收入登记 （Q82）</th>
          <td>
            <div class="select">
              <input type="radio" value="excellent" name="收入登记" />优秀
              <input type="radio" value="good" name="收入登记" />良好
              <input type="radio" value="warning" name="收入登记" />警戒
              <input type="radio" value="danger" name="收入登记" />危险
            </div>
          </td>
          <td>
            <input
              class="comment"
              type="text"
              placeholder="优秀无需填写此备注！"
            />
          </td>
        </tr>
        <tr>
          <th>收入到账确认 （Q83）</th>
          <td>
            <div class="select">
              <input type="radio" value="excellent" name="收入到账确认" />优秀
              <input type="radio" value="good" name="收入到账确认" />良好
              <input type="radio" value="warning" name="收入到账确认" />警戒
              <input type="radio" value="danger" name="收入到账确认" />危险
            </div>
          </td>
          <td>
            <input
              class="comment"
              type="text"
              placeholder="优秀无需填写此备注！"
            />
          </td>
        </tr>
        <tr>
          <th>支出事项分类 （Q84）</th>
          <td>
            <div class="select">
              <input type="radio" value="excellent" name="支出事项分类" />优秀
              <input type="radio" value="good" name="支出事项分类" />良好
              <input type="radio" value="warning" name="支出事项分类" />警戒
              <input type="radio" value="danger" name="支出事项分类" />危险
            </div>
          </td>
          <td>
            <input
              class="comment"
              type="text"
              placeholder="优秀无需填写此备注！"
            />
          </td>
        </tr>
        <tr>
          <th>支出事项的执行方式 （Q85）</th>
          <td>
            <div class="select">
              <input
                type="radio"
                value="excellent"
                name="支出事项的执行方式"
              />优秀
              <input type="radio" value="good" name="支出事项的执行方式" />良好
              <input
                type="radio"
                value="warning"
                name="支出事项的执行方式"
              />警戒
              <input
                type="radio"
                value="danger"
                name="支出事项的执行方式"
              />危险
            </div>
          </td>
          <td>
            <input
              class="comment"
              type="text"
              placeholder="优秀无需填写此备注！"
            />
          </td>
        </tr>
        <tr>
          <th>支出过程控制 （Q86）</th>
          <td>
            <div class="select">
              <input type="radio" value="excellent" name="支出过程控制" />优秀
              <input type="radio" value="good" name="支出过程控制" />良好
              <input type="radio" value="warning" name="支出过程控制" />警戒
              <input type="radio" value="danger" name="支出过程控制" />危险
            </div>
          </td>
          <td>
            <input
              class="comment"
              type="text"
              placeholder="优秀无需填写此备注！"
            />
          </td>
        </tr>
        <tr>
          <th rowspan="9">采购控制 （Q9）</th>
          <th>采购预算和采购计划的编制与审核 （Q91）</th>
          <td>
            <div class="select">
              <input
                type="radio"
                value="excellent"
                name="采购预算和采购计划的编制与审核"
              />优秀
              <input
                type="radio"
                value="good"
                name="采购预算和采购计划的编制与审核"
              />良好
              <input
                type="radio"
                value="warning"
                name="采购预算和采购计划的编制与审核"
              />警戒
              <input
                type="radio"
                value="danger"
                name="采购预算和采购计划的编制与审核"
              />危险
            </div>
          </td>
          <td>
            <input
              class="comment"
              type="text"
              placeholder="优秀无需填写此备注！"
            />
          </td>
        </tr>
        <tr>
          <th>采购组织方式确定 （Q92）</th>
          <td>
            <div class="select">
              <input
                type="radio"
                value="excellent"
                name="采购组织方式确定"
              />优秀
              <input type="radio" value="good" name="采购组织方式确定" />良好
              <input type="radio" value="warning" name="采购组织方式确定" />警戒
              <input type="radio" value="danger" name="采购组织方式确定" />危险
            </div>
          </td>
          <td>
            <input
              class="comment"
              type="text"
              placeholder="优秀无需填写此备注！"
            />
          </td>
        </tr>
        <tr>
          <th>采购方式确定 （Q93）</th>
          <td>
            <div class="select">
              <input type="radio" value="excellent" name="采购方式确定" />优秀
              <input type="radio" value="good" name="采购方式确定" />良好
              <input type="radio" value="warning" name="采购方式确定" />警戒
              <input type="radio" value="danger" name="采购方式确定" />危险
            </div>
          </td>
          <td>
            <input
              class="comment"
              type="text"
              placeholder="优秀无需填写此备注！"
            />
          </td>
        </tr>
        <tr>
          <th>政府采购代理机构确定 （Q94）</th>
          <td>
            <div class="select">
              <input
                type="radio"
                value="excellent"
                name="政府采购代理机构确定"
              />优秀
              <input
                type="radio"
                value="good"
                name="政府采购代理机构确定"
              />良好
              <input
                type="radio"
                value="warning"
                name="政府采购代理机构确定"
              />警戒
              <input
                type="radio"
                value="danger"
                name="政府采购代理机构确定"
              />危险
            </div>
          </td>
          <td>
            <input
              class="comment"
              type="text"
              placeholder="优秀无需填写此备注！"
            />
          </td>
        </tr>
        <tr>
          <th>政府采购计划实施 （Q95）</th>
          <td>
            <div class="select">
              <input
                type="radio"
                value="excellent"
                name="政府采购计划实施"
              />优秀
              <input type="radio" value="good" name="政府采购计划实施" />良好
              <input type="radio" value="warning" name="政府采购计划实施" />警戒
              <input type="radio" value="danger" name="政府采购计划实施" />危险
            </div>
          </td>
          <td>
            <input
              class="comment"
              type="text"
              placeholder="优秀无需填写此备注！"
            />
          </td>
        </tr>
        <tr>
          <th>自行采购计划实施 （Q96）</th>
          <td>
            <div class="select">
              <input
                type="radio"
                value="excellent"
                name="自行采购计划实施"
              />优秀
              <input type="radio" value="good" name="自行采购计划实施" />良好
              <input type="radio" value="warning" name="自行采购计划实施" />警戒
              <input type="radio" value="danger" name="自行采购计划实施" />危险
            </div>
          </td>
          <td>
            <input
              class="comment"
              type="text"
              placeholder="优秀无需填写此备注！"
            />
          </td>
        </tr>
        <tr>
          <th>合同签订与备案 （Q97）</th>
          <td>
            <div class="select">
              <input type="radio" value="excellent" name="合同签订与备案" />优秀
              <input type="radio" value="good" name="合同签订与备案" />良好
              <input type="radio" value="warning" name="合同签订与备案" />警戒
              <input type="radio" value="danger" name="合同签订与备案" />危险
            </div>
          </td>
          <td>
            <input
              class="comment"
              type="text"
              placeholder="优秀无需填写此备注！"
            />
          </td>
        </tr>
        <tr>
          <th>组织验收 （Q98）</th>
          <td>
            <div class="select">
              <input type="radio" value="excellent" name="组织验收" />优秀
              <input type="radio" value="good" name="组织验收" />良好
              <input type="radio" value="warning" name="组织验收" />警戒
              <input type="radio" value="danger" name="组织验收" />危险
            </div>
          </td>
          <td>
            <input
              class="comment"
              type="text"
              placeholder="优秀无需填写此备注！"
            />
          </td>
        </tr>
        <tr>
          <th>采购支付 （Q99）</th>
          <td>
            <div class="select">
              <input type="radio" value="excellent" name="采购支付" />优秀
              <input type="radio" value="good" name="采购支付" />良好
              <input type="radio" value="warning" name="采购支付" />警戒
              <input type="radio" value="danger" name="采购支付" />危险
            </div>
          </td>
          <td>
            <input
              class="comment"
              type="text"
              placeholder="优秀无需填写此备注！"
            />
          </td>
        </tr>
        <tr>
          <th rowspan="4">资产控制 （Q10）</th>
          <th>资产配置 （Q101）</th>
          <td>
            <div class="select">
              <input type="radio" value="excellent" name="资产配置" />优秀
              <input type="radio" value="good" name="资产配置" />良好
              <input type="radio" value="warning" name="资产配置" />警戒
              <input type="radio" value="danger" name="资产配置" />危险
            </div>
          </td>
          <td>
            <input
              class="comment"
              type="text"
              placeholder="优秀无需填写此备注！"
            />
          </td>
        </tr>
        <tr>
          <th>资产新购 （Q102）</th>
          <td>
            <div class="select">
              <input type="radio" value="excellent" name="资产新购" />优秀
              <input type="radio" value="good" name="资产新购" />良好
              <input type="radio" value="warning" name="资产新购" />警戒
              <input type="radio" value="danger" name="资产新购" />危险
            </div>
          </td>
          <td>
            <input
              class="comment"
              type="text"
              placeholder="优秀无需填写此备注！"
            />
          </td>
        </tr>
        <tr>
          <th>资产更新 （Q103）</th>
          <td>
            <div class="select">
              <input type="radio" value="excellent" name="资产更新" />优秀
              <input type="radio" value="good" name="资产更新" />良好
              <input type="radio" value="warning" name="资产更新" />警戒
              <input type="radio" value="danger" name="资产更新" />危险
            </div>
          </td>
          <td>
            <input
              class="comment"
              type="text"
              placeholder="优秀无需填写此备注！"
            />
          </td>
        </tr>
        <tr>
          <th>资产处置 （Q104）</th>
          <td>
            <div class="select">
              <input type="radio" value="excellent" name="资产处置" />优秀
              <input type="radio" value="good" name="资产处置" />良好
              <input type="radio" value="warning" name="资产处置" />警戒
              <input type="radio" value="danger" name="资产处置" />危险
            </div>
          </td>
          <td>
            <input
              class="comment"
              type="text"
              placeholder="优秀无需填写此备注！"
            />
          </td>
        </tr>
        <tr>
          <th rowspan="6">工程项目控制 （Q11）</th>
          <th>工程立项 （Q111）</th>
          <td>
            <div class="select">
              <input type="radio" value="excellent" name="工程立项" />优秀
              <input type="radio" value="good" name="工程立项" />良好
              <input type="radio" value="warning" name="工程立项" />警戒
              <input type="radio" value="danger" name="工程立项" />危险
            </div>
          </td>
          <td>
            <input
              class="comment"
              type="text"
              placeholder="优秀无需填写此备注！"
            />
          </td>
        </tr>
        <tr>
          <th>设计与概预算 （Q112）</th>
          <td>
            <div class="select">
              <input type="radio" value="excellent" name="设计与概预算" />优秀
              <input type="radio" value="good" name="设计与概预算" />良好
              <input type="radio" value="warning" name="设计与概预算" />警戒
              <input type="radio" value="danger" name="设计与概预算" />危险
            </div>
          </td>
          <td>
            <input
              class="comment"
              type="text"
              placeholder="优秀无需填写此备注！"
            />
          </td>
        </tr>
        <tr>
          <th>工程招标 （Q113）</th>
          <td>
            <div class="select">
              <input type="radio" value="excellent" name="工程招标" />优秀
              <input type="radio" value="good" name="工程招标" />良好
              <input type="radio" value="warning" name="工程招标" />警戒
              <input type="radio" value="danger" name="工程招标" />危险
            </div>
          </td>
          <td>
            <input
              class="comment"
              type="text"
              placeholder="优秀无需填写此备注！"
            />
          </td>
        </tr>
        <tr>
          <th>工程建设 （Q114）</th>
          <td>
            <div class="select">
              <input type="radio" value="excellent" name="工程建设" />优秀
              <input type="radio" value="good" name="工程建设" />良好
              <input type="radio" value="warning" name="工程建设" />警戒
              <input type="radio" value="danger" name="工程建设" />危险
            </div>
          </td>
          <td>
            <input
              class="comment"
              type="text"
              placeholder="优秀无需填写此备注！"
            />
          </td>
        </tr>
        <tr>
          <th>工程竣工验收 （Q115）</th>
          <td>
            <div class="select">
              <input type="radio" value="excellent" name="工程竣工验收" />优秀
              <input type="radio" value="good" name="工程竣工验收" />良好
              <input type="radio" value="warning" name="工程竣工验收" />警戒
              <input type="radio" value="danger" name="工程竣工验收" />危险
            </div>
          </td>
          <td>
            <input
              class="comment"
              type="text"
              placeholder="优秀无需填写此备注！"
            />
          </td>
        </tr>
        <tr>
          <th>工程项目核算 （Q116）</th>
          <td>
            <div class="select">
              <input type="radio" value="excellent" name="工程项目核算" />优秀
              <input type="radio" value="good" name="工程项目核算" />良好
              <input type="radio" value="warning" name="工程项目核算" />警戒
              <input type="radio" value="danger" name="工程项目核算" />危险
            </div>
          </td>
          <td>
            <input
              class="comment"
              type="text"
              placeholder="优秀无需填写此备注！"
            />
          </td>
        </tr>
        <tr>
          <th rowspan="4">会计控制（Q12）</th>
          <th>财务收支审批和报销 （Q121）</th>
          <td>
            <div class="select">
              <input
                type="radio"
                value="excellent"
                name="财务收支审批和报销"
              />优秀
              <input type="radio" value="good" name="财务收支审批和报销" />良好
              <input
                type="radio"
                value="warning"
                name="财务收支审批和报销"
              />警戒
              <input
                type="radio"
                value="danger"
                name="财务收支审批和报销"
              />危险
            </div>
          </td>
          <td>
            <input
              class="comment"
              type="text"
              placeholder="优秀无需填写此备注！"
            />
          </td>
        </tr>
        <tr>
          <th>会计凭证填制和传递 （Q122）</th>
          <td>
            <div class="select">
              <input
                type="radio"
                value="excellent"
                name="会计凭证填制和传递"
              />优秀
              <input type="radio" value="good" name="会计凭证填制和传递" />良好
              <input
                type="radio"
                value="warning"
                name="会计凭证填制和传递"
              />警戒
              <input
                type="radio"
                value="danger"
                name="会计凭证填制和传递"
              />危险
            </div>
          </td>
          <td>
            <input
              class="comment"
              type="text"
              placeholder="优秀无需填写此备注！"
            />
          </td>
        </tr>
        <tr>
          <th>会计账簿登记 （Q123）</th>
          <td>
            <div class="select">
              <input type="radio" value="excellent" name="会计账簿登记" />优秀
              <input type="radio" value="good" name="会计账簿登记" />良好
              <input type="radio" value="warning" name="会计账簿登记" />警戒
              <input type="radio" value="danger" name="会计账簿登记" />危险
            </div>
          </td>
          <td>
            <input
              class="comment"
              type="text"
              placeholder="优秀无需填写此备注！"
            />
          </td>
        </tr>
        <tr>
          <th>财务报告编审和披露 （Q124）</th>
          <td>
            <div class="select">
              <input
                type="radio"
                value="excellent"
                name="财务报告编审和披露"
              />优秀
              <input type="radio" value="good" name="财务报告编审和披露" />良好
              <input
                type="radio"
                value="warning"
                name="财务报告编审和披露"
              />警戒
              <input
                type="radio"
                value="danger"
                name="财务报告编审和披露"
              />危险
            </div>
          </td>
          <td>
            <input
              class="comment"
              type="text"
              placeholder="优秀无需填写此备注！"
            />
          </td>
        </tr>

        <tr>
          <th rowspan="5">合同控制（Q13）</th>
          <th>合同控制职责分工 （Q131）</th>
          <td>
            <div class="select">
              <input
                type="radio"
                value="excellent"
                name="合同控制职责分工"
              />优秀
              <input type="radio" value="good" name="合同控制职责分工" />良好
              <input type="radio" value="warning" name="合同控制职责分工" />警戒
              <input type="radio" value="danger" name="合同控制职责分工" />危险
            </div>
          </td>
          <td>
            <input
              class="comment"
              type="text"
              placeholder="优秀无需填写此备注！"
            />
          </td>
        </tr>
        <tr>
          <th>合同订立 （Q132）</th>
          <td>
            <div class="select">
              <input type="radio" value="excellent" name="合同订立" />优秀
              <input type="radio" value="good" name="合同订立" />良好
              <input type="radio" value="warning" name="合同订立" />警戒
              <input type="radio" value="danger" name="合同订立" />危险
            </div>
          </td>
          <td>
            <input
              class="comment"
              type="text"
              placeholder="优秀无需填写此备注！"
            />
          </td>
        </tr>
        <tr>
          <th>合同履行 （Q133）</th>
          <td>
            <div class="select">
              <input type="radio" value="excellent" name="合同履行" />优秀
              <input type="radio" value="good" name="合同履行" />良好
              <input type="radio" value="warning" name="合同履行" />警戒
              <input type="radio" value="danger" name="合同履行" />危险
            </div>
          </td>
          <td>
            <input
              class="comment"
              type="text"
              placeholder="优秀无需填写此备注！"
            />
          </td>
        </tr>
        <tr>
          <th>合同后续管理 （Q134）</th>
          <td>
            <div class="select">
              <input type="radio" value="excellent" name="合同后续管理" />优秀
              <input type="radio" value="good" name="合同后续管理" />良好
              <input type="radio" value="warning" name="合同后续管理" />警戒
              <input type="radio" value="danger" name="合同后续管理" />危险
            </div>
          </td>
          <td>
            <input
              class="comment"
              type="text"
              placeholder="优秀无需填写此备注！"
            />
          </td>
        </tr>
        <tr>
          <th>合同特殊事项管理 （Q135）</th>
          <td>
            <div class="select">
              <input
                type="radio"
                value="excellent"
                name="合同特殊事项管理"
              />优秀
              <input type="radio" value="good" name="合同特殊事项管理" />良好
              <input type="radio" value="warning" name="合同特殊事项管理" />警戒
              <input type="radio" value="danger" name="合同特殊事项管理" />危险
            </div>
          </td>
          <td>
            <input
              class="comment"
              type="text"
              placeholder="优秀无需填写此备注！"
            />
          </td>
        </tr>
      </div>
    </table>
  </div>

  <div class="btn">
    <el-button id="primary" @click="setExcellent" type="primary"
      >设置优秀</el-button
    >
    <el-button id="warning" @click="cleanExcellent" type="warning"
      >清空数据</el-button
    >
    <el-button id="success" @click="getSecondData" type="success"
      >提交</el-button
    >
  </div>
</template>

<style scoped>
h2 {
  text-align: center;
}
td,
th {
  border: 1px solid black;
  font-size: 16px;
  font-family: '黑体';
  /* 不加粗 */
  font-weight: normal;
}

table {
  margin: 0 auto;
  box-sizing: border-box;
  border-collapse: collapse;
  border: 1px solid #000;
  background: #e9eff7;
  text-align: center;
}
/* .photo {
  position: absolute;
  right: 30px;
  top: 80px;
  width: 100px;
  height: 2px;
} */
input {
  border: none;
  background: #e9eff7;
  text-align: center;
  outline: none;
  font-size: 18px;
}
input[placeholder] {
  font-size: 12px;
}
.btn {
  display: flex;
  justify-content: space-around;
  margin-top: 30px;
}
.select input {
  font-weight: lighter;
}
.driverBtn {
  position: absolute;
  top: 80px;
  right: 30px;
}
.resultFlag {
  display: block;
  position: absolute;
  transform: scale(0.6);
  top: 50px;
  left: 240px;
}
</style>
