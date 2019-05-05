import React, { Component } from 'react';
import './PostBox.css';
import { Button, Modal, Icon, Input, Message } from 'semantic-ui-react';
import { Post } from '..';

class PostBox extends Component {

    constructor(props) {
        super(props);

        this.state = {
            loggedin: props.loggedin,
            fileProcessing: false,
            fileReady: false,
            fetchingStrava: props.fetchingStrava,
            convertedGPX: props.convertedGPX,
            profile: props.profile,
            onClick: props.onClick,
            options: props.options,
            open: false,
            email: "",
            emailError: false
        };

        this.child = React.createRef();
    }

    onClick = () => {
        this.setState({
            fileProcessing: true
        })
        this.child.current.processNextFile();
    };

    componentWillReceiveProps(nextProps) {
        this.setState({
            loggedin: nextProps.loggedin,
            fetchingStrava: nextProps.fetchingStrava,
            convertedGPX: nextProps.convertedGPX,
            profile: nextProps.profile,
            onClick: nextProps.onClick,
            options: nextProps.options
        })
    }

    onGetFileReady = () => {
        this.setState({
            fileReady: true
        })
    }

    onGetFinishedProcessing = () => {
        this.setState({
            fileProcessing: false,
            fileReady: false
        })
    }

    closeConfigShow = (closeOnEscape, closeOnDimmerClick) => () => {
        this.setState({ closeOnEscape, closeOnDimmerClick, open: true })
    }

    closeModal = () => {
        this.setState({ open: false });
    }

    closeModalSave = () => {
        if (this.validateEmail(this.state.email)) {
            this.setState({
                open: false,
                emailError: false
            });
            this.state.onClick('getStravaData', this.state.email);
        } else {
            this.setState({ emailError: true })
            setTimeout(() => {
                this.setState({ emailError: false })
            }, 5000);
        }

    }

    validateEmail = (email) => {
        var re = /^(([^<>()\]\\.,;:\s@"]+(\.[^<>()\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }

    render() {

        return (
            <div>
                <div className="PostBox">

                    <Button
                        color={this.state.fileReady ? "orange" : "grey"}
                        content="Convert GPX"
                        icon="cloud upload"
                        labelPosition="left"
                        disabled={!this.state.fileReady || this.state.fileProcessing}
                        onClick={this.onClick}
                        loading={this.state.fileProcessing}
                    />
                    <Button
                        className="PostBox-right-button"
                        color={this.state.loggedin ? "orange" : "grey"}
                        content="GET DATA"
                        icon="box"
                        labelPosition="right"
                        onClick={this.closeConfigShow(false, true)}
                        disabled={this.state.fetchingStrava || !this.state.loggedin}
                        loading={this.state.fetchingStrava}
                    />
                    <Post
                        profile={this.state.profile}
                        options={this.state.options}
                        ref={this.child}
                        onFileReady={this.onGetFileReady}
                        onfinishedProcessing={this.onGetFinishedProcessing}
                    />
                </div>
                <Modal
                    open={this.state.open}
                    closeOnEscape={this.closeOnEscape}
                    closeOnDimmerClick={this.closeOnDimmerClick}
                    onClose={this.closeModal}
                    size="mini"
                >
                    <Modal.Header>Enter your email</Modal.Header>
                    <Modal.Content>
                        <div className="modal-input">
                            <Input iconPosition='left' placeholder='Email'  >
                                <Icon name='at' />
                                <input value={this.state.email} onChange={e => this.setState({ email: e.target.value })} required={true} />
                            </Input>
                        </div>
                        <br></br>
                        <Message
                            error
                            size="mini"
                            content='unvalidated email'
                            hidden={!this.state.emailError}
                        />
                        <Message
                            info
                            size="large"
                            content='This action will take for a while to get all data, We will let know you through email when done'
                        />
                        <p></p>
                    </Modal.Content>
                    <Modal.Actions>
                        <Button onClick={this.closeModal} negative>
                            No
                        </Button>
                        <Button
                            onClick={this.closeModalSave}
                            positive
                            labelPosition='right'
                            icon='checkmark'
                            content='Yes'
                        />
                    </Modal.Actions>
                </Modal>
            </div>
        )
    }
}


export default PostBox;