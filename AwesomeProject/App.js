
import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View,Image,Dimensions} from 'react-native';
import Login from './js/login.js';
import { createStackNavigator, createAppContainer } from "react-navigation";
import Regist from './js/regist.js';
import NavigationService from './js/NavigationService';
import Main from './js/main.js';
import addFriendsAndGroups from './js/addFriendsAndGroups.js';
import Chatroom from './js/chatRoom.js';
import GroupChat from './js/GroupChat.js';
import lookOverUser from './js/lookOverUser.js';
import createGroup from './js/createGroup.js';

type Props = {};
class Logodisplay extends Component<Props> {
  static navigationOptions = {
    headerTitle: (
          <Text style={{ flex: 1, textAlign: 'center',fontFamily:'Cochin',fontSize:25}}>同族不仅仅是一个交流软件</Text>
        ),
  }
  constructor(props) {
    super(props);
    this.state = { showText:true};
    setTimeout(() => {
      NavigationService.navigate('Login', { userName: 'Lucy' });
    }, 2000);
  }
 
  render() {
    
    return (
      <View>
        <LoadPicture/>
      </View>
    );
  }
}

//加载进入软件页面
class LoadPicture extends Component{
  render(){
    return(
      <Image source={require('./images/load.png')} style={styles.backgroundImage}/>
    )
  }
}
let Demensions = require('Dimensions');
//初始化宽高
let {width, height} = Demensions.get('window');

const styles=StyleSheet.create({
    backgroundImage:{
      width:width,
      height:height,
      backgroundColor:'rgba(0,0,0,0)',
    }
})

//主导航
const TopLevelNavigator = createStackNavigator(
  {
    Home: {
      screen: Logodisplay,
    },
    Login:{
      screen: Login,
    },
    Regist:{
      screen: Regist,
    },
    Main:{
      screen:Main,
    },
    addFriendsAndGroups:{
      screen:addFriendsAndGroups
    },
    Chatroom:{
      screen:Chatroom
    },
    GroupChat:{
      screen:GroupChat
    },
    lookOverUser:{
      screen:lookOverUser
    },
    createGroup:{
      screen:createGroup
    }
  },
  {
    initialRouteName: 'Home'
  },
  
);

const AppContainer = createAppContainer(TopLevelNavigator);
export default class App extends React.Component {
  render() {
    return (
      <AppContainer
        ref={navigatorRef => {
          NavigationService.setTopLevelNavigator(navigatorRef);
        }}
      />
    );
  }
}