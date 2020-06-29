/**
 * Header Component
 *
 * @format
 * @flow
 */

import React, { Component } from 'react'
import { Image, TouchableOpacity } from 'react-native'
import styled, { withTheme } from 'styled-components'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import { withRouter } from '../utility/routing'
import FormIconButton from '../components/form/FormIconButton'
import { LinearGradientStyled } from '../components/common'
import Logo from '../assets/images/logo.png'
import placeholder from "../assets/images/user-icon-placeholder.png"
import storage from '../utility/storage'

const StyledImage = styled(Image)`
  ${props => props.width && `width: ${props.width};`}
  ${props => props.height && `height: ${props.height};`}
  ${props => props.borderRadius && `border-radius: ${props.borderRadius};`}
`

class Header extends Component {
  state = {
    user: {}
  }

  onBackPress = () => {
    this.props.history.goBack()
  }

  componentDidMount() {
    storage.getItem('user', (error, result) => {
      if (result) {
        this.setState({user: JSON.parse(result)})
      }
    })
  }

  render() {
    const {
      theme,
      color = theme.header.color,
      flex = theme.header.flex,
      alignItems = theme.header.alignItems,
      justifyContent = theme.header.justifyContent,
      backgroundColor = theme.header.backgroundColor || 'transparent',
      backgroundColor1 = theme.header.backgroundColor1 || 'transparent',
      home,
      flexDirection,
      homePress,
      ...restProps
    } = this.props
    const {user} = this.state
    const centered = theme.header.justifyContent !== 'center' ? false : true

    return (
      <LinearGradientStyled
        {...restProps}
        height={theme.header.height || '60px'}
        flexDirection={flexDirection || 'row'}
        flex={flex}
        alignItems={alignItems}
        justifyContent={justifyContent}
        paddings={!centered && '20px'}
        colors={[backgroundColor, backgroundColor1]}
      >
        <StyledImage
          source={Logo}
          alt='logo'
          width={centered ? '259px' : theme.header.logo.width}
          height={centered ? '100px' : theme.header.logo.height}
        />
        {!centered ? (
          <TouchableOpacity onPress={homePress}>
            {home
              ? <StyledImage
                  source={user.image ? {uri: user.image} : placeholder}
                  alt='logo'
                  width={theme.header.logo.height}
                  height={theme.header.logo.height}
                  borderRadius={theme.header.logo.height}
              />
              : <FormIconButton
                paddings={home ? '10px 0 10px 10px' : '10px 10px 10px 0'}
                margins='0'
                iconSize={20}
                color={color}
                borderColor='transparent'
                leftIcon={home ? home : faArrowLeft}
                onPress={home ? homePress : this.onBackPress}
              />
            }
          </TouchableOpacity>
        ) : null}
      </LinearGradientStyled>
    )
  }
}

export default withTheme(withRouter(Header))
