<template>
  <div>
    <div class="clearfix" style="margin-bottom: 10px">
      <el-button size="mini" @click="$refs.create.add()">添加</el-button>
    </div>
    <el-table :data="list" border stripe style="width: 100%">
      <el-table-column align="center" type="index" :index="indexMethod" width="80" label="编号">
      </el-table-column>
      <el-table-column align="center" prop="name" label="名称"> </el-table-column>
      <el-table-column align="center" prop="url" label="创建时间">
        <template slot-scope="scope">
          <span>{{ scope.row.createdTime | timeFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="sort" label="排序"> </el-table-column>
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
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import create from "./components/createSecond.vue";
import { categoryAll, delCategory } from "@/api/resource";
import moment from "moment";

export default Vue.extend({
  name: "ResourceSecond",
  filters: {
    timeFilter(value: string) {
      return moment(value).format("YYYY-MM-DD");
    }
  },
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
      return index + 1;
    },
    async getList() {
      const { data } = await categoryAll();
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
          const { data } = await delCategory(id);
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
