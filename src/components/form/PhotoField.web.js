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

import React, {useState} from 'react'
import {Image} from 'react-native'
import {withTheme} from 'styled-components'
import FormIconBaseField from './FormIconBaseField'
import {ImagePicker} from 'react-file-picker'
import {Container, Error} from '../common'

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
  onChange = () => {},
  inputMargin,
  placeholder,
  ...restProps
}) => {
  const [error, setError] = useState(null)

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
      borderRadius={width}
      borderBottomWidth='0px'
      {...restProps}
    >
      {input => (
        <Container alignItems='center'>
          <ImagePicker
            extensions={['jpg', 'jpeg', 'png']}
            dims={{
              minWidth: 100,
              maxWidth: 500,
              minHeight: 100,
              maxHeight: 500
            }}
            onChange={base64 => {
              input.onChange(base64)
              setError(null)
            }}
            onError={errMsg => setError(errMsg)}
          >
            <Image
              source={input.value ? {uri: input.value} : placeholder}
              width={width}
              height={height}
              style={{borderRadius: width, width, height}}
            />
          </ImagePicker>
          {error && error.indexOf('more than 500px') > 0 && (
            <Error>La imagen seleccionada es muy grande. Máximo 500px</Error>
          )}
        </Container>
      )}
    </FormIconBaseField>
  )
}

export default withTheme(PhotoField)
