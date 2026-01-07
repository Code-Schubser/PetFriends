<template>
  <div class="min-h-screen bg-gray-100 font-sans">
    <div v-if="!currentUser" class="flex items-center justify-center min-h-screen p-4">
      <div
        class="max-w-md w-full bg-white p-10 rounded-3xl shadow-2xl border-t-8 border-indigo-600"
      >
        <h1 class="text-4xl font-black text-indigo-700 text-center mb-2 tracking-tight">
          PetFriends
        </h1>
        <p
          class="text-center text-gray-400 font-bold mb-8 uppercase text-xs tracking-widest"
        >
          {{ isRegistering ? "Konto erstellen" : "Mitglieder-Login" }}
        </p>

        <form v-if="!isRegistering" @submit.prevent="handleLogin" class="space-y-5">
          <input
            v-model="loginData.email"
            type="email"
            placeholder="E-Mail"
            class="w-full border-2 border-gray-100 p-4 rounded-2xl outline-none focus:border-indigo-500 transition"
            required
          />
          <input
            v-model="loginData.password"
            type="password"
            placeholder="Passwort"
            class="w-full border-2 border-gray-100 p-4 rounded-2xl outline-none focus:border-indigo-500 transition"
            required
          />
          <button
            type="submit"
            class="w-full bg-indigo-600 text-white py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-indigo-700 shadow-lg transition active:scale-95"
          >
            Anmelden
          </button>
        </form>

        <form v-else @submit.prevent="handleRegister" class="space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <input
              v-model="registerData.firstName"
              type="text"
              placeholder="Vorname"
              class="w-full border-2 border-gray-100 p-4 rounded-2xl outline-none focus:border-green-500 transition"
              required
            />
            <input
              v-model="registerData.lastName"
              type="text"
              placeholder="Nachname"
              class="w-full border-2 border-gray-100 p-4 rounded-2xl outline-none focus:border-green-500 transition"
              required
            />
          </div>
          <input
            v-model="registerData.email"
            type="email"
            placeholder="E-Mail"
            class="w-full border-2 border-gray-100 p-4 rounded-2xl outline-none focus:border-green-500 transition"
            required
          />
          <input
            v-model="registerData.password"
            type="password"
            placeholder="Passwort wählen"
            class="w-full border-2 border-gray-100 p-4 rounded-2xl outline-none focus:border-green-500 transition"
            required
          />
          <button
            type="submit"
            class="w-full bg-green-600 text-white py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-green-700 shadow-lg transition active:scale-95"
          >
            Jetzt registrieren
          </button>
        </form>

        <div class="mt-8 text-center border-t pt-6">
          <button
            @click="isRegistering = !isRegistering"
            class="text-indigo-600 font-bold text-sm hover:text-indigo-800 transition"
          >
            {{
              isRegistering
                ? "Bereits Mitglied? Hier einloggen"
                : "Noch kein Konto? Hier erstellen"
            }}
          </button>
        </div>
      </div>
    </div>

    <div v-else class="p-8">
      <header class="max-w-7xl mx-auto mb-12 flex justify-between items-end">
        <div>
          <h1 class="text-5xl font-extrabold text-indigo-700 tracking-tight">
            Dashboard
          </h1>
          <p class="mt-2 text-xl text-gray-500 font-medium italic">
            Willkommen zurück, {{ currentUser.firstName }}!
          </p>
        </div>
        <button
          @click="logout"
          class="bg-white text-gray-400 px-6 py-2 rounded-xl font-bold text-xs uppercase tracking-widest hover:text-red-500 hover:border-red-200 border border-transparent transition shadow-sm"
        >
          Abmelden
        </button>
      </header>

      <div class="max-w-7xl mx-auto">
        <section class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div class="bg-white rounded-3xl shadow-sm p-8 border-b-8 border-indigo-500">
            <p class="text-xs font-black text-gray-400 uppercase tracking-widest">
              {{ currentUser.role === "ADMIN" ? "Mitglieder" : "Dein Konto" }}
            </p>
            <p class="text-4xl font-black text-gray-900">{{ totalUsers }}</p>
          </div>

          <div class="bg-white rounded-3xl shadow-sm p-8 border-b-8 border-orange-500">
            <p class="text-xs font-black text-gray-400 uppercase tracking-widest">
              {{ currentUser.role === "ADMIN" ? "Haustiere gesamt" : "Deine Lieblinge" }}
            </p>
            <p class="text-4xl font-black text-gray-900">{{ totalPets }}</p>
          </div>

          <div class="bg-white rounded-3xl shadow-sm p-8 border-b-8 border-green-500">
            <p class="text-xs font-black text-gray-400 uppercase tracking-widest">
              {{ currentUser.role === "ADMIN" ? "Tiere / Kopf" : "System-Modus" }}
            </p>
            <p class="text-4xl font-black text-gray-900">{{ avgPets }}</p>
          </div>
        </section>

        <main class="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <aside class="lg:col-span-1">
            <div
              v-if="currentUser.role === 'ADMIN'"
              class="bg-white p-8 rounded-3xl shadow-xl border-t-8 border-green-500 mb-10"
            >
              <h2 class="text-2xl font-bold mb-6 text-gray-800 flex items-center">
                <span class="mr-3">🆕</span> Nutzer registrieren
              </h2>
              <form @submit.prevent="handleRegister" class="space-y-4">
                <div class="grid grid-cols-2 gap-4">
                  <input
                    v-model="registerData.firstName"
                    type="text"
                    placeholder="Vorname"
                    class="w-full border-2 border-gray-100 p-3 rounded-xl focus:border-green-500 outline-none transition"
                    required
                  />
                  <input
                    v-model="registerData.lastName"
                    type="text"
                    placeholder="Nachname"
                    class="w-full border-2 border-gray-100 p-3 rounded-xl focus:border-green-500 outline-none transition"
                    required
                  />
                </div>
                <input
                  v-model="registerData.email"
                  type="email"
                  placeholder="E-Mail"
                  class="w-full border-2 border-gray-100 p-3 rounded-xl focus:border-green-500 outline-none transition"
                  required
                />

                <select
                  v-model="registerData.role"
                  class="w-full border-2 border-gray-100 p-3 rounded-xl bg-white outline-none focus:border-green-500 transition font-bold text-gray-600"
                >
                  <option value="PRIVAT">👤 Privat-Nutzer</option>
                  <option value="ADMIN">🛡️ Admin-Nutzer</option>
                </select>

                <input
                  v-model="registerData.password"
                  type="password"
                  placeholder="Passwort wählen"
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
            <div class="bg-white p-8 rounded-3xl shadow-xl border-t-8 border-indigo-500">
              <h2 class="text-2xl font-bold mb-6 text-gray-800">
                {{ isEditing ? "📝 Bearbeiten" : "🐾 Neues Tier" }}
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
                    placeholder="Rasse"
                    class="w-full border-2 border-gray-100 p-3 rounded-xl outline-none"
                  />
                  <div class="space-y-2">
                    <label
                      class="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1"
                      >Geburtsdatum</label
                    >
                    <input
                      v-model="newPet.birthdate"
                      type="date"
                      class="w-full border-2 border-gray-100 p-3 rounded-xl focus:border-indigo-500 outline-none transition text-gray-600 font-medium"
                    />
                  </div>
                </div>
                <div class="space-y-2">
                  <label
                    class="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1"
                    >Foto auswählen</label
                  >
                  <div v-if="previewUrl" class="mt-2 mb-4 relative">
                    <div
                      class="h-40 w-full rounded-2xl overflow-hidden border-2 border-indigo-100 bg-gray-50"
                    >
                      <img
                        v-if="previewUrl"
                        :src="previewUrl"
                        class="w-full h-full object-cover"
                      />
                      <button
                        @click="clearSelection"
                        type="button"
                        class="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded-xl text-xs font-black uppercase"
                      >
                        Entfernen
                      </button>
                    </div>
                  </div>
                  <input
                    type="file"
                    @change="handleFileUpload"
                    accept="image/*"
                    class="w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-black file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 transition"
                  />
                </div>
                <div class="space-y-2">
                  <select
                    v-if="currentUser.role === 'ADMIN'"
                    v-model="newPet.ownerId"
                    class="w-full border-2 border-indigo-50 p-3 rounded-xl bg-indigo-50 font-bold text-indigo-700 outline-none"
                    required
                  >
                    <option :value="null" disabled>Besitzer wählen</option>
                    <option v-for="user in users" :key="user.id" :value="user.id">
                      {{ user.firstName }} {{ user.lastName }}
                    </option>
                  </select>

                  <div
                    v-else
                    class="w-full border-2 border-gray-100 p-3 rounded-xl bg-gray-50 font-bold text-gray-500 flex items-center"
                  >
                    <span class="mr-2">👤</span> {{ currentUser.firstName }}
                    {{ currentUser.lastName }}
                  </div>
                </div>
                <button
                  type="submit"
                  :class="isEditing ? 'bg-orange-500' : 'bg-indigo-600'"
                  class="w-full text-white py-4 rounded-xl font-black uppercase tracking-widest transition active:scale-95 shadow-lg"
                >
                  {{ isEditing ? "Änderungen speichern" : "Tier hinzufügen" }}
                </button>
                <button
                  v-if="isEditing"
                  @click="cancelEdit"
                  type="button"
                  class="w-full text-gray-400 font-bold text-xs uppercase mt-2"
                >
                  Abbrechen
                </button>
              </form>
            </div>
          </aside>

          <section class="lg:col-span-2 space-y-6">
            <div
              class="bg-white p-4 rounded-2xl shadow-sm flex flex-col md:flex-row gap-4"
            >
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
              class="flex flex-col items-center justify-center py-24 bg-white rounded-2xl shadow-inner text-indigo-600 font-bold"
            >
              <div
                class="animate-spin rounded-full h-16 w-16 border-t-4 border-indigo-600 mb-4"
              ></div>
              Lade Daten...
            </div>

            <div v-else class="space-y-12">
              <div v-if="myAccountData" class="space-y-4">
                <h3
                  class="text-indigo-600 font-black uppercase text-[10px] tracking-[0.2em] flex items-center"
                >
                  <span class="mr-2 text-base">🏠</span> Deine Lieblinge
                </h3>
                <div
                  class="bg-indigo-50 rounded-3xl p-6 border-2 border-indigo-100 shadow-inner"
                >
                  <div
                    v-if="myAccountData.pets && myAccountData.pets.length > 0"
                    class="grid grid-cols-1 md:grid-cols-2 gap-4"
                  >
                    <div
                      v-for="pet in myAccountData.pets"
                      :key="pet.id"
                      class="bg-white p-4 rounded-2xl flex justify-between items-center shadow-sm border border-indigo-50"
                    >
                      <div class="flex items-center space-x-4">
                        <div
                          class="h-16 w-16 flex-shrink-0 overflow-hidden rounded-2xl bg-indigo-100 flex items-center justify-center border-2 border-white shadow-sm"
                        >
                          <img
                            v-if="pet.imageUrl"
                            :src="`http://localhost:3000${pet.imageUrl}`"
                            class="h-full w-full object-cover"
                          />
                          <span v-else class="text-3xl">{{
                            getSpeciesIcon(pet.species)
                          }}</span>
                        </div>
                        <div>
                          <p class="font-bold text-gray-800">{{ pet.name }}</p>
                          <p class="text-[10px] text-indigo-500 font-black uppercase">
                            {{ pet.breed || "Mischling" }} • {{ getAge(pet.birthdate) }}
                          </p>
                        </div>
                      </div>
                      <div class="flex space-x-1">
                        <button
                          @click="startEdit(pet)"
                          class="p-2 text-gray-300 hover:text-indigo-600 transition"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            class="h-5 w-5"
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
                          class="p-2 text-gray-300 hover:text-red-500 transition"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            class="h-5 w-5"
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
                  <p v-else class="text-indigo-400 italic text-sm text-center py-4">
                    Du hast noch keine Tiere registriert.
                  </p>
                </div>
              </div>

              <div v-if="currentUser.role === 'ADMIN'" class="space-y-4 mb-10">
                <h3
                  class="text-green-600 font-black uppercase text-[10px] tracking-widest flex items-center"
                >
                  <span class="mr-2 text-base">🛡️</span> Nutzer-Verwaltung
                </h3>
                <div
                  class="bg-white rounded-3xl shadow-sm border-2 border-green-50 overflow-hidden"
                >
                  <table class="w-full text-left">
                    <thead
                      class="bg-green-50 text-[10px] font-black text-green-700 uppercase"
                    >
                      <tr>
                        <th class="p-4">Name</th>
                        <th class="p-4">E-Mail</th>
                        <th class="p-4">Rolle</th>
                        <th class="p-4">Aktion</th>
                      </tr>
                    </thead>
                    <tbody class="text-sm">
                      <tr
                        v-for="user in users"
                        :key="user.id"
                        class="border-b border-gray-50"
                      >
                        <td class="p-4 font-bold">
                          {{ user.firstName }} {{ user.lastName }}
                        </td>
                        <td class="p-4 text-gray-400 italic text-xs">{{ user.email }}</td>
                        <td class="p-4">
                          <span
                            :class="
                              user.role === 'ADMIN'
                                ? 'bg-amber-100 text-amber-700'
                                : 'bg-gray-100 text-gray-400'
                            "
                            class="text-[9px] font-black px-2 py-1 rounded uppercase"
                          >
                            {{ user.role }}
                          </span>
                        </td>
                        <td class="p-4">
                          <button
                            @click="removeUser(user.id)"
                            class="text-gray-300 hover:text-red-500 transition-colors p-2"
                            title="Nutzer löschen"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              class="h-5 w-5"
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
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <div class="space-y-4">
                <h3
                  class="text-gray-400 font-black uppercase text-[10px] tracking-[0.2em] flex items-center"
                >
                  <span class="mr-2 text-base">🌍</span> Community
                </h3>
                <div
                  v-for="user in communityUsers"
                  :key="user.id"
                  class="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden opacity-80 hover:opacity-100 transition-opacity"
                >
                  <div
                    class="p-4 bg-gray-50/50 flex justify-between items-center border-b border-gray-100"
                  >
                    <div class="flex items-center">
                      <span class="font-bold text-gray-700 text-sm">
                        {{ user.firstName }} {{ user.lastName }}
                      </span>

                      <span
                        v-if="user.role === 'ADMIN'"
                        class="ml-2 bg-amber-100 text-amber-700 text-[8px] px-1.5 py-0.5 rounded font-black uppercase tracking-tighter"
                      >
                        Admin
                      </span>
                    </div>

                    <span class="text-[10px] font-black text-gray-300 uppercase">
                      {{ user.pets.length }} Tiere
                    </span>
                  </div>
                  <div class="p-4 flex gap-3 overflow-x-auto">
                    <div
                      v-for="pet in user.pets"
                      :key="pet.id"
                      class="flex-shrink-0 bg-gray-50 p-3 rounded-2xl flex items-center space-x-4 border border-gray-100 shadow-sm min-w-[200px]"
                    >
                      <div
                        class="h-12 w-12 flex-shrink-0 overflow-hidden rounded-xl bg-gray-200 border-2 border-white shadow-sm"
                      >
                        <img
                          v-if="pet.imageUrl"
                          :src="`http://localhost:3000${pet.imageUrl}`"
                          class="h-full w-full object-cover"
                        />
                        <span
                          v-else
                          class="text-2xl flex items-center justify-center h-full"
                        >
                          {{ getSpeciesIcon(pet.species) }}
                        </span>
                      </div>

                      <div class="flex-1 min-w-0">
                        <p class="text-sm font-black text-gray-800 truncate">
                          {{ pet.name
                          }}<span v-if="pet.birthdate" class="text-gray-400 font-bold"
                            >, {{ getAge(pet.birthdate).split(" ")[0] }}</span
                          >
                        </p>
                        <p
                          class="text-[9px] font-bold text-indigo-500 uppercase tracking-tighter truncate"
                        >
                          {{ pet.breed || "Mischling" }}
                        </p>
                      </div>

                      <div class="flex space-x-1">
                        <button
                          @click="handleRate(pet.id, false)"
                          class="p-1.5 bg-white text-gray-300 hover:text-red-500 rounded-lg shadow-sm border border-gray-50 transition active:scale-90"
                        >
                          <span class="text-xs">❌</span>
                        </button>
                        <button
                          @click="handleRate(pet.id, true)"
                          class="p-1.5 bg-white text-gray-300 hover:text-red-500 rounded-lg shadow-sm border border-gray-50 transition active:scale-90"
                        >
                          <span class="text-xs">❤️</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import axios from "axios";

// AUTH & UI STATE
const currentUser = ref(null);
const isRegistering = ref(false);
const loading = ref(true);
const isEditing = ref(false);
const editingPetId = ref(null);
const selectedFile = ref(null);

// DATA STATES
const users = ref([]);
const loginData = ref({ email: "", password: "" });
const registerData = ref({
  email: "",
  password: "",
  firstName: "",
  lastName: "",
  role: "PRIVAT",
});
const newPet = ref({ name: "", species: "DOG", breed: "", birthdate: "", ownerId: null });

// SEARCH & FILTER
const searchQuery = ref("");
const filterSpecies = ref("ALL");

// COMPUTED STATS
const totalUsers = computed(() => {
  return currentUser.value?.role === "ADMIN" ? users.value.length : "Profil aktiv";
});

const totalPets = computed(() => {
  if (currentUser.value?.role === "ADMIN") {
    return users.value.reduce((s, u) => s + (u.pets?.length || 0), 0);
  }
  // Für Privat-Nutzer: Greift auf myAccountData zu, das bei dir schon definiert ist
  return myAccountData.value?.pets?.length || 0;
});

const avgPets = computed(() => {
  if (currentUser.value?.role === "ADMIN") {
    const totalP = users.value.reduce((s, u) => s + (u.pets?.length || 0), 0);
    return users.value.length ? (totalP / users.value.length).toFixed(1) : "0.0";
  }
  return "Privat-Modus";
});
const myAccountData = computed(() => {
  if (!currentUser.value) return null;
  return users.value.find((u) => u.id === currentUser.value.id);
});

const communityUsers = computed(() => {
  if (!currentUser.value) return filteredUsers.value;
  return filteredUsers.value.filter((u) => u.id !== currentUser.value.id);
});

const filteredUsers = computed(() => {
  return users.value.filter((user) => {
    const search = searchQuery.value.toLowerCase();
    const userMatch = `${user.firstName} ${user.lastName} ${user.email}`
      .toLowerCase()
      .includes(search);
    const petMatch = user.pets.some(
      (p) =>
        p.name.toLowerCase().includes(search) ||
        (p.breed && p.breed.toLowerCase().includes(search))
    );
    const speciesMatch =
      filterSpecies.value === "ALL" ||
      user.pets.some((p) => p.species === filterSpecies.value);
    return (userMatch || petMatch) && speciesMatch;
  });
});
const handleFileUpload = (event) => {
  // Wir nehmen die erste Datei aus der Auswahl
  selectedFile.value = event.target.files[0];
};

const clearSelection = () => {
  // 1. Wir leeren die Variable, damit die Vorschau verschwindet
  selectedFile.value = null;

  // 2. Wir müssen auch das "echte" Dateifeld im Browser leeren
  const fileInput = document.querySelector('input[type="file"]');
  if (fileInput) {
    fileInput.value = "";
  }
};
const previewUrl = computed(() => {
  // 1. Wenn ein neues Bild ausgewählt wurde: Zeige die lokale Vorschau
  if (selectedFile.value) {
    return URL.createObjectURL(selectedFile.value);
  }

  // 2. Wenn wir im Edit-Modus sind und das Tier schon ein Bild hat: Zeige das Server-Bild
  if (isEditing.value && newPet.value.imageUrl) {
    return `http://localhost:3000${newPet.value.imageUrl}`;
  }

  // 3. Sonst: Gar nichts anzeigen
  return null;
});

// ACTIONS
const fetchUsers = async () => {
  try {
    const response = await axios.get("http://localhost:3000/api/users");
    users.value = response.data;
  } finally {
    loading.value = false;
  }
};

const handleLogin = async () => {
  try {
    const response = await axios.post(
      "http://localhost:3000/api/users/login",
      loginData.value
    );
    currentUser.value = response.data;

    // NEU: Nutzer im Browser-Speicher sichern
    localStorage.setItem("user", JSON.stringify(response.data));

    fetchUsers();
  } catch (e) {
    alert("Login fehlgeschlagen!");
  }
};

const handleRegister = async () => {
  try {
    await axios.post("http://localhost:3000/api/users/register", registerData.value);
    alert("Konto erstellt! Du kannst dich jetzt einloggen.");
    isRegistering.value = false;
    registerData.value = { email: "", password: "", firstName: "", lastName: "" };
  } catch (e) {
    alert("Fehler bei Registrierung!");
  }
};

const logout = () => {
  currentUser.value = null;
  localStorage.removeItem("user");
};

const addPet = async () => {
  try {
    // 1. Wir erstellen den "Umschlag"
    const formData = new FormData();

    // 2. Wir packen alle Infos hinein
    formData.append("name", newPet.value.name);
    formData.append("species", newPet.value.species);
    formData.append("breed", newPet.value.breed || "");
    formData.append("birthdate", newPet.value.birthdate || "");
    // Wir checken: Ist es ein Admin? Dann nimm seine Auswahl.
    // Wenn nicht, nimm automatisch die ID vom eingeloggten User.
    const finalOwnerId =
      currentUser.value.role === "ADMIN" ? newPet.value.ownerId : currentUser.value.id;

    formData.append("ownerId", finalOwnerId);

    // 3. Wenn ein Foto ausgewählt wurde, packen wir es auch in den Umschlag
    if (selectedFile.value) {
      formData.append("image", selectedFile.value);
    }

    // 4. Den Umschlag per API abschicken
    if (isEditing.value) {
      await axios.put(`http://localhost:3000/api/pets/${editingPetId.value}`, formData);
    } else {
      await axios.post("http://localhost:3000/api/pets", formData);
    }

    // 5. Alles zurücksetzen und Liste neu laden
    newPet.value = { name: "", species: "DOG", breed: "", ownerId: null };
    selectedFile.value = null; // Foto-Auswahl leeren
    isEditing.value = false;
    await fetchUsers();
  } catch (e) {
    console.error("Fehler beim Speichern:", e);
    alert("Das Tier konnte nicht gespeichert werden.");
  }
};

const startEdit = (pet) => {
  selectedFile.value = null;
  isEditing.value = true;
  editingPetId.value = pet.id;

  newPet.value = {
    name: pet.name,
    species: pet.species,
    breed: pet.breed || "",
    birthdate: pet.birthdate ? pet.birthdate.split("T")[0] : "",
    ownerId: pet.ownerId,
    imageUrl: pet.imageUrl,
  };
  window.scrollTo({ top: 0, behavior: "smooth" });
};

const cancelEdit = () => {
  isEditing.value = false;
  editingPetId.value = null;
  newPet.value = { name: "", species: "DOG", breed: "", ownerId: null };
};

const removePet = async (id) => {
  if (confirm("Löschen?")) {
    await axios.delete(`http://localhost:3000/api/pets/${id}`);
    await fetchUsers();
  }
};

const removeUser = async (id) => {
  if (id === currentUser.value.id) {
    alert("Du kannst dich nicht selbst löschen!");
    return;
  }

  if (
    confirm(
      "Möchtest du diesen Nutzer wirklich löschen? Alle seine Tiere werden ebenfalls entfernt."
    )
  ) {
    try {
      await axios.delete(`http://localhost:3000/api/users/${id}`);
      await fetchUsers();
    } catch (e) {
      alert("Fehler beim Löschen des Nutzers!");
    }
  }
};

const getSpeciesIcon = (s) =>
  ({ DOG: "🐶", CAT: "🐱", BIRD: "🐦", OTHER: "🐾" }[s] || "🐾");

onMounted(() => {
  // NEU: Schauen, ob noch ein Nutzer im Speicher liegt
  const savedUser = localStorage.getItem("user");
  if (savedUser) {
    currentUser.value = JSON.parse(savedUser);
  }

  fetchUsers();
});
const getAge = (birthdate) => {
  if (!birthdate) return "Alter unbekannt";

  const birth = new Date(birthdate);
  const now = new Date();

  let years = now.getFullYear() - birth.getFullYear();
  let months = now.getMonth() - birth.getMonth();

  // Korrektur, falls der Geburtstag im aktuellen Jahr noch nicht war
  if (months < 0 || (months === 0 && now.getDate() < birth.getDate())) {
    years--;
    months += 12;
  }

  if (years > 0) {
    return `${years} ${years === 1 ? "Jahr" : "Jahre"}`;
  } else {
    return `${months} ${months === 1 ? "Monat" : "Monate"}`;
  }
};

const handleRate = async (targetPetId, isLiked) => {
  // Wir nehmen für den Test das erste Tier des aktuellen Nutzers als Absender
  if (!myAccountData.value.pets || myAccountData.value.pets.length === 0) {
    alert("Du brauchst erst ein eigenes Tierprofil, um andere zu bewerten!");
    return;
  }

  const sourcePetId = myAccountData.value.pets[0].id;

  try {
    const response = await fetch("http://localhost:3000/api/pets/rate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sourcePetId,
        targetPetId,
        isLiked,
      }),
    });

    const data = await response.json();

    if (data.isMatch) {
      alert("🎉 IT'S A MATCH! Ihr könnt jetzt chatten.");
      // Hier könnten wir später die Match-Liste aktualisieren (SU-05)
    } else {
      console.log(isLiked ? "Like gesendet" : "Dislike gesendet");
    }

    // Optional: Seite oder Liste aktualisieren, um das Tier auszublenden
  } catch (error) {
    console.error("Fehler beim Senden der Bewertung:", error);
  }
};
</script>
