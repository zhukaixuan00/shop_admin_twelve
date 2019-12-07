<template>
  <div class="goods">
    <!-- 面包屑导航 -->
    <el-breadcrumb class="mb_10" separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 搜索框与添加框 -->
    <el-button type="success" plain @click="$router.push('/goods/add')">添加用户</el-button>
    <!-- 表格 -->
    <el-table :data="goodList" style="width: 100%">
      <el-table-column type="index" :index="indexMethod"></el-table-column>
      <el-table-column label="商品名称" prop="goods_name"></el-table-column>
      <el-table-column label="商品价格" prop="goods_price"></el-table-column>
      <el-table-column label="商品重量" prop="goods_weight"></el-table-column>
      <el-table-column label="商品时间" prop="add_time">
        <template slot-scope="scope">
          {{scope.row.add_time | dateFilter}}
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" plain icon="el-icon-edit"></el-button>
          <el-button type="danger" size="mini" plain icon="el-icon-delete"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- el-pagination: 分页组件 -->
    <el-pagination
      background
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      :page-size="pageSize"
      :page-sizes="[10, 20, 30, 40]"
      :current-page="current"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
      >
    </el-pagination>
  </div>
</template>

<script>
export default {
  data () {
    return {
      query: '', // 搜索关键字
      current: 1, // 当前页
      pageSize: 10, // 每页的条数
      total: 0, // 总条数
      goodList: [],
      p: ''
    }
  },
  methods: {
    async getGoodList () {
      const res = await this.axios.get('goods', {
        params: {
          query: this.query,
          pagenum: this.current,
          pagesize: this.pageSize
        }
      })
      const {meta, data} = res.data
      if (meta.status === 200) {
        this.goodList = data.goods
        this.total = data.total
      }
    },
    // 分页-当前页发生改变的事件
    handleCurrentChange (val) {
      this.current = val
      this.getGoodList()
    },
    // 分页-每一页显示条数发生改变的事件
    handleSizeChange (val) {
      this.pageSize = val
      this.current = 1
      this.getGoodList()
    },
    // 提供索引的方法
    indexMethod (index) {
      return (this.current - 1) * this.pageSize + index + 1
    }
  },
  created () {
    this.getGoodList()
  }
}
</script>

<style>
.el-breadcrumb {
  background-color: #eee;
  height: 30px;
  line-height: 30px;
  padding-left: 10px;
}
.mb_10 {
  margin-bottom: 10px;
}
</style>
