<template>
  <el-dialog
    :close-on-click-modal="false"
    width="600px"
    title="菜单管理"
    :visible.sync="dialogFormVisible"
  >
    <el-form :rules="rules" ref="ruleForm" :model="form" label-width="80px">
      <el-form-item label="菜单名称" prop="name">
        <el-input v-model="form.name" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="菜单路径" prop="href">
        <el-input v-model="form.href" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="上级菜单" prop="parentId">
        <el-select v-model="form.parentId" placeholder="请选择上级菜单">
          <el-option label="无上级菜单" :value="-1"></el-option>
          <el-option
            v-for="menu in menuList"
            :key="menu.id"
            :label="menu.name"
            :value="menu.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="描述" prop="description">
        <el-input v-model="form.description" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="前端图标" prop="icon">
        <el-input v-model="form.icon" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="是否显示" prop="shown">
        <el-radio-group v-model="form.shown">
          <el-radio :label="true">是</el-radio>
          <el-radio :label="false">否</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="排序" prop="orderNum">
        <el-input v-model="form.orderNum" autocomplete="off"></el-input>
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
import { saveOrUpdate, getMenuList } from "@/api/menu";

export default Vue.extend({
  name: "MenuAddOrUpdate",
  data() {
    return {
      form: {
        name: "",
        href: "",
        parentId: -1,
        description: "",
        icon: ""
      },
      rules: {
        name: [{ required: true, message: "请输入菜单名称", trigger: "blur" }],
        href: [{ required: true, message: "请输入菜单路径", trigger: "blur" }],
        description: [{ required: true, message: "请输入菜单描述", trigger: "blur" }],
        icon: [{ required: true, message: "请输入菜单图标", trigger: "blur" }]
      },
      menuList: [],
      dialogFormVisible: false
    };
  },
  methods: {
    add() {
      this.form = {
        name: "",
        href: "",
        parentId: -1,
        description: "",
        icon: ""
      };
      this.dialogFormVisible = true;
      this.getMenuList();
      this.$nextTick(() => {
        (this.$refs.ruleForm as Form).clearValidate();
      });
    },
    editor(row: any) {
      this.form = JSON.parse(JSON.stringify(row));
      this.dialogFormVisible = true;
      this.getMenuList();
      this.$nextTick(() => {
        (this.$refs.ruleForm as Form).clearValidate();
      });
    },
    async getMenuList() {
      const { data } = await getMenuList();
      if (data.code === "000000") {
        this.menuList = data.data;
      }
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
