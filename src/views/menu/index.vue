<template>
  <el-card>
    <div slot="header" class="clearfix">
      <el-button size="mini" @click="$refs.create.add()">添加菜单</el-button>
    </div>
    <el-table :data="list" border stripe style="width: 100%">
      <el-table-column align="center" type="index" :index="indexMethod" width="80" label="编号">
      </el-table-column>
      <el-table-column align="center" prop="name" label="菜单名称"> </el-table-column>
      <el-table-column align="center" label="菜单级数">
        <template slot-scope="scope">
          <span v-if="scope.row.level === 0">一级</span>
          <span v-else>二级</span>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="icon" label="前端图标"> </el-table-column>
      <el-table-column align="center" prop="orderNum" label="排序"> </el-table-column>
      <el-table-column align="center" label="操作" width="500">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="$refs.create.editor(scope.row)"
            >编辑</el-button
          >
          <el-button type="text" size="small" @click="del(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <create ref="create" @ok="getList" />
  </el-card>
</template>

<script lang="ts">
import Vue from "vue";
import create from "./components/create.vue";
import { getAll, del } from "@/api/menu";

export default Vue.extend({
  name: "MenuIndex",
  components: {
    create
  },
  data() {
    return {
      list: []
    };
  },
  created() {
    this.getList();
  },
  methods: {
    indexMethod(index: number) {
      // return (this.page.current - 1) * 10 + index + 1;
      return index + 1;
    },
    async getList() {
      const { data } = await getAll();
      if (data.code === "000000") {
        this.list = data.data;
      } else {
        this.$message.error(data.mesg);
      }
    },
    del(id: number) {
      this.$confirm("确认删除吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          const { data } = await del(id);
          if (data.code === "000000") {
            this.$message.success("删除成功");
            this.getList();
          } else {
            this.$message.error(data.mesg);
          }
        })
        .catch(() => {
          // 取消执行这里
        });
    }
  }
});
</script>

<style lang="less" scoped></style>
