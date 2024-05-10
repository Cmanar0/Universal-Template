import { defineStore } from 'pinia'
import type { User } from '@/types/user'

export const manageUsers = defineStore({
  id: 'users',
  state: () => {
    return {
      users: [
        {
          id: 1,
          username: 'Marek Sommer',
          email: 'marek.test@gmail.com',
          password: 'qwefqwef'
        },
        {
          id: 2,
          username: 'Petra Nováková',
          email: 'petra.test@email.cz',
          password: 'asdffasdf'
        },
        {
          id: 3,
          username: 'Karel Dobrovský',
          email: 'karel.test@centrum.cz',
          password: 'asdfasdf'
        }
      ]
    }
  },
  actions: {
    addUser(user: User) {
      this.users.push(user)
    },
    deleteUser(id: number) {
      const index = this.users.findIndex(user => user.id === id)
      this.users.splice(index, 1)
    },
    editUser(id: number, updates: Partial<User>) {
      const index = this.users.findIndex(user => user.id === id)
      if (index !== -1) {
        this.users[index] = { ...this.users[index], ...updates }
      }
    }
  },
  getters: {
    getUserById: state => (id: number) => {
      return state.users.find(user => user.id === id)
    }
  }
})
