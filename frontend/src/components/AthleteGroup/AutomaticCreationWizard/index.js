// @flow
import React, { Component } from 'react';
import AthleteGroupAutomaticCreationForm from "../AutomaticCreationForm";
import AthleteGroupAutomaticCreationPreview from "../AutomaticCreationPreview";

type Props = {
  eventId: string,
  onCreated?: Function
};

type State = {
  options: string[]
}

export default class AthleteGroupAutomaticCreationWizard extends Component<Props, State> {
  props: Props;

  state = {
    options: {
      keys: ['GENDER']
    },
  };

  _handleChanges = (options) => {
    console.log('_handleChanges',options);
    this.setState({
      options
    });
  };

  render() {

    const {eventId, onCreated} = this.props;
    const {options} = this.state;

    console.log(options);

    return <div>
      <div>
        <AthleteGroupAutomaticCreationForm values={options} eventId={eventId} onChange={this._handleChanges}/>
      </div>

      <AthleteGroupAutomaticCreationPreview onCreated={onCreated} eventId={eventId} options={options}/>
    </div>
  }
}
