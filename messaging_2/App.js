import React from 'react';
import { StyleSheet, Text, View, Alert, TouchableHighlight, Image, BackHandler } from 'react-native';

import Status from './components/Status';
import {
  createImageMessage,
  createLocationMessage,
  createTextMessage,
} from './utils/MessageUtils';
import MessageList from './components/MessageList';
import Toolbar from './components/Toolbar';
import ImageGrid from './components/ImageGrid';

import KeyboardState from './components/KeyboardState';
import MeasureLayout from './components/MeasureLayout';
import MessagingContainer, {
  INPUT_METHOD,
} from './components/MessagingContainer'; 

export default class App extends React.Component {

  state = {
    messages: [
      createLocationMessage({
        latitude: 37.78825,
        longitude: -122.4324,
      }),
      createImageMessage('https://unsplash.it/300/300'),
      createTextMessage('Dika'),
      createTextMessage('Budi'),
      createTextMessage('Budi'),
      createTextMessage('Budi'),
      createTextMessage('Budi'),
      createTextMessage('Tak'),
      
    ], 
    fullscreenImageId: null,
    isInputFocused: false,
    inputMethod: INPUT_METHOD.NONE,
  };

  componentWillMount() {
    this.subscription = BackHandler.addEventListener('hardwareBackPress', () => {
      const { fullscreenImageId } = this.state;

      if(fullscreenImageId) {
        this.dismissFullscreenImage();
        return true;
      }

      return false;

    });
  }

  componentWillUnmount() {
    this.subscription.remove();
  }

  handleChangeInputMethod = (inputMethod) => {
    this.setState({ inputMethod });
  };
 
  handlePressMessage = ({ id, type }) => { 
      console.log(type);
      switch(type) {
        case 'text':
          Alert.alert(
            'Delete Message?',
            'Are you sure you want to permanently delete this message?',
            [
              {
                text: 'Cancel',
                style: 'cancel'
              },
              {
                text: 'Delete',
                style: 'destructive',
                onPress: () => {
                  const { messages } = this.state;
                  this.setState({ messages: messages.filter(message => message.id !== id) })
                }
              }
            ]
          )
          break;
        case 'image':
          this.setState({ fullscreenImageId: id, isInputFocused: false });
          break;
        default:
          break;
      }
  }

  handlePressToolbarCamera = () => {
    this.setState({
      isInputFocused: false,
      inputMethod: INPUT_METHOD.CUSTOM,
    });
  }
  handlePressToolbarLocation = () => {
    const { messages } = this.state;

    navigator.geolocation.getCurrentPosition((position) => {
      this.setState({
        messages: [
          createLocationMessage({
            latitude,
            longitude,
          }),
          ...messages,
        ],
      }); 
    });
  }

  handleChangeFocus = (isFocused) => {
    console.log('isFocues: ', isFocused);
    this.setState({ isInputFocused: isFocused });
  };

  dismissFullscreenImage = () => {
    this.setState({ fullscreenImageId: null });
  };

  handleSubmit = (text) => {
    const { messages } = this.state;
    this.setState({
      messages: [createTextMessage(text), ...messages],
    });
  };

  handlePressImage = uri => {
    const { messages } = this.state;

    this.setState({
      messages: [createImageMessage(uri), ...messages],
    });
  }

  renderFullscreenImage = () => {
    const { messages, fullscreenImageId } = this.state;

    if (!fullscreenImageId) return null;

    const image = messages.find(message => message.id === fullscreenImageId);

    if (!image) return null;
    
    const { uri } = image;

    return (
      <TouchableHighlight style={styles.fullscreenOverlay} onPress={this.dismissFullscreenImage}>
        <Image style={styles.fullscreenImage} source={{ uri }} />
      </TouchableHighlight>
    );  
  }

  renderMessageList() {
    const { messages } = this.state;

    return (
      <View style={styles.content}>
        <MessageList messages={messages} onPressMessage={this.handlePressMessage} />
      </View>
    );
  }

  renderInputMethodEditor() {
    return (
      <View style={styles.inputMethodEditor}>
         <ImageGrid onPressImage={this.handlePressImage}/>
      </View>
    );
  }

  renderToolbar() {
    const { isInputFocused } = this.state;
    return (
      <View style={styles.toolbar}>
        <Toolbar
          isFocused={isInputFocused}
          onSubmit={this.handleSubmit}
          onChangeFocus={this.handleChangeFocus}
          onPressCamera={this.handlePressToolbarCamera}
          onPressLocation={this.handlePressToolbarLocation}/>
      </View>
    );
  }

  render() {
    const { inputMethod } = this.state;
    return (
      <View style={styles.container}>
        <Status />
        <MeasureLayout>
          {layout =>(
            <KeyboardState layout={layout}>
              {keyboardInfo => (
                <MessagingContainer
                  {...keyboardInfo}
                  inputMethod={inputMethod}
                  onChangeInputMethod={this.handleChangeInputMethod}
                  renderInputMethodEditor={this.renderInputMethodEditor}
                >
                  {this.renderMessageList()}
                  {this.renderToolbar()}
                </MessagingContainer>
              )}
            </KeyboardState>
          )}
        </MeasureLayout>
      </View>
    );
  }
} 

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  content: {
    flex: 1,
    backgroundColor: 'white'
  },
  inputMethodEditor: {
    flex: 1,
    backgroundColor: 'white',
  },
  toolbar: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.04)',
    backgroundColor: 'white',
  },
  fullscreenOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'black',
    zIndex: 2,
  },
  fullscreenImage: {
    flex: 1,
    resizeMode: 'contain',
  },
});  