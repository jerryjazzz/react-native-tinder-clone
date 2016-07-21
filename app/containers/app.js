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
} from 'react-native';

import {AnimatedCard, StaticCard} from '../components/cards'

const CARD_MARGIN =10
const SWIPE_THRESHOLD = 120;
const OFFSCREEN_DISTANCE = 500;

const {height, width} = Dimensions.get('window');

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
      pan : new Animated.ValueXY(),
      currentPerson: 0,
      nextPerson: 1
    }

    this.navPanResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: Animated.event([null,{
        dx: this.state.pan.x,
        dy: this.state.pan.y
      }]),
      onPanResponderRelease : (e, {vx, vy, dy, dx}) => {

      }
    })


    this.cardPanResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: Animated.event([null,{
        dx: this.state.pan.x,
        dy: this.state.pan.y
      }]),
      onPanResponderRelease : (e, {vx, vy, dy, dx}) => {

        if (Math.abs(dx) > SWIPE_THRESHOLD) {
          this.swipeCardOffscreen(dx, vx, vy, dy)
        } else {
          this.reCenterCard()
        }
      }
    })
  }

  swipeCardOffscreen(dx, vx, vy, dy) {

    let absVx = Math.abs(vx)
    let absDx = Math.abs(dx)
    let directionX = absDx/dx

    let destinationY = (absVx > 0) ? ((OFFSCREEN_DISTANCE/absVx)*vy) : 0 // calculate y ending position if it has velocity

    Animated.timing(this.state.pan,{ // spring off screen
      toValue:{x:directionX*OFFSCREEN_DISTANCE,y:(destinationY+ dy)},
      duration: 220
    }).start(this.nextCard.bind(this));
  }

  reCenterCard() {
    Animated.spring(this.state.pan,{
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
      this.state.pan.setValue({x: 0, y: 0});
    }, 50);
  }

  render() {

    let currentPerson = this.state.currentPerson

    let nextPerson = this.state.nextPerson

    return (
      <View style={styles.container}>     
        <View style={styles.header}>
        </View> 
        <StaticCard
          imageUrl = {People[nextPerson].profile}
          name = {People[nextPerson].name}
          age = {People[nextPerson].age}
          bio = {People[nextPerson].bio} />
        <AnimatedCard
          panHandlers = {this.cardPanResponder.panHandlers}
          pan = {this.state.pan}
          imageUrl = {People[currentPerson].profile}
          name = {People[currentPerson].name}
          age = {People[currentPerson].age}
          bio = {People[currentPerson].bio} />
        <View style={{height:100}}>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
    backgroundColor: '#F6F7F9',
  },
  card: {
    // flex:1,
    backgroundColor: 'white',
    // overflow: 'hidden',
    // alignItems: 'center',
    margin: CARD_MARGIN,
    borderColor: '#E8E8E8',
    // borderColor: 'transparent',
    borderWidth: 1,
    borderRadius: 8,

    shadowColor: "#000000",
    shadowOpacity: 0.05,
    shadowRadius: 2,
    shadowOffset: {
      height: 1,
      width: 0
    },
  },
  header:{
    height: 60
  },
  cardName: {
    color: '#2B2B2B',
    fontFamily: 'HelveticaNeue-medium',
    fontSize: 20
  },
  cardBio: {
    color: '#A4A4A4',
    fontFamily: 'HelveticaNeue',
    fontSize: 15
  },
  cardTextContainer: {
    flex:1,
    // backgroundColor:'red',
    justifyContent:'center',
    margin: 20
  },
  cardImageContainer: {
    // flex:1,
    overflow: 'hidden',
    // backgroundColor:'red',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,

  },
  cardImage: {
    width:400,
    height: 400,
    alignSelf: 'center',
  },
  nope: {
    width: 167,
    height: 96
  },
  nopeContainer: {
    position: 'absolute',
    top: 10,
    left: width-(CARD_MARGIN*2)-167-10,
    right: 0,
    bottom: 0,
  },
  like: {
    width: 143,
    height:89
  },
  likeContainer: {
    position: 'absolute',
    top: 10,
    left: 10,
    right: 0,
    bottom: 0,
  }
});