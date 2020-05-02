/*   Opt-In Manager Addon for any Website
 *   Copyright (C) by Interarts Media UG (haftungsbeschränkt) - 2020
 *   Web:        www.interarts-media.de
 *   Author:     Harry Neufeld
 *   Date:       30.04.2020
 *   Version:    0.0.1
 *   Revision:   0
 */

/* GOOGLE ANALYTICS - SET TRACKING ID HERE */
var analyticsTrackingId = "UA-TEST-1";
/* THATS IT, THANKS FOR YOUR PATIENCE */

var debug = true;

// Cookiemanager Classes
class CookieMonster
{
    constructor()
    {
        // Main Cookie to see if we can save cookies
        this.mainCookie = this.GetCookie("iam_mainCookie");
        if (this.mainCookie == undefined)
            this.mainCookie = new Cookie("iam_mainCookie");

        // Analytics Cookie to see if we can use Analytics
        this.googleAnalytics = this.GetCookie("iam_googleAnalytics");
        if (this.googleAnalytics == undefined)
            this.googleAnalytics = new Cookie("iam_googleAnalytics");
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
        var seconds = 0;
        if (substract)
        {
            seconds =- days * 24 * 60 * 60;
        }
        else
        {
            seconds = days * 24 * 60 * 60;
        }
        return seconds;
    }

}

class Banner
{
    constructor()
    {
        this.IsSetDemoTheme = false;
        this.SetUpBody();
    }

    SetUpBody()
    {
        if (document.getElementById("body").includes("iam-OptInBanner"))
        {
            this.IsSetDemoTheme = true;
            this.SetupDemoBody();
        } else
        {
            this.body = document.getElementById("iam-CookieMonster")
        }
    }

}

// Google Analytics Classes
class AnalyticsManager
{
    constructor(trackingId = "")
    {
        this.trackingId = trackingId;
    }

    LoadAndExecute()
    {
        if (document.getElementsByTagName('head')[0].innerHTML.toString().includes("analytics.js"))
        {
            if (debug)
                console.log("Error: Analytics is alread set up!")
        }
        else
        {
            var extScript = document.createElement("script");
            extScript.src = "https://www.googletagmanager.com/gtag/js?id=" + this.trackingId;
            extScript.async = true;
            // var inlineScript = document.createElement("script");
            // inlineScript.text = "window.dataLayer = window.dataLayer || [];"
            //     +"function gtag(){dataLayer.push(arguments);}"
            //     +"gtag('js', new Date());"
            //     +"gtag('config', '" + this.trackingId + "');";

            document.getElementsByTagName('head')[0].appendChild(extScript);
            //document.getElementsByTagName('head')[0].appendChild(inlineScript);
            
            // Making analytics stuff work
            window.dataLayer = window.dataLayer || [];
            function gtag()
            {
                dataLayer.push(arguments);
            }
            gtag('js', new Date());
            gtag('config', this.trackingId);

            if (debug)
                console.log("Analytics ready set up.");
        }
    }
}

// Run cookie-check and Opt-In modules
var message, accept, decline, cookieManager = new CookieMonster(), analyticsManager = new AnalyticsManager(analyticsTrackingId);

if (cookieManager.IsCookiesEnabled() && cookieManager.mainCookie.value == undefined)
{
    if (debug)
        console.log('Setting Cookie');
    cookieManager.mainCookie.SetCookie("allow_cookies");
} else
{
    if (debug)
        console.log('Cookie already set. Refreshing it.');
    cookieManager.mainCookie.SetCookie();
}

if (cookieManager.googleAnalytics.value == "allow_analytics")
{
    analyticsManager.LoadAndExecute();
} else 
{
    if (debug)
        console.log("Analyitcs will not be loaded.");
}