# OVH reboot server
reboots all servers in your OVH account on sunday morning at 4am.

## prerequisites
You will need an OVH API key, if you do not have one yet (check the .env file). Follow [this tutorial](https://docs.ovh.com/gb/en/customer/first-steps-with-ovh-api/) for more information. When it comes to get the consumer key, use this code, substituting {{$OVH-APPLICATION}} with your ovh application key.

```
$ curl -XPOST -H"X-Ovh-Application: {{$OVH-APPLICATION}}" -H "Content-type: application/json" \
https://eu.api.ovh.com/1.0/auth/credential  -d '{
    "accessRules": [
        {
            "method": "GET",
            "path": "/vps"
        },
        {
            "method": "POST",
            "path": "/vps/*/reboot"
        }
    ],
    "redirection":"https://www.google.com/"
}'
```

## installation
1. compile the `.env` file, you can copy from `.env.sample` the format and fill in with your own keys.
2. `npm install`
3. `npm start`