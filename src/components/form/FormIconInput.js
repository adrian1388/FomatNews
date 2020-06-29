/**
 * Form Input Component with Icon
 * props:
   theme,
   margins,
   paddings,
   style,
   label,
   name,
   icon,
   value,
   errors,
   onChange,
   ...restProps
 *
 * @format
 * @flow
 */

import React from 'react'
import {TextInput, View} from 'react-native'
import styled, {withTheme} from 'styled-components'
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome'
import {Container, containerCss, Label, Error} from '../common'

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
  `,
  FieldWrapper = styled(View)`
    ${containerCss}
    ${props => props.borderTopWidth && `border-top-width: ${props.borderTopWidth};` }
    ${props => props.borderBottomWidth && `border-bottom-width: ${props.borderBottomWidth};` }
    ${props => props.borderLeftWidth && `border-left-width: ${props.borderLeftWidth};` }
    ${props => props.borderRightWidth && `border-right-width: ${props.borderRightWidth};` }
    ${props => props.borderColor && `border-color: ${props.borderColor};` }
    ${props => props.borderRadius && `border-radius: ${props.borderRadius};` }
  `;

const FormIconInput = ({
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
  errors,
  onChange,
  ...restProps
}) => {
  const inputHeight = theme.field.height.slice(0, -2) - 1,
    labelHeight = label ? theme.field.height.slice(0, -2) - 5 : 0,
    errorsHeight = errors ? theme.field.height.slice(0, -2) - 5 : 0

  return (
    <Container
      backgroundColor={backgroundColor}
      margins={margins}
      paddings={paddings}
      width={width || '100%'}
      height={(height || inputHeight) + labelHeight + errorsHeight + 'px'}
      // flex={flex || 1}
    >
      {label ? (
        <Label
          fontSize={theme.field.fontSize || '15px'}
          color={theme.globalFontColor || 'white'}
        >
          {label}
        </Label>
      ) : null}
      <FieldWrapper
        paddings="5px"
        flexDirection='row'
        alignItems='center'
        height={height || inputHeight}
        flex={1}
        borderTopWidth={theme.field.borderTopWidth || '0px'}
        borderBottomWidth={theme.field.borderBottomWidth || '0px'}
        borderLeftWidth={theme.field.borderLeftWidth || '0px'}
        borderRightWidth={theme.field.borderRightWidth || '0px'}
        borderColor={theme.globalPlaceholderColor || 'white'}
        backgroundColor={theme.field.backgroundColor || 'transparent'}
        borderRadius={theme.field.borderRadius || '0px'}
      >
        {icon && (
          <Container width={iconWidth} alignItems='center'>
            <FontAwesomeIcon
              icon={icon}
              color={theme.field.icon.color || 'white'}
              style={{
                // flex: 1,
                // backgroundColor: 'cyan',
                width: iconWidth
              }}
            />
          </Container>
        )}
        <Input
          {...restProps}
          margins='0 5px'
          paddings='0'
          // flex={1}
          width='100%'
          height={(height || inputHeight) + 'px'}
          fontSize={theme.field.fontSize || '13px'}
          color={theme.globalFontColor || 'white'}
          selectionColor={theme.globalGreen}
          placeholderTextColor={theme.globalPlaceholderColor || 'white'}
          onChangeText={value => onChange(name, value)}
          value={value}
          underlineColorAndroid='transparent'
        />
      </FieldWrapper>
      <Error errorsHeight={errorsHeight}>{errors && errors[name]}</Error>
    </Container>
  )
}

export default withTheme(FormIconInput)
