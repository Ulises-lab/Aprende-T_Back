### Aprende-T ####

#### Signup

``curl -X POST https://aprende-t-back.herokuapp.com/api/auth/signup -H 'Content-Type: application/json' -d '{"username":"Usuario1","lastname":"Test","password":"Prueba123","email":"user1@gmail.com"}'``

#### Login

``curl -X POST https://aprende-t-back.herokuapp.com/api/auth/login -H 'Content-Type: application/json' -d '{"email":"user1@gmail.com","password":"Prueba123"}'``

#### Logout

``curl -X DELETE https://aprende-t-back.herokuapp.com/api/auth/logout -H "Authorization:<AccessToken>"``

#### Session
  
``curl -X GET -H "Authorization:<AccessToken>" https://aprende-t-back.herokuapp.com/api/auth/session``
