# OVH reboot VPS
reboots all servers in your OVH account on sunday morning at 4am.

## prerequisites
You will need an OVH API key, if you do not have one yet (check the .env file). Follow [this tutorial](https://docs.ovh.com/gb/en/customer/first-steps-with-ovh-api/) for more information. When it comes to get the consumer key, use the following code, substituting `{{$OVH-APPLICATION}}` with your ovh application key.

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
This will print on your termina a JSON object with the consumer key (save it) and a link. Click the link that will open a page in your browser. Login and remember to set the validity of the key to *unlimited*. If all went well, you have been redirected to google.

## Installation
1. Fill in the `.env` file with your OVH keys. You can copy from `.env.sample` the format.
2. `npm install`
3. `npm start`