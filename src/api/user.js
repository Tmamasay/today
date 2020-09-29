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
