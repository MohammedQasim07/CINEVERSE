<script setup>
import { ref, onMounted } from 'vue';

const deferredPrompt = ref(null);
const showInstallBanner = ref(false);

onMounted(() => {
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt.value = e;
    showInstallBanner.value = true;
  });
});

const installPWA = async () => {
  if (deferredPrompt.value) {
    deferredPrompt.value.prompt();
    const result = await deferredPrompt.value.userChoice;
    if (result.outcome === 'accepted') {
      showInstallBanner.value = false;
    }
    deferredPrompt.value = null;
  }
};

const dismiss = () => {
  showInstallBanner.value = false;
};
</script>

<template>
  <Transition name="slide-up">
    <div v-if="showInstallBanner" class="fixed bottom-20 left-4 right-4 md:bottom-4 md:right-4 md:left-auto md:w-80 bg-gray-900 border border-red-600/50 rounded-xl p-4 shadow-2xl z-50 flex flex-col gap-3">
      <div class="flex justify-between items-start">
        <div class="flex gap-3">
          <div class="bg-red-600 p-2 rounded-lg">
             <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6 text-white">
              <path fill-rule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 9a.75.75 0 00-1.5 0v2.25H9a.75.75 0 000 1.5h2.25V15a.75.75 0 001.5 0v-2.25H15a.75.75 0 000-1.5h-2.25V9z" clip-rule="evenodd" />
            </svg>
          </div>
          <div>
            <h3 class="font-bold text-white">Install App</h3>
            <p class="text-xs text-gray-400 mt-1">Add to home screen for better experience.</p>
          </div>
        </div>
        <button @click="dismiss" class="text-gray-500 hover:text-white">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5">
            <path fill-rule="evenodd" d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z" clip-rule="evenodd" />
          </svg>
        </button>
      </div>
      
      <button @click="installPWA" class="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 rounded-lg transition-colors text-sm">
        Install Now
      </button>
    </div>
  </Transition>
</template>

<style scoped>
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.slide-up-enter-from,
.slide-up-leave-to {
  transform: translateY(100px);
  opacity: 0;
}
</style>
