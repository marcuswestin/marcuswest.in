// bookmarkletize http://ted.mielczarek.org/code/mozilla/bookmarklet.html
// Fix regexp (add */)
// replace < with %3c
// replace > with %3e
// replace splace with %20
// result: javascript:(function(){if(document.forms.loginform){function%20setCookie(key,val){document.cookie=key+'='+scramble(val,9)+';%20expires=Mon,%203%20Jan%202011%2020:47:11%20UTC;%20path=/'}function%20getCookie(key){var%20cks=new%20String(document.cookie).split(';');var%20l=cks.length;for(var%20i=0;i%3cl;i++){var%20kvp=cks[i].split('=');var%20k=kvp[0].substring(1);if(k==key){return%20unscramble(kvp[1],9);}}}function%20mod(num,op){if(num%3cop){return%20num;}else{return%20mod(num-op,op);}}function%20unscramble(x,shf){return%20scramble(x,26-shf);}function%20scramble(x,shf){var%20abc='abcdefghijklmnopqrstuvwxyz';var%20ABC='ABCDEFGHIJKLMNOPQRSTUVWXYZ';var%20r1='';var%20r2='';var%20shf=eval(shf);for(var%20i=0;i%3cx.length;i++){var%20let=x.charAt(i);var%20pos=ABC.indexOf(let);if(pos%3e=0){r1+=ABC.charAt(mod((pos+shf),26));}else{r1+=let;}}for(var%20i=0;i%3cr1.length;i++){var%20let=r1.charAt(i);var%20pos=abc.indexOf(let);if(pos%3e=0){r2+=abc.charAt(mod((pos+shf),26));}else{r2+=let;}}return%20r2;}var%20username=getCookie('mwd.uoc.un');var%20password=getCookie('mwd.uoc.pw');if(username==null){username=prompt('Enter%20User%20name');setCookie('mwd.uoc.un',username);}if(password==null){password=prompt('Enter%20Password%20(stored%20as%20plain%20text%20-%20guard%20your%20cookies!)');setCookie('mwd.uoc.pw',password);}var%20f=document.forms.loginform;f.username.value=username;f.password.value=password;f.submit();}})();
if (document.forms.loginform) {
    function setCookie(key,val) {
        document.cookie=key+'='+scramble(val,9)+'; expires=Mon, 3 Jan 2011 20:47:11 UTC; path=/'
    }
    function getCookie(key){
        var cks=new String(document.cookie).split(';');
        var l=cks.length;
        for (var i=0; i<l; i++) {
            var kvp = cks[i].split('=');
            var k=kvp[0].substring(1);
            if(k==key) {
                return unscramble(kvp[1],9);
            }
        }
    }
    function mod(num, op) {
        if (num < op) {
            return num;  
        } else {
            return mod(num-op, op);
        }
    }
    function unscramble(x,shf){
        return scramble(x,26-shf);
    }
    function scramble(x,shf) {
        var abc='abcdefghijklmnopqrstuvwxyz';
        var ABC='ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        var r1='';
        var r2='';
        var shf=eval(shf);
        for(var i=0;i<x.length;i++){
            var let=x.charAt(i);
            var pos=ABC.indexOf(let);
            if(pos>=0){
                r1+=ABC.charAt(mod((pos+shf),26));
            } else {
                r1+=let;
            }
        }
        for(var i=0;i<r1.length;i++){
            var let=r1.charAt(i);
            var pos=abc.indexOf(let);
            if(pos>=0){
                r2+=abc.charAt(mod((pos+shf),26));
            } else {
                r2+=let;
            }
        }
        return r2;
    }
    var username=getCookie('mwd.uoc.un');
    var password=getCookie('mwd.uoc.pw');
    if (username==null) {
        username=prompt('Enter User name');
        setCookie('mwd.uoc.un', username);
    }
    if (password==null) {
        password=prompt('Enter Password (stored as plain text - guard your cookies!)');
        setCookie('mwd.uoc.pw', password);
    }
    var f=document.forms.loginform;
    f.username.value=username;
    f.password.value=password;
    f.submit();
}
