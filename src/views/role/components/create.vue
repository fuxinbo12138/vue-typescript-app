<template>
  <el-dialog
    :close-on-click-modal="false"
    width="600px"
    title="资源管理"
    :visible.sync="dialogFormVisible"
  >
    <el-form :rules="rules" ref="ruleForm" :model="form" label-width="80px">
      <el-form-item label="角色名称" prop="name">
        <el-input v-model="form.name" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="资源编码" prop="code">
        <el-input v-model="form.code" autocomplete="off"></el-input>
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
import { saveOrUpdate } from "@/api/role";

export default Vue.extend({
  name: "ResourceAddOrUpdate",
  data() {
    return {
      form: {
        name: "",
        code: "",
        description: ""
      },
      rules: {
        name: [{ required: true, message: "请输入角色名称", trigger: "blur" }],
        code: [{ required: true, message: "请输入角色编码", trigger: "blur" }]
      },
      typeList: [],
      dialogFormVisible: false
    };
  },
  methods: {
    add() {
      this.form = {
        name: "",
        code: "",
        description: ""
      };
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        (this.$refs.ruleForm as Form).clearValidate();
      });
    },
    editor(row: any) {
      this.form = JSON.parse(JSON.stringify(row));
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        (this.$refs.ruleForm as Form).clearValidate();
      });
    },
    submit() {
      (this.$refs.ruleForm as Form).validate(async (valid) => {
        if (valid) {
          const { data } = await saveOrUpdate(this.form);
          if (data.code === "000000") {
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
