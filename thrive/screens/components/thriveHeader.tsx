import React from "react";
import Feather from "@expo/vector-icons/Feather";
import { Text, View, TouchableOpacity, StyleSheet, Image } from "react-native";

const thriveHeader: React.FC = () => {
  return (
    <>
      <View style={thriveHeaderStyles.container}>
        <Image
          style={{
            width: "100%",
            height: "100%",
          }}
          source={require("../../assets/thrive.png")}
        />
      </View>
    </>
  );
};
const thriveHeaderStyles = StyleSheet.create({
  header: {},
  container: {
    backgroundColor: "transparent",
    display: "flex",
    alignItems: "center",
    height: 90,
    width: 200,
    marginHorizontal: "auto",
    paddingTop: 10,
    paddingBottom: 10,
  },
});

export default thriveHeader;
