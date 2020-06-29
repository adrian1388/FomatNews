/**
 * Date Selectable Component wrapped by FormIconBaseField
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

import React, {Fragment, useState} from 'react'
import {Dimensions, Platform, TextInput} from 'react-native'
import styled, {withTheme} from 'styled-components'
import {format} from 'date-fns'
import {Calendar} from 'react-native-calendars'
import {
  faBackspace,
  faCalendarAlt,
  faCaretLeft,
  faCaretRight,
  faCaretSquareLeft,
  faCaretSquareRight,
  faCheckSquare,
  faTimes
} from '@fortawesome/free-solid-svg-icons'
import {faEdit} from '@fortawesome/free-regular-svg-icons'
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome'
import FormIconButton from './FormIconButton'
import FormIconBaseField from './FormIconBaseField'
import CardView from '../CardView'
import Modal from '../Modal'
import {Container} from '../common'

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
  ${Platform.OS === "web" && "outline: none"};
`

const DateField = ({
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
  minDate,
  maxDate,
  onChange = () => {},
  inputMargin,
  inputWidth,
  ...restProps
}) => {
  const inputHeight = theme.field.height
      ? theme.field.height.slice(0, -2) - 1
      : 0,
    [calendarVisible, setCalendarVisible] = useState(false),
    [setYear, setSetYear] = useState(false),
    [yearVal, setYearVal] = useState(null)

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
      {input => {
        let temp = format(new Date(), 'yyyy-MM-dd')
        try {
          temp = format(
            new Date(
              input.value.split('-')[0],
              input.value.split('-')[1] - 1,
              input.value.split('-')[2]
            ),
            'yyyy-MM-dd'
          )
        } catch (e) {}

        return (
          <Fragment>
            <Container flex={1} flexDirection='row' alignItems='center'>
              <Input
                {...restProps}
                margins={inputMargin || '0 5px'}
                paddings='0'
                // flex={1}
                width={inputWidth || '90%'}
                height={(height || inputHeight) + 'px'}
                fontSize={theme.field.fontSize || '13px'}
                color={theme.globalFontColor || 'white'}
                selectionColor={theme.globalGreen}
                placeholderTextColor={theme.globalPlaceholderColor || 'white'}
                value={input.value}
                onChangeText={value => {
                  let val =
                    value.length === 4 || value.length === 7
                      ? value + '-'
                      : value.length > 10
                      ? input.value
                      : value

                  if (val.match(/[a-z]/i)) {
                    val = input.value
                  }
                  if (Number(val.substring(5, 7)) > 12) {
                    val = input.value
                  }
                  if (Number(val.substring(8, 10)) > 31) {
                    val = input.value
                  }

                  input.onChange(val)
                  onChange(val)
                }}
                underlineColorAndroid='transparent'
              />

              <FormIconButton
                borderTopWidth='0px'
                borderRightWidth='0px'
                borderBottomWidth='0px'
                borderLeftWidth='0px'
                margins='0'
                paddings='0'
                leftIcon={faCalendarAlt}
                onPress={() => setCalendarVisible(true)}
              />

              {input.value !== '' && (
                <FormIconButton
                  borderTopWidth='0px'
                  borderRightWidth='0px'
                  borderBottomWidth='0px'
                  borderLeftWidth='0px'
                  margins='0'
                  paddings='0'
                  leftIcon={faBackspace}
                  onPress={() => {
                    input.onChange()
                    onChange()
                  }}
                />
              )}
            </Container>

            <Modal
              animationType='slide'
              style={{alignItems: 'center'}}
              transparent
              isVisible={calendarVisible}
              onBackdropPress={() => setCalendarVisible(false)}
            >
              <CardView
                cardElevation={5}
                cardMaxElevation={5}
                cornerRadius={10}
                flexDirection='row'
                backgroundColor='white'
              >
                <FormIconButton
                  borderTopWidth='0px'
                  borderRightWidth='0px'
                  borderBottomWidth='0px'
                  borderLeftWidth='0px'
                  margins='15px 0'
                  paddings='10px'
                  leftIcon={faCaretSquareLeft}
                  onPress={() => {
                    let val = input.value
                      ? input.value.split('-')
                      : new Date()
                          .toISOString()
                          .split('T')[0]
                          .split('-')
                    input.onChange(
                      new Date(Number(val[0]) - 1, val[1] - 1, val[2])
                        .toISOString()
                        .split('T')[0]
                    )
                    onChange(
                      new Date(Number(val[0]) - 1, val[1] - 1, val[2])
                        .toISOString()
                        .split('T')[0]
                    )
                  }}
                />
                <Calendar
                  current={temp}
                  minDate={minDate}
                  maxDate={maxDate}
                  markedDates={{
                    [input.value || new Date().toISOString().split('T')[0]]: {
                      selected: true,
                      selectedColor: theme.globalGreen
                    }
                  }}
                  renderArrow={direction => (
                    <FontAwesomeIcon
                      icon={direction === 'left' ? faCaretLeft : faCaretRight}
                    />
                  )}
                  onDayPress={day => {
                    input.onChange(
                      new Date(day.year, day.month - 1, day.day)
                        .toISOString()
                        .split('T')[0]
                    )
                    onChange(
                      new Date(day.year, day.month - 1, day.day)
                        .toISOString()
                        .split('T')[0]
                    )
                    setCalendarVisible(false)
                  }}
                  style={{
                    paddingTop: 5,
                    width: Dimensions.get('window').width > 550 ? 500 : '88%',
                    minWidth: 280,
                    height: 380,
                    borderRadius: 10
                  }}
                  theme={{
                    todayTextColor: theme.globalGreen
                  }}
                />
                <FormIconButton
                  style={{position: 'absolute', top: 12, left: 220}}
                  alignItems='center'
                  flexDirection='row'
                  borderTopWidth='0px'
                  borderRightWidth='0px'
                  borderBottomWidth='0px'
                  borderLeftWidth='0px'
                  margins='0'
                  paddings='10px 0'
                  borderRadius='5px'
                  title=' '
                  leftIcon={faEdit}
                  onPress={() => {
                    setSetYear(true)
                  }}
                />
                {setYear && (
                  <Container
                    style={{
                      position: 'absolute',
                      top: 18,
                      left: 220,
                      borderColor: theme.globalBlue,
                      borderWidth: 1,
                      borderRadius: 5
                    }}
                    backgroundColor='white'
                    flexDirection='row'
                  >
                    <TextInput
                      style={{marginLeft: 10, width: 100}}
                      placeholder='1988'
                      value={yearVal}
                      onChangeText={val => setYearVal(val)}
                    />

                    <FormIconButton
                      borderTopWidth='0px'
                      borderRightWidth='0px'
                      borderBottomWidth='0px'
                      borderLeftWidth='0px'
                      margins='0'
                      paddings='5px'
                      leftIcon={yearVal ? faCheckSquare : faTimes}
                      onPress={() => {
                        let val = input.value
                          ? input.value.split('-')
                          : new Date()
                              .toISOString()
                              .split('T')[0]
                              .split('-')
                        input.onChange(
                          new Date(
                            Number(yearVal ? yearVal : val[0]),
                            val[1] - 1,
                            val[2]
                          )
                            .toISOString()
                            .split('T')[0]
                        )
                        onChange(
                          new Date(
                            Number(yearVal ? yearVal : val[0]),
                            val[1] - 1,
                            val[2]
                          )
                            .toISOString()
                            .split('T')[0]
                        )
                        setSetYear(false)
                      }}
                    />
                  </Container>
                )}
                <FormIconButton
                  borderTopWidth='0px'
                  borderRightWidth='0px'
                  borderBottomWidth='0px'
                  borderLeftWidth='0px'
                  margins='15px 0'
                  paddings='10px'
                  leftIcon={faCaretSquareRight}
                  onPress={() => {
                    let val = input.value
                      ? input.value.split('-')
                      : new Date()
                          .toISOString()
                          .split('T')[0]
                          .split('-')
                    input.onChange(
                      new Date(Number(val[0]) + 1, val[1] - 1, val[2])
                        .toISOString()
                        .split('T')[0]
                    )
                    onChange(
                      new Date(Number(val[0]) + 1, val[1] - 1, val[2])
                        .toISOString()
                        .split('T')[0]
                    )
                  }}
                />
              </CardView>
            </Modal>
          </Fragment>
        )
      }}
    </FormIconBaseField>
  )
}

export default withTheme(DateField)
