<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-100 p-4">
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
        <div class="flex gap-2 mb-4">
          <button
            type="button"
            @click="registerData.role = 'PRIVAT'"
            :class="
              registerData.role === 'PRIVAT'
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 text-gray-500'
            "
            class="flex-1 py-2 rounded-xl text-xs font-bold transition"
          >
            👤 Privatperson
          </button>
          <button
            type="button"
            @click="registerData.role = 'INSTITUTION'"
            :class="
              registerData.role === 'INSTITUTION'
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 text-gray-500'
            "
            class="flex-1 py-2 rounded-xl text-xs font-bold transition"
          >
            🏠 Institution
          </button>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <input
            v-model="registerData.firstName"
            type="text"
            :placeholder="registerData.role === 'PRIVAT' ? 'Vorname' : 'Ansprechpartner'"
            class="w-full border-2 border-gray-100 p-4 rounded-2xl outline-none focus:border-green-500 transition"
            required
          />
          <input
            v-model="registerData.lastName"
            type="text"
            :placeholder="
              registerData.role === 'PRIVAT' ? 'Nachname' : 'Institutionsname'
            "
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

        <p class="text-[10px] text-gray-400 px-2 italic">
          Mit der Registrierung stimmst du der DSGVO-Richtlinie zu.
        </p>

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
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const isRegistering = ref(false);

const loginData = ref({ email: "", password: "" });
const registerData = ref({
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  role: "PRIVAT", // Standardrolle laut Akteursmodell
});

const handleLogin = async () => {
  try {
    // URL angepasst an dein Backend index.js (app.use('/api/users', ...))
    const response = await fetch("http://localhost:3000/api/users/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(loginData.value),
    });

    if (response.ok) {
      const userData = await response.json();
      // Wir speichern das User-Objekt direkt, da dein Controller aktuell keinen Token sendet
      localStorage.setItem("user", JSON.stringify(userData));
      router.push("/"); // Weiterleitung zum Dashboard (FD-01)
    } else {
      const errorData = await response.json();
      alert(errorData.error || "Login fehlgeschlagen");
    }
  } catch (error) {
    console.error("Netzwerkfehler beim Login:", error);
    alert("Server nicht erreichbar. Prüfe dein Backend!");
  }
};

const handleRegister = async () => {
  try {
    // URL angepasst an dein Backend index.js
    const response = await fetch("http://localhost:3000/api/users/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(registerData.value),
    });

    if (response.ok) {
      isRegistering.value = false;
      alert("Konto erstellt! Bitte einloggen.");
    } else {
      const errorData = await response.json();
      alert(errorData.error || "Registrierung fehlgeschlagen");
    }
  } catch (error) {
    alert("Registrierung fehlgeschlagen. Prüfe die Verbindung.");
  }
};
</script>
