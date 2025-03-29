import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  Animated,
  Keyboard,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import Toast from "react-native-toast-message";
import {
  useNavigation,
} from "@react-navigation/native";
import Button from "../UI/Button";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import { Modal, Portal } from "react-native-paper";

const SignUp = () => {
  const [image, setImage] = useState(null);
  // gallery Picker
  const GalleryPicker = async () => {
    if (Platform.OS !== "web") {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        alert("Sorry, we need camera roll permissions to make this work!");
        return;
      }
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      hideLogOutAlert();
    }
  };
  //

  // camera picker

  const openCamera = async () => {
    if (Platform.OS !== "web") {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== "granted") {
        alert("Sorry, we need camera permissions to take a photo!");
        return;
      }
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 4],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      hideLogOutAlert();
    }
  };
  //
  const navigation = useNavigation();
  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };
  const [name, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [ID, setID] = useState("");
  const [field, setField] = useState("");
 
  //
  const [logOutAlertVisible, setLogOutAlertVisible] = useState(false);
  const showLogOutAlert = () => setLogOutAlertVisible(true);
  const hideLogOutAlert = () => setLogOutAlertVisible(false);
  //
  const [opacityError, setOpacityError] = useState(0);

  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(opacity, {
      toValue: opacityError,
      duration: 400,
      useNativeDriver: true,
    }).start();
  }, [opacityError]);

  const SignUpUser = async () => {
    if (name && lastName && ID && field  && image) {
      const user = {
        name: name,
        lastName: lastName,
        ID: ID,
        field: field,
        image: image,
      };
      try {
        await AsyncStorage.removeItem("user");
        await AsyncStorage.removeItem("userSave");
        await AsyncStorage.setItem("user", JSON.stringify(user));
        setFirstName("");
        setID("");
        setLastName("");
        setField("");
        setImage("");

        navigation.navigate("LogIn", { SuccessSignUp: true });
      } catch (error) {
        console.error("Error saving object:", error);
      }
      setOpacityError(0);
    } else {
      setOpacityError(1);
    }
  };
  const ShowSignUpUser = async () => {
    try {
      const userString = await AsyncStorage.getItem("user");
      if (userString) {
        const user = JSON.parse(userString);
        Toast.show({
          type: "success",
          text1: `${user.name + user.lastName}`,
          text2: "اطلاعات کاربر",
          visibilityTime: 1000,
        });
      } else {
        console.log("No object found");
      }
    } catch (error) {
      console.error("Error retrieving object:", error);
    }
  };

  return (
    <>
      <TouchableWithoutFeedback onPress={dismissKeyboard}>
        <ScrollView style={{ flex: 1, backgroundColor: "#fff" }}>
          <View style={styles.Container}>
              <TextInput placeholder="Name" onChangeText={setFirstName} style={styles.DatePicker}/>
                        <TextInput placeholder="Last Name"  onChangeText={setLastName} style={styles.DatePicker}/>
                        <TextInput placeholder="ID"  onChangeText={setID} style={styles.DatePicker}/>
           
            <TextInput placeholder="Field"  onChangeText={setField} style={styles.DatePicker}/>
           
            <Pressable style={styles.ImagePicker} onPress={showLogOutAlert}>
              <Text style={{ justifyContent: "center", alignItems: "center" }}>
                {image
                  ? "عکس پروفایل انتخاب شد"
                  : "عکس پروفایلی برای خودتون انتخاب کنید"}
              </Text>
            </Pressable>
    

            <Animated.View style={{ opacity }}>
              <Text style={styles.ErrorText}>
                Enter all the inputs correctly
              </Text>
            </Animated.View>
            <View style={styles.BtnsView}>
              <Button BtnText={"Sign Up"} BtnFunc={SignUpUser} />
              <Button BtnText={"Show Sign Up user"} BtnFunc={ShowSignUpUser} />
            </View>
            <Pressable
              style={styles.lineView}
              onPress={() => navigation.navigate("LogIn")}
            >
              <View style={styles.line}>
                <Text style={styles.lineText}>قبلا ثبت نام کردی ؟ ورود</Text>
              </View>
            </Pressable>
          </View>

          <Portal>
            <Modal
              visible={logOutAlertVisible}
              onDismiss={hideLogOutAlert}
              contentContainerStyle={styles.modalContainer}
            >
              <Text style={styles.messageText}>
                یک عکس پروفایل برای خود انتخاب کنید
              </Text>
              <View
                style={{
                  flexDirection: "column",
                  justifyContent: "flex-start",
                  minWidth: "100%",
                }}
              >
                <Button BtnText={"دوربین"} BtnFunc={openCamera} />
                <Button BtnText={"گالری"} BtnFunc={GalleryPicker} />
              </View>
            </Modal>
          </Portal>
          <Toast />
        </ScrollView>
      </TouchableWithoutFeedback>
    </>
  );
};
const styles = StyleSheet.create({
  Container: {
    flex: 1,
    backgroundColor: "white",
    flexDirection: "column",
    justifyContent: "flex-start",
    // gap:15
    paddingVertical: 20,
  },
  BtnsView: {
    flexDirection: "column",
    justifyContent: "space-around",
  },
  ErrorText: {
    color: "red",
    marginHorizontal: 20,
    marginTop: 10,
  },
  Modal: {
    flex: 1,
    display: "flex",
    justifyContent: "flex-start",
    padding: 16,
    width: "100%",
    height: "40%",
  },
  TextView: {
    paddingVertical: 20,
    paddingHorizontal: 18,
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    width: "100%",
  },

  lineView: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 25,
  },
  line: {
    width: "80%",
    borderBottomWidth: 1,
    borderBottomColor: "#ababab",
    justifyContent: "center",
    alignItems: "center",
  },
  lineText: {
    borderBottomColor: "#ababab",
    position: "absolute",
    backgroundColor: "#fff",
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontWeight: "bold",
    color: "#000",
    fontSize: 14,
  },
  ImagePicker: {
    width: "92%",
    borderColor: "#8a8a8a",
    borderWidth: 1,
    height: 48,
    marginTop: 20,
    marginLeft: "4%",
    borderRadius: 6,
    justifyContent: "center",
    paddingHorizontal: 10,
  },
  DatePicker: {
    width: "92%",
    borderColor: "#8a8a8a",
    borderWidth: 1,
    height: 48,
    marginTop: 20,
    marginLeft: "4%",
    borderRadius: 6,
    justifyContent: "center",
    paddingHorizontal: 10,
  },
  modalContainer: {
    backgroundColor: "white",
    padding: 20,
    margin: 20,
    borderRadius: 6,
  },
  messageText: {
    color: "black",
    textAlign: Platform.OS === "ios" ? "right" : "left",
    paddingBottom: 12,
  },
});

export default SignUp;
