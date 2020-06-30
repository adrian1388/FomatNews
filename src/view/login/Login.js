/**
 * Login View
 *
 * @format
 * @flow
 */

import React, { Fragment, useState } from 'react'
import { ActivityIndicator, ScrollView, Alert } from 'react-native'
import { ThemeProvider } from 'styled-components'
import { string as yupString, object as yupObject } from 'yup'
import { faLock } from '@fortawesome/free-solid-svg-icons'
import { faUser } from '@fortawesome/free-regular-svg-icons'
import { withRouter } from '../../utility/routing'
import Header from '../../logic/Header'
import FormFinal from '../../components/form/FormFinal'
import InputField from '../../components/form/InputField'
import FormIconButton from '../../components/form/FormIconButton'
import { Container, Label } from '../../components/common'
import storage from '../../utility/storage'
import { LoginButton, GraphRequest, GraphRequestManager, AccessToken } from 'react-native-fbsdk';
import { useIntl, defineMessages } from 'react-intl'

const messages = defineMessages({
  required: {id: 'required', defaultMessage: 'This field is required'},
  login: {id: 'login', defaultMessage: 'Log in'},
  tryFacebook: {id: 'tryFacebook', defaultMessage: 'Or try with Facebook...'},
  createAccount: {id: 'createAccount', defaultMessage: 'Create Account'},
  username: {id: 'username', defaultMessage: 'Username'},
  password: {id: 'password', defaultMessage: 'Password'},
})

const Login = ({ connectFunction = () => { }, history }) => {
  const [loading, setLoading] = useState(false),
    intl = useIntl();

  return (
    <Container flex={1.5}>
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
        initialValues={{}}
        validationSchema={yupObject().shape({
          username: yupString().required(intl.formatMessage(messages.required)),
          password: yupString().required(intl.formatMessage(messages.required))
        })}
        onBeforeFetch={(data, resolve) => {
          storage.getItem('users', (err, res) => {
            let arr = []
            if (!res) {
              setLoading(false)
              resolve({ username: intl.formatMessage({ id: 'passwordIncorrect' }) })
            }
            if (!err && res) {
              arr = JSON.parse(res)
              if (arr.find(a => a.username === data.username && a.password === data.password)) {
                connectFunction(data)
                resolve()
              } else {
                setLoading(false)
                resolve({ username: intl.formatMessage({ id: 'passwordIncorrect' }), password: intl.formatMessage({ id: 'passwordIncorrect' }) })
              }
            }
          })
        }}
        setLoading={setLoading}
        submitButtonTitle={intl.formatMessage(messages.login)}
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
              placeholder={intl.formatMessage(messages.username)}
              name='username'
              icon={faUser}
              returnKeyType='go'
              onSubmitEditing={handleSubmit}
              autoCapitalize='none'
            />
            <InputField
              placeholder={intl.formatMessage(messages.password)}
              name='password'
              icon={faLock}
              returnKeyType='go'
              onSubmitEditing={handleSubmit}
              margins='25px 0 0'
              secureTextEntry
            />
          </Fragment>
        )}
      </FormFinal>

      <Container flex={0.3} alignSelf='center' paddings="20px">
        <Label>{intl.formatMessage(messages.tryFacebook)}</Label>
        <LoginButton
          onLoginFinished={
            (error, result) => {
              if (error) {
                console.log("login has error: " + result.error);
              } else if (result.isCancelled) {
                console.log("login is cancelled.");
              } else {
                AccessToken.getCurrentAccessToken().then(
                  (data) => {
                    const infoRequest = new GraphRequest(
                      '/me',
                      {
                        parameters: {
                          fields: {
                            string: 'id, name, picture.type(large)',
                          }
                        }
                      },
                      (error, result) => {
                        if (error) {
                          Alert(intl.formatMessage({ id: 'facebookError', values: { error } }), error);
                        } else {
                          connectFunction({ ...result, username: result.name, image: result.picture.data.url })
                        }
                      },
                    );
                    new GraphRequestManager().addRequest(infoRequest).start();
                  }
                )

              }
            }
          }
          onLogoutFinished={() => console.log("logout.")}
        />
      </Container>

      <FormIconButton
        flex={0.1}
        margins='0 0 20px'
        paddings='10px 0'
        borderColor='transparent'
        title={intl.formatMessage(messages.createAccount)}
        alignSelf='center'
        onPress={() => history.push('/register')}
      />
    </Container>
  )
}

export default withRouter(Login)
