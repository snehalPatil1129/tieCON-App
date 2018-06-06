import React from 'react';
import { View, Image, Alert, Keyboard, ActivityIndicator, TouchableOpacity } from 'react-native';
import { RkButton, RkText, RkTextInput, RkAvoidKeyboard, RkStyleSheet } from 'react-native-ui-kitten';
import { FontAwesome } from '../../assets/icons';
import { GradientButton } from '../../components/gradientButton';
import { RkTheme } from 'react-native-ui-kitten';
import { scale, scaleModerate, scaleVertical } from '../../utils/scale';
import firebase from '../../config/firebase';
import { NavigationActions } from 'react-navigation';
var firestoreDB = firebase.firestore();

function renderIf(condition, content) {
  if (condition) {
    return content;
  } else {
    return null;
  }
}

export class LoginV2 extends React.Component {
  static navigationOptions = {
    header: null
  };

  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      attendeeCount: '',
      delCount: '',
      attendeeCountId: '',
      isLoading: false,
      isSignUp: false
    };
  }

  _toggleSignUp() {
    this.setState({ isSignUp: !this.state.isSignUp })
  }

  _toggleLogin() {
    this.setState({ isSignUp: !this.state.isSignUp })
  }

  _onAuthenticate() {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!this.state.email || !re.test(this.state.email)) {
      Alert.alert(
        'Invalid Email',
        'Please enter valid email.',
        [
          { text: 'Ok', onPress: () => { } },
        ],
        { cancelable: false }
      );
      return;
    }

    if (!this.state.password || this.state.password.toString().trim().length < 6) {
      Alert.alert(
        'Invalid Password',
        'Invalid length of password.',
        [
          { text: 'Ok', onPress: () => { } },
        ],
        { cancelable: false }
      );
      return;
    }

    this.setState({ isLoading: true });

    firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.password).catch((error) => {
      let errorCode = error.code;
      let errorMessage = error.message;
      this.setState({ isLoading: false });
      Alert.alert(
        // errorCode,
        'Error',
        errorMessage,
        [
          { text: 'Cancel', onPress: () => { } },
        ],
        { cancelable: false }
      );
    });
  }

  _onSignUp() {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!this.state.email || !re.test(this.state.email)) {
      Alert.alert(
        'Invalid Email',
        'Please enter valid email.',
        [
          { text: 'Ok', onPress: () => { } },
        ],
        { cancelable: false }
      );
      return;
    }
    this.setState({ isLoading: true });
    this._checkPreviuosCount();
  }

  _checkPreviuosCount() {

    let attendeeLabel = 'DEL'
    let compRef = this;
    let nextCount;
    
    var docRef = firestoreDB.collection("AttendeeCount");
    docRef.get().then(function (snapshot) {
      let totalCount;
      let delCount;
      snapshot.forEach(function (doc) {
        attendeeCountId = doc.id;
        totalCount = doc.data().totalCount;
        delCount = doc.data().delCount;
      });

      nextCount = delCount + 1;
      delCount = nextCount

      compRef.setState({
        attendeeCountId: attendeeCountId,
        attendeeCount: nextCount,
        delCount: delCount,
      });
      compRef.createAttendee();

    })
  }

  createAttendee() {
    let attendeeCount = this.state.attendeeCount;
    let delCount = this.state.delCount;
    let emailId = this.state.email;
    let compRef = this;
    let attendeeLabel = 'DEL';
    let attendeeCountId = this.state.attendeeCountId;
    let attendeeCode = attendeeLabel + "-" + attendeeCount;
    let tblAttendee = "Attendee";
    let randomstring = 'ES' + Math.floor(1000 + Math.random() * 9000);
    let atendeeCountString = attendeeCount.toString();
    let profileServices = [];
    profileServices.push('Delegates');


    if (this.state.email) {

      fetch('https://us-central1-tiecon-portal.cloudfunctions.net/signUpUser', {
        method: 'POST',
        mode: 'no-cors',
        headers: new Headers({
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }),
        body: JSON.stringify(
          {
            firstName: '',
            lastName: '',
            userEmail: emailId,
            password: randomstring,
            contactNo: '',
            roleName: 'Delegates',
            address: '',
            displayName: '',
            fullName: '',
            profileServices: profileServices,
            timestamp: new Date(),
            registrationType: 'On Spot Registration',
            briefInfo: '',
            info: '',
            attendeeCount: atendeeCountString,
            attendeeLabel: attendeeLabel,
            attendanceId: '',
            sessionId: '',
            linkedInURL: '',
            profileImageURL: ''
          }
        )
      })
        .then(response => {

          if (response.status == 200) {
            Alert.alert("registration successfull");
            compRef._updateCount(attendeeCountId, delCount);
            compRef.setState({ email: "", isLoading: false, isSignUp: false });
          }
          else {
            Alert.alert("registration failed, try using another emailId");
            compRef.setState({ isLoading: false });
          }
        }
        ).catch(function (error) {

          compRef.setState({ isLoading: false, email: "" });
          Alert.alert("registration failed");
        });
    }
  }

  _updateCount(attendeeCountId, delCount) {
    firestoreDB.collection("AttendeeCount").doc(attendeeCountId).update({
      "delCount": delCount
    }).then(function () {
      //console.log("updated successfully");
    })
  }


  render() {
    let renderIcon = () => {
      if (RkTheme.current.name === 'light')
        return <Image style={styles.image} source={require('../../assets/images/logo.png')} />;
      return <Image style={styles.image} source={require('../../assets/images/logo.png')} />
    };

    return (
      <RkAvoidKeyboard
        style={styles.screen}
        onStartShouldSetResponder={(e) => true}
        onResponderRelease={(e) => Keyboard.dismiss()}>
        <View style={[styles.header, styles.loginHeader]}>
          {renderIcon()}
          <RkText rkType='light h1'>Tie</RkText>
          <RkText rkType='logo h0'>Pune</RkText>
        </View>

        {renderIf(!this.state.isSignUp,
          <View style={styles.content}>
            <View>
              <RkTextInput rkType='rounded' onChangeText={(text) => this.setState({ email: text })} placeholder='Username' style={styles.loginInput} />
              <RkTextInput rkType='rounded' onChangeText={(text) => this.setState({ password: text })} placeholder='Password' secureTextEntry={true} style={styles.loginInput} />
              <GradientButton colors={['#E7060E', '#f55050']} style={styles.save} rkType='large' text='LOGIN' onPress={this._onAuthenticate.bind(this)} />
            </View>
            <View style={styles.textRow}>
              <TouchableOpacity
                onPress={this._toggleSignUp.bind(this)}
              >
                <RkText style={{ marginTop: 5 }}>Sign up now </RkText>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {renderIf(this.state.isSignUp,
          <View style={styles.content}>
            <View>
              <RkTextInput rkType='rounded' onChangeText={(text) => this.setState({ email: text })} placeholder='Email Id' style={styles.loginInput} />
              <GradientButton colors={['#E7060E', '#f55050']} style={styles.save} rkType='large' text='SIGNUP' onPress={this._onSignUp.bind(this)} />
            </View>
            <View style={styles.textRow}>
              <TouchableOpacity
                onPress={this._toggleLogin.bind(this)}
              >
                <RkText style={{ marginTop: 5 }}>Back to Login</RkText>
              </TouchableOpacity>
            </View>
          </View>
        )}


        <View style={styles.content}>
          <View style={styles.footer}>
            <View style={styles.textRow}>
              <RkText style={{ marginTop: 20 }} rkType='primary3'>Powered by:</RkText>
            </View>
          </View>
          <View style={styles.buttons}>
            <RkButton style={styles.button} rkType='sponsors' style={{ marginTop: 5 }}>
              <Image style={styles.eternusLogo} source={require('../../assets/images/eternusLogoMain.png')} />;
            </RkButton>
          </View>
        </View>
        {renderIf(this.state.isLoading,
          <View style={styles.loading}>
            <ActivityIndicator size='large' />
          </View>
        )}
      </RkAvoidKeyboard>
    )
  }
}

let styles = RkStyleSheet.create(theme => ({
  screen: {
    padding: scaleVertical(16),
    flex: 1,
    justifyContent: 'space-between',
    backgroundColor: theme.colors.screen.base
  },
  image: {
    //height: scaleVertical(77),
    //resizeMode: 'contain'
  },
  header: {
    paddingBottom: scaleVertical(10),
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1
  },
  content: {
    justifyContent: 'space-between'
  },
  save: {
    marginVertical: 20,
    borderRadius: 0,
    backgroundColor: '#ed1b24'
  },
  buttons: {
    flexDirection: 'row',
    marginBottom: scaleVertical(24),
    marginHorizontal: 24,
    justifyContent: 'space-around',
  },
  textRow: {
    flexDirection: 'row',
    justifyContent: 'center'
  },
  button: {
    borderColor: theme.colors.border.solid
  },
  footer: {},
  loading: {
    position: 'absolute',
    left: 0,
    backgroundColor: 'black',
    opacity: 0.5,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center'
  },
  loginInput: {
    borderRadius: 0,
    borderWidth: 1,
    fontSize: 13,
    padding: 5,
  },
  loginHeader: {
    marginBottom: 20,
  },
  eternusLogo: {
    // width: 150,
    //height:25

    height: scaleVertical(25),
    resizeMode: 'contain'
  }
}));