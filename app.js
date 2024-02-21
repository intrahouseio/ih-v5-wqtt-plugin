/**
 * app.js
 */
const util = require('util');
const https = require('https');
const mqtt = require('mqtt');
const staticTypes = require("./v5/formIntegration.json");
const devconstructor = require('./devconstructor.js');

module.exports = async function (plugin) {
    const wqtturl = 'dash.wqtt.ru'
    const token = plugin.params.data.token;
    const types = plugin.types.data;
    const devices = plugin.devices.data;
    let brokerAcc = {};
    let broker = {};
    let client;
    let fullwqttdev = [];
    let devlist = [];
    let intraDevId = [];
    let wqttDevId = [];
    let wqttDevNoId = [];
    let devToPushWqtt = [];

    (async () => {
        try {
            function delay(ms) {
                return new Promise(resolve => setTimeout(resolve, ms));
            }

            async function servicecmd(path, playload, methtype) {
                const senddata = new Promise((resolve) => {
                    let pathstring = '/api' + path
                    const options = {
                        hostname: wqtturl,
                        port: 443,
                        path: pathstring,
                        method: methtype,
                        headers: {
                            'Authorization': 'Token ' + token,
                            'User-Agent': 'intraSystems',
                            'Content-Type': 'application/json'
                        },
                    }
                    const req = https.request(options, (res) => {
                        let bodycmd = ''
                        res.setEncoding('utf8');
                        res.on('readable', function () {
                            let chunk = this.read() || '';
                            bodycmd += chunk
                        });
                        res.on('end', async function () {
                            try {
                                let result = JSON.parse(bodycmd)
                                resolve(result)
                            }
                            catch (e) {
                                plugin.log('Unknown data...')
                            }
                        });
                    });

                    req.on('error', (e) => {
                        plugin.error(`problem with request: ${e.message}`);
                    });
                    req.write(playload)
                    req.end();
                })
                const timeoutEventSend = new Promise((resolve, reject) => { setTimeout(resolve, 500, 'timeout') });
                return Promise.race([senddata, timeoutEventSend]).then((condition) => {
                    if (condition == "timeout") { plugin.exit(66, util.inspect(err)) }
                    else { return condition }
                });
            }
            /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            async function getBrokerParam() {
                plugin.log("Get broker params...")
                brokerAcc = await servicecmd("/broker", "", "GET")
                if (brokerAcc.hasOwnProperty("server")) {
                    plugin.log("MQTT broker params: " + util.inspect(brokerAcc))
                    broker = { host: brokerAcc.server, port: brokerAcc.port_tls, protocol: "mqtts", username: brokerAcc.user, password: brokerAcc.password }
                }
                else {
                    plugin.exit(66, util.inspect(err))
                }
            }
            ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            async function connect(options) {
                plugin.log("Connection to broker...")
                client = mqtt.connect(options);
                client.on("connect", () => {
                    client.publish("conIH", "Connect at: " + new Date());
                })

                client.on('message', (topic, payload) => {
                    msghandler(topic, payload + '')
                })
            }
            ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            function pub(topic, msg) {
                client.publish(topic + '', String(msg));
            }
            ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            function sub(topic) {
                client.subscribe(topic + '', (err) => {
                    if (err) { plugin.log("?unknown topic?") }
                });
            }
            ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            function msghandler(topic, msg) {
                let fragments = topic.split("/")
                let prop = fragments[fragments.length - 1]
                let name = fragments[fragments.length - 2]
                devlist.find((element) => {
                    if (element["Name"] == name) {
                        let pid = element[prop]
                        if (parseInt(msg) >= 0 || parseInt(msg) <= 0) { msg = Number(msg) }
                        plugin.sendCommand({ did: element._id, act: 'set', prop: pid, value: msg })
                    }
                });
                //plugin.log('Received Message:' + name + " : " + prop +" --- "+ msg)
            }
            ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            async function wqttDevIds(servicedata) {
                let devidobj = servicedata.devices
                devidobj.forEach(device => {
                    if (device.hasOwnProperty("serial_number")) {
                        let wqdevobj = {}
                        wqdevobj = { "intraid": device.serial_number, "wqttid": device.id, "name": device.name }
                        wqttDevId.push(wqdevobj)
                    }
                    else {
                        wqttDevNoId.push(device)
                    }
                })
            }
            ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            async function deviceTypeClass(devs) {
                devs.forEach(device => {
                    intraDevId.push(device._id)
                    //let names = device.Name.split(' ▪️ ')
                    if (device.active == 1) {
                        if (device.inherit == 1) {
                            const type = types.find(i => i._id === device.type);
                            if (type) {
                                device = { ...type, active: 1, _id: device._id, Name: device._dn, fullName: device._name, room: device.room }
                            }
                        }
                        else {
                            device["Name"] = device._dn
                            device["fullName"] = device._name
                        }
                        if (device["mqttPrefix"] === undefined || device["mqttPrefix"] == "undefined") {
                            device.mqttPrefix = ""
                        }
                        if (device["mqttPrefix"].length > 0 && device["mqttPrefix"][device["mqttPrefix"].length - 1] != "/") {
                            device.mqttPrefix += "/"
                        }
                        devlist.push(device)
                    }
                })
                plugin.log('List of devices: ' + util.inspect(devlist));
            }

            ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            async function filterProp(devs) {
                let res = { did_prop: [] };
                devs.forEach((dev, pos) => {
                    if (staticTypes.hasOwnProperty(dev.devtype + "_status")) {
                        staticTypes[dev.devtype + "_status"].forEach(capab => {
                            if (dev[capab.prop] != '-' && dev[capab.prop] !== '' && dev[capab.prop] !== undefined) {
                                if (new RegExp('_status').test(capab.prop)) {
                                    res.did_prop.push(dev._id + "." + dev[capab.prop]);
                                }
                            }
                            else {
                                delete devlist[pos][capab.prop]
                            }
                        })
                    }
                })
                return res
            }
            ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            async function substopicspush() {
                fullwqttdev = devconstructor.wqttmodel(devlist)
                fullwqttdev.forEach(comp => {
                    Object.values(comp).forEach(skill => {
                        if (skill[0]) {
                            if (skill[0].hasOwnProperty("topic_cmd")) { sub(skill[0]["topic_cmd"]) }
                        }
                    })
                })
            }
            ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            async function updateCloud() {
                plugin.log("Update device cloud...")
                await servicecmd("/devices/refresh", "", "GET")
            }
            ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            async function devicesAdd() {
                pub("numberDevIH", intraDevId.length);
                plugin.log("Add devices...")
                for (intraid of intraDevId) {
                    const found = !wqttDevId.find((element) => element["intraid"] == intraid);
                    if (found) {
                        let devToPush = devlist.find((dev) => dev["_id"] == intraid)
                        devToPushWqtt.push(devToPush)
                        plugin.log("ADD ID = " + intraid)
                    }
                }
                let pushOnService = devconstructor.wqttmodel(devToPushWqtt)
                for (serviceformat of pushOnService) {
                    servicecmd("/devices", JSON.stringify(serviceformat), "POST")
                    await delay(200);
                }
            }
            ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            async function devicesDel() {
                plugin.log("Delete devices...")
                for (noid of wqttDevNoId) {
                    plugin.log("DEL NOID = " + noid.id)
                    servicecmd("/devices/" + noid.id, '', "DELETE")
                    await delay(200);
                }
                for (wqid of wqttDevId) {
                    if (!intraDevId.includes(wqid["intraid"])) {
                        plugin.log("DEL ID = " + wqid["intraid"])
                        servicecmd("/devices/" + wqid["wqttid"], '', "DELETE")
                        await delay(200);
                    }
                }
            }

            async function AlldevicesDel() {
                for (cloudid of wqttDevId) {
                    plugin.log("DEL ID = " + cloudid["intraid"])
                    servicecmd("/devices/" + cloudid["wqttid"], '', "DELETE")
                    await delay(200);
                }
            }
            ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            await getBrokerParam()
            await connect(broker)
            await deviceTypeClass(devices)
            let subs = await filterProp(devlist)
            let wqttDevData = await servicecmd("/devices", "", "GET")
            await wqttDevIds(wqttDevData)
            await devicesDel()
            await devicesAdd()
            await substopicspush()
            await updateCloud()
            ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            plugin.onSub('devices', subs, data => {
                plugin.log('Update devices data: ' + util.inspect(data));
                data.forEach(dev => {
                    devlist.find((element) => {
                        if (dev.did == element._id) {
                            let pid = Object.keys(element).find(key => {
                                return new RegExp('_status').test(key) && element[key] === dev.prop
                            })
                            let topicpub = element.mqttPrefix + dev.dn + "/" + pid
                            if (dev.value !== undefined) {
                                //plugin.log(topicpub + " >>> " + dev.value)
                                pub(topicpub, dev.value)
                            }
                        }
                    })
                });
            });
            ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            plugin.onCommand(message => {
                //plugin.log('Get command ' + util.inspect(message), 1);
                if (message.param == 'delalldev') {
                    plugin.log("Delete all devices in cloud...")
                    AlldevicesDel()
                }
            });
            ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        } catch (err) {
            plugin.exit(8, util.inspect(err));
        }
    })();
}