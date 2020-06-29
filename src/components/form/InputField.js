/**
 * TextInput Component wrapped by FormIconBaseField
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
import {Platform, TextInput} from 'react-native'
import styled, {withTheme} from 'styled-components'
import FormIconBaseField from './FormIconBaseField'

const Input = styled(TextInput)`
    ${props => props.fontSize && `font-size: ${props.fontSize};` }
    ${props => props.color && `color: ${props.color};` }
    ${props => props.margins && `margin: ${props.margins};` }
    ${props => props.paddings && `padding: ${props.paddings};` }
    ${props => props.flex && `flex: ${props.flex};` }
    ${props => props.backgroundColor && `background-color: ${props.backgroundColor};` }
    ${props => props.width && `width: ${props.width};` }
    ${props => props.height && `height: ${props.height};` }
    ${props => props.maxWidth && `max-width: ${props.maxWidth};` }
    ${props => props.maxHeight && `max-height: ${props.maxHeight};` }
    ${Platform.OS === "web" && "outline: none"};
  `;

const InputField = ({
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
  wrapperStyle,
  ...restProps
}) => {
  const inputHeight = theme.field.height ? theme.field.height.slice(0, -2) - 1 : 0

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
      wrapperStyle={wrapperStyle}
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
          onChangeText={value => {
            input.onChange(value.trim())
            onChange(value.trim())
          }}
          value={input.value && input.value.toString()}
          underlineColorAndroid='transparent'
        />
      )}
    </FormIconBaseField>
  )
}

export default withTheme(InputField)
