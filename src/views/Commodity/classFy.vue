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
          <el-button size="small" type="danger" @click="removeZX(scope.row)">删除</el-button>

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
      title="行业操作"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      width="30%"
    >
      <!-- <EditorImage v-if="dialogVisible" :value="content" @editlisten="geteditS" /> -->
      <el-form v-if="dialogVisible" ref="addClassfy" :label-position="labelPosition" label-width="50px" :model="addClassfy" :rules="rulesClass">
        <el-form-item label="行业" prop="className">
          <el-input v-model="addClassfy.className" placeholder="请输入行业" />
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="zx_submit('addClassfy')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getTradeList, checkTrade, addTrade, updateTrade, delTrade } from '@/api/user'
export default {

  data() {
    const validateClassfyName = async(rule, value, callback) => {
      if (!this.addClassfy.id) {
        const { data } = await checkTrade({ tradeName: value })
        if (!value) {
          callback(new Error('请输入行业类别名'))
        } else if (!data) {
          callback(new Error('行业类别名名称已存在'))
        } else {
          callback()
        }
      } else {
        if (!value) {
          callback(new Error('请输入行业类别名'))
        } else {
          callback()
        }
      }
    }
    return {
      addClassfy: {
        className: ''

      },
      dialogVisible: false,
      loading: false, // loading加载
      rulesClass: {
        className: [
          { required: true, trigger: 'blur', validator: validateClassfyName }
        ] }
    }
  },
  mounted() {
    this.getlist()
  },
  methods: {
    removeZX(row) {
      delTrade({
        id: row.id
        // tradeName: row.tradeName
      }).then(res => {
        if (res.status) {
          this.$message({ message: '操作成功', type: 'success' })
          this.getlist()
        }
      })
    },
    goEdit(row) {
      this.dialogVisible = true
      this.addClassfy = {
        id: row.id,
        className: row.tradeName
      }
    },
    async zx_submit(formName) {
      const _this = this
      await _this.$refs[formName].validate((valid) => {
        if (valid) {
          if (!this.addClassfy.id) {
            // this.yhData.password = ttyMD5(this.yhData.password)
            const _param = {
              tradeName: this.addClassfy.className
            }
            addTrade(_param).then(res => {
              if (res.status) {
                _this.$message({ message: '操作成功', type: 'success' })
                _this.dialogVisible = false
                _this.getlist()
              }
            })
          } else {
            const _param2 = {
              id: this.addClassfy.id,
              tradeName: this.addClassfy.className
            }
            updateTrade(_param2).then(res => {
              if (res.status) {
                _this.$message({ message: '操作成功', type: 'success' })
                _this.dialogVisible = false
                _this.getlist()
              }
            })
          }
        }
      })
    },
    addClassFy() {
      this.dialogVisible = true
      this.addClassfy = {
        className: ''
      }
    },
    goClassFy(row) {
      this.$router.push({ path: '/commoditList', query: { tradeId: row.id }})
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
