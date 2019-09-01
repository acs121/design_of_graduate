import React, { Component } from 'react';
import { Text,TextInput,StyleSheet,View,ScrollView,Image,Alert } from 'react-native';
import Button from 'apsl-react-native-button';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { createBottomTabNavigator, createAppContainer} from 'react-navigation';
import NavigationService from './NavigationService.js';

let id;
let navigate;
export default class createGroup extends Component {
    state = {
        GroupName: '',
        GroupLastName:'',
        GroupIntroduce:''
    };
    changeGroupname(string) {
        this.setState({
        GroupName:string
        });
    }
    changeLastName(string) {
        this.setState({
        GroupLastName:string
        });
    }
    changeGroupIntroduce(string) {
        this.setState({
        GroupIntroduce:string
        });
    }
    render() {
      id=this.props.navigation.state.params.userName;
      navigate=this.props.navigation;
        return (
        <View style={styles.direction}>
          <View style={{flexDirection: 'row',marginTop:10}}>
            <Text style={styles.font}>群名称</Text>
            <GroupName 
              changeGroupname = {string => this.changeGroupname(string)}
            />
          </View>
          <View style={{flexDirection: 'row',marginTop:10}}>
            <Text style={styles.font}>群姓氏</Text>
            <GroupLastName 
              changeLastName = {string => this.changeLastName(string)}
            />
          </View>
          <View style={{flexDirection: 'row',marginTop:10}}>
            <Text style={styles.font}>群介绍</Text>
            <GroupIntroduce 
              changeGroupIntroduce = {string => this.changeGroupIntroduce(string)}
            />
          </View>
          <View style={{alignItems: 'center',}}>
            <Submmit parentState={this.state}/>
          </View>
        </View>
        )
    }
}

class GroupName extends Component {
  constructor(props) {
    super(props);
    this.state = { text: '' };
  }
  
  render() {
    return (
      <TextInput
        style={styles.username}
        onChangeText={(text) => {
          this.setState({text},()=>this.props.changeGroupname(this.state.text))
        }}
      />
    );
  }
}

class GroupLastName extends Component {
  constructor(props) {
    super(props);
    this.state = { text: '' };
  }
  
  render() {
    return (
      <TextInput
        style={styles.username}
        onChangeText={(text) => {
          this.setState({text},()=>this.props.changeLastName(this.state.text))
        }}
      />
    );
  }
}

class GroupIntroduce extends Component {
  constructor(props) {
    super(props);
    this.state = { text: '' };
  }
  
  render() {
    return (
      <TextInput
        style={styles.username}
        onChangeText={(text) => {
          this.setState({text},()=>this.props.changeGroupIntroduce(this.state.text))
        }}
      />
    );
  }
}
class Submmit extends Component {
  constructor(props, context) {
    super(props, context);
      this.state = {
        isDisabled: false
      }
    }
  handlePress=()=> {
     return fetch('http://192.168.43.44:8080/createGroup', {
        method: 'post',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'GroupName='+this.props.parentState.GroupName+
        '&GroupLastName='+this.props.parentState.GroupLastName+
        '&GroupIntroduce='+this.props.parentState.GroupIntroduce+
        '&lord='+id
      })
      .then((response) =>{
        let res=JSON.parse(response._bodyText);
        if(res.state==1){
          // Alert.alert('创建成功');
          navigate.state.params.refresh();
          navigate.goBack();
        }else{
          Alert.alert('创建失败');
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
        style={styles.create} 
        textStyle={{fontSize: 18,color:'white'}}>
        创建
      </Button>
    );
  }
};

const styles=StyleSheet.create({
    direction:{
      flex:1,
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
    },
    username:{
      width: 180, 
      borderColor: 'gray', 
      borderWidth: 2,
      borderRadius:5,
      marginLeft:9,
      fontSize:20,
      color:'gray'
    },
    font:{
      fontSize:25,
      color:'gray'
    },
    create:{
        width:100,
        backgroundColor:'rgb(247,161,89)',
        borderColor: 'rgb(193,193,193)',
        borderWidth: 1,
        marginTop:10
    },
})