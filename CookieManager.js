/*   Opt-In Manager Addon for any Website
 *   Copyright (C) by Interarts Media UG (haftungsbeschränkt) - 2020
 *   Web:        www.interarts-media.de
 *   Author:     Harry Neufeld
 *   Date:       30.04.2020
 *   Version:    0.0.1
 *   Revision:   0
 */

/* GOOGLE ANALYTICS - SET TRACKING ID HERE */
if (analyticsTrackingId == undefined)
    var analyticsTrackingId = "UA-TEST-1";
/* GOOGLE ANALYTICS - SET Opt-In instead of Opt-Out */
if (analyticsOptInMode == undefined)
    var analyticsOptInMode = false;
/* BANNER - SET Banner Message */
if (bannerMessage == undefined)
    var bannerMessage = "Wir verwenden u.a. Cookies zur optimierten Darstellung und Auswertung, sowie zur Verbesserung unserer Website und unserer Services. Sollten Sie damit nicht einverstanden sein treffen Sie hier ihre Datenschutzeinstellungen. Mit dem Klick auf 'Anwenden' werden Ihre Einstellungen �bernommen.";

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
            if (c[0] != undefined && c[1] != undefined)
            {
                n = c[0].trim();
                v = c[1].trim();
                if ((name != undefined && n == name) || (value != undefined && v == value))
                {
                    return new Cookie(n, v);
                }
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
    constructor(cookieManager, analyticsManager)
    {
        this.cookieManager = cookieManager;
        this.analyticsManager = analyticsManager;
        this.IsSetDemoTheme = false;
        this.InitializeBody();
    }

    get GetBody()
    {
        return this.body;
    }
    set SetBody(html)
    {
        this.body = html;
    }

    AcceptButtonClick()
    {
        if (this.IsCookiesEnabled())
        {
            this.cookieManager.mainCookie.value = "allow";
            this.cookieManager.mainCookie.SetCookie();
        } else 
        {
            this.cookieManager.mainCookie.value = "decline";
            this.cookieManager.mainCookie.SetCookie();
        }
        if (this.IsAnalyticsEnabled())
        {
            this.cookieManager.googleAnalytics.value = "allow";
            this.cookieManager.googleAnalytics.SetCookie();
            this.analyticsManager.LoadAndExecute();
        } else 
        {
            this.cookieManager.googleAnalytics.value = "decline";
            this.cookieManager.googleAnalytics.SetCookie();
            this.analyticsManager.UnloadAndExit();
        }

        this.Hide();
    }

    IsCookiesEnabled()
    {
        if (document.getElementById("iam-ChkCookie").checked)
            return true;
        else
            return false;
    }

    IsAnalyticsEnabled()
    {
        if (document.getElementById("iam-ChkAnalytics").checked)
            return true;
        else
            return false;
    }

    InitializeBody()
    {
        if (document.getElementById("iam-OptInBanner") == null)
        {
            this.IsSetDemoTheme = true;
            this.InitializeDemoBody();
        } else
        {
            this.body = document.getElementById("iam-OptInBanner").html;
        }

        if (this.cookieManager.mainCookie.value != undefined && this.cookieManager.googleAnalytics.value != undefined)
            this.Hide();
    }

    InitializeDemoBody()
    {
        this.body = '<style>#iam-OptInBanner{position: absolute; display: flex; background-color: black; color: #fff; flex-direction: column; justify-content: center; align-content: center; align-items: center; bottom: 0; height: 15%; width: 100%;}#iam-OptInBanner-Content{position: absolute; display: flex; justify-content: center; padding: 15px; color: #fff; text-align: center; top: 0; left: 0; right: 0; margin: 0;}#iam-OptInBanner-ButtonWrapper{display: flex; position: absolute; justify-content: center; bottom: 0; left: 0; right: 0; padding-right: 30px; padding-bottom: 15px; padding-top: 15px;}#iam-OptInBanner-Button, #iam-OptInBanner-ButtonMore{flex-direction: column; color: #fff; min-width: 150px; background-color: #000; padding-left: 15px; padding-right: 15px; padding-top: 10px; padding-bottom: 10px; margin-left: 15px; margin-right: 15px; border: solid 1px #fff;}#iam-OptInBanner-Button:hover, #iam-OptInBanner-ButtonMore:hover{background-color: #fff; color: #000; border: solid 1px #fff;}</style> <div id="iam-OptInBanner" class="iam-OptIn-Cookies iam-OptIn-Analytics"> <div id="iam-OptInBanner-Content"> Um die Benutzererfahrung zu verbessern verwenden wir gängige techniken wie Cookies und Google Analyitcs. Um unsere Webseite uneingeschränkt nutzen zu können stimmen Sie einfach der Nutzung dieser Dienste zu. </div><div id="iam-OptInBanner-Options"> <form> <b>Aktive Optionen:</b> <input id="iam-ChkCookie" type="checkbox" name="ChkCookie" value="UseCookies" checked><label> Cookie-Nutzung</label> <input id="iam-ChkAnalytics" type="checkbox" name="ChkAnalytics" value="UseAnalytics" checked><label> Google Analytics</label> </form> </div><div id="iam-OptInBanner-ButtonWrapper"> <button id="iam-OptInBanner-Button"> Akzeptieren </button> <button id="iam-OptInBanner-ButtonMore"> Mehr Erfahren </button> </div></div>';
        document.body.append(this.body);
    }

    Hide()
    {
        document.getElementById("iam-OptInBanner").style.display = "none";
        document.getElementById("iam-OptInManager").style.display = "block";
    }

    Show()
    {
        document.getElementById("iam-OptInBanner").style.display = "flex";
        document.getElementById("iam-OptInManager").style.display = "none";

        this.UpdateCheckboxes()
    }

    UpdateCheckboxes()
    {
        if (this.cookieManager.mainCookie.value == "allow")
            document.getElementById("iam-ChkCookie").checked = true;
        else
            document.getElementById("iam-ChkCookie").checked = false;
        if (this.cookieManager.googleAnalytics.value == "allow")
            document.getElementById("iam-ChkAnalytics").checked = true;
        else
            document.getElementById("iam-ChkAnalytics").checked = false;
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
                console.log("Not Loading. Analytics is alread set up!")
        }
        else
        {
            this.extScript = document.createElement("script");
            this.extScript.src = "https://www.googletagmanager.com/gtag/js?id=" + this.trackingId;
            this.extScript.async = true;
            this.extScript.id = "iam-googleAnalyticsTag";
            this.analyticsScript = document.createElement("script");
            this.analyticsScript.type = "text/javascript";
            this.analyticsScript.async = true;
            this.analyticsScript.id = "iam-googleAnalyticsLib";
            this.analyticsScript.src = "https://www.google-analytics.com/analytics.js";
            document.getElementsByTagName('head')[0].appendChild(this.extScript);
            document.getElementsByTagName('head')[0].appendChild(this.analyticsScript);
 
            // analytics, pls make some magic
            window.ga = window.ga || function ()
            {
                (ga.q = ga.q || []).push(arguments)
            };
            ga.l = +new Date;
            ga('create', this.trackingId, 'auto');
            ga('send', 'pageview');

            if (debug)
                console.log("Analytics is set up.");
        }
    }

    UnloadAndExit()
    {
        if (debug)
            console.log("Unloading Google Analytics");
        
        this.extScript.remove();
        this.analyticsScript.remove();
    }
}

// Run cookie-check and Opt-In modules
document.addEventListener('DOMContentLoaded', function(event) 
{
    var cookieManager = new CookieMonster();
    var analyticsManager = new AnalyticsManager(analyticsTrackingId);
    var optInBanner = new Banner(cookieManager, analyticsManager);

    if (cookieManager.IsCookiesEnabled() && cookieManager.mainCookie.value == undefined)
    {
        cookieManager.mainCookie.SetCookie("allow");
    } else
    {
        if (debug)
            console.log('Cookie already set. Refreshing it.');
        cookieManager.mainCookie.SetCookie();
    }

    if (cookieManager.googleAnalytics.value == "allow")
    {
        analyticsManager.LoadAndExecute();
    } else 
    {
        if (debug)
            console.log("Analyitcs will not be loaded.");
    }

    // Button Events
    if (document.getElementById("iam-OptInBanner-Button") != null)
        document.getElementById("iam-OptInBanner-Button").onclick = function () { optInBanner.AcceptButtonClick() };
    if (document.getElementById("iam-OptInBanner-ButtonMore") != null)
        document.getElementById("iam-OptInBanner-ButtonMore").onclick = function () { optInBanner.DeclineButtonClick() };
    if (document.getElementById("iam-OptInManager") != null)
        document.getElementById("iam-OptInManager").onclick = function () { optInBanner.Show() };
    
    // Launch Google Analytics
    if (cookieManager.googleAnalytics.value == "allow" || !analyticsOptInMode)
        analyticsManager.LoadAndExecute();
})