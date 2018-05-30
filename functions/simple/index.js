var validator = require('is-my-json-valid')
var validate = validator({
  required: true,
  type: 'object',
  properties: {
    notification_id: { required: true, type: 'string' },
    created_datetime: { required: true, type: 'string' },
    unit_id: { required: true, type: 'string' },
    case_id: { required: true, type: 'string' },
    user_id: { required: true, type: 'string' },
    update_what: { required: true, type: 'string' }
  }
})

const AWS = require('aws-sdk')
const ssm = new AWS.SSM()

const getParam = async name => {
  const data = await ssm
    .getParameter({
      Name: name,
      WithDecryption: true
    })
    .promise()

  return data.Parameter.Value
}

console.log('Starting up')

exports.handle = async function (e, ctx, cb) {
  const payload = JSON.parse(e.Records[0].Sns.Message)
  if (validate(payload)) {
    const MongoClient = require('mongodb').MongoClient

    // Connection URL

    const pass = await getParam('MONGO_PASSWORD')
    const connect = await getParam('MONGO_CONNECT')
    const url = `mongodb://root:${pass}@${connect}`

    // Use connect method to connect to the server
    MongoClient.connect(url, function (err, client) {
      if (err != null) {
        cb(err)
      }
      console.log('Connected successfully to server')

      const db = client.db('meteor')

      payload.created_datetime = new Date(payload.created_datetime + ' UTC')

      db.collection('CaseNotifications').insertOne(payload, function (err, r) {
        client.close()
        cb(err)
      })
    })
  } else {
    console.log('oh no, invalid')
    console.log(validate.errors)
  }

  console.log('All done')
  cb(null)
}
