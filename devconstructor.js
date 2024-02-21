//const util = require('util');

try {

    function typeLamp(d, topic) {
        let lampCapab = {}
        if (d.hasOwnProperty("state") || d.hasOwnProperty("state_status")) {
            lampCapab["on_off"] = [
                {
                    "topic_cmd": d.state !== undefined ? `${topic}state` : "",
                    "topic_state": d.state_status !== undefined ? `${topic}state_status` : "",
                    "cmd_on": "1",
                    "cmd_off": "0"
                }
            ]
        }
        if (d.hasOwnProperty("bright") || d.hasOwnProperty("bright_status")) {
            lampCapab["range"] = [
                {
                    "type": 0,
                    "topic_cmd": d.bright !== undefined ? `${topic}bright` : "",
                    "topic_state": d.bright_status !== undefined ? `${topic}bright_status` : "",
                    "max": 100,
                    "min": 0,
                    "precision": 1,
                    "multiplier": 1
                }
            ]
        }
        if (d.hasOwnProperty("rgb") || d.hasOwnProperty("rgb_status")) {
            lampCapab["color"] = [
                {
                    "type": 0,
                    "topic_cmd": d.rgb !== undefined ? `${topic}rgb` : "",
                    "topic_state": d.rgb_status !== undefined ? `${topic}rgb_status` : ""
                }
            ]
        }
        if (d.hasOwnProperty("collorTemp") || d.hasOwnProperty("collorTemp_status")) {
            lampCapab["color"] = [
                {
                    "type": 3,
                    "topic_cmd": d.collorTemp !== undefined ? `${topic}collorTemp` : "",
                    "topic_state": d.collorTemp_status !== undefined ? `${topic}collorTemp_status` : ""
                }
            ]
        }
        return lampCapab
    }

    function typeSocket(d, topic) {
        let socketCapab = {}
        if (d.hasOwnProperty("state") || d.hasOwnProperty("state_status")) {
            socketCapab["on_off"] = [
                {
                    "topic_cmd": d.state !== undefined ? `${topic}state` : "",
                    "topic_state": d.state_status !== undefined ? `${topic}state_status` : "",
                    "cmd_on": "1",
                    "cmd_off": "0"
                }
            ]
        }
        return socketCapab
    }


    function typeTermoregulator(d, topic) {
        let termoregulatorCapab = {}
        if (d.hasOwnProperty("state") || d.hasOwnProperty("state_status")) {
            termoregulatorCapab["on_off"] = [
                {
                    "topic_cmd": d.state !== undefined ? `${topic}state` : "",
                    "topic_state": d.state_status !== undefined ? `${topic}state_status` : "",
                    "cmd_on": "1",
                    "cmd_off": "0"
                }
            ]
        }
        if (d.hasOwnProperty("temp_status")) {
            termoregulatorCapab["sensors_float"] = [
                {
                    "type": 0,
                    "topic": topic + "temp_status",
                }
            ]
        }
        if (d.hasOwnProperty("setpoint") || d.hasOwnProperty("setpoint_status")) {
            termoregulatorCapab["range"] = [
                {
                    "type": 4,
                    "topic_cmd": d.setpoint !== undefined ? `${topic}setpoint` : "",
                    "topic_state": d.setpoint_status !== undefined ? `${topic}setpoint_status` : "",
                    "max": 50,
                    "min": 10,
                    "precision": 1,
                    "multiplier": 1
                }
            ]
        }
        if (d.hasOwnProperty("fanspeed") || d.hasOwnProperty("fanspeed_status")) {
            termoregulatorCapab["mode"] = [
                {
                    "type": 3,
                    "topic_cmd": d.fanspeed !== undefined ? `${topic}fanspeed` : "",
                    "topic_state": d.fanspeed_status !== undefined ? `${topic}fanspeed_status` : "",
                    "options": "auto=1,low=2,medium=3,high=4"
                }
            ]
        }
        if (d.hasOwnProperty("mode") || d.hasOwnProperty("mode_status")) {
            termoregulatorCapab["mode"] = [
                {
                    "type": 9,
                    "topic_cmd": d.fanspeed !== undefined ? `${topic}mode` : "",
                    "topic_state": d.fanspeed_status !== undefined ? `${topic}mode_status` : "",
                    "options": "auto=1,cool=2,heat=3,fan_only=4,dry=5"
                }
            ]
        }
        return termoregulatorCapab
    }
    function typeAirCond(d, topic) {
        let airCondCapab = {}
        if (d.hasOwnProperty("state") || d.hasOwnProperty("state_status")) {
            airCondCapab["on_off"] = [
                {
                    "topic_cmd": d.state !== undefined ? `${topic}state` : "",
                    "topic_state": d.state_status !== undefined ? `${topic}state_status` : "",
                    "cmd_on": "1",
                    "cmd_off": "0"
                }
            ]
        }
        if (d.hasOwnProperty("temp_status")) {
            airCondCapab["sensors_float"] = [
                {
                    "type": 0,
                    "topic": topic + "temp_status",
                }
            ]
        }
        if (d.hasOwnProperty("setpoint") || d.hasOwnProperty("setpoint_status")) {
            airCondCapab["range"] = [
                {
                    "type": 4,
                    "topic_cmd": d.setpoint !== undefined ? `${topic}setpoint` : "",
                    "topic_state": d.setpoint_status !== undefined ? `${topic}setpoint_status` : "",
                    "max": 30,
                    "min": 18,
                    "precision": 1,
                    "multiplier": 1
                }
            ]
        }
        if (d.hasOwnProperty("fanspeed") || d.hasOwnProperty("fanspeed_status")) {
            airCondCapab["mode"] = [
                {
                    "type": 3,
                    "topic_cmd": d.fanspeed !== undefined ? `${topic}fanspeed` : "",
                    "topic_state": d.fanspeed_status !== undefined ? `${topic}fanspeed_status` : "",
                    "options": "auto=1,low=2,medium=3,high=4"
                }
            ]
        }
        if (d.hasOwnProperty("mode") || d.hasOwnProperty("mode_status")) {
            airCondCapab["mode"] = [
                {
                    "type": 6,
                    "topic_cmd": d.mode !== undefined ? `${topic}mode` : "",
                    "topic_state": d.mode_status !== undefined ? `${topic}mode_status` : "",
                    "options": "auto=1,cool=2,heat=3,fan_only=4,dry=5"
                }
            ]
        }
        if (d.hasOwnProperty("swing") || d.hasOwnProperty("swing_status")) {
            airCondCapab["mode"] = [
                {
                    "type": 6,
                    "topic_cmd": d.mode !== undefined ? `${topic}swing` : "",
                    "topic_state": d.mode_status !== undefined ? `${topic}swing_status` : "",
                    "options": "auto=1,horizontal=2,stationary=3,vertical=4"
                }
            ]
        }
        return airCondCapab
    }

    function typeDoorGate(d, topic) {
        let doorGateCapab = {}
        if (d.hasOwnProperty("state") || d.hasOwnProperty("state_status")) {
            doorGateCapab["on_off"] = [
                {
                    "topic_cmd": d.state !== undefined ? `${topic}state` : "",
                    "topic_state": d.state_status !== undefined ? `${topic}state_status` : "",
                    "cmd_on": "1",
                    "cmd_off": "0"
                }
            ]
        }
        return doorGateCapab
    }

    function typeCurtain(d, topic) {
        let curtainCapab = {}
        if (d.hasOwnProperty("state") || d.hasOwnProperty("state_status")) {
            curtainCapab["on_off"] = [
                {
                    "topic_cmd": d.state !== undefined ? `${topic}state` : "",
                    "topic_state": d.state_status !== undefined ? `${topic}state_status` : "",
                    "cmd_on": "1",
                    "cmd_off": "0"
                }
            ]
        }
        if (d.hasOwnProperty("position") || d.hasOwnProperty("position_status")) {
            curtainCapab["range"] = [
                {
                    "type": 3,
                    "topic_cmd": d.position !== undefined ? `${topic}position` : "",
                    "topic_state": d.position_status !== undefined ? `${topic}position_status` : "",
                    "max": 100,
                    "min": 0,
                    "precision": 1,
                    "multiplier": 1
                }
            ]
        }
        return curtainCapab
    }

    function typeMedia(d, topic) {
        let mediaCapab = {}
        if (d.hasOwnProperty("state") || d.hasOwnProperty("state_status")) {
            mediaCapab["on_off"] = [
                {
                    "topic_cmd": d.state !== undefined ? `${topic}state` : "",
                    "topic_state": d.state_status !== undefined ? `${topic}state_status` : "",
                    "cmd_on": "1",
                    "cmd_off": "0"
                }
            ]
        }
        if (d.hasOwnProperty("volume") || d.hasOwnProperty("volume_status")) {
            mediaCapab["range"] = [
                {
                    "type": 5,
                    "topic_cmd": d.volume !== undefined ? `${topic}volume` : "",
                    "topic_state": d.volume_status !== undefined ? `${topic}volume_status` : "",
                    "max": 100,
                    "min": 0,
                    "precision": 1,
                    "multiplier": 1
                }
            ]
        }
        if (d.hasOwnProperty("mute") || d.hasOwnProperty("mute_status")) {
            mediaCapab["toggle"] = [
                {
                    "type": 4,
                    "topic_cmd": d.mute !== undefined ? `${topic}mute` : "",
                    "topic_state": d.mute_status !== undefined ? `${topic}mute_status` : "",
                    "cmd_on": "1",
                    "cmd_off": "0"
                }
            ]
        }
        return mediaCapab
    }

    function typeSensorValue(d, topic) {
        let sensorvalueCapab = {}
        if (d.hasOwnProperty("value_status")) {
            sensorvalueCapab["sensors_float"] = [
                {
                    "type": d.metricunit,
                    "topic": topic + "value_status",
                    "multiplier": 1
                }
            ]
        }
        return sensorvalueCapab
    }

    function typeSensorEvent(d, topic) {
        let sensoreventCapab = {}
        if (d.hasOwnProperty("event_status")) {
            sensoreventCapab["sensors_event"] = [
                {
                    "type": d.eventunit,
                    "topic": topic + "event_status"
                }
            ]
        }
        return sensoreventCapab
    }




    function wqttmodel(intraDevs) {
        const alldata = []
        const wqttDevDefault = {
            serial_number: "",
            name: "",
            type: 0,
            retain_flag: false,
            wait_execute: false,
            room: ""
        }

        intraDevs.forEach(idev => {
            let wqttDev = {}
            let capab = {}
            let mqttPath = idev.mqttPrefix + idev.Name + "/"

            if (idev.devtype == "Lamp") { capab = typeLamp(idev, mqttPath) }
            if (idev.devtype == "Socket") { capab = typeSocket(idev, mqttPath) }
            if (idev.devtype == "Termoregulator") { capab = typeTermoregulator(idev, mqttPath) }
            if (idev.devtype == "AirCond") { capab = typeAirCond(idev, mqttPath) }
            if (idev.devtype == "DoorGate") { capab = typeDoorGate(idev, mqttPath) }
            if (idev.devtype == "Curtain") { capab = typeCurtain(idev, mqttPath) }
            if (idev.devtype == "Media") { capab = typeMedia(idev, mqttPath) }
            if (idev.devtype == "SensorValue") { capab = typeSensorValue(idev, mqttPath) }
            if (idev.devtype == "SensorEvent") { capab = typeSensorEvent(idev, mqttPath) }


            Object.assign(wqttDev, wqttDevDefault, capab)

            wqttDev.serial_number = idev._id || ""
            wqttDev.name = idev.fullName || ""
            wqttDev.type = idev.alicetype || 0
            wqttDev.room = idev.room || ""

            alldata.push(wqttDev)
            //console.log(util.inspect(wqttDev))
        })
        return alldata
    }

} catch (err) {
    console.log("Constructor error...");
}


module.exports.wqttmodel = wqttmodel;
