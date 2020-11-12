import request from "@/utils/request";
import qs from "qs";

interface LoginForm {
  phone: string;
  password: string;
}

interface UserListInfo {
  currentPage: number;
  pageSize: number;
}

export const login = (data: LoginForm) => {
  return request({
    method: "POST",
    url: "/front/user/login",
    data: qs.stringify(data)
  });
};

export const getUserInfo = () => {
  return request({
    method: "GET",
    url: "/front/user/getInfo"
  });
};

export const logout = () => {
  return request({
    method: "POST",
    url: "/front/user/logout"
  });
};

// 查询用户列表
export const getList = (data: UserListInfo) => {
  return request({
    method: "POST",
    url: "/boss/user/getUserPages",
    data
  });
};

// 禁用用户
export const forbidUser = (id: number) => {
  return request({
    method: "GET",
    url: "/boss/user/forbidUser",
    params: {
      id
    }
  });
};

// 启用用户
export const enableUser = (id: number) => {
  return request({
    method: "GET",
    url: "/boss/user/enableUser",
    params: {
      id
    }
  });
};
