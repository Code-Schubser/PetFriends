const axios = require('axios');

async function createPet() {
  try {
    const response = await axios.post('http://localhost:3000/api/pets', {
      name: "Bello",
      species: "DOG",
      breed: "Golden Retriever",
      description: "Ein sehr verspielter Hund.",
      ownerId: 1 // Die ID deines Users 'Dennis'
    });
    console.log("------------------------------------");
    console.log("ERFOLG! Haustier wurde angelegt:");
    console.log(response.data);
    console.log("------------------------------------");
  } catch (error) {
    console.error("FEHLER beim Test:", error.response ? error.response.data : error.message);
  }
}

createPet();