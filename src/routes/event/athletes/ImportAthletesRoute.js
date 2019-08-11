// @flow
import React, {Component} from 'react';
import AthleteCreateForm from "./../../../components/AthleteCreateForm";
import {withRouter} from "react-router";
import AthleteImport from "../../../components/AthleteImport";
import IfRole from "../../../hoc/ifRole";

type Props = {
  eventId: string,
};

type State = {

}

class ImportAthletesRoute extends Component<Props, State> {
  componentDidMount() {}

  render() {
    const { eventId, history } = this.props;

    return <IfRole showError>
      <div style={{padding: 10}}>
        <h3>Athletenimport</h3>
        <AthleteImport eventId={eventId}/>
      </div>
    </IfRole>;
  }
}

export default withRouter(ImportAthletesRoute);
