import Expo, { Permissions, Notifications, Constants } from 'expo';
import React, { Component } from 'react';
import { StyleSheet, Text, View, TextInput, Button, Alert, FlatList } from 'react-native';
import axios from 'axios';


class App extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      something: "Something this is nothing but a bug",
      issueList: [],
      searchText: '',
      loading: false,
      loadingText: 'Loading',
      token: ''
    };
    this.onPressLearnMore = this.onPressLearnMore.bind(this);
  }

  async componentDidMount() {
    let result = await Permissions.askAsync(Permissions.NOTIFICATIONS);
    if (Constants.isDevice && result.status !== 'granted') {
      alert(
        'You should enable notifications for this app otherwise you will not know when your timers expire!'
      );
      return;
    }

    let token = await Notifications.getExponentPushTokenAsync();
    //saving the token value in state variable will be required only during local notifications
    // this.setState({
    //   token
    // })
    console.log(token);
    const PUSH_ENDPOINT = 'http://13.126.40.208:5000/saveUser';
    // POST the token to our backend so we can use it to send pushes from there

    fetch(PUSH_ENDPOINT, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        "username": "ashish",
        "token": token
      })
    }).then(function(response){
      if(response.status == 'SUCCESS'){
        console.log('API hit successfully');
      }
    })

    // axios.post(PUSH_ENDPOINT, {
    //   firstName: 'Fred',
    //   lastName: 'Flintstone'
    // })
    // .then(function (response) {
    //   console.log(response);
    // })
    // .catch(function (error) {
    //   console.log(error);
    // });
  }


  onPressLearnMore(){

    var url = 'https://api.github.com/repos/'+ this.state.searchText +'/issues?page=1&per_page=10';

    // Empty issueList
    var emptyList = [];
    this.setState({ issueList : emptyList });
    // Set error message
    this.setState({ loading : true });
    this.setState({ loadingText : 'Loading Please wait' });

    // set loading text
    axios.get(url)
    .then(res => {
      const issues = res.data;
      //console.log(issues)
      // empty loading text
      this.setState({ loading : false });
      this.setState({ issueList : issues });

      // get buttons
      // first
      // last
      // next
      // prev
      // Schedule notification
      // this._notificationId = Notifications.scheduleLocalNotificationAsync(
      //   {
      //     title: 'My first local notification!',
      //     body: 'Office hours completed',
      //     ios: {
      //       sound: true,
      //     },
      //     android: {
      //       sound: true,
      //       vibrate: true,
      //     },
      //   },
      // );

    }).catch((error) => {

      this.setState({
        loading : false,
        loadingText : 'Error in fetching data, please check the repository name'
      });
    });

  }

  _keyExtractor = (item, index) => item.id;

  render() {

    //let loader;
    let next;
    let previous;

    // if(this.state.loading){
    //   loader = <Text style={styles.item}>{this.state.loadingText}</Text>
    // }

    return (

      <View style={styles.container}>

        <TextInput
          style={{height: 40, borderColor: 'gray', width:300, borderWidth: 1, backgroundColor: '#fff'}}
          placeholderTextColor="white"
          onChangeText={(text) => this.setState({searchText:text})}
          />

        <Button
          onPress={this.onPressLearnMore}
          title="Get Issue"
          color="#841584"
          accessibilityLabel="Learn more about this purple button" />

        <View>
          {this.state.loading && <Text style={styles.item}>{this.state.loadingText}</Text>}
        </View>
        <FlatList
          data={this.state.issueList}
          keyExtractor={this._keyExtractor}
          renderItem={({item}) =>
          <View style={styles.itemBox}>
            <Text style={styles.item}>Id - {item.id}</Text>
            <Text style={styles.item}>Title - {item.title}</Text>
          </View>
        }
        />
    </View>
  );
}
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 30,
    backgroundColor: '#442358'
  },
  item: {
    padding: 10,
    fontSize: 18,
    color: '#fff',
    padding: 5,
    margin: 2
  },
  itemBox: {
    borderWidth: 1,
    borderColor: '#fff',
  }
});

Expo.registerRootComponent(App);
