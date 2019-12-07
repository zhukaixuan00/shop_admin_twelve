<template>
  <div class="login">
    <el-form ref="form" status-icon :rules="rules" :model="form" label-width="80px">
      <img src="../assets/zuozhu.jpg" alt="">
      <el-form-item label="用户名" prop="username">
        <el-input v-model="form.username" placeholder="请输入姓名"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input type="password" v-model="form.password"  placeholder="请输入密码" @keyup.native.enter="login"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="login" >登录</el-button>
        <el-button @click="reset">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>

export default {
  data () {
    return {
      form: {
        username: '',
        password: ''
      },
      rules: {
        // 用户名的校验
        username: [
          { required: true, message: '请输入用户名', trigger: 'change' },
          { min: 3, max: 6, message: '长度在 3 到 6 个字符', trigger: 'blur' }
        ],
        // 密码的校验
        password: [
          { required: true, message: '请输入密码', trigger: 'change' },
          { min: 6, max: 12, message: '长度在 6 到 12 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    login () {
      this.$refs.form.validate(async valid => {
        if (!valid) return
        const res = await this.axios({
          method: 'post',
          url: 'login',
          data: this.form
        })
        if (res.data.meta.status === 200) {
          this.$message({
            message: '恭喜你，登陆成功了',
            type: 'success',
            duration: 1000
          })
          // 把token存储起来
          localStorage.setItem('myToken', res.data.data.token)
          // 跳转至Home组件的
          this.$router.push('/home')
        } else {
          this.$message({
            message: res.data.meta.msg,
            type: 'error',
            duration: 1000
          })
        }
      })
    },
    reset () {
      this.$refs.form.resetFields()
    }
  }
}
</script>

<style lang="less" scoped>
.login {
  width: 100%;
  height: 100%;
  background-color: #2d434c;
  overflow: hidden;

  .el-form {
    width: 400px;
    background-color: #fff;
    margin: 200px auto;
    padding: 75px 40px 15px 40px;
    border-radius: 20px;
    position: relative;

    img {
      width: 110px;
      height: 110px;
      position: absolute;
      left: 50%;
      top: -80px;
      transform: translate(-50%);
      border-radius: 50%;
      border: 10px solid #fff;
    }

    .el-button + .el-button {
      margin-left: 80px;
    }
  }
}
</style>
