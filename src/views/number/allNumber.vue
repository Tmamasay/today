<template>
  <div class="grhd_box shaowAll">
    <div class="toolS">
      <p class="Ptitle">公共号码库</p>
      <el-form :inline="true" :model="query" class="demo-form-inline">
        <el-form-item label="">
          <el-input v-model="query.name" placeholder="请输入客户姓名" />
        </el-form-item>
        <el-form-item label="">
          <el-input v-model="query.phone" placeholder="请输入客户电话" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="small" @click="search">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-table
      ref="zx-list-data-&quot;"
      v-loading="loading"
      :data="dataList"
      tooltip-effect="dark"
      style="width: 100%;"
      border
    >
      <el-table-column prop="company" label="公司" />
      <el-table-column prop="name" label="联系人" />
      <el-table-column prop="sex" label="性别" />
      <el-table-column prop="phone" label="联系电话">
        <template slot-scope="scope">
          {{ formatPhone(scope.row.phone) }}
        </template>
      </el-table-column>
      <el-table-column prop="callCount" label="拨打次数" />
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="primary"
            @click="boda(scope.row)"
          >拨打</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="block fenye">
      <el-pagination
        :current-page="Current"
        :page-sizes="[10, 20, 30, 50]"
        :page-size="Size"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
    <el-dialog
      title="录音详情"
      :visible.sync="dialogVisible_ly"
      width="30%"
      :close-on-click-modal="false"
      :before-close="handleClose"
    >
      <div style="text-align: center">
        <audio id="audio" :src="lyUrl" controls />
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getPageCustomerResources, callInside } from '@/api/framework'
import { getMaskStatus } from '@/utils/auth'
export default {
  data() {
    return {
      query: {
        name: '',
        phone: ''

      },
      loading: false,
      lyUrl: '',
      dataList: [],
      Current: 1, // 页码
      total: 0, // 总数
      Size: 10, // 一页多少条
      day: '',
      hstTime: '',
      thisTime: '',
      dialogVisible_ly: false,
      delivery: false
    }
  },
  mounted() {
    this.getCountDays()
    this.getxztime()
    this.getime()
    this.getlist()
  },
  methods: {
    search() {
      this.getlist()
    },
    formatPhone(phone) {
      debugger
      if (+getMaskStatus()) {
        return `${phone.substr(0, phone.length - 4)}****`
      } else {
        return phone
      }
    },
    // 外呼拨打电话
    async boda(row) {
      console.log(row)
      console.log('22222222222')
      const _this = this
      var data = {
        param: {
          callPhone: row.phone,
          id: row.id
          // userId: _this.whData.id
        }
      }
      callInside(data).then(res => {
        console.log(res)
        if (res.statusCode === '00000') {
          _this.$message({ message: '拨打成功', type: 'success' })
          // _this.dialogVisible_wh = false
          _this.getlist()
        }
        debugger
      })
    },
    // 弹窗关闭，音频暂停
    handleClose() {
      var audio = document.getElementById('audio')
      audio.pause()
      this.dialogVisible_ly = false
    },
    // 录音详情
    xiugaiZx(e) {
      console.log(e)
      const _this = this
      _this.dialogVisible_ly = true
      if (e.ossUrl === '') {
        _this.lyUrl = e.recordFileDownloadUrl
        window.open(_this.lyUrl, '_blank')
      } else {
        _this.lyUrl = e.ossUrl
        window.open(_this.lyUrl, '_blank')
      }
    },
    getlist() {
      const _this = this
      _this.loading = true
      var data = {
        param: {
          current: this.Current,
          size: this.Size,
          name: this.query.name,
          phone: this.query.phone
          // startTime: _this.hstTime,
          // endTime: _this.thisTime
        }
      }
      getPageCustomerResources(data).then(res => {
        if (res.statusCode === '00000') {
          setTimeout(res => {
            _this.loading = false
          }, 300)
          _this.dataList = res.data.records
          _this.total = +res.data.total
        } else {
          _this.loading = false
        }
      }).catch(err => {
        _this.$message.error('该账号未绑定坐席')
        _this.loading = false
        console.log(err)
      })
    },
    SecondToDate(msd) {
      var time = msd

      if (time != null && time !== '') {
        if (time > 60 && time < 60 * 60) {
          time = parseInt(time / 60.0) + '分钟' + parseInt((parseFloat(time / 60.0) -

parseInt(time / 60.0)) * 60) + '秒'
        } else if (time >= 60 * 60 && time < 60 * 60 * 24) {
          time = parseInt(time / 3600.0) + '小时' + parseInt((parseFloat(time / 3600.0) -

parseInt(time / 3600.0)) * 60) + '分钟' +

parseInt((parseFloat((parseFloat(time / 3600.0) - parseInt(time / 3600.0)) * 60) -

parseInt((parseFloat(time / 3600.0) - parseInt(time / 3600.0)) * 60)) * 60) + '秒'
        } else if (time >= 60 * 60 * 24) {
          time = parseInt(time / 3600.0 / 24) + '天' + parseInt((parseFloat(time / 3600.0 / 24) -

parseInt(time / 3600.0 / 24)) * 24) + '小时' + parseInt((parseFloat(time / 3600.0) -

parseInt(time / 3600.0)) * 60) + '分钟' +

parseInt((parseFloat((parseFloat(time / 3600.0) - parseInt(time / 3600.0)) * 60) -

parseInt((parseFloat(time / 3600.0) - parseInt(time / 3600.0)) * 60)) * 60) + '秒'
        } else {
          time = parseInt(time) + '秒'
        }
      }

      return time
    },
    // 录音
    luyin(e) {
      console.log(e)
      this.lyUrl = e
      this.dialogVisible_ly = true
    },
    // 分页
    handleSizeChange(val) {
      this.Size = val
      this.getlist()
    },
    handleCurrentChange(val) {
      this.Current = val
      this.getlist()
    },
    // 时间戳转换
    formatDate(value) {
      const date = new Date(value)
      const y = date.getFullYear()
      let MM = date.getMonth() + 1
      MM = MM < 10 ? ('0' + MM) : MM
      let d = date.getDate()
      d = d < 10 ? ('0' + d) : d
      let h = date.getHours()
      h = h < 10 ? ('0' + h) : h
      let m = date.getMinutes()
      m = m < 10 ? ('0' + m) : m
      let s = date.getSeconds()
      s = s < 10 ? ('0' + s) : s
      return y + '-' + MM + '-' + d + ' ' + h + ':' + m + ':' + s
    },
    // 获取一个月有多少天
    getCountDays() {
      var curDate = new Date()
      /* 获取当前月份 */
      var curMonth = curDate.getMonth()
      /*  生成实际的月份: 由于curMonth会比实际月份小1, 故需加1 */
      curDate.setMonth(curMonth + 1)
      /* 将日期设置为0, 这里为什么要这样设置, 我不知道原因, 这是从网上学来的 */
      curDate.setDate(0)
      /* 返回当月的天数 */
      this.day = curDate.getDate()
    },
    // 获取后3天时间
    getxztime() {
      const _this = this
      var xzData = new Date()
      var year = xzData.getFullYear()
      var month = xzData.getMonth() + 1
      var today = xzData.getDate() - 7
      var hours = xzData.getHours()
      var minutes = xzData.getMinutes()
      var seconds = xzData.getSeconds()
      console.log(this.day)
      if (_this.day > today) {
        if (today <= 0) {
          console.log('负数')
          month -= 1
          today = today + _this.day
        }
        if (+month === 0) {
          month = 12
          year -= 1
          console.log('等于0')
        }
        if (today > 0 && +month !== 0) {
          // today = _this.day -7
          console.log('不是负数，不等于0')
        }
      }
      var sztime = year + '-' + month + '-' + today + ' ' + hours + ':' + minutes + ':' + seconds
      this.hstTime = Date.parse(sztime)
      console.log(this.hstTime)
    },
    // 获取当前日期
    getime() {
      // const _this = this
      var xzData = new Date()
      var year = xzData.getFullYear()
      var month = xzData.getMonth() + 1
      var today = xzData.getDate()
      var hours = xzData.getHours()
      var minutes = xzData.getMinutes()
      var seconds = xzData.getSeconds()
      var xztime = year + '-' + month + '-' + today + ' ' + hours + ':' + minutes + ':' + seconds
      this.thisTime = Date.parse(xztime)
      console.log(xztime)
    }
  }
}
</script>

<style scoped>
.toolS{
  display: flex;
  justify-content: space-between;
   padding-bottom: 10px;
   align-items:center;
}
.shaowAll{
  /* box-shadow: 2px 4px 8px 8px rgba(0, 0, 0, 0.05); */
  box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
  padding: 20px;

}
.Ptitle{
      font-size: 18px;
    line-height: 18px;
    color: #222;
    font-weight: 700;

}
.grhd_box{
  margin:20px;
}
.fenye{
    display: block;
    text-align: right;
    margin-top:20px;
}
.button{
  display: inline-block;
  padding: 4px 10px;
  background: #409eff;
  color:#fff;
  border-radius: 4px;
}
audio{
  outline: none;
}
.ls{
  color:#2acc69
}
.hs{
  color:#fb5e5e
}
</style>
