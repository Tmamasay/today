<template>
  <div class="hw_admin_box shaowAll">
    <div class="toolS">
      <p class="Ptitle">基本信息 <span class="ptFS">请您遵守国家相关规定，切勿上传低俗色情、暴力恐怖、谣言诈骗、侵权盗版等相关内容</span></p>
    </div>
    <div class="baseSt">
      <el-form ref="addZxData" label-position="left" label-width="80px" :model="addZxData" :rules="rulesZx">
        <el-form-item label="缩略图：" prop="noticeImg">
          <div>
            <el-upload
              list-type="picture-card"
              action
              :file-list="fileList"
              :show-file-list="true"
              :http-request="uploadFile"
              :limit="1"
              :on-change="handlePreview"
              :on-success="handleSuccess"
            >
              <i class="el-icon-plus" />
              <div slot="tip" class="el-upload__tip">
                提示：支持格式JPG，JPEG,PNG,PDF
              </div>
            </el-upload>
          </div>
        </el-form-item>
        <el-form-item label="商品名" prop="remark">
          <el-input v-model="addZxData.remark" placeholder="请输入摘要" />
        </el-form-item>
        <el-form-item label="所属分类" prop="remark">
          <el-select v-model="addZxData.remark" placeholder="请选择" style="width:90%">
            <el-option label="超市" value="1" />
            <el-option label="奶茶" value="2" />
            <el-option label="母婴" value="3" />
          </el-select>
        </el-form-item>
        <el-form-item label="标签" prop="title">
          <el-tag
            v-for="tag in dynamicTags"
            :key="tag"
            closable
            :disable-transitions="false"
            type="info"
            @close="handleClose(tag)"
          >
            {{ tag }}
          </el-tag>
          <el-input
            v-if="inputVisible"
            ref="saveTagInput"
            v-model="inputValue"
            class="input-new-tag"
            size="small"
            @keyup.enter.native="handleInputConfirm"
            @blur="handleInputConfirm"
          />
          <el-button v-else class="button-new-tag" size="small" @click="showInput">+ 添加标签</el-button>
        </el-form-item>
        <el-form-item label="商品规格" prop="remark">
          <div class="guiGe">
            <div class="guiOne">
              <span>规格组：</span>
              <el-tag
                v-for="tag in GuienamicTags"
                :key="tag"
                closable
                :disable-transitions="false"
                type="success"
                @close="handleGuieClose(tag)"
              >
                {{ tag }}
              </el-tag>
              <el-input
                v-if="GuieinputVisible"
                ref="saveGuieTagInput"
                v-model="GuieinputValue"
                class="input-new-tag"
                size="small"
                @keyup.enter.native="handleGuieInputConfirm"
                @blur="handleGuieInputConfirm"
              />
              <el-button v-else class="button-new-tag" size="small" @click="showGuieInput">+ 添加规格名</el-button>
            </div>
            <div v-for="(item,index) in GuienamicTags" :key="item" class="guiValue">
              <p>规格名：<span class="guGe">{{ item }}</span></p>

              <span v-if="SpecnamicTags.length&&SpecnamicTags[index]">
                <span>规格值：</span>
                <el-tag
                  v-for="tag in SpecnamicTags[index].value"
                  :key="tag"
                  closable
                  :disable-transitions="false"
                  type="warning"
                  @close="handleSpecClose(tag)"
                >
                  {{ tag }}
                </el-tag>
              </span>
              <el-input
                v-if="SpecinputVisible&&SpecinputIndex===index"
                ref="saveSpecInput"
                v-model="SpecinputValue"
                class="input-new-tag"
                size="small"
                @keyup.enter.native="handleSpecInputConfirm(item,index)"
                @blur="handleSpecInputConfirm(item,index)"
              />
              <el-button v-else class="button-new-tag" size="small" @click="showSpecInput(index)">+ 添加规格值</el-button>
            </div>
          </div>
        </el-form-item>
        <el-form-item label="正文：" prop="textBody">
          <EditorImage v-if="dialogVisible" :value="addZxData.textBody" @editlisten="geteditS" />
        </el-form-item>
        <el-form-item label="规格明细">
          <div>
            <div className="table-content">
              <table className="spec-table" border="1">
                <thead>
                  <tr>
                    <th v-for="item in GuienamicTags" :key="item">{{ item }}</th>
                    <th>SKU编码</th>
                    <th>单买价格</th>
                    <th>拼团价格</th>
                    <!-- <th>服务佣金</th> -->
                    <th>可售库存</th>
                  </tr>
                  <tr v-for="item1 in tableData" :key="item1">
                    <td v-for="item2 in item1" :key="item2">{{ item2 }}</td>
                    <td><el-input placeholder="请输入内容" size="small" /></td>
                    <td><el-input placeholder="请输入内容" size="small" /></td>
                    <td><el-input placeholder="请输入内容" size="small" /></td>
                    <!-- <td><el-input placeholder="请输入内容" size="small" /></td> -->
                    <td><el-input placeholder="请输入内容" size="small" /></td>
                  </tr>

                </thead>
              </table>
            <!-- <el-table
              :data="tableData"
              :span-method="objectSpanMethod"
              border
              style="width: 100%; margin-top: 20px"
            >
              <el-table-column
                prop="name"
                label="规格名"
              />

              <el-table-column
                prop="value"
                label="规格值"
              />
              <el-table-column
                prop="amount2"
                label="数值 2（元）"
              />
              <el-table-column
                prop="amount3"
                label="数值 3（元）"
              />
            </el-table> -->
            </div>
          </div></el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="zx_submit('addZxData')">确 定</el-button>
      </div>
    </div>
    <el-dialog
      title="资讯操作"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      width="50%"
    >
      <!-- <EditorImage v-if="dialogVisible" :value="content" @editlisten="geteditS" /> -->
      <el-form v-if="dialogVisible" ref="addZxData" :label-position="labelPosition" label-width="140px" :model="addZxData" :rules="rulesZx">

        <el-form-item label="上传缩略图：" prop="noticeImg">
          <div>
            <el-upload
              list-type="picture-card"
              action
              :file-list="fileList"
              :show-file-list="true"
              :http-request="uploadFile"
              :limit="1"
              :on-change="handlePreview"
              :on-success="handleSuccess"
            >
              <i class="el-icon-plus" />
              <div slot="tip" class="el-upload__tip">
                提示：支持格式JPG，JPEG,PNG,PDF
              </div>
            </el-upload>
          </div>
        </el-form-item>
        <el-form-item label="摘要" prop="remark">
          <el-input v-model="addZxData.remark" placeholder="请输入摘要" />
        </el-form-item>
        <el-form-item label="来源" prop="source">
          <el-input v-model="addZxData.source" placeholder="请输入来源" />
        </el-form-item>
        <el-form-item label="标题" prop="title">
          <el-input v-model="addZxData.title" placeholder="请输入标题" />
        </el-form-item>
        <el-form-item label="发布时间" prop="releaseTime">
          <el-date-picker
            v-model="addZxData.releaseTime"
            type="datetime"
            placeholder="选择日期时间"
            align="right"
          />

        </el-form-item>
        <el-form-item label="正文：" prop="textBody">
          <EditorImage v-if="dialogVisible" :value="addZxData.textBody" @editlisten="geteditS" />
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="zx_submit('addZxData')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { selectPageNotice, delNotice, fileUpload } from '@/api/chengxu'
import EditorImage from '@/components/Tinymce/index' // 富文本编辑
export default {
  components: { EditorImage },
  data() {
    return {
      tableData: [],

      // 标签
      dynamicTags: [],
      inputVisible: false,
      inputValue: '',
      // 规格
      GuienamicTags: [],
      GuieinputVisible: false,
      GuieinputValue: '',
      // 规格值
      SpecnamicTags: [],
      SpecinputVisible: false,
      SpecinputIndex: 0,
      SpecinputValue: '',

      fileList: [],
      uploadData: null,
      dialogVisible: false,
      time: null,
      loading: false, // loading加载
      dataList: [], // 数据列表
      hwSize: 10, // 一页多少条
      hwCurrent: 1, // 页码
      total: 0, // 总数
      title: '', // 新增修改名称
      labelPosition: 'center', // 对齐方式
      addZxData: {
        noticeImg: '',
        releaseTime: '',
        remark: '',
        source: '',
        textBody: '',
        title: ''
      },
      rulesZx: {
        noticeImg: [
          { required: true, message: '请上传缩略图', trigger: 'blur' }
        ],
        remark: [
          { required: true, message: '请输入摘要', trigger: 'blur' }
        ],
        source: [
          { required: true, message: '请输入来源', trigger: 'blur' }
        ],
        title: [
          { required: true, message: '请输入标题', trigger: 'blur' }
        ],
        releaseTime: [
          { required: true, message: '请选择发布时间', trigger: 'change' }
        ],
        textBody: [
          { required: true, message: '请输入正文', trigger: 'blur' }
        ]
      }

    }
  },
  created() {

    // this.choiceBm()
  },
  mounted() {
    this.getlist()
  },
  methods: {
    tdRow(i) {
      // const arr = this.tableData
      // arr.map((_, j) => {
      //   let td
      //   if (i % row[j] === 0 && row[j] > 1) {
      //     td = <td rowSpan={row[j]} key={j}>{res[i][j].name}</td>
      //   } else if (row[j] === 1) {
      //     res[i] instanceof Array ? td = <td key={j}>{res[i][j].name}</td> : td = <td key={j}>{res[i].name}</td>
      //   }
      //   return td
      // })
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

    formatDAta(data) {
      const ObjData = []
      data.forEach(el => {
        if (el.value.length) {
          el.value.forEach(ment => {
            ObjData.push({
              name: el.name,
              value: ment
            })
          })
        }
      })
      console.log(ObjData)
      console.log('--------------')
      return ObjData
    },
    // 里面包含当前行row、当前列column、当前行号rowIndex、当前列号columnIndex四个属性
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      // console.log(row, column, rowIndex, columnIndex)
      // if (columnIndex === 0) {
      //   if (rowIndex % 2 === 0) {
      //     return {
      //       rowspan: 2,
      //       colspan: 1
      //     }
      //   } else {
      //     return {
      //       rowspan: 0,
      //       colspan: 0
      //     }
      //   }
      // }
    },
    // 标签-----------》
    handleClose(tag) {
      this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1)
    },

    showInput() {
      this.inputVisible = true
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },

    handleInputConfirm() {
      const inputValue = this.inputValue
      if (inputValue) {
        this.dynamicTags.push(inputValue)
      }
      this.inputVisible = false
      this.inputValue = ''
    },
    // END----------->
    // 规格名列表
    handleGuieClose(tag) {
      this.GuienamicTags.splice(this.GuienamicTags.indexOf(tag), 1)
    },

    showGuieInput() {
      this.GuieinputVisible = true
      this.$nextTick(_ => {
        this.$refs.saveGuieTagInput.$refs.input.focus()
      })
    },

    handleGuieInputConfirm() {
      const inputValue = this.GuieinputValue
      if (inputValue) {
        this.GuienamicTags.push(inputValue)
      }
      this.GuieinputVisible = false
      this.GuieinputValue = ''
    },
    // end===========
    // 规格值列表
    handleSpecClose(tag) {
      this.SpecnamicTags.splice(this.SpecnamicTags.indexOf(tag), 1)
    },

    showSpecInput(index) {
      this.SpecinputVisible = true
      this.SpecinputIndex = index
      this.$nextTick(_ => {
        // console.log(this.$refs.saveSpecInput)
        // console.log(this.$refs.saveSpecInput[index])
        // console.log('[[[======')
        // console.log(index)
        this.$refs.saveSpecInput[index].$refs.input.focus()
      })
    },

    handleSpecInputConfirm(key, index) {
      // alert(key)
      const inputValue = this.SpecinputValue
      if (inputValue) {
        const foundIndex = this.SpecnamicTags.findIndex(el => el.name === key)
        if (foundIndex !== -1) {
          // alert(2)
          this.SpecnamicTags[foundIndex].value.push(inputValue)
        } else {
          // alert(1)
          this.SpecnamicTags.push({
            name: '',
            value: []
          })
          this.SpecnamicTags[index].name = key
          this.SpecnamicTags[index].value.push(inputValue)
          console.log(this.SpecnamicTags)
        }
        this.tableData = this.arrp(this.SpecnamicTags)
        console.log(this.arrp(this.SpecnamicTags))
        console.log('-0-----------')
      }

      this.SpecinputVisible = false
      this.SpecinputValue = ''
    },
    // end=------------>

    goPre(row) {
      // this.$router.push({ path: '/preDetaill', query: { newsId: row.id }})
      this.$router.push({ path: '/Platform', query: { newsId: row.id }})
    },
    goEdit(row) {
      this.dialogVisible = true
      this.addZxData = {
        id: row.id,
        noticeImg: row.noticeImg,
        releaseTime: row.releaseTime,
        remark: row.remark,
        source: row.source,
        textBody: row.textBody,
        title: row.title
      }
      this.fileList.push({
        url: row.noticeImg
      })
    },
    // 时间戳转换
    formatDate(row) {
      const date = new Date(row.releaseTime)
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
    // 时间戳转换
    formatDate2(value) {
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
    addZx() {
      this.fileList = []
      this.dialogVisible = true
      this.addZxData = {
        noticeImg: '',
        releaseTime: '',
        remark: '',
        source: '',
        textBody: '',
        title: ''
      }
    },
    handleSuccess(response) {
      console.log(response)
      console.log('888888888888')
    },
    uploadFile(e) {
      fileUpload(this.uploadData).then(res => {
        if (res) {
          console.log(res)
          this.addZxData.noticeImg = res.data
          this.$message({
            message: '上传成功',
            type: 'success'
          })
        } else {
          this.$message.error(res.status)
        }
      })
    },
    // 获取上传文件信息
    handlePreview(file) {
      const _this = this
      var formData = new FormData()
      formData.append('file', file.raw)
      _this.uploadData = formData
    },
    geteditS(data) {
      this.addZxData.textBody = data
    },

    // 列表
    async getlist() {
      const _this = this
      _this.loading = true
      var data = {
        param: {
          startTime: _this.time ? new Date(_this.time[0]).getTime() : '',
          endTime: _this.time ? new Date(_this.time[1]).getTime() + 86399999 : '',
          pageNum: _this.hwCurrent,
          pageSize: _this.hwSize
        }
      }
      await selectPageNotice(data).then(res => {
        console.log(res)
        if (res.statusCode === '00000') {
          setTimeout(res => {
            _this.loading = false
          }, 300)
          _this.dataList = res.data.records
          _this.total = +res.data.total
        }
      })
    },
    // 新增
    async zx_submit(formName) {
      console.log(this.SpecnamicTags)
      // const _this = this
      // await _this.$refs[formName].validate((valid) => {
      //   if (valid) {
      //     this.addZxData.releaseTime = this.formatDate2(new Date(this.addZxData.releaseTime).getTime())
      //     const data = {
      //       param: this.addZxData
      //     }
      //     if (this.addZxData.id) {
      //       updateNotice(data).then(res => {
      //         console.log(res)
      //         if (res.statusCode === '00000') {
      //           this.dialogVisible = false
      //           setTimeout(() => {
      //             this.getlist()
      //           }, 1500)
      //         }
      //       })
      //     } else {
      //       addNotice(data).then(res => {
      //         console.log(res)
      //         if (res.statusCode === '00000') {
      //           this.dialogVisible = false
      //           setTimeout(() => {
      //             this.getlist()
      //           }, 1500)
      //         }
      //       })
      //     }
      //   }
      // })
    },

    // 删除坐席
    async removeZX(e) {
      const data = {
        data: {
          id: e.id
        }

      }
      delNotice(data).then(res => {
        console.log(res)
        if (res.statusCode === '00000') {
          this.$message({ message: '删除成功', type: 'success' })
          this.getlist()
        }
      })
    },
    // 搜索
    search() {
      this.hwCurrent = 1
      this.getlist()
    },
    // 修改表格头部颜色
    tableHeaderColor({ row, column, rowIndex, columnIndex }) {
      if (rowIndex === 0) {
        return 'background:rgba(232,243,253,1);color:rgba(54,52,69,1);border-right:1px solid #fff'
      }
    },
    // 分页
    handleSizeChange(val) {
      this.hwSize = val
      this.getlist()
    },
    handleCurrentChange(val) {
      this.hwCurrent = val
      this.getlist()
    }
  }
}
</script>
<style  scoped>
.el-tag + .el-tag {
    margin-left: 10px;
    /* color:#00c48f */
  }
  .button-new-tag {
    margin-left: 10px;
    height: 32px;
    /* line-height: 30px;
    padding-top: 0;
    padding-bottom: 0; */
  }
  .input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
  }
   table
        {
          width: 100%;
            border-collapse: collapse;
            margin: 0 auto;
            text-align: center;
        }
        table td, table th
        {
            border: 1px solid #ebebeb;
            color: #666;
            width: 60px !important;
            height: 30px !important;
        }

</style>

<style scoped>
.toolS{
  display: flex;
  justify-content: space-between;
   /* padding-bottom: 10px; */
    align-items:center;
    margin-bottom: 14px;
    /* padding: 15px 0; */
    font-size: 0;
    border-bottom: 1px solid #f5f5f5;
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
.ptFS{
  display: inline-block;
    font-size: 12px;
    color: #999;
    font-weight: 400;

    margin-left: 16px;
}
.baseSt{
  width: 50%;
}
.guiGe{
  border: 1px dashed #d1d1d1;
  /* height: 400px; */
  padding: 5px 10px;
}
.guiOne{
  color: #606266;
  /* background-color: #f5f5f5; */
}
.guGe{

  font-weight: 600;
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
