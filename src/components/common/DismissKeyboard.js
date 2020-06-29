import React from "react";
import { Keyboard, Platform, TouchableWithoutFeedback } from "react-native";

/**
 * Hides the keyboard whenever the component wrapped with this component is tapped.
 * 
 * The idea is to catch when the user taps outside of a TextInput. This idea is from: https://stackoverflow.com/a/34779467/3669247
 */
const DismissKeyboard = ({ children }) =>
  Platform.OS === "web" ? (
    <React.Fragment>{children}</React.Fragment>
  ) : (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      {children}
    </TouchableWithoutFeedback>
  );

export default DismissKeyboard;
