/**
 * Form Select Component with Icon
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
import {View} from 'react-native'
import {Picker} from '@react-native-community/picker'
import styled, {withTheme} from 'styled-components'
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome'
import {get} from 'lodash'
import {Container, containerCss, Error, Label} from '../common'
import {isString} from '../../utility/Util'

const Input = styled(Picker)`
    ${props => props.fontSize && `font-size: ${props.fontSize};` }
    ${props => props.color && `color: ${props.color};` }
    ${props => props.margins && `margin: ${props.margins};` }
    ${props => props.paddings && `padding: ${props.paddings};` }
    ${props => props.flex && `flex: ${props.flex};` }
    ${props => props.background && `background-color: ${props.background};` }
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
  `;

const FormIconSelect = ({
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
  options,
  errors,
  onValueChange,
  optionsLabel,
  selectRecord = false,
  ...restProps
}) => {
  const inputHeight = theme.field.height.slice(0, -2) - 1,
    labelHeight = label ? theme.field.height.slice(0, -2) - 5 : 0,
    errorsHeight =
      errors && errors[name] ? theme.field.height.slice(0, -2) - 5 : 0
  let optionsArray = selectRecord
    ? options.map(opt => {
        let myLabel = get(opt, optionsLabel, '')
        if (!isString(optionsLabel)) {
          optionsLabel.forEach(lbl => {
            myLabel = myLabel + ' ' + get(opt, lbl)
          })
        }
        myLabel = myLabel.trim()

        return {value: opt.id, label: myLabel}
      })
    : options
  optionsArray = [{value: null, label: 'Seleccione...'}, ...optionsArray]
  const selectedOption = value ? options.find(item => item.id === value) : {}

  return (
    <Container
      backgroundColor={backgroundColor}
      margins={margins}
      paddings={paddings}
      width={width || '100%'}
      height={height || inputHeight + labelHeight + errorsHeight + 'px'}
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
        flexDirection='row'
        alignItems='center'
        height={theme.field.height}
        flex={1}
        borderTopWidth={theme.field.borderTopWidth || '0px'}
        borderBottomWidth={theme.field.borderBottomWidth || '0px'}
        borderLeftWidth={theme.field.borderLeftWidth || '0px'}
        borderRightWidth={theme.field.borderRightWidth || '0px'}
        borderColor={theme.globalPlaceholderColor || 'white'}
        backgroundColor={theme.field.backgroundColor || 'transparent'}
      >
        {icon && (
          <Container width={iconWidth} alignItems='center'>
            <FontAwesomeIcon
              icon={icon}
              color={theme.field.icon.color || 'white'}
              style={{
                width: iconWidth
              }}
            />
          </Container>
        )}
        <Input
          {...restProps}
          background='transparent'
          margins='0 5px'
          paddings='0'
          width='100%'
          height={inputHeight + 'px'}
          fontSize={theme.field.fontSize || '13px'}
          color={theme.globalFontColor}
          itemStyle={{color: theme.globalFontColor}}
          style={{borderColor: 'transparent'}}
          selectedValue={value}
          onValueChange={(itemValue, itemPosition) => {
            onValueChange(itemValue, itemPosition, selectedOption)
          }}
        >
          {optionsArray.map((item, index) => (
            <Picker.Item
              key={item.value}
              color={
                index === 0
                  ? theme.globalPlaceholderColor
                  : value === item.value
                  ? theme.globalGreen
                  : theme.globalFontColor
              }
              label={item.label}
              value={item.value}
            />
          ))}
        </Input>
      </FieldWrapper>
      <Error errorsHeight={errorsHeight}>{errors && errors[name]}</Error>
    </Container>
  )
}

export default withTheme(FormIconSelect)
