const { join, extname } = require('path')
const { existsSync } = require('fs')

const notfound = require('./404')
const fatal = require('./500')

/** passthru waterfall */
exports.handler = async function http(req) {
  try {
    // requested entry module
    let key = req.pathParameters.module
    let scope = req.pathParameters.scope
    let ext = extname(key).replace('.', '')

    // ensure css or js
    let allowed = ['js', 'css']
    if (allowed.includes(ext) === false)
      throw ReferenceError(`illegal extension: "${ ext }"; only js and css allowed`)

    // look for the file in src/views
    let type = ext == 'js'? 'javascript' : 'css'
    let pathToFile = join(__dirname, 'node_modules', '@architect', 'views', ext, scope, key)

    // blow up if missing
    if (existsSync(pathToFile) === false)
      return notfound({ type, scope, key })

    // otherwise respond with the requested file 
    return {
      statusCode: 200,
      headers: { 'content-type': `text/${ type }; charset=utf8` },
      body: fs.readFileSync(pathToFile).toString()
    }
  }
  catch(err) {
    return fatal({ type, err })
  }
}