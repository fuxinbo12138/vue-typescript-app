/**
 * 课程课时相关请求模块
 */

import request from "@/utils/request";

// 广告位查询
export const getList = () => {
  return request({
    method: "GET",
    url: "front/ad/getAdList"
  });
};

// 广告为新增
export const saveOrUpdate = (data: any) => {
  return request({
    method: "POST",
    url: "/front/ad/saveOrUpdate",
    data
  });
};

// 广告上下线
export const updateStatus = (params: any) => {
  return request({
    method: "GET",
    url: "/front/ad/updateStatus",
    params
  });
};
