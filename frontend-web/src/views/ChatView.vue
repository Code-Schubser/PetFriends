<template>
  <div class="flex flex-col h-[calc(100vh-160px)] max-w-2xl mx-auto bg-white shadow-2xl rounded-[3rem] overflow-hidden mt-4 mb-20">
    <header class="bg-indigo-600 p-6 text-white flex items-center space-x-4">
      <button @click="$router.back()" class="text-2xl">←</button>
      <div class="font-black text-xl uppercase tracking-tighter">Chat mit Match #{{ $route.params.matchId }}</div>
    </header>

    <div class="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50" ref="chatBox">
      <div v-for="msg in messages" :key="msg.id" 
           :class="msg.senderId === currentUser.id ? 'justify-end' : 'justify-start'" 
           class="flex">
        <div :class="msg.senderId === currentUser.id ? 'bg-indigo-600 text-white rounded-l-2xl rounded-tr-2xl' : 'bg-white text-gray-800 rounded-r-2xl rounded-tl-2xl shadow-sm'" 
             class="max-w-[80%] p-4 font-bold text-sm">
          {{ msg.content }}
          <div class="text-[9px] opacity-50 mt-1 text-right">{{ new Date(msg.sentAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) }}</div>
        </div>
      </div>
    </div>

    <footer class="p-4 bg-white border-t border-gray-100 flex gap-2">
      <input v-model="newMessage" @keyup.enter="send" type="text" placeholder="Schreibe etwas..." 
             class="flex-1 bg-gray-100 rounded-2xl px-6 py-4 outline-none focus:ring-2 ring-indigo-500 font-bold" />
      <button @click="send" class="bg-indigo-600 text-white p-4 rounded-2xl font-black uppercase text-xs tracking-widest">Senden</button>
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const currentUser = JSON.parse(localStorage.getItem('user'));
const messages = ref([]);
const newMessage = ref('');
const chatBox = ref(null);

const loadMessages = async () => {
  const res = await fetch(`http://localhost:3000/api/messages/${route.params.matchId}`);
  messages.value = await res.json();
  await nextTick();
  chatBox.value.scrollTop = chatBox.value.scrollHeight;
};

const send = async () => {
  if (!newMessage.value.trim()) return;
  const res = await fetch('http://localhost:3000/api/messages', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      matchId: route.params.matchId,
      senderId: currentUser.id,
      content: newMessage.value
    })
  });
  if (res.ok) {
    newMessage.value = '';
    loadMessages();
  }
};

onMounted(() => {
  loadMessages();
  setInterval(loadMessages, 3000); // Polling alle 3 Sekunden für "Live"-Gefühl
});
</script>