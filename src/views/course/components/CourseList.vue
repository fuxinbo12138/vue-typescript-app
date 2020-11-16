<template>
  <div class="course-list">
    <el-card>
      <el-form ref="form" :inline="true" size="small" :model="filterParams">
        <el-form-item label="课程名称" prop="courseName">
          <el-input v-model="filterParams.courseName"></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="filterParams.status">
            <el-option label="全部" value=""></el-option>
            <el-option label="上架" value="1"></el-option>
            <el-option label="下架" value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button :disabled="loading" @click="handleReset">重置</el-button>
          <el-button type="primary" :disabled="loading" @click="loadCourses">查询</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card>
      <div slot="header" class="clearfix">
        <el-button
          size="mini"
          @click="
            $router.push({
              name: 'course-create'
            })
          "
          >添加课程</el-button
        >
      </div>
      <el-table
        :data="courses"
        border
        stripe
        v-loading="loading"
        style="width: 100%; margin-bottom: 20px"
      >
        <el-table-column
          align="center"
          type="index"
          :index="indexMethod"
          width="80"
          label="编号"
        ></el-table-column>
        <el-table-column prop="id" label="ID" align="center"> </el-table-column>
        <el-table-column prop="courseName" align="center" label="课程名称"> </el-table-column>
        <el-table-column prop="price" align="center" label="价格"> </el-table-column>
        <el-table-column prop="sortNum" align="center" label="排序"> </el-table-column>
        <el-table-column prop="status" align="center" label="上架状态" width="100px">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.status === 0" type="danger">下架</el-tag>
            <el-tag v-else>上架</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="price" label="操作" width="180" align="center">
          <template slot-scope="scope">
            <el-button
              v-if="scope.row.status === 0"
              type="text"
              @click="StatusChange(1, scope.row.id)"
              >上架</el-button
            >
            <el-button v-else type="text" @click="StatusChange(0, scope.row.id)">下架</el-button>
            <el-button
              type="text"
              @click="
                $router.push({
                  name: 'course-edit',
                  params: {
                    courseId: scope.row.id
                  }
                })
              "
              >编辑</el-button
            >
            <el-button
              type="text"
              @click="
                $router.push({
                  name: 'course-section',
                  params: {
                    courseId: scope.row.id
                  }
                })
              "
              >内容管理</el-button
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
    </el-card>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { getQueryCourses, changeState } from "@/api/course";
import { Form } from "element-ui";

export default Vue.extend({
  name: "CourseList",
  data() {
    return {
      filterParams: {
        courseName: "",
        status: ""
      },
      courses: [],
      page: {
        currentPage: 1,
        pageSize: 10
      },
      total: 0,
      loading: true
    };
  },

  created() {
    this.loadCourses();
  },

  methods: {
    handleSizeChange(val: number) {
      this.page.pageSize = val;
      this.page.currentPage = 1;
      this.loadCourses();
    },
    handleCurrentChange(val: number) {
      this.page.currentPage = val;
      this.loadCourses();
    },
    indexMethod(index: number) {
      return (this.page.currentPage - 1) * 10 + index + 1;
    },
    async loadCourses() {
      this.loading = true;
      const { data } = await getQueryCourses(Object.assign(this.filterParams, this.page));
      data.data.records.forEach((item: any) => {
        item.isStatusLoading = false;
      });
      this.courses = data.data.records;
      this.total = data.data.total;
      this.loading = false;
    },

    handleReset() {
      (this.$refs.form as Form).resetFields();
      this.page.currentPage = 1;
      this.loadCourses();
    },

    async StatusChange(status: number, id: number) {
      await changeState({
        courseId: id,
        status: status
      });
      this.$message.success(`操作成功`);
      this.loadCourses();
    }
  }
});
</script>

<style lang="less" scoped>
.el-card {
  margin-bottom: 20px;
}
</style>
