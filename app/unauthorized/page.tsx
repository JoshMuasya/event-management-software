import React from 'react'

const page = () => {
    const crypto = require('crypto');
    console.log(crypto.randomBytes(32).toString('base64'));
  return (
    <div>
      Unauthorized
    </div>
  )
}

export default page
