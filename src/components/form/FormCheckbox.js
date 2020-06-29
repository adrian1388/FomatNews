/**
 * Component
 * Name: FormCheckbox
 * Function: Use this component as a Checkbox.
 * Props:
   theme,
   labelMargins,
   value,
   onPress = () => {},
   leftLabel,
   rightLabel,
 *
 * @format
 * @flow
 */

import React from 'react'
import {TouchableWithoutFeedback} from 'react-native'
import {withTheme} from 'styled-components'
import {faCheckSquare, faSquare} from '@fortawesome/free-regular-svg-icons'
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome'
import {Container, Label} from '../common'

const FormCheckbox = ({
  theme,
  labelMargins,
  value,
  onPress = () => {},
  leftLabel,
  rightLabel,
  iconSize,
  color,
  ...restProps
}) => {
  const checked = value === true
  return (
    <TouchableWithoutFeedback onPress={() => onPress(!checked)}>
      <Container flexDirection='row' alignItems='center' {...restProps}>
        {leftLabel && (
          <Label margins={labelMargins || '0 7px 0 0'}>{leftLabel}</Label>
        )}
        <FontAwesomeIcon
          icon={checked === true ? faCheckSquare : faSquare}
          size={iconSize || theme.field.icon.size || 20}
          color={color || theme.globalFontColor || 'white'}
        />
        {rightLabel && (
          <Label margins={labelMargins || '0 0 0 7px'}>{rightLabel}</Label>
        )}
      </Container>
    </TouchableWithoutFeedback>
  )
}

export default withTheme(FormCheckbox)
