/**
 * Checkbox Group Component wrapped by FormIconBaseField
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
import { TouchableWithoutFeedback } from 'react-native'
import { withTheme } from 'styled-components'
import { faCheckSquare, faSquare } from '@fortawesome/free-regular-svg-icons'
import FormIconBaseField from './FormIconBaseField'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { Container, Label } from '../common'

const CheckboxGroupField = ({
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
  options = [true, false],
  onChange = () => { },
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
        <Container flexDirection='row' alignItems='center' {...restProps}>
          {leftLabel && (
            <Label
              margins={labelMargins || '0 7px 0 0'}
              color={theme.field.labelColor || 'white'}
            >
              {leftLabel}
            </Label>
          )}
          <Container flexDirection='row'>
            {options.length > 0 &&
              options.map((opt, index) => (
                <TouchableWithoutFeedback
                  key={`${opt}` + index + ''}
                  onPress={() => {
                    input.onChange(opt)
                    onChange(opt)
                  }}
                >
                  <Container paddings={index && '0 0 0 5px'}>
                    <FontAwesomeIcon
                      icon={input.value === opt ? faCheckSquare : faSquare}
                      size={iconSize || theme.field.icon.size || 20}
                      color={color || theme.globalFontColor || 'white'}
                    />
                  </Container>
                </TouchableWithoutFeedback>
              ))}
          </Container>
          {rightLabel && (
            <Label
              margins={labelMargins || '0 0 0 7px'}
              color={theme.field.labelColor || 'white'}
            >
              {rightLabel}
            </Label>
          )}
        </Container>
      )}
    </FormIconBaseField>
  )

export default withTheme(CheckboxGroupField)
