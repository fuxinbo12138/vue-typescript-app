import request from "@/utils/request";
import qs from "qs";

interface LoginForm {
  phone: string;
  password: string;
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
