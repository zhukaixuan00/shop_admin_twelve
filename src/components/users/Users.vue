<template>
  <div class="users">
    <!-- el-breadcrumb: 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 搜索框与添加框 -->
    <el-input placeholder="请输入内容" v-model="query" class="input-with-select">
      <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
    </el-input>
    <el-button type="success" plain @click="showAddDialog">添加用户</el-button>
    <!-- el-table: 表格组件 -->
    <el-table
      border
      :data="userList"
      style="width: 100%">
      <el-table-column
        prop="username"
        label="姓名"
        width="200">
      </el-table-column>
      <el-table-column
        prop="email"
        label="邮箱"
        width="200">
      </el-table-column>
      <el-table-column
        prop="mobile"
        label="电话"
        width="200">
      </el-table-column>
      <el-table-column
        prop="mg_state"
        label="用户状态"
        width="200">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.mg_state"
            active-color="#13ce66"
            inactive-color="#ff4949"
            @change="changeState(scope.row)">
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column
        prop=""
        label="操作">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" plain icon="el-icon-edit" @click="showEditDialog(scope.row)"></el-button>
          <el-button type="danger" size="mini" plain icon="el-icon-delete" @click="deleteUser(scope.row)"></el-button>
          <el-button type="success" size="mini" plain icon="el-icon-check" @click="showAssignDialog(scope.row)">分配角色</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- el-pagination: 分页组件 -->
    <el-pagination
      background
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      :page-size="pageSize"
      :page-sizes="[2, 4, 6, 8]"
      :current-page="current"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
      >
    </el-pagination>

    <!-- 增加用户的对话框 el-dialog: 对话框组件 -->
    <el-dialog
      title="增加用户"
      :visible.sync="addDialogVisible"
      width="40%">
      <el-form
      ref="addForm"
      :model="addForm"
      label-width="70px"
      :rules="addRules">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑用户的对话框 el-dialog: 对话框组件 -->
    <el-dialog
      title="编辑用户"
      :visible.sync="editDialogVisible"
      width="40%">
      <el-form
      ref="editForm"
      :model="editForm"
      label-width="70px"
      :rules="addRules">
        <el-form-item label="用户名" prop="username">
          <el-tag type="info" v-model="editForm.username">{{editForm.username}}</el-tag>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUser">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 分配角色的对话框 -->
    <el-dialog
      title="分配角色"
      :visible.sync="assignDialogVisible"
      width="40%">
      <el-form :model="assignForm" label-width="80px">
        <el-form-item label="用户名">
          <el-tag type="info">{{assignForm.username}}</el-tag>
        </el-form-item>
        <el-form-item label="角色列表">
          <el-select v-model="assignForm.rid" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.id"
              :label="item.roleName"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="assignDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="assignRole">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>

export default {
  data () {
    return {
      query: '', // 关键字
      current: 1, // 当前页
      pageSize: 2, // 每一页的条数
      total: 0, // 数据总的条数
      addDialogVisible: false, // 添加对话框-默认不显示
      addForm: { // 添加用户的表单数据
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      editDialogVisible: false, // 编辑对话框-默认不显示
      editForm: { // 编辑用户的表单
        username: '',
        email: '',
        mobile: '',
        id: ''
      },
      assignDialogVisible: false, // 分配角色对话框-默认不显示
      assignForm: {
        username: '',
        rid: '',
        id: ''
      },
      options: [],
      addRules: { // 增加用户的校验规则
        username: [
          { required: true, message: '请输入用户名称', trigger: 'blur' },
          { min: 3, max: 6, message: '长度在 3 到 6 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 12, message: '长度在 6 到 12 个字符', trigger: 'blur' }
        ],
        email: [
          // { required: true, message: '请输入邮箱', trigger: 'blur' },
          { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { pattern: /^1\d{10}$/, message: '请输入正确的手机格式', trigger: 'blur' }
        ]
      },
      userList: [] // 用户的数据
    }
  },
  methods: {
    // 获取用户列表数据
    async getUserList () {
      const res = await this.axios({
        method: 'get',
        url: 'users',
        params: {
          query: this.query,
          pagenum: this.current,
          pagesize: this.pageSize
        }
      })
      const {meta, data} = res.data
      if (meta.status === 200) {
        this.userList = data.users
        this.total = data.total
      }
      // const meta = res.data.meta
      // const data = res.data.data
      // const {meta: {status}, data: {users, total}} = res.data
      // if (status === 200) {
      //   this.userList = users
      //   this.total = total
      // }
    },
    // 分页-当前页发生改变的事件
    handleCurrentChange (val) {
      this.current = val
      this.getUserList()
    },
    // 分页-每一页显示条数发生改变的事件
    handleSizeChange (val) {
      this.pageSize = val
      this.current = 1
      this.getUserList()
    },
    // 搜索功能的实现
    search () {
      this.current = 1
      this.getUserList()
    },
    // 启用/禁用功能
    async changeState (user) {
      const res = await this.axios.put(`users/${user.id}/state/${user.mg_state}`)
      const {meta: {status}} = res.data
      if (status === 200) {
        this.$message.success('修改用户状态成功')
      } else {
        this.$message.error('修改用户状态失败')
      }
    },
    // 删除用户的功能
    async deleteUser (user) {
      try {
        await this.$confirm('你确定要删除这个用户吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        const res = await this.axios.delete(`users/${user.id}`)
        const {status} = res.data.meta
        if (status === 200) {
          if (this.userList.length === 1) this.current--
          this.getUserList()
          this.$message.success('删除成功!')
        }
      } catch (e) {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      }
    },
    // 显示添加用户信息的模态框
    showAddDialog () {
      this.addDialogVisible = true
    },
    // 添加用户的方法
    addUser () {
      this.$refs.addForm.validate(async vaild => {
        if (vaild) {
          const res = await this.axios.post('users', this.addForm)
          if (res.data.meta.status === 201) {
            // 关闭模态框
            this.addDialogVisible = false
            // 重置模态框
            this.$refs.addForm.resetFields()
            // 重新渲染
            this.total++
            this.current = Math.ceil(this.total / this.pageSize)
            this.getUserList()
            // 成功提示
            this.$message.success('添加用户成功了!')
          } else {
            this.$message.error(res.data.meta.msg)
          }
        } else {
          return false
        }
      })
    },
    // 显示编辑用户信息的模态框
    showEditDialog (user) {
      this.editDialogVisible = true
      this.editForm.username = user.username
      this.editForm.email = user.email
      this.editForm.mobile = user.mobile
      this.editForm.id = user.id
    },
    // 编辑用户的功能
    editUser () {
      this.$refs.editForm.validate(async valid => {
        if (valid) {
          const res = await this.axios.put(`users/${this.editForm.id}`, this.editForm)
          if (res.data.meta.status === 200) {
            this.editDialogVisible = false
            this.$refs.editForm.resetFields()
            this.getUserList()
            this.$message.success('用户编辑成功!')
          }
        } else {
          return false
        }
      })
    },
    // 显示分配角色的对话框
    async showAssignDialog (user) {
      this.assignDialogVisible = true
      this.assignForm.username = user.username
      this.assignForm.id = user.id
      // 回显角色id
      const res2 = await this.axios.get(`users/${user.id}`)
      if (res2.data.meta.status === 200) {
        const rid = res2.data.data.rid === -1 ? '' : res2.data.data.rid
        this.assignForm.rid = rid
      }
      const res = await this.axios.get('roles')
      const {meta, data} = res.data
      if (meta.status === 200) {
        this.options = data
      }
    },
    // 分配用户角色的功能
    async assignRole () {
      if (!this.assignForm.rid) {
        this.$message.error('请选择一个角色')
        return
      }
      const res = await this.axios.put(`users/${this.assignForm.id}/role`, {
        rid: this.assignForm.rid
      })
      if (res.data.meta.status === 200) {
        this.assignDialogVisible = false
        this.getUserList()
        this.$message.success('分配用户角色成功')
      }
    }
  },
  created () {
    this.getUserList()
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
.input-with-select {
  width: 300px;
  margin: 10px 0;
}
</style>
