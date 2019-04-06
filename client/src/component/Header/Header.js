import _ from 'lodash'
import React,{Component} from 'react';
import { Button,Menu, Container,Image, Dropdown} from 'semantic-ui-react';
import './Header.css';

class Header extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loggedin: props.onClick,           
            onClick: props.onClick,
            options:[]
        }

    }
    
    caseSensitiveSearch = (options, query) => {
        const re = new RegExp(_.escapeRegExp(query))
        return options.filter(opt => re.test(opt.text))
    }

    componentWillReceiveProps=(nextPropos)=>{
        this.setState({
            loggedin:nextPropos.loggedin
        })
        let tempArr = []   
        _.map(nextPropos.userOption,(value, key)=>{
            let tempObj = {}
            tempObj.key = value.userId
            tempObj.value = value.userId
            tempObj.text = value.username
            tempObj.image = {avatar:true, src:value.profile_medium}
            tempArr.push(tempObj)
        })
        this.setState({
            options:tempArr
        })
    }

    onChangeFollower(event, data){
        console.log("on change follower",data.value)
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
                            options={this.state.options}
                            placeholder={'enter your username'}
                            search={this.caseSensitiveSearch}
                            selection 
                            style={{ width: '180px', height:"30px", margin:'auto' }} 
                            onChange = {this.onChangeFollower}
                        />                        
                        <Menu.Item>
                            <Button 
                                className={this.state.loggedin?"login_button hiden_button":"login_button visible_button"}
                                color="orange"
                                content="Sign up with Strava"
                                onClick={
                                    () => {
                                        this.setState({loggedin:true})
                                        this.state.onClick('LOGIN')
                                    }
                                }
                            />
                            <Button 
                                className={this.state.loggedin?"exit_button visible_button":"exit_button hiden_button"}
                                color="orange"
                                content="Exit"
                                onClick={
                                    () =>{
                                        this.state.onClick('EXIT')
                                    } 
                                }
                            />
                        </Menu.Item>
                    </Menu.Menu>             
                             
                </Container>
            </Menu>
        )
    }
}


export default Header;