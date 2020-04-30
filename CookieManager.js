/*   Cookie Manager Addon for any Website
 *   Copyright (C) by Interarts Media UG (haftungsbeschränkt) - 2020
 *   Web:        www.interarts-media.de
 *   Author:     Harry Neufeld
 *   Date:       30.04.2020
 *   Version:    0.0.1
 *   Revision:   0
 */

// Some crappy js classes - let's do it quick'n'dirty - sorry, i just hate js
class CookieMonster
{
    GetCookie(name = undefined, value = undefined)
    {
        var cookies, c, n, v;
        cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++)
        {
            c = cookies[i].split('=');
            n = c[0].trim();
            v = c[1].trim();
            if ((name != undefined && n == name) || (value != undefined && v == value))
            {
                return new Cookie(n, v);
            }
        }
        return undefined;
    }

    SetCookie(name, value, expirationDate = undefined)
    {
        if (this.IsCookiesEnabled())
        {
            // check if cookie already exists and delete it
            var cookie = cookieManager.GetCookie(name);
            if (cookie != undefined && !additive)
            {
                new Cookie(name, "", this.GetExpirationDateString(1, true)).SetCookie();
            }
            // give the cookie to the cookiemonster
            var c = new Cookie(name, value, expirationDate);
            c.SetCookie();  // nomnom
        }
    }

    IsCookiesEnabled()
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
    constructor(name, value, expirationDate = undefined)
    {
        this.name = name;        
        this.value = value;
        this.expirationDate = expirationDate;
    }

    SetCookie(value = undefined, additive = false)
    {        
        if (value != undefined)
            this.value = value;
        if (this.expirationDate == undefined)
            this.expirationDate = this.GetExpirationDateString();
        document.cookie = this.name + "=" + this.value + "; " + this.expirationDate;
    }

    GetExpirationDateString(days = 14, substract = false)
    {
        var exdate = new Date();
        if (substract)
            return exdate.setDate(exdate.getDate() - days);
        else
            return exdate.setDate(exdate.getDate() + days);
    }

}

/* Checking Opt-In Settings
 * 
 */

// Checking if Cookie Master is set
var message, accept, decline, mainCookie, cookieManager = new CookieMonster();

if (cookieManager.IsCookiesEnabled())
{
    alert("Achtung: Cookies sind deaktiviert");
    return;
}

mainCookie = cookieManager.GetCookie("iam_cookieMonster");
if (mainCookie == undefined)
{
    alert('Setting Cookie');
    cookieManager.SetCookie("iam_cookieMonster", "allow");
} else
{
    alert('Cookie already set');
}