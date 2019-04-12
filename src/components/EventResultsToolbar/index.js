// @flow
import React, { Component } from 'react';
import Toolbar from "../Toolbar";
import AttributesInlineForm from "../Form/attributes-inline-form";
import {withNamespaces} from "react-i18next";
import {Button, Dropdown, Icon, Menu} from "antd";
import {Link} from "react-router-dom";

type Props = {
  eventId: string,
  params: any,
  onChange?: Function,
  showFullscreen?: boolean,
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
      renderRight={() => <div>
        { this.props.showFullscreen ? <Link style={{ marginRight: 10 }} to={`/fullscreen/events/${eventId}/results`} target={"_BLANK"}><Button icon={"fullscreen"}>Vollansicht</Button></Link> : undefined}
        <Dropdown overlay={menu}>
          <Button icon={"export"} key={'print'}> Export</Button>
        </Dropdown>
      </div>}
      />
  }
}

export default withNamespaces()(EventResultsToolbar);
