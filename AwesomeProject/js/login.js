import React, {Component} from 'react';
import LinearGradient from 'react-native-linear-gradient';
import {Platform,StyleSheet,TextInput, 
  Text, View,ImageBackground,Alert} from 'react-native';
import Button from 'apsl-react-native-button'
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Regist from './regist.js';
import NavigationService from './NavigationService.js';
import Main from './main.js';


//登录页面渲染
export default class Login extends Component<Props> {
  //设置页面导航
  static navigationOptions = {
    headerTitle: (
          <Text style={{ flex: 1, textAlign: 'center',fontFamily:'Cochin',fontSize:25}}>登录</Text>
        ),
    headerRight: <View/>
  };
  state = {
    username: '',
    password:''
  };
  changeUsername(string) {
    this.setState({
      username:string
    });
  }

  changePassword(string) {
    this.setState({
      password:string
    });
  }

  render() {
    return (
      <ImageBackground source={require('../images/bgcolor.png')} style={styles.bground}>
        <View style={styles.direction}>
          <View style={{flexDirection: 'row',marginTop:10}}>
            <FontAwesome
                  name={'user'}
                  size={40}
                  color={'rgb(255,255,255)'}
              />
            <UsernameTextInput changeUsername = {string => this.changeUsername(string)}/>
          </View>
          <View style={{flexDirection: 'row',marginTop:10}}>
            <FontAwesome
                  name={'lock'}
                  size={40}
                  color={'rgb(255,255,255)'}
              />
            <PasswordTextInput changePassword = {string => this.changePassword(string)}/>
          </View>
          <View style={{alignItems: 'center',}}>
            <Submmit parentState={this.state}/>
          </View>
          <JumpRegist/>
        </View>
      </ImageBackground>
    );
  }
}
//用户名输入框
class UsernameTextInput extends Component {
  constructor(props) {
    super(props);
    this.state = { text: '' };
  }

  render() {
    return (
      <TextInput
        style={styles.username}
        onChangeText={(text) => {
          this.setState({text},()=>this.props.changeUsername(this.state.text))
        }}
        value={this.state.text}
      />
    );
  }
}
//密码输入框
class PasswordTextInput extends Component {
  constructor(props) {
    super(props);
    this.state = { text: '' };
  }

  render() {
    return (
      <TextInput secureTextEntry={true}
        style={styles.username}
        onChangeText={(text) => {
          this.setState({text},()=>this.props.changePassword(this.state.text))
          }}
        value={this.state.text}
      />
    );
  }
}
//提交按钮
class Submmit extends Component {
  constructor(props, context) {
    super(props, context);
      this.state = {
        isDisabled: false
      }
    }
  handlePress=()=> {
     return fetch('http://192.168.43.44:8080/login', {
        method: 'post',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'username='+this.props.parentState.username+
        '&password='+this.props.parentState.password
      })
      .then((response) =>{
        let res=JSON.parse(response._bodyText);
        if(res.state==0){
          Alert.alert("登录失败");
        }
        else if(res.state==1){
          NavigationService.navigate('Main', { userName: this.props.parentState.username });
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }
  render() {
    const { isDisabled } = this.state;
    return (
      <Button 
        onPress={this.handlePress}
        style={{width:140,borderColor:'white',borderWidth:2,marginTop:10}} 
        textStyle={{fontSize: 18,color:'white'}}>
        提交
      </Button>
    );
  }
};

//跳转到注册页
class JumpRegist extends React.Component {
  render() {
    return (
      <View style={{ alignItems: "center", justifyContent: "center"}}>
        <Text style={{color:'blue',fontSize:20}}
        onPress={() => NavigationService.navigate('Regist', { userName: 'Lucy' })}
        >注册账号</Text>
      </View>
    );
  }
}

let Demensions = require('Dimensions');
//初始化宽高
let {width, height} = Demensions.get('window');

const styles=StyleSheet.create({
    bground:{
      width:width,
      height:height,
      backgroundColor:'rgba(0,0,0,0)',
    },
    direction:{
      flex:1,
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
    },
    username:{
      width: 180, 
      borderColor: 'rgb(255,255,255)', 
      borderWidth: 2,
      borderRadius:5,
      marginLeft:9,
      fontSize:20,
      color:'white'
    }
})