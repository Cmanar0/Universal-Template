<template>
  <div class="min-h-screen flex-col">
    <ModalOneBtn />
    <GlobalSpinner />
    <Notification class="z-index-1100" />

    <!-- Navbar start -->
    <div class="nav-bar">
      <header class="bg-gray-800 text-white p-5">
        <span>
          <hamburger class="ham hover:text-gray-300" @click="toggleMenu" />
        </span>

        <!-- User Dropdown Menu start -->
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
        <!-- User Dropdown Menu end -->
      </header>
    </div>
    <!-- Navbar end -->

    <div class="flex">
      <!-- Sidebar start -->
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
            href="/dashboard"
            class="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700 hover:text-white"
          >
            <img class="icon" src="../assets/svg/projects.svg" alt="projects" />
            <span
              v-if="(mennuOpen && isMobile) || !isMobile"
              class="menu-item"
              :class="{
                'menu-item-hide': !mennuOpen,
                'display-none-delay': !delayedMenuClosed
              }"
            >
              Projects
            </span>
          </a>
          <a
            v-if="(mennuOpen && isMobile) || !isMobile"
            href="/users"
            class="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700 hover:text-white"
          >
            <img class="icon" src="../assets/svg/users.svg" alt="users" />
            <span
              v-if="(mennuOpen && isMobile) || !isMobile"
              class="menu-item"
              :class="{
                'menu-item-hide': !mennuOpen,
                'display-none-delay': !delayedMenuClosed
              }"
            >
              Users
            </span>
          </a>
          <a
            v-if="(mennuOpen && isMobile) || !isMobile"
            href="/plans"
            class="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700 hover:text-white"
          >
            <img class="icon" src="../assets/svg/plans.svg" alt="plans" />
            <span
              v-if="(mennuOpen && isMobile) || !isMobile"
              class="menu-item"
              :class="{
                'menu-item-hide': !mennuOpen,
                'display-none-delay': !delayedMenuClosed
              }"
            >
              Plans
            </span>
          </a>
        </nav>
      </div>
      <!-- Sidebar end -->

      <!-- Main content start -->
      <main
        :class="{
          'main-margin-desktop-menu-closed': !mennuOpen && !isMobile,
          'main-margin-desktop-menu-open': mennuOpen && !isMobile,
          'main-margin-mobile-menu-closed': !mennuOpen && isMobile
        }"
      >
        <!-- <v-app>
          <NuxtLayout>
            <NuxtPage />
          </NuxtLayout>
        </v-app> -->
        <NuxtPage />
      </main>
      <!-- Main content end -->
    </div>
  </div>
</template>

<script setup>
import hamburger from '../assets/svg/hamburger.vue'
import ModalOneBtn from '../components/reusable/ModalOneBtn.vue'
import GlobalSpinner from '../components/reusable/GlobalSpinner.vue'
import Cookies from 'js-cookie'
import { onMounted, onUnmounted, ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import mittBus from '../utils/mitt.js'
import Notification from '../components/reusable/Notification.vue' // Import Notification
// Variables:
const router = useRouter()
const windowWidth = ref(0)

// User Dropdown Menu start
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
// User Dropdown Menu end

// Toggle menu on mobile start
const mennuOpen = ref(false)
const delayedMenuClosed = ref(false)
let closeMenuTimeout = null

const toggleMenu = () => {
  mennuOpen.value = !mennuOpen.value
  setTimeout(() => {
    mittBus.emit('update-charts') // Emit update-charts event
    // window.dispatchEvent(new Event('resize')) // Trigger a resize event
  }, 400) // Adjust the timeout as necessary to match your transition duration
}

// Watch for changes in mennuOpen and update delayedMenuClosed
watch(mennuOpen, newValue => {
  if (newValue) {
    delayedMenuClosed.value = true
    if (closeMenuTimeout) {
      clearTimeout(closeMenuTimeout)
      closeMenuTimeout = null
    }
  } else {
    closeMenuTimeout = setTimeout(() => {
      delayedMenuClosed.value = false
      closeMenuTimeout = null
    }, 1000)
  }
})
// Toggle menu on mobile end

// Update window width start
const updateWidth = () => {
  windowWidth.value = window.innerWidth
}
const isMobile = computed(() => {
  return windowWidth.value < 768
})
// Update window width end

onMounted(() => {
  window.addEventListener('resize', updateWidth)
  updateWidth()

  // Set delayedMenuClosed based on mennuOpen initially
  delayedMenuClosed.value = mennuOpen.value
})

onUnmounted(() => {
  window.removeEventListener('resize', updateWidth)
  if (closeMenuTimeout) {
    clearTimeout(closeMenuTimeout)
  }
})
</script>

<style scoped>
/* Navbar start */
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
/* Navbar end */
/* Main content start */
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
/* Main content end */
/* Sidebar start */
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
.display-none-delay {
  display: none;
}
.z-index-1100 {
  z-index: 1100;
}
/* Sidebar end */
</style>
