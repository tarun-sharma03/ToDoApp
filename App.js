import { StatusBar } from "expo-status-bar";
import React from "react";
import {
  StyleSheet,
  Text,
  View,
  AsyncStorage,
  ScrollView,
  Alert,
} from "react-native";
import { Appbar, TextInput, Button, List, Card } from "react-native-paper";

export default class App extends React.Component {
  arr = [];
  id = 0;
  viewCheck = [];
  state = {
    work: "",
    items: [],
  };

  storeItem = async () => {
    if (this.state.work != "") {
      this.arr.push({ id: this.id, data: this.state.work });
      this.id++;
      await AsyncStorage.setItem("myList", JSON.stringify(this.arr));
      this.setState({
        items: JSON.parse(await AsyncStorage.getItem("myList")),
        work: "",
      });
    } else {
      alert("Your task can't be empty!!");
    }
    // console.log(this.state);
  };

  deleteAll = async () => {
    await AsyncStorage.removeItem("myList");
    this.setState({
      items: [],
    });
    this.arr = [];
    console.log(this.state);
  };

  createDeleteAlert = () =>
    Alert.alert(
      "Are You Sure ?",
      "Items one deleted can't be restored !!",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        {
          text: "OK",
          onPress: () => {
            this.deleteAll();
          },
        },
      ],
      { cancelable: false }
    );
  deleteSingle = (id) => {
    tempArr = [];
    this.arr.map((arr) => {
      if (arr.id != id) {
        tempArr.push(arr);
      }
    });

    this.arr = tempArr;
    console.log(this.arr);
    this.setState({
      items: this.arr,
    });

    // console.log(tempArr);
  };
  async componentDidMount() {
    this.arr = JSON.parse(await AsyncStorage.getItem("myList")) || [];
    if (this.arr.length > 0) {
      this.setState({
        items: JSON.parse(await AsyncStorage.getItem("myList")),
      });

      this.id = this.state.items.length;
    }
  }

  render() {
    if (this.state.items.length > 0) {
      viewList = this.state.items.map((items) => {
        return (
          <Card key={items.id} style={{ margin: 10 }}>
            <List.Item
              title={items.data}
              right={() => <List.Icon icon="delete" />}
              onPress={() => this.deleteSingle(items.id)}
              titleStyle={{
                fontSize: 20,
                fontFamily: "sans-serif",
                fontWeight: "300",
              }}
            />
          </Card>
        );
      });
    } else {
      viewList = (
        <Card style={{ margin: 10 }}>
          <Card.Title
            title="There is no pending task"
            style={{ alignContent: "center" }}
          />
        </Card>
      );
    }

    return (
      <View style={styles.container}>
        <Appbar.Header
          style={{
            backgroundColor: "rgb(14, 10, 15)",
          }}
        >
          <Appbar.Content title="ToDo List" />
        </Appbar.Header>
        <TextInput
          label="Add Pending Work"
          value={this.state.work}
          onChangeText={(work) => this.setState({ work })}
          style={{ margin: 10 }}
        />
        <Button mode="contained" onPress={this.storeItem} style={styles.btn}>
          Add To List
        </Button>

        <ScrollView>
          <View>{viewList}</View>
        </ScrollView>
        <Button
          mode="contained"
          onPress={this.createDeleteAlert}
          style={styles.btn}
        >
          Delete All
        </Button>
        <StatusBar style="auto" />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "grey",
  },
  list: {
    fontSize: 20,
  },
  btn: {
    marginBottom: 10,
    marginLeft: 10,
    marginRight: 10,
    borderRadius: 15,
    justifyContent: "center",
    backgroundColor: "rgb(14, 10, 15)",
    marginTop: 10,
  },
});
