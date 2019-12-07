<template>
  <div class="home">
    <el-container>
      <el-header>
        <div class="logo"></div>
        <div class="logout">
          欢迎光临
          <a href="javascript:;" @click="logout">退出</a>
        </div>
        <div class="title">
          <h3>电商后台管理系统</h3>
        </div>
      </el-header>
    <el-container>
      <el-aside width="200px">
        <!-- 导航菜单组件 -->
        <el-menu
          unique-opened
          router
          :default-active="'/' + $route.path.split('/')[1]"
          class="el-menu-vertical-demo"
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#ffd04b">
          <el-submenu :index="'/' + level1.path" v-for="level1 in menuList" :key="level1.id">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>{{level1.authName}}</span>
            </template>
            <el-menu-item :index="'/' + level2.path" v-for="level2 in level1.children" :key="level2.id">
              <i class="el-icon-menu"></i>
              <span slot="title">{{level2.authName}}</span>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
        <!-- 显示Home组件的子组件 -->
        <keep-alive>
          <router-view v-if="$route.meta.keepAlive"></router-view>
        </keep-alive>
        <!-- 这里是不被缓存的组件 -->
        <router-view v-if="!$route.meta.keepAlive"></router-view>
      </el-main>
    </el-container>
  </el-container>
  </div>
</template>

<script>
export default {
  data () {
    return {
      menuList: []
    }
  },
  methods: {
    async logout () {
      try {
        await this.$confirm('你确定要退出系统吗?', '温馨提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        // 删除localStorage中的myToken
        localStorage.removeItem('myToken')
        // 跳转到登陆页面
        this.$router.push('/login')
        // 退出提示
        this.$message.success('退出成功了')
      } catch (e) {
        this.$message({
          type: 'info',
          message: '退出取消了'
        })
      }
    },
    // 获取左侧菜单数据
    async getMenuList () {
      const res = await this.axios.get('menus')
      const {meta, data} = res.data
      if (meta.status === 200) {
        this.menuList = data
      }
    }
  },
  created () {
    this.getMenuList()
  }
}
</script>

<style lang='less'>
.home {
  width: 100%;
  height: 100%;

  > .el-container {
    height: 100%;
  }

  .el-header {
    background-color: #b3c1cd;

    .logo {
      float: left;
      width: 200px;
      height: 60px;
      background: transparent url(../assets/logo.png) no-repeat center center;
      background-size: 200px 60px;
    }

    .logout {
      float: right;
      width: 200px;
      height: 60px;
      line-height: 60px;
      font-size: 18px;
      font-weight: 700;
      text-align: right;
    }

    .title {
      height: 60px;
      line-height: 60px;
      color: #fff;
      text-align: center;
      font-size: 20px;
      overflow: hidden;
    }
  }

  .el-aside {
    background-color: #545c64;
    width: 200px;

    .el-submenu {
      width: 200px;
    }
  }

  .el-main {
    background-color: #fff;
  }
}
</style>
