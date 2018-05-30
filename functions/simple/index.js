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
exports.handle = function (e, ctx, cb) {
  console.log('processing event: %j', e.Records[0])
  console.log('processing message: %j', e.Records[0].Sns.Message)
  var payload = JSON.parse(e.Records[0].Sns.Message)
  console.log('payload', payload)
  if (validate(payload)) {
    console.log('should be valid')
  } else {
    console.log('oh no, invalid')
    console.log(validate.errors)
  }

  cb(null)
}
