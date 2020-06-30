import React, {Component} from 'react'
import {
  BackButton,
  Redirect,
  Router,
  Route,
  Switch
} from '../utility/routing'
import storage from '../utility/storage'
import Login from '../view/login/Login'
import Register from '../view/register/Register'
import Home from '../view/home/Home'

class AppProvider extends Component {
  constructor(props) {
    super(props)

    this.state = {
      user: null
    }
    this.changeStateToConnect = this.changeStateToConnect.bind(this)
    this.changeStateToDisconnect = this.changeStateToDisconnect.bind(this)
  }

  changeStateToConnect(data) {    
    if (data && data.username) {
      storage.setItem('user', JSON.stringify(data))
      this.setState({user: data})
    }
  }

  changeStateToDisconnect() {
    storage.removeItem('user', err => {
      console.log('error: ',err);
    }).then(res => {
      this.setState({user: null})
    })
  }

  componentDidMount() {
    storage.getItem('user').then(result => {
      if (result) {
        this.setState({user: result})
      }
    })
  }

  render() {
    return (
      <Router>
        <BackButton>
          {this.state.user ? (
            <Switch>
              {/* Add here Authenticated components */}
              <Route path='/'>
                <Home disconnectFunction={this.changeStateToDisconnect} />
              </Route>
              {/*<Route path="/profile" component={Profile} />*/}
              {this.props.children}
            </Switch>
          ) : (
            <Switch>
              {/* Add here Not Authenticated components */}
              <Route path='/' exact>
                <Login connectFunction={this.changeStateToConnect} />
              </Route>
              <Route path='/register' component={Register} />
              <Redirect to="/"/>
            </Switch>
          )}
        </BackButton>
      </Router>
    )
  }
}

export default AppProvider
