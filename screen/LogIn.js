import {
  useCallback,
  useEffect,
  useLayoutEffect,
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
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import Button from "../UI/Button";
import Toast from "react-native-toast-message";
import { useNavigation, useRoute } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as LocalAuthentication from "expo-local-authentication";

const LogIn = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };
  const [name, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [ID, setID] = useState("");
  const [field, setField] = useState("");

  useLayoutEffect(() => {
    if (route.params && route.params.SuccessSignUp) {
      Toast.show({
        type: "success",
        text1: "Sign Up succesfull and Data saved",
        text2: "New student registered.",
        visibilityTime: 1000,
      });
      setFirstName("");
      setID("");
      setLastName("");
      setField("");
      route.params.SuccessSignUp = null;
    }
  }, [route.params]);

  const [opacityError, setOpacityError] = useState(0);

  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(opacity, {
      toValue: opacityError,
      duration: 400,
      useNativeDriver: true,
    }).start();
  }, [opacityError]);

  //

  const LogIn = async () => {
    try {
      const userString = await AsyncStorage.getItem("user");

      const user = JSON.parse(userString);
      if (
        name &&
        lastName &&
        field &&
        ID &&
        name === user.name &&
        lastName === user.lastName &&
        ID === user.ID &&
        field === user.field
      ) {
        setFirstName("");
        setLastName("");
        setID("");
        setField("");
        setOpacityError(0);
        navigation.reset({
          index: 0,
          routes: [{ name: "UserInfo", params: { LogInSuccess: true } }],
        });
      } else {
        setOpacityError(1);
      }
    } catch (error) {
      setOpacityError(1);
    }
  };

  const authenticate = async () => {
    try {
      const isCompatible = await LocalAuthentication.hasHardwareAsync();
      if (!isCompatible) {
        alert("دستگاه شما از احراز هویت بیومتریک پشتیبانی نمی‌کند.");
        return;
      }

      const savedBiometrics = await LocalAuthentication.isEnrolledAsync();
      if (!savedBiometrics) {
        alert("هیچ اثر انگشت یا بیومتریکی ثبت نشده است.");
        return;
      }

      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: "ورود با اثر انگشت",
        fallbackLabel: "استفاده از رمز عبور",
      });

      if (result.success) {
        navigation.reset({
          index: 0,
          routes: [{ name: "UserInfo", params: { LogInSuccess: true } }],
        });
        alert("احراز هویت موفقیت‌آمیز بود!");
      } else {
        alert("احراز هویت ناموفق بود.");
      }
    } catch (error) {
      console.log("Error during authentication:", error);
    }
  };

  const [isBlack, setIsBlack] = useState(false);

  const handlePress = async () => {
    setIsBlack((prevState) => !prevState);

    if (isBlack) {
      await AsyncStorage.removeItem("userSave");
    } else {
      const userString = await AsyncStorage.getItem("user");
      await AsyncStorage.setItem("userSave", userString);
    }
  };

  const fetchData = useCallback(async () => {
    try {
      const userSave = await AsyncStorage.getItem("userSave");
      if (userSave) {
        const res = JSON.parse(userSave);
        setFirstName(res.name || "");
        setLastName(res.lastName || "");
        setField(res.field || "");
        setID(res.ID || "");
        setIsBlack(true);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <>
      <TouchableWithoutFeedback onPress={dismissKeyboard}>
        <ScrollView style={{ flex: 1, backgroundColor: "#fff" }}>
          <View style={styles.Container}>
            <TextInput
              value={name}
              placeholder="Name"
              onChangeText={setFirstName}
              style={styles.DatePicker}
            />

            <TextInput
              value={lastName}
              placeholder="Last Name"
              onChangeText={setLastName}
              style={styles.DatePicker}
            />
            <TextInput
              value={ID}
              placeholder="ID"
              onChangeText={setID}
              style={styles.DatePicker}
            />

            <TextInput
              value={field}
              placeholder="Field"
              onChangeText={setField}
              style={styles.DatePicker}
            />
            <TouchableOpacity style={styles.container} onPress={handlePress}>
              <View
                style={[
                  styles.button,
                  { backgroundColor: isBlack ? "#141414" : "white" },
                ]}
              />
              <Text>ذخیره اطلاعت</Text>
            </TouchableOpacity>

            <Animated.View style={{ opacity }}>
              <Text style={styles.ErrorText}>
                Enter all the inputs correctly
              </Text>
            </Animated.View>
            <View style={styles.BtnsView}>
              <Button BtnText={"Log In"} BtnFunc={LogIn} />
              <Button BtnText={"fingerprint"} BtnFunc={authenticate} />
            </View>
            <Pressable
              style={styles.lineView}
              onPress={() => navigation.navigate("SignUp")}
            >
              <View style={styles.line}>
                <Text style={styles.lineText}>
                  هنوز ثبت نام نکردی ؟ ثبت نام
                </Text>
              </View>
            </Pressable>

            <Toast />
          </View>
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
    // gap:15,
    paddingVertical: 20,
    minHeight: 800,
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
  TextViewLeft: {
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    width: 120,
  },
  TextViewRight: {
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
  },
  HeaderText: {
    fontWeight: "800",
    fontSize: 20,
    paddingHorizontal: 18,
    marginVertical: 14,
    color: "#00e49a",
  },
  text1: {
    fontWeight: "400",
    fontSize: 18,
  },
  text2: {
    fontWeight: "300",
    fontSize: 18,
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
  emailView: {
    width: "92%",
    marginLeft: "4%",
    flexDirection: Platform.OS === "ios" ? "row-reverse" : "row",
    alignItems: "center",
    justifyContent: "flex-start",
    gap: 8,
    marginTop: 10,
  },
  radioItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  RuleText: {
    color: "black",
  },

  container: {
    justifyContent: "flex-start",
    alignItems: "center",
    paddingTop: 12,
    paddingHorizontal: 20,
    flexDirection: "row",
    gap: 10,
  },
  button: {
    width: 20,
    height: 20,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: "#474747",
  },
});

export default LogIn;
