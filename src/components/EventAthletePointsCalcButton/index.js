// @flow
import React, { Component } from 'react';
import {Button, Dropdown, Icon, Menu, Modal} from "antd";
import {loader} from "graphql.macro";
import {graphql, compose} from "react-apollo";
import SlotAthleteGroupActivationForm from "../SlotAthleteGroupActivationForm";

const AutoCalcAthletePointsMutation = loader("../../graphql/mutations/autoCalcEventAthletePoints.graphql");

type Props = {
    eventId: string,
    slotId: string,
    loading: boolean,
    autoCalcAthletePointsMutation: Function,
};

type State = {
    loading: boolean,
    showModal: boolean
}

class EventAthletePointsCalcButton extends Component<Props, State> {

    state = {
        showModal: false,
        loading: false
    }

    _handleClick = () => {

        const {autoCalcAthletePointsMutation} = this.props;

        this.setLoading(true)
            .then(() => {
                return autoCalcAthletePointsMutation()
            })
            .then(() => {
                this.setLoading(false);
            })
    }

    _handleMenuClick = () => {

        this.setState({
            showModal: true,
        })

    }

    _hideModal = () => {
        this.setState({
            showModal: false,
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
        const { loading } = this.state;

        return <div>
            <Button.Group>
                <Button onClick={this._handleClick} loading={loading} icon={'reload'} >Aktualisieren</Button>
                <Dropdown overlay={<Menu onClick={this._handleMenuClick}>
                    <Menu.Item key="1">Aktive Startgruppe / Disziplin ändern</Menu.Item>
                </Menu>}>
                    <Button>
                        <Icon type="down" />
                    </Button>
                </Dropdown>
            </Button.Group>
            <Modal
                title={'Aktive Startgruppe und Disziplin ändern'}
                visible={this.state.showModal}
                onCancel={this._hideModal}
                footer={null}

            >
                <SlotAthleteGroupActivationForm slotId={this.props.slotId} />
            </Modal>
        </div>
    }
}

export default compose(
    graphql(AutoCalcAthletePointsMutation,{
        name: 'autoCalcAthletePointsMutation',
        options: (props) => ({
            variables: {
                eventId: props.eventId
            }
        })
    }),
)(EventAthletePointsCalcButton);
