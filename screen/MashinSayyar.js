import { Text, View } from "react-native";
import { Video } from "expo-av";
import { Rating } from "react-native-ratings";
import { useRef } from "react";
import { StyleSheet } from "react-native";

const MashinSayyar = () => {
  const video = useRef(null);
  return (
    <>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-around",
          paddingVertical: 25,
          borderBottomColor: "black",
          borderWidth: 1,
        }}
      >
        <View>
          <Text>دوشنبه ها ساعت 10 تا 12</Text>
          <Text>شنبه ها ساعت 4 تا 6</Text>
        </View>
        <Text>استاد محمدزاد</Text>
      </View>
      <Rating
        style={{ marginTop: 10 }}
        type="star"
        startingValue={3}
        imageSize={40}
        onFinishRating={(rating) => console.log(`Rating selected: ${rating}`)}
      />
      <Text style={{ textAlign: "right", padding: 17 }}>
        ویدیو های مرتبط با درس{" "}
      </Text>
      <View style={styles.containerVideo}>
        <Video
          ref={video}
          style={styles.video}
          source={{ uri: "https://www.w3schools.com/html/mov_bbb.mp4" }}
          useNativeControls
          resizeMode="contain"
          isLooping
        />
      </View>
    </>
  );
};

export default MashinSayyar;
const styles = StyleSheet.create({
  containerVideo: {
    flex: 1,
    marginVertical: 15,
    marginHorizontal: 15,
    maxHeight: 300,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },
  video: {
    width: "100%",
    height: 300,
  },
});
