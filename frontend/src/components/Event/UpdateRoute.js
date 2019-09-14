// @flow
import React from 'react';
import Form from './Form';
import IfRole from '../../hoc/ifRole';

type Props = {
  eventId: any
};

export const UpdateRoute = (props: Props) => (
  <IfRole showError>
    <div style={{ padding: 10 }}>
      <h3>Wettkampf bearbeiten</h3>
      <Form eventId={props.eventId} />
    </div>
  </IfRole>
);

export default UpdateRoute;
