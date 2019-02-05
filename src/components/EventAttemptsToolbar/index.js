// @flow
import React, { Component } from 'react';
import Toolbar from "../Toolbar";
import AttributesInlineForm from "../Form/attributes-inline-form";
import {withNamespaces} from "react-i18next";
import {Icon} from "antd";

type Props = {
  eventId: string,
  availableDisciplines: string[],
  params: any,
  onChange?: Function,
};

type State = {

}

class EventAttemptsToolbar extends Component<Props, State> {
  componentDidMount() {}

  render() {
    const { t, onChange, availableDisciplines, eventId } = this.props;

    const attributes = [{
      index: 'slotId',
      type: 'string',
      inputType: 'select',
      entityType: 'EventSlot',
      getQueryVariables: () => ({
        eventId
      }),
      inputTypeOptions: {
        placeholder: 'Bühne'
      }
    },{
      index: 'discipline',
      type: 'string',
      inputType: 'select',
      optionValues: availableDisciplines.map(item => ({
        value: item,
        name: t(item),
      })),
      inputTypeOptions: {
        placeholder: 'Disziplin'
      }
    },{
      index: 'athleteGroupId',
      type: 'string',
      inputType: 'select',
      entityType: 'EventAthleteGroup',
      getQueryVariables: () => ({
        eventId
      }),
      inputTypeOptions: {
        placeholder: 'Startgruppe'
      }
    },];

    return <Toolbar
      renderLeft={() => <span>
        <Icon type={'filter'} style={{ fontSize: '1.5em', paddingTop: 8, paddingRight: 10 }}/>
        <AttributesInlineForm
          useSubmit={false}
          layout={'inline'}
          attributes={attributes}
          onChange={onChange}/>
      </span>}
      renderRight={() => [

      ]}/>;
  }
}

export default withNamespaces()(EventAttemptsToolbar);
