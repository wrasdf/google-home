'use strict';

const AWS = require('aws-sdk')
let kms = new AWS.KMS({
  region: 'ap-southeast-2'
})


function kmsDecrypt(encryptData) {
  return new Promise((resolve, reject) => {
    kms.decrypt({
      CiphertextBlob: new Buffer(encryptData, 'base64')
    }, (err, data) => {
      if (err) {
        reject(err)
      } else {
        resolve(data)
      }
    });
  })
}

function getEnvironment() {
  return new Promise((resolve, reject) => {
    const cfg = {
      kms: {
        keys: [],
        promises: []
      },
      env: {}
    }

    for (let params in process.env) {
      if (params.match(/^KMS_/)) {
        cfg.kms.keys.push(params.replace(/^KMS_/, ''))
        cfg.kms.promises.push(kmsDecrypt(process.env[params]))
      } else {
        cfg.env[params] = process.env[params]
      }
    }

    Promise.all(cfg.kms.promises).then((params) => {
      params.map((item, index) => {
        cfg.env[cfg.kms.keys[index]] = item.Plaintext.toString('ascii')
      });
      resolve(cfg.env);
    })
  })
}

module.exports = {
  getEnvironment: getEnvironment
}
