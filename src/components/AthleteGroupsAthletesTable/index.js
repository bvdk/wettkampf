// @flow
import React, { Component } from 'react';
import {compose, graphql} from "react-apollo";
import {loader} from "graphql.macro";
import _ from "lodash";
import AthletesTable from "../AthletesTable";
import waitWhileLoading from "../../hoc/waitWhileLoading";
import {withRouter} from "react-router";

const AthleteGroupAthletesQuery = loader("../../graphql/queries/athleteGroupAthletes.graphql");

type Props = {
  athleteGroupId: string,
  onAthleteClick?: Function
};

class AthleteGroupsAthletesTable extends Component<Props> {
  props: Props;

  render() {

    const {athleteGroupAthletesQuery, onAthleteClick} = this.props;
    return (
      <AthletesTable
          hideKeys={['athleteGroup.name','athleteGroup.slot.name']}
          showRowNumber

          onAthleteClick={onAthleteClick}
          athletes={_.get(athleteGroupAthletesQuery,'athleteGroup.athletes',[])}/>
    );
  }
}

export default compose(
    graphql(AthleteGroupAthletesQuery, {
      name: 'athleteGroupAthletesQuery',
      options: (props: Props) => ({
        variables: {
          id: props.athleteGroupId
        }
      })
    }),
    waitWhileLoading('athleteGroupAthletesQuery')
)(AthleteGroupsAthletesTable)
