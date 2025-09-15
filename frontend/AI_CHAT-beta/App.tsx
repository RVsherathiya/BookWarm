import { View, Text, StyleSheet } from 'react-native'
import React, { useEffect, useState } from 'react'
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: "", // not needed for Ollama local
  baseURL: "http://localhost:11434/v1",
});

const App = () => {
  const [responseText, setResponseText] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    getResponse();
  }, []);

  const getResponse = async () => {
    try {
      const response = await client.responses.create({
        model: "llama3",
        input: "Write a one-sentence bedtime story about a unicorn."
      });
      console.log("🚀 ~ getResponse ~ response:", response)

      setResponseText(response.choices[0].message.content);
      setErrorMessage(""); // clear error if successful
    } catch (error) {
      console.log("🚀 ~ getResponse ~ error:", error);
      setErrorMessage(error.message || "Connection failed");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>AI Response</Text>
      {responseText ? (
        <Text style={styles.response}>{responseText}</Text>
      ) : (
        <Text style={styles.placeholder}>Waiting for response...</Text>
      )}
      {errorMessage ? (
        <Text style={styles.error}>⚠️ {errorMessage}</Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 10 },
  response: { fontSize: 16, color: "green", textAlign: "center" },
  placeholder: { fontSize: 16, color: "#666" },
  error: { marginTop: 15, fontSize: 14, color: "red", textAlign: "center" },
});

export default App;
