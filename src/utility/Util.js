import compose from 'ramda/src/compose'
import equals from 'ramda/src/equals'
import forEach from 'ramda/src/forEach'
import type from 'ramda/src/type'
import all from 'ramda/src/all'
import values from 'ramda/src/values'
import keysIn from 'ramda/src/keysIn'
import concat from 'ramda/src/concat'
import uniq from 'ramda/src/uniq'
import {getToken} from '../components/logic/Authentication'
import {
  transform,
  isEqual
  // isObject
} from 'lodash/fp'

const isArray = compose(equals('Array'), type)
const isObject = compose(equals('Object'), type)
const allAreObjects = compose(all(isObject), values)
const isString = compose(equals('String'), type)

/**
 * Loops through an array and finds the object using the id property.
 */
const getArrayItemById = (id, records) => {
  for (const j in records) {
    if (records[j].id === id) {
      return records[j]
    }
  }
  return {}
}

const iDCardValidator = cedula => {
    if (
      typeof cedula === 'string' &&
      cedula.length === 10 &&
      /^\d+$/.test(cedula)
    ) {
      var digitos = cedula.split('').map(Number)
      var codigo_provincia = digitos[0] * 10 + digitos[1]

      //if (codigo_provincia >= 1 && (codigo_provincia <= 24 || codigo_provincia == 30) && digitos[2] < 6) {

      if (
        codigo_provincia >= 1 &&
        (codigo_provincia <= 24 || codigo_provincia === 30)
      ) {
        var digito_verificador = digitos.pop()

        var digito_calculado =
          digitos.reduce(function(valorPrevio, valorActual, indice) {
            return (
              valorPrevio -
              ((valorActual * (2 - (indice % 2))) % 9) -
              (valorActual === 9) * 9
            )
          }, 1000) % 10
        return digito_calculado === digito_verificador
      }
    }
    return false
  },
  doFetch = ({
    endpoint,
    params = [], //[{page: 9}, {size: 10}],
    url,
    body,
    contentType = 'application/json',
    onOK = () => {},
    onNotOK = () => {},
    onFetchError = () => {},
    onJsonError = () => {},
    onTokenError = () => {}
  }) => {
    let parameters = params.length > 0 ? '?' : ''
    params.forEach((item, i) => {
      parameters = parameters + Object.entries(item)[0][0] + "=" + Object.entries(item)[0][1];
      if (params.length !== i+1) {
        parameters = parameters + '&'
      }
    });

    getToken()
      .then(token => {
        fetch(global.serverURL + endpoint + parameters, {
          method: 'POST',
          mode: 'cors',
          headers: {
            Accept: 'application/json',
            'Content-Type': contentType,
            'X-CSRF-TOKEN': token
          },
          credentials: 'include',
          body
        })
          .then(response => {
            response
              .json()
              .then(data => {
                if (!response.ok || response.status !== 200) {
                  onNotOK(data)
                } else {
                  onOK(data)
                }
              })
              .catch(errors => onJsonError(errors))
          })
          .catch(errorfetch => onFetchError(errorfetch))
      })
      .catch(tokenError => onTokenError(tokenError))
  },
  userTypeOptions = [
    // {value: 'nul', label: 'Tipo de registro'},
    {value: 'medic', label: 'Profesional de la Salud'},
    {value: 'patient', label: 'Paciente'},
    // {value: 'owner', label: 'Propietario de Consultorio'}
    // {value: 'callcenter', label: 'Usuario de Call Center'}
    // {value: 'iesscallcenter', label: 'IESS Call Center'}
  ],
  genderOptions = [
    {value: 'male', label: 'Masculino'},
    {value: 'female', label: 'Femenino'}
  ],
  global = {
    serverURL: 'http://localhost:8080/',
    clientURL: 'http://localhost:3000/',
    GOOGLE_MAPS_APIKEY: 'AIzaSyAsOfJ1SeTyax0ess6j7rFZGwcQd0iE7CY'
  },
  setGlobalServer = appURL => {
    global.serverURL = appURL
  }

/**
 * Checks if the currently logged in user has access to perform the specified action(s) on the specified object(s).
 *
 * The checkPermission object has the following options:
 *
 * objects Name of the object(s) for which we are checking if the action can be performed. For example "Business".
 * If you need to check if an action can be performed on one object or another, you can use the "|" character to query it.
 * So for example, you can do "Business|Office" and this will check whether the action can be performed on Business OR Office.
 *
 * actions Action(s) that we are checking whether it can be performed on the object, this is any CRUD operation. For example "create", "read", "update" or "delete".
 *
 * Both of these options can be specified as either a string or an array.
 *
 * @return True if the user has permissions to access the object(s), false otherwise.
 */
const hasPermissions = (
  permissions,
  {objects: objectsIn, actions: actionsIn}
) => {
  let granted = false,
    objects = objectsIn,
    actions = actionsIn

  if (isString(objects)) {
    // Ensure objects are always an array
    objects = objects.split('|')
  }

  if (isString(actions)) {
    // Ensure actions are always an array
    actions = actions.split(',')
  }

  forEach(permission => {
    if (granted === true) {
      // Make sure to break if permission was granted (optimization)
      return
    }

    forEach(checkObject => {
      if (granted === true) {
        // Permission was already granted, so we don't do anything else
        return
      }

      const permissionObject = new RegExp(
        '\\b' + permission.object.replace('*', '.*') + '\\b'
      )

      if (permissionObject.test(checkObject)) {
        // Has permission to the object.
        forEach(action => {
          if (granted === true) {
            // Permission was already granted, so we don't do anything else
            return
          }

          forEach(checkAction => {
            // Make or may not have permission to the object.

            if (granted === true) {
              // Permission was already granted, so we don't do anything else
              return
            }

            const permissionAction = new RegExp(
              '\\b' + action.replace('*', '.*') + '\\b'
            )

            // This performs the regex check against the action specified.
            granted = permissionAction.test(checkAction)
          }, actions)
        }, permission.actions)
      }
    }, objects)
  }, permissions)

  return granted
}

const _transform = transform.convert({
  cap: false
})

const iteratee = baseObj => (result, value, key) => {
  if (!isEqual(value, baseObj[key])) {
    const valIsObj = isObject(value) && isObject(baseObj[key])
    result[key] =
      valIsObj === true ? differenceObject(value, baseObj[key]) : baseObj[key]
  } else if (!isObject(value) && (key === 'id' || key === 'version')) {
    result[key] = value
  }
}

function differenceObject(targetObj, baseObj) {
  return _transform(iteratee(baseObj), null, targetObj)
}

/**
 * Obtains the difference between one GraphQL record and another.
 *
 * Here return just the differences (delta) of the record, taking into account that we must always send the record id to the server.
 * And if there were changes made to the record, the version property is also added.
 *
 * Notice that when dealing with arrays (to-many) we always return all of the objects in it. This is to handle the many-to-many relationships.
 */
// This can probably be written as a curried function with Ramda, at some point in time we may want to look at this: https://gist.github.com/sjzamora86/2df8d4cf4e32d36e2bb739ac7261f2c5
const recordDiff = (left = {}, right = {}) => {
  const keys = uniq(concat(keysIn(left), keysIn(right))),
    diff = {}

  for (const key of keys) {
    const targetValue = right[key]

    if (key === 'id') {
      diff[key] = targetValue
    }

    // Version always must be included in order to avoid the OptimisticLocking exception on the server
    if (key === 'version') {
      diff[key] = targetValue
    }

    if (isObject(targetValue)) {
      // To-one relationship, we get the delta values (if any) for that record
      diff[key] = recordDiff(left[key] || {}, targetValue)
    } else if (isArray(targetValue) && allAreObjects(targetValue)) {
      // To-many relationship, we loop through all of the objects and get the delta values of those but always return all of the records.
      const rightArray = targetValue,
        arr = []

      for (const i in rightArray) {
        arr.push(
          recordDiff(
            getArrayItemById(rightArray[i].id, left[key]),
            rightArray[i]
          )
        )
      }
      diff[key] = arr
    } else if (!equals(left[key], targetValue)) {

      // Include the property if it is different than the original
      // Apollo does not like undefined values, it does not send those fields to the server. Final Form gives us undefined when the field is cleared (null).
      diff[key] = targetValue === undefined ? null : targetValue
    } else if (
      equals(left[key], targetValue) &&
      right['version'] === undefined
    ) {
      // Include the property if the record (and the property) is new.
      // We know that a record is new when version is undefined
      diff[key] = targetValue
    }
  }

  // We have to ensure that we are comparing the same record, because SelectFields can select to-many records and the version for the previous record would be used.
  if (
    left.id === diff.id &&
    left['version'] &&
    right['version'] !== undefined
  ) {
    // Since we are always returning all of the records in an array, we only include the version if a property changed. This solves the many-to-many problem from being merged on the server.
    diff['version'] = left['version']
  } else if (right['version'] === undefined) {
    // There are some records created on ClientSide, for that reason we might get its undefined value to persist them on ServerSide correctly.
    // Change made to set Delta correctly on Operator App.
    diff['version'] = right['version']
  }

  return diff
}

export {
  iDCardValidator,
  differenceObject,
  recordDiff,
  doFetch,
  hasPermissions,
  userTypeOptions,
  genderOptions,
  isString,
  setGlobalServer,
  global
}
