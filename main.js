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
          searchText: '',
          loading: false,
          loadingText: 'Loading'
        };
        this.onPressLearnMore = this.onPressLearnMore.bind(this);
    }


    onPressLearnMore(){
        console.log('Search text ' + this.state.searchText);
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
            // empty loading text
            this.setState({ loading : false });
            this.setState({ issueList : issues });
        }).catch(function (error) {
            // TODO: Handle error here (low priority)
            // Set error message 
            this.setState({ loading : false });
              
            this.setState({ loadingText : 'Error in fetching data, please check the repository name' });
        
            console.log(error);
        });
    }

    _keyExtractor = (item, index) => item.id;

    render() {
            
            let loader;
            let next;
            let previous;
            
            if(this.state.loading){
                loader = <Text style={styles.item}>{this.state.loadingText}</Text>
            }
            
        return (

            <View style={styles.container}>
                
                <TextInput 
                    style={{height: 40, borderColor: 'gray', width:300, borderWidth: 1, backgroundColor: '#fff'}}
                    placeholderTextColor="white"
                    onChangeText={(text) => this.setState({searchText:text})}
                />

                <Button
                    onPress={this.onPressLearnMore}
                    title="Get Issuess"
                    color="#841584"
                    accessibilityLabel="Learn more about this purple button" />
            
               {loader}       
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
