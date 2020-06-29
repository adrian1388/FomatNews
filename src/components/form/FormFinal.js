/**
 * Component
 * Name: FormFinal
 *
 * This is a use of FINAL FORM. executing 'fetch' requests to server.
 * Props:

   endpoint,
   initialValues,
   validationSchema,
   contentType = 'application/json',
   onSuccess = () => {},
   children,
   buttons = () => {},
   submitButtonTitle,
   submitButtonLeftIcon,
   submitButtonRightIcon,
   submitButtonMargins,
   alignSelfButton,
   wrapper: Wrapper = Container,
   wrapperProps,
   flex = 1,
 *
 * @format
 * @flow
 */

import React, {Component} from 'react'
import {Form} from 'react-final-form'
import arrayMutators from 'final-form-arrays'
import {setIn} from 'final-form'
import {Text} from 'react-native'
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome'
import {faExclamation} from '@fortawesome/free-solid-svg-icons'
import {isEmpty} from 'lodash'

import {Container} from '../common'
import FormIconButton from './FormIconButton'
// import {recordDiff, doFetch} from '../../utility/Util'

const ErrorDiv = ({message, message2}) => {
  const displayError =
    message === 'Bad credentials'
      ? 'Usuario o contraseña incorrectos'
      : message.indexOf('Internal Server') > -1
      ? 'Error en el servidor:\n' +
        message2 +
        '\nPor favor, comuníquese con un técnico.'
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
      result = setIn(result, error.path, error.message)
    })
  }

  return result
}

const parametrizeJson = body => {
  return Object.entries(body)
    .map(e => e.join('='))
    .join('&')
}

class FormFinal extends Component {
  constructor(props) {
    super(props)
    this.state = {
      errors: {}
    }

    this.submitter = this.submitter.bind(this)
  }

  submitter(values, form, callback) {
    const {
      endpoint,
      initialValues,
      validationSchema,
      contentType = 'application/json',
      onSuccess = () => {},
      onBeforeFetch,
      onError = () => {},
      evalVersion = values.version,
      validationErrorMessage = 'Revise los datos ingresados, hay errores de validación.',
      setLoading
    } = this.props
    if (setLoading) {
      setLoading(true)
    }
    let sendData = 
    /*evalVersion
      ? recordDiff(initialValues || {}, values)
      : */values

    if (validationSchema) {
      return new Promise(resolve => {
        validationSchema
          .validate(values, {
            abortEarly: false,
            context: this.validationContext
          })
          .then(
            () => {
              if (onBeforeFetch)
                sendData = onBeforeFetch(sendData, resolve)
              
              // doFetch({
              //   endpoint,
              //   contentType,
              //   body:
              //     contentType === 'application/json'
              //       ? JSON.stringify(sendData)
              //       : parametrizeJson(sendData),
              //   onOK: data => {
              //     if (storage !== 'undefined' && data.token) {
              //       storage.setItem('csrfToken', data.token)
              //       onSuccess(data)
              //     } else if (data.message) {
              //       this.setState({errors: data})
              //     } else if (data.token) {
              //       // console.error(
              //       //   'Sorry, your browser does not support Web Storage...'
              //       // )
              //     } else {
              //       this.setState({errors: {}})
              //       onSuccess(data)
              //     }
              //     resolve()
              //     // this.setState({errors: {}})
              //   },
              //   onNotOK: data => {
              //     if (data.errors) {
              //       // resolve(unflattenYupError(data.errors))
              //       this.setState({errors: unflattenYupError(data.errors)})
              //     } else if (data.error) {
              //       // resolve({message: data.error, message2: data.message})
              //       this.setState({
              //         errors: {message: data.error, message2: data.message}
              //       })
              //       onError(data)
              //     }
              //     resolve()
              //   },
              //   onFetchError: data => {
              //     if (data.message) {
              //       // resolve({errors: {message: 'Falló la conexión con el servidor'}})
              //       this.setState({
              //         errors: {message: 'Falló la conexión con el servidor'}
              //       })
              //     }
              //     resolve()
              //   }
              // })
            },
            validationError => {
              this.setState({errors: {message: validationErrorMessage}})
              resolve(unflattenYupError(validationError.inner))
              setLoading(false)
            }
          )
      })
    } else {
      // There is no validation so we submit right away
      return new Promise(resolve => this.runSubmit(values, form, resolve))
    }
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
      wrapper: Wrapper = Container,
      wrapperProps,
      flex = 1,
      ...restProps
    } = this.props

    return (
      <Form
        {...restProps}
        subscription={{
          submitting: true,
          pristine: true,
          invalid: true
        }}
        mutators={{...arrayMutators, ...restProps.mutators}}
        onSubmit={this.submitter}
        // validate=
      >
        {({form, handleSubmit}) => (
          <Wrapper {...wrapperProps} flex={flex}>
            {children(form, handleSubmit)}

            {!isEmpty(this.state.errors) && this.state.errors.message && (
              <ErrorDiv
                message={this.state.errors.message}
                message2={this.state.errors.message2}
              />
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
                onPress={handleSubmit}
              />
            ) : null}
            {buttons(form, handleSubmit)}
          </Wrapper>
        )}
      </Form>
    )
  }
}

export default FormFinal
