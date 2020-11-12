<template>
  <div>
    <el-card class="search">
      <el-form size="small" :inline="true" :model="form" class="demo-form-inline">
        <el-form-item label="角色名称">
          <el-input v-model="form.phone" placeholder="手机号"></el-input>
        </el-form-item>
        <el-form-item label="注册时间">
          <el-date-picker
            v-model="form.times"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getList">查询</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card>
      <el-table :data="list" border stripe style="width: 100%">
        <el-table-column align="center" type="index" :index="indexMethod" width="80" label="编号">
        </el-table-column>
        <el-table-column align="center" prop="id" label="用户ID"> </el-table-column>
        <el-table-column align="center" label="头像">
          <template slot-scope="scope">
            <img
              style="width:30px"
              :src="
                scope.row.portrait ? scope.row.portrait : require('@/assets/img/default-avatar.png')
              "
              alt=""
            />
          </template>
        </el-table-column>
        <el-table-column align="center" prop="name" label="用户名"> </el-table-column>
        <el-table-column align="center" prop="phone" label="手机号"> </el-table-column>
        <el-table-column align="center" width="200px" prop="createdTime" label="注册时间">
          <template slot-scope="scope">
            <span>{{ scope.row.createdTime | timeFilter }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="状态">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.status === 'DISABLE'" type="danger">禁用</el-tag>
            <el-tag v-else>启用</el-tag>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" width="200">
          <template slot-scope="scope">
            <el-button
              v-if="scope.row.status === 'DISABLE'"
              type="text"
              size="small"
              @click="userStatusChange(0, scope.row.id)"
              >启用</el-button
            >
            <el-button v-else type="text" size="small" @click="userStatusChange(1, scope.row.id)"
              >禁用</el-button
            >
            <el-button type="text" size="small" @click="$refs.create.editor(scope.row)"
              >分配角色</el-button
            >
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
    </el-card>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import create from "./components/create.vue";
import { getList, forbidUser, enableUser } from "@/api/user";
import moment from "moment";

export default Vue.extend({
  name: "UserIndex",
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
      form: {
        phone: "",
        times: []
      },
      typeList: [],
      list: [],
      page: {
        currentPage: 1,
        pageSize: 10
      },
      total: 0
    };
  },
  created() {
    this.getList();
  },
  methods: {
    handleSizeChange(val: number) {
      this.page.pageSize = val;
      this.page.currentPage = 1;
      this.getList();
    },
    handleCurrentChange(val: number) {
      this.page.currentPage = val;
      this.getList();
    },
    indexMethod(index: number) {
      return (this.page.currentPage - 1) * 10 + index + 1;
    },
    async getList() {
      let startCreateTime, endCreateTime;
      if (this.form.times && this.form.times.length > 0) {
        startCreateTime = this.form.times[0];
        endCreateTime = this.form.times[1];
      }
      const result = {
        ...this.page,
        phone: this.form.phone,
        startCreateTime,
        endCreateTime
      };
      const { data } = await getList(result);
      if (data.code === "000000") {
        this.list = data.data.records;
        this.total = data.data.total;
      } else {
        this.$message.error(data.mesg);
      }
    },
    userStatusChange(type: number, id: number) {
      const handle = type === 1 ? forbidUser : enableUser;
      const message = type === 1 ? "确认禁用吗？" : "确认启用吗？";
      this.$confirm(message, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          const { data } = await handle(id);
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
