import React from 'react';
import { Text, View,Alert,
  StyleSheet,Image,Picker } from 'react-native';
import { createBottomTabNavigator, createAppContainer} from 'react-navigation';
import NavigationService from './NavigationService.js';
import Button from 'apsl-react-native-button';

export default class looOverUser extends React.Component {
  state={
    userId:'',
    name:'',
    city:'',
    button:''
  }
  componentWillMount(){
    return fetch('http://192.168.43.44:8080/getProfiles', {
        method: 'post',
        headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'username='+this.props.navigation.state.params.id
    })
    .then((response) =>{
        let res=JSON.parse(response._bodyText); 
        this.setState({
        userId:res[0].id,
        name:res[0].name,
        city:res[0].city
        })
        
    })
    .catch((error) => {
        console.error(error);
    });
  }
  componentDidMount(){
    return fetch('http://192.168.43.44:8080/ifc/isAdd', {
        method: 'post',
        headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'id='+this.props.navigation.state.params.userName+
        '&user='+this.props.navigation.state.params.id
    })
    .then((response) =>{
        let button=[];
        let res=JSON.parse(response._bodyText); 
        if(res.state==0){
            this.setState({button:'加为好友'});         
        }
        else if(res.state==1){
            this.setState({button:'发消息'});
        }
    })
    .catch((error) => {
        console.error(error);
    });
  }
  handlePress(){
      if(this.state.button=='发消息')
      {
          NavigationService.navigate('Chatroom', 
          { userName: this.props.navigation.state.params.userName,
              friendsName:this.props.navigation.state.params.id,
              title:this.state.name+'('+this.state.userId+')' });
      }else if(this.state.button=='加为好友')
      {
          fetch('http://192.168.43.44:8080/ifc/addFriend', {
            method: 'post',
            headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: 'id='+this.props.navigation.state.params.userName+
            '&user='+this.props.navigation.state.params.id
        })
        .then((response) =>{
            
            let res=JSON.parse(response._bodyText); 
            alert("申请已发出");
        })
        .catch((error) => {
            console.error(error);
        });
      }
  }
  render() {
    return (
       <View style={styles.container}>
          <View style={{alignItems: 'center',}}>
            <Image source={require('../images/head.png')} style={styles.head}/>
          </View>
          <Text style={styles.text}>用户名:{this.state.userId}</Text>
          <Text style={styles.text}>姓名:{this.state.name}</Text>
          <Text style={styles.text}>城市:{this.state.city}</Text>
          <Button style={styles.create} onPress={()=>this.handlePress()}>{this.state.button}</Button>
      </View>
    );
  }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 22,
        flexDirection: 'column',
    },
    head:{
        borderWidth:3,
        borderColor:'rgb(222,225,230)',
        borderRadius:3
    },
    text: {
        padding: 10,
        fontSize: 18,
        height: 44,
        borderBottomWidth:1,
        borderColor:'rgb(222,225,230)',
    },
    create:{
        width:100,
        backgroundColor:'rgb(247,161,89)',
        borderColor: 'rgb(193,193,193)',
        borderWidth: 1,
        marginLeft:130,
        marginTop:10
    },
})