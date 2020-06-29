/**
 * Final Array Field Component with Icon and to have any component as children
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
   wrapperStyle,
   children,
   ...restProps
 *
 * @format
 * @flow
 */

import React from 'react'
import {FormSpy} from 'react-final-form'
import {FieldArray} from 'react-final-form-arrays'
import {View} from 'react-native'
import styled, {withTheme} from 'styled-components'
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome'
import {Container, containerCss, Error, Label} from '../common'
import {isString} from '../../utility/Util'

const FieldWrapper = styled(View)`
  ${containerCss};
  ${props =>
    props.borderTopWidth && `border-top-width: ${props.borderTopWidth};`};
  ${props =>
    props.borderBottomWidth &&
    `border-bottom-width: ${props.borderBottomWidth};`};
  ${props =>
    props.borderLeftWidth && `border-left-width: ${props.borderLeftWidth};`};
  ${props =>
    props.borderRightWidth && `border-right-width: ${props.borderRightWidth};`};
  ${props => props.borderColor && `border-color: ${props.borderColor};`};
  ${props => props.borderRadius && `border-radius: ${props.borderRadius};`};
`

const FormIconArrayField = ({
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
  wrapperStyle,
  children,
  ...restProps
}) => (
  <FieldArray name={name}>
    {({fields, meta}) => (
      <FormSpy subscription={{}}>
        {({form}) => (
          <Container
            backgroundColor={backgroundColor}
            margins={margins}
            paddings={paddings}
            width={width || '100%'}
            style={wrapperStyle}
          >
            {label ? (
              <Label
                fontSize={theme.field.fontSize || '15px'}
                color={theme.field.labelColor || 'white'}
              >
                {label}
              </Label>
            ) : null}
            <FieldWrapper
              paddings='5px'
              flexDirection='row'
              alignItems='center'
              borderTopWidth={theme.arrayField.borderTopWidth || '0px'}
              borderBottomWidth={theme.arrayField.borderBottomWidth || '0px'}
              borderLeftWidth={theme.arrayField.borderLeftWidth || '0px'}
              borderRightWidth={theme.arrayField.borderRightWidth || '0px'}
              borderColor={
                theme.arrayField.borderColor ||
                theme.globalPlaceholderColor ||
                'white'
              }
              backgroundColor={
                theme.arrayField.backgroundColor || 'transparent'
              }
              borderRadius={theme.arrayField.borderRadius || '0px'}
            >
              {icon && (
                <Container width={iconWidth} alignItems='center'>
                  <FontAwesomeIcon
                    icon={icon}
                    color={theme.field.icon.color || 'white'}
                    style={{width: iconWidth}}
                  />
                </Container>
              )}
              {children({fields, form})}
            </FieldWrapper>

            {(meta.error || meta.submitError) && isString(meta.submitError) && (
              <Error>{meta.error || meta.submitError}</Error>
            )}
          </Container>
        )}
      </FormSpy>
    )}
  </FieldArray>
)

export default withTheme(FormIconArrayField)
