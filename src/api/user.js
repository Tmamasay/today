import request from '@/utils/request'

// 用户登录
export function userLogin(data) {
  return request({
    url: '/tpp-admin/admin/login',
    method: 'post',
    data
  })
}
// 查询当前登录用户的菜单
export function getMyMenus(data) {
  return request({
    url: '/tpp-admin/admin/menu/tree',
    method: 'post',
    data
  })
}
// 新增渠道商
export function addStore(data) {
  return request({
    url: '/tpp-admin/storeManager/addStore',
    method: 'post',
    data
  })
}
// 获取行业类别下拉
export function getTradeList(data) {
  return request({
    url: '/tpp-admin/tradeManager/getTradeList',
    method: 'post',
    data
  })
}
// 新增渠道商判断某些信息是否重复
export function checkAddStore(data) {
  return request({
    url: '/tpp-admin/storeManager/checkAddStore',
    method: 'post',
    data
  })
}
// 渠道商列表
export function selectStoreList(data) {
  return request({
    url: '/tpp-admin/storeManager/selectStore',
    method: 'post',
    data
  })
}
// 禁用或解禁渠道商
export function disableStoreOne(data) {
  return request({
    url: '/tpp-admin/storeManager/disableStoreOne',
    method: 'post',
    data
  })
}
// 单查渠道商
export function getStoreOne(data) {
  return request({
    url: '/tpp-admin/storeManager/getStoreOne',
    method: 'post',
    data
  })
}
// 修改渠道商
export function updateStoreOne(data) {
  return request({
    url: '/tpp-admin/storeManager/updateStoreOne',
    method: 'post',
    data
  })
}

// 管理端查询指定行业商品分类
export function getGoodsTypeByAdmin(data) {
  return request({
    url: '/tpp-admin/goodsTypeManager/getGoodsTypeByAdmin',
    method: 'post',
    data
  })
}
// 新增管理端指定行业商品分类
export function addGoodsTypeByAdmin(data) {
  return request({
    url: '/tpp-admin/goodsTypeManager/addGoodsTypeByAdmin',
    method: 'post',
    data
  })
}
// 修改管理端指定行业商品分类
export function updateGoodsTypeByAdmin(data) {
  return request({
    url: '/tpp-admin/goodsTypeManager/updateGoodsTypeByAdmin',
    method: 'post',
    data
  })
}
// 新增行业类别
export function addTrade(data) {
  return request({
    url: '/tpp-admin/tradeManager/addTrade',
    method: 'post',
    data
  })
}
// 修改行业类别
export function updateTrade(data) {
  return request({
    url: '/tpp-admin/tradeManager/updateTrade',
    method: 'post',
    data
  })
}
// 验证行业类别同名(true:可用,false:不可用)
export function checkTrade(data) {
  return request({
    url: '/tpp-admin/tradeManager/checkTrade',
    method: 'post',
    data
  })
}
// 删除行业类别
export function delTrade(data) {
  return request({
    url: '/tpp-admin/tradeManager/delTrade',
    method: 'post',
    data
  })
}
