import React, {Component} from 'react'
import {ThemeProvider} from 'styled-components'
import Header from '../../logic/Header'
import {Container} from './'

class GenericPage extends Component {
  render() {
    return (
      <Container flex={1}>
        <ThemeProvider
          theme={{
            header: {
              flex: 0.05,
              alignItems: 'center',
              justifyContent: 'space-between',
              backgroundColor: '#0b5a5f',
              backgroundColor1: '#fff',
              color: '#002463',
              logo: {
                width: '102px',
                height: '32px'
              }
            }
          }}
        >
          <Header home={this.props.home} homePress={this.props.homePress} />
        </ThemeProvider>

        {this.props.children}
      </Container>
    )
  }
}
export default GenericPage
