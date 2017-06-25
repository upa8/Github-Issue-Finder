import Expo from 'expo';
import React, { Component } from 'react';
import { StyleSheet, Text, View, TextInput, Button, Alert } from 'react-native';



class App extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
          something: "Something this is nothing but a bug"
        };
        this.onPressLearnMore = this.onPressLearnMore.bind(this);
    }


    onPressLearnMore(){
        Alert.alert('You tapped the button!');
        this.setState({something: "Hello"});
    }
    render() {
        return (
            <View style={styles.container}>
                
                <Text> Hi {this.state.something}</Text>
                
                <TextInput style={{height: 40, borderColor: 'gray', width:300, borderWidth: 1}}/>

                <Button
                    onPress={this.onPressLearnMore}
                    title="Click here"
                    color="#841584"
                    accessibilityLabel="Learn more about this purple button" />

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
        },
    });

    Expo.registerRootComponent(App);
