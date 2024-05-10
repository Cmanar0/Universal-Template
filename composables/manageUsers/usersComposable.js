import { manageUsers } from '@/stores/store'

export function usersComposable() {
  const usersStore = manageUsers()
  const users = usersStore.users
  const addUserToStoreCOMP = user => {
    usersStore.addUser(user)
  }

  const editUserInStoreCOMP = (id, updates) => {
    usersStore.editUser(id, updates)
  }

  const deleteUserFromStoreCOMP = id => {
    usersStore.deleteUser(id)
  }

  return {
    users,
    addUserToStoreCOMP,
    editUserInStoreCOMP,
    deleteUserFromStoreCOMP
  }
}
