import React from 'react';
import {ButtonProps, StyleSheet, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

function CloseButton(props: any) {
  return (
    <TouchableOpacity onPress={props.onPress} style={[styles.closeButton]}>
      <Icon name={'close'} size={BUTTON_SIZE / 2} />
    </TouchableOpacity>
  );
}

const BUTTON_SIZE = 30;
const BORDER_WIDTH = 1;

const styles = StyleSheet.create({
  closeButton: {
    justifyContent: 'center',
    alignItems: 'center',
    width: BUTTON_SIZE + BORDER_WIDTH,
    height: BUTTON_SIZE + BORDER_WIDTH,
    borderWidth: BORDER_WIDTH,
    borderRadius: BUTTON_SIZE / 2,
    position: 'absolute',
    top: 20,
    right: 20,
    zIndex: 5, // added this to fix click issue
  },
});

export default CloseButton;
