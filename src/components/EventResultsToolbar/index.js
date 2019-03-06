// @flow
import React, { Component } from 'react';
import Toolbar from "../Toolbar";
import AttributesInlineForm from "../Form/attributes-inline-form";
import {withNamespaces} from "react-i18next";
import {Button, Icon} from "antd";

type Props = {
  eventId: string,
  params: any,
  onChange?: Function,
};

type State = {

}

class EventResultsToolbar extends Component<Props, State> {
  componentDidMount() {}

  render() {
    const { t, onChange, eventId, params } = this.props;

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
    }];

    return <Toolbar
      renderLeft={() => <span>
        <Icon type={'filter'} style={{ fontSize: '1.5em', paddingTop: 8, paddingRight: 10 }}/>
        <AttributesInlineForm
          values={params}
          useSubmit={false}
          layout={'inline'}
          attributes={attributes}
          onChange={onChange}/>
      </span>}
      renderRight={() => [
        <Button key={'print'}>
          <a href={`/export/${eventId}`} download>Drucken</a>
        </Button>
      ]}/>;
  }
}

export default withNamespaces()(EventResultsToolbar);
