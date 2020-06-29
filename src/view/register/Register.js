/**
 * Register View
 *
 * @format
 * @flow
 */

import React, { Fragment, useState } from 'react'
import { ScrollView, ActivityIndicator } from 'react-native'
import { withTheme } from 'styled-components'
import { string as yupString, object as yupObject, ref as yupRef } from 'yup'
import { faLock } from '@fortawesome/free-solid-svg-icons'
import { faUser } from '@fortawesome/free-regular-svg-icons'
import { omit } from 'lodash'

import Header from '../../logic/Header'
import FormFinal from '../../components/form/FormFinal'
import InputField from '../../components/form/InputField'
// import SelectField from '../../components/form/SelectField'
import { Container, Label, Title } from '../../components/common'
import { withRouter } from '../../utility/routing'
// import {userTypeOptions, iDCardValidator} from '../../utility/Util'
import storage from '../../utility/storage'

const Register = ({ theme, history }) => {
  const [loading, setLoading] = useState(false)
  const fieldMargin = '25px 0 0'
  return (
    <Container flex={1}>
      <Header flexDirection='row-reverse' />
      <FormFinal
        endpoint='register'
        contentType='application/json'
        onBeforeFetch={(sendData, resolve) => {
          const data = omit(sendData, 'confirmPassword')

          storage.getItem('users', (err, res) => {
            let arr = []
            if (!res) {
              arr.push(data)
              storage.setItem('users', JSON.stringify(arr))
              setLoading(false)
              console.log('goback');
              
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
                resolve({ username: 'Username is already in system' })
              }
            }
            console.log('users', err, res);
          })
        }}
        validationSchema={yupObject().shape({
          username: yupString().min(3).required(),
          password: yupString()
            .matches(
              /^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{8,}$/,
              'Por seguridad, la contraseña debe tener al menos 8 caracteres: mínimo 1 letra, mínimo 1 número y mínimo 1 caracter especial'
            )
            .required('Contraseña es un campo requerido'),
          confirmPassword: yupString()
            .oneOf(
              [yupRef('password'), null],
              'Las contraseñas deben ser iguales'
            )
            .required('Debe confirmar la contraseña')
        })}
        onSuccess={data => {
          history.goBack()
        }}
        setLoading={setLoading}
        submitButtonTitle='Registrarse'
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
          // showsVerticalScrollIndicator: false
        }}
      >
        {form => (
          <Fragment>
            {loading && <ActivityIndicator />}
            <Title margins='30px 0 50px'>REGISTRO</Title>
            <InputField
              margins={fieldMargin}
              placeholder='username'
              name='username'
              autoCapitalize='none'
              maxLength={10}
              icon={faUser}
            />
            <InputField
              margins={fieldMargin}
              secureTextEntry
              name='password'
              placeholder='Contraseña'
              icon={faLock}
            />
            <InputField
              margins={fieldMargin}
              secureTextEntry
              name='confirmPassword'
              placeholder='Confirmar Contraseña'
              icon={faLock}
            />
          </Fragment>
        )}
      </FormFinal>

      <Label margins='0 0 40px' align='center' color={theme.globalFontColor}>
        Una vez que te registras, aceptas los términos y condiciones
      </Label>
    </Container>
  )
}

export default withTheme(withRouter(Register))
