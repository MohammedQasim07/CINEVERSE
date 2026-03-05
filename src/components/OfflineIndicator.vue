<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { Icon } from '@iconify/vue';

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
    <div v-if="isOffline" class="fixed top-20 left-1/2 -translate-x-1/2 z-[100] w-max max-w-[90vw]">
      <div class="bg-gray-900/90 backdrop-blur-md border border-red-500/30 text-white flex items-center gap-3 px-5 py-3 rounded-full shadow-2xl shadow-red-900/20">
        <Icon icon="ph:wifi-slash" class="w-5 h-5 text-red-500" />
        <span class="text-sm font-semibold tracking-wide">You are currently offline.</span>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.slide-down-enter-from,
.slide-down-leave-to {
  transform: translate(-50%, -150%);
  opacity: 0;
}
.slide-down-enter-to,
.slide-down-leave-from {
  transform: translate(-50%, 0);
  opacity: 1;
}
</style>
