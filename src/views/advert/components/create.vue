<template>
  <el-dialog
    :close-on-click-modal="false"
    width="600px"
    title="广告管理"
    :visible.sync="dialogFormVisible"
  >
    <el-form :rules="rules" ref="ruleForm" :model="form" label-width="100px">
      <el-form-item label="广告名称" prop="name">
        <el-input v-model="form.name" autocomplete="off"></el-input>
      </el-form-item>

      <el-form-item label="广告位置" prop="spaceId">
        <el-select v-model="form.spaceId" placeholder="请选择广告位置">
          <el-option
            v-for="item in ggwlist"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="开始时间" prop="startTime">
        <el-date-picker v-model="form.startTime" type="date" placeholder="选择日期">
        </el-date-picker>
      </el-form-item>

      <el-form-item label="到期时间" prop="endTime">
        <el-date-picker v-model="form.endTime" type="date" placeholder="选择日期"> </el-date-picker>
      </el-form-item>

      <el-form-item label="上线/下线" prop="status">
        <el-radio-group v-model="form.status">
          <el-radio :label="1">上线</el-radio>
          <el-radio :label="0">下线</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="广告图片" prop="status">
        <upload v-model="form.img" :limit="5" />
      </el-form-item>

      <el-form-item label="广告链接" prop="link">
        <el-input v-model="form.link" autocomplete="off"></el-input>
      </el-form-item>

      <el-form-item label="广告备注" prop="text">
        <el-input v-model="form.text" autocomplete="off"></el-input>
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
import { saveOrUpdate } from "@/api/advert";
import upload from "@/views/course/components/CourseImage.vue";

export default Vue.extend({
  name: "ResourceAddOrUpdate",
  components: {
    upload
  },
  props: {
    ggwlist: {
      type: Array
    }
  },
  data() {
    return {
      selectList: [],
      form: {},
      rules: {
        name: [{ required: true, message: "请输入广告名称", trigger: "blur" }],
        startTime: [{ required: true, message: "请选择开始时间", trigger: "blur" }],
        endTime: [{ required: true, message: "请选择结束时间", trigger: "blur" }],
        link: [{ required: true, message: "请输入广告链接", trigger: "blur" }]
      },
      typeList: [],
      dialogFormVisible: false
    };
  },
  methods: {
    add() {
      this.form = {
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
