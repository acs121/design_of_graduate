import React, { Component } from 'react';
import { Text,TextInput,StyleSheet,View,DeviceEventEmitter,Alert,SectionList } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import NavigationService from './NavigationService.js';
import lookOverUser from './lookOverUser.js'

export default class addFriendsAndGroups extends Component {
  state={
    searchList:''
  }
  changeList(msg) {
    this.setState({
      searchList:msg
    });
  }
  handlePress(item){
    item=item.substring(item.indexOf('(')+1,item.indexOf(')'));
    NavigationService.navigate('lookOverUser', 
    { userName: this.props.navigation.state.params.userName,id: item});
  }
  render() {
    return (
      <View style={styles.direction}>
        <View style={{flexDirection: 'row',marginTop:10}}>
          <SearchFriendsOrGroups changeList={msg=>this.changeList(msg)}/>
          <FontAwesome
              name={'search-plus'}
              size={30}
              color={'gray'}
              style={{marginLeft:10}}
              onPress={()=>DeviceEventEmitter.emit('sendmsg')}
          />
        </View>
        <SectionList
            sections={[
              {data: this.state.searchList}
            ]}
            renderItem={({item}) => <Text style={styles.item} onPress={()=>this.handlePress(item)}>{item}</Text>}
          />
      </View>
    );
  }
}

class SearchFriendsOrGroups extends Component {
  constructor(props) {
    super(props);
    this.state = { text: '' };
  }
  componentDidMount() {
      // 监听 msg 事件
    this.listener = DeviceEventEmitter.addListener('sendmsg',()=>{
      fetch('http://192.168.43.44:8080/searchFriendsAndGroups', {
            method: 'post',
            headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: 'searchText='+this.state.text
        })
        .then((response) =>{
            let res=JSON.parse(response._bodyText);
            if(res.state==0)
            {
              Alert.alert("没有找到该用户");
            }else if(res.state==1){
              let data=[];
              data.push(res.name+'('+res.id+')');
              this.props.changeList(data);
            }else if(res.state==2){
              let data=[];
              for(var i=0;i<res.data.length;i++)
              {
                data.push(res.data[i].name+'('+res.data[i].id+')');
              }
              this.props.changeList(data);
            }
        })
        .catch((error) => {
            console.error(error);
        });
    });
  }
  render() {
    return (
      <TextInput
      placeholder='查找好友或群'
        style={styles.searchInput}
        onChangeText={(text) => this.setState({text})}
      />
    );
  }
}

const styles = StyleSheet.create({
    searchInput:{
        height: 40,
        borderColor: 'rgb(193,193,193)',
        borderWidth: 3,
        width:300,
        marginLeft:10,
        borderRadius:20
    },
    direction:{
      flex:1,
      flexDirection: 'column',
      
    },
    item: {
    padding: 10,
    fontSize: 18,
    height: 44,
    borderBottomWidth:1,
    borderColor:'rgb(222,225,230)',
  }
})