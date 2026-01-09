<template>
  <div class="min-h-screen bg-gray-100 font-sans pb-28 md:pt-24 md:pb-0">
    <router-view v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>

    <nav
      v-if="currentUser"
      class="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-gray-100 px-6 py-4 flex justify-between items-center shadow-2xl z-[1000] md:top-0 md:bottom-auto md:border-b md:border-t-0 h-20"
    >
      <div class="hidden md:block font-black text-indigo-700 text-2xl tracking-tighter">
        PetFriends
      </div>

      <div class="flex flex-1 justify-around md:justify-end md:space-x-12">
        <router-link to="/" class="nav-item" active-class="text-indigo-600">
          <span class="text-2xl">🏠</span>
          <span
            class="text-[10px] font-black uppercase tracking-widest hidden md:block mt-1"
            >Dashboard</span
          >
        </router-link>

        <router-link to="/discover" class="nav-item" active-class="text-indigo-600">
          <span class="text-2xl">🔍</span>
          <span
            class="text-[10px] font-black uppercase tracking-widest hidden md:block mt-1"
            >Entdecken</span
          >
        </router-link>

        <router-link
          v-if="currentUser.role === 'ADMIN'"
          to="/admin"
          class="nav-item"
          active-class="text-orange-500"
        >
          <span class="text-2xl">🛡️</span>
          <span
            class="text-[10px] font-black uppercase tracking-widest hidden md:block mt-1"
            >Admin</span
          >
        </router-link>

        <button
          @click="handleLogout"
          class="nav-item text-gray-400 hover:text-red-500 transition-colors"
        >
          <span class="text-2xl">🚪</span>
          <span
            class="text-[10px] font-black uppercase tracking-widest hidden md:block mt-1"
            >Logout</span
          >
        </button>
      </div>
    </nav>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import { useRouter, useRoute } from "vue-router";

const router = useRouter();
const route = useRoute();
const currentUser = ref(null);

const checkUser = () => {
  const userJson = localStorage.getItem("user");
  if (userJson) {
    currentUser.value = JSON.parse(userJson);
  } else {
    currentUser.value = null;
  }
};

onMounted(checkUser);
watch(() => route.path, checkUser);

const handleLogout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  currentUser.value = null;
  router.push("/login");
};
</script>

<style scoped>
.nav-item {
  @apply flex flex-col items-center transition-all duration-200 transform active:scale-90 hover:opacity-80;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
