/**
 * Time Component wrapped by FormIconBaseField
 * props:

   theme,
   margins,
   paddings,
   width,
   height,
   flex,
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
import {TextInput} from 'react-native'
import styled, {withTheme} from 'styled-components'
import {format as formatFn, parse as parseFn} from 'date-fns'
import FormIconBaseField from './FormIconBaseField'

const Input = styled(TextInput)`
  ${props => props.fontSize && `font-size: ${props.fontSize};`};
  ${props => props.color && `color: ${props.color};`};
  ${props => props.margins && `margin: ${props.margins};`};
  ${props => props.paddings && `padding: ${props.paddings};`};
  ${props => props.flex && `flex: ${props.flex};`};
  ${props =>
    props.backgroundColor && `background-color: ${props.backgroundColor};`};
  ${props => props.width && `width: ${props.width};`};
  ${props => props.height && `height: ${props.height};`};
  ${props => props.maxWidth && `max-width: ${props.maxWidth};`};
  ${props => props.maxHeight && `max-height: ${props.maxHeight};`};
`

const normalizeTime = time => {
  let newTime = time.replace(/[^\d]/g, '')

  if (newTime.length <= 2) return newTime

  newTime = newTime.substring(0, 4)
  return `${newTime.substring(0, newTime.length - 2)}:${newTime.substring(
    newTime.length - 2
  )}`
}

const formatText = (text, inFormat, outFormat) => {
  const time = parseFn(text, inFormat, new Date())

  if (isNaN(time)) {
    // A valid time has not been typed, but we update the state anyway because the input is controlled
    return text
  } else {
    // Update the selection time value
    return formatFn(time, outFormat)
  }
}

const TimeField = ({
  theme,
  margins,
  paddings,
  width,
  height,
  flex,
  iconWidth,
  backgroundColor,
  style,
  label,
  name,
  icon,
  onChange = () => {},
  inputMargin,
  ...restProps
}) => {
  const inputHeight = theme.field.height
    ? theme.field.height.slice(0, -2) - 1
    : 0

  return (
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
        <Input
          {...restProps}
          margins={inputMargin || '0 5px'}
          paddings='0'
          width='100%'
          height={(height || inputHeight) + 'px'}
          fontSize={theme.field.fontSize || '13px'}
          color={theme.globalFontColor || 'white'}
          selectionColor={theme.globalGreen}
          placeholderTextColor={theme.globalPlaceholderColor || 'white'}
          maxLength={5}
          onChangeText={value => {
            const val = formatText(normalizeTime(value), 'H:mm', 'HH:mm')
            input.onChange(val)
            onChange(val)
          }}
          value={formatText(input.value, 'HH:mm', 'H:mm')}
          underlineColorAndroid='transparent'
        />
      )}
    </FormIconBaseField>
  )
}

export default withTheme(TimeField)
