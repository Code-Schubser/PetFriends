<template>
  <div class="p-6 max-w-4xl mx-auto space-y-8 pb-32">
    <header
      class="flex justify-between items-center bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100"
    >
      <div>
        <h1 class="text-3xl font-black text-gray-800 tracking-tight">
          Hallo, {{ user?.firstName }}!
        </h1>
        <p class="text-gray-400 font-bold uppercase text-[10px] tracking-widest">
          Dashboard
        </p>
      </div>
      <button
        @click="openAddModal"
        class="bg-indigo-600 text-white px-6 py-4 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-indigo-700 shadow-xl transition active:scale-95"
      >
        + Tier hinzufügen
      </button>
    </header>

    <section class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div class="bg-indigo-600 p-8 rounded-[2.5rem] text-white shadow-xl">
        <h3 class="font-black text-xl mb-1">Deine Tiere</h3>
        <p class="text-5xl font-black">{{ myPets.length }}</p>
      </div>

      <div
        @click="showMatches = !showMatches"
        class="bg-white p-8 rounded-[2.5rem] shadow-lg border-2 transition-all cursor-pointer group"
        :class="showMatches ? 'border-indigo-500' : 'border-transparent'"
      >
        <h3 class="font-black text-xl text-gray-800 mb-1 group-hover:text-indigo-600">
          Gesamt-Matches
        </h3>
        <div class="flex items-center justify-between">
          <p class="text-5xl font-black text-indigo-600">{{ matchCount }}</p>
          <span
            class="text-2xl transition-transform"
            :class="showMatches ? 'rotate-90' : ''"
            >➔</span
          >
        </div>
      </div>
    </section>

    <transition name="fade">
      <section
        v-if="showMatches"
        class="bg-indigo-50/50 p-6 rounded-[2.5rem] border border-indigo-100 space-y-4"
      >
        <h2 class="text-lg font-black text-indigo-800 uppercase tracking-tighter ml-2">
          Deine neuen Partner-Tiere 🐾
        </h2>

        <div
          v-if="matches.length > 0"
          class="flex overflow-x-auto space-x-6 py-2 no-scrollbar"
        >
          <div
            v-for="m in matches"
            :key="m.matchId"
            class="flex-shrink-0 flex flex-col items-center space-y-2 w-24"
          >
            <div
              class="h-20 w-20 rounded-full border-4 border-white shadow-md overflow-hidden bg-white"
            >
              <img
                v-if="m.pet.imageUrl"
                :src="`http://localhost:3000${m.pet.imageUrl}`"
                class="h-full w-full object-cover"
              />
              <div v-else class="h-full w-full flex items-center justify-center text-2xl">
                🐾
              </div>
            </div>
            <p class="font-black text-[11px] text-center truncate w-full text-gray-700">
              {{ m.pet.name }}
            </p>
            <button
              @click="$router.push(`/chat/${m.matchId}`)"
              class="bg-indigo-600 text-white text-[9px] font-black py-1 px-3 rounded-full uppercase tracking-widest shadow-sm"
            >
              Chat
            </button>
          </div>
        </div>

        <div v-else class="text-center py-4 text-gray-400 font-bold text-sm italic">
          Noch keine Matches gefunden. Swipe weiter!
        </div>
      </section>
    </transition>

    <section class="space-y-4">
      <h2 class="text-xl font-black text-gray-800 uppercase tracking-tighter ml-2">
        Meine Schützlinge
      </h2>
      <div v-if="myPets.length > 0" class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div
          v-for="pet in myPets"
          :key="pet.id"
          class="bg-white p-5 rounded-[2rem] shadow-md flex items-center justify-between border border-gray-50 group"
        >
          <div class="flex items-center space-x-4">
            <img
              v-if="pet.imageUrl"
              :src="`http://localhost:3000${pet.imageUrl}`"
              class="h-16 w-16 rounded-2xl object-cover"
            />
            <div
              v-else
              class="h-16 w-16 bg-gray-100 rounded-2xl flex items-center justify-center text-2xl"
            >
              🐾
            </div>
            <div>
              <h4 class="font-black text-lg text-gray-800">{{ pet.name }}</h4>
              <p class="text-[10px] font-black text-gray-400 uppercase">
                {{ pet.species }} • {{ pet.breed }}
              </p>
            </div>
          </div>
          <button
            @click="openEditModal(pet)"
            class="p-3 bg-gray-50 rounded-xl text-indigo-600 hover:bg-indigo-50 transition opacity-0 group-hover:opacity-100"
          >
            ✏️
          </button>
        </div>
      </div>
    </section>

    <div
      v-if="showModal"
      class="fixed inset-0 bg-black/60 backdrop-blur-sm z-[2000] flex items-center justify-center p-4"
    >
      <div class="bg-white w-full max-w-md rounded-[2.5rem] p-10 shadow-2xl">
        <h2 class="text-3xl font-black text-gray-800 mb-6">
          {{ isEditMode ? "Bearbeiten" : "Neues Tier" }}
        </h2>
        <form @submit.prevent="savePet" class="space-y-4">
          <input
            v-model="formPet.name"
            type="text"
            placeholder="Name"
            class="w-full p-4 bg-gray-50 rounded-2xl outline-none"
            required
          />
          <div class="grid grid-cols-2 gap-3">
            <select
              v-model="formPet.species"
              class="p-4 bg-gray-50 rounded-2xl outline-none font-bold"
              required
            >
              <option value="" disabled>Art wählen</option>
              <option v-for="s in speciesList" :key="s" :value="s">{{ s }}</option>
            </select>
            <input
              v-model="formPet.breed"
              type="text"
              placeholder="Rasse"
              class="p-4 bg-gray-50 rounded-2xl outline-none"
              required
            />
          </div>
          <input
            v-model="formPet.birthdate"
            type="date"
            class="w-full p-4 bg-gray-50 rounded-2xl outline-none"
            required
          />
          <input
            type="file"
            @change="(e) => (formPet.image = e.target.files[0])"
            class="text-xs font-bold text-gray-400"
          />
          <div class="flex gap-4 pt-6">
            <button
              type="button"
              @click="showModal = false"
              class="flex-1 py-4 font-bold text-gray-400"
            >
              Abbrechen
            </button>
            <button
              type="submit"
              class="flex-1 bg-indigo-600 text-white py-4 rounded-2xl font-black uppercase shadow-lg"
            >
              Speichern
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";

const user = ref(JSON.parse(localStorage.getItem("user")));
const myPets = ref([]);
const speciesList = ref([]);
const matchCount = ref(0);
const matches = ref([]); // NEU: Liste der Partner-Tiere
const showMatches = ref(false); // NEU: Anzeige-Toggle
const showModal = ref(false);
const isEditMode = ref(false);
const formPet = ref({
  id: null,
  name: "",
  species: "",
  breed: "",
  birthdate: "",
  image: null,
});

const loadData = async () => {
  if (!user.value) return;
  try {
    const [pRes, sRes, cRes, mRes] = await Promise.all([
      fetch(`http://localhost:3000/api/users/${user.value.id}/pets`),
      fetch(`http://localhost:3000/api/pets/species`),
      fetch(`http://localhost:3000/api/pets/matches/count/${user.value.id}`),
      fetch(`http://localhost:3000/api/pets/matches/list/${user.value.id}`), // NEU
    ]);

    myPets.value = await pRes.json();
    speciesList.value = await sRes.json();
    const cData = await cRes.json();
    matchCount.value = cData.count;
    matches.value = await mRes.json(); // NEU
  } catch (e) {
    console.error("Fehler beim Laden:", e);
  }
};

const openAddModal = () => {
  isEditMode.value = false;
  formPet.value = {
    id: null,
    name: "",
    species: "",
    breed: "",
    birthdate: "",
    image: null,
  };
  showModal.value = true;
};

const openEditModal = (pet) => {
  isEditMode.value = true;
  formPet.value = { ...pet, birthdate: pet.birthdate?.split("T")[0], image: null };
  showModal.value = true;
};

const savePet = async () => {
  const fd = new FormData();
  Object.keys(formPet.value).forEach((k) => {
    if (formPet.value[k]) fd.append(k, formPet.value[k]);
  });
  fd.append("ownerId", user.value.id);

  const url = isEditMode.value
    ? `http://localhost:3000/api/pets/${formPet.value.id}`
    : "http://localhost:3000/api/pets";
  const res = await fetch(url, { method: isEditMode.value ? "PUT" : "POST", body: fd });
  if (res.ok) {
    showModal.value = false;
    loadData();
  }
};

onMounted(loadData);
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
