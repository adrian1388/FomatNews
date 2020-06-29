/**
 * Register View
 *
 * @format
 * @flow
 */

import React, { useState } from 'react'
import { withTheme } from 'styled-components'
import { faBars } from '@fortawesome/free-solid-svg-icons'
import { Container, Label } from '../../components/common'
import {Route, withRouter} from '../../utility/routing'
import GenericPage from '../../components/common/GenericPage'
import { News } from './News'
import { Profile } from '../profile/Profile'

const Register = ({history, disconnectFunction}) => {
  const [] = useState(false)
  return (
    <GenericPage
      home={faBars}
      homePress={() => history.push('/profile')}
    >
      <Container flex={1}>
        {console.log('DISCOOOOOO', disconnectFunction)}
        <Route path='/' exact component={News}/>
  <Route path='/profile' exact component={rp => <Profile {...rp} disconnectFunction={disconnectFunction} />} />
      </Container>

    </GenericPage>
    
  )
}

export default withTheme(withRouter(Register))
