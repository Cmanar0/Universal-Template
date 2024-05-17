<template>
  <div class="min-h-screen flex-col">
    <ModalOneBtn />
    <GlobalSpinner />

    <!-- ------------- Navbar start ------------- -->
    <div class="nav-bar">
      <header
        class="bg-gray-800 text-white p-5 flex justify-between items-center"
      >
        <span>
          <hamburger class="ham hover:text-gray-300" @click="toggleMenu" />
        </span>
        <a
          href="#"
          class="text-white text-2xl font-semibold uppercase hover:text-gray-300"
          >Logo</a
        >
        <!-- ------------- Updated Dropdown Menu Start ------------- -->
        <div class="relative inline-block text-left">
          <div>
            <button
              @click="toggleDropdown"
              type="button"
              class="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none"
              id="options-menu"
              aria-haspopup="true"
              aria-expanded="true"
            >
              {{ userName }}
              <svg
                class="-mr-1 ml-2 h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fill-rule="evenodd"
                  d="M10 3a1 1 0 011 1v8a1 1 0 01-2 0V4a1 1 0 011-1zm-3.293 7.707a1 1 0 011.414 0L10 12.586l1.879-1.879a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                  clip-rule="evenodd"
                />
              </svg>
            </button>
          </div>
          <div
            v-if="dropdownOpen"
            class="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5"
          >
            <div class="py-1 rounded-md shadow-xs">
              <a
                href="/account"
                class="block px-4 py-2 text-sm leading-5 text-gray-700 transition duration-150 ease-in-out hover:bg-gray-100 focus:outline-none focus:bg-gray-100"
                role="menuitem"
                >Account</a
              >
              <a
                @click="logout"
                class="block px-4 py-2 text-sm leading-5 text-gray-700 transition duration-150 ease-in-out hover:bg-gray-100 focus:outline-none focus:bg-gray-100 cursor-pointer"
                role="menuitem"
                >Logout</a
              >
            </div>
          </div>
        </div>
        <!-- ------------- Updated Dropdown Menu End ------------- -->
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
            href="/"
            class="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700 hover:text-white"
          >
            <users class="icon" />
            <span class="menu-item" :class="{ 'menu-item-hide': !mennuOpen }"
              >Users</span
            >
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
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from '#imports'
import Cookies from 'js-cookie'
import hamburger from '../assets/svg/hamburger.vue'
import users from '../assets/svg/users.vue'
import ModalOneBtn from '../components/reusable/ModalOneBtn.vue'
import GlobalSpinner from '../components/reusable/GlobalSpinner.vue'
import mittBus from '../utils/mitt.js'

const userName = ref('John Doe') // Replace this with the actual user name from your state/store
const dropdownOpen = ref(false)
const toggleDropdown = () => {
  dropdownOpen.value = !dropdownOpen.value
}

const router = useRouter()

const logout = () => {
  Cookies.remove('bv_jwt')
  router.push('/')
}

const windowWidth = ref(0)
const updateWidth = () => {
  windowWidth.value = window.innerWidth
}
const isMobile = computed(() => windowWidth.value < 768)

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
