<template>
  <div class="p-6 max-w-xl mx-auto pb-32 relative min-h-screen">
    <h1 class="text-3xl font-black text-indigo-700 tracking-tighter mb-6 text-center">
      Entdecken
    </h1>

    <div v-if="myPets.length > 1" class="mb-8 bg-white p-5 rounded-[2rem] shadow-sm border border-indigo-50">
      <label class="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 ml-1">
        Matching-Profil wechseln:
      </label>
      <select v-model="activePetId" class="w-full p-4 bg-gray-50 rounded-2xl font-bold outline-none border-2 border-transparent focus:border-indigo-500 transition appearance-none">
        <option v-for="pet in myPets" :key="pet.id" :value="pet.id">
          {{ pet.name }} ({{ pet.species }})
        </option>
      </select>
    </div>

    <div v-if="currentPet && activePetId" class="relative h-[550px] w-full group">
      <div class="absolute inset-0 bg-white rounded-[3rem] shadow-2xl border border-gray-100 overflow-hidden flex flex-col transform transition-all duration-500 hover:scale-[1.01]">
        
        <div class="h-4/5 bg-gray-200 relative">
          <img 
            v-if="currentPet.imageUrl" 
            :src="`http://localhost:3000${currentPet.imageUrl}`" 
            class="w-full h-full object-cover" 
          />
          <div v-else class="w-full h-full flex items-center justify-center text-8xl bg-indigo-50">
            🐾
          </div>
          
          <div class="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black/80 via-black/40 to-transparent text-white">
            <h2 class="text-4xl font-black tracking-tight">
              {{ currentPet.name }}, {{ calculateAge(currentPet.birthdate) }}
            </h2>
            <p class="font-bold opacity-90 uppercase tracking-widest text-xs mt-1">
              {{ currentPet.species }} • {{ currentPet.breed }}
            </p>
          </div>
        </div>

        <div class="flex-1 flex items-center justify-around px-12 bg-white">
          <button 
            @click="handleRate(false)" 
            class="h-16 w-16 bg-white border-4 border-gray-50 rounded-full flex items-center justify-center text-2xl shadow-lg hover:bg-red-50 hover:border-red-100 hover:scale-110 active:scale-95 transition-all"
          >
            ❌
          </button>
          <button 
            @click="handleRate(true)" 
            class="h-20 w-20 bg-white border-4 border-indigo-50 rounded-full flex items-center justify-center text-4xl shadow-xl hover:bg-indigo-50 hover:border-indigo-100 hover:scale-110 active:scale-95 transition-all"
          >
            ❤️
          </button>
        </div>
      </div>
    </div>

    <div v-else class="text-center py-24 bg-white rounded-[3rem] border-2 border-dashed border-gray-200 shadow-inner">
      <div class="text-6xl mb-4">🔍</div>
      <p class="text-gray-400 font-black uppercase text-sm tracking-widest px-10 leading-relaxed">
        Keine weiteren Tiere in deiner Umgebung gefunden.
      </p>
      <button @click="loadData" class="mt-8 text-indigo-600 font-black uppercase text-xs tracking-widest border-b-2 border-indigo-600 pb-1">
        Suche aktualisieren
      </button>
    </div>

    <transition name="match-anim">
      <div v-if="showMatchOverlay" class="fixed inset-0 z-[2000] bg-indigo-700/95 backdrop-blur-xl flex flex-col items-center justify-center text-white p-10 text-center">
        <div class="relative mb-10">
          <div class="text-9xl animate-pulse">🐾</div>
          <div class="absolute -top-4 -right-4 text-6xl animate-bounce">❤️</div>
        </div>
        
        <h2 class="text-6xl font-black mb-4 tracking-tighter italic uppercase transform -rotate-2">
          It's a Match!
        </h2>
        <p class="text-indigo-100 font-bold text-xl mb-12 max-w-xs leading-tight">
          {{ currentPet?.name }} und dein Haustier haben sich gefunden!
        </p>
        
        <div class="flex flex-col w-full max-w-sm gap-4">
          <button 
            @click="closeMatchOverlay" 
            class="bg-white text-indigo-700 py-5 rounded-[2rem] font-black uppercase tracking-widest shadow-2xl hover:bg-indigo-50 transition-colors"
          >
            Weiter swipen
          </button>
          <button class="bg-indigo-500/50 text-white py-5 rounded-[2rem] font-black uppercase tracking-widest border-2 border-indigo-400/50 backdrop-blur-sm">
            Chat öffnen
          </button>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';

const myPets = ref([]);
const allPets = ref([]);
const activePetId = ref(null);
const currentIndex = ref(0);
const showMatchOverlay = ref(false);
const currentUser = JSON.parse(localStorage.getItem('user'));

// Filtert eigene Tiere und bereits geswipte Tiere aus (SU-01)
const discoverablePets = computed(() => {
  return allPets.value.filter(p => p.ownerId !== currentUser.id);
});

const currentPet = computed(() => {
  return discoverablePets.value[currentIndex.value] || null;
});

const loadData = async () => {
  try {
    // 1. Erst deine eigenen Tiere laden, um zu wissen, wer "sucht"
    const myRes = await fetch(`http://localhost:3000/api/users/${currentUser.id}/pets`);
    myPets.value = await myRes.json();
    
    // Falls du Tiere hast, wähle das erste als Standard
    if (myPets.value.length > 0) {
      if (!activePetId.value) activePetId.value = myPets.value[0].id;

      // 2. JETZT DER FIX: Wir rufen /discovery auf und hängen deine activePetId an!
      const res = await fetch(`http://localhost:3000/api/pets/discovery?sourcePetId=${activePetId.value}`);
      const data = await res.json();
      
      allPets.value = data;
      currentIndex.value = 0;
    }
  } catch (e) {
    console.error("Discovery-Fehler:", e);
  }
};

// 3. ZUSATZ-FIX: Wenn du das Tier im Dropdown wechselst, soll die Liste neu laden
import { watch } from 'vue';
watch(activePetId, () => {
  loadData();
});

const handleRate = async (isLiked) => {
  if (!currentPet.value || !activePetId.value) return;

  try {
    const res = await fetch('http://localhost:3000/api/pets/rate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sourcePetId: activePetId.value,
        targetPetId: currentPet.value.id,
        isLiked: isLiked
      })
    });

    const result = await res.json();
    
    if (result.isMatch) {
      showMatchOverlay.value = true;
    } else {
      nextCard();
    }
  } catch (e) {
    console.error("Rating Fehler:", e);
  }
};

const nextCard = () => {
  currentIndex.value++;
};

const closeMatchOverlay = () => {
  showMatchOverlay.value = false;
  nextCard();
};

const calculateAge = (birthdate) => {
  if (!birthdate) return "?";
  const birth = new Date(birthdate);
  const now = new Date();
  let years = now.getFullYear() - birth.getFullYear();
  if (now.getMonth() < birth.getMonth() || (now.getMonth() === birth.getMonth() && now.getDate() < birth.getDate())) {
    years--;
  }
  return years < 1 ? "Baby" : `${years} J.`;
};

onMounted(loadData);
</script>

<style scoped>
/* Animation für das Match-Overlay */
.match-anim-enter-active, .match-anim-leave-active {
  transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}
.match-anim-enter-from {
  opacity: 0;
  transform: scale(1.2);
}
.match-anim-leave-to {
  opacity: 0;
  transform: scale(0.8);
}

/* Einfaches Ausfaden der Karten */
.pop-enter-active, .pop-leave-active {
  transition: opacity 0.3s;
}
.pop-enter-from, .pop-leave-to {
  opacity: 0;
}
</style>