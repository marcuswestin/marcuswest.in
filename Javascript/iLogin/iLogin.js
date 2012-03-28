// Copyright (c) 2008 Marcus Westin, m@marcuswestin.com
// 
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
// 
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
// 
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

// iLogin - store your logins for your iPhone!
var fus = ['username','user','cnetid','email','Email','user_id'];
var fps = ['Passwd','password','pass'];
var f, fu, fp;
var fs=document.forms;
f = fs['loginform'] || fs['login'] || fs[0];
if (f){
    for (var i=0; i<fus.length; i++) {
        fu=f[fus[i]];
        if (fu){break;}
    }
    for (var i=0; i<fus.length; i++) {
        fp=f[fps[i]];
        if (fp){break;}
    }
    if ( fu && fp ) {
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
        if (username==''||!username) {
            username=prompt('Enter Username/Email');
            setCookie('mwd.uoc.un', username);
        }
        if (password==''||!password) {
            password=prompt('Enter Password');
            setCookie('mwd.uoc.pw', password);
        }
        fu.value=username;
        fp.value=password;
        f.submit();
    }
}