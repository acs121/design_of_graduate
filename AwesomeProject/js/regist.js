import React, {Component} from 'react';
import LinearGradient from 'react-native-linear-gradient';
import {Platform,StyleSheet,TextInput, 
  Text, View,ImageBackground,Alert} from 'react-native';
import Button from 'apsl-react-native-button'
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Login from './login.js';
import NavigationService from './NavigationService.js';
//渲染注册页
export default class Regist extends React.Component {
  state = {
    username: '11',
    password:'',
    confirm:'',
    name:'',
    city:''
  };
  
  changeUsername(string) {
    this.setState({
      username:string
    });
  }

  changeName(string) {
    this.setState({
      name:string
    });
  }

  changeCity(string) {
    this.setState({
      city:string
    });
  }

  changePassword(string) {
    this.setState({
      password:string
    });
  }
  changeConfirm(string) {
    this.setState({
      confirm:string
    });
  }

  static navigationOptions = {
    headerTitle: (
          <Text style={{ flex: 1, textAlign: 'center',fontFamily:'Cochin',fontSize:25}}>注册</Text>
        ),
    headerRight: <View/>
  };
  render() {
    return (
      <ImageBackground source={require('../images/bgcolor.png')} style={styles.bground}>
        <View style={styles.direction}>
          <View style={{flexDirection: 'row',marginTop:10}}>
            <Text style={styles.font}>用户名</Text>
            <UsernameTextInput 
              changeUsername = {string => this.changeUsername(string)}
            />
          </View>
          <View style={{flexDirection: 'row',marginTop:10}}>
            <Text style={styles.font}>密   码</Text>
            <PasswordTextInput 
              changePassword = {string => this.changePassword(string)}
            />
          </View>
          <View style={{flexDirection: 'row',marginTop:10}}>
            <Text style={styles.font}>确   认</Text>
            <ConfirmPassword
             changeConfirm = {string => this.changeConfirm(string)}
            />
          </View>
          <View style={{flexDirection: 'row',marginTop:10}}>
            <Text style={styles.font}>姓   名</Text>
            <NameTextInput 
              changeName = {string => this.changeName(string)}
            />
          </View>
          <View style={{flexDirection: 'row',marginTop:10}}>
            <Text style={styles.font}>城   市</Text>
            <CityTextInput 
              changeCity = {string => this.changeCity(string)}
            />
          </View>
          <View style={{alignItems: 'center',}}>
            <Submmit parentState={this.state}/>
          </View>
        </View>
      </ImageBackground>
    );
  }
}
//用户名
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
      />
    );
  }
}
//姓名
class NameTextInput extends Component {
  constructor(props) {
    super(props);
    this.state = { text: '' };
  }
  
  render() {
    return (
      <TextInput
        style={styles.username}
        onChangeText={(text) => {
          this.setState({text},()=>this.props.changeName(this.state.text))
        }}
      />
    );
  }
}
//城市
class CityTextInput extends Component {
  constructor(props) {
    super(props);
    this.state = { text: '' };
  }
  
  render() {
    return (
      <TextInput
        style={styles.username}
        onChangeText={(text) => {
          this.setState({text},()=>this.props.changeCity(this.state.text))
        }}
      />
    );
  }
}
//密码
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
//确认密码
class ConfirmPassword extends Component {
  constructor(props) {
    super(props);
    this.state = { text: '' };
  }

  render() {
    return (
      <TextInput secureTextEntry={true}
        style={styles.username}
        onChangeText={(text) => {
          this.setState({text},()=>this.props.changeConfirm(this.state.text))
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
     return fetch('http://192.168.43.44:8080/regist', {
        method: 'post',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'username='+this.props.parentState.username+
        '&password='+this.props.parentState.password+
        '&confirm='+this.props.parentState.confirm+
        '&name='+this.props.parentState.name+
        '&city='+this.props.parentState.city
      })
      .then((response) =>{
        let res=JSON.parse(response._bodyText);
        if(res.state==0){
          Alert.alert("用户名已存在");
        }
        else if(res.state==1){
          Alert.alert('',
            '注册成功',
            [{text: 'OK', onPress: () => NavigationService.navigate('Login', { userName: 'Lucy' })}]);
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
        style={{width:140,borderColor:'white',borderWidth:2,marginTop:10}} 
        onPress={this.handlePress}
        textStyle={{fontSize: 18,color:'white'}}>
        
        提交
      </Button>
    );
  }
};

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
    },
    font:{
      fontSize:25,
      color:'white'
    }
})