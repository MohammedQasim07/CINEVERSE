<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const isOffline = ref(!navigator.onLine);

const updateOnlineStatus = () => {
  isOffline.value = !navigator.onLine;
};

onMounted(() => {
  window.addEventListener('online', updateOnlineStatus);
  window.addEventListener('offline', updateOnlineStatus);
});

onUnmounted(() => {
  window.removeEventListener('online', updateOnlineStatus);
  window.removeEventListener('offline', updateOnlineStatus);
});
</script>

<template>
  <Transition name="slide-down">
    <div v-if="isOffline" class="fixed top-0 left-0 w-full z-[100] bg-red-600 text-white text-center py-2 text-sm font-bold shadow-lg">
      You are currently offline. Some features may not be available.
    </div>
  </Transition>
</template>

<style scoped>
.slide-down-enter-active,
.slide-down-leave-active {
  transition: transform 0.3s ease;
}

.slide-down-enter-from,
.slide-down-leave-to {
  transform: translateY(-100%);
}
</style>
