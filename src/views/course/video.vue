<template>
  <div class="container">
    <el-card>
      <div slot="header">
        <div style="margin-bottom: 10px">课程：{{ info.courseName }}</div>
        <div>课时：{{ info2.theme }}</div>
      </div>
      <el-form label-width="40px">
        <el-form-item label="封面">
          <el-input
            style="width: 300px"
            readonly
            v-model="image.name"
            placeholder="请选择上传文件"
          ></el-input>
          <el-upload
            style="width: 300px; display: inline-block; margin-left: 10px"
            action=""
            class="upload-demo"
            ref="upload"
            :show-file-list="false"
            :auto-upload="false"
            :on-change="imageChange"
          >
            <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
          </el-upload>
        </el-form-item>
        <el-form-item label="视频">
          <el-input
            style="width: 300px"
            readonly
            v-model="video.name"
            placeholder="请选择上传文件"
          ></el-input>
          <el-upload
            style="width: 300px; display: inline-block; margin-left: 10px"
            action=""
            class="upload-demo"
            ref="upload"
            :show-file-list="false"
            :auto-upload="false"
            :on-change="videoChange"
          >
            <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
          </el-upload>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="authUpload">开始上传</el-button>
          <el-button>返回</el-button>
        </el-form-item>
        <el-form-item>
          <p v-if="uploadPercent">视频上传中: {{ uploadPercent }}%</p>
          <p v-if="isUploadSuccess">
            视频转码中: {{ isTransCodeSuccess ? "完成" : "正在处理，请稍后" }}
          </p>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>
<script>
/* eslint-disable */
import {
  aliyunImagUploadAddressAdnAuth,
  aliyunVideoUploadAddressAdnAuth,
  transCodeVideo,
  getAliyunTransCodePercent
} from "@/api/aliyun-oss";

import { getCourseById } from "@/api/course";

import { getLessonById } from "@/api/course-lesson";

export default {
  data() {
    return {
      info: {},
      info1: {},
      info2: {},
      uploader: null,
      videoId: null,
      imageUrl: "",
      fileName: "",
      video: {},
      image: {},
      uploadPercent: 0,
      isUploadSuccess: false,
      isTransCodeSuccess: false
    };
  },
  created() {
    this.initUploader();
    this.getCourseById();
    this.getLessonById();
  },
  methods: {
    async getCourseById() {
      const { data } = await getCourseById(this.$route.params.courseId);
      this.info = data.data
    },
    async getLessonById() {
      const { data } = await getLessonById(this.$route.query.lessonId);
      this.info2 = data.data
    },
    videoChange(file, fileList) {
      this.video = file;
    },
    imageChange(file, fileList) {
      this.image = file;
    },
    authUpload() {
      this.isUploadSuccess = false;
      this.isTransCodeSuccess = false;
      this.uploadPercent = 0;
      console.log(this.image)
      console.log(this.video)
      this.uploader.addFile(this.image.raw, null, null, null, '{"Vod":{}}');
      this.uploader.addFile(this.video.raw, null, null, null, '{"Vod":{}}');
      this.fileName = this.video.name;
      this.uploader.startUpload();
    },
    initUploader() {
      this.uploader = new window.AliyunUpload.Vod({
        // 阿里账号ID，必须有值 ，值的来源https://help.aliyun.com/knowledge_detail/37196.html
        userId: 1618139964448548,
        // 上传到点播的地域， 默认值为'cn-shanghai',//eu-central-1,ap-southeast-1
        region: "cn-shanghai",
        // 分片大小默认1M，不能小于100K
        partSize: 1048576,
        // 并行上传分片个数，默认5
        parallel: 5,
        // 网络原因失败时，重新上传次数，默认为3
        retryCount: 3,
        // 网络原因失败时，重新上传间隔时间，默认为2秒
        retryDuration: 2,
        // 开始上传
        onUploadstarted: async (uploadInfo) => {
          console.log("onUploadstarted", uploadInfo);
          let uploadAuthInfo = null;
          if (uploadInfo.isImage) {
            const { data } = await aliyunImagUploadAddressAdnAuth();
            this.imageUrl = data.data.imageURL;
            uploadAuthInfo = data.data;
          } else {
            const { data } = await aliyunVideoUploadAddressAdnAuth({
              fileName: uploadInfo.file.name
            });
            this.videoId = data.data.videoId;
            uploadAuthInfo = data.data;
          }

          // console.log('uploadAuthInfo', uploadAuthInfo)

          this.uploader.setUploadAuthAndAddress(
            uploadInfo,
            uploadAuthInfo.uploadAuth,
            uploadAuthInfo.uploadAddress,
            uploadAuthInfo.videoId || uploadAuthInfo.imageId
          );
        },
        // 文件上传成功
        onUploadSucceed: function(uploadInfo) {
          console.log("onUploadSucceed", uploadInfo);
        },
        // 文件上传失败
        onUploadFailed: function(uploadInfo, code, message) {
          console.log("onUploadFailed");
        },
        // 文件上传进度，单位：字节
        onUploadProgress: (uploadInfo, totalSize, loadedPercent) => {
          if(!uploadInfo.isImage) {
            this.uploadPercent = parseInt(loadedPercent * 100)
          }
          
        },
        // 上传凭证超时
        onUploadTokenExpired: function(uploadInfo) {
          console.log("onUploadTokenExpired");
        },
        // 全部文件上传结束
        onUploadEnd: async (uploadInfo) => {
          this.isUploadSuccess = true
          const { data } = await transCodeVideo({
            lessonId: this.$route.query.lessonId,
            fileId: this.videoId,
            coverImageUrl: this.imageUrl,
            fileName: this.fileName
          });

          var timer =  setInterval(async () => {
            const { data } = await getAliyunTransCodePercent(this.$route.query.lessonId);
            if(data.data === 100) {
              this.isTransCodeSuccess = true;
              clearInterval(timer)
            }
          }, 3000);
        }
      });
    }
  }
};
</script>
