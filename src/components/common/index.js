import React from 'react'
import {Text, View} from 'react-native'
import styled, {css, withTheme} from 'styled-components'
import LinearGradient from '../LinearGradient'

/* Generic CSS attributes that help the layout of any component. This would NOT include any color for example. */
const layoutCss = props => css`
  ${props => props.margins && `margin: ${props.margins};`};
  ${props => props.paddings && `padding: ${props.paddings};`};
  ${props => props.width && `width: ${props.width};`};
  ${props => props.height && `height: ${props.height};`};
  ${props => props.maxWidth && `max-width: ${props.maxWidth};`};
  ${props => props.maxHeight && `max-height: ${props.maxHeight};`};
  ${props => props.alignSelf && `align-self: ${props.alignSelf};`};
  ${props => props.flex && `flex: ${props.flex};`};
`

/* Generic CSS attributes that help the layout of a container. This would NOT include any color for example. */
const containerCss = props => css`
  ${props => props.flexDirection && `flex-direction: ${props.flexDirection};`};
  ${props => props.alignItems && `align-items: ${props.alignItems};`};
  ${props =>
    props.justifyContent && `justify-content: ${props.justifyContent};`};
  ${props => props.flexWrap && `flex-wrap: ${props.flexWrap};`};
  ${props => props.flexShrink && `flex-shrink: ${props.flexShrink};`};
  ${props =>
    props.backgroundColor && `background-color: ${props.backgroundColor};`};

  ${layoutCss};
`

/* View container that handles the layout CSS properties as props */
const Container = styled(View)`
  ${containerCss}
`

const Label = styled(Text)`
    ${containerCss};
    ${props => props.fontSize && `font-size: ${props.fontSize};`};
    ${props => props.color && `color: ${props.color};`};
    ${props => props.align && `text-align: ${props.align};`};
    ${props => props.fontWeight && `font-weight: ${props.fontWeight};`};
  `,
  TableLabel = withTheme(({theme, children, ...rP}) => (
    <Label
      align='left'
      width='100px'
      color={theme.globalBlue}
      paddings='5px'
      {...rP}
    >
      {children}
    </Label>
  ))

const Title = styled(withTheme(Text))`
  ${containerCss};
  ${props => `font-size: ${props.fontSize || props.theme.title.fontSize};`};
  ${props => `color: ${props.color || props.theme.title.color};`};
  ${props => `text-align: ${props.align || props.theme.title.align};`};
  ${props =>
    `font-weight: ${props.fontWeight || props.theme.title.fontWeight};`};
`

const Error = ({errorsHeight, children}) => (
  <Label style={{color: 'red'}}>{children}</Label>
)

const LinearGradientStyled = styled(LinearGradient)`
  ${containerCss}
`

export {
  layoutCss,
  containerCss,
  Container,
  Error,
  Label,
  TableLabel,
  Title,
  LinearGradientStyled
}
