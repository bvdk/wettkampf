// @flow
import React, { Component } from 'react';
import { withNamespaces } from 'react-i18next';
import { Button, Dropdown, Icon, Menu } from 'antd';
import { Link } from 'react-router-dom';
import AttributesInlineForm from '../../Form/attributes-inline-form';
import Toolbar from '../../Toolbar';

type Props = {
  eventId: string,
  params: any,
  onChange?: Function,
  showFullscreen?: boolean,
  showExport?: boolean,
  renderRight?: Function
};

class ResultsToolbar extends Component<Props, {}> {
  render() {
    const { onChange, eventId, params } = this.props;

    const attributes = [
      {
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
      }
    ];

    const menu = (
      <Menu>
        <Menu.Item>
          <a href={`/api/export/${eventId}/pdf`} download>
            PDF
          </a>
        </Menu.Item>
        <Menu.Item>
          <a href={`/api/export/${eventId}/csv`} download>
            CSV
          </a>
        </Menu.Item>
      </Menu>
    );

    return (
      <Toolbar
        renderLeft={() => (
          <span>
            <Icon
              type={'filter'}
              style={{ fontSize: '1.5em', paddingTop: 8, paddingRight: 10 }}
            />
            <AttributesInlineForm
              values={params}
              useSubmit={false}
              layout={'inline'}
              attributes={attributes}
              onChange={onChange}
            />
          </span>
        )}
        renderRight={() => (
          <div>
            {this.props.showFullscreen ? (
              <Link
                style={{ marginRight: 10 }}
                to={`/fullscreen/events/${eventId}/results`}
                target={'_BLANK'}>
                <Button icon={'fullscreen'}>Vollansicht</Button>
              </Link>
            ) : null}
            {this.props.showExport ? (
              <Dropdown overlay={menu}>
                <Button icon={'export'} key={'print'}>
                  {' '}
                  Export
                </Button>
              </Dropdown>
            ) : null}
            {this.props.renderRight ? this.props.renderRight() : null}
          </div>
        )}
      />
    );
  }
}

export default withNamespaces()(ResultsToolbar);
