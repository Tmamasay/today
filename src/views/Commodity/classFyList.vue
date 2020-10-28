<template>
  <div class="hw_admin_box shaowAll">
    <el-button type="primary" style="margin-bottom:20px" @click="addClassFy">新增行业</el-button>
    <el-row>
      <el-col v-if="datalist.length" :span="20">
        <el-table
          v-loading="loading"
          :data="datalist"
          tooltip-effect="dark"
          style="width:95%;margin:10px auto 20px auto;"
          highlight-current-row
          @row-click="showDetaiList"
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
      </el-col>
      <el-col :span="4">

        <div v-if="classFyList.length" style="width:200px;margin:0 auto">
          <el-tree
            :data="classFyList"
            node-key="id"
            default-expand-all
            :expand-on-click-node="false"
          >
            <span slot-scope="{ node, data }" class="custom-tree-node">
              <span class="caoNa">{{ node.label }}</span>
              <el-dropdown class="more_right">
                <span class="el-dropdown-link">
                  <i class="el-icon-more" />
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item @click.native="addFy(data)">新增下级</el-dropdown-item>
                  <el-dropdown-item @click.native="edit(data)">编辑</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
              <!-- <span>
                <span class="caoz" @click="() => addFy(data)">新增下级</span>
                <span class="caoz" @click="() => edit(data)">编辑</span>
                <el-button
              type="text"
              size="mini"
              @click="() => remove(node, data)"
            >
              删除
            </el-button>
              </span> -->
            </span>
          </el-tree>
        </div>
        <div class="toolS" style="width:100px;margin:20px auto">
          <el-button size="small" type="primary" icon="el-icon-plus" @click="addFy()">新增一级分类</el-button>
        </div>
      </el-col>
    </el-row>
    <el-dialog
      title="新增分类"
      :visible.sync="dialogVisibleFy"
      :close-on-click-modal="false"
      width="30%"
    >
      <!-- <EditorImage v-if="dialogVisible" :value="content" @editlisten="geteditS" /> -->
      <el-form v-if="dialogVisibleFy" ref="fyList" label-width="70px" :model="fyList" :rules="rulesClass">
        <el-form-item label="分类名" prop="name">
          <el-input v-model="fyList.name" placeholder="请输入分类名" />
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="zx_submit('fyList')">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog
      title="行业操作"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      width="30%"
    >
      <!-- <EditorImage v-if="dialogVisible" :value="content" @editlisten="geteditS" /> -->
      <el-form v-if="dialogVisible" ref="addClassfy" label-width="140px" :model="addClassfy" :rules="rulesClassL">
        <el-form-item label="行业" prop="className">
          <el-input v-model="addClassfy.className" placeholder="请输入行业" />
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="zx_submitHy('addClassfy')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getTradeList, checkTrade, addTrade, updateTrade, delTrade, getGoodsTypeByAdmin, addGoodsTypeByAdmin, updateGoodsTypeByAdmin } from '@/api/user'
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
      datalist: [],
      addClassfy: {
        className: ''
      },
      checkOneTab: '',
      dialogVisible: false,
      loading: false, // loading加载
      rulesClassL: {
        className: [
          { required: true, trigger: 'blur', validator: validateClassfyName }
        ] },

      dialogVisibleFy: false,
      addObj: {
        rootId: ''
      },
      classFyList: [],
      fyList: {
        name: '',
        rootId: '',
        tradeId: ''
      }, // 分类
      rulesClass: {
        name: [
          { required: true, message: '请输入分类名', trigger: 'blur' }
        ]
      }

    }
  },
  created() {

    // this.choiceBm()
  },
  mounted() {
    this.getClassList()
  },
  methods: {

    showDetaiList(row, column, event) {
      this.classFyList = []
      this.checkOneTab = row.id
      this.getlist()
    },
    // ======列表=====
    async getClassList() {
      const _this = this

      _this.loading = true
      await getTradeList().then(res => {
        console.log(res)
        if (res.status) {
          setTimeout(res => {
            _this.loading = false
          }, 300)
          _this.datalist = res.data
          if (_this.datalist.length) {
            this.checkOneTab = this.datalist[0].id
            this.getlist()
          }
        }
      })
    },
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
    async zx_submitHy(formName) {
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
    // ===============end
    async zx_submit(formName) {
      const _this = this
      await _this.$refs[formName].validate((valid) => {
        if (valid) {
          if (!this.fyList.id) {
            // this.yhData.password = ttyMD5(this.yhData.password)
            const _param = {
              name: this.fyList.name,
              rootId: this.addObj.rootId,
              // tradeId: this.$route.query.tradeId
              tradeId: this.checkOneTab
            }
            addGoodsTypeByAdmin(_param).then(res => {
              if (res.status) {
                _this.$message({ message: '操作成功', type: 'success' })
                _this.dialogVisibleFy = false
                _this.getlist()
              }
            })
          } else {
            const _param2 = {
              id: this.fyList.id,
              name: this.fyList.name
            }
            updateGoodsTypeByAdmin(_param2).then(res => {
              if (res.status) {
                _this.$message({ message: '操作成功', type: 'success' })
                _this.dialogVisibleFy = false
                _this.getlist()
              }
            })
          }
        }
      })
    },
    addFy(data) {
      console.log(data)
      this.addObj.rootId = null
      if (data) {
        this.addObj.rootId = data.id
      }
      this.dialogVisibleFy = true
      this.fyList.name = ''
    },
    generateRoutes(routes) {
      const res = []
      routes.forEach(route => {
        const data = {
          id: route.id,
          label: route.name
        }
        if (route.children && route.children.length) {
          data.children = this.generateRoutes(route.children)
        }
        res.push(data)
      })
      return res
    },
    remove(node, data) {
      const parent = node.parent
      const children = parent.data.children || parent.data
      const index = children.findIndex(d => d.id === data.id)
      children.splice(index, 1)
    },
    edit(data) {
      console.log(data)
      this.dialogVisibleFy = true
      this.fyList.id = data.id
      this.fyList.name = data.label
    },
    // 列表
    async getlist() {
      const _this = this
      var data = {
        // tradeId: this.$route.query.tradeId
        tradeId: this.checkOneTab
      }
      await getGoodsTypeByAdmin(data).then(res => {
        console.log(res)
        if (res.status) {
          _this.classFyList = this.generateRoutes(res.data.children)
          console.log(_this.classFyList)
        }
      })
    },
    // 搜索
    search() {
      // this.hwCurrent = 1
      // this.getlist()
    },
    // 修改表格头部颜色
    tableHeaderColor({ row, column, rowIndex, columnIndex }) {
      if (rowIndex === 0) {
        return 'background:rgba(232,243,253,1);color:rgba(54,52,69,1);border-right:1px solid #fff'
      }
    }
    // // 分页
    // handleSizeChange(val) {
    //   this.hwSize = val
    //   this.getlist()
    // },
    // handleCurrentChange(val) {
    //   this.hwCurrent = val
    //   this.getlist()
    // }
  }
}
</script>

<style scoped>
.el-tree-node{
line-height:40px !important;
}
.custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
}
.el-icon-more{
  transform:rotate(90deg);
  color:#606266;
}
.caoNa{
  /* display: inline-block; */
  font-weight: 500;
}
.addClFy{
  color: #00c48f !important;
  cursor: pointer;
  text-align: center;
    font-size: 14px;
}
.caoz{
  color: rgb(0, 196, 143);
    cursor: pointer;
    font-size: 14px;
    padding-left: 15px;
}
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
.hw_admin_box{
    margin:20px;
}
.fenye{
    display: block;
    text-align: right;
    margin-top:20px;
}
.el-button{
    padding: 8px 12px !important;
    position: relative;
}
.el-message-box {
    width: 1500px !important;
  }
</style>
