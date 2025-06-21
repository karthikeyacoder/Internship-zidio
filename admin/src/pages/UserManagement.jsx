import React, { useState, useEffect } from 'react'
import { Search, Edit, Trash2, Plus, Eye, Filter, Download, MoreVertical, UserCheck, UserX } from 'lucide-react'
import { adminAPI } from '../services/adminAPI.jsx'
import toast from 'react-hot-toast'

const UserManagement = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [selectedUsers, setSelectedUsers] = useState([])
  const [filters, setFilters] = useState({
    role: '',
    status: '',
    sortBy: 'createdAt',
    sortOrder: 'desc'
  })
  const [showFilters, setShowFilters] = useState(false)
  const [editingUser, setEditingUser] = useState(null)
  const [showEditModal, setShowEditModal] = useState(false)
  const [actionLoading, setActionLoading] = useState({})

  useEffect(() => {
    loadUsers()
  }, [currentPage, searchTerm, filters])

  const loadUsers = async () => {
    try {
      setLoading(true)
      const result = await adminAPI.getUsers(currentPage, 10, searchTerm, filters)
      setUsers(result.users || [])
      setTotalPages(Math.ceil((result.pagination?.total || 0) / 10))
    } catch (error) {
      console.error('Failed to load users:', error)
      toast.error('Failed to load users')
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e) => {
    setSearchTerm(e.target.value)
    setCurrentPage(1)
  }

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }))
    setCurrentPage(1)
  }

  const handleSelectUser = (userId) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    )
  }

  const handleSelectAll = () => {
    if (selectedUsers.length === users.length) {
      setSelectedUsers([])
    } else {
      setSelectedUsers(users.map(user => user._id))
    }
  }

  const handleEditUser = (user) => {
    setEditingUser({
      ...user,
      originalEmail: user.email
    })
    setShowEditModal(true)
  }

  const handleUpdateUser = async (userData) => {
    try {
      setActionLoading(prev => ({ ...prev, [userData._id]: true }))
      await adminAPI.updateUser(userData._id, {
        name: userData.name,
        email: userData.email,
        role: userData.role,
        isActive: userData.isActive
      })
      toast.success('User updated successfully')
      setShowEditModal(false)
      setEditingUser(null)
      loadUsers()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update user')
    } finally {
      setActionLoading(prev => ({ ...prev, [userData._id]: false }))
    }
  }

  const handleDeleteUser = async (userId, userName) => {
    if (!confirm(`Are you sure you want to delete user "${userName}"?`)) return

    try {
      setActionLoading(prev => ({ ...prev, [userId]: true }))
      await adminAPI.deleteUser(userId)
      toast.success('User deleted successfully')
      loadUsers()
      setSelectedUsers(prev => prev.filter(id => id !== userId))
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete user')
    } finally {
      setActionLoading(prev => ({ ...prev, [userId]: false }))
    }
  }

  const handleBulkDelete = async () => {
    if (selectedUsers.length === 0) return
    if (!confirm(`Are you sure you want to delete ${selectedUsers.length} users?`)) return

    try {
      setLoading(true)
      await adminAPI.bulkDelete('users', selectedUsers)
      toast.success(`${selectedUsers.length} users deleted successfully`)
      setSelectedUsers([])
      loadUsers()
    } catch (error) {
      toast.error('Failed to delete users')
    }
  }

  const handleToggleUserStatus = async (userId, currentStatus) => {
    try {
      setActionLoading(prev => ({ ...prev, [userId]: true }))
      await adminAPI.updateUser(userId, { isActive: !currentStatus })
      toast.success(`User ${!currentStatus ? 'activated' : 'deactivated'} successfully`)
      loadUsers()
    } catch (error) {
      toast.error('Failed to update user status')
    } finally {
      setActionLoading(prev => ({ ...prev, [userId]: false }))
    }
  }

  const exportUsers = () => {
    const csvContent = [
      ['Name', 'Email', 'Role', 'Status', 'Uploads', 'Charts', 'Created', 'Last Login'],
      ...users.map(user => [
        user.name,
        user.email,
        user.role,
        user.isActive ? 'Active' : 'Inactive',
        user.stats?.totalUploads || 0,
        user.stats?.totalCharts || 0,
        new Date(user.createdAt).toLocaleDateString(),
        user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Never'
      ])
    ].map(row => row.join(',')).join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `users-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getStatusColor = (isActive) => {
    return isActive 
      ? 'bg-green-100 text-green-800' 
      : 'bg-red-100 text-red-800'
  }

  const getRoleColor = (role) => {
    return role === 'admin' 
      ? 'bg-purple-100 text-purple-800' 
      : 'bg-gray-100 text-gray-800'
  }

  if (loading && users.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-gray-200 border-t-brown rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-600">Manage user accounts and permissions</p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={exportUsers}
            className="btn-secondary flex items-center space-x-2"
          >
            <Download size={16} />
            <span>Export</span>
          </button>
          <button className="btn-primary flex items-center space-x-2">
            <Plus size={16} />
            <span>Add User</span>
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="card p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search users by name or email..."
              value={searchTerm}
              onChange={handleSearch}
              className="input-field pl-10"
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`btn-secondary flex items-center space-x-2 ${showFilters ? 'bg-brown text-white' : ''}`}
            >
              <Filter size={16} />
              <span>Filters</span>
            </button>
            
            {selectedUsers.length > 0 && (
              <button
                onClick={handleBulkDelete}
                className="btn-danger flex items-center space-x-2"
              >
                <Trash2 size={16} />
                <span>Delete Selected ({selectedUsers.length})</span>
              </button>
            )}
          </div>
        </div>

        {/* Advanced Filters */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <select
                  value={filters.role}
                  onChange={(e) => handleFilterChange('role', e.target.value)}
                  className="input-field"
                >
                  <option value="">All Roles</option>
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={filters.status}
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                  className="input-field"
                >
                  <option value="">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
                <select
                  value={filters.sortBy}
                  onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                  className="input-field"
                >
                  <option value="createdAt">Created Date</option>
                  <option value="name">Name</option>
                  <option value="email">Email</option>
                  <option value="lastLogin">Last Login</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Order</label>
                <select
                  value={filters.sortOrder}
                  onChange={(e) => handleFilterChange('sortOrder', e.target.value)}
                  className="input-field"
                >
                  <option value="desc">Descending</option>
                  <option value="asc">Ascending</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Users Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedUsers.length === users.length && users.length > 0}
                    onChange={handleSelectAll}
                    className="h-4 w-4 text-brown focus:ring-brown border-gray-300 rounded"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Activity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Joined
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Login
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user._id} className="table-row">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={selectedUsers.includes(user._id)}
                      onChange={() => handleSelectUser(user._id)}
                      className="h-4 w-4 text-brown focus:ring-brown border-gray-300 rounded"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="bg-brown/10 p-2 rounded-full mr-3">
                        <span className="text-brown font-medium text-sm">
                          {user.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {user.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {user.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full ${getRoleColor(user.role)}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(user.isActive)}`}>
                      {user.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex space-x-4">
                      <span>{user.stats?.totalUploads || 0} uploads</span>
                      <span>{user.stats?.totalCharts || 0} charts</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(user.createdAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.lastLogin ? formatDate(user.lastLogin) : 'Never'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleEditUser(user)}
                        className="text-brown hover:text-brown-dark"
                        title="Edit user"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleToggleUserStatus(user._id, user.isActive)}
                        disabled={actionLoading[user._id]}
                        className={`${user.isActive ? 'text-red-600 hover:text-red-900' : 'text-green-600 hover:text-green-900'}`}
                        title={user.isActive ? 'Deactivate user' : 'Activate user'}
                      >
                        {actionLoading[user._id] ? (
                          <div className="w-4 h-4 border-2 border-gray-300 border-t-brown rounded-full animate-spin"></div>
                        ) : user.isActive ? (
                          <UserX size={16} />
                        ) : (
                          <UserCheck size={16} />
                        )}
                      </button>
                      <button
                        onClick={() => handleDeleteUser(user._id, user.name)}
                        disabled={actionLoading[user._id]}
                        className="text-red-600 hover:text-red-900"
                        title="Delete user"
                      >
                        {actionLoading[user._id] ? (
                          <div className="w-4 h-4 border-2 border-gray-300 border-t-red-600 rounded-full animate-spin"></div>
                        ) : (
                          <Trash2 size={16} />
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Showing page {currentPage} of {totalPages}
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1 || loading}
                  className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages || loading}
                  className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Edit User Modal */}
      {showEditModal && editingUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Edit User</h3>
            <form
              onSubmit={(e) => {
                e.preventDefault()
                handleUpdateUser(editingUser)
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  value={editingUser.name}
                  onChange={(e) => setEditingUser(prev => ({ ...prev, name: e.target.value }))}
                  className="input-field"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={editingUser.email}
                  onChange={(e) => setEditingUser(prev => ({ ...prev, email: e.target.value }))}
                  className="input-field"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <select
                  value={editingUser.role}
                  onChange={(e) => setEditingUser(prev => ({ ...prev, role: e.target.value }))}
                  className="input-field"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={editingUser.isActive}
                  onChange={(e) => setEditingUser(prev => ({ ...prev, isActive: e.target.checked }))}
                  className="h-4 w-4 text-brown focus:ring-brown border-gray-300 rounded"
                />
                <label htmlFor="isActive" className="ml-2 text-sm text-gray-700">
                  Active user
                </label>
              </div>
              
              <div className="flex justify-end space-x-2 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false)
                    setEditingUser(null)
                  }}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading[editingUser._id]}
                  className="btn-primary disabled:opacity-50"
                >
                  {actionLoading[editingUser._id] ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default UserManagement