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
    var analyticsOptInMode = true;
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
                new Cookie(name, "", this.GetMaxAge(1, true)).SetCookie();
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
        this.hidden = false;
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

    AcceptAllButtonClick()
    {
        // Setting Cookies
        this.cookieManager.mainCookie.value = "allow";
        this.cookieManager.mainCookie.SetCookie();
        // Setting Analytics
        this.cookieManager.googleAnalytics.value = "allow";
        this.cookieManager.googleAnalytics.SetCookie();
        this.analyticsManager.LoadAndExecute();

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

        if (this.cookieManager.mainCookie.value == "allow" && this.cookieManager.googleAnalytics.value == "allow")
            this.Hide();
    }

    InitializeDemoBody()
    {
        this.body = '<!--Cookie / Analytics Banner - DEMO BODY--><style>#iam-OptInBanner{position: fixed; display: flex; background-color: black; color: #fff; flex-direction: column; bottom: 0; height: 175px; width: 100%;}#iam-OptInBanner-Content{display: flex; justify-content: center; padding: 15px; padding-left: 150px; padding-right: 150px; color: #fff; text-align: center; margin: 0;}#iam-OptInBanner-Options{display: flex; margin-left: auto; margin-right: auto;}#iam-ChkCookie, #iam-ChkAnalytics{margin-left: 15px;}#iam-OptInBanner-Options label{margin-left: 8px;}#iam-OptInBanner-ButtonWrapper{display: flex; position: absolute; justify-content: center; bottom: 0; left: 0; right: 0; padding-right: 30px; padding-bottom: 15px; padding-top: 15px;}#iam-OptInBanner-Button, #iam-OptInBanner-ButtonMore, #iam-OptInBanner-AcceptAll{flex-direction: column; color: #fff; min-width: 150px; background-color: #000; padding-left: 15px; padding-right: 15px; padding-top: 10px; padding-bottom: 10px; margin-left: 15px; margin-right: 15px; border: solid 1px #fff;}.iam-ButtonDefault{background-color: #fff !important; border-color: #000 !important; color: #000 !important;}.iam-ButtonDefault:hover{background-color: #000 !important; border-color: #fff !important; color: #fff !important;}#iam-OptInBanner-Button:hover, #iam-OptInBanner-ButtonMore:hover{background-color: #fff; color: #000; border: solid 1px #fff;}@media only screen and (max-width: 960px){#iam-OptInBanner{height: 20%;}#iam-OptInBanner-Content{padding-left: 15px; padding-right: 15px;}}</style><div id="iam-OptInBanner" class="iam-OptIn-Cookies iam-OptIn-Analytics"> <div id="iam-OptInBanner-Content"> <p>Wir verwenden u.a. Cookies zur optimierten Darstellung und Auswertung, sowie zur Verbesserung unserer Website und unserer Services. Klicken Sie auf <b>Akzeptieren</b> um der Datenschutzerklärung zuzustimmen.</p></div><div id="iam-OptInBanner-Options"> <b>Datenschutz-Optionen:</b> <input id="iam-ChkCookie" type="checkbox" name="ChkCookie" value="UseCookies" checked><label> Notwendige Cookies</label> <input id="iam-ChkAnalytics" type="checkbox" name="ChkAnalytics" value="UseAnalytics"><label> Google Analytics</label> </div><div id="iam-OptInBanner-ButtonWrapper"> <button id="iam-OptInBanner-AcceptAll" class="iam-ButtonDefault"> Akzeptieren </button> <button id="iam-OptInBanner-Button" style="display: none;"> Übernehmen </button> <button id="iam-OptInBanner-ButtonMore"> Mehr Optionen </button> </div></div><style>#iam-OptInManager{display: none; position: fixed; bottom: 0; background-color: #000; color: #fff; padding-top: 15px; padding-bottom: 15px; padding-left: 30px; padding-right: 30px; margin-left: 50px;}</style><a href="#" id="iam-OptInManager"> Datenschutzeinstellungen</a><!--DEMO BODY END-->';
        document.body.innerHTML += (this.body);

        // First hide save button
        var button = document.getElementById("iam-OptInBanner-Button");
        button.setAttribute("display", "none").style.display = "none";
    }

    Hide()
    {
        this.hidden = true;
        document.getElementById("iam-OptInBanner").style.display = "none";
        document.getElementById("iam-OptInManager").style.display = "block";
    }

    Show()
    {
        this.hidden = false;
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

    DeclineButtonClick()
    {
        var button = document.getElementById("iam-OptInBanner-Button");
        
        if (button.style.display == "none")
            button.style.display = "initial";
        else
            button.style.display = "none";
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
        
        if (this.extScript != undefined)
            this.extScript.remove();
        if (this.analyticsScript != undefined)
            this.analyticsScript.remove();
    }
}

function startTimer(duration, banner)
{
    var timer = duration, minutes, seconds;
    setInterval(function ()
    {
        minutes = parseInt(timer / 60, 10);
        seconds = parseInt(timer % 60, 10);

        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        if (--timer == 0 && !banner.hidden)
        {
            banner.Hide();
        }
    }, 1000);
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

    if (cookieManager.googleAnalytics.value == "allow" || (cookieManager.googleAnalytics.value == undefined && !analyticsOptInMode))
    {
        cookieManager.googleAnalytics.SetCookie("allow");
        analyticsManager.LoadAndExecute();
    } else 
    {
        if (debug)
            console.log("Analyitcs will not be loaded.");
    }

    // Button Events
    if (document.getElementById("iam-OptInBanner-AcceptAll") != null)
        document.getElementById("iam-OptInBanner-AcceptAll").onclick = function () { optInBanner.AcceptAllButtonClick() };
    if (document.getElementById("iam-OptInBanner-Button") != null)
        document.getElementById("iam-OptInBanner-Button").onclick = function () { optInBanner.AcceptButtonClick() };
    if (document.getElementById("iam-OptInBanner-ButtonMore") != null)
        document.getElementById("iam-OptInBanner-ButtonMore").onclick = function () { optInBanner.DeclineButtonClick() };
    if (document.getElementById("iam-OptInManager") != null)
        document.getElementById("iam-OptInManager").onclick = function () { optInBanner.Show() };
    // Notwendige Cookies kann man nicht deaktivieren
    if (document.getElementById("iam-ChkCookie") != null)
        document.getElementById("iam-ChkCookie").onclick = function ()
        {
            this.checked = true;
        };
    
    
    // Launch Google Analytics
    if (cookieManager.googleAnalytics.value == "allow" || !analyticsOptInMode)
        analyticsManager.LoadAndExecute();
    
    // Only Start Time if its Opt-Out
    if (!analyticsOptInMode)
    {
        var fiveMinutes = 10;
        startTimer(fiveMinutes, optInBanner);
    }
})