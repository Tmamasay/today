<template>
  <div class="xfjl_box shaowAll">
    <div class="toolS">
      <el-button type="primary" style="margin-bottom:20px" @click="addClassFy">新增行业</el-button>
      <!-- <p class="Ptitle">会员列表</p> -->
      <!-- <el-form :inline="true" class="demo-form-inline">
        <el-form-item label="">
          <el-input v-model="companyName" placeholder="请输入公司名称" />
        </el-form-item>
        <el-form-item label="">
          <el-input v-model="phone" placeholder="请输入手机号" />
        </el-form-item>
        <el-form-item label="">
          <el-date-picker
            v-model="time"
            type="daterange"
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
          />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="sousuo">搜索</el-button>
        </el-form-item>
      </el-form> -->
    </div>
    <el-table
      v-loading="loading"
      :data="datalist"
      tooltip-effect="dark"
      style="width:95%;margin:10px auto 20px auto;"
      highlight-current-row
    >
      <el-table-column prop="tradeName" label="行业" />
      <el-table-column prop="createTime" label="创建时间" />
      <el-table-column
        label="编辑"
      >
        <template slot-scope="scope">
          <el-button size="small" @click="goEdit(scope.row)">编 辑</el-button>
          <el-button size="small" @click="goClassFy(scope.row)">分类管理</el-button>

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
      title="资讯操作"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      width="50%"
    >
      <!-- <EditorImage v-if="dialogVisible" :value="content" @editlisten="geteditS" /> -->
      <el-form v-if="dialogVisible" ref="addZxData" :label-position="labelPosition" label-width="140px" :model="addZxData" :rules="rulesZx">
        <el-form-item label="摘要" prop="remark">
          <el-input v-model="addZxData.remark" placeholder="请输入摘要" />
        </el-form-item>
        <el-form-item label="来源" prop="source">
          <el-input v-model="addZxData.source" placeholder="请输入来源" />
        </el-form-item>
        <el-form-item label="标题" prop="title">
          <el-input v-model="addZxData.title" placeholder="请输入标题" />
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="zx_submit('addZxData')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getGoodsTypeByAdmin, getTradeList } from '@/api/user'
export default {
  data() {
    return {
      dialogVisible: false,
      loading: false // loading加载
    }
  },
  mounted() {
    this.getlist()
  },
  methods: {
    goDetail(e, v) {
      this.$router.push({ path: '/detial', query: { companyStatus: e, customerId: v }})
    },
    getlist() {
      const _this = this
      _this.loading = true
      getTradeList().then(res => {
        console.log(res)
        if (res.status) {
          setTimeout(res => {
            _this.loading = false
          }, 300)
          _this.datalist = res.data
        }
      })
    },
    // 搜索
    sousuo() {
      this.Current = 1
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
    toNum(value) {
      if (!value) return 0
      return value.toFixed(2)
    },
    // 分页
    handleSizeChange(val) {
      this.Size = val
      this.getlist()
    },
    handleCurrentChange(val) {
      this.Current = val
      this.getlist()
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
.xfjl_box{
  margin:20px;
}
.el-button{
    padding: 8px 12px !important;
}
.fenye{
    display: block;
    text-align: right;
    margin-top:20px;
}
.yue{
  width:100%;
  height:50px;
  font-size: 18px;
    color: #606266;
    line-height: 50px;
    padding-left: 10px;
    font-weight: 600;
  background: #fff;
  float:left;
  margin-bottom: 20px;
  /* margin-left:122px; */
  box-shadow: 0px 0px 5px #d2d2d2;
  border-radius: 5px;
  /* margin-top:20px; */
}
</style>
