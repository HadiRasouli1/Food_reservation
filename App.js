import { createDrawerNavigator } from "@react-navigation/drawer";
import { NavigationContainer } from "@react-navigation/native";
import { Pressable, SafeAreaView, StatusBar, StyleSheet } from "react-native";
import SecondPage from "./screen/SecondPage";
import FirstPage from "./screen/FirstPage";
import { Ionicons } from "@expo/vector-icons";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { PaperProvider } from "react-native-paper";
import UserInfo from "./screen/UserInfo";
import Courses from "./screen/Courses";
import OnboardingScreen from "./screen/OnboardingScreen";
import FinancialRecord from "./screen/FinancialRecord";
import Toast from "react-native-toast-message";
import LogIn from "./screen/LogIn";
import SignUp from "./screen/SignUp";
import Amniyat from "./screen/Amniyat";
import MashinSayyar from "./screen/MashinSayyar";
import Darkhastha from "./screen/Darkhastha";

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

const DrawerNavigation = () => {
  return (
    <Drawer.Navigator
      screenOptions={{
        drawerStyle: {
          backgroundColor: "#00e49a",
        },
        drawerActiveTintColor: "#008c5f",
        drawerInactiveTintColor: "white",
        headerStyle: {
          backgroundColor: "#00e49a",
        },
        headerTintColor: "white",
      }}
    >
      <Drawer.Screen name="FirstPage" component={FirstPage} />
      <Drawer.Screen
        name="SecondPage"
        component={SecondPage}
        options={({ navigation }) => ({
          headerRight: () => (
            <Pressable
              onPress={() => navigation.goBack()}
              style={styles.Pressable}
            >
              <Ionicons name="arrow-back" size={22} color={"white"} />
            </Pressable>
          ),
        })}
      />
    </Drawer.Navigator>
  );
};

export default function App() {
  const [hasSeenIntro, setHasSeenIntro] = useState(null);

  useEffect(() => {
    const checkIntro = async () => {
      const value = await AsyncStorage.getItem("hasSeenIntro");
      setHasSeenIntro(value === "true");
    };
    checkIntro();
  }, []);

  const LogOut = async (navigation) => {
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

  if (hasSeenIntro === null) {
    return null;
  }

  return (
    <>
      <StatusBar style="inverted" />
      <SafeAreaView style={styles.SafeView}>
        <PaperProvider>
          <Toast />
          <NavigationContainer>
            <Stack.Navigator
              screenOptions={{
                headerShown: false,
              }}
            >
              {!hasSeenIntro && (
                <Stack.Screen
                  name="Intro"
                  component={OnboardingScreen}
                  options={{
                    headerShown: false,
                  }}
                />
              )}
              <Stack.Screen
                name="Home"
                component={DrawerNavigation}
                options={{
                  headerShown: false,
                }}
              />
              <Stack.Screen
                name="LogIn"
                component={LogIn}
                options={{
                  headerShown: false,
                }}
              />
              <Stack.Screen
                name="SignUp"
                component={SignUp}
                options={{
                  headerShown: false,
                }}
              />
              <Stack.Screen
                name="UserInfo"
                component={UserInfo}
                options={({ navigation }) => ({
                  headerStyle: {
                    backgroundColor: "#00e49a",
                  },
                  headerTintColor: "white",
                  headerRight: () => (
                    <Pressable
                      onPress={() => LogOut(navigation)}
                      style={styles.Pressable}
                    >
                      <Ionicons
                        name="log-out-outline"
                        size={28}
                        color={"white"}
                      />
                    </Pressable>
                  ),
                })}
              />
              <Stack.Screen name="Courses" component={Courses} />
              <Stack.Screen name="Darkhstha" component={Darkhastha} />
              <Stack.Screen
                name="FinancialRecord"
                component={FinancialRecord}
              />
              <Stack.Screen name="Amniyat" component={Amniyat} />
              <Stack.Screen name="MashinSayyar" component={MashinSayyar} />
            </Stack.Navigator>
          </NavigationContainer>
        </PaperProvider>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  Pressable: {
    marginRight: 30,
  },
  SafeView: {
    flex: 1,
  },
});
