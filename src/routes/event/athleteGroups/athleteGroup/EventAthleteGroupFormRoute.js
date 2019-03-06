// @flow
import React, { Component } from 'react';
import styled from "styled-components";
import {graphql, compose} from "react-apollo";
import _ from "lodash";
import AthleteGroupUpdateForm from "./../../../../components/AthleteGroupUpdateForm";
import Toolbar from "../../../../components/Toolbar";
import {loader} from "graphql.macro";
import {withProps} from "recompose";

const AthleteGroupNameQuery = loader("./../../../../graphql/queries/athleteGroupName.graphql");

type Props = {
  eventId: string,
};

const Wrapper = styled.div`
    padding: 10px;
`

class EventAthleteGroupFormRoute extends Component<Props, State> {
  componentDidMount() {}

  render() {

    const { athleteGroupId, athleteGroupNameQuery } = this.props;


    return (
      <div>
        <Toolbar
          renderLeft={()=><h3>{_.get(athleteGroupNameQuery,'athleteGroup.name')}</h3>}
          borderBottom
        />
        <Wrapper>
          <AthleteGroupUpdateForm athleteGroupId={athleteGroupId}/>
        </Wrapper>
      </div>

    );
  }
}

export default compose(
  withProps((props)=>({
     athleteGroupId: _.get(props, 'match.params.athleteGroupId')
  })),
  graphql(AthleteGroupNameQuery, {
    name: 'athleteGroupNameQuery',
    options: (props: Props) =>({
      variables: {
        id: props.athleteGroupId
      }
    }),
  }),
)(EventAthleteGroupFormRoute)
