<template>
  <div class="categories">
    <!-- 面包屑 -->
    <el-breadcrumb class="mb_10" separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>分类列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-button type="success" plain @click="showAddDialog">添加分类</el-button>
    <!-- 表格 -->
    <el-table :data="catList" style="width: 100%" v-loading="loading">
      <el-table-tree-column
        prop="cat_name"
        label="分类名称"
        tree-key="cat_id"
        level-key="cat_level"
        parent-key="cat_pid"
        child-key="children"
        :index-size="40"></el-table-tree-column>
      <el-table-column prop="cat_deleted" label="是否有效">
        <template slot-scope="scope">
          <span v-if="scope.row.cat_deleted">无效</span>
          <span v-else>有效</span>
        </template>
      </el-table-column>
      <el-table-column prop="cat_level" label="排序"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" plain icon="el-icon-edit" @click="showEditDialog(scope.row)"></el-button>
          <el-button type="danger" size="mini" plain icon="el-icon-delete" @click="deleteCat(scope.row.cat_id)"></el-button>
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
    <!-- 添加分类对话框 -->
    <el-dialog
      title="添加分类"
      :visible.sync="addDialogVisible"
      width="40%">
      <el-form
        ref="addForm"
        :model="addForm"
        label-width="80px"
        :rules="addRules">
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="addForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级名称" prop="cat_pid">
          <el-cascader
            clearable
            :options="options"
            :props="props"
            change-on-select
            v-model="addForm.cat_pid"
          ></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCat">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改商品分类 -->
    <el-dialog
      title="添加分类"
      :visible.sync="editDialogVisible"
      width="40%">
      <el-form
        ref="editForm"
        :model="editForm"
        label-width="80px"
        :rules="addRules">
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="editForm.cat_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editCat">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
// import Vue from 'vue'
// 导入树形网格组件
import ElTreeGrid from 'element-tree-grid'
// 注册成一个组件
// Vue.component(ElTreeGrid.name, ElTreeGrid)

export default {
  data () {
    return {
      current: 1, // 当前页
      pageSize: 10, // 每页的条数
      total: 0, // 总条数
      loading: true, // 加载状态
      addDialogVisible: false, // 添加分类对话框-默认不显示
      addForm: {
        cat_name: '',
        cat_pid: []
      },
      addRules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' }
        ]
      },
      options: [],
      props: { // 级联组件的配置项
        label: 'cat_name',
        value: 'cat_id',
        children: 'children'
      },
      editDialogVisible: false, // 修改商品分类对话框-默认不显示
      editForm: {
        cat_name: '',
        id: ''
      },
      catList: []
    }
  },
  methods: {
    // 获取分类数据
    async getCatList () {
      const res = await this.axios.get('categories', {
        params: {
          type: 3,
          pagenum: this.current,
          pagesize: this.pageSize
        }
      })
      const {meta, data} = res.data
      if (meta.status === 200) {
        this.catList = data.result
        this.total = data.total
        this.loading = false
      }
    },
    // 处理当前页发生改变
    handleCurrentChange (val) {
      this.loading = true
      this.current = val
      this.getCatList()
    },
    // 处理每页条数发生改变
    handleSizeChange (val) {
      this.loading = true
      this.pageSize = val
      this.current = 1
      this.getCatList()
    },
    // 显示添加分类对话框
    async showAddDialog () {
      this.addDialogVisible = true
      const res = await this.axios.get('categories?type=2')
      const {meta, data} = res.data
      if (meta.status === 200) {
        this.options = data
      }
    },
    // 添加分类
    addCat () {
      this.$refs.addForm.validate(async valid => {
        if (valid) {
          const {cat_name: catName, cat_pid: catPid} = this.addForm
          const res = await this.axios.post('categories', {
            cat_pid: catPid[catPid.length - 1] || 0,
            cat_name: catName,
            cat_level: catPid.length
          })
          const {meta} = res.data
          if (meta.status === 201) {
            this.addDialogVisible = false
            this.$refs.addForm.resetFields()
            this.getCatList()
            this.$message.success('添加分类成功了')
          }
        } else {
          return false
        }
      })
    },
    // 删除分类
    async deleteCat (id) {
      try {
        await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        const res = await this.axios.delete(`categories/${id}`)
        const {meta} = res.data
        if (meta.status === 200) {
          this.getCatList()
          this.$message.success('删除成功')
        }
      } catch (e) {
        this.$message.info('取消删除')
      }
    },
    showEditDialog (cat) {
      this.editDialogVisible = true
      this.editForm.id = cat.cat_id
      this.editForm.cat_name = cat.cat_name
    },
    editCat () {
      this.$refs.editForm.validate(async valid => {
        if (!valid) {
          return false
        }
        const res = await this.axios.put(`categories/${this.editForm.id}`, this.editForm)
        const {meta} = res.data
        if (meta.status === 200) {
          this.editDialogVisible = false
          this.$refs.editForm.resetFields()
          this.getCatList()
          this.$message.success('修改成功')
        }
      })
    }
  },
  created () {
    this.getCatList()
  },
  components: {
    [ElTreeGrid.name]: ElTreeGrid
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
