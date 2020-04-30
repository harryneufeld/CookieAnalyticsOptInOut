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
    constructor()
    {
        this.mainCookie = this.GetCookie("iam_mainCookie");
        if (this.mainCookie == undefined)
            this.mainCookie = new Cookie("iam_mainCookie");
    }

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
        var expirationDateString = "";
        var useMaxAge = true;
        var useExpirationDate = false;

        if (value != undefined)
            this.value = value;
        if (this.expirationDate == undefined)
            this.expirationDate = this.GetExpirationDateString();
        
        if (useMaxAge)
            expirationDateString = "max-age=" + this.GetMaxAge()+";";
        if (useExpirationDate)
            expirationDateString += "expires=" + this.expirationDate + ";";
        document.cookie = this.name + "=" + this.value + "; " + expirationDateString;
    }

    GetExpirationDateString(days = 14, substract = false)
    {
        var exdate = new Date();
        if (substract)
        {
            exdate.setDate(exdate.getDate() - days);
        }
        else
        {
            exdate.setDate(exdate.getDate() + days);
        }
        return exdate.toGMTString();
    }

    GetMaxAge(days = 14, substract = false)
    {
        var seconds;
        if (substract)
        {
            seconds = - days * 24 * 60 * 60;
        }
        else
        {
            seconds = days * 24 * 60 * 60;
        }
        return seconds;
    }

}

/* Checking Opt-In Settings
 * 
 */

// Checking if Cookie Master is set
var message, accept, decline, cookieManager = new CookieMonster();

if (cookieManager.IsCookiesEnabled() && cookieManager.mainCookie.value == undefined)
{
    alert('Setting Cookie');
    cookieManager.mainCookie.SetCookie("allow_cookies");
} else
{
    alert('Cookie already set. Refreshing it.');
    cookieManager.mainCookie.SetCookie();
}