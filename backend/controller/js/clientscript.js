"use strict"

// Copyright (c) j.c. jansen klomp. All rights reserved.  

let filesIndex = -1
let files = []
let starttime
let runprocess

function onfileselectmousedown(event){
	let input = event.target
	input.value=''
}

function onChooseFile(event) {
	if (typeof window.FileReader !== 'function')
		throw ("The file API isn't supported on this browser.");
	let input = event.target;
	if (!input)
		throw ("The browser does not properly implement the event object");
	if (!input.files)
		throw ("This browser does not support the `files` property of the file input.");
	if (!input.files[0])
		return undefined;
	files = input.files
	if (files.length == 0) exit;
	filesIndex = -1
	starttime = new Date()
	runprocess=true
	processNextFile()
}


function cancelprocess(){
	document.getElementById('processing').style.display="none"
	runprocess=false;
}

function processNextFile(){
	filesIndex++
	if (filesIndex >= files.length || runprocess == false){
		let contents = document.getElementById('contents')
		let filetext = 'file'
		if (files.length > 1) filetext = `${files.length} files`
		let endtime = new Date()
		contents.innerHTML = contents.innerHTML + `processing ${filetext} completed in ${Math.round((endtime.getTime() - starttime.getTime())/100)/10} sec<br>`
		window.scrollTo(0, document.body.scrollHeight);
		cancelprocess() 
		return
	}
	let fr = new FileReader()
	fr.onload = onFileReaderData;
	fr.readAsBinaryString(files[filesIndex])
	document.getElementById('processing').style.display="block"
	// continued in onFileReaderData
}

function onFileReaderData(event) {
	let data = event.target.result
	let xmlhttp
	
	if (window.XMLHttpRequest) {
		// code for IE7+, Firefox, Chrome, Opera, Safari
		xmlhttp=new XMLHttpRequest();
	} else {  // code for IE6, IE5
		xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
	}
	xmlhttp.onreadystatechange=function() {
		if (this.readyState==4 && this.status==200) {
		onUploadResponse(this.responseText)
		}
	}



	xmlhttp.open("POST", "gpxfileupload", true);
	xmlhttp.setRequestHeader("Content-type", "application/octet-stream");
	let params = '<params>'
	params += 'name:' + files[filesIndex].name 
	let para = document.getElementsByClassName('param')
	for (var i=0; i < para.length; i++) {
		let value = '0'
		if (para[i].classList.contains('chk')) value = para[i].checked
		else value = para[i].value
		params += ';' + para[i].id + ':' + value
	}
	params += '</params>'
	let data1 = btoa(data).toString()
	xmlhttp.send(params + data1); // send params + data converted to base64
}



function onUploadResponse(text){
	let params = JSON.parse(text)
	let contents = document.getElementById('contents')
	if (params.hasOwnProperty('parseresult')){
		if (params.parseresult != 'ok') var color = 'red'; else color='#404040'
		contents.innerHTML = contents.innerHTML + (filesIndex +1) + ' <span style="color:' + color + '">processing ' + params.name + ', result = ' +params.parseresult +'</span><br>'
		console.log(params.name + ' ' + files[filesIndex].name)
		if (params.name == files[filesIndex].name) processNextFile()
		else console.log('unexpected fault, filenames do not match: ' + params.name +' and ' + files[filesIndex].name )
	}
	else contents.innerHTML = contents.innerHTML + '<span style="color:red">Failure, processing aborted</span><br>'
	window.scrollTo(0, document.body.scrollHeight);
}

function addOptions(name, id){
    let data = settings[name]
    let html = ""
    for (var i=0; i < data.length; i++) {
        let setting = data[i]
        let s = ""
        for (var j=0; j < setting.values.length; j++) s += setting.values[j] + ','
        s = setting.name + ' = ' +s.substr(0,s.length-1)
        html += '<option value="' + s + '">' + s +'</option>'
    }
    document.getElementById(id).innerHTML = html 
}

function initDefaults(){
	let data = settings['defaults']
	for (var i=0; i < data.length; i++) {
		let item = data[i]
		let input = document.getElementById(item.name)
		if (input) {
			if (input.type=="checkbox") input.checked = item.values[0] == 1 
			else input.value = item.values[0]
		}
	}
}
function init(){
    addOptions('heart-rate-divisions', "hr-cat-sel")
    addOptions('slope-divisions', "slope-cat-sel")
	addOptions('output-column-selections', "output-column-sel")
	addOptions('heart-rate-cat-multiplier', "hr-cat-mult")

	
	initDefaults()
}
