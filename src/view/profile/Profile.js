import React, { useState, useEffect, Fragment } from "react";
import { Container, Label, Title } from "../../components/common";
import { string as yupString, object as yupObject } from 'yup'
import { Image, ScrollView } from "react-native";
import { faLock } from '@fortawesome/free-solid-svg-icons'
import { faUser } from '@fortawesome/free-regular-svg-icons'
import storage from '../../utility/storage'
import placeholder from "../../assets/images/user-icon-placeholder.png"
import FormFinal from "../../components/form/FormFinal";
import InputField from '../../components/form/InputField'
import PhotoField from '../../components/form/PhotoField'
import { useIntl } from "react-intl";
import FormIconButton from "../../components/form/FormIconButton";

export const Profile = ({history, disconnectFunction}) => {
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState({})
  const intl = useIntl()
  const fieldMargin = '20px 0 0'

  useEffect(() => {
    storage.getItem('user').then(result => {
      if (result) {
        console.log('user test', result);
        
        setUser(JSON.parse(result))
        setLoading(false)
      }
    })
  }, [fieldMargin]);

  return (
    <Container flex={1}>
      <FormFinal
        endpoint='saveProfile'
        contentType='application/json'
        initialValues={user}
        validationSchema={yupObject().shape({
          username: yupString().required().min(3)
        })}
        onSuccess={data => {
          Toast({
            message: 'Guardado correctamente',
            duration: 4000,
            backgroundColor: theme.globalBlue,
            opacity: 0.75
          })
          this.setState({initialValues: data})
        }}
        onBeforeFetch={(data, resolve) => {
          storage.setItem('user', JSON.stringify(data)).then(res => {
            
              storage.getItem('users').then(users => {
                let arr = JSON.parse(users)
                let arr2 = arr.map(a => {
                  if (a.username === user.username) {
                    return data;
                  } else {
                    return a;
                  }
                })
                storage.setItem('users', JSON.stringify(arr2)).then(res => {
                  history.goBack()
                  resolve()                
                })
              })
          //   let arr = []
          //   if (!res) {
          //     setLoading(false)
          //     resolve({ username: 'Username no existe' })
          //   }
          //   if (!err && res) {
          //     arr = JSON.parse(res)
          //     if (arr.find(a => a.username === data.username)) {
          //       // arr.push(data)
          //       storage.setItem('user', JSON.stringify(data))
          //       setLoading(false)
          //       resolve()
          //       connectFunction(data)
          //     } else {
          //       setLoading(false)
          //       resolve({ username: 'Username no existe' })
          //     }
          //   }
          })
        }}
        submitButtonTitle='Guardar'
        wrapper={ScrollView}
        wrapperProps={{
          contentContainerStyle: {
            width: '100%',
            alignSelf: 'center',
            alignItems: 'center',
            marginLeft: 70,
            marginRight: 70
          },
          keyboardShouldPersistTaps: 'handled'
          // showsVerticalScrollIndicator: false
        }}
      >
        {() => (
          <Fragment>
            <Title margins='25px 0'>Perfil</Title>

            <Container
              flexDirection='row'
              justifyContent='center'
              alignItems='center'
            >
              <PhotoField
                name='image'
                placeholder={placeholder}
                height={124}
                width={125}
              />
            </Container>

            <InputField
              margins={fieldMargin}
              placeholder={intl.formatMessage({id: "username"})}
              name='username'
              width='300px'
              margins="50px"
              maxLength={10}
              icon={faUser}
            />
          </Fragment>

        )}
      </FormFinal>
      <FormIconButton
        flex={0.1}
        margins='0 0 20px'
        paddings='10px 0'
        borderColor='transparent'
        title={intl.formatMessage({id: "logout"})}
        alignSelf='center'
        onPress={() => {
          disconnectFunction()
          history.push('/')
        }}
      />
    </Container>
  )
}