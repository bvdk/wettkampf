// @flow
import React, { Component } from 'react';
import {Button, message} from "antd";
import {graphql, compose} from "react-apollo";
import {loader} from "graphql.macro";
import Strings from "../../../constants/strings";

type Props = {
  deleteAthleteMutation: Function,
  onDelete?: Function,
};

type State = {

}

const DeleteAthleteMutation = loader("../../graphql/mutations/deleteAthlete.graphql");

class AthleteDeleteButton extends Component<Props, State> {


  state = {
    loading: false,
  }

  _handleDelete = () => {
    this.setLoading(true)
      .then(() => this.props.deleteAthleteMutation())
      .then((res) => {
        message.success(Strings.success)
      })
      .then((res) => {
        if (this.props.onDelete)
          this.props.onDelete(res);
      })
      .catch((err) => {
        if (err){
          message.error(Strings.errorOccurred)
        }
      })
      .finally(() => this.setLoading(false))
  }

  setLoading = (loading) => {
          return new Promise((resolve) => {
              this.setState({
                  loading
              }, resolve)
          })
      }

  render() {
    const {  } = this.props;

    return <Button loading={this.state.loading} onClick={this._handleDelete} type={'danger'}>
      Löschen
    </Button>;
  }
}

export default compose(
  graphql(DeleteAthleteMutation, {
    name: 'deleteAthleteMutation',
    options: (props: Props) =>({
      variables: {
        id: props.athleteId,
      }
    }),
  }),
)(AthleteDeleteButton);
