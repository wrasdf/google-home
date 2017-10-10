'use strict';

const utils = require('./utils')

const success_monitor_id = "2115288";
const failing_monitor_id = "2765304";

function echo(event, context, callback) {

  utils.getEnvironment().then(({API_KEY, APPLICATION_KEY}) => {

    console.log(JSON.stringify(event.body))

    let application = event.body.originalRequest.data.inputs[0].arguments[0].textValue
    let monitor_id = (application === "essentials") ? success_monitor_id : failing_monitor_id

    return request('https://myobpayglobal.datadoghq.com/api/v1/monitor/' + monitor_id + '?api_key=' + API_KEY + '&application_key=' + APPLICATION_KEY)
    .then((obj) => {
      let speech = "The "+application+" servers have a status of:"+ JSON.parse(obj).overall_state + "!!"
      const response = {
        statusCode: 200,
        body: JSON.stringify({
          speech: speech,
          displayText: speech,
          source: 'datadog-health-echo'
        })
      };
      callback(null, response);
    })

  }).catch((err) => {

    callback(null, {
      statusCode: 200,
      body: JSON.stringify({
        speech: err,
        displayText: err,
        source: 'datadog-health-echo'
      })
    });

  })

}

module.exports = {
  echo: echo
}
