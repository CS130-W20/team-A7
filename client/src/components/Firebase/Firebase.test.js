import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import Firebase from './firebase';

Enzyme.configure({ adapter: new Adapter() })

// Now mock 'firebase/app`:
jest.mock('firebase/app', () => {
  const firebasemock = require('firebase-mock');
  const mockauth = new firebasemock.MockAuthentication();
  const mockdatabase = new firebasemock.MockFirebase();
  const mocksdk = new firebasemock.MockFirebaseSdk(
    (path) => {
      return path ? mockdatabase.child(path) : mockdatabase;
    },
    () => mockauth, 
    null,
  );
  // console.log(mocksdk.auth().flush());
  return mocksdk; 
});

describe('Testing Firebase Auth Functions', () => {
  beforeAll(() => {
    // Add some data to your mock firebase if you need to...
    // firebase.firestore().collection('collectionId').doc('docId').set({foo: 'bar'});
  });
  
  it ('testing create user functionality', async () => {
    const FirebaseInstance = new Firebase();

    FirebaseInstance.doCreateUserWithEmailAndPassword('mickeymouse@disney.com', '.waltdisneyrocks');
    FirebaseInstance.auth.flush();
    
    return FirebaseInstance.auth.getUserByEmail('mickeymouse@disney.com').then(function(user) {
      expect(user.email).toBe('mickeymouse@disney.com');
      expect(user.password).toBe('.waltdisneyrocks');
    });
  });

});