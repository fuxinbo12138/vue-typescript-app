<template>
  <el-card class="out">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="资源管理" name="first">
        <First ref="first" />
      </el-tab-pane>
      <el-tab-pane label="资源分类管理" name="second">
        <Second ref="second" />
      </el-tab-pane>
    </el-tabs>
  </el-card>
</template>

<script lang="ts">
import Vue from "vue";
import First from "./first.vue";
import Second from "./second.vue";

export default Vue.extend({
  name: "ResourceIndex",
  components: {
    First,
    Second
  },
  data() {
    return {
      activeName: "first"
    };
  },
  methods: {
    handleClick(tab: any) {
      if (tab.name === "first") {
        (this.$refs.first as any).categoryAll();
      }
    }
  }
});
</script>

<style lang="less" scoped>
.out {
  ::v-deep .el-card__body {
    padding: 10px;
  }
}
.search {
  margin-bottom: 10px;
  ::v-deep .el-card__body {
    padding: 20px 10px 10px;
  }
}
</style>
