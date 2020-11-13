<template>
  <div>
    <el-card>
      <div slot="header" class="clearfix">
        <el-button size="mini" @click="$refs.create.add()">添加广告位</el-button>
      </div>
      <el-table :data="list" border stripe style="width: 100%">
        <el-table-column align="center" type="index" :index="indexMethod" width="80" label="编号">
        </el-table-column>
        <el-table-column align="center" prop="spaceKey" label="spaceKey"> </el-table-column>
        <el-table-column align="center" prop="name" label="广告位名称"> </el-table-column>
        <el-table-column align="center" width="200px" label="创建时间">
          <template slot-scope="scope">
            <span>{{ scope.row.createTime | timeFilter }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" width="200px" label="更新时间">
          <template slot-scope="scope">
            <span>{{ scope.row.updateTime | timeFilter }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" width="300">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="$refs.create.editor(scope.row)"
              >编辑</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <create ref="create" @ok="getList" />
    </el-card>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import create from "./components/create.vue";
import { getList } from "@/api/advert-space";
import moment from "moment";

export default Vue.extend({
  name: "AdvertSpaceIndex",
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
      const { data } = await getList();
      if (data.state === 1) {
        this.list = data.content;
      } else {
        this.$message.error(data.message);
      }
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
