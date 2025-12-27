} catch (error) {
    if (error.response) {
      // Der Server hat geantwortet, aber mit einem Fehler (z.B. 400 oder 500)
      console.error("Server-Fehler:", error.response.data);
    } else {
      // Es gab gar keine Antwort (Server ist wahrscheinlich aus)
      console.error("Netzwerk-Fehler: Ist der Server gestartet?", error.message);
    }
  }