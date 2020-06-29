/**
 * Login View
 *
 * @format
 * @flow
 */

import React, { Fragment, useState } from 'react'
import { ActivityIndicator, ScrollView } from 'react-native'
import { ThemeProvider } from 'styled-components'
import { string as yupString, object as yupObject } from 'yup'
import { faLock } from '@fortawesome/free-solid-svg-icons'
import { faUser } from '@fortawesome/free-regular-svg-icons'
import { Field } from 'react-final-form'
import { withRouter } from '../../utility/routing'
import Header from '../../logic/Header'
import FormFinal from '../../components/form/FormFinal'
import InputField from '../../components/form/InputField'
import FormIconButton from '../../components/form/FormIconButton'
import { Container } from '../../components/common'
import storage from '../../utility/storage'

const Login = ({ connectFunction = () => { }, history }) => {
  const [loading, setLoading] = useState(false);
    return (
      <Container flex={1}>
        <ThemeProvider
          theme={{
            header: {
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center'
            }
          }}
        >
          <Header />
        </ThemeProvider>
        <FormFinal
          endpoint='login'
          contentType='application/x-www-form-urlencoded'
          initialValues={{ "remember-me": true }}
          validationSchema={yupObject().shape({
            username: yupString().required(),
            password: yupString().required()
          })}
          onSuccess={data => {
            connectFunction(data)
          }}
          onBeforeFetch={(data, resolve) => {
            storage.getItem('users', (err, res) => {
              let arr = []
              if (!res) {
                setLoading(false)
                resolve({ username: 'Username does not exist' })
              }
              if (!err && res) {
                arr = JSON.parse(res)
                if (arr.find(a => a.username === data.username && a.password === data.password)) {
                  // storage.setItem('user', JSON.stringify(data))
                  // setLoading(false)
                  connectFunction(data)
                  resolve()
                } else {
                  setLoading(false)
                  resolve({ username: 'Username or password incorrect' })
                }
              }
            })
          }}
          submitButtonTitle='Inicio de Sesión'
          submitButtonMargins='40px 0'
          wrapper={ScrollView}
          wrapperProps={{
            style: {
              maxWidth: 300,
              width: '100%',
              alignSelf: 'center',
              marginLeft: 0,
              marginRight: 0,
              flex: 1
            },
            keyboardShouldPersistTaps: 'handled'
          }}
        >
          {(form, handleSubmit) => (
            <Fragment>
              {loading && <ActivityIndicator />}
              <InputField
                placeholder='Username'
                name='username'
                icon={faUser}
                returnKeyType='next'
                onSubmitEditing={handleSubmit}
                autoCapitalize='none'
                keyboardType='email-address'
              // autoFocus
              />
              <InputField
                placeholder='Contraseña'
                name='password'
                icon={faLock}
                returnKeyType='go'
                onSubmitEditing={handleSubmit}
                margins='25px 0 0'
                secureTextEntry
              />

              <Field name='rememberMe'>{() => null}</Field>

              {/*<FormIconButton
                margins='0'
                paddings='0'
                borderColor='transparent'
                title='Olvidé la contraseña'
                alignSelf='flex-end'
                // onPress={this.forgotPass}
              />*/}
            </Fragment>
          )}
        </FormFinal>

        <FormIconButton
          flex={0.1}
          margins='0 0 20px'
          paddings='10px 0'
          borderColor='transparent'
          title='Crear cuenta'
          alignSelf='center'
          onPress={() => history.push('/register')}
        />
      </Container>
    )
}

export default withRouter(Login)
