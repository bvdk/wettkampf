// @flow
import React, { Component } from 'react';
import styled from "styled-components";
import {graphql, compose} from "react-apollo";
import _ from "lodash";
import AthleteGroupUpdateForm from "../../../AthleteGroup/UpdateForm";
import Toolbar from "../../../Toolbar";
import {loader} from "graphql.macro";
import {withProps} from "recompose";
import BackButton from "../../../BackButton";

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
          renderLeft={()=><span>
                <BackButton />
                <h3 style={{display: 'inline', marginLeft: 8}}>{_.get(athleteGroupNameQuery,'athleteGroup.name')}</h3>
              </span>}
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
