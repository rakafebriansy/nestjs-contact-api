# Contact API Spec

## Create Contact

Endpoint: POST /api/contacts

Headers:
- Authorization: token

Request Body:
```json
{
    "first_name": "Raka",
    "last_name": "Febrian",
    "email": "raka@example.com",
    "phone": "081234567890",
}
```

Response Body (Success):
```json
{
    "data": {
        "id": 1,
        "first_name": "Raka",
        "last_name": "Febrian",
        "email": "raka@example.com",
        "phone": "081234567890",
    }
}
```

Response: Body (Failed):
```json
{
    "errors": "The email field is required."
}
```

## Get Contact

Endpoint: GET /api/contacts/:contactId

Headers:
- Authorization: token

Response Body (Success):
```json
{
    "data": {
        "id": 1,
        "first_name": "Raka",
        "last_name": "Febrian",
        "email": "raka@example.com",
        "phone": "081234567890",
    }
}
```

Response: Body (Failed):
```json
{
    "errors": "Invalid token."
}
```

## Update Contact
Endpoint: PUT /api/contacts/:contactId

Headers:
- Authorization: token

Request Body:
```json
{
    "first_name": "Raka",
    "last_name": "Febrian",
    "email": "raka@example.com",
    "phone": "081234567890",
}
```

Response Body (Success):
```json
{
    "data": {
        "id": 1,
        "first_name": "Raka",
        "last_name": "Febrian",
        "email": "raka@example.com",
        "phone": "081234567890",
    }
}
```

Response: Body (Failed):
```json
{
    "errors": "The email field is required."
}
```

## Remove Contact

Endpoint: DELETE /api/contacts/:contactId

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


## Search Contact

Endpoint: GET /api/contacts

Headers:
- Authorization: token

Query Params:
- name: string, contact first name or contact last name, optional
- phone: string, contact phone, optional
- email: string, contact email, optional
- page: number, default 1
- perPage: number, default 10

Response Body (Success):
```json
{
    "data": [
        {
            "id": 1,
            "first_name": "Raka",
            "last_name": "Febrian",
            "email": "raka@example.com",
            "phone": "081234567890",
        },
        {
            "id": 2,
            "first_name": "Cirilla",
            "last_name": "Fiona",
            "email": "ciri@example.com",
            "phone": "08567894321",
        },
    ],
    "paging": {
        "current_page": 1,
        "per_page": 10,
        "total_page": 11,
    }
}
```

Response: Body (Failed):
```json
{
    "errors": "The email field is required."
}
```
