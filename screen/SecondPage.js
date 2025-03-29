import { StyleSheet, View } from "react-native";
import Button from "../UI/Button";
import AsyncStorage from "@react-native-async-storage/async-storage";

const SecondPage = () => {
  const DeleteSeenIntro = async () => {
    await AsyncStorage.removeItem("hasSeenIntro");
  };

  return (
    <View style={styles.container}>
      <Button BtnText={"Delete seen Intro"} BtnFunc={DeleteSeenIntro} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#e0f7fa",
  },
});

export default SecondPage;
