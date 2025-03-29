import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Button } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

const OnboardingScreen = () => {
  const navigation = useNavigation();
  const [currentPage, setCurrentPage] = useState(0);

  const pages = [
    { id: 1, content: "Welcome to Our App!" },
    { id: 2, content: "Discover Amazing Features!" },
    { id: 3, content: "Let’s Get Started!" },
  ];

  const handleNext = () => {
    if (currentPage < pages.length - 1) {
      setCurrentPage(currentPage + 1);
    } else {
      finishOnboarding();
    }
  };

  const finishOnboarding = async () => {
    await AsyncStorage.setItem("hasSeenIntro", "true");
    navigation.replace("Home");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.content}>{pages[currentPage].content}</Text>

      <Button
         
        title={currentPage === pages.length - 1 ? "Get Started" : "Next"}
        onPress={handleNext}
        
      />

      <View style={styles.paginationContainer}>
        {pages.map((_, index) => (
          <TouchableOpacity
            key={index}
            style={styles.dot(currentPage === index)}
          />
        ))}
      </View>
    </View>
  );
};

export default OnboardingScreen;

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "space-around", alignItems: "center" },
  content: { fontSize: 18, marginBottom: 20, textAlign: "center" },
  paginationContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 20,
  },
  dot: (isActive) => ({
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 5,
    backgroundColor: isActive ? "#007BFF" : "#D3D3D3",
  }),
});
