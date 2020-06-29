/**
 * Checkbox Component wrapped by FormIconBaseField
 * props:

   theme,
   margins,
   paddings,
   width,
   height,
   iconWidth,
   backgroundColor,
   style,
   label,
   name,
   icon,
   value,
   onChange,
   ...restProps
 *
 * @format
 * @flow
 */

import React from 'react'
import {TouchableWithoutFeedback} from 'react-native'
import {withTheme} from 'styled-components'
import {faCheckSquare, faSquare} from '@fortawesome/free-regular-svg-icons'
import FormIconBaseField from './FormIconBaseField'
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome'
import {Container, Label} from '../common'

const CheckboxField = ({
  theme,
  labelMargins,
  color,
  iconSize,
  margins,
  paddings,
  width,
  height,
  iconWidth,
  backgroundColor,
  style,
  label,
  leftLabel,
  rightLabel,
  name,
  icon,
  onChange = () => {},
  ...restProps
}) => (
  <FormIconBaseField
    name={name}
    label={label}
    icon={icon}
    iconWidth={iconWidth}
    backgroundColor={backgroundColor}
    margins={margins}
    paddings={paddings}
    width={width}
    height={height}
  >
    {input => (
      <TouchableWithoutFeedback
        onPress={value => {
          input.onChange(!input.value)
          onChange(!input.value)
        }}
      >
        <Container flexDirection='row' alignItems='center' {...restProps}>
          {leftLabel && (
            <Label
              margins={labelMargins || '0 7px 0 0'}
              color={theme.field.labelColor || 'white'}
            >
              {leftLabel}
            </Label>
          )}
          <FontAwesomeIcon
            icon={input.value === true ? faCheckSquare : faSquare}
            size={iconSize || theme.field.icon.size || 20}
            color={color || theme.globalFontColor || 'white'}
          />
          {rightLabel && (
            <Label
              margins={labelMargins || '0 0 0 7px'}
              color={theme.field.labelColor || 'white'}
            >
              {rightLabel}
            </Label>
          )}
        </Container>
      </TouchableWithoutFeedback>
    )}
  </FormIconBaseField>
)

export default withTheme(CheckboxField)
