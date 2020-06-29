import {Component} from 'react'
import {hasPermissions} from '../../utility/Util'
import {getStoredSessionInfo} from '../logic/Authentication'

/**
 * Component that renders children only if the logged in user has the specified permissions.
 */
class SecuredComponent extends Component {
  constructor(props) {
    super(props)
    this.state = {
      data: null
    }
  }

  async componentDidMount() {
    const dataSessInfo = await getStoredSessionInfo()
    this.setState({data: dataSessInfo})
  }

  render() {
    const {checkPermissions, children} = this.props,
      {data} = this.state

    // Render children either when there is no checkPermissions props or when the user has the permissions specified in checkPermissions props
    if (
      !checkPermissions ||
      (data &&
        data.permissions &&
        hasPermissions(data.permissions, checkPermissions))
    ) {
      return children
    }

    return null
  }
}

export default SecuredComponent
