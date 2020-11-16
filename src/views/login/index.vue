<template>
  <div class="login">
    <el-form
      :model="ruleForm"
      :rules="rules"
      label-position="top"
      ref="ruleForm"
      label-width="100px"
      class="login-form"
    >
      <h2>登录</h2>
      <el-form-item label="手机号" prop="phone">
        <el-input v-model="ruleForm.phone"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input type="password" v-model="ruleForm.password"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button
          :loading="loginLoading"
          class="login-btn"
          type="primary"
          @click="submitForm('ruleForm')"
          >登 录</el-button
        >
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Form } from "element-ui";

import { login } from "@/api/user";

export default Vue.extend({
  name: "LoginIndex",
  data() {
    return {
      loginLoading: false,
      ruleForm: {
        phone: "",
        password: ""
      },
      rules: {
        phone: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          {
            pattern: /^1\d{10}$/,
            message: "请输入正确的手机号",
            trigger: "blur"
          }
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 6,
            max: 18,
            message: "请输入长度6-18位的密码",
            trigger: "blur"
          }
        ]
      }
    };
  },
  methods: {
    submitForm() {
      (this.$refs.ruleForm as Form).validate(async (valid) => {
        if (valid) {
          this.loginLoading = true;
          const { data } = await login(this.ruleForm);

          this.loginLoading = false;

          if (data.state !== 1) {
            this.$message.error(data.message);
          } else {
            console.log(this.$store);
            this.$store.commit("User/setUser", data.content);

            this.$router.push((this.$route.query.redirect as string) || "/");

            this.$message.success("登录成功");
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    }
  }
});
</script>

<style lang="less" scoped>
.login {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  .login-form {
    width: 300px;
    background: #fff;
    padding: 20px;
    border-radius: 5px;
    ::v-deep .el-form-item__label {
      line-height: 20px;
    }
  }
  .login-btn {
    width: 100%;
  }
}
</style>
