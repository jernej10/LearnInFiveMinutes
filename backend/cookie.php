<?php

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;

class Cookie
{
    public function deleteCookie(Response $response, $key)
    {
        $cookie = urlencode($key).'='.
            urlencode('deleted').'; expires=Thu, 01-Jan-1970 00:00:01 GMT; Max-Age=0; path=/; secure; httponly';
        $response = $response->withAddedHeader('Set-Cookie', $cookie);
        return $response;
    }

    public function addCookie(Response $response, $cookieName, $cookieValue)
    {
        $cookie = urlencode($cookieName).'='.
            urlencode($cookieValue).'; path=/; Samesite=none; secure;';
        $response = $response->withAddedHeader('Set-Cookie', $cookie);
        return $response;
    }

    public function getCookieValue(Request $request, $cookieName)
    {
        $cookies = $request->getCookieParams();
        return isset($cookies[$cookieName]) ? $cookies[$cookieName] : null;
    }

}
?>