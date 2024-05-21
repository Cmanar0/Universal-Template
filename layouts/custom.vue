<template>
  <div class="min-h-screen flex-col">
    <ModalOneBtn />
    <GlobalSpinner />

    <!-- ------------- Navbar start ------------- -->
    <div class="nav-bar">
      <header class="bg-gray-800 text-white p-5">
        <span>
          <hamburger class="ham hover:text-gray-300" @click="toggleMenu" />
        </span>
        <a
          href="#"
          class="text-white text-2xl font-semibold uppercase hover:text-gray-300"
          >Logo</a
        >
        <!-- ------------- User Dropdown Menu start ------------- -->
        <div>
          <div class="relative inline-block">
            <div
              class="flex items-center gap-x-2 cursor-pointer"
              @click="toggleDropdown"
            >
              Marián Adamus
              <img
                :class="{
                  'rotate-180': isOpen,
                  'rotate-0': !isOpen,
                  'transition-transform duration-300': true
                }"
                class="icon"
                src="../assets/svg/down.svg"
                alt="dropdown"
              />
            </div>

            <ul
              v-if="isOpen"
              class="absolute right-0 w-48 py-2 mt-2 bg-white rounded-lg shadow-xl z-20"
            >
              <li>
                <a
                  href="/account"
                  class="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                  >Account</a
                >
              </li>
              <li>
                <a
                  @click="logout"
                  class="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                  >Logout</a
                >
              </li>
            </ul>
          </div>
          <div
            v-if="isOpen"
            class="fixed inset-0 bg-transparent z-10"
            @click="closeDropdown"
          ></div>
        </div>
        <!-- ------------- User Dropdown Menu end ------------- -->
      </header>
    </div>
    <!-- ------------- Navbar end ------------- -->
    <div class="flex">
      <!-- ------------- Sidebar start ------------- -->
      <div
        :class="{
          menuClosed: !mennuOpen,
          'menu-mobile-closed': !mennuOpen && isMobile,
          'menu-mobile-open': mennuOpen && isMobile
        }"
        class="menu h-screen-minus-80 space-y-6 py-2 px-2 bg-gray-800 text-white flex flex-col"
      >
        <nav>
          <a
            v-if="(mennuOpen && isMobile) || !isMobile"
            href="/users"
            class="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700 hover:text-white"
          >
            <users class="icon" />
            <span class="menu-item" :class="{ 'menu-item-hide': !mennuOpen }">
              Users
            </span>
          </a>
        </nav>
      </div>
      <!-- ------------- Sidebar end ------------- -->
      <!-- ------------- Main content start ------------- -->
      <main
        class="p-5"
        :class="{
          'main-margin-desktop-menu-closed': !mennuOpen && !isMobile,
          'main-margin-desktop-menu-open': mennuOpen && !isMobile,
          'main-margin-mobile-menu-closed': !mennuOpen && isMobile
        }"
      >
        <NuxtPage />
      </main>
      <!-- ------------- Main content end ------------- -->
    </div>
  </div>
</template>

<script setup>
import hamburger from '../assets/svg/hamburger.vue'
import users from '../assets/svg/users.vue'
import ModalOneBtn from '../components/reusable/ModalOneBtn.vue'
import GlobalSpinner from '../components/reusable/GlobalSpinner.vue'
import Cookies from 'js-cookie'
import { onMounted, onUnmounted, ref, computed } from 'vue'
import { useRouter } from 'vue-router'
// Variables:
const router = useRouter()
const windowWidth = ref(0)
// ------------- User Dropdown Menu start ------------- :
const logout = () => {
  Cookies.remove('bv_jwt')
  router.push('/')
}
const isOpen = ref(false)

const toggleDropdown = () => {
  isOpen.value = !isOpen.value
}
const closeDropdown = () => {
  isOpen.value = false
}
// ------------- User Dropdown Menu end -------------
// ------------- toggle menu on mobile start ------------- :
const mennuOpen = ref(false)

const toggleMenu = () => {
  mennuOpen.value = !mennuOpen.value
}
// ------------- toggle menu on mobile end -------------
// ------------- update window width start ------------- :
const updateWidth = () => {
  windowWidth.value = window.innerWidth
}
const isMobile = computed(() => {
  return windowWidth.value < 768
})
// ------------- update window width end -------------
onMounted(() => {
  window.addEventListener('resize', updateWidth)
  updateWidth()
})

onUnmounted(() => {
  window.removeEventListener('resize', updateWidth)
})
</script>

<style scoped>
/* -------------- Navbar start -------------- */
.nav-bar header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 100%;
}
.h-screen-minus-80 {
  position: fixed;
  top: 80px;
  height: calc(100vh - 80px);
}

.nav-bar {
  height: 80px;
  position: fixed;
  width: 100%;
  max-width: 100vw;
  top: 0;
  z-index: 1000;
  background-color: #fff;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.5);
}
/* -------------- Navbar end -------------- */
/* -------------- Main content start -------------- */
main {
  margin-top: 80px;
  width: 100%;
  overflow-x: hidden;
}
.main-margin-mobile-menu-closed {
  margin-left: 0px;
  transition: margin-left 0.5s;
}
.main-margin-desktop-menu-closed {
  margin-left: 70px;
  transition: margin-left 0.5s;
}
.main-margin-desktop-menu-open {
  margin-left: 260px;
  transition: margin-left 0.5s;
}
/* -------------- Main content end -------------- */
/* -------------- Sidebar start -------------- */
.menu {
  width: 260px;
  transition: width 0.5s;
}
.menuClosed {
  width: 70px;
  transition: width 0.5s;
}
.menu-mobile-closed {
  width: 0;
  padding: 0;
  transition: width 0.5s;
}
.menu-mobile-open {
  width: 100%;
  padding: 15px;
  transition: width 0.5s;
}
.menu a {
  display: flex;
  align-items: center;

  min-height: 44px;
}

.ham {
  cursor: pointer;
  width: 1.5rem;
  height: 1.5rem;
  fill: #fff;
  margin-left: 2px;
}
.ham:hover {
  fill: #ccc;
}
.icon {
  min-width: 1.1em;
  min-height: 1em;
  cursor: pointer;
  display: flex;
}
.menu-item {
  margin-left: 8px;
  transition: opacity 0.5s;
  opacity: 1;
}
.menu-item-hide {
  transition: opacity 0.5s;
  opacity: 0;
}
/* -------------- Sidebar end -------------- */
</style>
