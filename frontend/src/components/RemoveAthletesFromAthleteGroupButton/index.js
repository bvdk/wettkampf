// @flow
import React, { Component } from 'react';
import {Button} from "antd";
import {graphql, compose} from "react-apollo";
import {loader} from "graphql.macro";

const AthleteGroupAthletesQuery = loader("../../graphql/queries/athleteGroupAthletes.graphql");
const RemoveAthleteFromAthleteGroup = loader("../../graphql/mutations/removeAthletesFromAthleteGroup.graphql");

type Props = {
  athleteGroupId: string,
  athleteIds: string[],
  removeAthleteFromAthleteGroup: Function,
  onDone?: Function
};

type State = {
  loading: true,
}

class RemoveAthletesFromAthleteGroupButton extends Component<Props, State> {

  state = {
    loading: false
  }

  _handleRemove = () => {
    this.setLoading(true)
      .then(()=>{
        return this.props.removeAthleteFromAthleteGroup({
          variables: {
            athleteGroupId: this.props.athleteGroupId,
            athleteIds: this.props.athleteIds
          }
        })
      })
      .then((res)=>{
        return this.props.onDone ? this.props.onDone(res) : null
      })
      .finally(() => {
        this.setLoading(false)
      })
  }

  setLoading = (loading) => {
          return new Promise((resolve) => {
              this.setState({
                  loading
              }, resolve)
          })
      }

  render() {

    const { style } = this.props;
    const { loading } = this.state;

    return <Button type={'danger'} style={style} disabled={!this.props.athleteIds.length} onClick={this._handleRemove} loading={loading}>Entfernen</Button>;
  }
}

export default compose(
  graphql(RemoveAthleteFromAthleteGroup, {
    name: 'removeAthleteFromAthleteGroup',
    options: (props: Props) =>({
      variables: {
        athleteGroupId: props.athleteGroupId
      },
      refetchQueries: [{
        query: AthleteGroupAthletesQuery,
        variables: {
          id: props.athleteGroupId
        }
      }]
    }),
  }),
)(RemoveAthletesFromAthleteGroupButton);
