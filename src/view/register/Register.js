/**
 * Register View
 *
 * @format
 * @flow
 */

import React, { Fragment, useState } from 'react'
import { ScrollView, ActivityIndicator } from 'react-native'
import { string as yupString, object as yupObject, ref as yupRef } from 'yup'
import { faLock } from '@fortawesome/free-solid-svg-icons'
import { faUser } from '@fortawesome/free-regular-svg-icons'
import { omit } from 'lodash'
import Header from '../../logic/Header'
import FormFinal from '../../components/form/FormFinal'
import InputField from '../../components/form/InputField'
import { Container, Title } from '../../components/common'
import { withRouter } from '../../utility/routing'
import storage from '../../utility/storage'
import { useIntl } from 'react-intl'

const Register = ({ history }) => {
  const [loading, setLoading] = useState(false),
    intl = useIntl(),
    fieldMargin = '25px 0 0';
  return (
    <Container flex={1}>
      <Header flexDirection='row-reverse' />
      <FormFinal
        onBeforeFetch={(sendData, resolve) => {
          const data = omit(sendData, 'confirmPassword')

          storage.getItem('users', (err, res) => {
            let arr = []
            if (!res) {
              arr.push(data)
              storage.setItem('users', JSON.stringify(arr))
              setLoading(false)
              resolve()
              history.goBack()
            }
            if (!err && res) {
              arr = JSON.parse(res)

              if (!arr.find(a => a.username === data.username)) {
                arr.push(data)
                storage.setItem('users', JSON.stringify(arr))
                setLoading(false)
                resolve()
                history.goBack()

              } else {
                setLoading(false)
                resolve({ username: intl.formatMessage({ id: 'usernameAlready' }) })
              }
            }
          })
        }}
        validationSchema={yupObject().shape({
          username: yupString().min(3).required(intl.formatMessage({id: 'required'})),
          password: yupString()
            .matches(
              /^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{8,}$/,
              intl.formatMessage({ id: 'passwordInstructions' })
            )
            .required(intl.formatMessage({id: 'required'})),
          confirmPassword: yupString()
            .oneOf(
              [yupRef('password'), null],
              intl.formatMessage({id: 'mustBeSame'})
            )
            .required(intl.formatMessage({id: 'mustConfirm'}))
        })}
        setLoading={setLoading}
        submitButtonTitle={intl.formatMessage({ id: 'saveAccount' })}
        wrapper={ScrollView}
        wrapperProps={{
          contentContainerStyle: {
            maxWidth: 350,
            width: '100%',
            alignSelf: 'center',
            marginLeft: 70,
            marginRight: 70
          },
          keyboardShouldPersistTaps: 'handled'
        }}
      >
        {() => (
          <Fragment>
            {loading && <ActivityIndicator />}
            <Title margins='30px 0 50px'>{intl.formatMessage({ id: 'register' })}</Title>
            <InputField
              margins={fieldMargin}
              placeholder={intl.formatMessage({ id: 'username' })}
              name='username'
              autoCapitalize='none'
              maxLength={10}
              icon={faUser}
            />
            <InputField
              margins={fieldMargin}
              secureTextEntry
              name='password'
              placeholder={intl.formatMessage({ id: 'password' })}
              icon={faLock}
            />
            <InputField
              margins={fieldMargin}
              secureTextEntry
              name='confirmPassword'
              placeholder={intl.formatMessage({ id: 'confirmPassword' })}
              icon={faLock}
            />
          </Fragment>
        )}
      </FormFinal>
    </Container>
  )
}

export default withRouter(Register)
