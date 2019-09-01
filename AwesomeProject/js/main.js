import React from 'react';
import { Text, View,Alert,FlatList,SectionList,TouchableHighlight,
  StyleSheet,Image,Picker,ScrollView,Modal } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { createBottomTabNavigator, createAppContainer} from 'react-navigation';
import addFriendsAndGroups from './addFriendsAndGroups.js';
import NavigationService from './NavigationService.js';
import Chatroom from './chatRoom.js';
import Button from 'apsl-react-native-button';
import GroupChat from './createGroup.js'
let sockettwo = new WebSocket('http://192.168.43.44:8080/ifc/wstwo');

let id;

class News extends React.Component {
  state={
    chatMsg:[],
    sysMsg:[]
  }
  displayChatMsg(){
    let object=this.state.chatMsg;
    let dataArr=[];
    if(object.length!=0){
      for(let i=object.length-1;i>=0;i--)
      {
        if(object[i].msgType==1)
        {
          dataArr.push(
            <View style={styles.view}>
              <Text style={styles.name}  
              onPress={()=>this.jumpChatRoom(id,object[i].friendsId,object[i].friendsName+'('+object[i].friendsId+')')}>
                {object[i].friendsName+'('+object[i].friendsId+')'}</Text>
              <Text style={styles.MsgText} 
              onPress={()=>this.jumpChatRoom(id,object[i].friendsId,object[i].friendsName+'('+object[i].friendsId+')')}>{object[i].lastMsg}</Text>
              <Badge  badgeCount={object[i].unread}/>
          </View>
          )
        }else if(object[i].msgType==2){
          dataArr.push(
            <View style={styles.view}>
              <Text style={styles.name}>{object[i].groupName+'('+object[i].groupId+')'}</Text>
              <Text style={styles.MsgText}>{object[i].lastMsg}</Text>
              <Badge  badgeCount={0}/>
          </View>
          )
        }
      }
    }
    return dataArr;
  }
  displaySysMsg(){
    let object=this.state.sysMsg;
    let dataArr=[];
    if(object.length!=0){
      for(let i=object.length-1;i>=0;i--){
        if(object[i].msgType==1){
          dataArr.push(<View style={styles.view}>
            <Text style={styles.name}>{object[i].userOneName}向你发起了好友请求</Text>
            <View style={{flexDirection: 'row',}}>
              <Button style={styles.button}
              onPress={()=>this.receptAdd(object[i].userOne,object[i].userTwo,object[i].userOneName,object[i].userTwoName)}>接受</Button>
              <Button style={styles.button} 
              onPress={()=>this.refuseAdd(object[i].userOne,object[i].userTwo,object[i].userTwoName)}>拒绝</Button>
            </View>
          </View>);
        }else if(object[i].msgType==2){
          dataArr.push(<View style={styles.view}>
            <Text style={styles.name}>{object[i].userTwoName}拒绝了你的好友请求</Text>
            <Button style={styles.button}
            onPress={()=>this.deleteMsg(object[i].userOne,object[i].userTwo)}>删除</Button>
          </View>);
        }else if(object[i].msgType==3){
          dataArr.push(
            <View style={styles.view}>
            <Text style={styles.name}>{object[i].userTwoName}通过了你的好友请求</Text>
            <Button style={styles.button}
            onPress={()=>this.deleteMsg(object[i].userOne,object[i].userTwo)}>删除</Button>
          </View>
          )
        }else if(object[i].msgType==4){
          dataArr.push(<View style={styles.view}>
            <Text style={styles.name}>{object[i].userName}申请加入安氏交流群</Text>
            <View style={{flexDirection: 'row',}}>
              <Button style={styles.button}>接受</Button>
              <Button style={styles.button}>拒绝</Button>
            </View>
          </View>)
        }else if(object[i].msgType==5){
          dataArr.push(<View style={styles.view}>
            <Text style={styles.name}>{object[i].lordName}拒绝了你的群申请</Text>
            <Button style={styles.button}>删除</Button>
          </View>)
        }else if(object[i].msgType==6){
          dataArr.push(<View style={styles.view}>
            <Text style={styles.name}>{object[i].lordName}接受了你的群申请</Text>
            <Button style={styles.button}>删除</Button>
          </View>
          )
        }
      }
    }
    return dataArr;
  }
  //跳转到聊天页面
  jumpChatRoom(id,friendId,title){
    NavigationService.navigate('Chatroom', { userName: id,friendsName:friendId,title:title });
  }
  //拒绝添加好友
  refuseAdd(userOne,userTwo,userTwoName){
    fetch('http://192.168.43.44:8080/ifc/refuseAdd', {
        method: 'post',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'userOne='+userOne+
        '&userTwo='+userTwo+
        '&userTwoName='+userTwoName
      })
      .then((response) =>{
          // let res=JSON.parse(response._bodyText);
          
      })
      .catch((error) => {
        console.error(error);
      });
  }
  //接受好友添加
  receptAdd(userOne,userTwo,userOneName,userTwoName){
    fetch('http://192.168.43.44:8080/ifc/receptAdd', {
        method: 'post',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'userOne='+userOne+
        '&userTwo='+userTwo+
        '&userOneName='+userOneName+
        '&userTwoName='+userTwoName
      })
      .then((response) =>{
          // let res=JSON.parse(response._bodyText);
          
      })
      .catch((error) => {
        console.error(error);
      });
  }
  //删除消息
  deleteMsg(userOne,userTwo){
    fetch('http://192.168.43.44:8080/ifc/deleteMsg', {
        method: 'post',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'userOne='+userOne+
        '&userTwo='+userTwo
      })
      .then((response) =>{
          
      })
      .catch((error) => {
        console.error(error);
      });
  }
  componentWillMount(){
    this.loadNews();
  }
  loadNews(){
    fetch('http://192.168.43.44:8080/ifc/getSysMsg', {
        method: 'post',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'username='+id
      })
      .then((response) =>{
          let res=JSON.parse(response._bodyText);
          if(res.state==0){
            this.setState({sysMsg:''})
          }else{
            this.setState({sysMsg:JSON.parse(res)})
          }
      })
      .catch((error) => {
        console.error(error);
      });
    fetch('http://192.168.43.44:8080/ifc/getMsgList', {
        method: 'post',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'username='+id
      })
      .then((response) =>{
          let res=JSON.parse(response._bodyText);
          if(res.state==0){
            this.setState({chatMsg:[]})
          }else{
            this.setState({chatMsg:res})
          }
      })
      .catch((error) => {
        console.error(error);
      });
  }
  render() {
    sockettwo.onmessage = (e) => {
        if(e.data==2){
          this.loadNews();
        }
    }
    return (
      <ScrollView style={{flex:1}}>
        <View style={styles.container}>
          {this.displaySysMsg()}
          {this.displayChatMsg()}
        </View>
      </ScrollView>
    );
  }
}

class Friends extends React.Component {
  state={
    data:''
  }
  componentWillMount(){
    return fetch('http://192.168.43.44:8080/ifc/getFriendsList', {
        method: 'post',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'username='+id
      })
      .then((response) =>{
        let res=JSON.parse(response._bodyText);
        let dataArr=[];
        if(res[0].friends!=null){
          let friendsobject=JSON.parse(res[0].friends);
          for(let i=0;i<friendsobject.length;i++)
          {
            let string=friendsobject[i].name+'('+friendsobject[i].id+')';
            dataArr.push(string);
          }
          this.setState({data:dataArr})
        } 
      })
      .catch((error) => {
        console.error(error);
      });
  }
  handlePress(item){
    let data='';
    for(let i=item.length-12;i<item.length-1;i++)
    {
      data+=item[i];
    }
    NavigationService.navigate('Chatroom', { userName: id,friendsName:data,title:item });
  }
  render() {
    return (
      <View style={styles.container}>
        <SectionList
          sections={[
            {data: this.state.data}
          ]}
          renderItem={({item}) =><Text style={styles.item} onPress={()=>this.handlePress(item)}>{item}</Text>}
        />
      </View>
    );
  }
}

class Groups extends React.Component {
  state={
    data:''
  }
  componentWillMount(){
    this.getgrouplist();
  }
  getgrouplist(){
    return fetch('http://192.168.43.44:8080/getGroupsList', {
        method: 'post',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'userId='+id
      })
      .then((response) =>{
        let res=JSON.parse(response._bodyText);
        let dataArr=[]; 
        if(res[0].groups!=null){
          let groupsobject=JSON.parse(res[0].groups);
          for(let i=0;i<groupsobject.length;i++)
          {
            let string=groupsobject[i].groupName+'('+groupsobject[i].groupId+')';
            dataArr.push(string);
          }
          this.setState({data:dataArr})
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }
  handlePress(item){
    let data='';
    for(let i=item.length-6;i<item.length-1;i++)
    {
      data+=item[i];
    }
    NavigationService.navigate('GroupChat', { userName: id,GroupId:data,title:item });
  }
  render() {
    let getlist=this.getgrouplist();
    return (
      <View style={styles.container}>
          <Button 
              onPress={()=>NavigationService.navigate('createGroup', { userName: id,refresh:function(){
                getlist;
              }})}
              style={styles.create} 
              textStyle={{fontSize: 18,color:'white'}}>
              创建群聊
          </Button>
          <SectionList
            sections={[
              {data: this.state.data}
            ]}
            renderItem={({item}) => <Text style={styles.item} onPress={()=>this.handlePress(item)}>{item}</Text>}
          />
      </View>
    );
  }
}

class Profile extends React.Component {
  state={
    userId:'',
    name:'',
    city:''
  }
  componentWillMount(){
    return fetch('http://192.168.43.44:8080/getProfiles', {
        method: 'post',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'username='+id
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
  openPicture(){
    // ImagePicker.openPicker({
    //   width: 300,
    //   height: 400,
    //   cropping: true
    // }).then(image => {
    //   console.log(image);
    // });
    // console.warn(ImagePicker)
  }
  render() {
    
    return (
       <View style={styles.container}>
          <View style={{alignItems: 'center',}} >
            <TouchableHighlight  onPress={()=>this.openPicture()}>
              <Image source={require('../images/head.png')} style={styles.head}/>
            </TouchableHighlight>
          </View>
          <Text style={styles.text}>用户名:{this.state.userId}</Text>
          <Text style={styles.text}>姓名:{this.state.name}</Text>
          <Text style={styles.text}>城市:{this.state.city}</Text>
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
  text: {
    padding: 10,
    fontSize: 18,
    height: 44,
    borderBottomWidth:1,
    borderColor:'rgb(222,225,230)',
  },
  head:{
    borderWidth:3,
    borderColor:'rgb(222,225,230)',
    borderRadius:3
  },
  create:{
        width:170,
        backgroundColor:'rgb(247,161,89)',
        borderColor: 'rgb(193,193,193)',
        borderWidth: 1,
        marginLeft:100
    },
  item: {
    padding: 10,
    fontSize: 18,
    height: 44,
    borderBottomWidth:1,
    borderColor:'rgb(222,225,230)',
  },
  sectionHeader: {
    paddingTop: 2,
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 2,
    fontSize: 14,
    fontWeight: 'bold',
    backgroundColor: 'rgba(247,247,247,1.0)',
  },
  badge:{
    position: 'absolute',
    right: -6,
    top: -3,
    backgroundColor: 'red',
    borderRadius: 6,
    width: 12,
    height: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  name:{
    height:25,
    color:'rgb(247,161,89)',
    fontSize:18,
    marginLeft:15
  },
  MsgBadge:{
    position: 'absolute',
    right: 6,
    bottom: 15,
    backgroundColor: 'red',
    borderRadius: 6,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  MsgText:{
    marginLeft:15,
    paddingBottom:5
  },
  view:{
    marginTop:10,
    borderBottomWidth:1,
    borderColor:'rgb(222,225,230)',
  },
  button:{
    width:50,
    height:30,
    backgroundColor:'rgb(247,161,89)',
    borderColor: 'rgb(193,193,193)',
    borderWidth: 1,
    marginLeft:30,
    marginTop:10
  }
})

class IconWithBadge extends React.Component {
  render() {
    const { name, badgeCount, color, size } = this.props;
    return (
      <View style={{ width: 24, height: 24, margin: 5 }}>
        <FontAwesome name={name} size={size} color={color} />
        {badgeCount > 0 && (
          <View
            style={styles.badge}>
            <Text style={{ color: 'white', fontSize: 10, fontWeight: 'bold' }}>
              {badgeCount}
            </Text>
          </View>
        )}
      </View>
    );
  }
}
class Badge extends React.Component {
  render() {
    const badgeCount = this.props.badgeCount;
    return (
      <View>
        {badgeCount > 0 && (
          <View
            style={styles.MsgBadge}>
            <Text style={{ color: 'white', fontSize: 10, fontWeight: 'bold' }}>
              {badgeCount}
            </Text>
          </View>
        )}
      </View>
    );
  }
}

const HomeIconWithBadge = props => {
  return <IconWithBadge {...props} badgeCount={4} />;
};

const getTabBarIcon = (navigation, focused, tintColor) => {
  const { routeName } = navigation.state;
  let IconComponent = FontAwesome;
  let iconName;
  if (routeName === 'News') {
    iconName = `bullhorn`;
    IconComponent = HomeIconWithBadge;
  } else if (routeName === 'Friends') {
    iconName = `user`;
  }else if(routeName === 'Profile')
  {
    iconName = `id-badge`;
  }else if(routeName === 'Groups'){
    iconName = `user-plus`;
  }
  return <IconComponent name={iconName} size={25} color={tintColor} />;
};

const AppContainer=createAppContainer(
  createBottomTabNavigator(
    {
      News: { screen: News },
      Friends: { screen: Friends },
      Groups:{screen:Groups},
      Profile:{screen:Profile}
    },
    {
      defaultNavigationOptions: ({ navigation }) => ({
        tabBarIcon: ({ focused, tintColor }) =>
          getTabBarIcon(navigation, focused, tintColor),
      }),
      tabBarOptions: {
        activeTintColor: 'rgb(247,161,89)',
        inactiveTintColor: 'gray',
      },
    }
  )
);
export default class Main extends React.Component {
 
  //设置页面导航
static navigationOptions = {
    headerRight: (
        <FontAwesome name={'plus'} size={25} color={'gray'} 
        style={{marginRight:10}} onPress={() =>NavigationService.navigate('addFriendsAndGroups', { userName: id })}/>
    ),
  };
  
  render() {
    id=this.props.navigation.state.params.userName;
    return (
      <AppContainer
      />
    );
  }
}
