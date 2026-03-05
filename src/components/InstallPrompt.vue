<script setup>
import { ref, onMounted } from 'vue';
import { Icon } from '@iconify/vue';

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
  <Transition name="fade-overlay">
    <div v-if="showInstallBanner" class="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-4 pointer-events-none">
      
      <!-- Backdrop (Visible only when prompt is active) -->
      <div 
        class="absolute inset-0 bg-black/60 backdrop-blur-sm pointer-events-auto transition-opacity"
        @click="dismiss"
      ></div>

      <!-- Bottom Sheet Modal -->
      <Transition name="slide-sheet" appear>
        <div class="relative w-full max-w-sm bg-[#1c1c1e] text-white rounded-t-3xl sm:rounded-3xl p-6 shadow-[0_-10px_40px_rgba(0,0,0,0.5)] pointer-events-auto flex flex-col items-center text-center gap-5 border-t border-white/10 sm:border">
          
          <!-- Handle bar for mobile drag feel -->
          <div class="w-12 h-1.5 bg-gray-600 rounded-full mb-1 sm:hidden"></div>

          <!-- Logo & Title -->
          <div class="flex flex-col items-center gap-3">
             <div class="bg-gradient-to-br from-red-500 to-rose-600 p-3 rounded-2xl shadow-lg shadow-red-600/30">
               <Icon icon="ph:play-fill" class="w-8 h-8 text-white" />
             </div>
             
             <div>
                <h3 class="text-xl font-bold tracking-tight">Install CineVerse</h3>
                <p class="text-gray-400 text-sm mt-1 px-4 text-balance">Add to your home screen or dock to watch your favorite movies and series anywhere, anytime.</p>
             </div>
          </div>

          <!-- Buttons -->
          <div class="w-full flex flex-col gap-3 mt-2">
            <button 
              @click="installPWA" 
              class="w-full bg-white text-black font-bold py-3.5 rounded-xl transition-transform active:scale-95 text-base"
            >
              Add to Home Screen
            </button>
            <button 
              @click="dismiss" 
              class="w-full text-blue-400 font-semibold py-2.5 transition-colors hover:text-blue-300"
            >
              Maybe Later
            </button>
          </div>
          
        </div>
      </Transition>
    </div>
  </Transition>
</template>

<style scoped>
/* Overlay Fade */
.fade-overlay-enter-active,
.fade-overlay-leave-active {
  transition: opacity 0.3s ease;
}
.fade-overlay-enter-from,
.fade-overlay-leave-to {
  opacity: 0;
}

/* Bottom Sheet Slide */
.slide-sheet-enter-active {
  transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275), opacity 0.4s ease;
}
.slide-sheet-leave-active {
  transition: transform 0.3s ease-in, opacity 0.3s ease;
}

.slide-sheet-enter-from,
.slide-sheet-leave-to {
  transform: translateY(100%);
  opacity: 0;
}

@media (min-width: 640px) {
  .slide-sheet-enter-from,
  .slide-sheet-leave-to {
    transform: scale(0.95);
    opacity: 0;
  }
}
</style>
