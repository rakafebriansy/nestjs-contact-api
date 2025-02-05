# Address API Spec

## Create Address

Endpoint: POST /api/contacts/:contactId/addresses

Headers:
- Authorization: token

Request Body:
```json
{
    "street": "Jalan Mastrip", // optional, if want to add street desc
    "city": "Jember", // optional, if want to add city desc
    "province": "Jawa Timur", // optional, if want to add province desc
    "country": "Indonesia",
    "postal_code": "69212"
}
```

Response Body (Success):
```json
{
    "data": {
        "id": 1,
        "street": "Jalan Mastrip",
        "city": "Jember",
        "province": "Jawa Timur",
        "country": "Indonesia",
        "postal_code": "69212"
    }
}
```

Response Body (Failed):
```json
{
    "errors": "The country field is required."
}
```

## Get Address

Endpoint: GET /api/contacts/:contactId/addresses/:addressId

Headers:
- Authorization: token

Response Body (Success):
```json
{
    "data": {
        "id": 1,
        "street": "Jalan Mastrip",
        "city": "Jember",
        "province": "Jawa Timur",
        "country": "Indonesia",
        "postal_code": "69212"
    }
}
```

Response Body (Failed):
```json
{
    "errors": "Invalid token."
}
```

## Update Address

Endpoint: PUT /api/contacts/:contactId/addresses/:addressId

Headers:
- Authorization: token

Request Body:
```json
{
    "street": "Jalan Mastrip",
    "city": "Jember",
    "province": "Jawa Timur",
    "country": "Indonesia",
    "postal_code": "69212"
}
```

Response Body (Success):
```json
{
    "data": {
        "id": 1,
        "street": "Jalan Mastrip",
        "city": "Jember",
        "province": "Jawa Timur",
        "country": "Indonesia",
        "postal_code": "69212"
    }
}
```

Response Body (Failed):
```json
{
    "errors": "The country field is required."
}
```

## Remove Address

Endpoint: DELETE /api/contacts/:contactId/addresses/:addressId

Headers:
- Authorization: token

Response Body (Success):
```json
{
    "data": true
}
```

Response Body (Failed):
```json
{
    "errors": "Invalid token."
}
```


## List Addresses

Endpoint: GET /api/contacts/:contactId/addresses

Headers:
- Authorization: token

Response Body (Success):
```json
{
    "data": [
        {
            "id": 1,
            "street": "Jalan Mastrip",
            "city": "Jember",
            "province": "Jawa Timur",
            "country": "Indonesia",
            "postal_code": "69212"
        },
        {
            "id": 2,
            "street": "Jalan Ampera Raya",
            "city": "South Jakarta",
            "province": "DKI Jakarta",
            "country": "Indonesia",
            "postal_code": "68912"
        },
    ]
}
```

Response Body (Failed):
```json
{
    "errors": "Invalid token."
}
```
