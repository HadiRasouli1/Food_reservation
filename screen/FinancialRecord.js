import { Camera } from "expo-camera";
import { CameraView } from "expo-camera";
import { useEffect, useState } from "react";
import { Text } from "react-native";
import { Button, StyleSheet, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Image } from "react-native";

const FinancialRecord = () => {
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

  const [hasPermission, setHasPermission] = useState(null);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    })();
    initialData();
  }, []);

  const [scanned, setScanned] = useState(false);

  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    alert(`Bar code with type ${type} and data ${data} has been scanned!`);
  };

  if (hasPermission === null) {
    return <Text>Requesting camera permission...</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <>
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
      <View style={styles.container}>
        <Text style={styles.HeadText}>اسکن منوی تغذیه </Text>
        <CameraView
          style={styles.absoluteFillObject}
          onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
        />
        {scanned && (
          <Button title="Tap to Scan Again" onPress={() => setScanned(false)} />
        )}
      </View>
    </>
  );
};

export default FinancialRecord;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
  },
  absoluteFillObject: {
    flex: 1,
    width: "100%",
    maxHeight: 350,
  },
  HeadText: {
    fontSize: 16,
    fontWeight: "500",
    paddingVertical: 20,
  },
});
