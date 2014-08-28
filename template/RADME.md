## Install

After run `hero init`, you shoud run `npm install` to install depencencies:

```
npm install
```

## Notes

- You must manually specify the `format` of a property, such as the `email` property of `User` json schema:

```
{
    "$schema": "http://json-schema.org/draft-04/schema#",
    "title": "User",
    "description": "User",
    "type": "object",
    "properties": {
        "id": {
            "type": "integer",
            "minimum": 0,
            "exclusiveMinimum": false
        },
        "name": {
            "type": "string"
        },
        "email": {
            "type": "string",
            "format": "email"
        }
    },
    "required": [
        "id",
        "name",
        "email"
    ]
}
```