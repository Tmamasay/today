<template>
  <!-- 打印机管理 -->
  <div class="fenlei_admin_box shaowAll" :style="{height:bodyHeight}">
    <div class="fenlei_admin">
      <div class="top_form">
        <el-form :inline="true" size="mini">
          <el-form-item label="设备编号：">
            <el-input v-model="searchData.deviceSn" placeholder="请输入设备编号" />
          </el-form-item>
          <!-- <el-form-item label="编辑时间：">
            <el-date-picker
              v-model="searchData.date_value"
              type="daterange"
              unlink-panels
              value-format="yyyy-MM-dd"
              format="yyyy-MM-dd"
              range-separator="-"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            />
          </el-form-item> -->
          <el-form-item>
            <el-button type="primary" size="mini" icon="el-icon-search" @click="search">搜索</el-button>
            <el-button type="primary" size="mini" icon="el-icon-plus" @click="addFenleipop">添加设备</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="list_box">
        <el-table
          v-loading="loading"
          :data="tableData"
          highlight-current-row
          style="height:600px;overflow: auto;"
          size="mini"
        >
          <el-table-column prop="deviceSn" label="设备编号" />
          <el-table-column prop="deviceName" label="设备名称" />
          <el-table-column prop="status" label="状态">
            <template slot-scope="scope">
              <span v-if="scope.row.deviceStatus===0" class="noUseSign">未分配</span>
              <span v-else-if="scope.row.deviceStatus===1" class="useSign" type="danger">已分配</span>
            </template>
          </el-table-column>
          <!-- <el-table-column prop="updateName" label="编辑者" align="center" /> -->
          <el-table-column prop="createTime" label="创建时间" align="center" />
          <el-table-column prop="operation" label="操作" align="center">
            <template slot-scope="scope">
              <el-button v-if="scope.row.deviceStatus===0" type="text" size="mini" @click="payChannel(scope.row)">分配设备</el-button>
              <el-button type="text" size="mini" @click="remove(scope.row)">删除</el-button>

            </template>
          </el-table-column>
        </el-table>
        <el-row>
          <el-pagination
            class="page-footer"
            :current-page="current"
            :page-sizes="[10, 20, 30, 50]"
            :page-size="size"
            :total="total"
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="pageSizeChange"
            @current-change="currentPageChange"
          />
        </el-row>
      </div>
      <div class="add_fenlei">
        <el-dialog
          :title="title"
          :visible.sync="addFenleivisible"
          :close-on-click-modal="false"
          style="width:60%;margin:0 auto"
        >
          <el-form v-if="addFenleivisible" ref="addEditData" :rules="addEditrules" :model="addEditData" label-width="100px" size="mini">
            <el-form-item label="设备编号：" style="line-height:60px" prop="deviceSn">
              <el-input v-model="addEditData.deviceSn" placeholder="请填写设备编号" style="width:70%;" />
            </el-form-item>

          </el-form>
          <div class="el-center">
            <el-button type="primary" size="mini" @click="onSubmit('addEditData')">提交</el-button>
            <el-button size="mini" plain @click="addFenleivisible=false">取消</el-button>
          </div>
        </el-dialog>
        <!--分配打印机-->
        <el-dialog
          title="分配打印机"
          :visible.sync="shareVisible"
          :close-on-click-modal="false"
          style="width:60%;margin:0 auto"
        >
          <el-form v-if="shareVisible" ref="shareForm" :rules="shareRules" :model="shareForm" label-width="100px" size="mini">
            <el-form-item label="设备备注：" style="line-height:60px" prop="deviceName">
              <el-input v-model="shareForm.deviceName" placeholder="请填写设备编号" style="width:70%;" />
            </el-form-item>
            <el-form-item label="渠道商：" style="line-height:60px" prop="storeId">
              <el-autocomplete
                v-model="shareForm.storeId"
                :fetch-suggestions="querySearchAsync"
                placeholder="请输入内容"
                @select="handleSelect"
              />
            </el-form-item>
          </el-form>
          <div class="el-center">
            <el-button type="primary" size="mini" @click="onShareSubmit('shareForm')">提交</el-button>
            <el-button size="mini" plain @click="addFenleivisible=false">取消</el-button>
          </div>
        </el-dialog>
      </div>
    </div>
  </div>
</template>

<script>
import { pagePrintDevice, addPrintDevice, delPrintDevice, selectStoreList, setPrintStore } from '@/api/user'
export default {
  data() {
    return {
      datalist: [],
      checkGoods: [], // 选中商品数组
      checkClassFy: '', // 选中分类
      // 上传中转
      uploadData: '',
      fileList: [],
      shareVisible: false,
      bodyHeight: '', // 获取浏览器的高度，背景色
      searchData: {// 搜索数据
        deviceSn: '' // 分类名称

      },
      tableData: [], // 表格数据
      loading: false, // 表格loding加载
      fenleiShow: 1, // 一级二级分类隐藏显示:1：一级 2:二级
      Current: 0, // 页码
      Size: 10, // 一页10条数据
      current: 0, // 页码
      size: 10, // 一页10条数据
      total: 0, // 数据总条数
      addFenleivisible: false, // 新增分类、编辑弹出框
      title: '', // 新增分类、编辑名字
      addEditData: {// 新增、编辑字段
        deviceSn: '' // 设备编号

      },
      shareForm: {
        deviceName: '',
        id: '',
        storeId: ''
      },
      addEditrules: {
        deviceSn: [
          { required: true, message: '请填写设备编号', trigger: 'blur' }
        ]

      },
      shareRules: {
        deviceName: [
          { required: true, message: '请填写设备备注', trigger: 'blur' }
        ],
        storeId: [
          { required: true, message: '请选择渠道商', trigger: 'change' }
        ]

      }
    }
  },
  mounted() {
    /*
    *功能描述：获取屏幕高度添加背景色
    *开发人员：LRS
    */
    this.bodyHeight = window.innerHeight - 85 + 'px'
    /*
    *功能描述：获取列表
    *开发人员：LRS
    */
    this.getlist()
  },
  methods: {
    handleSelect(item) {
      this.shareForm.storeId = item.id
      console.log(item)
    },
    payChannel(row) {
      this.shareForm = {
        deviceName: '',
        id: '',
        storeId: ''
      }
      this.shareVisible = true
      this.shareForm.id = row.id
    },
    querySearchAsync(queryString, cb) {
      // const _this = this
      var data = {

        current: 0,
        size: 100,
        storeName: queryString

      }
      selectStoreList(data).then(res => {
        console.log(res)
        if (res.status) {
          const Arr_ = []
          res.data.records.forEach(element => {
            const Sarr_ = {
              value: element.storeName,
              id: element.id
            }
            Arr_.push(Sarr_)
          })
          console.log(Arr_)
          cb(Arr_)
          // return Arr_
        }
      })
    },

    // =======
    /*
    *功能描述：获取列表
    *开发人员：CX
    */
    getlist() {
      const _this = this
      _this.loading = true
      pagePrintDevice({
        current: _this.current,
        size: _this.size,
        deviceSn: _this.searchData.deviceSn
      }).then(res => {
        if (res.status) {
          _this.tableData = res.data.records
          _this.total = res.data.total
          setTimeout(() => {
            _this.loading = false
          }, 300)
        }
      })
    },
    /*
    *功能描述：搜索
    *开发人员：LRS
    */
    search() {
      this.getlist()
    },
    /*
    *功能描述：一级添加分类弹出框
    *开发人员：LRS
    */
    addFenleipop() {
      this.title = '添加设备'
      this.fileList = []
      this.addEditData = {// 新增、编辑字段
        deviceSn: '' // 设备编号
      }
      this.addFenleivisible = true
    },

    /*
    *功能描述：新增、编辑分类提交
    *开发人员：LRS
    */
    onSubmit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          addPrintDevice(this.addEditData).then(res => {
            console.log(res)
            if (res.status) {
              this.$message({ message: '添加成功', type: 'success' })
              this.addFenleivisible = false
              this.getlist()
            }
          })
        }
      })
    },
    onShareSubmit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          setPrintStore(this.shareForm).then(res => {
            console.log(res)
            if (res.status) {
              this.$message({ message: '添加成功', type: 'success' })
              this.shareVisible = false
              this.getlist()
            }
          })
        }
      })
    },

    /*
    *功能描述：删除分类
    *开发人员：LRS
    */
    remove(e) {
      var data = {
        id: e.id
      }
      this.$confirm('此操作将删除该轮播, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delPrintDevice(data).then(res => {
          console.log(res)
          if (res.status) {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.getlist()
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },

    /*
    *功能描述：分页点击页码
    *开发人员：LRS
    */
    currentPageChange(val) {
      console.log(val)
      this.current = val
      this.getlist()
    },
    /*
    *功能描述：分页选择条数
    *开发人员：LRS
    */
    pageSizeChange(val) {
      console.log(val)
      this.size = val
      this.getlist()
    }

  }
}
</script>

<style scoped>

.useSign{

  padding: 5px 8px;
  background-color:#00c48f !important;
 color:#fff ;
 border-radius: 4px;
}
.noUseSign{
   padding: 5px 8px;
  background-color:rgb(167, 167, 167) !important;
 color:#fff ;
 border-radius: 4px;
}
.fenlei_admin_box{
  /* background: #F5F5FA; */
  overflow: hidden;
   margin:20px;
}
.shaowAll{
  /* box-shadow: 2px 4px 8px 8px rgba(0, 0, 0, 0.05); */
  box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
  padding: 20px;

}
/* .el-button--text{
color: #00c48f !important;
} */
.fenlei_admin_box .fenlei_admin{
  background: #fff;
  margin:15px;
  padding: 15px;
}
.page-footer{
  margin-top:20px;
  float: right;
}
.border{
  display: inline-block;
  width:100%;
  height: 28px;
  line-height: 28px;
  border: 1px solid #DCDFE6;
  border-radius: 4px;
  padding:0 15px;
  font-size:12px;
}
.avatar-uploader .el-upload {
  cursor: pointer;
  position: relative;
  display: block !important;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 60px;
  height: 60px;
  line-height: 60px;
  border: 1px dashed #d9d9d9;
  text-align: center;
}
.avatar {
  max-width: 100%;
  height: 100px;
  display: block;
  object-fit: cover;
}
</style>
