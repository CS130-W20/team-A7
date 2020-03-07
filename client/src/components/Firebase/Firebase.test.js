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
  return mocksdk; 
});

describe('Testing Firebase Auth Functions', () => {

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

describe('Testing Firebase RTDB Functions', () => {

  const FirebaseInstance = new Firebase();
  const rootRef = FirebaseInstance.db.ref('/');
  const pushed = jest.fn();
  
  // Creating a listener for push
  rootRef.on('child_added', function (snapshot) {
    pushed(snapshot.val());
  });

  beforeAll(() => {
    // Pushing dummy data
    rootRef.push({
      first: 'Mickey',
    });
  });

  it ('testing read functionality', async () => {
    rootRef.flush();
    expect(pushed).toBeCalledTimes(1);
    expect(pushed).toBeCalledWith({first: 'Mickey'});
  });

  it('testing write functionality', async () => {
    var newUserRef = rootRef.push({first: 'Minnie'});
    rootRef.flush();
    var autoId = newUserRef.key;
    var data = rootRef.getData();
    expect(data[autoId].first).toBe('Minnie');
  });

});
  