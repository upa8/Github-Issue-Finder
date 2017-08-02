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
            loadingText: 'Loading',
            nextUrl: '',
            prevUrl: '',
            lastUrl: '',
            firstUrl: ''
        };

        // need to refactore this
        this.onPressLearnMore = this.onPressLearnMore.bind(this);
        this.next = this.next.bind(this);
        this.previous = this.previous.bind(this);
        this.first = this.first.bind(this);
        this.last = this.last.bind(this);

    }


    onPressLearnMore(urlData, urlValue){
        debugger
        var firstPageUrl = 'https://api.github.com/repos/'+ this.state.searchText +'/issues?page=1&per_page=10';
        var url = urlValue? urlValue : firstPageUrl;


        if(this.state.searchText.length > 2){
            // Empty issueList
            var emptyList = [];
            this.setState({ issueList : emptyList });
            // Set error message
            this.setState({ loading : true });
            this.setState({ loadingText : 'Loading ...' });

            // set loading text
            axios.get(url)
                .then(res => {
                    debugger
                    const issues = res.data;
                    // empty loading text
                    this.setState({
                        loading : false,
                        issueList : issues
                    });
                    var links = res.headers.link.split(',')
                    var linkLength = links.length
                    for(var i = 0; i < linkLength; i++){
                        var data = links[i].match(/<(.+)>; rel="(.+)"/);
                        if(data[2] === 'next'){
                            this.setState({ nextUrl : data[1] })
                        }
                        if(data[2] === 'last'){
                            this.setState({ lastUrl : data[1] })
                        }
                        if(data[2] === 'prev'){
                            this.setState({ prevUrl : data[1] })
                        }
                        if(data[2] === 'first'){
                            this.setState({ firstUrl : data[1] })
                        }
                    }

                    console.log('Reached here ');

                }).catch(function (error) {
                // TODO: Handle error here (low priority)
                // Set error message
                this.setState({ loading : false });

                this.setState({ loadingText : 'Error in fetching data, please check the repository name' });

                console.log(error);
            });
        }else{
            // remove buttons
            this.setState({ nextUrl : '' });
            this.setState({ lastUrl : '' });
            this.setState({ prevUrl : '' });
            this.setState({ firstUrl : '' });

            // remove listview
            this.setState({ issueList : []});

            this.setState({ loading: true });
            this.setState({ loadingText : 'Please enter the correct repository name' });
        }
    }
    next(){

        this.onPressLearnMore(null,this.state.nextUrl);
    }
    previous(){
        this.onPressLearnMore(null,this.state.prevUrl);
    }
    first(){
        this.onPressLearnMore(null,this.state.firstUrl);
    }
    last(){
        this.onPressLearnMore(null,this.state.lastUrl);
    }

    _keyExtractor = (item, index) => item.id;

    render() {

        let loader;

        let next =  <Button
            onPress={this.next}
            title="Next"
            color="#841584"
            accessibilityLabel="" />;
        let previous =  <Button
            onPress={this.previous}
            title="Prev"
            color="#841584"
            accessibilityLabel="" />;
        let first =  <Button
            onPress={this.first}
            title="First"
            color="#841584"
            accessibilityLabel="" />;
        let last =  <Button
            onPress={this.last}
            title="Last"
            color="#841584"
            accessibilityLabel="" />;

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

                <View style={{ flexDirection: 'row', alignItems: 'center',
                    justifyContent: 'space-between'}}>

                    {this.state.firstUrl.length > 0 && first}

                    {this.state.prevUrl.length > 0 && previous}
                    {this.state.nextUrl.length > 0 && next}
                    {this.state.lastUrl.length > 0 && last}
                </View>
            </View>

        );
    }
}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 25,
        backgroundColor: '#442358'
    },
    item: {
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
