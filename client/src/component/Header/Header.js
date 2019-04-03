import _ from 'lodash'
import React,{Component} from 'react';
import { Button,Menu, Container,Image, Dropdown} from 'semantic-ui-react';
import './Header.css';

class Header extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loggedin: false,           
            onClick: props.onClick,
            disabled: false
        }

        this.options = [
            { key: 'a', value: 'a', text: 'John Doe',image: { avatar: true, src: 'https://react.semantic-ui.com/images/avatar/small/elliot.jpg' }, },
            { key: 'b', value: 'b', text: 'Maria Bykova',image: { avatar: true, src: 'https://react.semantic-ui.com/images/avatar/small/elliot.jpg' }, },
        ]
    }

    caseSensitiveSearch = (options, query) => {
        const re = new RegExp(_.escapeRegExp(query))
        return options.filter(opt => re.test(opt.text))
    }

    render(){
        return (
            <Menu  className = "topBar" inverted>
                <Container>
                    <Menu.Item as='a' header>
                        <Image size='mini' src='/Strava-Icon.png' style={{ marginRight: '1.5em' }} />  
                         <h2 style={{ margin: 'auto' }}>STRAVA</h2>
                    </Menu.Item>   
                    <Menu.Menu position='right'>
                        <Dropdown 
                            fluid
                            options={this.options}
                            placeholder={'enter your username'}
                            search={this.caseSensitiveSearch}
                            selection 
                            style={{ width: '180px', height:"30px", margin:'auto' }} 
                        />                        
                        <Menu.Item>
                            <Button 
                                className='login_button'
                                color="orange"
                                content="Sign up with Strava"
                                onClick={
                                    () => this.state.onClick('LOGIN')
                                }
                                disabled={this.state.loggedin}
                            />
                        </Menu.Item>
                    </Menu.Menu>             
                             
                </Container>
            </Menu>
        )
    }
}


export default Header;