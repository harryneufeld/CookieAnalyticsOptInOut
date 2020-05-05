# Opt-In & Opt-Out Cookie & Google Analytics Manager
JS web based Cookie and Google Analytics (and so on) Manager
Works with Webflow Websites, Wordpress and anything else.

## Functionality
It's a basic JS Library for Handling Cookies with additional Google Analytics managing.
* Opt-In or Opt-Out Cookie Managing
* Opt-In or Opt-Out Google Analytics Managing
* Reading and Saving custom/own Cookies

## How To Setup
Place following code in your `<head></head>` Tag:
```javascript
<script type="text/javascript">
    var analyticsTrackingId = "TRACKINGID";
    var analyticsOptInMode = false;
</script>
<script src="CookieManager.js"></script>
```

Change the value "analyticsTrackingId" to your Tracking-Id of google.

### Opt-Out
If you use it as Opt-Out it will initialize the Website with Cookies and Google Analyitcs activated. 
You can let the Banner inform the User and show the possibility of Opt-Out and Fade-Out the Banner after x seconds (FadeOut not given yet).

### Opt-In
If you use it as Opt-In you have to change the value of "analyticsOptInMode" to `true`.
Now the Website will initialize without Cookies and Google Analytics and the Banner will show up until decisions were made and applied.
A little Button will then be displayed to change the options.

## Demo
[https://CookieManager.demo.interarts-media.de](https://CookieManager.demo.interarts-media.de)

## How to Use it
if you would like to use it to manage Cookies or manage Google Analytics your can use following Objects and Classes:

### cookieManager-Object/Class
The cookieManager-Object is accessible and has following Methods:

#### GetCookie(name, value)
Searches for a Cookie with the name *name* and value (optional) of *value*
Returns a Cookie Object with a ".value" property.

#### SetCookie(name, value, expirationDate)
Sets a Cookie with name of *name*, value of *value* and expirationDate (Optional - more like MaxAge) of *expirationDate*.

#### IsCookiesEnabled()
Checks if Cookies are activated in Browser or if it's possible to Set Cookies in this Browser. Return a bool.

Also it has the two main Cookies:
#### mainCookie
Which is the main cookie for controlling if Cookies are accepted from User or not.
cookieManager.mainCookie.value == "allow" when Cookies are accepted
cookieManager.mainCookie.value == "decline" when Cookies are declined

#### googleAnalytics
Which is the main google analytics cookie for controlling if analytics is accepted from User or not.
cookieManager.googleAnalytics.value == "allow" when Analytics is accepted
cookieManager.googleAnalytics.value == "decline" when Analytics is declined

### Cookie-Class
The Cookie Class represents one Cookie. A Cookie can Set/Change a Value of itself.
Constructor accepts name, value and MaxAge (Optional)

#### SetCookie(value)
Sets the value of the Cookie (optional). It can use the values given to constructor.

#### GetMaxAge(days, substract)
Returns a calculated MaxAge-Value with *+ days from today*.
Set *substract* to *true* to substract *- days from today* eg. for deleting the cookie.