<template>
  <el-dialog
    :close-on-click-modal="false"
    width="600px"
    title="资源管理"
    :visible.sync="dialogFormVisible"
  >
    <el-form :rules="rules" ref="ruleForm" :model="form" label-width="80px">
      <el-select v-model="form.roleList" multiple placeholder="请选择">
        <el-option v-for="item in selectList" :key="item.id" :label="item.name" :value="item.id">
        </el-option>
      </el-select>
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
import { allocateUserRoles, getRolesWithUserPermission } from "@/api/role";

export default Vue.extend({
  name: "ResourceAddOrUpdate",
  data() {
    return {
      form: {
        roleList: []
      },
      selectList: [],
      userInfo: {
        id: null
      },
      rules: {
        roleList: [{ required: true, message: "请选择角色", trigger: "blur" }]
      },
      typeList: [],
      dialogFormVisible: false
    };
  },
  methods: {
    async getRolesWithUserPermission(id: number) {
      const { data } = await getRolesWithUserPermission(id);
      this.selectList = data.data;
      this.form.roleList = data.data.filter((item: any) => item.hasPermission);
    },
    editor(row: any) {
      this.userInfo = JSON.parse(JSON.stringify(row));
      this.getRolesWithUserPermission(row.id);
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        (this.$refs.ruleForm as Form).clearValidate();
      });
    },
    submit() {
      (this.$refs.ruleForm as Form).validate(async (valid) => {
        if (valid) {
          const result = {
            userId: this.userInfo.id,
            roleIdList: this.form.roleList
          };
          const { data } = await allocateUserRoles(result);
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
