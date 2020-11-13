<template>
  <el-dialog
    :close-on-click-modal="false"
    width="600px"
    title="广告位管理"
    :visible.sync="dialogFormVisible"
  >
    <el-form :rules="rules" ref="ruleForm" :model="form" label-width="100px">
      <el-form-item label="spaceKey" prop="spaceKey">
        <el-input v-model="form.spaceKey" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="广告位名称" prop="name">
        <el-input v-model="form.name" autocomplete="off"></el-input>
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
import { saveOrUpdate } from "@/api/advert-space";

export default Vue.extend({
  name: "ResourceAddOrUpdate",
  data() {
    return {
      form: {
        spaceKey: "",
        name: ""
      },
      rules: {
        spaceKey: [{ required: true, message: "请输入spaceKey", trigger: "blur" }],
        name: [{ required: true, message: "请输入广告位名称", trigger: "blur" }]
      },
      typeList: [],
      dialogFormVisible: false
    };
  },
  methods: {
    add() {
      this.form = {
        spaceKey: "",
        name: ""
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
          if (data.state === 1) {
            this.$message.success("保存成功");
            this.dialogFormVisible = false;
            this.$emit("ok");
          } else {
            this.$message.error(data.message);
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
