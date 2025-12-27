<template>
  <div class="min-h-screen bg-gray-100 p-8 font-sans">
    <header class="mb-12">
      <div class="max-w-7xl mx-auto">
        <h1 class="text-5xl font-extrabold text-indigo-700 tracking-tight">
          PetFriends Dashboard
        </h1>
        <p class="mt-2 text-xl text-gray-500 font-medium">
          Die zentrale Verwaltung für unsere Community-Mitglieder und ihre Lieblinge.
        </p>
      </div>
    </header>

    <div class="max-w-7xl mx-auto">
      <section class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <div
          class="bg-white rounded-2xl shadow-sm p-6 border-b-4 border-indigo-500 transform transition hover:scale-105"
        >
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-indigo-100 text-indigo-600 text-3xl">👥</div>
            <div class="ml-5">
              <p class="text-sm font-bold text-gray-400 uppercase tracking-widest">
                Mitglieder
              </p>
              <p class="text-4xl font-black text-gray-900">{{ totalUsers }}</p>
            </div>
          </div>
        </div>

        <div
          class="bg-white rounded-2xl shadow-sm p-6 border-b-4 border-orange-500 transform transition hover:scale-105"
        >
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-orange-100 text-orange-600 text-3xl">🐾</div>
            <div class="ml-5">
              <p class="text-sm font-bold text-gray-400 uppercase tracking-widest">
                Haustiere gesamt
              </p>
              <p class="text-4xl font-black text-gray-900">{{ totalPets }}</p>
            </div>
          </div>
        </div>

        <div
          class="bg-white rounded-2xl shadow-sm p-6 border-b-4 border-green-500 transform transition hover:scale-105"
        >
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-green-100 text-green-600 text-3xl">📈</div>
            <div class="ml-5">
              <p class="text-sm font-bold text-gray-400 uppercase tracking-widest">
                Tiere pro Kopf
              </p>
              <p class="text-4xl font-black text-gray-900">{{ avgPets }}</p>
            </div>
          </div>
        </div>
      </section>

      <main class="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <section class="lg:col-span-1 space-y-10">
          <div class="bg-white p-8 rounded-2xl shadow-lg border-t-8 border-green-500">
            <h2 class="text-2xl font-bold mb-6 text-gray-800 flex items-center">
              <span class="mr-3">🆕</span> Nutzer registrieren
            </h2>
            <form @submit.prevent="registerUser" class="space-y-4">
              <div class="grid grid-cols-2 gap-4">
                <input
                  v-model="newUser.firstName"
                  type="text"
                  placeholder="Vorname"
                  class="w-full border-2 border-gray-100 p-3 rounded-xl focus:border-green-500 outline-none transition"
                  required
                />
                <input
                  v-model="newUser.lastName"
                  type="text"
                  placeholder="Nachname"
                  class="w-full border-2 border-gray-100 p-3 rounded-xl focus:border-green-500 outline-none transition"
                  required
                />
              </div>
              <input
                v-model="newUser.email"
                type="email"
                placeholder="E-Mail"
                class="w-full border-2 border-gray-100 p-3 rounded-xl focus:border-green-500 outline-none transition"
                required
              />
              <input
                v-model="newUser.password"
                type="password"
                placeholder="Passwort"
                class="w-full border-2 border-gray-100 p-3 rounded-xl focus:border-green-500 outline-none transition"
                required
              />
              <button
                type="submit"
                class="w-full bg-green-600 text-white py-4 rounded-xl font-black uppercase tracking-widest hover:bg-green-700 shadow-md transition-all active:scale-95"
              >
                Konto erstellen
              </button>
            </form>
          </div>

          <div class="bg-white p-8 rounded-2xl shadow-lg border-t-8 border-indigo-500">
            <h2 class="text-2xl font-bold mb-6 text-gray-800 flex items-center">
              <span class="mr-3">{{ isEditing ? "📝" : "🐶" }}</span>
              {{ isEditing ? "Tier bearbeiten" : "Tier hinzufügen" }}
            </h2>
            <form @submit.prevent="addPet" class="space-y-5">
              <input
                v-model="newPet.name"
                type="text"
                placeholder="Name des Tieres"
                class="w-full border-2 border-gray-100 p-3 rounded-xl focus:border-indigo-500 outline-none transition"
                required
              />

              <div class="grid grid-cols-2 gap-4">
                <select
                  v-model="newPet.species"
                  class="w-full border-2 border-gray-100 p-3 rounded-xl bg-white outline-none"
                >
                  <option value="DOG">Hund</option>
                  <option value="CAT">Katze</option>
                  <option value="BIRD">Vogel</option>
                  <option value="OTHER">Sonstiges</option>
                </select>
                <input
                  v-model="newPet.breed"
                  type="text"
                  class="w-full border-2 border-gray-100 p-3 rounded-xl outline-none"
                  placeholder="Rasse"
                />
              </div>

              <select
                v-model="newPet.ownerId"
                class="w-full border-2 border-indigo-50 p-3 rounded-xl bg-indigo-50 font-bold text-indigo-700 outline-none"
                required
              >
                <option :value="null" disabled>-- Besitzer wählen --</option>
                <option v-for="user in users" :key="user.id" :value="user.id">
                  {{ user.firstName }} {{ user.lastName }}
                </option>
              </select>

              <button
                type="submit"
                :class="
                  isEditing
                    ? 'bg-orange-500 hover:bg-orange-600'
                    : 'bg-indigo-600 hover:bg-indigo-700'
                "
                class="w-full text-white py-4 rounded-xl font-black uppercase tracking-widest shadow-md transition-all active:scale-95"
              >
                {{ isEditing ? "Änderungen speichern" : "Tier registrieren" }}
              </button>

              <button
                v-if="isEditing"
                @click="cancelEdit"
                type="button"
                class="w-full text-gray-400 font-bold uppercase text-xs tracking-widest mt-2 hover:text-gray-600"
              >
                Abbrechen
              </button>
            </form>
          </div>
        </section>

        <section class="lg:col-span-2 space-y-6">
          <div class="bg-white p-4 rounded-2xl shadow-sm flex flex-col md:flex-row gap-4">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Suche nach Namen oder Tieren..."
              class="flex-1 border-2 border-gray-50 p-3 rounded-xl outline-none focus:border-indigo-500 transition"
            />
            <select
              v-model="filterSpecies"
              class="bg-gray-50 p-3 rounded-xl outline-none font-bold text-gray-600"
            >
              <option value="ALL">Alle Arten</option>
              <option value="DOG">🐶 Hunde</option>
              <option value="CAT">🐱 Katzen</option>
              <option value="BIRD">🐦 Vögel</option>
              <option value="OTHER">🐾 Sonstiges</option>
            </select>
          </div>

          <div
            v-if="loading"
            class="flex flex-col items-center justify-center py-24 bg-white rounded-2xl shadow-inner"
          >
            <div
              class="animate-spin rounded-full h-16 w-16 border-t-4 border-indigo-600 mb-4"
            ></div>
            <p class="text-indigo-600 font-bold">Lade Community-Daten...</p>
          </div>

          <div v-else class="space-y-8">
            <div
              v-for="user in filteredUsers"
              :key="user.id"
              class="bg-white rounded-2xl shadow-md border-l-8 border-indigo-500 overflow-hidden hover:shadow-xl transition-shadow"
            >
              <div
                class="p-6 border-b border-gray-50 flex justify-between items-center bg-gray-50/30"
              >
                <div>
                  <h2 class="text-3xl font-black text-gray-800">
                    {{ user.firstName }} {{ user.lastName }}
                  </h2>
                  <p class="text-gray-400 font-medium flex items-center mt-1">
                    <span class="mr-2">📧</span> {{ user.email }}
                  </p>
                </div>
                <span
                  class="bg-indigo-600 text-white text-xs font-black px-4 py-2 rounded-full shadow-sm"
                  >{{ user.role }}</span
                >
              </div>

              <div class="p-8">
                <h3
                  class="text-xs font-black text-gray-300 uppercase tracking-[0.2em] mb-6"
                >
                  Mitglieder der Familie
                </h3>

                <div
                  v-if="user.pets && user.pets.length > 0"
                  class="grid grid-cols-1 md:grid-cols-2 gap-6"
                >
                  <div
                    v-for="pet in user.pets"
                    :key="pet.id"
                    class="bg-gray-50 p-5 rounded-2xl border border-gray-100 flex justify-between items-center group transition hover:border-indigo-200"
                  >
                    <div class="flex items-center space-x-5">
                      <span class="text-4xl bg-white p-3 rounded-2xl shadow-sm">{{
                        getSpeciesIcon(pet.species)
                      }}</span>
                      <div>
                        <p class="font-black text-xl text-gray-800 leading-tight">
                          {{ pet.name }}
                        </p>
                        <p
                          class="text-sm font-bold text-indigo-500 uppercase tracking-wide"
                        >
                          {{ pet.breed || "Mischling" }}
                        </p>
                      </div>
                    </div>

                    <div class="flex space-x-2">
                      <button
                        @click="startEdit(pet)"
                        class="bg-white p-3 rounded-xl text-gray-300 hover:text-indigo-600 transition shadow-sm"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          class="h-6 w-6"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                          />
                        </svg>
                      </button>
                      <button
                        @click="removePet(pet.id)"
                        class="bg-white p-3 rounded-xl text-gray-300 hover:text-red-500 transition shadow-sm"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          class="h-6 w-6"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
                <div
                  v-else
                  class="flex flex-col items-center justify-center p-12 border-4 border-dashed border-gray-50 rounded-3xl"
                >
                  <p class="text-gray-300 font-bold italic">
                    Noch keine Haustiere registriert.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import axios from "axios";

// BASIS DATEN
const users = ref([]);
const loading = ref(true);
const isEditing = ref(false);
const editingPetId = ref(null);

// FORMULAR STATES
const newUser = ref({
  email: "",
  password: "",
  firstName: "",
  lastName: "",
  role: "PRIVAT",
});
const newPet = ref({
  name: "",
  species: "DOG",
  breed: "",
  description: "",
  ownerId: null,
});

// FILTER STATES
const searchQuery = ref("");
const filterSpecies = ref("ALL");

// STATISTIKEN
const totalUsers = computed(() => users.value.length);
const totalPets = computed(() =>
  users.value.reduce((sum, user) => sum + (user.pets ? user.pets.length : 0), 0)
);
const avgPets = computed(() =>
  totalUsers.value === 0 ? "0.0" : (totalPets.value / totalUsers.value).toFixed(1)
);

// FILTER LOGIK
const filteredUsers = computed(() => {
  return users.value.filter((user) => {
    const matchesUser = `${user.firstName} ${user.lastName} ${user.email}`
      .toLowerCase()
      .includes(searchQuery.value.toLowerCase());
    const matchesPet = user.pets.some(
      (pet) =>
        pet.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        (pet.breed && pet.breed.toLowerCase().includes(searchQuery.value.toLowerCase()))
    );
    const matchesSpecies =
      filterSpecies.value === "ALL" ||
      user.pets.some((p) => p.species === filterSpecies.value);
    return (matchesUser || matchesPet) && matchesSpecies;
  });
});

// HELPERS
const getSpeciesIcon = (s) =>
  ({ DOG: "🐶", CAT: "🐱", BIRD: "🐦", OTHER: "🐾" }[s] || "🐾");

const startEdit = (pet) => {
  isEditing.value = true;
  editingPetId.value = pet.id;
  newPet.value = {
    name: pet.name,
    species: pet.species,
    breed: pet.breed || "",
    description: pet.description || "",
    ownerId: pet.ownerId,
  };
  window.scrollTo({ top: 0, behavior: "smooth" });
};

const cancelEdit = () => {
  isEditing.value = false;
  editingPetId.value = null;
  newPet.value = { name: "", species: "DOG", breed: "", description: "", ownerId: null };
};

// API AKTIONEN
const fetchUsers = async () => {
  try {
    const response = await axios.get("http://localhost:3000/api/users");
    users.value = response.data;
  } finally {
    loading.value = false;
  }
};

const registerUser = async () => {
  try {
    await axios.post("http://localhost:3000/api/users/register", newUser.value);
    alert("Konto erstellt!");
    newUser.value = {
      email: "",
      password: "",
      firstName: "",
      lastName: "",
      role: "PRIVAT",
    };
    await fetchUsers();
  } catch (error) {
    alert("Fehler!");
  }
};

const addPet = async () => {
  if (!newPet.value.ownerId) return alert("Besitzer wählen!");
  try {
    if (isEditing.value) {
      await axios.put(
        `http://localhost:3000/api/pets/${editingPetId.value}`,
        newPet.value
      );
    } else {
      await axios.post("http://localhost:3000/api/pets", newPet.value);
    }
    cancelEdit();
    await fetchUsers();
  } catch (error) {
    alert("Fehler beim Speichern!");
  }
};

const removePet = async (id) => {
  if (!confirm("Dauerhaft löschen?")) return;
  try {
    await axios.delete(`http://localhost:3000/api/pets/${id}`);
    await fetchUsers();
  } catch (error) {
    alert("Löschfehler!");
  }
};

onMounted(fetchUsers);
</script>
