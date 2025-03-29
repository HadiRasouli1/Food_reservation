import { useEffect, useRef, useState } from "react";
import { Image, Platform, Text, TouchableOpacity } from "react-native";
import { ScrollView, View, Animated, StyleSheet } from "react-native";
import * as Notifications from "expo-notifications";
import { Alert } from "react-native";
import Toast from "react-native-toast-message";

import AsyncStorage from "@react-native-async-storage/async-storage";
import Button from "../UI/Button";
import { TextInput } from "react-native";
import { useNavigation } from "@react-navigation/native";

Notifications.setNotificationHandler({
  handleNotification: async () => {
    return {
      shouldPlaySound: false,
      shouldSetBadge: false,
      shouldShowAlert: true,
    };
  },
});
const Courses = () => {
  const navigation = useNavigation();
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

  useEffect(() => {
    const configurePushNotifications = async () => {
      const { status } = await Notifications.getPermissionsAsync();
      let finalStatus = status;
      if (finalStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== "granted") {
        Alert.alert(
          "Permission required",
          "Push notifications need the appropriate permissions"
        );
        return;
      }
      const pushTokenData = await Notifications.getExpoPushTokenAsync({
        projectId: "0250de16-05a4-45ff-9aa9-7cdacfbbec59",
      });

      if (Platform.OS === "android") {
        Notifications.setNotificationChannelAsync("default", {
          name: "default",
          importance: Notifications.AndroidImportance.DEFAULT,
        });
      }
    };

    configurePushNotifications();
    initialData();
  }, []);
  useEffect(() => {
    const subscription1 = Notifications.addNotificationReceivedListener(
      (notifications) => {
        console.log(notifications);
        const userName = notifications.request.content.data.userName;
        console.log(userName);
      }
    );

    return () => {
      subscription1.remove();
    };
  }, []);
  const ScheduleNotificationHandler = (title) => {
    Notifications.scheduleNotificationAsync({
      content: {
        title: "تایم درس مورد نظز",
        body: `${title}`,
        data: { userName: "Max" },
      },
      trigger: null,
    });
  };

  const [showInput, setShowInput] = useState(false);
  const [newSectionTitle, setNewSectionTitle] = useState("");
  const [sections, setSections] = useState([
    { id: 1, title: "امنیت", color: "#91DDCF", time: "شنبه 8 تا 10" },
    {
      id: 2,
      title: "ماشین های سیار",
      color: "#A888B5",
      time: "یکشنبه 10 تا 12",
    },
    {
      id: 3,
      title: "(خالی)",
      color: "#EFB6C8",
      time: "زمان تعیین نشده",
    },
    {
      id: 4,
      title: "(خالی)",
      color: "#FFD2A0",
      time: "زمان تعیین نشده",
    },
  ]);

  const handleButtonPress = (section) => {
    if (section.title === "ماشین های سیار") {
      navigation.navigate("MashinSayyar");
    } else if (section.title === "امنیت") {
      navigation.navigate("Amniyat");
    }

    ScheduleNotificationHandler(section.time);
    Toast.show({
      type: "success",
      text1: `${section.title}`,
      text2: `${section.time}`,
      visibilityTime: 1000,
    });
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

  const addNewclass = () => {
    setShowInput(true);
  };

  const handleSubmit = () => {
    if (newSectionTitle) {
      setSections((prevSections) => [
        ...prevSections,
        {
          id: prevSections.length + 1,
          title: newSectionTitle,
          color: "#91DDCF",
          time: "زمان تعیین نشده",
        },
      ]);
      setNewSectionTitle("");
      setShowInput(false);
      Toast.show({
        type: "success",
        text1: "درس جدید اضافه شد",
      });
    }
  };

  return (
    <>
      <ScrollView contentContainerStyle={styles.container}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "flex-start",
            justifyContent: "flex-start",
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
        <Text style={{ textAlign: "right", paddingVertical: 15 }}>
          روی هر کدام از درس ها بزنید نوتیفیکشن اون درس برایتان می اید در ضمن دو
          درس اول, صفحات مجزا دارند.
        </Text>
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
                <Text style={styles.buttonText}>{section.title}</Text>
                <Text style={styles.buttonText}>{section.time}</Text>
              </TouchableOpacity>
            </Animated.View>
          ))}
        </View>
        <Button BtnText={"اضافه کردن درس جدید +"} BtnFunc={addNewclass} />
        {showInput && (
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.DatePicker}
              placeholder="عنوان درس جدید"
              value={newSectionTitle}
              onChangeText={setNewSectionTitle}
            />
            <Button BtnText={"ثبت"} BtnFunc={handleSubmit} />
          </View>
        )}
      </ScrollView>
      <Toast />
    </>
  );
};

export default Courses;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },

  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  sectionButton: {
    width: "49%",
    height: 120,
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
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    gap: 5,
  },
  containerVideo: {
    flex: 1,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },
  video: {
    width: "100%",
    height: 300,
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
});
