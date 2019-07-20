<template>
  <div class="publish-container">
    <el-card>
      <div slot="header">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>{{wenzhangid?'修改':'发布'}}文章</el-breadcrumb-item>
        </el-breadcrumb>
      </div>

      <el-form ref="form" :model="reqForm" label-width="80px">
        <el-form-item label="标题：">
          <el-input v-model="reqForm.title" style="width:400px"></el-input>
        </el-form-item>

        <el-form-item label="内容：">
          <quill-editor v-model="reqForm.content" :options="editorOption"></quill-editor>
        </el-form-item>

        <el-form-item label="封面：">
          <el-radio-group v-model="reqForm.cover.type" @change="changetype">
            <el-radio :label="1">单图</el-radio>
            <el-radio :label="3">三张</el-radio>
            <el-radio :label="0">无图</el-radio>
            <el-radio :label="-1">自动</el-radio>
          </el-radio-group>
          <!-- 单图 -->
          <div v-if="reqForm.cover.type===1">
            <fz-image v-model="reqForm.cover.images[0]"></fz-image>
          </div>
          <!-- 三图 -->
          <div v-if="reqForm.cover.type===3">
            <fz-image v-model="reqForm.cover.images[0]"></fz-image>
            <fz-image v-model="reqForm.cover.images[1]"></fz-image>
            <fz-image v-model="reqForm.cover.images[2]"></fz-image>
          </div>
        </el-form-item>

        <el-form-item size="small" label="频道：">
          <my-pindao v-model="reqForm.channel_id"></my-pindao>
        </el-form-item>

        <el-form-item v-if="wenzhangid">
          <el-button type="primary" @click="edit(false)">修改</el-button>
          <el-button @click="edit(true)">存入草稿</el-button>
        </el-form-item>

        <el-form-item v-else>
          <el-button type="primary" @click="publish(false)">发表</el-button>
          <el-button @click="publish(true)">存入草稿</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
// 引入频道组件
// import pindao from '@/components/pindao.vue'

import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import { quillEditor } from 'vue-quill-editor'

export default {
  // 注册富文本组件
  components: {
    quillEditor
  },
  data () {
    return {
      // 富文本的配置对象
      editorOption: {
        placeholder: '',
        modules: {
          toolbar: [
            ['bold', 'italic', 'underline', 'strike'],
            ['blockquote', 'code-block'],
            [{ header: 1 }, { header: 2 }],
            [{ list: 'ordered' }, { list: 'bullet' }],
            [{ indent: '-1' }, { indent: '+1' }]
          ]
        }
      },

      // 提交给后台的文章数据
      reqForm: {
        contnet: '',

        cover: {
          type: 1,
          images: []
        },
        // 频道ID
        channel_id: null,
        // 修改文章的ID
        wenzhangid: null
      }
    }
  },

  created () {
    this.wenzhangid = this.$route.query.id
    // 可能拿不到
    // 获取文章数据
    if (this.wenzhangid) {
      // 如果存在id获取数据
      this.getarticle()
    }
  },

  watch: {
    $route () {
      this.wenzhangid = null
      this.reqForm = {
        contnet: '',

        cover: {
          type: 1,
          images: []
        },
        // 频道ID
        channel_id: null,
        // 修改文章的ID
        wenzhangid: null
      }
    }
  },

  methods: {
    // 获取文章数据
    async getarticle () {
      const {
        data: { data }
      } = await this.$http.get('articles/' + this.wenzhangid)
      this.reqForm = data
    },

    // 发表和存入草稿
    async publish (draft) {
      // 校验数据省略
      await this.$http.post(`articles? `, this.reqForm)
      this.$message.success(draft ? '存入草稿成功' : '发表成功')
      this.$router.push('/article')
    },

    // 修改和存入草稿
    async edit (draft) {
      // 校验数据省略
      await this.$http.put(`articles/${this.wenzhangid}?draft=${draft}`, this.reqForm)
      this.$message.success(draft ? '修改草稿成功' : '修改成功')
      this.$router.push('/article')
    },

    changetype () {
      // 重新选择图片类型
      this.reqForm.cover.images = []
    }
  }
}
</script>

<style scope lang="less">
</style>
