const admin = require("firebase-admin")
const service = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)

admin.initializeApp({
    credential: admin.credential.cert(service)
})

const db = admin.firestore()

module.exports = db