import { LinearGradient } from "expo-linear-gradient";
import { Pressable, StyleSheet, Text, View } from "react-native";

const Button = (props) => {
  return (
    <Pressable
      onPress={props.BtnFunc}
      android_ripple={{ color: "white" }}
      style={styles.Pressable}
    >
      <LinearGradient
        colors={["#01ca89", "#00a36e"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.Container}
      >
        <View>
          <Text style={styles.Text}>{props.BtnText}</Text>
        </View>
      </LinearGradient>
    </Pressable>
  );
};
export default Button;

const styles = StyleSheet.create({
  Pressable: {
    marginVertical:7,
    marginHorizontal: 14,
    borderRadius: 6,
    overflow: "hidden",
  },
  Container: {
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    borderRadius: 6,
    height: 42,
    backgroundColor: "#013270",
    paddingHorizontal: 12,
  },
  Text: {
    color: "white",
    fontSize: 14,
  },
});
