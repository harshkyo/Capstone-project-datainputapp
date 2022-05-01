import React from "react";
import { useState, useEffect } from "react";
import {
  Text,
  KeyboardAvoidingView,
  SafeAreaView,
  ScrollView,
  Button,
  StatusBar,
  View,
  StyleSheet,
  Dimensions,
  TextInput,
} from "react-native";
import {
  actions,
  RichEditor,
  RichToolbar,
} from "react-native-pell-rich-editor";
import DropDownPicker from "react-native-dropdown-picker";
import axios from "axios";

const Editor = () => {
  useEffect(() => {
    viewService();
  }, [isid]);
  const richText = React.useRef();
  const scrollViewRef = React.useRef();
  const [userInfo, setuserInfo] = useState({
    service: null,
    subservice: null,
    information: null,
  });
  const [openservice, setOpenservice] = useState(false);
  const [servicevalue, setserviceValue] = useState(null);
  const [serviceitems, setserviceItems] = useState([
    {
      label: "New",
      value: "New",
    },
  ]);
  const [opensubservice, setOpensubservice] = useState(false);
  const [subservicevalue, setsubserviceValue] = useState(null);
  const [subserviceitems, setsubserviceItems] = useState([
    {
      id: "0",
      label: "New",
      value: "New",
    },
  ]);
  const [isnewservice, setisnewservice] = useState(false);
  const [isnewsubservice, setisnewsubservice] = useState(false);
  const [isid, setid] = useState(null);

  const onservice = (value) => {
    setuserInfo({ ...userInfo, service: value });
  };

  const onsubservice = (value) => {
    setuserInfo({ ...userInfo, subservice: value });
  };

  const oninformation = (value) => {
    setuserInfo({ ...userInfo, information: value });
  };

  const viewService = async () => {
    // console.log("1");
    try {
      await axios
        .get(`https://public-service-api.herokuapp.com/services`)
        .then((res) => {
          if (res.data.success === true) {
            let result = res.data.listall.map((a) => ({
              label: a.service,
              value: a.service,
            }));

            result = [
              ...result,
              {
                label: "New",
                value: "New",
              },
            ];
            setserviceItems(result);
          }
        });
    } catch (error) {
      throw error;
    }
  };

  const viewSubService = async (value) => {
    try {
      // console.log("2");
      await axios
        .get(`https://public-service-api.herokuapp.com/subServices`, {
          params: { service: value },
        })
        .then((res) => {
          if (res.data.success === true) {
            let result = res.data.listall.map((a) => ({
              id: a.id,
              label: a.subservice,
              value: a.subservice,
            }));
            result = [
              ...result,
              {
                id: "0",
                label: "New",
                value: "New",
              },
            ];
            setsubserviceItems(result);
          }
        });
    } catch (error) {
      throw error;
    }
  };

  const viewDetail = async (value) => {
    try {
      // console.log(value);
      await axios
        .get(`https://public-service-api.herokuapp.com/information`, {
          params: { id: value },
        })
        .then((res) => {
          if (res.data.success === true) {
            let resultinfo = res.data.listall.map((a) => a.information);
            oninformation(resultinfo[0]);
          }
        });
    } catch (error) {
      throw error;
    }
  };

  const newSubService = async () => {
    try {
      // console.log(value);
      await axios
        .post(
          `https://public-service-api.herokuapp.com/addSubService`,
          userInfo
        )
        .then((res) => {
          if (res.data.success === true) {
            setuserInfo({
              service: null,
              subservice: null,
              information: null,
            });
            setsubserviceValue(null);
            setserviceValue(null);
            setid(null);
            setisnewservice(null);
            setisnewsubservice(null);
          }
        });
    } catch (error) {
      throw error;
    }
  };

  const editSubService = async () => {
    try {
      const value = {
        service: userInfo.service,
        subservice: subservicevalue,
        information: userInfo.information,
        id: isid,
      };
      await axios
        .post(`https://public-service-api.herokuapp.com/editSubService`, value)
        .then((res) => {
          if (res.data.success === true) {
            setuserInfo({
              service: null,
              subservice: null,
              information: null,
            });
            setsubserviceValue(null);
            setserviceValue(null);
            setid(null);
            setisnewservice(null);
            setisnewsubservice(null);
          }
        });
    } catch (error) {
      throw error;
    }
  };

  const deleteSubservice = async () => {
    try {
      // console.log(value);
      await axios
        .get(`https://public-service-api.herokuapp.com/delete`, {
          params: { id: isid },
        })
        .then((res) => {
          if (res.data.success === true) {
            setuserInfo({
              service: null,
              subservice: null,
              information: null,
            });
            setsubserviceValue(null);
            setserviceValue(null);
            setid(null);
            setisnewservice(null);
            setisnewsubservice(null);
          }
        });
    } catch (error) {
      throw error;
    }
  };

  return (
    <View>
      <SafeAreaView>
        <View style={styles.container}>
          <View
            style={{
              justifyContent: "space-between",
              flexDirection: "row",
              height: 40,
              marginVertical: 10,
              marginHorizontal: 30,
            }}
          >
            <Button
              title="Clear"
              onPress={() => {
                setuserInfo({
                  service: null,
                  subservice: null,
                  information: null,
                });
                setsubserviceValue(null);
                setserviceValue(null);
                setid(null);
                setisnewservice(null);
                setisnewsubservice(null);
              }}
            />
            {(isid != null && isid != "0") && <Button
              title="Delete"
              onPress={() => {
                deleteSubservice();
              }}
            />}
            <Button
              title="save"
              onPress={() => {
                if (subservicevalue == "New") {
                  newSubService();
                }
                if (subservicevalue != null && subservicevalue != "") {
                  editSubService();
                }
              }}
            />
          </View>
          <KeyboardAvoidingView style={{ flex: 1 }}>
            <ScrollView ref={scrollViewRef}>
              <View style={styles.editorcontainer}>
                <Text
                  style={{
                    width: "95%",
                    alignSelf: "center",
                    marginTop: 10,
                  }}
                >
                  Service:
                </Text>
                <DropDownPicker
                  zIndex={3000}
                  zIndexInverse={1000}
                  open={openservice}
                  value={servicevalue}
                  items={serviceitems}
                  setOpen={setOpenservice}
                  setValue={setserviceValue}
                  setItems={setserviceItems}
                  listMode="SCROLLVIEW"
                  onSelectItem={(item) => {
                    setid(null);
                    if (item.value != "New") {
                      setisnewservice(false);
                      onservice(item.value);
                      viewSubService(item.value);
                    } else {
                      setisnewservice(true);
                      setsubserviceValue({
                        id: "0",
                        label: "New",
                        value: "New",
                      });
                    }
                  }}
                />

                {isnewservice && (
                  <TextInput
                    style={{
                      width: "100%",
                      alignSelf: "center",
                      borderWidth: 1,
                      borderRadius: 5,
                      paddingHorizontal: 10,
                      backgroundColor: "white",
                      marginTop: 10,
                    }}
                    onChangeText={(value) => {
                      onservice(value);
                    }}
                  />
                )}
                <Text
                  style={{
                    width: "95%",
                    alignSelf: "center",
                    marginTop: 20,
                  }}
                >
                  Subservice:
                </Text>
                <DropDownPicker
                  zIndex={2000}
                  zIndexInverse={2000}
                  open={opensubservice}
                  value={subservicevalue}
                  items={subserviceitems}
                  setOpen={setOpensubservice}
                  setValue={setsubserviceValue}
                  setItems={setsubserviceItems}
                  listMode="SCROLLVIEW"
                  onChangeValue={(value) => {
                    if (value != "New") {
                      onsubservice(value);
                      setisnewsubservice(false);
                    } else {
                      setisnewsubservice(true);
                      oninformation(null);
                      setid("0");
                    }
                  }}
                  onSelectItem={(item) => {
                    setid(null);
                    if (item.value != "New") {
                      // onsubservice(item.value);
                      setid(item.id);
                      viewDetail(item.id);
                    }
                  }}
                />
                {isnewsubservice && (
                  <TextInput
                    style={{
                      width: "100%",
                      alignSelf: "center",
                      borderWidth: 1,
                      borderRadius: 5,
                      paddingHorizontal: 10,
                      // paddingVertical: 3,
                      backgroundColor: "white",
                      marginTop: 10,
                    }}
                    onChangeText={(value) => {
                      // setnewsubservice(value);
                      onsubservice(value);
                    }}
                  />
                )}
                <ScrollView
                  onContentSizeChange={() => {
                    if (userInfo.information != null) {
                      scrollViewRef.current.scrollToEnd({ animated: true });
                    }
                  }}
                >
                  {isid && (
                    <View>
                      <Text
                        style={{
                          width: "95%",
                          alignSelf: "center",
                          marginTop: 20,
                        }}
                      >
                        Detailed Description:
                      </Text>
                      <RichEditor
                        ref={richText}
                        initialContentHTML={userInfo.information}
                        onChange={oninformation}
                        initialHeight={100}
                        style={{
                          width: "95%",
                          alignSelf: "center",
                          borderWidth: 2,
                          borderRadius: 10,
                          padding: 1,
                        }}
                        onFocus={() => {
                          // richText.current.setContentHTML(html: userInfo.information);
                          scrollViewRef.current.scrollToEnd({ animated: true });
                        }}
                        // onFocus={() => setToolbarInvisibility("flex")}
                        // onBlur={() => setToolbarInvisibility("none")}
                      />
                      <RichToolbar
                        editor={richText}
                        actions={[
                          actions.setBold,
                          actions.setItalic,
                          actions.heading1,
                          actions.heading2,
                          actions.heading3,
                          actions.heading4,
                          actions.heading5,
                          actions.heading6,
                          actions.insertBulletsList,
                          actions.insertOrderedList,
                          actions.insertLink,
                          actions.setStrikethrough,
                          actions.setUnderline,
                          actions.undo,
                          actions.redo,
                        ]}
                        iconMap={{
                          [actions.heading1]: ({ tintColor }) => (
                            <Text style={[{ color: tintColor }]}>H1</Text>
                          ),
                          [actions.heading2]: ({ tintColor }) => (
                            <Text style={[{ color: tintColor }]}>H2</Text>
                          ),
                          [actions.heading3]: ({ tintColor }) => (
                            <Text style={[{ color: tintColor }]}>H3</Text>
                          ),
                          [actions.heading4]: ({ tintColor }) => (
                            <Text style={[{ color: tintColor }]}>H4</Text>
                          ),
                          [actions.heading5]: ({ tintColor }) => (
                            <Text style={[{ color: tintColor }]}>H5</Text>
                          ),
                          [actions.heading6]: ({ tintColor }) => (
                            <Text style={[{ color: tintColor }]}>H6</Text>
                          ),
                        }}
                      />
                    </View>
                  )}
                </ScrollView>
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: Dimensions.get("window").height,
    top: StatusBar.currentHeight + 70,
  },
  editorcontainer: {
    flex: 1,
    top: "2%",
    marginHorizontal: 30,
    // minHeight: 230,
    marginBottom: 400,
    padding: 5,
  },
});

export default Editor;
