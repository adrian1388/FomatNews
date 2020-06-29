/**
 * Component
 * Name: FormIconButton
 * Function: Use this component as a button.
 * Props:
   theme,
   margins,
   paddings,
   alignSelf,
   iconSize,
   color,
   borderTopWidth,
   borderBottomWidth,
   borderLeftWidth,
   borderRightWidth,
   borderColor,
   borderRadius,
   backgroundColor,
   style,
   onPress,
   leftIcon,
   rightIcon,
   title
 *
 * @format
 * @flow
 */

import React from 'react'
import {TouchableOpacity} from 'react-native'
import styled, {withTheme} from 'styled-components'
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome'
import {containerCss, Label} from '../common'

const Button = styled(TouchableOpacity)`
  ${containerCss};
  ${props => `border-top-width: ${props.borderTopWidth || props.theme.defaultButton.borderTopWidth};` }
  ${props => `border-bottom-width: ${props.borderBottomWidth || props.theme.defaultButton.borderBottomWidth};` }
  ${props => `border-left-width: ${props.borderLeftWidth || props.theme.defaultButton.borderLeftWidth};` }
  ${props => `border-right-width: ${props.borderRightWidth || props.theme.defaultButton.borderRightWidth};` }
  ${props => `border-color: ${props.borderColor || props.theme.defaultButton.borderColor};` }
  ${props => `border-radius: ${props.borderRadius || props.theme.defaultButton.borderRadius};` }
  ${props => `background-color: ${props.backgroundColor || props.theme.defaultButton.backgroundColor};` }
  ${props => `margin: ${props.margins || props.theme.defaultButton.margins};` }
  ${props => `padding: ${props.paddings || props.theme.defaultButton.paddings};` }
`;

const FormIconButton = ({
  theme,
  iconSize,
  color,
  leftIcon,
  rightIcon,
  title,
  labelFlex,
  fontSize,
  fontWeight,
  ...restProps
}) => (
  <Button {...restProps}>
    {leftIcon && (
      <FontAwesomeIcon
        icon={leftIcon}
        size={iconSize || theme.field.icon.size}
        color={color || theme.globalFontColor || 'white'}
      />
    )}
    {title ? (
      <Label
        flex={labelFlex}
        fontSize={fontSize || theme.field.fontSize || '15px'}
        fontWeight={fontWeight || theme.title.fontWeight || 'bold'}
        color={color || theme.title.color || 'white'}
        align='center'
      >
        {title}
      </Label>
    ) : null}
    {rightIcon && (
      <FontAwesomeIcon
        icon={rightIcon}
        size={iconSize || theme.field.icon.size}
        color={color || theme.globalFontColor || 'white'}
      />
    )}
  </Button>
)

export default withTheme(FormIconButton)
