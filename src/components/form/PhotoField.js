/**
 * Photo Component wrapped by FormIconBaseField
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

import React, { useState } from 'react'
import { Image, TouchableOpacity } from 'react-native'
import { withTheme } from 'styled-components'
import FormIconBaseField from './FormIconBaseField'
import ImagePicker from 'react-native-image-picker'
import { useIntl } from 'react-intl'

const PhotoField = ({
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
  onChange = () => { },
  inputMargin,
  placeholder,
  ...restProps
}) => {
  const intl = useIntl()
  return (
    <FormIconBaseField
      name={name}
      label={label}
      icon={icon}
      iconWidth={iconWidth}
      backgroundColor={backgroundColor}
      margins={margins}
      paddings={paddings}
      width={width+"px"}
      height={height}
      borderRadius={width+"px"}
      borderBottomWidth='0px'
      {...restProps}
    >
      {input => (
        <TouchableOpacity
          onPress={() => {
            const options = {
              title: intl.formatMessage({id: 'select'}),
              takePhotoButtonTitle: intl.formatMessage({id: 'takePic'}),
              chooseFromLibraryButtonTitle: intl.formatMessage({id: 'openGal'}),
              cancelButtonTitle: intl.formatMessage({id: 'cancel'}),
              maxWidth: 500,
              maxHeight: 500,
              quiality: 1
            }

            /**
             * The first arg is the options object for customization (it can also be null or omitted for default options),
             * The second arg is the callback which sends object: response (more info in the API Reference)
             */
            ImagePicker.showImagePicker(options, response => {
              if (response.didCancel) {
                console.log('User cancelled image picker')
              } else if (response.error) {
                console.log('ImagePicker Error: ', response.error)
              } else if (response.customButton) {
                // TODO is this OK?
                console.log('User tapped custom button: ', response.customButton)
              } else {
                const source = 'data:' + response.type + ';base64,' + response.data

                input.onChange(source)
              }
            })
          }}
        >
          <Image
            source={input.value ? { uri: input.value } : placeholder}
            width={width}
            height={height}
            style={{ borderRadius: width, width: width, height: height }}
          />
        </TouchableOpacity>
      )}
    </FormIconBaseField>
  )
}

export default withTheme(PhotoField)
