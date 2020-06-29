/**
 * Final Field Component with Icon and to have any component as children
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
import {Field} from 'react-final-form'
import {View} from 'react-native'
import styled, {withTheme} from 'styled-components'
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome'
import {Container, containerCss, Label, Error} from '../common'

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

const FormIconBaseField = ({
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
  fieldPadding,
  ...restProps
}) => {
  return (
    <Field name={name}>
      {({input, meta}) => {
        const inputHeight = theme.field.height
            ? theme.field.height.slice(0, -2) - 1
            : 0

        return (
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
              paddings={fieldPadding || theme.field.padding || '5px'}
              flexDirection='row'
              alignItems={theme.field.alignItems || 'center'}
              height={(height || inputHeight) + 'px'}
              borderTopWidth={theme.field.borderTopWidth || '0px'}
              borderBottomWidth={theme.field.borderBottomWidth || '0px'}
              borderLeftWidth={theme.field.borderLeftWidth || '0px'}
              borderRightWidth={theme.field.borderRightWidth || '0px'}
              borderColor={theme.field.borderColor || 'white'}
              backgroundColor={theme.field.backgroundColor || 'transparent'}
              borderRadius={theme.field.borderRadius || '0px'}
              {...restProps}
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
              {children(input)}
            </FieldWrapper>

            {meta.error || meta.submitError ? (
              <Error>{meta.error || meta.submitError}</Error>
            ) : null}
          </Container>
        )
      }}
    </Field>
  )
}

export default withTheme(FormIconBaseField)
