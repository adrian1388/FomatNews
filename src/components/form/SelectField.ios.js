/**
 * Selectable Component wrapped by FormIconBaseField
 * props:

   theme,
   margins,
   paddings,
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

import React, {useState} from 'react'
import {TextInput, TouchableOpacity} from 'react-native'
import {Picker} from '@react-native-community/picker'
import styled, {withTheme} from 'styled-components'
import {get} from 'lodash'
import {isString} from '../../utility/Util'
import FormIconBaseField from './FormIconBaseField'
import CardView from '../CardView'
import Modal from '../Modal'
import {Container} from '../common'
import FormIconButton from './FormIconButton'

const Input = styled(TextInput)`
  ${props => props.fontSize && `font-size: ${props.fontSize};`};
  ${props => props.color && `color: ${props.color};`};
  ${props => props.margins && `margin: ${props.margins};`};
  ${props => props.paddings && `padding: ${props.paddings};`};
  ${props => props.flex && `flex: ${props.flex};`};
  ${props => props.background && `background-color: ${props.background};`};
  ${props => props.width && `width: ${props.width};`};
  ${props => props.height && `height: ${props.height};`};
  ${props => props.maxWidth && `max-width: ${props.maxWidth};`};
  ${props => props.maxHeight && `max-height: ${props.maxHeight};`};
`

const SelectField = ({
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
  options,
  optionsLabel,
  placeholder,
  selectRecord = false,
  onChange = () => {},
  wrapperStyle,
  ...restProps
}) => {
  const inputHeight = theme.field.height.slice(0, -2) - 1,
    [visible, setVisible] = useState(false)
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
  optionsArray = [
    {value: null, label: placeholder || 'Seleccione...'},
    ...optionsArray
  ]

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
      {input => {
        const valArr = optionsArray.find(n => n.value === input.value)
        const val = valArr && valArr.label

        return (
          <TouchableOpacity
            style={{flex: 1}}
            onPress={() => {
              setVisible(true)
            }}
          >
            <Container pointerEvents='none'>
              <Input
                {...restProps}
                // background='red'
                margins='0 5px'
                paddings='0'
                width='100%'
                value={val}
                placeholder={optionsArray[0].label}
                placeholderTextColor={theme.globalPlaceholderColor}
                height={(height || inputHeight) + 'px'}
                // height={inputHeight + 'px'}
                fontSize={theme.field.fontSize || '13px'}
                color={theme.globalFontColor}
                editable={false}
              />
            </Container>

            <Modal
              style={{alignItems: 'center'}}
              transparent
              isVisible={visible}
              onBackdropPress={() => setVisible(false)}
            >
              <CardView
                cardElevation={5}
                cardMaxElevation={5}
                cornerRadius={10}
                flexDirection='row'
                backgroundColor='white'
              >
                <Container flex={1}>
                  <Picker
                    selectedValue={input.value}
                    onValueChange={(itemValue, itemPosition) => {
                      // const selectedOption = input.value ? options.find(item => item.id === input.value) : {}
                      // console.log('itemValue, itemPosition, selectedOption', itemValue, itemPosition, input.value ? optionsArray.find(item => item.value === itemValue) : {});
                      input.onChange(itemValue)
                      onChange(itemValue, itemPosition /*, selectedOption*/)
                    }}
                  >
                    {optionsArray.map((item, index) => (
                      <Picker.Item
                        key={item.value}
                        color={
                          index === 0
                            ? theme.globalPlaceholderColor
                            : input.value === item.value
                            ? theme.globalGreen
                            : theme.globalFontColor
                        }
                        label={item.label}
                        value={item.value}
                      />
                    ))}
                  </Picker>

                  <FormIconButton
                    title='OK'
                    paddings="10px 15px"
                    margins="15px"
                    alignSelf="center"
                    width='100px'
                    onPress={() => setVisible(false)}
                  />
                </Container>
              </CardView>
            </Modal>
          </TouchableOpacity>
        )
      }}
    </FormIconBaseField>
  )
}

export default withTheme(SelectField)
