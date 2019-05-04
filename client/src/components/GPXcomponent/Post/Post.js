import React, { Component } from 'react';
import { Button, Input, Checkbox, Dropdown, Label } from 'semantic-ui-react';
import _ from 'lodash'
import './Post.css';
import * as service from 'restful';

import GPXUpload from "components/CustomUpload/GPXUpload.jsx";
// core components
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";


class Post extends Component {
    constructor(props) {
        super(props);
        this.state = {
            hr_cat_sel: '',
            slope_cat_sel: '',
            output_column_sel: '',
            hr_cat_sel_options: [{
                key: '',
                value: '',
                text: ''
            }],
            slope_cat_sel_options: [{
                key: '',
                value: '',
                text: ''
            }],
            output_column_sel_options: [{
                key: '',
                value: '',
                text: ''
            }],
            user_id: '',
            mv: '',
            gewicht: 85,
            leeftijd: '',
            lengte: '',
            conditie: '',
            activity_id: '',
            airresistance: 0.7,
            surfacearea: 0.5,
            rollingresistance: 0.006,
            seglen: 100,
            zeronegativeenergy: true,
            csvwithcomma: true,
            options: null,
            resultState: null,
            loading: true,
            requireHr: false,
            requireSlope: false,
            requireOut: false,
        };
        this.filesIndex = -1;
        this.files = [];
        this.starttime = '';
        this.runprocess = false;
        this.cancelprocess = this.cancelprocess.bind(this)


    }

    componentWillReceiveProps(nextProps) {
        const { profile, options } = nextProps
        if (!profile) return
        if (profile.athlete&&profile.athlete.id) {
            this.setState({ user_id: profile.athlete.id })
        }
        if (!options) return;
        if (options.length !== 0) {
            this.setState({
                options: options,
                hr_cat_sel_options: this.addOptions(options, 'heart_rate_divisions'),
                slope_cat_sel_options: this.addOptions(options, 'slope_divisions'),
                output_column_sel_options: this.addOptions(options, 'output_column_selections'),
                loading: false
            })
        }

    }

    addOptions(settings, name) {
        if (settings.length !== 0) {
            let data = settings[name]
            const options = []
            _.map(data, (sub_value, sub_id) => {
                let s = ""
                const option = {}
                s = sub_value.name + ' = ' + sub_value.values.toString()
                option.key = sub_value.name
                option.value = s
                option.text = s
                options.push(option)
            })
            return options
        }
    }

    cancelprocess() {
        document.getElementById('processing').style.display = "none";
        this.runprocess = false
    }

    onfileselectmousedown(event) {
        let input = event.target
        input.value = ''
    }

    onChooseFile = (event) => {

        let err1 = "The file API isn't supported on this browser.", err2 = "The browser does not properly implement the event object", err3 = "This browser does not support the `files` property of the file input."

        if (typeof window.FileReader !== 'function')
            throw err1;
        let input = event.target;
        if (!input)
            throw err2;
        if (!input.files)
            throw err3;
        if (!input.files[0])
            return undefined;
        this.files = input.files
        if (this.files.length === 0) return;
        this.filesIndex = -1
        this.starttime = new Date()
        this.runprocess = true
        this.props.onFileReady()
    }

    processNextFile() {
        this.filesIndex++
        if (this.filesIndex >= this.files.length || this.runprocess === false) {
            let contents = document.getElementById('contents')
            let filetext = 'file'
            if (this.files.length > 1) filetext = `${this.files.length} files`
            let endtime = new Date()
            contents.innerHTML = contents.innerHTML + `processing ${filetext} completed in ${Math.round((endtime.getTime() - this.starttime.getTime()) / 100) / 10} sec<br>`
            window.alert(`processing ${filetext} completed in ${Math.round((endtime.getTime() - this.starttime.getTime()) / 100) / 10} sec`)
            this.props.onfinishedProcessing()
            window.scrollTo(0, document.body.scrollHeight);
            this.cancelprocess()
            return
        }

        if (this.state.hr_cat_sel === '') {
            this.requirefield("requireHr")
            return
        }

        if (this.state.output_column_sel === '') {
            this.requirefield("requireOut")
            return
        }

        if (this.state.slope_cat_sel === '') {
            this.requirefield("requireSlope")
            return
        }

        let fr = new FileReader()
        fr.onload = this.onFileReaderData.bind(this);
        fr.readAsBinaryString(this.files[this.filesIndex])
        document.getElementById('processing').style.display = "block"
    }

    requirefield(name) {

        this.setState({
            [name]: true
        })
        setTimeout(() => {
            this.setState({
                [name]: false
            })
        }, 1000);
    }

    async onFileReaderData(event) {

        let data = event.target.result

        let params = '<params>'

        params += 'name:' + this.files[this.filesIndex].name
        params += ';hr-cat-sel:' + this.state.hr_cat_sel
        params += ';slope-cat-sel:' + this.state.slope_cat_sel
        params += ';output-column-sel:' + this.state.output_column_sel
        params += ';user-id:' + this.state.user_id
        params += ';mv:' + this.state.mv
        params += ';gewicht:' + this.state.gewicht
        params += ';leeftijd:' + this.state.leeftijd
        params += ';lengte:' + this.state.lengte
        params += ';conditie:' + this.state.conditie
        params += ';activity-id:' + this.state.activity_id
        params += ';airresistance:' + this.state.airresistance
        params += ';surfacearea:' + this.state.surfacearea
        params += ';rollingresistance:' + this.state.rollingresistance
        params += ';seglen:' + this.state.seglen
        params += ';zeronegativeenergy:' + this.state.zeronegativeenergy
        params += ';csvwithcomma:' + this.state.csvwithcomma
        params += '</params>'
        let data1 = btoa(data).toString()
        params = params + data1
        var response = await Promise.all([
            service.convertGPX(params)
        ]);

        if (response[0].status === 200 || response[0].readyState === 4) {
            this.onUploadResponse(response[0].data)
        }
    }

    onUploadResponse(params) {

        let contents = document.getElementById('contents')
        if (params.hasOwnProperty('parseresult')) {

            if (params.parseresult !== 'ok') var color = 'red'; else color = '#404040'
            contents.innerHTML = contents.innerHTML + (this.filesIndex + 1) + ' <span style="color:' + color + '">processing ' + params.name + ', result = ' + params.parseresult + '</span><br>'
            if (params.name === this.files[this.filesIndex].name) this.processNextFile()
            else console.log('unexpected fault, filenames do not match: ' + params.name + ' and ' + this.files[this.filesIndex].name)
        } else { contents.innerHTML = contents.innerHTML + '<span style="color:red">Failure, processing aborted</span><br>' }
        window.scrollTo(0, document.body.scrollHeight);
    }

    zeorHandleChange = (e, { checked }) => {
        this.setState({ zeronegativeenergy: checked })
    }

    csvHandleChange = (e, { checked }) => {
        this.setState({ csvwithcomma: checked })
    }

    handleChange = (e, { name, value }) => {
        this.setState({ [name]: value })
    }

    render() {
        const { csvwithcomma, zeronegativeenergy } = this.state

        return (
            <React.Fragment>
                <h3>GPX converter</h3>

                <div className="block">
                    <div className="leftTxt">heart rate category division</div>
                    <Dropdown
                        className='params'
                        selection
                        name='hr_cat_sel'
                        options={this.state.hr_cat_sel_options}
                        placeholder='select one option'
                        onChange={this.handleChange}
                        loading={this.state.loading}
                    />
                    <Label basic color='red' className={this.requireHr ? "visible require-label" : "hidden"} pointing>
                        Require this field
                    </Label>
                </div>
                <div className="block">
                    <div className="leftTxt">slope category division</div>
                    <Dropdown
                        className='params'
                        selection
                        name='slope_cat_sel'
                        options={this.state.slope_cat_sel_options}
                        placeholder='select one option'
                        onChange={this.handleChange}
                        loading={this.state.loading}
                    />
                    <Label basic color='red' className={this.requireSlope ? "visible require-label" : "hidden"} pointing>
                        Require this field
                    </Label>
                </div>
                <div className="block">
                    <div className="leftTxt">output colums</div>
                    <Dropdown
                        className='params'
                        selection
                        name='output_column_sel'
                        options={this.state.output_column_sel_options}
                        placeholder='select one option'
                        onChange={this.handleChange}
                        loading={this.state.loading}
                    />
                    <Label basic color='red' pointing className={this.requireOut ? "visible require-label" : "hidden"} >
                        Require this field
                    </Label>
                </div>

                <table>
                    <tbody>
                        <tr><td>user-id</td><td><Input className='param' id="user_id" type='text' value={this.state.user_id} onChange={e => this.setState({ user_id: e.target.value })} /></td></tr>
                        <tr><td>m/v</td><td><Input className='param' id="mv" type='text' value={this.state.mv} onChange={e => this.setState({ mv: e.target.value })} /></td></tr>
                        <tr><td>weight person+bike</td><td><Input className='param' id="gewicht" type='text' value={this.state.gewicht} onChange={e => this.setState({ gewicht: e.target.value })} /></td></tr>
                        <tr><td>age</td><td><Input className='param' id="leeftijd" type='text' value={this.state.leeftijd} onChange={e => this.setState({ leeftijd: e.target.value })} /></td></tr>
                        <tr><td>length</td><td><Input className='param' id="lengte" type='text' value={this.state.lengte} onChange={e => this.setState({ lengte: e.target.value })} /></td></tr>
                        <tr><td>shape</td><td><Input className='param' id="conditie" type='text' value={this.state.conditie} onChange={e => this.setState({ conditie: e.target.value })} /></td></tr>
                        <tr><td>activity-id</td><td><Input className='param' id="activity_id" type='text' value={this.state.activity_id} onChange={e => this.setState({ activity_id: e.target.value })} /></td></tr>
                        <tr><td>air resistance coefficient</td><td><Input className='param' id="airresistance" type='text' value={this.state.airresistance} onChange={e => this.setState({ airresistance: e.target.value })} /></td></tr>
                        <tr><td>front surface area (m2)</td><td><Input className='param' id="surfacearea" type='text' value={this.state.surfacearea} onChange={e => this.setState({ surfacearea: e.target.value })} /></td></tr>
                        <tr><td>rolling resistance coeff.</td><td><Input className='param' id="rollingresistance" type='text' value={this.state.rollingresistance} onChange={e => this.setState({ rollingresistance: e.target.value })} /></td></tr>
                        <tr><td>segment length (m)</td><td><Input className='param' id="seglen" type='text' value={this.state.seglen} onChange={e => this.setState({ seglen: e.target.value })} /></td></tr>
                        <tr><td>make neg. energy zero</td><td><Checkbox className='param chk' id="zeronegativeenergy" checked={zeronegativeenergy} onChange={this.zeorHandleChange} /></td></tr>
                        <tr><td>csv numbers with comma</td><td><Checkbox className='param chk' id="csvwithcomma" checked={csvwithcomma} onChange={this.csvHandleChange} /></td></tr>
                    </tbody>
                </table>
                <GridContainer>
                    <GridItem xs={12} sm={12} md={2} >
                        <GPXUpload onChange={this.onChooseFile} accept=".gpx" multiple innerText="Train GPX FIles" />
                    </GridItem>
                    <GridItem xs={12} sm={12} md={2} >
                        <GPXUpload onChange={this.onChooseFile} accept=".csv" innerText="Test GPX FIle" />
                    </GridItem>
                </GridContainer>


                {this.runprocess && <h5>ready gpx files</h5>}
                {/* <Input id="inputfile" type='file' onMouseDown={this.onfileselectmousedown.bind(this)} onChange={this.onChooseFile.bind(this)} accept=".gpx" multiple /> */}

                {/* <div className="ui middle aligned center aligned grid container">
                    <div className="ui fluid segment">
                    <input type="file"  className="inputfile" id="embedpollfileinput" onMouseDown={this.onfileselectmousedown.bind(this)} onChange={this.onChooseFile.bind(this)} accept=".gpx" multiple />

                    <label htmlFor="embedpollfileinput" className="ui middle orange right floated button">
                        <i className="ui cloud upload icon"></i> 
                        Train File
                    </label>
                    <input type="file" className="inputfile" id="embedpollfileinput" onMouseDown={this.onfileselectmousedown.bind(this)} onChange={this.onChooseFile.bind(this)} accept=".gpx" multiple/>

                    <label htmlFor="embedpollfileinput" className="ui middle orange right floated button">
                        <i className="ui cloud upload icon"></i> 
                        Test File
                    </label>
                    </div>                    
                </div> */}

                <span id="processing">processing...
                <Button id="butcancel" onClick={this.cancelprocess}>cancel</Button>
                </span>
                <span id="errors"></span>
                <span id="message"></span>
                <pre><code><span id="contents"></span></code></pre>
            </React.Fragment>
        );
    }
}

export default Post;