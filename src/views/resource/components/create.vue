<template>
  <el-dialog
    :close-on-click-modal="false"
    width="600px"
    title="资源管理"
    :visible.sync="dialogFormVisible"
  >
    <el-form :rules="rules" ref="ruleForm" :model="form" label-width="80px">
      <el-form-item label="资源名称" prop="name">
        <el-input v-model="form.name" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="资源路径" prop="url">
        <el-input v-model="form.url" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="资源分类" prop="categoryId">
        <el-select v-model="form.categoryId" placeholder="请选择资源分类">
          <el-option
            v-for="category in typeList"
            :key="category.id"
            :label="category.name"
            :value="category.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="描述" prop="description">
        <el-input v-model="form.description" autocomplete="off"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogFormVisible = false">取 消</el-button>
      <el-button type="primary" @click="submit">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script lang="ts">
import Vue from "vue";
import { Form } from "element-ui";
import { saveOrUpdate, categoryAll } from "@/api/resource";

export default Vue.extend({
  name: "ResourceAddOrUpdate",
  data() {
    return {
      form: {
        name: "",
        url: "",
        categoryId: -1,
        description: ""
      },
      rules: {
        name: [{ required: true, message: "请输入资源名称", trigger: "blur" }],
        url: [{ required: true, message: "请输入资源路径", trigger: "blur" }],
        categoryId: [{ required: true, message: "请选择资源分类", trigger: "change" }],
        description: [{ required: true, message: "请输入资源描述", trigger: "blur" }]
      },
      typeList: [],
      dialogFormVisible: false
    };
  },
  methods: {
    add() {
      this.form = {
        name: "",
        url: "",
        categoryId: -1,
        description: ""
      };
      this.dialogFormVisible = true;
      this.categoryAll();
      this.$nextTick(() => {
        (this.$refs.ruleForm as Form).clearValidate();
      });
    },
    editor(row: any) {
      this.form = JSON.parse(JSON.stringify(row));
      this.dialogFormVisible = true;
      this.categoryAll();
      this.$nextTick(() => {
        (this.$refs.ruleForm as Form).clearValidate();
      });
    },
    async categoryAll() {
      const { data } = await categoryAll();
      if (data.code === "000000") {
        this.typeList = data.data;
      }
    },
    submit() {
      (this.$refs.ruleForm as Form).validate(async (valid) => {
        if (valid) {
          const { data } = await saveOrUpdate(this.form);
          if (data.data) {
            this.$message.success("保存成功");
            this.dialogFormVisible = false;
            this.$emit("ok");
          } else {
            this.$message.error(data.mesg);
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
.menu {
  min-height: 100%;
  .el-select {
    width: 100%;
  }
}
</style>
