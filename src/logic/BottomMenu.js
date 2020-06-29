/**
 * BottomMenu Component
 *
 * @format
 * @flow
 */

import React, {Component} from 'react'
import {withTheme} from 'styled-components'
import {
  faList,
  faMapMarkedAlt,
  faPlus,
  // faNotesMedical,
  faSearchPlus,
  faUserMd
} from '@fortawesome/free-solid-svg-icons'
import {faCalendarCheck, faHospital, faIdBadge, faListAlt} from '@fortawesome/free-regular-svg-icons'
import {withRouter} from '../../utility/routing'
import FontAwesomeLink from '../FontAwesomeLink'
import {LinearGradientStyled} from '../common'
import SecuredComponent from '../common/SecuredComponent'

class BottomMenu extends Component {
  render() {
    const {
      theme,
      flex = theme.bottomMenu.flex,
      alignItems = theme.bottomMenu.alignItems,
      justifyContent = theme.bottomMenu.justifyContent,
      backgroundColor = theme.bottomMenu.backgroundColor,
      backgroundColor1 = theme.bottomMenu.backgroundColor1,
      height = theme.bottomMenu.height,
      home,
      homePress,
      ...restProps
    } = this.props

    return (
      <LinearGradientStyled
        {...restProps}
        flexDirection='row'
        flex={flex}
        height={height}
        alignItems={alignItems}
        justifyContent={justifyContent}
        colors={[backgroundColor, backgroundColor1]}
      >
        {/* MAPA */}
        <SecuredComponent
          checkPermissions={{
            objects: 'Map',
            actions: ['read']
          }}
        >
          <FontAwesomeLink link='/' icon={faMapMarkedAlt} title='Mapa' />
        </SecuredComponent>

        {/* Crear Paciente */}
        <SecuredComponent
          checkPermissions={{
            objects: 'IESSCallCenter',
            actions: ['read']
          }}
        >
          <FontAwesomeLink
            link='/edituser'
            icon={faPlus}
            title='Crear Paciente'
          />
          <FontAwesomeLink link='/patients' icon={faListAlt} title='Pacientes' />
        </SecuredComponent>

        {/* PERFIL */}
        <FontAwesomeLink link='/profile' icon={faIdBadge} title='Perfil' />

        {/* AGENDAR PACIENTE */}
        <SecuredComponent
          checkPermissions={{
            objects: 'PatientAppointment',
            actions: ['create']
          }}
        >
          <FontAwesomeLink
            link='/patientappointment'
            icon={faUserMd}
            title='Agendar'
          />
        </SecuredComponent>

        {/* AGENDAR PACIENTE */}
        <SecuredComponent
          checkPermissions={{
            objects: 'CallCenter',
            actions: ['read']
          }}
        >
          <FontAwesomeLink link='/' icon={faListAlt} title='Pacientes' />
          <FontAwesomeLink link='/mapa' icon={faMapMarkedAlt} title='Mapa' />
          <FontAwesomeLink
            link='/appointments'
            icon={faCalendarCheck}
            title='Agendamientos'
          />
          <FontAwesomeLink
            link='/report'
            icon={faList}
            title='Reportes'
          />
        </SecuredComponent>

        {/* AGENDAR PACIENTE */}
        <SecuredComponent
          checkPermissions={{
            objects: 'DoctorAppointment',
            actions: ['create']
          }}
        >
          {/*<FontAwesomeLink
            link='/appointment'
            icon={faUserMd} //{faSearchPlus} //{faClinicMedical}
            title='Agendar'
          />*/}
            <FontAwesomeLink
              link='/appointments'
              icon={faCalendarCheck}
              title='Agendamientos'
            />
        </SecuredComponent>

        {/* CONSULTORIOS LISTA */}
        <SecuredComponent
          checkPermissions={{
            objects: 'ConsultingRoom',
            actions: ['create']
          }}
        >
          <FontAwesomeLink
            link='/consultingrooms'
            icon={faHospital}
            title='Consultorios'
          />
        </SecuredComponent>

        {/* HISTORIAL DE CONSULTAS */}
        {/*<SecuredComponent
          checkPermissions={{
            objects: 'History',
            actions: ['read']
          }}
        >
          <FontAwesomeLink
            link='/history'
            icon={faNotesMedical}
            title='Consultas'
          />
        </SecuredComponent>*/}

        <SecuredComponent
          checkPermissions={{
            objects: 'Permission',
            actions: ['update']
          }}
        >
          <FontAwesomeLink
            link='/permission'
            icon={faSearchPlus}
            title='Permisos'
          />
        </SecuredComponent>
      </LinearGradientStyled>
    )
  }
}

export default withTheme(withRouter(BottomMenu))
