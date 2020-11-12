import request from "@/utils/request";
// import qs from "qs";

interface SaveOrUpdateInfo {
  name: string;
  url: string;
  categoryId: number;
  description: string;
}

interface SaveOrUpdateCategoryInfo {
  name: string;
}

interface PageInfo {
  current: number;
  size: number;
}

// 分页查询资源
export const getList = (data: PageInfo) => {
  return request({
    method: "POST",
    url: "/boss/resource/getResourcePages",
    data
  });
};
// 查询所有资源
export const getAllResources = () => {
  return request({
    method: "GET",
    url: "/boss/resource/getAll"
  });
};

// 查询所有资源分类
export const categoryAll = () => {
  return request({
    method: "GET",
    url: "/boss/resource/category/getAll"
  });
};

// 保存或新增资源
export const saveOrUpdate = (data: SaveOrUpdateInfo) => {
  return request({
    method: "POST",
    url: "/boss/resource/saveOrUpdate",
    data
  });
};

// 删除菜单
export const del = (id: number) => {
  return request({
    method: "DELETE",
    url: `/boss/resource/${id}`
  });
};

// 保存或新增资源分类
export const saveOrUpdateCategory = (data: SaveOrUpdateCategoryInfo) => {
  return request({
    method: "POST",
    url: "/boss/resource/category/saveOrderUpdate",
    data
  });
};

// 删除资源分类
export const delCategory = (id: number) => {
  return request({
    method: "DELETE",
    url: `/boss/resource/category/${id}`
  });
};

export const allocateRoleResources = (data: any) => {
  return request({
    method: "POST",
    url: "/boss/resource/allocateRoleResources",
    data
  });
};

export const getRoleResources = (roleId: string | number) => {
  return request({
    method: "GET",
    url: "/boss/resource/getRoleResources",
    params: {
      roleId
    }
  });
};
