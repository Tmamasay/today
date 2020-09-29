<template>
  <div class="xfjl_box shaowAll">
    <div class="toolS">
      <el-button type="primary" style="margin-bottom:20px" @click="addZx">新增管理员</el-button>
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item label="">
          <el-input v-model="userName" placeholder="请输入管理员" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="sousuo">搜索</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-table
      v-loading="loading"
      :data="datalist"
      tooltip-effect="dark"
      style="width:95%;margin:10px auto 20px auto;"
      highlight-current-row
    >
      <el-table-column
        type="index"
        width="50"
        label="序号"
      />
      <el-table-column prop="createTime" width="180" label="添加时间">
        <template slot-scope="scope">
          {{ formatDate(scope.row.createTime) }}
        </template>
      </el-table-column>
      <el-table-column prop="userName" label="用户名" />
      <el-table-column prop="roleName" label="角色" />
      <el-table-column
        label="编辑"
      >
        <template slot-scope="scope">
          <span style="color:#00c48f;cursor: pointer;" @click="goEdit(scope.row)">编辑</span>
          <span style="color:red;cursor: pointer;padding-left:10px" @click="removeZX(scope.row)">删除</span>
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
    <!-- 用户操作 -->
    <el-dialog
      title="新增"
      :visible.sync="dialogVisible_yh"
      :close-on-click-modal="false"
      width="30%"
    >
      <el-form v-if="dialogVisible_yh" ref="yhData" label-width="100px" :model="yhData" :rules="rulesyh">
        <el-form-item label="姓名" prop="username">
          <el-input v-model="yhData.name" placeholder="请输入姓名" />
        </el-form-item>
        <el-form-item label="联系电话" prop="username">
          <el-input v-model="yhData.phone" placeholder="请输入联系电话" />
        </el-form-item>
        <el-form-item label="行业类别" prop="username">
          <el-select v-model="yhData.grade" placeholder="请选择">
            <el-option label="V1" value="1" />
            <el-option label="V2" value="2" />
            <el-option label="V3" value="3" />
          </el-select>
        </el-form-item>
        <el-form-item label="渠道商等级" prop="username">
          <el-select v-model="yhData.grade" placeholder="请选择">
            <el-option label="V1" value="1" />
            <el-option label="V2" value="2" />
            <el-option label="V3" value="3" />
          </el-select>
        </el-form-item>
        <el-form-item label="实体店名称" prop="username">
          <el-input v-model="yhData.entityName" placeholder="请输入实体店名称" />
        </el-form-item>
        <el-form-item label="实体店地址" prop="username">
          <textarea v-model="yhData.entityAdress" placeholder="请输入实体店地址" cols="30" rows="10" />
          <!-- <el-input v-model="yhData.entityAdress" placeholder="请输入实体店地址" /> -->
        </el-form-item>

        <el-form-item label="手续费率" prop="username">
          <el-input v-model="yhData.fee" placeholder="请输入用户名" />
        </el-form-item>
        <el-form-item label="登录密码" prop="password">
          <el-input v-model="yhData.password" type="password" placeholder="请输入登录密码" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible_yh=false">取 消</el-button>
        <el-button type="primary" @click="addUser('yhData')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { selectUserManagerList, updateUserManager, deleteUserManager, selectRoleList, addUserManager } from '@/api/chengxu'
// import { ttyMD5 } from '@/utils'
export default {
  data() {
    return {
      userName: '',
      options: [],
      dialogVisible_yh: false,
      yhData: {
        name: '', // 姓名
        phone: '', // 电话
        entityName: '', // 实体店名字
        entityAdress: '', // 实体店地址
        businessLicense: '', // 营业执照
        licence: '', // 许可证
        fee: '', // 手续费率
        grade: '', // 等级
        password: ''// 登陆密码
      },
      rulesyh: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        roleId: [
          { required: true, message: '请选择角色', trigger: 'change' }
        ],
        password: [
          { required: true, message: '请输入登录密码', trigger: 'change' }
        ]

      },
      datalist: [],
      yueNum: 0,
      Size: 10, // 一页多少条
      Current: 1, // 页码
      total: 0, // 总数
      time: null,
      type: null,
      loading: false // loading加载
    }
  },
  mounted() {
    this.getlist()
  },
  methods: {
    removeZX(row) {
      deleteUserManager({
        param: {
          id: row.id,
          sysName: 'tyteen'
        }
      }).then(res => {
        if (res.statusCode === '00000') {
          this.$message({ message: '操作成功', type: 'success' })
          this.getlist()
        }
      })
    },
    async addUser(formName) {
      const _this = this
      await _this.$refs[formName].validate((valid) => {
        if (valid) {
          if (!this.yhData.id) {
            // this.yhData.password = ttyMD5(this.yhData.password)
            addUserManager({
              param: this.yhData
            }).then(res => {
              if (res.statusCode === '00000') {
                _this.$message({ message: '操作成功', type: 'success' })
                _this.dialogVisible_yh = false
                _this.getlist()
              }
            })
          } else {
            updateUserManager({
              param: this.yhData
            }).then(res => {
              if (res.statusCode === '00000') {
                _this.$message({ message: '操作成功', type: 'success' })
                _this.dialogVisible_yh = false
                _this.getlist()
              }
            })
          }
        }
      })
    },
    goEdit(row) {
      this.selectRoleList()
      this.dialogVisible_yh = true
      this.yhData = {
        id: row.id,
        roleId: row.roleId,
        username: row.username
      }
    },
    addZx() {
      this.dialogVisible_yh = true
      this.yhData = {
        password: '',
        roleId: '',
        username: ''
      }
      this.selectRoleList()
    },
    goDetail(e, v) {
      this.$router.push({ path: '/detial', query: { companyStatus: e, customerId: v }})
    },
    async selectRoleList() {
      await selectRoleList({
        param: {
          sysName: 'tyteen'
        }
      }).then(res => {
        if (res.statusCode === '00000') {
          this.options = res.data
        }
      })
    },
    getlist() {
      const _this = this
      _this.loading = true
      var data = {
        param: {
          userName: _this.userName,
          pageNum: _this.Current,
          pageSize: _this.Size

        }
      }
      selectUserManagerList(data).then(res => {
        console.log(res)
        if (res.statusCode === '00000') {
          setTimeout(res => {
            _this.loading = false
          }, 300)
          _this.datalist = res.data.records
          _this.total = res.data.total
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
