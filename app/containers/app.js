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
} from 'react-native';


import {AnimatedCard, StaticCard} from '../components/cards'
import Icon from 'react-native-vector-icons/Ionicons';


const AnimatedIcon = Animated.createAnimatedComponent(Icon);
const {height, width} = Dimensions.get('window');

const CARD_MARGIN = 10
const SWIPE_THRESHOLD = 120;
const OFFSCREEN_DISTANCE = 500;
const NAV_BUTTON_WIDTH = 60;
const HEADER_HEIGHT = 60;
const RED = 'rgba(253,108,105,1)';
const GREY = 'rgba(203,203,203,1)';



const People = [
  {profile: 'https://s32.postimg.org/3mpdee11h/Margot_8.jpg', name: 'Margot', age: 26, bio: 'Australian actress and hottie'},
  {profile: 'https://66.media.tumblr.com/dc215d60b3e63a257ebf7aa606b5313a/tumblr_o7u9x06HRR1unmtsfo1_500.jpg', name: 'Candice', age: 27, bio: 'South African supermodel'},
  {profile: 'https://homechef.imgix.net/https%3A%2F%2Fasset.homechef.com%2Fuploads%2Fmeal%2Fplated%2F2822%2Fhomechef_Christmas_Burrito__25_of_17_.jpg?ixlib=rails-1.1.0&w=750&s=73078fc708f78b2ff7022ec1731c6177', name: 'Burrito', age: "20 min", bio: 'Eat me bitch!'},
  {profile: 'https://cloudinary-a.akamaihd.net/readypulse/image/upload/b_white,c_pad,fl_progressive,g_center,q_90/6371_tw_697250020710481920.jpg', name: 'Pizza', age: '5 min', bio: 'You know you want a slice. . .'},

]

export default class tinderClone extends Component {
  constructor(props) {
    super(props)
    this.state = {
      cardPan : new Animated.ValueXY(),
      currentPerson: 0,
      nextPerson: 1,
      scrollEnabled: true,
      scrollValue: new Animated.Value(width),
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
  }

  setView(value) {
    this.state.viewPan.setValue(value)
  }

  swipeCardOffscreen(dx, vx, vy, dy) {

    let absVx = Math.abs(vx)
    let absDx = Math.abs(dx)
    let directionX = absDx/dx

    let destinationY = (absVx > 0) ? ((OFFSCREEN_DISTANCE/absVx)*vy) : 0 // calculate y ending position if it has velocity

    Animated.timing(this.state.cardPan,{ // spring off screen
      toValue:{x:directionX*OFFSCREEN_DISTANCE,y:(destinationY+ dy)},
      duration: 220
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
    }, 50);
  }


          // <Animated.View style={[styles.tab,{transform:[{translateX: iconPos2 }]}]}>         
          //   <Icon
          //     name={'logo-android'}
          //     size={40}
          //     color={'red'}
          //     ref={1}
          //   />
          // </Animated.View>
          // <Animated.View style={[styles.tab,{transform:[{translateX: iconPos3 }]}]}>         
          //   <Icon
          //     name={'logo-android'}
          //     size={40}
          //     color={'red'}
          //     ref={1}
          //   />
          // </Animated.View>


  render() {

    let currentPerson = this.state.currentPerson

    let nextPerson = this.state.nextPerson

    const iconPos = this.state.scrollValue.interpolate({inputRange: [0, width, 2*width], outputRange: [width/2- NAV_BUTTON_WIDTH/2,0, -width/2 + NAV_BUTTON_WIDTH/2 ]});
    const iconPosTest = this.state.scrollValue.interpolate({inputRange: [0, width, 2*width], outputRange: [width/2- NAV_BUTTON_WIDTH/2,width, -width/2 + NAV_BUTTON_WIDTH/2 ]});
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

                  // <View style={{flex: 1}}>
                  //   <TouchableOpacity
                  //     onPress={()=> console.log('nope')}
                  //     activeOpacity={.5}
                  //     style={{transform:[{translateX: iconPos }]}}>
                  //       <AnimatedIcon
                  //         name={'logo-android'}
                  //         size={40}
                  //         ref={1}
                  //         style={[styles.icon]}
                  //       />
                  //   </TouchableOpacity>
                  // </View>

    return (
        <View style={{flex: 1}}>
          <Animated.View style={[styles.iconContainer,{transform:[{translateX: iconPos }]}]}>
            <TouchableOpacity
              onPress={()=>this.refs.scroller.scrollTo({x:0, y:0, animated:true})}
              activeOpacity={.5}>
                <AnimatedIcon
                  name={'logo-android'}
                  size={40}
                  ref={1}
                  style={[styles.icon, {color: iconColor},{transform:[{scale:iconSize}]}]}
                />
            </TouchableOpacity>
            <AnimatedIcon
              name={'logo-android'}
              size={40}
              color={'red'}
              ref={2}
              style={[styles.icon, {color: iconColor2},{transform:[{scale:iconSize2}]}]}
              onPress={()=>this.refs.scroller.scrollTo({x:width, y:0, animated:true})}
            />
            <AnimatedIcon
              name={'logo-android'}
              size={40}
              color={'red'}
              ref={3}
              style={[styles.icon, {color: iconColor3},{transform:[{scale:iconSize3}]}]}
              onPress={()=>this.refs.scroller.scrollTo({x:width*2, y:0, animated:true})}
            />
          </Animated.View>

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
                  style={{height:height,width:width, backgroundColor:'yellow'}}/>
                <View style={styles.cardView} tabLabel={'ios-list'}>
                <TouchableOpacity
                  onPress={()=> console.log('nope')}
                  activeOpacity={.5}
                  style={{transform:[{translateX: iconPos }]},{position:'absolute',top:510, left:0}}>
                    <AnimatedIcon
                      name={'logo-android'}
                      size={40}
                      ref={1}
                      style={{}}
                    />
                </TouchableOpacity>
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
                <View
                  style={{width: width, height: height, backgroundColor:'green'}}/>
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
    borderWidth: 1,
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderBottomColor: 'rgba(0,0,0,0.05)',
    backgroundColor:'red',
    // position:'absolute'
  },
});