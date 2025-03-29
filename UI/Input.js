import { StyleSheet, View } from "react-native";
import { TextInput } from "react-native-paper";

const Input = (props) => {
  return (
    <View style={styles.container}>
      <TextInput
        label={props.labelText}
        value={props.data}
        onChangeText={props.setData}
        mode="outlined"
        keyboardType={props.keyboardType}
        maxLength={15}
        activeOutlineColor="#008c5f"
      />
    </View>
  );
};

export default Input;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 18,
    maxHeight: 70,
    
  },
});
