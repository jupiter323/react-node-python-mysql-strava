"use strict"

// Copyright (c) j.c. jansen klomp. All rights reserved.  

let fs = require('fs')
let profile = require('./profiles/profile-messages')

function parse(data) { // parse fit file data 
	
	let bit5 = 32
	let bit6 = 64
	let bit7 = 128

	let ofs_architecture = 2
	let ofs_messagenumber = 3
	let ofs_fieldcount = 5
	let ofs_fieddefs = 6
	let const2power31 = Math.pow(2, 31)
	
	let datamessagedefs = []               // message definitions
	let messages = []                      // messages extracted from fit-file
	let index = 0                          // index in file content
	var lasttimestamp = new Uint32Array(1) // last timestamp contained in a data message (32bit unsigned int)


	function strFromUTF8Array(data) { 
		/*
		1	7	U+0000	U+007F	    0xxxxxxx			
		2	11	U+0080	U+07FF	    110xxxxx	10xxxxxx		
		3	16	U+0800	U+FFFF	    1110xxxx	10xxxxxx	10xxxxxx	
		4	21	U+10000	U+10FFFF	11110xxx	10xxxxxx	10xxxxxx	10xxxxxx
		*/
		var str = '',
			i;

		for (i = 0; i < data.length; i++) {
			var value = data[i];
			if (data[i] == 0 ) break;

			if (value < 0x80) {
				str += String.fromCharCode(value);
			} else if (value > 0xBF && value < 0xE0) {
				str += String.fromCharCode((value & 0x1F) << 6 | data[i + 1] & 0x3F);
				i += 1;
			} else if (value > 0xDF && value < 0xF0) {
				str += String.fromCharCode((value & 0x0F) << 12 | (data[i + 1] & 0x3F) << 6 | data[i + 2] & 0x3F);
				i += 2;
			} else {
				// surrogate pair
				var charCode = ((value & 0x07) << 18 | (data[i + 1] & 0x3F) << 12 | (data[i + 2] & 0x3F) << 6 | data[i + 3] & 0x3F) - 0x010000;
				str += String.fromCharCode(charCode >> 10 | 0xD800, charCode & 0x03FF | 0xDC00); 
				i += 3;
			}
		}

		return str;
	}

	function parseHeader(hdr){
		return {
			headersize: hdr[0],
			protocol: hdr[1],
			profile: hdr[3] * 256 + hdr[2],
			datasize: ((hdr[7] * 256 + hdr[6] ) * 256 + hdr[5]) * 256 + hdr[4],
			fitstring: hdr.slice(8,12).toString()
		}
	}

	function parseDefinitionMessage(recordheader) {
		let architecture = data[index + ofs_architecture]
		if (architecture==1) var messagenumber =  data[index + ofs_messagenumber] * 256 + data[index + ofs_messagenumber + 1]
		else messagenumber =  data[index + ofs_messagenumber +1] * 256 + data[index + ofs_messagenumber]
		let messageprofile = profile.messages[messagenumber]
		let datamessagedef= {
			messageprofile : messageprofile,
			architecture : architecture,
			messagenumber: messagenumber,
			fielddefs : [],
			messagelen :1
		}
		let localmessagetype = recordheader & 0xf
		datamessagedefs[localmessagetype] = datamessagedef
		let fieldcount = data[index + ofs_fieldcount]
		let index1 = index + ofs_fieddefs
		for (var i=0; i < fieldcount; i++){
			if (messageprofile) var fieldprofile = messageprofile[data[index1]]
			else fieldprofile = null
			let fielddef = {
				defnr : data[index1],
				fieldprofile: fieldprofile,
				size: data[index1+1],
				basetype : data[index1+2]
			}
			index1 += 3
			datamessagedef.messagelen += fielddef.size
			datamessagedef.fielddefs.push(fielddef)
		}
		let devfieldsize = 0 // size of developers extension
		if (recordheader & bit5) { // developer extension bit
			let devfieldcount = data[index1] // number of extra fields
			devfieldsize = 1 + devfieldcount * 3
		}
		index += ofs_fieddefs + fieldcount * 3 + devfieldsize
	}

	function parseDataMessage(recordheader) {
		if (recordheader & bit7) {
			// compressed time stamp
			var timeoffset = recordheader & 0x1f
			var localmessagetype = (recordheader >> 5 ) & 3
			if (timeoffset >= (lasttimestamp[0] & 0x1F)) // offset value is greater than least significant 5 bits of previous timestamp
				var timestamp = lasttimestamp[0] & 0xFFFFFFE0 + timeoffset
			else // offset is less than least significant 5 bits of previous timestamp
				var timestamp = lasttimestamp[0] & 0xFFFFFFE0 + timeoffset + 0x20
		}
		else localmessagetype = recordheader & 0xf
		let datamessagedef = datamessagedefs[localmessagetype]
		if (datamessagedef.messageprofile) var name = datamessagedef.messageprofile.name
		else var name ="undefined"
		let message = {
			fields : {},
			name : name,
			index : messages.length
		}
		messages.push(message)
		let fielddefs = datamessagedef.fielddefs
		let index1 = index + 1
		var buf = new ArrayBuffer(256)
		var bytes = new Uint8Array(buf)
		for (var i=0; i < fielddefs.length; i++ ){
			let basetype = fielddefs[i].basetype 
			let basetypenumber = basetype & 0x1f
			let index2 = index1
			for (var j=0; j < fielddefs[i].size; j++ ) {
				if (datamessagedef.architecture == 0) bytes[j] = data[index1]  // big endian
				else bytes[j] = data[index2 + fielddefs[i].size - j - 1]       // little endian
				index1++
			}
			var value = undefined
			if (basetypenumber == 0)      { value = new Uint8Array(buf)[0] }
			else if (basetypenumber == 1) { value = new Int8Array(buf)[0] }
			else if (basetypenumber == 2) { value = new Uint8Array(buf)[0] }
			else if (basetypenumber == 3) { value = new Int16Array(buf)[0] }
			else if (basetypenumber == 4) { value = new Uint16Array(buf)[0] }
			else if (basetypenumber == 5) { value = new Int32Array(buf)[0] }
			else if (basetypenumber == 6) { value = new Uint32Array(buf)[0] }
			else if (basetypenumber == 7) { value = strFromUTF8Array(bytes)}
			else if (basetypenumber == 8) { value = new Float32Array(buf)[0] }
			else if (basetypenumber == 9) { value = new Float64Array(buf)[0] }
			else if (basetypenumber == 10) { value = new Uint8Array(buf)[0] }
			else if (basetypenumber == 11) { value = new Uint16Array(buf)[0] }
			else if (basetypenumber == 12) { value = new Uint32Array(buf)[0] }
			else if (basetypenumber == 13) { value = new Uint8Array(buf)[0] }

			let profile = fielddefs[i].fieldprofile
			if (profile != null) {
				if (profile.scale != null) value = value / profile.scale - profile.offset
				if (profile.units == 'semicircles') value = value * 180 / const2power31
				let obj = {}
				if (profile.field == 'timestamp') {
					lasttimestamp[0] = value
					value = value + 631065600 // convert to unix time stamp
				}
				obj['value'] = value  
				obj['units'] = profile.units
				message.fields[profile.field] = obj
			}
			else  message.fields['undefined' + i ] = {value:value, units:""}
			if (recordheader & bit7) // compressed time stamp
				obj['compressed_timestamp'] = timestamp + 631065600 // unix time stamp
		}
		index += datamessagedef.messagelen
	}


    index = 0
    let headerlen = data[0]
    let header = parseHeader(data.slice(0,headerlen))
    if (header.fitstring == ".FIT") {
        index += headerlen
        let maxindex = index + header.datasize
        while (index < maxindex) {
            let recordheader = data[index]
            if (recordheader & bit6) {
                // definition message
                parseDefinitionMessage(recordheader)
            }
            else {
                // data message
                parseDataMessage(recordheader)
            }
        }
	}
	//fs.writeFileSync("fit-messages.json",JSON.stringify(messages,"",3))
	return messages
}

function test(){
	
	var start = Date.now()
	var fname = 'Activity.fit'
	var fname = 'garmin-edge-500-activity.fit'
	let data = fs.readFileSync(fname)

	var messages  = parseFitData(data)
	
	var end = Date.now()

	console.log(`processing time ${end-start} ms`)
	fs.writeFileSync("fit-messages.json",JSON.stringify(messages,"",3))
	console.log(messages.length)

	console.log('done')
}

//test()

module.exports = {
	parse : parse
}