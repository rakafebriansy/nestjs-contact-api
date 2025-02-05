# User API Spec


## Register User
Endpoint: POST /api/users

Request Body:
```json
{
    "username": "raka",
    "password": "1234",
    "name": "Raka Febrian"
}
```

Response Body (Success):
```json
{
    "data": {
        "username": "raka",
        "name": "Raka Febrian"
    }
}
```

Response: Body (Failed):
```json
{
    "errors": "Username is already exists."
}
```

## Login User
Endpoint: POST /api/users/login

Request Body:
```json
{
    "username": "raka",
    "password": "1234",
}
```

Response Body (Success):
```json
{
    "data": {
        "username": "raka",
        "name": "Raka Febrian",
        "token": "session_id_generated"
    }
}
```

Response: Body (Failed):
```json
{
    "errors": "Username or password is wrong."
}
```

## Get User
Endpoint: GET /api/users/current

Headers:
- Authorization: token

Response Body (Success):
```json
{
    "data": {
        "username": "raka",
        "name": "Raka Febrian"
    }
}
```

Response: Body (Failed):
```json
{
    "errors": "Unauthorized."
}
```

## Update User
Endpoint: PATCH /api/users/current

Headers:
- Authorization: token

Request Body:
```json
{
    "password": "1234", // optional, if want to change password
    "name": "Raka Febrian" // optional, if want to change name
}
```

Response Body (Success):
```json
{
    "data": {
        "username": "raka",
        "name": "Raka Febrian"
    }
}
```

Response: Body (Failed):
```json
{
    "errors": "Name field must be at least 6 characters."
}
```

## Logout User
Endpoint: DE:ETE /api/users/current

Headers:
- Authorization: token

Response Body (Success):
```json
{
    "data": true
}
```

Response: Body (Failed):
```json
{
    "errors": "Invalid token."
}
```