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
