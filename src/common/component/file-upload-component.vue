/**
* Created by WST on 2019/5/24.
*/
<template>
  <div class="vue-uploader">
    <div class="file-list">
      <section v-for="(file, index) in files" class="file-item draggable-item">
        <img :src="file.src" alt="" ondragstart="return false;">
        <p class="file-name">{{file.name}}</p>
        <span class="file-remove" @click="remove(index)">+</span>
      </section>
      <section v-if="status == 'ready'" class="file-item">
        <div @click="add" class="add">
          <span>+</span>
        </div>
      </section>
    </div>

    <section v-if="files.length != 0" class="upload-func">
      <div class="progress-bar">
        <section v-if="uploading" :width="(percent * 100) + '%'">{{(percent * 100) + '%'}}</section>
      </div>
      <div class="operation-box">
        <button v-if="status == 'ready'" @click="submit">上传</button>
        <button v-if="status == 'finished'" @click="finished">完成</button>
      </div>
    </section>
    <input type="file" accept="image/*" @change="fileChanged" ref="file" multiple="multiple">
  </div>
</template>
<script>
import Vue from 'vue'
export default {
  name: 'fileUpload',
  props: {
    src: {
      type: String,
      required: true
    },
    fileType: {
      type: String,
      required: true
    },
    fileSize: {
      type: Number,
      required: false
    }
  },
  data () {
    return {
      status: 'ready',
      files: [],
      point: {},
      uploading: false,
      percent: 0
    }
  },
  methods: {
    add () {
      this.$refs.file.click()
    },
    submit () {
      if (this.files.length === 0) {
        this.$message({
          message: '请先选择文件',
          type: 'warning'
        })
        return
      }
      const formData = new FormData()
      this.files.forEach((item) => {
        formData.append('file', item.file)
      })
      const xhr = new XMLHttpRequest()
      xhr.upload.addEventListener('progress', this.uploadProgress, false)
      xhr.open('POST', this.src, true)
      xhr.setRequestHeader('x-auth-token', sessionStorage.getItem('x-auth-token'))
      xhr.setRequestHeader('x-locale', localStorage.getItem('locale'))
      this.uploading = true
      xhr.send(formData)
      xhr.onload = () => {
        this.uploading = false
        if (xhr.status === 200 || xhr.status === 304) {
          this.status = 'finished'
          this.$message({
            message: '上传成功',
            type: 'success'
          })
        } else {
          this.$message.error(`上传失败，错误码： ${xhr.status}`)
        }

        this.$emit('importCallback', xhr.status)
      }
    },
    finished () {
      this.files = []
      this.status = 'ready'
    },
    remove (index) {
      this.files.splice(index, 1)
    },
    fileChanged () {
      const list = this.$refs.file.files
      for (let i = 0; i < list.length; i++) {
        if (!this.isContain(list[i])) {
          if (Vue.$isNullOrIsBlankOrIsUndefined(this.fileType)) {
            this.$message({
              message: '请指定允许上传的文件类型',
              type: 'warning'
            })
            return
          }

          let suf = list[i].name.substr(list[i].name.indexOf('.') + 1)
          if (this.fileType.indexOf(suf) !== -1) {
            if ((list[i].size / 1024 / 1024) > this.fileSize) {
              this.$message({
                message: '只能上传大小为[' + this.fileSize + 'MB]以内的文件',
                type: 'warning'
              })
              return
            }

            const item = {
              name: list[i].name,
              size: list[i].size,
              file: list[i]
            }
            this.html5Reader(list[i], item)
            this.files.push(item)
          } else {
            this.$message({
              message: '上传的文件类型只能为:[' + this.fileType + ']中的一种',
              type: 'warning'
            })
          }
        }
      }
      this.$refs.file.value = ''
    },
    // 将图片文件转成BASE64格式
    html5Reader (file, item) {
      const reader = new FileReader()
      reader.onload = (e) => {
        this.$set(item, 'src', e.target.result)
      }
      reader.readAsDataURL(file)
    },
    isContain (file) {
      return this.files.find((item) => item.name === file.name && item.size === file.size)
    },
    uploadProgress (evt) {
      const component = this
      if (evt.lengthComputable) {
        const percentComplete = Math.round((evt.loaded * 100) / evt.total)
        component.percent = percentComplete / 100
      } else {
        this.$message({
          message: '上传进程计算失败',
          type: 'warning'
        })
      }
    }
  }
}
</script>
<style>
  .vue-uploader {
    border: 1px solid #e5e5e5;
  }
  .vue-uploader .file-list {
    padding: 10px 0px;
  }
  .vue-uploader .file-list:after {
    content: '';
    display: block;
    clear: both;
    visibility: hidden;
    line-height: 0;
    height: 0;
    font-size: 0;
  }
  .vue-uploader .file-list .file-item {
    float: left;
    position: relative;
    width: 100px;
    text-align: center;
  }
  .vue-uploader .file-list .file-item img{
    width: 80px;
    height: 80px;
    border: 1px solid #ececec;
  }
  .vue-uploader .file-list .file-item .file-remove {
    position: absolute;
    right: 12px;
    display: none;
    top: 4px;
    width: 14px;
    height: 14px;
    color: white;
    cursor: pointer;
    line-height: 12px;
    border-radius: 100%;
    transform: rotate(45deg);
    background: rgba(0, 0, 0, 0.5);
  }
  .vue-uploader .file-list .file-item:hover .file-remove {
    display: inline;
  }
  .vue-uploader .file-list .file-item .file-name {
    margin: 0;
    height: 40px;
    word-break: break-all;
    font-size: 14px;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }
  .vue-uploader .add {
    width: 80px;
    height: 80px;
    margin-left: 10px;
    float: left;
    text-align: center;
    line-height: 80px;
    border: 1px dashed #ececec;
    font-size: 30px;
    cursor: pointer;
  }
  .vue-uploader .upload-func {
    display: flex;
    padding: 10px;
    margin: 0px;
    background: #f8f8f8;
    border-top: 1px solid #ececec;
  }
  .vue-uploader .upload-func .progress-bar {
    flex-grow: 1;
  }
  .vue-uploader .upload-func .progress-bar section {
    margin-top: 5px;
    background: #00b4aa;
    border-radius: 3px;
    text-align: center;
    color: #fff;
    font-size: 12px;
    transition: all .5s ease;
  }
  .vue-uploader .upload-func .operation-box {
    flex-grow: 0;
    padding-left: 10px;
  }
  .vue-uploader .upload-func .operation-box button {
    padding: 4px 12px;
    color: #fff;
    background: #007ACC;
    border: none;
    border-radius: 2px;
    cursor: pointer;
  }
  .vue-uploader > input[type="file"] {
    display: none;
  }
</style>
