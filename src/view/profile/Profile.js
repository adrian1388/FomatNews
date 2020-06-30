import React, { useState, useEffect, Fragment } from "react";
import { Container, Title, Label } from "../../components/common";
import { string as yupString, object as yupObject } from 'yup'
import { ScrollView, ActivityIndicator } from "react-native";
import { faUser } from '@fortawesome/free-regular-svg-icons'
import storage from '../../utility/storage'
import placeholder from "../../assets/images/user-icon-placeholder.png"
import FormFinal from "../../components/form/FormFinal";
import InputField from '../../components/form/InputField'
import PhotoField from '../../components/form/PhotoField'
import { useIntl } from "react-intl";
import FormIconButton from "../../components/form/FormIconButton";
import { LoginButton } from "react-native-fbsdk";

export const Profile = ({ history, disconnectFunction }) => {
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState({})
  const intl = useIntl()
  const fieldMargin = '20px 0 0'

  useEffect(() => {
    storage.getItem('user').then(result => {
      if (result) {
        setUser(JSON.parse(result))
        setLoading(false)
      }
    })
  }, [fieldMargin]);

  return (
    <Container flex={1}>
      <FormFinal
        initialValues={user}
        validationSchema={yupObject().shape({
          username: yupString().required(intl.formatMessage({id: 'required'})).min(3)
        })}
        onBeforeFetch={(data, resolve) => {
          storage.setItem('user', JSON.stringify(data)).then(() => {

            storage.getItem('users').then(users => {
              let arr = JSON.parse(users)
              let arr2 = arr.map(a => {
                if (a.username === user.username) {
                  return data;
                } else {
                  return a;
                }
              })
              storage.setItem('users', JSON.stringify(arr2)).then(() => {
                history.goBack()
                resolve()
              })
            })
          })
        }}
        setLoading={setLoading}
        submitButtonTitle={intl.formatMessage({ id: 'save' })}
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
        }}
      >
        {() => (
          <Fragment>
            {loading && <ActivityIndicator />}

            <Title margins='25px 0'>{intl.formatMessage({ id: "profile" })}</Title>

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
              placeholder={intl.formatMessage({ id: "username" })}
              name='username'
              width='300px'
              margins="50px"
              icon={faUser}
            />
          </Fragment>
        )}
      </FormFinal>

      <Label align='center'>{intl.formatMessage({id: 'changeLanguageInstruction'})}</Label>
      {user.name
        ? <Container flex={0.1} alignSelf='center' paddings="20px">
          <LoginButton
            onLogoutFinished={() => {
              disconnectFunction()
              setTimeout(() => {
                history.push('/')
              }, 1000);
            }}
          />
        </Container>
        : <FormIconButton
          flex={0.1}
          margins='0 0 20px'
          paddings='10px 0'
          borderColor='transparent'
          title={intl.formatMessage({ id: "logout" })}
          alignSelf='center'
          onPress={() => {
            disconnectFunction()
            setTimeout(() => {
              history.push('/')
            }, 1000);
          }}
        />}
    </Container>
  )
}