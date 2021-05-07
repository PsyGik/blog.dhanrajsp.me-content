// start-snippet{installFirebase}
npm install -g firebase-tools
// end-snippet{installFirebase}

// start-snippet{firebaseLogin}
firebase login
// end-snippet{firebaseLogin}

// start-snippet{firebaseList}
firebase list
// end-snippet{firebaseList}

// start-snippet{createDir}
mkdir contact-form-api && cd contact-form-api
// end-snippet{createDir}

// start-snippet{firebaseInit}
firebase init
// end-snippet{firebaseInit}

// start-snippet{npmInstallGAPI}
npm install express googleapis
// end-snippet{npmInstallGAPI}

// start-snippet{npmRunServe}
npm run serve
// end-snippet{npmRunServe}

// start-snippet{curlPing}
curl http://localhost:5000/contact-form-api/us-central1/api/ping
// end-snippet{curlPing}

// start-snippet{curlPost}
curl -X POST \
    http://localhost:5000/contact-form-api/us-central1/api/contact \
    -H 'Content-Type: application/json' \
    -d '{
    "name": "John Doe",
    "email": "john@doe.me",
    "message": "Hey There!"
}'
// end-snippet{curlPost}

// start-snippet{firebaseDeploy}
npm run deploy
// end-snippet{firebaseDeploy}