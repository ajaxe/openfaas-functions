# Traefik Forward Authentication Function

**NOTE:**
> Just a sample of possible use.
> Since Open FaaS only responds with HTTP 200 or 500 this method of forwarding authentication is not flexible enough to support basic auth challenge or presenting a custom login page.

Traefik forwards authentication to this function. This function verifies the *Authorization* header and returns `200` on success otherwise `500`.

Current design of openfaas `watchdog` only returns http 200 or 500 based exit code of the process. Thats why we are using `HTTP 500` in place of `HTTP 401`. New version of watchdog component i.e. [of-watchdog](https://github.com/openfaas-incubator/of-watchdog) supports http response codes.

```
Note: this version of function is useful if the Authorization token is obtained using another method as it only verifies the authorization header value.
```