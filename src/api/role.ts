import request from "@/utils/request";
// import qs from "qs";

interface SaveOrUpdateInfo {
  name: string;
  code: string;
  description: string;
}

interface PageInfo {
  current: number;
  size: number;
}

// 角色分页查询
export const getList = (data: PageInfo) => {
  return request({
    method: "POST",
    url: "/boss/role/getRolePages",
    data
  });
};

// 保存角色
export const saveOrUpdate = (data: SaveOrUpdateInfo) => {
  return request({
    method: "POST",
    url: "/boss/role/saveOrUpdate",
    data
  });
};

// 删除角色
export const del = (id: number) => {
  return request({
    method: "DELETE",
    url: `/boss/role/${id}`
  });
};

export const getRoleById = (id: string | number) => {
  return request({
    method: "GET",
    url: `/boss/role/${id}`
  });
};

export const getAllRoles = () => {
  return request({
    method: "GET",
    url: "/boss/role/all"
  });
};

export const allocateUserRoles = (data: any) => {
  return request({
    method: "POST",
    url: "/boss/role/allocateUserRoles",
    data
  });
};

export const getRolesWithUserPermission = (userId: string | number) => {
  return request({
    method: "GET",
    url: `/boss/role/getRolesWithUserPermission`,
    params: {
      userId
    }
  });
};
