import React, { Component } from 'react';
import { Text,TextInput,StyleSheet,View,ScrollView,Image } from 'react-native';
import Button from 'apsl-react-native-button';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { createBottomTabNavigator, createAppContainer} from 'react-navigation';
import NavigationService from './NavigationService.js';
let socketone = new WebSocket('http://192.168.43.44:8080/ifc/wsone');
let username;
let friendsName;
let chatRoomId;

export default class Chatroom extends Component {
    state={
        content:'',
        param:1
    }
    
    componentWillMount(){
        username=this.props.navigation.state.params.userName;
        friendsName=this.props.navigation.state.params.friendsName;
        chatRoomId=friendsName.substring(7,11)+username.substring(7,11);
        fetch('http://192.168.43.44:8080/checkChatId', {
            method: 'post',
            headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: 'chatRoomId='+chatRoomId
            
        })
        .then((response) =>{
            let res=JSON.parse(response._bodyText);
            if(res.state==0){
                chatRoomId=username.substring(7,11)+friendsName.substring(7,11);
            }
            fetch('http://192.168.43.44:8080/getChatMsgList', {
                method: 'post',
                headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: 'chatRoomId='+chatRoomId+
                '&userOne='+username+
                '&userTwo='+friendsName
            })
            .then((response) =>{
                let res=JSON.parse(response._bodyText);
                if(res.content!=0)
                    {
                        if(res.content[0].chatContent!=null){
                            let chatContent=res.content[0].chatContent;
                            chatContent=JSON.parse(chatContent);
                            this.setState({content:chatContent});
                        }
                    }
            })
            .catch((error) => {
                console.error(error);
            });
        })
        .catch((error) => {
            console.error(error);
        });
        this.setState({thisChatRoomId:chatRoomId});
        
    }
    //设置页面导航
    static navigationOptions = ({ navigation }) => {
      return {
        headerTitle: (
            <Text style={{ flex: 1, textAlign: 'center',fontFamily:'Cochin',fontSize:25}}>
                {navigation.getParam('title')}</Text>
            ),
        headerRight: <View/>
        }
    }

    
    mapMsg(){
        let com=[];
    
        for(let i=0;i<this.state.content.length;i++)
        {
            if(this.state.content[i].user==username)
            {
                com.push(<MyMsg text={this.state.content[i].content}/>);
            }else if(this.state.content[i].user==friendsName)
            {
                com.push(<HisMsg text={this.state.content[i].content}/>);
            }
        }
        
        return com;
    }
  
  render() {
    socketone.onmessage = (e) => {
        if(e.data==1){
            fetch('http://192.168.43.44:8080/getChatMsgList', {
                method: 'post',
                headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: 'chatRoomId='+chatRoomId+
                '&userOne='+username+
                '&userTwo='+friendsName
            })
            .then((response) =>{
                let res=JSON.parse(response._bodyText);
                let chatContent=res.content[0].chatContent;
                chatContent=JSON.parse(chatContent);
                this.setState({content:chatContent});
            })
            .catch((error) => {
                console.error(error);
            });
        }
        
    }
    return (
        <View style={styles.direction}>
            <InsertText/>
            <ScrollView contentContainerStyle={styles.contentContainer}
                ref={ref => this.scrollView = ref}
                onContentSizeChange={()=>this.scrollView.scrollToEnd({animated: true})}
            >
                
                {this.mapMsg()}
            </ScrollView>
        </View>
    );
  }
}

class InsertText extends Component {
  constructor(props) {
    super(props);
    this.state = { text: '' };
  }
  sendMsg=()=>{
    socketone.send('message');
    fetch('http://192.168.43.44:8080/ifc/sendMsg', {
            method: 'post',
            headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: 'chatRoomId='+chatRoomId+
            '&userId='+username+
            '&content='+this.state.text
        })
        .then((response) =>{
            this.setState({text:''});
            let res=JSON.parse(response._bodyText);
            
        })
        .catch((error) => {
            console.error(error);
        });
  }
  render() {
    return (
        <View style={{marginBottom:10,flexDirection: 'row'}}>
            <TextInput
                placeholder='在此输入信息'
                style={styles.searchInput}
                onChangeText={(text) => this.setState({text})}
                value = {this.state.text}
            />
            <Button 
                onPress={this.sendMsg }
                style={styles.send} 
                textStyle={{fontSize: 18,color:'white'}}>
                发送
            </Button>
        </View>
    );
  }
}

class HisMsg extends Component {
    render() {
    return (
        <View style={{marginLeft:10,flexDirection: 'row',marginTop:8,width:230,marginBottom:5}}>
            <Image source={require('../images/hishead.png')} style={styles.protrait}/>
            <Text style={styles.hisText}>{this.props.text}</Text>
        </View>
    );
  }
}

class MyMsg extends Component {
    render() {
    return (
        
        <View style={{flexDirection: 'row-reverse',marginTop:8,marginBottom:5}}>
            <View style={{width:230,flexDirection: 'row-reverse'}}>
                <Image source={require('../images/head.png')} style={styles.myProtrait}/>
                <Text style={styles.myText}>{this.props.text}</Text>
            </View>
        </View>
    );
  }
}

const styles = StyleSheet.create({
    searchInput:{
        height: 40,
        borderColor: 'rgb(193,193,193)',
        borderWidth: 3,
        width:260,
        marginLeft:10,
        borderRadius:20
    },
    direction:{
      flex:1,
      flexDirection: 'column-reverse',
    },
    send:{
        width:70,
        backgroundColor:'rgb(247,161,89)',
        marginLeft:10,
        borderColor: 'rgb(193,193,193)',
        borderWidth: 3,
    },
    protrait:{
        width:35,
        height:35
    },
    myProtrait:{
        width:35,
        height:35,
        marginRight:10
    },
    hisText:{
        borderColor: 'rgb(193,193,193)',
        borderWidth: 1,
        borderRadius:5,
        backgroundColor:'gray',
        paddingTop:5,
        paddingBottom:5,
        paddingLeft:10,
        paddingRight:10,
        color:'white',
        marginLeft:5,
    },
    myText:{
        borderColor: 'rgb(247,161,89)',
        borderWidth: 1,
        borderRadius:5,
        backgroundColor:'rgb(247,161,89)',
        paddingTop:5,
        paddingBottom:5,
        paddingLeft:10,
        paddingRight:10,
        color:'white',
        marginRight:5,
    }
})

