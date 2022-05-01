import { View } from "react-native";
import Editor from "./screen/editor";
import Header from "./components/header";

export default function App() {
  return (
    <View>
      <Header />
      <Editor />
    </View>
  );
}