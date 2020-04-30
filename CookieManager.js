/*   Cookie Manager Addon for any Website
 *   Copyright (C) by Interarts Media UG (haftungsbeschränkt) - 2020
 *   Web:        www.interarts-media.de
 *   Author:     Harry Neufeld
 *   Date:       30.04.2020
 *   Version:    0.0.1
 *   Revision:   0
 */

// Some crappy js classes - let's do it quick'n'dirty - sorry, i just hate js
class CookieManager
{
    get GetCookie(name = undefined, value = undefined)
    {
        var cookies, c;
        cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++)
        {
            c = cookies[i].split('=');
            if ((name != undefined && c[0] == name) || (value != undefined && c[1] == value))
            {
                return new Cookie(c[0], c[1]);
            }

        }
        return undefined;
    }

    CookiesEnabled()
    {
        let cookieEnabled = (navigator.cookieEnabled) ? true : false;

        if (typeof navigator.cookieEnabled == "undefined" && !cookieEnabled)
        {
            document.cookie = "testcookie";
            cookieEnabled = (document.cookie.indexOf("testcookie") != -1) ? true : false;
        }
        return (cookieEnabled);
    }
}

class Cookie
{
    constructor(name = undefined, value = undefined, expirationDate = undefined)
    {
        this.name = name;        
        this.value = value;
        this.expirationDate = expirationDate;
    }

    SetCookie(value, additive = false)
    {
        this.value = value;
        this.expirationDate = this.#GetExpirationDateString();
        
        var cookieManager = new CookieManager();
        var cookie = cookieManager.GetCookie(this.name);
        if (cookie == undefined || (cookie.value != this.value && !additive))
            if (additive)
                this.value = cookie.value + ";" + this.value;
            document.cookie = this.name + "=" + this.value + "; " + this.expirationDate;
    }

    get #GetExpirationDateString()
    {
        var exdate = new Date();
        return exdate.setDate(exdate.getDate() + 14);
    }

}