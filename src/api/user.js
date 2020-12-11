import request from '@/utils/request'

// 用户登录
export function userLogin(data) {
  return request({
    url: '/admin/login',
    method: 'post',
    data
  })
}
// 查询当前登录用户的菜单
export function getMyMenus(data) {
  return request({
    url: '/admin/menu/tree',
    method: 'post',
    data
  })
}
// 新增渠道商
export function addStore(data) {
  return request({
    url: '/admin/storeManager/addStore',
    method: 'post',
    data
  })
}
// 获取行业类别下拉
export function getTradeList(data) {
  return request({
    url: '/admin/tradeManager/getTradeList',
    method: 'post',
    data
  })
}
// 新增渠道商判断某些信息是否重复
export function checkAddStore(data) {
  return request({
    url: '/admin/storeManager/checkAddStore',
    method: 'post',
    data
  })
}
// 渠道商列表
export function selectStoreList(data) {
  return request({
    url: '/admin/storeManager/selectStore',
    method: 'post',
    data
  })
}
// 禁用或解禁渠道商
export function disableStoreOne(data) {
  return request({
    url: '/admin/storeManager/disableStoreOne',
    method: 'post',
    data
  })
}
// 单查渠道商
export function getStoreOne(data) {
  return request({
    url: '/admin/storeManager/getStoreOne',
    method: 'post',
    data
  })
}
// 修改渠道商
export function updateStoreOne(data) {
  return request({
    url: '/admin/storeManager/updateStoreOne',
    method: 'post',
    data
  })
}

// 管理端查询指定行业商品分类
export function getGoodsTypeByAdmin(data) {
  return request({
    url: '/admin/goodsTypeManager/getGoodsTypeByAdmin',
    method: 'post',
    data
  })
}
// 新增管理端指定行业商品分类
export function addGoodsTypeByAdmin(data) {
  return request({
    url: '/admin/goodsTypeManager/addGoodsTypeByAdmin',
    method: 'post',
    data
  })
}
// 修改管理端指定行业商品分类
export function updateGoodsTypeByAdmin(data) {
  return request({
    url: '/admin/goodsTypeManager/updateGoodsTypeByAdmin',
    method: 'post',
    data
  })
}
// 新增行业类别
export function addTrade(data) {
  return request({
    url: '/admin/tradeManager/addTrade',
    method: 'post',
    data
  })
}
// 修改行业类别
export function updateTrade(data) {
  return request({
    url: '/admin/tradeManager/updateTrade',
    method: 'post',
    data
  })
}
// 验证行业类别同名(true:可用,false:不可用)
export function checkTrade(data) {
  return request({
    url: '/admin/tradeManager/checkTrade',
    method: 'post',
    data
  })
}
// 删除行业类别
export function delTrade(data) {
  return request({
    url: '/admin/tradeManager/delTrade',
    method: 'post',
    data
  })
}
// ======商品板块========
// 删除行业类别
export function addGoodsByAdmin(data) {
  return request({
    url: '/admin/goodsManager/addGoodsByAdmin',
    method: 'post',
    data
  })
}
// 分页管理端商品
export function selectGoodsByAdmin(data) {
  return request({
    url: '/admin/goodsManager/selectGoodsByAdmin',
    method: 'post',
    data
  })
}
// 分页管理端商品SKU
export function selectSKUAdmin(data) {
  return request({
    url: '/admin/goodsManager/selectSKUAdmin',
    method: 'post',
    data
  })
}

// 修改管理端商品
export function updateGoodsByAdmin(data) {
  return request({
    url: '/admin/goodsManager/updateGoodsByAdmin',
    method: 'post',
    data
  })
}

// 上架管理端商品SKU
export function upGoodsSKUAdmin(data) {
  return request({
    url: '/admin/goodsManager/upGoodsSKUAdmin',
    method: 'post',
    data
  })
}
// 下架管理端商品SKU
export function downGoodsSKUAdmin(data) {
  return request({
    url: '/admin/goodsManager/downGoodsSKUAdmin',
    method: 'post',
    data
  })
}
// 下架管理端商品
export function disableGoodsAdmin(data) {
  return request({
    url: '/admin/goodsManager/disableGoodsAdmin',
    method: 'post',
    data
  })
}

// (修改前)单查管理端商品
export function getGoodsOneByAdmin(data) {
  return request({
    url: '/admin/goodsManager/getGoodsOneByAdmin',
    method: 'post',
    data
  })
}

// 将商品导入渠道商商品库
export function issueGoodsToStore(data) {
  return request({
    url: '/admin/goodsManager/issueGoodsToStore',
    method: 'post',
    data
  })
}
// 系统轮播图分页
export function selectChartPage(data) {
  return request({
    url: '/admin/chartManager/selectChartPage',
    method: 'post',
    data
  })
}

// 新增系统轮播图
export function addChart(data) {
  return request({
    url: '/admin/chartManager/addChart',
    method: 'post',
    data
  })
}

// 修改系统轮播图
export function updateChart(data) {
  return request({
    url: '/admin/chartManager/updateChart',
    method: 'post',
    data
  })
}

// 删除系统轮播图
export function delChart(data) {
  return request({
    url: '/admin/chartManager/delChart',
    method: 'post',
    data
  })
}

// 查询渠道商的轮播图
export function getStoreChart(data) {
  return request({
    url: '/admin/storeManager/getStoreChart',
    method: 'post',
    data
  })
}
// 查询渠道商没有设置的轮播图
export function selectNoChartByStoreId(data) {
  return request({
    url: '/admin/storeManager/selectNoChartByStoreId',
    method: 'post',
    data
  })
}
// 删除渠道商的轮播图
export function delStoreChart(data) {
  return request({
    url: '/admin/storeManager/delStoreChart',
    method: 'post',
    data
  })
}
// 设置渠道商的轮播图
export function setStoreChart(data) {
  return request({
    url: '/admin/storeManager/setStoreChart',
    method: 'post',
    data
  })
}
// 新增设备
export function addPrintDevice(data) {
  return request({
    url: '/admin/printDeviceManager/addPrintDevice',
    method: 'post',
    data
  })
}
// 删除设备
export function delPrintDevice(data) {
  return request({
    url: '/admin/printDeviceManager/delPrintDevice',
    method: 'post',
    data
  })
}
// 设备分页
export function pagePrintDevice(data) {
  return request({
    url: '/admin/printDeviceManager/pagePrintDevice',
    method: 'post',
    data
  })
}
// 将设备分配到渠道商
export function setPrintStore(data) {
  return request({
    url: '/admin/printDeviceManager/setPrintStore',
    method: 'post',
    data
  })
}
// 生成二维码
export function generateStoreCode(data) {
  return request({
    url: '/admin/storeManager/generateStoreCode',
    method: 'post',
    data
  })
}
