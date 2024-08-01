const admin = require("firebase-admin")
require("dotenv").config()

// const service = require("../.firebase/service-account.json")
const service = JSON.parse(
    Buffer.from(process.env.GOOGLE_SERVICE_KEY, 'base64').toString()
)

admin.initializeApp({
    credential: admin.credential.cert({
        projectId: service.project_id,
        clientEmail: service.client_email,
        privateKey: service.private_key
    })
})

const db = admin.firestore()

module.exports = db