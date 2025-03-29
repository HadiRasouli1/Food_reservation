import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Animated, StyleSheet, TouchableOpacity } from "react-native";
import { Image, ScrollView, Text, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import Toast from "react-native-toast-message";
import Button from "../UI/Button";

const UserInfo = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [image, setImage] = useState();
  const [name, setName] = useState();
  const [field, setField] = useState();

  const initialData = async () => {
    try {
      const userString = await AsyncStorage.getItem("user");
      if (userString) {
        const user = JSON.parse(userString);
        setImage(user.image);
        setName(user.name + user.lastName);
        setField(user.field);
      } else {
        console.log("No object found");
      }
    } catch (error) {
      console.error("Error retrieving object:", error);
    }
  };
  useLayoutEffect(() => {
    initialData();
  }, []);

  useLayoutEffect(() => {
    if (route.params && route.params.LogInSuccess) {
      Toast.show({
        type: "success",
        text1: "Log In Successful!",
        text2: "New student registered.",
        visibilityTime: 1000,
      });
      route.params.LogInSuccess = null;
    }
  }, [route.params]);

  const sections = [
    { id: 1, title: "تغذیه", color: "#91DDCF", icon: "restaurant" },
    { id: 2, title: "لیست دروس", color: "#A888B5", icon: "library-books" },
    { id: 3, title: "(خالی)  ", color: "#EFB6C8", icon: "work-outline" },
    { id: 4, title: "(خالی) ", color: "#FFD2A0", icon: "schedule" },
    { id: 5, title: "درخواست ها", color: "#b682ff", icon: "help-outline" },
    { id: 6, title: "(خالی)", color: "#BFECFF", icon: "grade" },
  ];
  const handleButtonPress = (section) => {
    if (section.title === "لیست دروس") {
      navigation.navigate("Courses");
    } else if (section.title === "تغذیه") {
      navigation.navigate("FinancialRecord");
    } else if (section.title === "درخواست ها") {
      navigation.navigate("Darkhstha");
    }
  };

  const sectionsAnim = useRef(new Animated.Value(-300)).current;
  useEffect(() => {
    Animated.stagger(150, [
      Animated.timing(sectionsAnim, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const LogOut = async () => {
    await AsyncStorage.clear();
    navigation.reset({
      index: 0,
      routes: [{ name: "Home" }],
    });
    Toast.show({
      type: "success",
      text1: "Log out succesfull and Data removed",
      text2: "removed studend data",
      visibilityTime: 1000,
    });
  };

  return (
    <>
      <Button BtnText={"Log Out"} BtnFunc={LogOut} />
      <View
        style={{
          flexDirection: "row",
          alignItems: "flex-start",
          justifyContent: "flex-start",
          padding: 15,
        }}
      >
        {image ? (
          <Image
            source={{ uri: image }}
            style={{
              width: 100,
              height: 100,
              borderRadius: 100,
              marginHorizontal: 10,
            }}
          />
        ) : (
          <Text>Loading image...</Text>
        )}
        <View>
          {name ? <Text>{name}</Text> : <Text>Loading name...</Text>}
          {field ? <Text>{field}</Text> : <Text>Loading field...</Text>}
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.gridContainer}>
          {sections.map((section) => (
            <Animated.View
              key={section.id}
              style={[
                styles.sectionButton,
                {
                  backgroundColor: section.color,
                  transform: [{ translateX: sectionsAnim }],
                },
              ]}
            >
              <TouchableOpacity
                key={section.id}
                style={styles.sectionButtonInner}
                onPress={() => handleButtonPress(section)}
              >
                <MaterialIcons name={section.icon} size={25} color="black" />
                <Text style={styles.buttonText}>{section.title}</Text>
              </TouchableOpacity>
            </Animated.View>
          ))}
        </View>
      </ScrollView>

      <Toast />
    </>
  );
};

export default UserInfo;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  headline: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#333",
  },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  sectionButton: {
    width: "49%",
    height: 140,
    borderRadius: 10,
    marginVertical: 5,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 5,
  },
  sectionButtonInner: {
    flex: 1,
    height: "100%",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 5,
  },

  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
