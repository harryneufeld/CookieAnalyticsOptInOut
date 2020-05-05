# Web Opt-In & Opt-Out Cookie & Google Analytics Manager
JS web based Cookie and Google Analytics (and so on) Manager

## Functionality
It's a basic JS Library for Handling Cookies with additional Google Analytics managing.
* Opt-In or Opt-Out Cookie Managing
* Opt-In or Opt-Out Google Analytics Managing
* Reading and Saving custom/own Cookies

## How To Use
Place following code in your `<head></head>` Tag:
```<script type="text/javascript">
    var analyticsTrackingId = "TRACKINGID";
    var analyticsOptInMode = false;
</script>
<script src="CookieManager.js"></script>```

Change the value "analyticsTrackingId" to your Tracking-Id of google.
When you want to use the CookieManager as Opt-In change the value of "analyticsOptInMode" to `true`
