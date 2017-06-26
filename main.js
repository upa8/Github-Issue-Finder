import Expo from 'expo';
import React, { Component } from 'react';
import { StyleSheet, Text, View, TextInput, Button, Alert, FlatList } from 'react-native';
import axios from 'axios';

class App extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
          something: "Something this is nothing but a bug",
          issueList: [],
          searchText: ''
        };
        this.onPressLearnMore = this.onPressLearnMore.bind(this);
    }


    onPressLearnMore(){
        console.log('Search text ' + this.state.searchText);
       var url = 'https://api.github.com/repos/'+ this.state.searchText +'/issues?page=1&per_page=10';
        console.log('URL ' + url);
        axios.get(url)
          .then(res => {
            debugger
            const issues = res.data;
            this.setState({ issueList : issues });
        });
    }

    _keyExtractor = (item, index) => item.id;

    render() {
        return (
            <View style={styles.container}>
                
                <TextInput 
                    style={{height: 40, borderColor: 'gray', width:300, borderWidth: 1}}
                    onChangeText={(text) => this.setState({searchText:text})}
                />

                <Button
                    onPress={this.onPressLearnMore}
                    title="Get Issues"
                    color="#841584"
                    accessibilityLabel="Learn more about this purple button" />

                     <FlatList
                        data={this.state.issueList}
                        keyExtractor={this._keyExtractor}
                        renderItem={({item}) => 
                              <View>
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
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 30
    },
  item: {
    padding: 10,
    fontSize: 18,
    height: 44,
  },
});

    Expo.registerRootComponent(App);
