import { StyleSheet, View } from "react-native";
import Button from "../UI/Button";
import { useNavigation } from "@react-navigation/native";
import Toast from "react-native-toast-message";

const FirstPage = () => {
  const navigation = useNavigation();
  const ShowAlert = () => {
    Toast.show({
      type: "success",
      text1: "Information",
      text2: "hello",
      visibilityTime: 2000,
    });
  };
  const NavigateLogIn = () => {
    navigation.navigate("LogIn");
  };
  return (
    <>
      <View style={styles.container}>
        <View style={styles.BtnView}>
          {/* <Button BtnText={"Alert"} BtnFunc={ShowAlert} /> */}
          <Button BtnText={"Log In"} BtnFunc={NavigateLogIn} />
        </View>
        <View style={styles.toastView}>
          <Toast />
        </View>
      </View>
    </>
  );
};
export default FirstPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "flex-start",
  },
  BtnView: {
    flex: 1,
    justifyContent: "flex-start",
    flexDirection: "column",
    width: "100%",
  },
  toastView: {
    flex: 1,
  },
});
