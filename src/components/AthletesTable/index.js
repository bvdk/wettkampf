// @flow
import React, { Component } from 'react';
import {Table} from "antd";
import {withNamespaces} from "react-i18next";

type Props = {
  athletes: any[]
};

type State = {

}

class AthletesTable extends Component<Props, State> {
  componentDidMount() {}

  render() {
    const { athletes, t } = this.props;

    const columns = [{
      title: 'Vorname',
      dataIndex: 'firstName',
      key: 'firstName',
    }, {
      title: 'Nachname',
      dataIndex: 'lastName',
      key: 'lastName',
    }, {
      title: 'Geschlecht',
      dataIndex: 'gender',
      key: 'gender',
      render: (text) => t(text)
    }, {
      title: 'Alter',
      dataIndex: 'age',
      key: 'age',
    }, {
      title: 'Gewicht',
      dataIndex: 'weight',
      key: 'weight',
      render: (text) => text ? <span>{text} kg</span> : null
    }
    ];

    return <Table
      columns={columns}
      dataSource={athletes}
    />;
  }
}

export default withNamespaces()(AthletesTable);
