/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */
import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Animated,
  PanResponder,
  Image,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  TouchableHighlight,
  ListView
} from 'react-native';


import * as firebase from 'firebase';

// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDSNmzN0G7Ngul_Kgct6tlUN-xqLlIJ6NI",
  authDomain: "tinderclone-99e7f.firebaseapp.com",
  databaseURL: "https://tinderclone-99e7f.firebaseio.com",
  storageBucket: "tinderclone-99e7f.appspot.com",
};
// const firebaseApp = firebase.initializeApp(firebaseConfig);

import {AnimatedCard, StaticCard} from '../components/cards'
import Icon from 'react-native-vector-icons/Ionicons';
import Separator from '../components/separator'


const AnimatedIcon = Animated.createAnimatedComponent(Icon);
const {height, width} = Dimensions.get('window');

const CARD_MARGIN = 10
const SWIPE_THRESHOLD = 120;
const OFFSCREEN_DISTANCE = 500;
const NAV_BUTTON_WIDTH = 60;
const HEADER_HEIGHT = 60;
const RED = 'rgba(253,108,105,1)';
const GREY = 'rgba(203,203,203,1)';
const PROFILE_PIC_WIDTH = 185



const People = [
  {profile: 'https://s32.postimg.org/3mpdee11h/Margot_8.jpg', name: 'Margot', age: 26, bio: 'Australian actress and hottie'},
  {profile: 'https://66.media.tumblr.com/dc215d60b3e63a257ebf7aa606b5313a/tumblr_o7u9x06HRR1unmtsfo1_500.jpg', name: 'Candice', age: 27, bio: 'South African supermodel'},
  {profile: 'https://homechef.imgix.net/https%3A%2F%2Fasset.homechef.com%2Fuploads%2Fmeal%2Fplated%2F2822%2Fhomechef_Christmas_Burrito__25_of_17_.jpg?ixlib=rails-1.1.0&w=750&s=73078fc708f78b2ff7022ec1731c6177', name: 'Burrito', age: "20 min", bio: 'Eat me bitch!'},
  {profile: 'https://cloudinary-a.akamaihd.net/readypulse/image/upload/b_white,c_pad,fl_progressive,g_center,q_90/6371_tw_697250020710481920.jpg', name: 'Pizza', age: '5 min', bio: 'You know you want a slice. . .'},
]
const NewMatches = People
console.log(NewMatches)

export default class tinderClone extends Component {
  constructor(props) {
    super(props)
    this.state = {
      cardPan : new Animated.ValueXY(),
      currentPerson: 0,
      nextPerson: 1,
      scrollEnabled: true,
      scrollValue: new Animated.Value(width),
      buttonsEnabled: true,
      ds: new ListView.DataSource({rowHasChanged: (rowOld, rowNew) => rowOld !== rowNew})

    }

    this.cardPanResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: () => this.setState({scrollEnabled: false}),
      onPanResponderMove: Animated.event([null,{
        dx: this.state.cardPan.x,
        dy: this.state.cardPan.y
      }]),
      onPanResponderRelease : (e, {vx, vy, dy, dx}) => {
        this.setState({scrollEnabled: true})
        if (Math.abs(dx) > SWIPE_THRESHOLD) {
          this.swipeCardOffscreen(dx, vx, vy, dy)
        } else {
          this.reCenterCard()
        }
      }
    })
  }

  componentDidMount() {
    this.refs.scroller.scrollTo({x:width, y:0, animated:false})
    this.setState({ds: this.state.ds.cloneWithRows([NewMatches,...People])});
  }

  swipeCardOffscreen(dx, vx=0, vy=0, dy=0) {

    const absVx = Math.abs(vx)
    const absDx = Math.abs(dx)
    const directionX = absDx/dx

    const destinationY = (absVx > 0) ? ((OFFSCREEN_DISTANCE/absVx)*vy) : 0 // calculate y ending position if it has velocity

    // We need to workout the distance and velovity of vector based on x and y
    // Old Pythagoras can help us out a2 + b2 = c2
    // then we calc the time by using v=d/t or rather t=d/v
    const vectorV = Math.sqrt((vx*vx)+(vy*vy))
    const vectorD = Math.sqrt((OFFSCREEN_DISTANCE*OFFSCREEN_DISTANCE)+((destinationY+ dy)*(destinationY+ dy)))

    Animated.timing(this.state.cardPan,{ // spring off screen
      toValue:{x:directionX*OFFSCREEN_DISTANCE,y:(destinationY+ dy)},
      duration: 280
    }).start(this.nextCard.bind(this));
  }

  reCenterCard() {
    Animated.spring(this.state.cardPan,{
      toValue:{x:0,y:0},
      friction: 4.5,
    }).start();    
  }

  nextCard() {
    const {currentPerson, nextPerson} = this.state
    this.setState({
      currentPerson: currentPerson >= (People.length -1) ? 0 : currentPerson + 1
    })
    setTimeout(() => {
      this.setState({
        nextPerson: nextPerson >= (People.length -1) ? 0 : nextPerson + 1
      })
      this.state.cardPan.setValue({x: 0, y: 0});
      this.setState({buttonsEnabled: true}) 
    }, 50);
  }

  createUser() {
    // firebaseApp.auth().createUserWithEmailAndPassword('i.am.justin.nothling@gmail.com','a1c1e111')
  }

  renderMessage(rowData) {
    return (
      <View style={{backgroundColor:'white', flexDirection:'row'}} >
        <View style={styles.chatPicMask}>
          <Image
            source={{uri:rowData.profile}}
            style={styles.chatPic}/>
        </View>
        <View style={{justifyContent:'center', marginLeft:5}}>
          <Text style={[styles.h1, {fontSize:18, marginBottom:2}]}>{rowData.name}</Text>
          <Text style={[styles.p]}>{rowData.bio}</Text>
        </View>
      </View>
    )
  }

  renderNewMatches(person, index) {
    return (
      <View style={{alignItems:'center', margin:10, marginRight:0}} key={index}>
        <View
          style={[styles.chatPicMask, {margin:0}]}
          >
          <Image
            source={{uri:person.profile}}
            style={styles.chatPic}/>
        </View>
        <Text style={[styles.h1, {fontSize:16}]}>{person.name}</Text>
      </View>
    )
  }
  renderRow(rowData,_,rowID) {
    if (rowID == 0) {
      return (
        <View>
          <Text style={[styles.h1, {color:RED, fontSize: 15, margin:10}]}>NEW MATCHES</Text>
          <ScrollView
            style={{backgroundColor:'white'}}
            horizontal={true}
            showsHorizontalScrollIndicator={false}>
            {rowData.map((person, index) => this.renderNewMatches(person, index))}
          </ScrollView>
        </View>
      )
    } else if (rowID == 1) {
      return (
        <View>
          <Text style={[styles.h1, {color:RED, fontSize: 15, margin:10}]}>MESSAGES</Text>
          {this.renderMessage(rowData)}
        </View>
      )
    } else {
    return (this.renderMessage(rowData))
    }
  }

  renderSeparator(_,rowID) {
    if (rowID == 0) {
      return <Separator marginLeft={10}  key={rowID}/>
    } else {
      return <Separator marginLeft={105}  key={rowID}/>
    }
  }


  render() {
    let currentPerson = this.state.currentPerson

    let nextPerson = this.state.nextPerson

    const iconPos = this.state.scrollValue.interpolate({inputRange: [0, width, 2*width], outputRange: [width/2- NAV_BUTTON_WIDTH/2,0, -width/2 + NAV_BUTTON_WIDTH/2 ]});
    const iconColor = this.state.scrollValue.interpolate({
            inputRange: [0, width],
            outputRange: [RED,GREY],
            extrapolate: 'clamp'
          });
    const iconColor2 = this.state.scrollValue.interpolate({
            inputRange: [0, width, width*2],
            outputRange: [GREY,RED,GREY],
            extrapolate: 'clamp'
          });
    const iconColor3 = this.state.scrollValue.interpolate({
            inputRange: [width, width*2],
            outputRange: [GREY,RED],
            extrapolate: 'clamp'
          });

    const iconSize = this.state.scrollValue.interpolate({
            inputRange: [0, width],
            outputRange: [1,.7],
            extrapolate: 'clamp'
          });
    const iconSize2 = this.state.scrollValue.interpolate({
            inputRange: [0, width, width*2],
            outputRange: [.7,1,.7],
            extrapolate: 'clamp'
          });
    const iconSize3 = this.state.scrollValue.interpolate({
            inputRange: [width, width*2],
            outputRange: [.7,1],
            extrapolate: 'clamp'
          });


    return (
        <View style={{flex: 1}}>
          <View style={styles.header}>
            <Animated.View style={[styles.iconContainer,{transform:[{translateX: iconPos }]}]}>
              <TouchableOpacity
                onPress={()=>this.refs.scroller.scrollTo({x:0, y:0, animated:true})}
                activeOpacity={.5}>
                  <AnimatedIcon
                    name={'ios-person'}
                    size={44}
                    ref={1}
                    style={[styles.icon, {color: iconColor},{transform:[{scale:iconSize}]}]}
                  />
              </TouchableOpacity>
              <AnimatedIcon
                name={'md-flame'}
                size={40}
                color={'red'}
                ref={2}
                style={[styles.icon, {color: iconColor2},{transform:[{scale:iconSize2}]}]}
                onPress={()=>this.refs.scroller.scrollTo({x:width, y:0, animated:true})}
              />
              <AnimatedIcon
                name={'ios-chatbubbles'}
                size={40}
                color={'red'}
                ref={3}
                style={[styles.icon, {color: iconColor3},{transform:[{scale:iconSize3}]}]}
                onPress={()=>this.refs.scroller.scrollTo({x:width*2, y:0, animated:true})}
              />
            </Animated.View>
          </View>

          <ScrollView
            ref='scroller'
            style={styles.scroller}
            horizontal={true}
            automaticallyAdjustInsets={false}
            scrollEnabled={this.state.scrollEnabled}
            showsHorizontalScrollIndicator={false}
            scrollEventThrottle={16}
            pagingEnabled={true}
            onScroll={Animated.event(
              [{nativeEvent: {contentOffset: {x: this.state.scrollValue}}}]
            )}
            >
            <View style={{flexDirection:'column'}}>

              <View style={{flexDirection:'row'}}>
                <View
                  style={styles.profileScreen}>
                  <View style={styles.profile}>
                    <View style={styles.profilePicMask}>
                      <Image
                        resizeMode='cover'
                        source={{uri: 'https://pbs.twimg.com/profile_images/29139742/hasselhoff-david-photo-xl-david-hasselhoff-6210194_400x400.jpg'}}
                        style={styles.profilePic}/>
                    </View>
                    <View style={styles.editBtn}>
                      <Icon
                        name={'md-create'}
                        size={25}
                        color={'white'}/>
                    </View>
                    <Text style={styles.name}>David</Text>
                    <Text style={styles.about}>Self-Employed</Text>
                    <Text style={[styles.about, {marginTop:25}]}>All round cool guy, best know for being drunk.</Text>
                  </View>
                  <View style={styles.settings}>
                    <TouchableHighlight
                      underlayColor='white'
                      onPress={()=> console.log('this')}
                      activeOpacity={.8}
                      style={styles.settingsBtn}>
                      <Text style={styles.settingsTxt}>EDIT PROFILE</Text>
                    </TouchableHighlight>
                    <TouchableHighlight
                      underlayColor='white'
                      onPress={()=> console.log('this')}
                      activeOpacity={.8}
                      style={styles.settingsBtn}>
                      <Text style={styles.settingsTxt}>SETTINGS</Text>
                    </TouchableHighlight>
                  </View>
                </View>
                <View style={styles.cardView} tabLabel={'ios-list'}>

                <TouchableHighlight
                  onPress={this.state.buttonsEnabled ? this.swipeCardOffscreen.bind(this,-1) : () => console.log('button Disabled')}
                  activeOpacity={.8}
                  underlayColor='white'
                  style={[styles.button,{top:height-HEADER_HEIGHT-60-30, left:width/3 - 30}]}>
                    <Image source={require('../images/x.png')} />
                </TouchableHighlight>

                <TouchableHighlight
                  onPress={this.state.buttonsEnabled ? this.swipeCardOffscreen.bind(this,1) : () => console.log('button Disabled')}
                  activeOpacity={.8}
                  underlayColor='white'
                  style={[styles.button,{top:height-HEADER_HEIGHT-60-30, left:width*(2/3) - 30}]}>
                    <Image source={require('../images/heart.png')} />
                </TouchableHighlight>
                  <StaticCard
                    imageUrl = {People[nextPerson].profile}
                    name = {People[nextPerson].name}
                    age = {People[nextPerson].age}
                    bio = {People[nextPerson].bio} />
                  <AnimatedCard
                    panHandlers = {this.cardPanResponder.panHandlers}
                    pan = {this.state.cardPan}
                    imageUrl = {People[currentPerson].profile}
                    name = {People[currentPerson].name}
                    age = {People[currentPerson].age}
                    bio = {People[currentPerson].bio} />

                </View>
                <View style={styles.chatScreen}>
                  <ListView
                    style= {styles.listView}
                    dataSource={this.state.ds}
                    renderRow={this.renderRow.bind(this)}
                    renderSeparator={this.renderSeparator}/>
                </View>
              </View>
            </View>
        </ScrollView>

      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex:1,
    backgroundColor: 'white',
  },
  scroller: {
    flex:1,
    // flexDirection: 'row',
    // backgroundColor: 'red',
    // width: width*3,
    // height:height
  },
  content: {
    // marginTop: 20,
    // paddingHorizontal: width,
    // alignItems: 'center',
    flex: 1,
  },
  cardView: {
    // flex:1,
    backgroundColor: '#F6F7F9'
  },
  iconContainer: {
    flexDirection: 'row',
    // position:'absolute',
    paddingTop: 20,
    backgroundColor:'transparent',
    width: width,
    height:HEADER_HEIGHT,
    alignItems:'center',
    justifyContent:'space-between',
    // backgroundColor:'blue'

  },
  icon: {
    paddingLeft:15,
    paddingRight:15,
  },
  header: {
    height: HEADER_HEIGHT,
    width: width*3,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
    // backgroundColor:'yellow',
    justifyContent:'center'
    // position:'absolute'
  },
  button: {
    width: 60,
    height: 60,
    backgroundColor: 'white',
    borderRadius: 40,
    shadowColor: "#000000",
    shadowOpacity: 0.05,
    shadowRadius: 2,
    shadowOffset: {
        height: 1,
        width: 0
    },
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute'
  },
  profileScreen: {
    height:height-HEADER_HEIGHT,
    width:width,
    backgroundColor:'white',
    alignItems:'center',
    justifyContent:'center'
  },
  profile: {
    flex:1,
    width: width,
    // height: height/2,
    alignItems:'center',
    justifyContent:'center',
    // backgroundColor:'blue'
  },
  profilePicMask: {
    width: PROFILE_PIC_WIDTH,
    height: PROFILE_PIC_WIDTH,
    backgroundColor: 'red',
    borderRadius: 100,
    shadowColor: "#000000",
    shadowOpacity: 0.05,
    shadowRadius: 2,
    shadowOffset: {
        height: 1,
        width: 0
    },
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  profilePic: {
    width:PROFILE_PIC_WIDTH,
    height: PROFILE_PIC_WIDTH,
  },
  editBtn: {
    width: 44,
    height: 44,
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: RED,
    shadowColor: "#000000",
    shadowOpacity: 0.15,
    shadowRadius: 2,
    shadowOffset: {
        height: 1,
        width: 0
    },
    position: 'absolute',
    left: width/2+PROFILE_PIC_WIDTH/4,
    top: 180
  },
  name: {
    color: '#2B2B2B',
    fontFamily: 'HelveticaNeue-medium',
    fontSize: 22,
    marginTop: 10,
    marginBottom: 5
  },
  about: { 
    color: '#A4A4A4',
    fontFamily: 'HelveticaNeue',
    fontSize: 15,
  },
  settings: {
    flex:.7,
    // backgroundColor:'blue'
  },
  settingsBtn: {
    width:width,
    height:60,
    alignItems:'center',
    justifyContent: 'center',
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
    // borderBottomWidth: 1,
    // borderBottomColor: 'rgba(0,0,0,0.05)',
    // backgroundColor:'blue'
  },
  settingsTxt: {
    color: RED,
    fontFamily: 'HelveticaNeue-medium',
    fontSize: 16,
  },
  chatScreen: {
    width: width,
    height: height-HEADER_HEIGHT,
    backgroundColor:'green'
  },
  listView: {
    flex:1,
    backgroundColor:'white'
  },
  chatPicMask: {
    width: 80,
    height: 80,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    margin:10
  },
  chatPic: {
    width:80,
    height: 80,
  },
  h1: {
    color: '#2B2B2B',
    fontFamily: 'HelveticaNeue-medium',
    fontSize: 22,
  },
  p: {
    color: '#A4A4A4',
    fontFamily: 'HelveticaNeue',
    fontSize: 15,
  }
});