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
  ScrollView
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
      cardPan : new Animated.ValueXY(),
      viewPan : new Animated.Value(0),
      currentPerson: 0,
      nextPerson: 1,
    }

    this.viewPanResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: Animated.event([null,{
        dx: this.state.viewPan,
      }]),
      onPanResponderRelease : (e, {vx, vy, dy, dx}) => {
        console.log('released scroller')
      }
    })

    this.cardPanResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: Animated.event([null,{
        dx: this.state.cardPan.x,
        dy: this.state.cardPan.y
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

  handleScroll(e) {
    console.log(e.nativeEvent)
  }

  render() {

    let currentPerson = this.state.currentPerson

    let nextPerson = this.state.nextPerson


    return (
      <View style={styles.container}> 
        <Animated.View
          style={[{transform:[{translateX: this.state.viewPan}]}]}
          {...this.viewPanResponder.panHandlers}>
          <View style={{width: width, height: 40}}>
          </View>
          <View style={styles.cardView}>
            <View style={styles.header}>
            </View> 
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
            <View style={{flex: 1}}>
            </View>
          </View>
        </Animated.View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex:1,
    backgroundColor: 'white',
  },
  scroll: {
  },
  header:{
    // flex: 1,
    height: 60
  },
  cardView: {
    // flex:1,
    backgroundColor: '#F6F7F9'
  }
});