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

import React, { Component } from 'react'
import { Form } from 'react-final-form'
import arrayMutators from 'final-form-arrays'
import { setIn } from 'final-form'
import { Text } from 'react-native'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faExclamation } from '@fortawesome/free-solid-svg-icons'
import { isEmpty } from 'lodash'
import { Container } from '../common'
import FormIconButton from './FormIconButton'
import { injectIntl } from 'react-intl'

const ErrorDiv = ({ message, message2, intl }) => {
  const displayError =
    message === 'Bad credentials'
      ? intl.formatMessage({ id: 'passwordIncorrect' })
      : message
  return (
    <Container alignSelf='center'>
      <Text style={{ color: 'red', marginTop: 30, textAlign: 'center' }}>
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
      // endpoint,
      // initialValues,
      validationSchema,
      // contentType = 'application/json',
      // onSuccess = () => {},
      onBeforeFetch,
      // onError = () => {},
      // evalVersion = values.version,
      intl,
      validationErrorMessage = intl.formatMessage({id: 'checkFields'}),
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

              // fetch to SERVERS
            },
            validationError => {
              this.setState({ errors: { message: validationErrorMessage } })
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
      intl,
      children,
      buttons = () => { },
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
        mutators={{ ...arrayMutators, ...restProps.mutators }}
        onSubmit={this.submitter}
      >
        {({ form, handleSubmit }) => (
          <Wrapper {...wrapperProps} flex={flex}>
            {children(form, handleSubmit)}

            {!isEmpty(this.state.errors) && this.state.errors.message && (
              <ErrorDiv
                message={this.state.errors.message}
                message2={this.state.errors.message2}
                intl={intl}
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

export default injectIntl(FormFinal)
