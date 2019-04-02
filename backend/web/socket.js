const path = require('path');
const userControl = require('../controller/userControl');
const userModel = require('../model/user')
const CONSTANTS = require('./../config/contants');
const messageHandler = require('../model/chat_msg')
const triviaModel = require('../model/trivia')
var cron = require('node-cron');

class Socket {

	constructor(socket) {
		this.io = socket;
	}
	socketEvents() {		
		var _joinedUserIdArr = new Array()
		var userGettingTriviaIdArr = new Array()
		var userResultIdArr = new Array()
		var _userResultList = new Array()
		console.log(">>>>>>>")
		this.io.on('connection',async (socket) => {

			let q = new Promise((resolve, reject) => {
				triviaModel.getTriviaCount((err, idArr) => {
					if (err) { throw err }
					else {
						resolve(idArr)
					}
				})
			})
	
			var r = await q

			console.log(socket.request._query['userId'] + " Socket Connected");

			socket.on('user-joined',(data) => {
				_joinedUserIdArr.push(data.userId)
				if (_joinedUserIdArr.length != 0) {
					_joinedUserIdArr = removeDups(_joinedUserIdArr)
				}
				console.log("joined user: " + _joinedUserIdArr.toString())
			})
			
			socket.on('get-trivia', async (data) => {
				userGettingTriviaIdArr.push(data)
				if (userGettingTriviaIdArr.length != 0) {
					userGettingTriviaIdArr = removeDups(userGettingTriviaIdArr)
				}				
				if (_joinedUserIdArr.length === userGettingTriviaIdArr.length) {
					console.log("user getting trivia : " + userGettingTriviaIdArr.toString())
					// if (userGettingTriviaIdArr[_joinedUserIdArr.length] == data) {
					var item = r[Math.floor(Math.random() * r.length)];
					let p = new Promise((resolve, reject) => {
						triviaModel.findtrivia(item.id, (err, trivia) => {
							if (err) {
								reject(err)
							} else {
								resolve(trivia)
							}
						})
					})
					let jsonObj = await p
					if (jsonObj.length != 0) {
						this.io.sockets.emit('send-trivia', {
							error: false,
							question: jsonObj[0].question,
							answerArr: jsonObj[0].answerArr,
							category: jsonObj[0].category,
							message: 'Game Started!'
						})
						userGettingTriviaIdArr = new Array()
					}

					// }
				}
			})

			socket.on('send-trivia-result', async (data) => {
				try {
					let temp2 = new Promise((resolve, reject) => {
						userModel.addingPoints(
							data.userId,
							data.todayScore,
							data.thisWeekScore,
							data.thisMonthScore,
							data.thisYearScore,
							data.date
							, (err) => {
								var nonError = false
								if (err) {
									nonError = true
									reject(err)
								} else {
									nonError = false
								}
								resolve(nonError)
							})
					})
					let a = await temp2
					if (a) {
						this.io.sockets.emit(`trivia-result-response`, {
							error: true,
							message: CONSTANTS.SERVER_ERROR_MESSAGE,
							winner: ''
						});
					} else {
						
						let temp1 = await Promise.resolve(
							userControl.getUserInfo({
								userId: data.userId,
								socketId: false
							}),
						)
						temp1.result = data.result
						_userResultList.push(temp1)
						userResultIdArr.push(data.userId)
						if (userResultIdArr.length != 0) {
							userResultIdArr = removeDups(userResultIdArr)
						}

						if (_joinedUserIdArr.length === userResultIdArr.length) {
							console.log("user result: " + userResultIdArr.toString())
							this.io.sockets.emit(`trivia-result-response`, {
								error: false,
								winner: _userResultList,
							});
							_userResultList = new Array()
							userResultIdArr = new Array()
						}
						
					}
				} catch (err) {
					this.io.sockets.emit(`trivia-result-response`, {
						error: true,
						message: CONSTANTS.SERVER_ERROR_MESSAGE,
						winnerlist: []
					});
				}
			})

			/* Get the user's Chat list	*/
			socket.on(`chat-list`, async (data) => {
				if (data.userId == '') {
					this.io.emit(`chat-list-response`, {
						error: true,
						message: CONSTANTS.USER_NOT_FOUND
					});
				} else {
					try {
						const [UserInfoResponse, temp] = await Promise.all([
							userControl.getUserInfo({
								userId: data.userId,
								socketId: false
							}),
							userControl.getChatList()
						]);
						let chatlistResponse = new Array()
						for (let list of temp) {
							chatlistResponse.push(JSON.parse(list))
						}
						this.io.sockets.emit(`chat-list-response`, {
							error: false,
							singleUser: false,
							chatList: chatlistResponse
						});
						this.io.to(socket.id).emit(`chat-list-response`, {
							error: false,
							singleUser: true,
							userInfo: UserInfoResponse
						});
					} catch (error) {
						this.io.to(socket.id).emit(`chat-list-response`, {
							error: true,
							chatList: []
						});
					}
				}
			});

			socket.on('users-list', async (data) => {
				let temp1 = await Promise.resolve(
					userControl.getChatList()
				)
				let userslistResponse = new Array()
				for (let list of temp1) {
					userslistResponse.push(JSON.parse(list))
				}
				this.io.sockets.emit(`users-list-response`, {
					error: false,
					singleUser: true,
					chatList: userslistResponse
				});
			})

			/**
			* send the messages to the user
			*/
			socket.on(`add-message`, async (data) => {

				if (data.message === '') {
					this.io.to(socket.id).emit(`add-message-response`, {
						error: true,
						message: CONSTANTS.MESSAGE_NOT_FOUND
					});
				} else if (data.fromUserId === '') {
					this.io.to(socket.id).emit(`add-message-response`, {
						error: true,
						message: CONSTANTS.SERVER_ERROR_MESSAGE
					});
				} else {
					try {
						const q = new Promise((resolve, reject) => {
							messageHandler.insertMessage(data, async (err, newMsg) => {
								if (err) reject(err)
								else {
									resolve(newMsg)
								}
							})
						});
						let tempUserID = await q
						console.log(tempUserID)
						let p = await Promise.resolve(userControl.getUserInfo({
							userId: tempUserID.userID,
							socketId: false
						}))
						const messageResult = extend(tempUserID, p)
						this.io.sockets.emit(`add-message-response`, messageResult);
					} catch (error) {
						this.io.to(socket.id).emit(`add-message-response`, {
							error: true,
							message: CONSTANTS.MESSAGE_STORE_ERROR
						});
					}
				}
			});

			/**
			* Logout the user
			*/
			socket.on('logout', (data) => {
				console.log(data)
				try {
					const userId = data.userId;
					userControl.logout(userId);
					this.io.to(socket.id).emit(`logout-response`, {
						error: false,
						message: CONSTANTS.USER_LOGGED_OUT,
						id: userId
					});
					socket.broadcast.emit(`chat-list-response`, {
						error: false,
						userDisconnected: true,
						id: userId
					});
				} catch (error) {
					this.io.to(socket.id).emit(`logout-response`, {
						error: true,
						message: CONSTANTS.SERVER_ERROR_MESSAGE
					});
				}
			});
			socket.on('error', function (e) {
				console.log(e);
			});
			/**
			* sending the disconnected user to all socket users. 
			*/
			socket.on('disconnect', async () => {
				_joinedUserIdArr=removeA(_joinedUserIdArr, socket.request._query['userId'])
				userGettingTriviaIdArr = removeA(userGettingTriviaIdArr, socket.request._query['userId'])
				userResultIdArr = removeA(userResultIdArr,socket.request._query['userId'])
				console.log("No." + socket.request._query['userId'] + " disconnected");
				console.log("existed: "+_joinedUserIdArr)
				userControl.logout(socket.request._query['userId']);
				socket.broadcast.emit(`chat-list-response`, {
					error: false,
					userDisconnected: true,
					id: socket.request._query['userId']
				});
			});
		});
	}

	socketConfig() {
		this.io.use(async (socket, next) => {
			try {
				if (socket.request._query['userId'] != "admin") {
					await userControl.addSocketId({
						userId: socket.request._query['userId'],
						socketId: socket.id
					});
				}
				next();
			} catch (error) {
				console.error(error);
			}
		});
		this.socketEvents();
	}
}

function removeDups(names) {
	let unique = {};
	names.forEach(function (i) {
		if (!unique[i]) {
			unique[i] = true;
		}
	});
	return Object.keys(unique);
}

function removeA(arr, item) {
	var index = arr.indexOf(item);
	if (index !== -1) arr.splice(index, 1);
	return arr;
}

function extend(obj, src) {
	Object.keys(src).forEach(function (key) { obj[key] = src[key]; });
	return obj;
}

module.exports = Socket;