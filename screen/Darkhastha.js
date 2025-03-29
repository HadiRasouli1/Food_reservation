import axios from "axios";
import { useEffect, useState } from "react";
import { StyleSheet, Button, TextInput, View } from "react-native";
import { FlatList } from "react-native";
import { Text } from "react-native";
import Toast from "react-native-toast-message";

const Darkhastha = () => {
  const [Data, setData] = useState();
  const [editingUser, setEditingUser] = useState(null);
  const [editedName, setEditedName] = useState("");

  const FetchData = async () => {
    try {
      const res = await axios.get("https://jsonplaceholder.typicode.com/users");
      setData(res.data);
    } catch (error) {
      Toast.show({
        type: "error",
        text1: error.toString(),
        visibilityTime: 3000,
      });
    }
  };

  useEffect(() => {
    FetchData();
  }, []);

  const handleDelete = (userId) => {
    const updatedData = Data.filter((user) => user.id !== userId);
    setData(updatedData);
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setEditedName(user.name);
  };

  const handleSaveEdit = () => {
    const updatedData = Data.map((user) =>
      user.id === editingUser.id ? { ...user, name: editedName } : user
    );
    setData(updatedData);
    setEditingUser(null);
    setEditedName("");
  };

  return (
    <>
      <View style={{ flex: 1, alignItems: "center" }}>
        {editingUser ? (
          <View
            style={{
              flexDirection: "column",
              gap: 12,
              width: "90%",
              marginVertical: 10,
            }}
          >
            <TextInput
              value={editedName}
              onChangeText={setEditedName}
              style={styles.DatePicker}
            />
            <Button title="ذخیره" onPress={handleSaveEdit} />
          </View>
        ) : null}
        <FlatList
          data={Data}
          renderItem={({ item }) => {
            return (
              <View style={styles.item}>
                <View>
                  <Text>{item.name}</Text>
                  <Text>{item.email}</Text>
                </View>
                <View style={{ flexDirection: "row", gap: 10 }}>
                  <Button
                    title="ویرایش"
                    onPress={() => handleEdit(item)}
                    color="#6383ff"
                  />
                  <Button
                    title="حذف"
                    onPress={() => handleDelete(item.id)}
                    color="#ff264a"
                  />
                </View>
              </View>
            );
          }}
          keyExtractor={(item) => item.id.toString()}
          ListEmptyComponent={<Text>خالیه !</Text>}
        />
        <Toast />
      </View>
    </>
  );
};

export default Darkhastha;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#e0f7fa",
  },
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
    padding: 10,
    backgroundColor: "#e6e3e3",
    borderRadius: 5,
    width: "100%",
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
