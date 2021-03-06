<template>
  <div class="header">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item v-for="item in breadcrumb" :key="item">{{ item }}</el-breadcrumb-item>
    </el-breadcrumb>
    <el-dropdown>
      <span class="el-dropdown-link">
        <el-avatar
          shape="square"
          :size="40"
          :src="userInfo.portrait || require('@/assets/img/default-avatar.png')"
        ></el-avatar>
        <i class="el-icon-arrow-down el-icon--right"></i>
      </span>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item>{{ userInfo.userName }}</el-dropdown-item>
        <el-dropdown-item divided @click.native="logout">退出</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { getUserInfo, logout } from "@/api/user";

export default Vue.extend({
  name: "AppHeader",
  data() {
    return {
      userInfo: {}
    };
  },
  created() {
    this.loadUserInfo();
  },
  computed: {
    breadcrumb() {
      return this.$route.meta.breadcrumb;
    }
  },
  methods: {
    async loadUserInfo() {
      const { data } = await getUserInfo();
      this.userInfo = data.content;
    },
    logout() {
      this.$confirm("确认退出吗？", "退出提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          const { data } = await logout();
          if (data.state !== 1) {
            this.$message.error(data.message);
          } else {
            this.$store.commit("setUser", null);

            // 跳转到登录页面
            this.$router.push({
              name: "login"
            });

            this.$message({
              type: "success",
              message: "退出成功!"
            });
          }
        })
        .catch(() => {
          // 取消执行这里
          this.$message({
            type: "info",
            message: "已取消退出"
          });
        });
    }
  }
});
</script>

<style lang="less" scoped>
.header {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  .el-dropdown-link {
    display: flex;
    align-items: center;
  }
}
</style>
