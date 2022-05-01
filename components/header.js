import React from "react";
import { StyleSheet, Text, View, Platform, StatusBar } from "react-native";

const Header = () => {
  return (
      <View style={styles.header}>
        <Text style={styles.headerText}>Public Service App</Text>
      </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flex: 1,
    position: "absolute",
    backgroundColor: "#009fff",
    width: "100%",
    height: 70,
    alignItems: "center",
    justifyContent: "center",
    marginTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    elevation: 20,
    shadowColor: "#52006A",
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#ffffff",
  },
});

export default Header;