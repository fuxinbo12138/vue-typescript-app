import request from "@/utils/request";
// import qs from "qs";

interface SaveOrUpdateInfo {
  name: string;
  href: string;
  parentId: number;
  description: string;
  icon: string;
}

// 获取所有菜单带层级
export const getMenuList = () => {
  return request({
    method: "GET",
    url: "/boss/menu/getMenuNodeList"
  });
};

// 获取所有菜单不带层级
export const getAll = () => {
  return request({
    method: "GET",
    url: "/boss/menu/getAll"
  });
};

// 保存或新增菜单
export const saveOrUpdate = (data: SaveOrUpdateInfo) => {
  return request({
    method: "POST",
    url: "/boss/menu/saveOrUpdate",
    data
  });
};

// 删除菜单
export const del = (id: number) => {
  return request({
    method: "DELETE",
    url: `/boss/menu/${id}`
  });
};
