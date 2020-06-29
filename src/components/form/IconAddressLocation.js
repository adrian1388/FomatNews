/**
 * TextInput with Location logic Component
 * with FormIconInput.
 * props:
   theme,
   margins,
   paddings,
   style,
   label,
   name,
   icon,
   value,
   onChange,
   ...restProps
 *
 * @format
 * @flow
 */

import React, {Component, Fragment} from 'react'
import {ActivityIndicator, Platform, TouchableOpacity} from 'react-native'
import {Field} from 'react-final-form'
import {withTheme} from 'styled-components'
import {isFunction} from 'lodash'
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome'
import {faQuestionCircle} from '@fortawesome/free-regular-svg-icons'
import {Marker as GMarker} from 'google-maps-react'
import Toast from '../Toast'
import InputField from './InputField'
import {MapView, Marker} from '../MapView'
import {Container} from '../common'
import CurrentPosition from '../CurrentPosition'
import {global} from '../../utility/Util'

const detailsURL = 'https://maps.googleapis.com/maps/api/place/details/json',
  reverseGeoURL = 'https://maps.googleapis.com/maps/api/geocode/json',
  apiKey = global.GOOGLE_MAPS_APIKEY

class IconAddressLocation extends Component {
  constructor(props) {
    super(props)
    this.state = {
      error: null,
      locationSelected: {},
      address: props.value ? props.value.description : '',
      predictions: []
    }
    this.apiCallLocation = this.apiCallLocation.bind(this)
    this.apiReverseGeo = this.apiReverseGeo.bind(this)
    this.test = this.test.bind(this)
  }

  test() {
    const place = this.state.autocomplete.getPlace()
    this.apiCallLocation(place, this.state.input)
  }

  apiReverseGeo(longitude, latitude, input) {
    if (longitude) {
      const apiURL = `${reverseGeoURL}?key=${apiKey}&latlng=${latitude},${longitude}`
      try {
        fetch(apiURL)
          .then(result => {
            result
              .json()
              .then(json => {
                let prediction = json.results[0]
                prediction.geometry.location.lat = latitude
                prediction.geometry.location.lng = longitude
                this.apiCallLocation(prediction, input)
              })
              .catch(err => console.log('ERROR apiReverseGeo json', err))
          })
          .catch(err => console.log('ERROR apiReverseGeo', err))
      } catch (err) {
        console.log('ERROR fetch reverseURL', err)
      }
    }
  }

  async apiCallLocation(prediction, input) {
    const {onSelectLocation = () => {}} = this.props,
      locationPrevious = input.value ? input.value : {},
      addressPrevious = input.value ? input.value.address : {}
    let result, json

    try {
      if (Platform.OS === 'web') {
        json = {result: prediction}
      } else {
        const apiURL = `${detailsURL}?key=${apiKey}&placeid=${prediction.place_id}`
        result = await fetch(apiURL)
        json = await result.json()
      }
      if (json.result) {
        const zipCode = json.result.address_components.find(
            addr => addr.types[0] === 'postal_code'
          ),
          state = json.result.address_components.find(
            addr => addr.types[0] === 'administrative_area_level_1'
          ),
          country = json.result.address_components.find(
            addr => addr.types[0] === 'country'
          ),
          city = json.result.address_components.find(
            addr => addr.types[0] === 'administrative_area_level_2'
          ),
          address2 = json.result.address_components.find(
            addr =>
              addr.types[0] === 'street_number' ||
              addr.types[0] === 'sublocality_level_1'
          ),
          address1 = json.result.address_components.find(
            (addr, index) => addr.types[0] === 'route'
          ),
          locationSelected = {
            ...locationPrevious,
            latitude: isFunction(json.result.geometry.location.lat)
              ? json.result.geometry.location.lat()
              : json.result.geometry.location.lat,
            longitude: isFunction(json.result.geometry.location.lng)
              ? json.result.geometry.location.lng()
              : json.result.geometry.location.lng,
            placeId: prediction.place_id,
            description: prediction.description || prediction.formatted_address,
            address: {
              ...addressPrevious,
              address1:
                (address1 && address1.long_name) ||
                prediction.description ||
                prediction.formatted_address,
              address2: address2 && address2.long_name,
              city: city && city.long_name,
              state: state && state.long_name,
              country: country && country.short_name,
              zipCode: zipCode && zipCode.long_name
            }
          }

        input.onChange(locationSelected)
        onSelectLocation(locationSelected)
        this.setState({input})
      }
    } catch (err) {
      console.log(err)
    }
  }

  render() {
    const {
      theme,
      width,
      height,
      flex,
      iconWidth,
      backgroundColor,
      style,
      name,
      marker,
      ...props
    } = this.props

    return (
      <Field name={name}>
        {({input, meta}) => (
          <Fragment>
            <CurrentPosition flex={1}>
              {({longitude, latitude, error}) => {
                if (longitude && latitude) {
                  return (
                    <Fragment>
                      <InputField
                        name={`${name}.description`}
                        inputMargin='0px'
                        placeholder='Ingrese una dirección para buscar en el mapa'
                        id='locationId'
                        maxLength={256}
                        onChange={() => this.setState({input})}
                        onLayout={() => {
                        }}
                        {...props}
                      />

                      <Container
                        height='350px'
                        style={{zIndex: -1}}
                        width='100%'
                      >
                        <MapView
                          style={{flex: 1}}
                          // containerElement={<div style={{ height: `100%` }} />}
                          // mapElement={<div style={{ height: `100%` }} />}
                          // loadingElement={<div style={{ height: `100%` }} />}
                          // googleMapURL={`https://maps.googleapis.com/maps/api/js?key=${global.GOOGLE_MAPS_APIKEY}&v=3.exp&libraries=geometry,drawing,places`}
                          region={{
                            latitude:
                              input.value && input.value.latitude
                                ? input.value.latitude
                                : latitude,
                            longitude:
                              input.value && input.value.longitude
                                ? input.value.longitude
                                : longitude,
                            latitudeDelta: 0.002,
                            longitudeDelta: 0.002
                          }}
                          onReady={(mapProps, map) => {
                            Toast({
                              message:
                                'Mueva el marcador hacia su ubicación exacta',
                              duration: 4000,
                              backgroundColor: theme.globalBlue
                            })

                            let autocomplete = new window.google.maps.places.Autocomplete(
                              document.getElementById('locationId')
                            )
                            
                            autocomplete.bindTo('bounds', map)
                            autocomplete.addListener(
                              'place_changed',
                              this.test
                            )
                            this.setState({autocomplete, input})
                          }}
                          // showsUserLocation
                          toolbarEnabled={false}
                          zoomControl
                        >
                          {Platform.OS === 'web' ? (
                            <GMarker
                              position={{
                                lat:
                                  input.value && input.value.latitude
                                    ? input.value.latitude
                                    : latitude,
                                lng:
                                  input.value && input.value.longitude
                                    ? input.value.longitude
                                    : longitude
                              }}
                              identifier={input.value.placeId}
                              draggable
                              icon={{url: marker}}
                              title='Mantenga presionado para mover este marcador'
                              onDragend={(t, map, coord) => {
                                this.apiReverseGeo(
                                  coord.latLng.lng(),
                                  coord.latLng.lat(),
                                  input
                                )
                              }}
                            />
                          ) : (
                            <Marker
                              coordinate={{
                                latitude:
                                  input.value && input.value.latitude
                                    ? input.value.latitude
                                    : latitude,
                                longitude:
                                  input.value && input.value.longitude
                                    ? input.value.longitude
                                    : longitude
                              }}
                              identifier={input.value.placeId}
                              draggable
                              image={marker}
                              title='Mantenga presionado para mover este marcador'
                              onDragEnd={coord => {
                                const locationDragged =
                                  coord.nativeEvent.coordinate
                                this.apiReverseGeo(
                                  locationDragged.longitude,
                                  locationDragged.latitude,
                                  input
                                )
                              }}
                            />
                          )}
                        </MapView>
                        <Container
                          backgroundColor='transparent'
                          style={{
                            position: 'absolute',
                            top: 0,
                            right: 0
                          }}
                        >
                          <TouchableOpacity
                            style={{
                              alignItems: 'center',
                              justifyContent: 'center',
                              padding: 10
                            }}
                            onPress={() => {
                              Toast({
                                message:
                                  '1. Puede agregar una dirección en forma textual en Dirección.\n' +
                                  '2. También por medio del mapa:\n' +
                                  '- Mantenga presionado el marcador para moverlo.\n' +
                                  '- Suéltelo en el punto donde reconoce la ubicación deseada.\n' +
                                  "3. Puede acercar o alejar el mapa usando los movimientos de pellizco con haciendo 'scroll' con el mouse.",
                                duration: 4000,
                                backgroundColor: theme.globalBlue
                              })
                            }}
                          >
                            <FontAwesomeIcon
                              icon={faQuestionCircle}
                              size={25}
                              color={theme.globalGreen}
                            />
                          </TouchableOpacity>
                        </Container>
                      </Container>
                    </Fragment>
                  )
                } else {
                  return (
                    <Container>
                      <ActivityIndicator />
                    </Container>
                  )
                }
              }}
            </CurrentPosition>

            {/*<Error errorsHeight={errorsHeight}>
              {errors && errors[Object.keys(errors).find(k => k.startsWith(name))]}
            </Error>*/}
          </Fragment>
        )}
      </Field>
    )
  }
}

export default withTheme(IconAddressLocation)
