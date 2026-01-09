<template>
  <div class="p-6 max-w-5xl mx-auto space-y-12 pb-32">
    
    <header class="flex justify-between items-end">
      <div>
        <h1 class="text-3xl font-black text-orange-600 tracking-tighter uppercase">Admin-Zentrale</h1>
        <p class="text-gray-400 font-bold uppercase text-[10px] tracking-widest">
          Systemsteuerung & Nutzerverwaltung
        </p>
      </div>
      <div class="bg-orange-100 text-orange-700 px-4 py-2 rounded-xl text-xs font-black uppercase">
        Admin-Modus Aktiv
      </div>
    </header>

    <section class="space-y-6">
      <h2 class="text-xl font-black text-gray-800 uppercase tracking-tighter ml-2">Registrierte Nutzer</h2>
      <div class="bg-white rounded-[2.5rem] shadow-xl overflow-hidden border border-gray-100">
        <table class="w-full text-left border-collapse">
          <thead class="bg-gray-50 text-gray-400 text-[10px] font-black uppercase tracking-widest">
            <tr>
              <th class="px-8 py-5">Name & Kontakt</th>
              <th class="px-8 py-5">Rolle</th>
              <th class="px-8 py-5 text-right">Aktionen</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-50">
            <tr v-for="u in users" :key="u.id" class="hover:bg-orange-50/30 transition-colors group">
              <td class="px-8 py-5">
                <div class="font-black text-gray-800">{{ u.firstName }} {{ u.lastName }}</div>
                <div class="text-xs text-gray-400 font-bold tracking-tight">{{ u.email }}</div>
              </td>
              <td class="px-8 py-5">
                <span :class="u.role === 'ADMIN' ? 'bg-orange-100 text-orange-600' : 'bg-blue-100 text-blue-600'" 
                      class="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter">
                  {{ u.role }}
                </span>
              </td>
              <td class="px-8 py-5 text-right space-x-3">
                <button @click="openEditModal(u)" class="text-indigo-600 font-black text-[10px] uppercase tracking-widest hover:underline">
                  Bearbeiten
                </button>
                <button @click="deleteUser(u.id)" class="text-red-400 font-black text-[10px] uppercase tracking-widest hover:underline">
                  Löschen
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <section class="bg-gray-900 rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden">
      <div class="absolute -right-10 -bottom-10 text-[12rem] opacity-5 rotate-12 pointer-events-none">🦴</div>

      <div class="relative z-10">
        <h2 class="text-2xl font-black mb-1 tracking-tighter uppercase">Tierarten verwalten</h2>
        <p class="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-8">
          Verfügbare Optionen für das Matching-System
        </p>
        
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-10">
          <div v-for="s in species" :key="s" class="bg-gray-800 p-5 rounded-2xl border border-gray-700 flex justify-between items-center group hover:border-orange-500/50 transition-all">
            <span class="font-black text-sm tracking-tight">{{ s }}</span>
            <div class="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button @click="renameSpeciesPrompt(s)" class="p-2 bg-gray-700 rounded-lg text-orange-400 hover:bg-orange-400 hover:text-white transition-colors">
                ✏️
              </button>
              <button @click="deleteSpecies(s)" class="p-2 bg-gray-700 rounded-lg text-red-400 hover:bg-red-400 hover:text-white transition-colors">
                🗑️
              </button>
            </div>
          </div>
        </div>

        <div class="flex gap-3 bg-gray-800 p-2 rounded-[1.8rem] border border-gray-700 max-w-lg">
          <input 
            v-model="newSpeciesName" 
            @keyup.enter="addSpeciesLocal"
            type="text" 
            placeholder="Neue Art (z.B. Reptil)..." 
            class="flex-1 bg-transparent border-none p-4 text-sm font-bold outline-none px-6" 
          />
          <button 
            @click="addSpeciesLocal" 
            class="bg-orange-600 px-8 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-orange-700 transition shadow-lg"
          >
            Hinzufügen
          </button>
        </div>
      </div>
    </section>

    <div v-if="editUserData" class="fixed inset-0 bg-black/70 backdrop-blur-md z-[2000] flex items-center justify-center p-4">
      <div class="bg-white w-full max-w-md rounded-[2.5rem] p-10 shadow-2xl">
        <h2 class="text-3xl font-black text-gray-800 mb-2 tracking-tighter">Profil bearbeiten</h2>
        <p class="text-gray-400 text-[10px] font-black uppercase mb-8 tracking-widest">Stammdaten des Nutzers</p>
        
        <form @submit.prevent="updateUser" class="space-y-4">
          <div class="grid grid-cols-2 gap-3">
            <div class="space-y-1">
              <label class="text-[9px] font-black uppercase text-gray-400 ml-2">Vorname</label>
              <input v-model="editUserData.firstName" type="text" class="w-full p-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 ring-orange-500 transition" />
            </div>
            <div class="space-y-1">
              <label class="text-[9px] font-black uppercase text-gray-400 ml-2">Nachname</label>
              <input v-model="editUserData.lastName" type="text" class="w-full p-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 ring-orange-500 transition" />
            </div>
          </div>

          <div class="space-y-1">
            <label class="text-[9px] font-black uppercase text-gray-400 ml-2">E-Mail Adresse</label>
            <input v-model="editUserData.email" type="email" class="w-full p-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 ring-orange-500 transition" />
          </div>

          <div class="space-y-1">
            <label class="text-[9px] font-black uppercase text-gray-400 ml-2">System-Rolle</label>
            <select v-model="editUserData.role" class="w-full p-4 bg-gray-50 rounded-2xl outline-none font-bold focus:ring-2 ring-orange-500 transition appearance-none">
              <option value="PRIVAT">PRIVATNUTZER</option>
              <option value="INSTITUTION">INSTITUTION / TIERHEIM</option>
              <option value="ADMIN">ADMINISTRATOR</option>
            </select>
          </div>

          <div class="flex gap-4 pt-8">
            <button type="button" @click="editUserData = null" class="flex-1 py-4 font-black uppercase text-[10px] text-gray-400 tracking-widest hover:text-gray-600 transition">Abbrechen</button>
            <button type="submit" class="flex-1 bg-orange-600 text-white py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl hover:bg-orange-700 transition">Änderungen Speichern</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const users = ref([]);
const species = ref([]);
const editUserData = ref(null);
const newSpeciesName = ref('');

// DATEN LADEN
const loadData = async () => {
  try {
    const [uRes, sRes] = await Promise.all([
      fetch('http://localhost:3000/api/users'),
      fetch('http://localhost:3000/api/pets/species')
    ]);
    users.value = await uRes.json();
    species.value = await sRes.json();
  } catch (error) {
    console.error("Fehler beim Laden der Admin-Daten:", error);
  }
};

// NUTZER BEARBEITEN
const openEditModal = (user) => {
  editUserData.value = { ...user };
};

const updateUser = async () => {
  try {
    const res = await fetch(`http://localhost:3000/api/users/${editUserData.value.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editUserData.value)
    });
    if (res.ok) {
      editUserData.value = null;
      await loadData();
    }
  } catch (error) {
    alert("Fehler beim Aktualisieren des Nutzers.");
  }
};

// NUTZER LÖSCHEN (ADM-02)
const deleteUser = async (id) => {
  if (confirm("Nutzer endgültig löschen? Alle zugehörigen Tierprofile gehen verloren!")) {
    try {
      const res = await fetch(`http://localhost:3000/api/users/${id}`, { method: 'DELETE' });
      if (res.ok) await loadData();
    } catch (error) {
      alert("Löschen fehlgeschlagen.");
    }
  }
};

// ARTEN-MANAGEMENT
const addSpeciesLocal = () => {
  const name = newSpeciesName.value.trim();
  if (name && !species.value.includes(name)) {
    species.value.push(name);
    newSpeciesName.value = '';
    alert(`Hinweis: '${name}' ist jetzt in der Liste. Sie wird permanent in der DB gespeichert, sobald das erste Tier damit angelegt wurde.`);
  }
};

const renameSpeciesPrompt = async (oldName) => {
  const newName = prompt(`Neuer Name für die Art '${oldName}':`, oldName);
  if (newName && newName !== oldName) {
    try {
      const res = await fetch('http://localhost:3000/api/pets/species/rename', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ oldName, newName })
      });
      if (res.ok) await loadData();
    } catch (error) {
      alert("Fehler beim Umbenennen.");
    }
  }
};

const deleteSpecies = async (name) => {
  if (confirm(`Soll die Art '${name}' wirklich gelöscht werden? Betroffene Tiere werden zu 'Sonstiges' verschoben.`)) {
    try {
      const res = await fetch(`http://localhost:3000/api/pets/species/${name}`, {
        method: 'DELETE'
      });
      if (res.ok) await loadData();
    } catch (error) {
      alert("Fehler beim Entfernen der Art.");
    }
  }
};

onMounted(loadData);
</script>