import Rebase from 're-base'
import firebase from 'firebase'

const config = {
  apiKey: 'AIzaSyDm0RsJqozMBklXptkZjC32cxO2DvkXAR8',
  authDomain: 'bora-ajudar-ac832.firebaseapp.com',
  databaseURL: 'https://bora-ajudar-ac832.firebaseio.com',
  projectId: 'bora-ajudar-ac832',
  storageBucket: 'bora-ajudar-ac832.appspot.com',
  messagingSenderId: '962283073754'
}
const app = firebase.initializeApp(config)
const base = Rebase.createClass(app.database())
export const auth = firebase.auth()
export default base
