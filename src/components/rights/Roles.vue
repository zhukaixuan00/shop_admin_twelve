<template>
  <div class="roles">
    <!-- 面包屑 -->
    <el-breadcrumb class="mb_10" separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 添加按钮 -->
    <el-button type="success" plain @click="showAddDialog">添加角色</el-button>
    <!-- 表格 -->
    <el-table :data="roleList" style="width: 100%">
      <el-table-column type="expand">
        <template slot-scope="scope">
          <!-- 一级权限 -->
          <el-row v-if="scope.row.children.length === 0">
            <span>该角色没有任何权限</span>
          </el-row>
          <el-row class="level1 mb_10" v-for="level1 in scope.row.children" :key="level1.id">
            <el-col :span="4">
              <el-tag closable @close="deleteRight(scope.row, level1.id)">{{level1.authName}}</el-tag>
              <i class="el-icon-arrow-right"></i>
            </el-col>
            <el-col :span="20">
              <!-- 二级权限 -->
              <el-row v-for="level2 in level1.children" :key="level2.id">
                <el-col :span="4">
                  <el-tag closable type="success" @close="deleteRight(scope.row, level2.id)">{{level2.authName}}</el-tag>
                  <i class="el-icon-arrow-right"></i>
                </el-col>
                <el-col :span="20">
                  <span class="level3" v-for="level3 in level2.children" :key="level3.id">
                    <el-tag closable type="warning" @close="deleteRight(scope.row, level3.id)">{{level3.authName}}</el-tag>
                  </span>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </template>
      </el-table-column>
      <el-table-column type="index"></el-table-column>
      <el-table-column prop="roleName" label="角色名称"></el-table-column>
      <el-table-column prop="roleDesc" label="描述"></el-table-column>
      <el-table-column label="管理">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" plain icon="el-icon-edit" @click="showEditDialog(scope.row)"></el-button>
          <el-button type="danger" size="mini" plain icon="el-icon-delete" @click="deleteRole(scope.row)"></el-button>
          <el-button type="success" size="mini" plain icon="el-icon-check" @click="showAssignRight(scope.row)">分配权限</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 添加角色对话框 -->
    <el-dialog
      title="添加角色"
      :visible.sync="addDialogVisible"
      width="40%">
      <el-form
      ref="addForm"
      :model="addForm"
      label-width="80px"
      :rules="addRules">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="addForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRole">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑角色对话框 -->
    <el-dialog
      title="编辑角色"
      :visible.sync="editDialogVisible"
      width="40%">
      <el-form
      ref="editForm"
      :model="editForm"
      label-width="80px"
      :rules="addRules">
        <el-form-item label="角色名称" prop="roleName">
          <el-input type="info" v-model="editForm.roleName">{{editForm.roleName}}</el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="editForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editRole">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 分配角色对话框 -->
    <el-dialog
      title="分配权限"
      :visible.sync="assignDialogVisible"
      width="40%">
      <el-tree
        :data="rightList"
        show-checkbox
        default-expand-all
        node-key="id"
        ref="tree"
        highlight-current
        :props="defaultProps"></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="assignRight">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      addDialogVisible: false, // 添加角色对话框-默认不显示
      addForm: { // 添加的数据
        roleName: '',
        roleDesc: ''
      },
      addRules: { // 添加的规则
        roleName: [
          { required: true, message: '角色名称不能为空', trigger: 'blur' }
        ]
      },
      editDialogVisible: false, // 编辑角色对话框-默认不显示
      editForm: { // 编辑的数据
        roleName: '',
        roleDesc: '',
        id: ''
      },
      assignDialogVisible: false, // 分配角色对话框-默认不显示
      rightList: [], // 所有的权限数据(tree)
      defaultProps: {
        children: 'children',
        label: 'authName'
      },
      assignRoleId: '', // 需要分配权限的角色id
      roleList: [] // 角色列表
    }
  },
  methods: {
    // 获取所有的角色列表
    async getRoleList () {
      const res = await this.axios.get('roles')
      const {meta, data} = res.data
      if (meta.status === 200) {
        this.roleList = data
      }
    },
    // 删除角色
    async deleteRole (role) {
      try {
        await this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        const res = await this.axios.delete(`roles/${role.id}`)
        const {meta} = res.data
        if (meta.status === 200) {
          this.getRoleList()
          this.$message.success('删除成功')
        }
      } catch (e) {
        this.$message.error('取消删除')
      }
    },
    // 显示添加对话框
    showAddDialog () {
      this.addDialogVisible = true
    },
    // 添加角色
    addRole () {
      this.$refs.addForm.validate(async valid => {
        if (valid) {
          const res = await this.axios.post('roles', this.addForm)
          const {meta} = res.data
          if (meta.status === 201) {
            this.addDialogVisible = false
            this.$refs.addForm.resetFields()
            this.getRoleList()
            this.$message.success('添加成功')
          }
        } else {
          return false
        }
      })
    },
    // 显示编辑对话框
    showEditDialog (role) {
      this.editDialogVisible = true
      this.editForm.roleName = role.roleName
      this.editForm.roleDesc = role.roleDesc
      this.editForm.id = role.id
    },
    // 编辑角色的功能
    editRole () {
      this.$refs.editForm.validate(async valid => {
        if (valid) {
          const res = await this.axios.put(`roles/${this.editForm.id}`, this.editForm)
          const {meta} = res.data
          if (meta.status === 200) {
            this.editDialogVisible = false
            this.$refs.editForm.resetFields()
            this.getRoleList()
            this.$message.success('编辑角色成功')
          }
        } else {
          return false
        }
      })
    },
    // 删除权限
    async deleteRight (role, rightId) {
      try {
        await this.$confirm('此操作将永久删除该权限, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelbuttonText: '取消',
          type: 'warning'
        })
        const res = await this.axios.delete(`roles/${role.id}/rights/${rightId}`)
        const {meta, data} = res.data
        if (meta.status === 200) {
          role.children = data
          this.$message.success('删除成功了')
        }
      } catch (e) {
        this.$message.info('取消删除')
      }
    },
    // 显示分配角色对话框
    async showAssignRight (role) {
      this.assignDialogVisible = true
      this.assignRoleId = role.id
      const res = await this.axios.get('rights/tree')
      const {meta, data} = res.data
      if (meta.status === 200) {
        this.rightList = data
        // 获取当前角色下所有的三级权限-(Element-ui中当选中三级权限, 一级 二级已经做好处理)
        const checkedKeys = []
        role.children.forEach(level1 => {
          level1.children.forEach(level2 => {
            level2.children.forEach(level3 => {
              checkedKeys.push(level3.id)
            })
          })
        })
        // 设置默认选中
        this.$refs.tree.setCheckedKeys(checkedKeys)
      }
    },
    // 分配权限
    async assignRight () {
      // 获取到tree中选中的权限信息
      let checkedKeys = this.$refs.tree.getCheckedKeys()
      let halfCheckedKyes = this.$refs.tree.getHalfCheckedKeys()
      const res = await this.axios.post(`roles/${this.assignRoleId}/rights`, {
        rids: [...checkedKeys, ...halfCheckedKyes].join()
      })
      const {meta} = res.data
      if (meta.status === 200) {
        this.assignDialogVisible = false
        this.getRoleList()
        this.$message.success('权限分配成功')
      }
    }
  },
  created () {
    this.getRoleList()
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
.level3 {
  margin-right: 10px;
  display: inline-block;
  margin-bottom: 10px;
}
.level1 {
  border-bottom: 1px dotted #ccc;
}
</style>
