// @flow
import React, { Component } from 'react';
import Toolbar from "../Toolbar";
import AttributesInlineForm from "../Form/attributes-inline-form";
import {withNamespaces} from "react-i18next";
import {Button, Dropdown, Icon, Menu} from "antd";

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
    },
      {
      index: 'resultClassId',
      type: 'string',
      inputType: 'select',
      entityType: 'ResultClass',
      getQueryVariables: () => ({
        eventId
      }),
      inputTypeOptions: {
        placeholder: 'Wertungsgruppe'
      }
    }];

    const menu = <Menu>
      <Menu.Item><a href={`/export/${eventId}/pdf`} download>PDF</a></Menu.Item>
      <Menu.Item><a href={`/export/${eventId}/csv`} download>CSV</a></Menu.Item>
    </Menu>

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
      renderRight={() => <Dropdown overlay={menu}>
        <Button key={'print'}> Export</Button>
      </Dropdown>}/>;
  }
}

export default withNamespaces()(EventResultsToolbar);
