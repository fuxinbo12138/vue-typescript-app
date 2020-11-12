<template>
  <div>
    <el-card class="search">
      <el-form size="small" :inline="true" :model="form" class="demo-form-inline">
        <el-form-item label="资源名称">
          <el-input v-model="form.name" placeholder="资源名称"></el-input>
        </el-form-item>
        <el-form-item label="资源路径">
          <el-input v-model="form.url" placeholder="资源路径"></el-input>
        </el-form-item>
        <el-form-item label="资源分类">
          <el-select v-model="form.categoryId" placeholder="资源分类" clearable>
            <el-option
              v-for="category in typeList"
              :key="category.id"
              :label="category.name"
              :value="category.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getList">查询</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <div class="clearfix" style="margin-bottom: 10px">
      <el-button size="mini" @click="$refs.create.add()">添加资源</el-button>
    </div>
    <el-table :data="list" border stripe style="width: 100%">
      <el-table-column align="center" type="index" :index="indexMethod" width="80" label="编号">
      </el-table-column>
      <el-table-column align="center" prop="name" label="资源名称"> </el-table-column>
      <el-table-column align="center" prop="url" label="资源路径"> </el-table-column>
      <el-table-column align="center" prop="description" label="描述"> </el-table-column>
      <el-table-column align="center" width="150px" prop="createdTime" label="添加时间">
        <template slot-scope="scope">
          <span>{{ scope.row.createdTime | timeFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="100">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="$refs.create.editor(scope.row)"
            >编辑</el-button
          >
          <el-button type="text" size="small" @click="del(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div style="text-align: right">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="page.current"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="10"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </div>
    <create ref="create" @ok="getList" />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import create from "./components/create.vue";
import { getList, del, categoryAll } from "@/api/resource";
import moment from "moment";

export default Vue.extend({
  name: "ResourceFirst",
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
      form: {},
      typeList: [],
      list: [],
      page: {
        current: 1,
        size: 10
      },
      total: 0
    };
  },
  created() {
    this.getList();
    this.categoryAll();
  },
  methods: {
    handleSizeChange(val: number) {
      this.page.size = val;
      this.page.current = 1;
      this.getList();
    },
    handleCurrentChange(val: number) {
      this.page.current = val;
      this.getList();
    },
    indexMethod(index: number) {
      return (this.page.current - 1) * 10 + index + 1;
    },
    async getList() {
      const { data } = await getList(Object.assign(this.form, this.page));
      if (data.code === "000000") {
        this.list = data.data.records;
        this.total = data.data.total;
      } else {
        this.$message.error(data.mesg);
      }
    },
    async categoryAll() {
      const { data } = await categoryAll();
      if (data.code === "000000") {
        this.typeList = data.data;
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
