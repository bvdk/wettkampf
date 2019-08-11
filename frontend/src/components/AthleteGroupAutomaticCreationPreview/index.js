// @flow
import React, {Component} from 'react';
import _ from "lodash";
import {compose, mapProps} from "recompose";
import {graphql} from "react-apollo";
import {loader} from "graphql.macro";
import AthleteGroupTable from "../AthleteGroupTable";
import Toolbar from "../Toolbar";
import {message, Button} from "antd";
import Strings from "../../constants/strings";

const AutoCreateAthleteGroupsPreviewQuery = loader("../../graphql/queries/autoCreateAthleteGroupsPreview.graphql");
const AutoCreateAthleteGroupsMutation = loader("../../graphql/mutations/autoCreateAthleteGroups.graphql");

type Props = {
    eventId: string,
    options: any,
    autoCreateAthleteGroupsMutation: Function,
    onCreated?: Function
};

type State = {
    loading: boolean
}

class AthleteGroupAutomaticCreationPreview extends Component<Props, State> {
    props: Props;

    state = {
        loading: false,
    };

    _handleClick = () => {

        this.setLoading(true)
          .then(()=>{
              return this.props.autoCreateAthleteGroupsMutation()
          })
          .then((res)=>{
              message.success(Strings.success);
              if (this.props.onCreated){
                  this.props.onCreated(res);
              }
          })
          .catch(()=>{
              message.error(Strings.errorOccurred);
          })
          .finally(()=>{
            return this.setLoading(false);
          });
    }

    setLoading = (loading) => {
        return new Promise((resolve) => {
            this.setState({
                loading
            }, resolve)
        })
    }

    render() {

        const {athleteGroups, eventId} = this.props;
        const {loading} = this.state;

        return (
          <div>
              <AthleteGroupTable
                hideKeys={['action']}
                eventId={eventId}
                tableProps={{
                    footer: () => <Toolbar renderRight={() => <Button disabled={!athleteGroups.length} type={'primary'} onClick={this._handleClick} loading={loading}><b>{`${athleteGroups.length} `}</b> <span> Startgruppen erstellen</span></Button>}/>
                }}
                athleteGroups={athleteGroups}
                editable={false}/>
          </div>
        );
    }
}

export default compose(
  graphql(AutoCreateAthleteGroupsPreviewQuery,{
      name: 'autoCreateAthleteGroupsPreviewQuery',
      skip: (props) => !props.options,
      options: ({eventId, options}: Props) => ({
          variables: {
              eventId,
              keys: options.keys,
              useExisting: options.useExisting,
              maxGroupSize: options.maxGroupSize,
          }
      })
  }),
  graphql(AutoCreateAthleteGroupsMutation,{
      name: 'autoCreateAthleteGroupsMutation',
      options: ({eventId, options}: Props) => ({
          variables: {
              eventId,
              keys: options.keys,
              useExisting: options.useExisting,
              maxGroupSize: options.maxGroupSize,
          }
      })
  }),
  mapProps((props) => ({
      autoCreateAthleteGroupsMutation: props.autoCreateAthleteGroupsMutation,
      eventId: props.eventId,
      loading: _.get(props,'autoCreateAthleteGroupsPreviewQuery.loading',false),
      athleteGroups:  _.get(props,'autoCreateAthleteGroupsPreviewQuery.autoCreateAthleteGroupsPreview.athleteGroups',[]),
  }))
)(AthleteGroupAutomaticCreationPreview)
