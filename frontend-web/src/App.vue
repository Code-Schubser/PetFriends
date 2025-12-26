<template>
  <div class="min-h-screen bg-gray-100 p-8">
    <header class="mb-8">
      <h1 class="text-4xl font-bold text-indigo-600">PetFriends Dashboard</h1>
      <p class="text-gray-600">Verwalte deine Community und Haustiere</p>
    </header>

    <main class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      
      <section class="lg:col-span-1">
        <div class="bg-white p-6 rounded-lg shadow-md">
          <h2 class="text-xl font-bold mb-4 text-gray-800">Neues Haustier anlegen</h2>
          
          <form @submit.prevent="addPet" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700">Name</label>
              <input v-model="newPet.name" type="text" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 border p-2" required>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700">Tierart</label>
              <select v-model="newPet.species" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 border p-2">
                <option value="DOG">Hund</option>
                <option value="CAT">Katze</option>
                <option value="BIRD">Vogel</option>
                <option value="OTHER">Sonstiges</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700">Rasse</label>
              <input v-model="newPet.breed" type="text" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 border p-2">
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700">Beschreibung</label>
              <textarea v-model="newPet.description" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 border p-2"></textarea>
            </div>

            <button type="submit" class="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition duration-200">
              Haustier speichern
            </button>
          </form>
        </div>
      </section>

      <section class="lg:col-span-2">
        <div v-if="loading" class="text-center py-10 text-gray-500">Lade Daten...</div>
        
        <div v-else class="space-y-6">
          <div v-for="user in users" :key="user.id" class="bg-white p-6 rounded-lg shadow-md border-l-4 border-indigo-500">
            <div class="flex justify-between items-start">
              <div>
                <h2 class="text-2xl font-semibold">{{ user.firstName }} {{ user.lastName }}</h2>
                <p class="text-gray-500">{{ user.email }}</p>
              </div>
              <span class="bg-indigo-100 text-indigo-800 text-xs font-bold px-2.5 py-0.5 rounded uppercase">{{ user.role }}</span>
            </div>

            <div class="mt-6">
              <h3 class="font-bold text-gray-700 border-b pb-2 mb-3">Registrierte Haustiere</h3>
              <div v-if="user.pets.length > 0" class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div v-for="pet in user.pets" :key="pet.id" class="bg-gray-50 p-3 rounded border border-gray-200">
                  <p class="font-bold text-indigo-600">{{ pet.name }}</p>
                  <p class="text-sm text-gray-600">{{ pet.species }} | {{ pet.breed }}</p>
                  <p class="text-xs text-gray-400 mt-1 italic">{{ pet.description }}</p>
                </div>
              </div>
              <p v-else class="text-gray-400 italic">Noch keine Haustiere registriert.</p>
            </div>
          </div>
        </div>
      </section>

    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

// Daten-Zustände
const users = ref([]);
const loading = ref(true);

// Zustand für das neue Haustier (Formular)
const newPet = ref({
  name: '',
  species: 'DOG',
  breed: '',
  description: '',
  ownerId: 1 // Hier nutzen wir deine ID aus der Datenbank
});

// Funktion: Nutzer und deren Pets vom Server laden
const fetchUsers = async () => {
  try {
    const response = await axios.get('http://localhost:3000/api/users');
    users.value = response.data;
  } catch (error) {
    console.error("Fehler beim Laden:", error);
  } finally {
    loading.value = false;
  }
};

// Funktion: Neues Haustier speichern
const addPet = async () => {
  try {
    const response = await axios.post('http://localhost:3000/api/pets', newPet.value);
    console.log("Gespeichert:", response.data);
    
    // Formular zurücksetzen
    newPet.value = { name: '', species: 'DOG', breed: '', description: '', ownerId: 1 };
    
    // Liste neu laden, damit das neue Tier sofort erscheint
    await fetchUsers();
  } catch (error) {
    alert("Fehler beim Speichern des Haustiers!");
    console.error(error);
  }
};

onMounted(fetchUsers);
</script>