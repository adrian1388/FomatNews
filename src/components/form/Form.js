/**
 * Form Component
 * props:
 * body: Object to submit
 * children: Form fields
 * endpoint: Endpoint of the server which is going to receive and manipulate
 *           the body.
 * submitButton: true or false
 *
 * @format
 * @flow
 */

import React, {Component} from 'react'
import {Text} from 'react-native'
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome'
import {faExclamation} from '@fortawesome/free-solid-svg-icons'
import {isEmpty} from 'lodash'

import {Container} from '../common'
import FormIconButton from './FormIconButton'
import {differenceObject, doFetch} from '../../utility/Util'
import storage from '../../utility/storage'

const ErrorDiv = ({message, message2}) => {
  const displayError =
    message === 'Bad credentials'
      ? 'Usuario o contraseña incorrectos'
      : message.indexOf('Internal Server') > -1
      ? 'Error en el servidor:\n' + message2 + '\nPor favor, comuníquese con un técnico.'
      : message
  return (
    <Container alignSelf='center'>
      <Text style={{color: 'red', marginTop: 30, textAlign: 'center'}}>
        <FontAwesomeIcon icon={faExclamation} color='red' />
        {displayError}
      </Text>
    </Container>
  )
}

const unflattenYupError = errors => {
  let result = {}

  if (errors) {
    errors.forEach(error => {
      // result = setIn(result, error.path, error.type == "required" ? "requiredFieldError" : error.message);
      result = {
        ...result,
        [error.path || error.field]: error.message || error.defaultMessage
      }
    })
  }

  return result
}

const parametrizeJson = body => {
  return Object.entries(body)
    .map(e => e.join('='))
    .join('&')
}

class Form extends Component {
  constructor(props) {
    super(props)
    this.state = {
      errors: {}
    }

    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleSubmit(event) {
    const {
      endpoint,
      body,
      initialValues,
      validationSchema,
      contentType = 'application/json',
      onSuccess = () => {}
    } = this.props

    let sendData = body.version
      ? differenceObject(initialValues || {}, body)
      : body

    // console.log('differenceObject DIFF', initialValues || {}, body, sendData)
    validationSchema
      .validate(body, {abortEarly: false, context: this.validationContext})
      .then(
        () => {
          doFetch({
            endpoint,
            contentType,
            body:
              contentType === 'application/json'
                ? JSON.stringify(sendData)
                : parametrizeJson(sendData),
            onOK: data => {
              if (storage !== 'undefined' && data.token) {
                storage.setItem('csrfToken', data.token)
                onSuccess(data)
              } else if (data.message) {
                this.setState({errors: data})
              } else if (data.token) {
                // console.error(
                //   'Sorry, your browser does not support Web Storage...'
                // )
              } else {
                onSuccess(data)
              }
              // this.setState({errors: {}})
            },
            onNotOK: data => {
              console.log('notOk', data)
              if (data.errors) {
                this.setState({errors: unflattenYupError(data.errors)})
              } else if (data.error) {
                this.setState({errors: {message: data.error, message2: data.message}})
              }
            },
            onFetchError: data => {
              // console.log('fetchErr', data)
              if (data.message) {
                this.setState({
                  errors: {message: 'Falló la conexión con el servidor'}
                })
              }
            }
          })
        },
        validationError => {
          // console.log('validationError', validationError)
          this.setState({errors: unflattenYupError(validationError.inner)})
        }
      )
  }

  render() {
    const {
      children,
      buttons = () => {},
      submitButtonTitle,
      submitButtonLeftIcon,
      submitButtonRightIcon,
      submitButtonMargins,
      alignSelfButton,
      wrapper: Wrapper = React.Fragment,
      wrapperProps,
      ...restProps
    } = this.props

    return (
      <Container
        {...restProps}
        flex={1}
        // onSubmit={this.handleSubmit}
      >
        <Wrapper {...wrapperProps}>
          {children(this.state.errors)}
          {!isEmpty(this.state.errors) && this.state.errors.message && (
            <ErrorDiv message={this.state.errors.message} message2={this.state.errors.message2} />
          )}
          {submitButtonTitle ||
          submitButtonLeftIcon ||
          submitButtonRightIcon ? (
            <FormIconButton
              margins={submitButtonMargins}
              title={submitButtonTitle}
              leftIcon={submitButtonLeftIcon}
              rightIcon={submitButtonRightIcon}
              alignSelf={alignSelfButton || 'center'}
              onPress={this.handleSubmit}
            />
          ) : null}
          {buttons(this.handleSubmit)}
        </Wrapper>
      </Container>
    )
  }
}

export default Form
