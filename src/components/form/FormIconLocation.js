/**
 * Form Input Location Component
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
   errors,
   onChange,
   ...restProps
 *
 * @format
 * @flow
 */

import React, {Component, Fragment} from 'react'
import {
  ActivityIndicator,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native'
import styled, {withTheme} from 'styled-components'
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome'
import {debounce} from 'lodash'
import FormIconInput from './FormIconInput'
import {Callout, MapView, Marker} from '../MapView'
import {Container, containerCss, Label} from '../common'
import CurrentPosition from '../CurrentPosition'

const autocompleteURL =
    'https://maps.googleapis.com/maps/api/place/autocomplete/json',
  detailsURL = 'https://maps.googleapis.com/maps/api/place/details/json',
  apiKey = 'AIzaSyC8Vh58KT9ckPXNW_YARcXir9tBx9m8VKA'

class FormIconLocation extends Component {
  constructor(props) {
    super(props)
    this.state = {
      error: null,
      locationSelected: {},
      address: props.value ? props.value.description : '',
      predictions: []
    }
    this.handleChange = this.handleChange.bind(this)
    this.apiCallLocation = this.apiCallLocation.bind(this)
    this.debouncedFunction = debounce(this.apiCallAutocomplete.bind(this), 1000)
    this.newCoordSelected = this.newCoordSelected.bind(this)
  }

  handleChange(name, value, longitude, latitude) {
    this.setState({
      [name]: value
    })
    this.debouncedFunction(value, longitude, latitude)
  }

  async apiCallAutocomplete(value, longitude, latitude) {
    // const
    if (value) {
      const apiURL = `${autocompleteURL}?key=${apiKey}&input=${value}&location=${latitude},${longitude}&radius=5000&strictbounds=true&types=geocode`
      try {
        const result = await fetch(apiURL)
        const json = await result.json()
        this.setState({predictions: json.predictions})
      } catch (err) {
        console.log(err)
      }
    }
  }

  async apiCallLocation(prediction) {
    this.setState({address: prediction.description, predictions: []})
    const apiURL = `${detailsURL}?key=${apiKey}&placeid=${prediction.place_id}`
    try {
      const result = await fetch(apiURL)
      const json = await result.json()
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
            addr => addr.types[0] === 'sublocality_level_1'
          ),
          address1 = json.result.address_components[0].long_name

        this.setState({
          locationSelected: {
            latitude: json.result.geometry.location.lat,
            longitude: json.result.geometry.location.lng,
            placeId: prediction.place_id,
            description: prediction.description,
            address: {
              address1,
              address2: address2 && address2.long_name,
              city: city && city.long_name,
              state: state && state.long_name,
              country: country && country.short_name,
              zipCode: zipCode && zipCode.long_name
            }
          }
        })
        this.props.onSelectLocation('location', this.state.locationSelected)
      }
    } catch (err) {
      console.log(err)
    }
  }

  newCoordSelected(coordinate) {
    this.setState(prevState => {
      let {locationSelected} = prevState
      locationSelected.latitude = coordinate.latitude
      locationSelected.longitude = coordinate.longitude
      locationSelected.placeId = ''
      locationSelected.description = ''
      return {locationSelected}
    })
  }

  render() {
    const Predictions = this.state.predictions.map(prediction => (
        <TouchableOpacity
          key={prediction.id}
          onPress={() => this.apiCallLocation(prediction)}
        >
          <Container
            paddings='5px 0'
            style={{borderBottomWidth: 0.5, borderColor: '#AA8DBE'}}
          >
            <Label numberOfLines={1}>{prediction.description}</Label>
          </Container>
        </TouchableOpacity>
      )),
      {theme, onSelectLocation, errors, name, value, ...props} = this.props,
      errorsHeight =
        /*errors[name] ? */ theme.field.height.slice(0, -2) - 5 /* : 0*/

    return (
      <Fragment>
        <CurrentPosition flex={1}>
          {({longitude, latitude, error}) =>
            longitude && latitude ? (
              <FormIconInput
                name='address'
                placeholder='Ingrese una dirección...'
                value={this.state.address}
                onChange={(name, value) =>
                  this.handleChange(name, value, longitude, latitude)
                }
                {...props}
              />
            ) : (
              <Container>{error || <ActivityIndicator />}</Container>
            )
          }
        </CurrentPosition>
        {Predictions}
        <Container height={350}>
          {this.state.locationSelected && this.state.locationSelected.latitude && (
            <MapView
              style={{flex: 1}}
              region={{
                latitude: this.state.locationSelected.latitude,
                longitude: this.state.locationSelected.longitude,
                latitudeDelta: 0.001,
                longitudeDelta: 0.001
              }}
              // showsMyLocationButton={false}
              // showsUserLocation
              // userLocationAnnotationTitle='My Location'
              toolbarEnabled={false}
            >
              <Marker
                // key={room.id}
                coordinate={{
                  latitude: this.state.locationSelected.latitude,
                  longitude: this.state.locationSelected.longitude
                }}
                identifier={this.state.locationSelected.placeId}
                draggable
                // onDragEnd={coord =>
                // }
                // onPress={selProps => {
                //   this.setState({
                //     selProps: selProps.nativeEvent,
                //     roomSelected: room
                //   })
                // }}
              >
                {/*<Callout tooltip>
              <Container
                backgroundColor='transparent'
                alignItems='center'
              >
                <Label
                  fontSize={13}
                  fontWeight='bold'
                  color='red'
                >
                  {room.name}
                </Label>
                <Label fontSize={12} color='red'>
                  {room.location.address.address1 +
                    ' - ' +
                    room.location.address.address2}
                </Label>
              </Container>
            </Callout>*/}
              </Marker>
            </MapView>
          )}
        </Container>

        {/*<Error errorsHeight={errorsHeight}>
          {errors && errors[Object.keys(errors).find(k => k.startsWith(name))]}
        </Error>*/}
      </Fragment>
    )
  }
}

export default withTheme(FormIconLocation)
