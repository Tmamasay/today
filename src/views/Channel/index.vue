<template>
  <div class="xfjl_box shaowAll">
    <div class="toolS">
      <el-button type="primary" style="margin-bottom:20px" @click="addZx">新增渠道商</el-button>
      <el-form :inline="true" :model="query" size="small" class="demo-form-inline">
        <el-form-item label="渠道商名称">
          <el-input v-model="query.storeName" placeholder="请输入渠道商名称" />
        </el-form-item>
        <el-form-item label="店铺名称(真实的)">
          <el-input v-model="query.storeRealName" placeholder="请输入店铺名称(真实的)" />
        </el-form-item>
        <el-form-item label="联系人">
          <el-input v-model="query.userName" placeholder="请输入联系人" />
        </el-form-item>
        <el-form-item label="手机号">
          <el-input v-model="query.mobile" placeholder="请输入手机号" />
        </el-form-item>
        <el-form-item label="行业类别">
          <el-select v-model="query.tradeTypeId" placeholder="请选择" style="width:92%">
            <el-option label="请选择" value="" />
            <el-option v-for="item in options" :key="item.id" :label="item.tradeName" :value="item.id" />
          </el-select>
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
      <!-- <el-table-column prop="createTime" width="180" label="添加时间">
        <template slot-scope="scope">
          {{ formatDate(scope.row.createTime) }}
        </template>
      </el-table-column> -->
      <el-table-column prop="storeName" label="渠道商名称" />
      <el-table-column prop="tradeType" label="行业" />
      <el-table-column prop="storeLevel" label="等级" />
      <el-table-column prop="status" label="状态">
        <template slot-scope="scope">
          <span v-if="scope.row.status==='USE'" class="useSign">使用中</span>
          <span v-else-if="scope.row.status==='STOP' " class="noUseSign" type="danger">已禁用</span>
        </template>
      </el-table-column>
      <el-table-column prop="rate" label="手续费率">
        <template slot-scope="scope">
          <!-- {{ (scope.row.rate/100).toFixed(2) }}% -->
          {{ scope.row.rate }}%
        </template>
      </el-table-column>
      <el-table-column prop="storeRealName" label="实体店名字" />
      <el-table-column prop="storeAddress" label="实体店地址" />
      <el-table-column prop="userName" label="联系人" />
      <el-table-column prop="mobile" label="联系电话" />
      <el-table-column prop="createTime" width="150" label="创建时间" />
      <el-table-column
        label="编辑"
        width="230"
      >
        <template slot-scope="scope">
          <span style="color:#00c48f;cursor: pointer;" @click="goSCode(scope.row)">店铺二维码</span>
          <span style="color:#00c48f;cursor: pointer;" @click="goEdit(scope.row)">编辑</span>
          <span style="color:#00c48f;cursor: pointer;" @click="goHasLunbo(scope.row)">已有轮播</span>
          <span style="color:#00c48f;cursor: pointer;" @click="goNoLunbo(scope.row)">关联轮播</span>
          <span v-if="scope.row.status==='USE'" style="color:red;cursor: pointer;padding-left:10px" @click="removeZX(scope.row)">冻结</span>
          <span v-if="scope.row.status==='STOP'" style="color:#00c48f;cursor: pointer;padding-left:10px" @click="removeZX(scope.row)">解冻</span>
          <span style="color:#00c48f;cursor: pointer;" @click="goGg(scope.row)">公告信息</span>
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
    <!-- 渠道商操作 -->
    <el-dialog
      title="渠道商操作"
      :visible.sync="dialogVisible_yh"
      :close-on-click-modal="false"
      width="40%"
    >
      <el-form v-if="dialogVisible_yh" ref="yhData" label-position="right" :inline="true" label-width="120px" :model="yhData" :rules="rulesyh">
        <el-form-item label="渠道商名称" prop="name">
          <el-input v-model="yhData.name" placeholder="请输入渠道商名称" />
        </el-form-item>
        <el-form-item v-if="!yhData.id" label="渠道商账号" prop="account">
          <el-input v-model="yhData.account" placeholder="请输入渠道商账号" />
        </el-form-item>
        <el-form-item label="行业类别" prop="industry">
          <el-select v-model="yhData.industry" placeholder="请选择" style="width:92%">
            <el-option v-for="item in options" :key="item.id" :label="item.tradeName" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="菜单等级" style="margin-left:-15px">
          <el-select v-model="yhData.menuLevel" placeholder="请选择" style="width:92%">
            <el-option label="一级" value="0" />
            <el-option label="二级" value="1" />
          </el-select>
        </el-form-item>
        <el-form-item label="渠道商等级" prop="grade">
          <el-select v-model="yhData.grade" placeholder="请选择" style="width:92%">
            <el-option label="V1" value="1" />
            <el-option label="V2" value="2" />
            <el-option label="V3" value="3" />
          </el-select>
        </el-form-item>

        <el-form-item label="实体店名称" prop="entityName" style="margin-left:-15px">
          <el-input v-model="yhData.entityName" placeholder="请输入实体店名" />
        </el-form-item>
        <el-form-item label="实体店地址" prop="entityAdress">
          <!-- <textarea v-model="yhData.entityAdress" style="border:1px solid #DCDFE6" placeholder="请输入实体店地址" cols="30" rows="4" /> -->
          <el-input v-model="yhData.entityAdress" placeholder="请输入实体店地址" />
        </el-form-item>
        <el-form-item label="联系人" prop="contacts">
          <el-input v-model="yhData.contacts" placeholder="请输入微信绑定真实姓名" />
        </el-form-item>
        <el-form-item label="联系电话" prop="phone">
          <el-input v-model="yhData.phone" placeholder="请输入联系电话" />
        </el-form-item>
        <el-form-item label="手续费率" prop="fee">
          <el-input v-model="yhData.fee" placeholder="请输入手续费率（最低千分之六）" />
        </el-form-item>
        <el-form-item v-if="!yhData.id" label="登录密码" prop="password">
          <el-input v-model="yhData.password" type="password" placeholder="请输入登录密码" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible_yh=false">取 消</el-button>
        <el-button type="primary" @click="addUser('yhData')">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 关联轮播图 -->
    <el-dialog
      title="已关联轮播图"
      :visible.sync="dialogVisible_lb"
      :close-on-click-modal="false"
      width="40%"
    >
      <div>
        <el-table
          v-loading="loading"
          :data="tableData"
          highlight-current-row
          style="height:600px;overflow: auto;"
          size="mini"
        >
          <el-table-column prop="imgName" label="轮播名称" />
          <el-table-column prop="img" label="图片">
            <template slot-scope="scope">
              <div slot="reference" class="name-wrapper">
                <img
                  :src="scope.row.img"
                  alt="无图片"
                  style="height: 50px; width: 50px;display: block;cursor: pointer;"
                >

              </div>
            </template>
          </el-table-column>
          <el-table-column prop="sort" label="排序" align="center">
            <template slot-scope="scope">
              {{ scope.row.orderNum }}
            </template>
          </el-table-column>
          <el-table-column prop="createTime" label="编辑时间" align="center" />
          <el-table-column prop="operation" label="操作" align="center">
            <template slot-scope="scope">
              <el-button type="text" size="mini" @click="remove(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-dialog>

    <!-- 未关联轮播图 -->
    <el-dialog
      title="未关联轮播图"
      :visible.sync="dialogVisible_nolb"
      :close-on-click-modal="false"
      width="40%"
    >
      <div>
        <el-table
          v-loading="loading"
          :data="tableNoData"
          highlight-current-row
          style="height:600px;overflow: auto;"
          size="mini"
        >
          <el-table-column prop="imgName" label="轮播名称" />
          <el-table-column prop="img" label="图片">
            <template slot-scope="scope">
              <div slot="reference" class="name-wrapper">
                <img
                  :src="scope.row.img"
                  alt="无图片"
                  style="height: 50px; width: 50px;display: block;cursor: pointer;"
                >

              </div>
            </template>
          </el-table-column>
          <el-table-column prop="sort" label="排序" align="center">
            <template slot-scope="scope">
              {{ scope.row.orderNum }}
            </template>
          </el-table-column>
          <el-table-column prop="createTime" label="编辑时间" align="center" />
          <el-table-column prop="operation" label="操作" align="center">
            <template slot-scope="scope">
              <el-button type="text" size="mini" @click="relaTion(scope.row)">关联轮播</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-dialog>
    <!-- 店铺二维码 -->
    <el-dialog
      title="店铺二维码"
      :visible.sync="dialogVisible_SCode"
      :close-on-click-modal="false"
      width="40%"
    >
      <div class="SCodeIM">
        <img :src="scodeUrl" alt="" srcset="">
      </div>
      <el-button type="text" size="mini" @click="downLoad(scodeUrl)">下载</el-button>
    </el-dialog>
    <!--公示信息-->
    <el-dialog
      title="店铺公示信息"
      :visible.sync="dialogVisible_Gs"
      :close-on-click-modal="false"
      width="50%"
    >
      <div v-if="dialogVisible_Gs" style="height:530px">
        <EditorImage :value="GsCont" @editlisten="geteditS" />
      </div>
      <el-button type="primary" size="medium" style="margin-left:430px" @click="makeSurGs">确    定</el-button>
    </el-dialog>
  </div>
</template>

<script>
import { getStorePublicInfo, addOrUpdatePublicInfo, generateStoreCode, delStoreChart, getStoreChart, selectNoChartByStoreId, setStoreChart, addStore, getTradeList, checkAddStore, selectStoreList, disableStoreOne, getStoreOne, updateStoreOne } from '@/api/user'
// import { ttyMD5 } from '@/utils'
import EditorImage from '@/components/Tinymce/index' // 富文本编辑

export default {
  components: { EditorImage },
  data() {
    const validatePhone = (rule, value, callback) => {
      const reg = /^1([38][0-9]|4[579]|5[0-3,5-9]|6[6]|7[0135678]|9[89])\d{8}$/
      const ss = reg.test(value)
      if (!value) {
        callback(new Error('请输入手机号码'))
      } else if (!ss) {
        callback(new Error('手机号码格式错误'))
      } else {
        callback()
      }
    }
    const validateLoginName = async(rule, value, callback) => {
      if (!this.yhData.id) {
        const { data } = await checkAddStore({ loginName: value })
        if (!value) {
          callback(new Error('请输入渠道商账号'))
        } else if (!data) {
          callback(new Error('渠道商账号已存在'))
        } else {
          callback()
        }
      } else {
        if (!value) {
          callback(new Error('请输入渠道商账号'))
        } else {
          callback()
        }
      }
    }
    const validateStoreName = async(rule, value, callback) => {
      if (!this.yhData.id) {
        const { data } = await checkAddStore({ storeName: value })
        if (!value) {
          callback(new Error('请输入渠道商名称'))
        } else if (!data) {
          callback(new Error('渠道商名称已存在'))
        } else {
          callback()
        }
      } else {
        if (!value) {
          callback(new Error('请输入渠道商名称'))
        } else {
          callback()
        }
      }
    }
    const validateStoreRealName = async(rule, value, callback) => {
      if (!this.yhData.id) {
        const { data } = await checkAddStore({ storeRealName: value })
        if (!value) {
          callback(new Error('请输入实体店铺名称'))
        } else if (!data) {
          callback(new Error('实体店铺名称已存在'))
        } else {
          callback()
        }
      } else {
        if (!value) {
          callback(new Error('请输入实体店铺名称'))
        } else {
          callback()
        }
      }
    }
    return {
      query: {
        mobile: '', // 手机号
        storeName: '', // 渠道商名称
        storeRealName: '', // 店铺名称(真实的)
        userName: '', // 联系人
        tradeTypeId: ''// 行业类别
      },
      dialogVisible_Gs: false,
      // 关于轮播
      dialogVisible_SCode: false,
      scodeUrl: '',
      dialogVisible_lb: false,
      dialogVisible_nolb: false,
      tableData: [],
      tableNoData: [],
      putStoreId: '',
      // ====
      userName: '',
      options: [],
      dialogVisible_yh: false,
      yhData: {
        menuLevel: '1', // 渠道商菜单等级
        name: '', // 渠道商名称
        account: '', // 账号
        industry: '', // 行业
        grade: '', // 等级
        entityName: '', // 实体店名字
        entityAdress: '', // 实体店地址
        contacts: '', // 联系人
        phone: '', // 联系电话
        fee: '', // 手续费率
        password: '' // 登陆密码
        // businessLicense: '', // 营业执照
        // licence: '', // 许可证
      },
      rulesyh: {
        name: [
          { required: true, trigger: 'blur', validator: validateStoreName }
        ],
        account: [
          { required: true, trigger: 'blur', validator: validateLoginName }
        ],
        industry: [
          { required: true, message: '请选择所属行业', trigger: 'change' }
        ],
        grade: [
          { required: true, message: '请选择渠道商等级', trigger: 'change' }
        ],
        entityName: [
          { required: true, trigger: 'blur', validator: validateStoreRealName }
        ],
        entityAdress: [
          { required: true, message: '请输入实体店地址', trigger: 'blur' }
        ],
        contacts: [
          { required: true, message: '请输入微信绑定真实姓名', trigger: 'blur' }
        ],
        phone: [
          { required: true, trigger: 'blur', validator: validatePhone }
        ],
        fee: [
          { required: true, message: '请输入手续费率', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入登陆密码', trigger: 'blur' }
        ]

      },
      datalist: [
        {
          name: '测试渠道商',
          account: 'chengXu',
          industry: '奶茶',
          grade: 'V2',
          entityName: '一只酸奶牛',
          entityAdress: '重庆市南岸区万达广场',
          contacts: '程旭',
          phone: '18883630318'
        }
      ],
      yueNum: 0,
      Size: 10, // 一页多少条
      Current: 1, // 页码
      total: 0, // 总数
      sizeL: 10, // 一页多少条
      currentL: 1, // 页码
      totalL: 0, // 总数
      time: null,
      type: null,
      loading: false, // loading加载
      GsData: null,
      GsCont: null,
      storeIdGs: ''
    }
  },
  mounted() {
    this.getlist()
    this.getTradeList()
  },
  methods: {
    makeSurGs() {
      const _this = this
      _this.loading = true
      addOrUpdatePublicInfo({
        content: _this.GsCont,
        id: _this.GsData ? _this.GsData.id : '',
        isShow: 1,
        storeId: _this.storeIdGs
      }).then(res => {
        if (res.status) {
          _this.GsCont = null
          _this.dialogVisible_Gs = false
          setTimeout(() => {
            _this.loading = false
          }, 300)
        }
      })
    },
    goGg(row) {
      const _this = this
      _this.loading = true
      _this.storeIdGs = row.id
      _this.dialogVisible_Gs = true
      _this.GsCont = null
      getStorePublicInfo({
        storeId: row.id
      }).then(res => {
        if (res.status) {
          _this.GsData = res.data
          if (res.data) {
            _this.GsCont = res.data.content
          }

          setTimeout(() => {
            _this.loading = false
          }, 300)
        }
      })
    },
    geteditS(data) {
      this.GsCont = data
    },
    downLoad(scodeUrl) {
      var a = document.createElement('a')
      a.download = '店铺小程序码'
      // 设置图片地址
      a.href = scodeUrl
      a.click()
    },
    goSCode(row) {
      this.dialogVisible_SCode = true
      this.generateStoreCode(row.id)
    },
    /*
    *功能描述：删除分类
    *开发人员：LRS
    */
    remove(e) {
      var data = {
        chartId: e.id,
        storeId: this.putStoreId
      }
      this.$confirm('此操作将删除该轮播, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delStoreChart(data).then(res => {
          if (res.status) {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.getHasLbList(this.putStoreId)
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    relaTion(row) {
      const arr = []
      arr.push(row.id)
      setStoreChart({
        chartIds: arr,
        storeId: this.putStoreId

      }).then(res => {
        if (res.status) {
          this.$message({ message: '操作成功', type: 'success' })
          this.getNoLbList(this.putStoreId)
        }
      })
    },

    goNoLunbo(row) {
      this.dialogVisible_nolb = true
      this.putStoreId = row.id
      this.getNoLbList(row.id)
    },
    /*
    *功能描述：获取为关联的轮播图列表
    *开发人员：CX
    */
    getNoLbList(id) {
      const _this = this
      _this.loading = true
      selectNoChartByStoreId({
        current: _this.currentL,
        size: _this.sizeL,
        storeId: id,
        imgName: ''
      }).then(res => {
        if (res.status) {
          _this.tableNoData = res.data.records
          _this.totalL = res.data.total
          setTimeout(() => {
            _this.loading = false
          }, 300)
        }
      })
    },
    goHasLunbo(row) {
      this.dialogVisible_lb = true
      this.putStoreId = row.id
      this.getHasLbList(row.id)
    },
    // 店铺二维吗
    generateStoreCode(id) {
      const _this = this
      _this.loading = true
      generateStoreCode({
        storeId: id
      }).then(res => {
        if (res.status) {
          _this.scodeUrl = res.data
          setTimeout(() => {
            _this.loading = false
          }, 300)
        }
      })
    },
    /*
    *功能描述：获取列表
    *开发人员：CX
    */
    getHasLbList(id) {
      const _this = this
      _this.loading = true
      getStoreChart({
        storeId: id
      }).then(res => {
        if (res.status) {
          _this.tableData = res.data
          setTimeout(() => {
            _this.loading = false
          }, 300)
        }
      })
    },
    arrp(arr) {
    // 编辑原数组格式
      if (arr[0].value) {
        arr = arr.map((item) => {
          item = item.value
          return item
        })
      }
      if (arr.length === 1) {
        // 最终合并成一个
        return arr[0]
      } else {	// 有两个子数组就合并
        const arrySon = []
        // 将组合放到新数组中
        arr[0].forEach((_, index) => {
          arr[1].forEach((_, index1) => {
            arrySon.push([].concat(arr[0][index], arr[1][index1]))
          })
        })
        // 新数组并入原数组,去除合并的前两个数组
        arr[0] = arrySon
        arr.splice(1, 1)
        // 递归
        return this.arrp(arr)
      }
    },
    removeZX(row) {
      const that = this
      this.$confirm('此操作将操作渠道商的登陆权限, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        disableStoreOne({
          storeId: row.id,
          status: row.status === 'USE' ? 1 : 0

        }).then(res => {
          if (res.status) {
            that.$message({ message: '操作成功', type: 'success' })
            that.getlist()
          }
        })
      })
    },
    async addUser(formName) {
      const _this = this
      await _this.$refs[formName].validate((valid) => {
        if (valid) {
          if (!this.yhData.id) {
            // this.yhData.password = ttyMD5(this.yhData.password)
            const _param = {
              userName: this.yhData.account,
              mobile: this.yhData.phone,
              password: this.yhData.password,
              rate: this.yhData.fee,
              storeAddress: this.yhData.entityAdress,
              menuLevel: this.yhData.menuLevel,
              storeLevel: this.yhData.grade,
              storeName: this.yhData.name,
              storeRealName: this.yhData.entityName,
              tradeTypeId: this.yhData.industry,
              customerName: this.yhData.contacts
            }
            addStore(_param).then(res => {
              if (res.status) {
                _this.$message({ message: '操作成功', type: 'success' })
                _this.dialogVisible_yh = false
                setTimeout(() => {
                  _this.getlist()
                }, 500)
              }
            })
          } else {
            const _param2 = {
              storeId: this.yhData.id,
              userName: this.yhData.account,
              mobile: this.yhData.phone,
              // password: this.yhData.password,
              rate: this.yhData.fee,
              storeAddress: this.yhData.entityAdress,
              menuLevel: this.yhData.menuLevel,
              storeLevel: this.yhData.grade,
              storeName: this.yhData.name,
              storeRealName: this.yhData.entityName,
              tradeTypeId: this.yhData.industry,
              customerName: this.yhData.contacts
            }
            updateStoreOne(_param2).then(res => {
              if (res.status) {
                _this.$message({ message: '操作成功', type: 'success' })
                _this.dialogVisible_yh = false
                setTimeout(() => {
                  _this.getlist()
                }, 500)
              }
            })
          }
        }
      })
    },
    goEdit(row) {
      // this.getTradeList()
      getStoreOne({
        storeId: row.id
      }).then(res => {
        if (res.status) {
          this.dialogVisible_yh = true
          console.log(res.data.store)
          console.log('-----------')
          this.yhData = {
            id: row.id,
            account: res.data.store.userName,
            phone: res.data.store.mobile,
            // password: res.data.user.password,
            fee: res.data.store.rate,
            entityAdress: res.data.store.storeAddress,
            menuLevel: `${res.data.switch.menuLevel}`,
            grade: res.data.store.storeLevel,
            name: res.data.store.storeName,
            entityName: res.data.store.storeRealName,
            industry: `${res.data.store.tradeTypeId}`,
            contacts: res.data.store.customerName
          }
        }
      })

      // this.yhData = {
      //   id: row.id,
      //   roleId: row.roleId,
      //   username: row.username
      // }
    },
    addZx() {
      this.dialogVisible_yh = true
      this.yhData = {
        name: '', // 渠道商名称
        account: '', // 账号
        industry: '', // 行业
        grade: '', // 等级
        menuLevel: '', // 菜单等级
        entityName: '', // 实体店名字
        entityAdress: '', // 实体店地址
        contacts: '', // 联系人
        phone: '', // 联系电话
        fee: '', // 手续费率
        password: '' // 登陆密码
      }
      // this.getTradeList()
    },
    goDetail(e, v) {
      this.$router.push({ path: '/detial', query: { companyStatus: e, customerId: v }})
    },
    async getTradeList() {
      await getTradeList().then(res => {
        if (res.status) {
          this.options = res.data
          console.log(this.options)
        }
      })
    },
    getlist() {
      const _this = this
      _this.loading = true
      var data = {

        // userName: _this.userName,
        current: _this.Current,
        size: _this.Size,
        mobile: _this.query.mobile, // 手机号
        storeName: _this.query.storeName, // 渠道商名称
        storeRealName: _this.query.storeRealName, // 店铺名称(真实的)
        userName: _this.query.userName, // 联系人
        tradeTypeId: _this.query.tradeTypeId// 行业类别

      }
      selectStoreList(data).then(res => {
        console.log(res)
        if (res.status) {
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
.SCodeIM{
  width: 200px;
  height: 200px;
  overflow: hidden;
}
.SCodeIM img{
  width: 100%;
  height: 100%;
}
.useSign{

  padding: 5px 8px;
  background-color:#00c48f !important;
 color:#fff ;
 border-radius: 4px;
}
.noUseSign{
   padding: 5px 8px;
  background-color:rgb(167, 167, 167);
 color:#fff ;
 border-radius: 4px;
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
