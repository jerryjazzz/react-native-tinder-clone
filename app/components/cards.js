import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  Animated,
  Dimensions
} from 'react-native';


const {height, width} = Dimensions.get('window');
const CARD_MARGIN =10

export class AnimatedCard extends Component {

	constructor(props) {
		super(props)
	}

	render() {

		const { imageUrl, name, age, bio, panHandlers, pan, cardPosition} = this.props;

	  let rotate = pan.x.interpolate({inputRange: [-200, 0, 200], outputRange: ["15deg", "0deg", "-15deg"]});
    let animatedCardStyles = {transform: [{rotate}]};
    //like animated opacity
    let likeOpacity = pan.x.interpolate({inputRange: [0, 150], outputRange: [0, 1]});
    //like animated opacity
    let nopeOpacity = pan.x.interpolate({inputRange: [-150, 0], outputRange: [1, 0]});
		return (
      <Animated.View
        {...panHandlers}
        style ={[pan.getLayout(), animatedCardStyles, styles.card]}>
        <View style={styles.cardImageContainer}>
          <Image
            style= {styles.cardImage}
            resizeMode='cover'
            source={{uri: imageUrl}}
          />
          <Animated.View style={[styles.likeContainer, {opacity: likeOpacity}]}>
            <Image
              style= {styles.like}
              source={require('../images/like.png')}
            />
          </Animated.View>
          <Animated.View style={[styles.nopeContainer, {opacity:nopeOpacity}]}>
            <Image
              style= {styles.nope}
              source={require('../images/nope.png')}
            />
          </Animated.View>
        </View>
        <View style={styles.cardTextContainer}>
          <Text style ={styles.cardName}>{name + ', ' + age}</Text>
          <Text style={styles.cardBio}>{bio}</Text>
        </View>
      </Animated.View>
		);
	}
}

export class StaticCard extends Component {

	constructor(props) {
		super(props)
	}

	render() {

		const { imageUrl, name, age, bio } = this.props;
		return (
      <View
        style ={[styles.card, {position:'absolute'}]}>
        <View style={styles.cardImageContainer}>
          <Image
            style= {styles.cardImage}
            resizeMode='cover'
            source={{uri: imageUrl}}
          />
        </View>
        <View style={styles.cardTextContainer}>
          <Text style ={styles.cardName}>{name + ', ' + age}</Text>
          <Text style={styles.cardBio}>{bio}</Text>
        </View>
      </View>
		);
	}
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    margin: CARD_MARGIN,
    borderColor: '#E8E8E8',
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
  cardImageContainer: {
    overflow: 'hidden',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  cardImage: {
    width:400,
    height: 400,
    alignSelf: 'center',
  },
  cardTextContainer: {
    flex:1,
    justifyContent:'center',
    margin: 20
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

})