<template>
  <div>
    <el-card>
      <div slot="header" class="clearfix">
        <el-button size="mini" @click="$refs.create.add()">添加广告</el-button>
      </div>
      <el-table :data="list" border stripe style="width: 100%">
        <el-table-column align="center" type="index" :index="indexMethod" width="80" label="编号">
        </el-table-column>
        <el-table-column align="center" prop="name" label="广告名称"> </el-table-column>
        <el-table-column align="center" prop="name" label="广告位置">
          <template slot-scope="scope">
            <span>{{ ggw(scope.row.spaceId) }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="广告图片">
          <template slot-scope="scope">
            <img style="width:100px" :src="scope.row.img" alt="" />
          </template>
        </el-table-column>
        <el-table-column align="center" width="250px" label="时间">
          <template slot-scope="scope">
            <span>开始时间：{{ scope.row.startTimeFormatString }}</span>
            <br />
            <span>结束时间：{{ scope.row.endTimeFormatString }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" width="200px" label="状态">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.status === 0" type="danger">下线</el-tag>
            <el-tag v-else>上线</el-tag>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" width="300">
          <template slot-scope="scope">
            <el-button
              v-if="scope.row.status === 0"
              type="text"
              size="small"
              @click="statusChange(1, scope.row.id)"
              >上线</el-button
            >
            <el-button v-else type="text" size="small" @click="statusChange(0, scope.row.id)"
              >下线</el-button
            >
            <el-button type="text" size="small" @click="$refs.create.editor(scope.row)"
              >编辑</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <create ref="create" @ok="getList" :ggwlist="ggwlist" />
    </el-card>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import create from "./components/create.vue";
import { getList, updateStatus } from "@/api/advert";
import { getList as ggwList } from "@/api/advert-space";
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
  computed: {
    ggw() {
      return (id: number) => {
        const result = (this.ggwlist as any).find((item: any) => item.id === id);
        return result ? result.name : "";
      };
    }
  },
  data() {
    return {
      form: {},
      typeList: [],
      list: [],
      ggwlist: []
    };
  },
  created() {
    this.getList();
    this.getGgwList();
  },
  methods: {
    indexMethod(index: number) {
      return index + 1;
    },
    statusChange(status: number, id: number) {
      const message = status === 1 ? "确认上线吗？" : "确认下线吗？";
      this.$confirm(message, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          const { data } = await updateStatus({
            status,
            id
          });
          if (data.state === 1) {
            this.$message.success("操作成功");
            this.getList();
          } else {
            this.$message.error(data.message);
          }
        })
        .catch(() => {
          // 取消执行这里
        });
    },
    async getList() {
      const { data } = await getList();
      if (data.state === 1) {
        this.list = data.content;
      } else {
        this.$message.error(data.mesg);
      }
    },
    async getGgwList() {
      const { data } = await ggwList();
      if (data.state === 1) {
        this.ggwlist = data.content;
      } else {
        this.$message.error(data.mesg);
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
