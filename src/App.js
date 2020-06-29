/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import {
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { ThemeProvider } from 'styled-components';
import 'intl';
import 'intl/locale-data/jsonp/en';
import 'intl/locale-data/jsonp/es';
import 'intl/locale-data/jsonp/it';
import { IntlProvider } from 'react-intl';
import AppProvider from './logic/AppProvider';
import { Container } from './components/common';
import { getLocale } from './utility/locale';

const global = {
  theme: {
    globalBackground: 'white',
    globalGreen: '#0b5a5f',
    globalBlue: '#002463',
    globalError: '#bd2a16',
    globalFontColor: '#203020',
    globalPlaceholderColor: '#929292',

    header: {
      height: '65px',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: '#0b5a5f',
      backgroundColor1: 'white',
      color: '#002463',
      logo: {
        width: '102px',
        height: '32px'
      }
    },

    bottomMenu: {
      height: '70px',
      // flex: 0.15,
      alignItems: 'center',
      justifyContent: 'space-around',
      backgroundColor: 'white',
      backgroundColor1: '#0b5a5f',
      color: 'white',
      iconSize: 30,
      iconColor: '#0b5a5f',
      selectedIconColor: '#002463'
    },

    field: {
      height: '27px',
      fontSize: '15px',
      labelColor: '#0b5a5f',
      alignItems: 'center',
      icon: {
        size: 15,
        color: '#929292'
      },
      borderColor: '#002463',
      borderBottomWidth: '1px'
    },

    arrayField: {
      borderColor: '#0b5a5f',
      borderTopWidth: '0px',
      borderBottomWidth: '0px',
      borderLeftWidth: '0px',
      borderRightWidth: '0px',
      borderRadius: '5px'
    },

    title: {
      fontSize: '23px',
      color: '#0b5a5f',
      align: 'center',
      fontWeight: 'bold'
    },

    defaultButton: {
      borderTopWidth: '2px',
      borderBottomWidth: '2px',
      borderLeftWidth: '2px',
      borderRightWidth: '2px',
      borderRadius: '25px',
      borderColor: '#002463',
      backgroundColor: 'transparent',
      margins: '20px 0 30px',
      paddings: '10px 40px'
    }
  }
}
// return type on this signature enforces that all languages have the same translations defined
export function importMessages(locale) {
  if (locale === 'es') {
    return import('./utility/locale/es.json');
  }
  if (locale === 'en') {
    return import('./utility/locale/en.json');
  }
  if (locale === 'it') {
    return import('./utility/locale/it.json');
  }
  return import('./utility/locale/en.json');
}

const App = () => {
  const locale = getLocale();
  const [messages, setMessages] = React.useState(null);
  React.useEffect(() => {
    importMessages(locale).then(setMessages);
  }, []);

  return (
    <ThemeProvider theme={global.theme}>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={{ flex: 1 }}>
        <Container flex={1}>
          <IntlProvider locale={locale} messages={messages} defaultLocale="en">
            <AppProvider />
          </IntlProvider>
        </Container>
      </SafeAreaView>
    </ThemeProvider>
  );
};

export default App;
