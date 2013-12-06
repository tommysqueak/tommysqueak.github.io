/* ========================================================================
 * Bootstrap: transition.js v3.0.0
 * http://twbs.github.com/bootstrap/javascript.html#transitions
 * ========================================================================
 * Copyright 2013 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */


+function ($) { "use strict";

  // CSS TRANSITION SUPPORT (Shoutout: http://www.modernizr.com/)
  // ============================================================

  function transitionEnd() {
    var el = document.createElement('bootstrap')

    var transEndEventNames = {
      'WebkitTransition' : 'webkitTransitionEnd'
    , 'MozTransition'    : 'transitionend'
    , 'OTransition'      : 'oTransitionEnd otransitionend'
    , 'transition'       : 'transitionend'
    }

    for (var name in transEndEventNames) {
      if (el.style[name] !== undefined) {
        return { end: transEndEventNames[name] }
      }
    }
  }

  // http://blog.alexmaccaw.com/css-transitions
  $.fn.emulateTransitionEnd = function (duration) {
    var called = false, $el = this
    $(this).one($.support.transition.end, function () { called = true })
    var callback = function () { if (!called) $($el).trigger($.support.transition.end) }
    setTimeout(callback, duration)
    return this
  }

  $(function () {
    $.support.transition = transitionEnd()
  })

}(window.jQuery);

/* ========================================================================
 * Bootstrap: collapse.js v3.0.0
 * http://twbs.github.com/bootstrap/javascript.html#collapse
 * ========================================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */


+function ($) { "use strict";

  // COLLAPSE PUBLIC CLASS DEFINITION
  // ================================

  var Collapse = function (element, options) {
    this.$element      = $(element)
    this.options       = $.extend({}, Collapse.DEFAULTS, options)
    this.transitioning = null

    if (this.options.parent) this.$parent = $(this.options.parent)
    if (this.options.toggle) this.toggle()
  }

  Collapse.DEFAULTS = {
    toggle: true
  }

  Collapse.prototype.dimension = function () {
    var hasWidth = this.$element.hasClass('width')
    return hasWidth ? 'width' : 'height'
  }

  Collapse.prototype.show = function () {
    if (this.transitioning || this.$element.hasClass('in')) return

    var startEvent = $.Event('show.bs.collapse')
    this.$element.trigger(startEvent)
    if (startEvent.isDefaultPrevented()) return

    var actives = this.$parent && this.$parent.find('> .panel > .in')

    if (actives && actives.length) {
      var hasData = actives.data('bs.collapse')
      if (hasData && hasData.transitioning) return
      actives.collapse('hide')
      hasData || actives.data('bs.collapse', null)
    }

    var dimension = this.dimension()

    this.$element
      .removeClass('collapse')
      .addClass('collapsing')
      [dimension](0)

    this.transitioning = 1

    var complete = function () {
      this.$element
        .removeClass('collapsing')
        .addClass('in')
        [dimension]('auto')
      this.transitioning = 0
      this.$element.trigger('shown.bs.collapse')
    }

    if (!$.support.transition) return complete.call(this)

    var scrollSize = $.camelCase(['scroll', dimension].join('-'))

    this.$element
      .one($.support.transition.end, $.proxy(complete, this))
      .emulateTransitionEnd(350)
      [dimension](this.$element[0][scrollSize])
  }

  Collapse.prototype.hide = function () {
    if (this.transitioning || !this.$element.hasClass('in')) return

    var startEvent = $.Event('hide.bs.collapse')
    this.$element.trigger(startEvent)
    if (startEvent.isDefaultPrevented()) return

    var dimension = this.dimension()

    this.$element
      [dimension](this.$element[dimension]())
      [0].offsetHeight

    this.$element
      .addClass('collapsing')
      .removeClass('collapse')
      .removeClass('in')

    this.transitioning = 1

    var complete = function () {
      this.transitioning = 0
      this.$element
        .trigger('hidden.bs.collapse')
        .removeClass('collapsing')
        .addClass('collapse')
    }

    if (!$.support.transition) return complete.call(this)

    this.$element
      [dimension](0)
      .one($.support.transition.end, $.proxy(complete, this))
      .emulateTransitionEnd(350)
  }

  Collapse.prototype.toggle = function () {
    this[this.$element.hasClass('in') ? 'hide' : 'show']()
  }


  // COLLAPSE PLUGIN DEFINITION
  // ==========================

  var old = $.fn.collapse

  $.fn.collapse = function (option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.collapse')
      var options = $.extend({}, Collapse.DEFAULTS, $this.data(), typeof option == 'object' && option)

      if (!data) $this.data('bs.collapse', (data = new Collapse(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.collapse.Constructor = Collapse


  // COLLAPSE NO CONFLICT
  // ====================

  $.fn.collapse.noConflict = function () {
    $.fn.collapse = old
    return this
  }


  // COLLAPSE DATA-API
  // =================

  $(document).on('click.bs.collapse.data-api', '[data-toggle=collapse]', function (e) {
    var $this   = $(this), href
    var target  = $this.attr('data-target')
        || e.preventDefault()
        || (href = $this.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '') //strip for ie7
    var $target = $(target)
    var data    = $target.data('bs.collapse')
    var option  = data ? 'toggle' : $this.data()
    var parent  = $this.attr('data-parent')
    var $parent = parent && $(parent)

    if (!data || !data.transitioning) {
      if ($parent) $parent.find('[data-toggle=collapse][data-parent="' + parent + '"]').not($this).addClass('collapsed')
      $this[$target.hasClass('in') ? 'addClass' : 'removeClass']('collapsed')
    }

    $target.collapse(option)
  })

}(window.jQuery);

/*! skrollr 0.6.15 (2013-10-03) | Alexander Prinzhorn - https://github.com/Prinzhorn/skrollr | Free to use under terms of MIT license */
(function(e,t,r){"use strict";function n(r){if(o=t.documentElement,a=t.body,G(),at=this,r=r||{},ft=r.constants||{},r.easing)for(var n in r.easing)j[n]=r.easing[n];ht=r.edgeStrategy||"set",st={beforerender:r.beforerender,render:r.render},ct=r.forceHeight!==!1,ct&&(Vt=r.scale||1),ut=r.mobileDeceleration||E,mt=r.smoothScrolling!==!1,gt=r.smoothScrollingDuration||A,dt={targetTop:at.getScrollTop()},Nt=(r.mobileCheck||function(){return/Android|iPhone|iPad|iPod|BlackBerry|Windows Phone/i.test(navigator.userAgent||navigator.vendor||e.opera)})(),Nt?(lt=t.getElementById("skrollr-body"),lt&&ot(),W(),xt(o,[y,S],[T])):xt(o,[y,b],[T]),at.refresh(),bt(e,"resize orientationchange",function(){var e=o.clientWidth,t=o.clientHeight;(t!==Lt||e!==It)&&(Lt=t,It=e,Bt=!0)});var i=R();return function l(){Z(),Tt=i(l)}(),at}var o,a,i=e.skrollr={get:function(){return at},init:function(e){return at||new n(e)},VERSION:"0.6.15"},l=Object.prototype.hasOwnProperty,s=e.Math,c=e.getComputedStyle,f="touchstart",u="touchmove",p="touchcancel",m="touchend",g="skrollable",d=g+"-before",v=g+"-between",h=g+"-after",y="skrollr",T="no-"+y,b=y+"-desktop",S=y+"-mobile",w="linear",k=1e3,E=.004,A=200,x="start",F="end",C="center",D="bottom",H="___skrollable_id",P=/^\s+|\s+$/g,V=/^data(?:-(_\w+))?(?:-?(-?\d*\.?\d+p?))?(?:-?(start|end|top|center|bottom))?(?:-?(top|center|bottom))?$/,z=/\s*([\w\-\[\]]+)\s*:\s*(.+?)\s*(?:;|$)/gi,O=/^([a-z\-]+)\[(\w+)\]$/,q=/-([a-z])/g,I=function(e,t){return t.toUpperCase()},L=/[\-+]?[\d]*\.?[\d]+/g,B=/\{\?\}/g,M=/rgba?\(\s*-?\d+\s*,\s*-?\d+\s*,\s*-?\d+/g,N=/[a-z\-]+-gradient/g,$="",_="",G=function(){var e=/^(?:O|Moz|webkit|ms)|(?:-(?:o|moz|webkit|ms)-)/;if(c){var t=c(a,null);for(var n in t)if($=n.match(e)||+n==n&&t[n].match(e))break;if(!$)return $=_="",r;$=$[0],"-"===$.slice(0,1)?(_=$,$={"-webkit-":"webkit","-moz-":"Moz","-ms-":"ms","-o-":"O"}[$]):_="-"+$.toLowerCase()+"-"}},R=function(){var t=e.requestAnimationFrame||e[$.toLowerCase()+"RequestAnimationFrame"],r=Dt();return(Nt||!t)&&(t=function(t){var n=Dt()-r,o=s.max(0,1e3/60-n);return e.setTimeout(function(){r=Dt(),t()},o)}),t},U=function(){var t=e.cancelAnimationFrame||e[$.toLowerCase()+"CancelAnimationFrame"];return(Nt||!t)&&(t=function(t){return e.clearTimeout(t)}),t},j={begin:function(){return 0},end:function(){return 1},linear:function(e){return e},quadratic:function(e){return e*e},cubic:function(e){return e*e*e},swing:function(e){return-s.cos(e*s.PI)/2+.5},sqrt:function(e){return s.sqrt(e)},outCubic:function(e){return s.pow(e-1,3)+1},bounce:function(e){var t;if(.5083>=e)t=3;else if(.8489>=e)t=9;else if(.96208>=e)t=27;else{if(!(.99981>=e))return 1;t=91}return 1-s.abs(3*s.cos(1.028*e*t)/t)}};n.prototype.refresh=function(e){var n,o,a=!1;for(e===r?(a=!0,it=[],Mt=0,e=t.getElementsByTagName("*")):e=[].concat(e),n=0,o=e.length;o>n;n++){var i=e[n],l=i,s=[],c=mt,f=ht;if(i.attributes){for(var u=0,p=i.attributes.length;p>u;u++){var m=i.attributes[u];if("data-anchor-target"!==m.name)if("data-smooth-scrolling"!==m.name)if("data-edge-strategy"!==m.name){var d=m.name.match(V);if(null!==d){var v={props:m.value,element:i};s.push(v);var h=d[1];h=h&&ft[h.substr(1)]||0;var y=d[2];/p$/.test(y)?(v.isPercentage=!0,v.offset=((0|y.slice(0,-1))+h)/100):v.offset=(0|y)+h;var T=d[3],b=d[4]||T;T&&T!==x&&T!==F?(v.mode="relative",v.anchors=[T,b]):(v.mode="absolute",T===F?v.isEnd=!0:v.isPercentage||(v.frame=v.offset*Vt,delete v.offset))}}else f=m.value;else c="off"!==m.value;else if(l=t.querySelector(m.value),null===l)throw'Unable to find anchor target "'+m.value+'"'}if(s.length){var S,w,k;!a&&H in i?(k=i[H],S=it[k].styleAttr,w=it[k].classAttr):(k=i[H]=Mt++,S=i.style.cssText,w=At(i)),it[k]={element:i,styleAttr:S,classAttr:w,anchorTarget:l,keyFrames:s,smoothScrolling:c,edgeStrategy:f},xt(i,[g],[])}}}for(kt(),n=0,o=e.length;o>n;n++){var E=it[e[n][H]];E!==r&&(J(E),Q(E))}return at},n.prototype.relativeToAbsolute=function(e,t,r){var n=o.clientHeight,a=e.getBoundingClientRect(),i=a.top,l=a.bottom-a.top;return t===D?i-=n:t===C&&(i-=n/2),r===D?i+=l:r===C&&(i+=l/2),i+=at.getScrollTop(),0|i+.5},n.prototype.animateTo=function(e,t){t=t||{};var n=Dt(),o=at.getScrollTop();return pt={startTop:o,topDiff:e-o,targetTop:e,duration:t.duration||k,startTime:n,endTime:n+(t.duration||k),easing:j[t.easing||w],done:t.done},pt.topDiff||(pt.done&&pt.done.call(at,!1),pt=r),at},n.prototype.stopAnimateTo=function(){pt&&pt.done&&pt.done.call(at,!0),pt=r},n.prototype.isAnimatingTo=function(){return!!pt},n.prototype.setScrollTop=function(t,r){return vt=r===!0,Nt?$t=s.min(s.max(t,0),Pt):e.scrollTo(0,t),at},n.prototype.getScrollTop=function(){return Nt?$t:e.pageYOffset||o.scrollTop||a.scrollTop||0},n.prototype.getMaxScrollTop=function(){return Pt},n.prototype.on=function(e,t){return st[e]=t,at},n.prototype.off=function(e){return delete st[e],at},n.prototype.destroy=function(){var e=U();e(Tt),wt(),xt(o,[T],[y,b,S]);for(var t=0,n=it.length;n>t;t++)nt(it[t].element);o.style.overflow=a.style.overflow="auto",o.style.height=a.style.height="auto",lt&&i.setStyle(lt,"transform","none"),at=r,lt=r,st=r,ct=r,Pt=0,Vt=1,ft=r,ut=r,zt="down",Ot=-1,It=0,Lt=0,Bt=!1,pt=r,mt=r,gt=r,dt=r,vt=r,Mt=0,ht=r,Nt=!1,$t=0,yt=r};var W=function(){var n,i,l,c,g,d,v,h,y,T,b;bt(o,[f,u,p,m].join(" "),function(e){e.preventDefault();var o=e.changedTouches[0];switch(c=o.clientY,g=o.clientX,y=e.timeStamp,e.type){case f:for(n&&n.blur(),at.stopAnimateTo(),n=e.target;3===n.nodeType;)n=n.parentNode;i=d=c,l=g,h=y;break;case u:v=c-d,b=y-T,at.setScrollTop($t-v,!0),d=c,T=y;break;default:case p:case m:var a=i-c,S=l-g,w=S*S+a*a;if(49>w){n.focus();var k=t.createEvent("MouseEvent");return k.initEvent("click",!0,!0),n.dispatchEvent(k),r}n=r;var E=v/b;E=s.max(s.min(E,3),-3);var A=s.abs(E/ut),x=E*A+.5*ut*A*A,F=at.getScrollTop()-x,C=0;F>Pt?(C=(Pt-F)/x,F=Pt):0>F&&(C=-F/x,F=0),A*=1-C,at.animateTo(0|F+.5,{easing:"outCubic",duration:A})}}),e.scrollTo(0,0),o.style.overflow=a.style.overflow="hidden"},Y=function(){var e,t,r,n,a,i,l,c,f;for(c=0,f=it.length;f>c;c++)for(e=it[c],t=e.element,r=e.anchorTarget,n=e.keyFrames,a=0,i=n.length;i>a;a++){l=n[a];var u=l.offset;l.isPercentage&&(u*=o.clientHeight,l.frame=u),"relative"===l.mode&&(nt(t),l.frame=at.relativeToAbsolute(r,l.anchors[0],l.anchors[1])-u,nt(t,!0)),ct&&!l.isEnd&&l.frame>Pt&&(Pt=l.frame)}for(Pt=s.max(Pt,Et()),c=0,f=it.length;f>c;c++){for(e=it[c],n=e.keyFrames,a=0,i=n.length;i>a;a++)l=n[a],l.isEnd&&(l.frame=Pt-l.offset);e.keyFrames.sort(Ht)}},X=function(e,t){for(var r=0,n=it.length;n>r;r++){var o,a,s=it[r],c=s.element,f=s.smoothScrolling?e:t,u=s.keyFrames,p=u[0].frame,m=u[u.length-1].frame,y=p>f,T=f>m,b=u[y?0:u.length-1];if(y||T){if(y&&-1===s.edge||T&&1===s.edge)continue;switch(xt(c,[y?d:h],[d,v,h]),s.edge=y?-1:1,s.edgeStrategy){case"reset":nt(c);continue;case"ease":f=b.frame;break;default:case"set":var S=b.props;for(o in S)l.call(S,o)&&(a=rt(S[o].value),i.setStyle(c,o,a));continue}}else 0!==s.edge&&(xt(c,[g,v],[d,h]),s.edge=0);for(var w=0,k=u.length-1;k>w;w++)if(f>=u[w].frame&&u[w+1].frame>=f){var E=u[w],A=u[w+1];for(o in E.props)if(l.call(E.props,o)){var x=(f-E.frame)/(A.frame-E.frame);x=E.props[o].easing(x),a=tt(E.props[o].value,A.props[o].value,x),a=rt(a),i.setStyle(c,o,a)}break}}},Z=function(){Bt&&(Bt=!1,kt());var e,t,n=at.getScrollTop(),o=Dt();if(pt)o>=pt.endTime?(n=pt.targetTop,e=pt.done,pt=r):(t=pt.easing((o-pt.startTime)/pt.duration),n=0|pt.startTop+t*pt.topDiff),at.setScrollTop(n,!0);else if(!vt){var a=dt.targetTop-n;a&&(dt={startTop:Ot,topDiff:n-Ot,targetTop:n,startTime:qt,endTime:qt+gt}),dt.endTime>=o&&(t=j.sqrt((o-dt.startTime)/gt),n=0|dt.startTop+t*dt.topDiff)}if(Nt&&lt&&i.setStyle(lt,"transform","translate(0, "+-$t+"px) "+yt),vt||Ot!==n){zt=n>Ot?"down":Ot>n?"up":zt,vt=!1;var l={curTop:n,lastTop:Ot,maxTop:Pt,direction:zt},s=st.beforerender&&st.beforerender.call(at,l);s!==!1&&(X(n,at.getScrollTop()),Ot=n,st.render&&st.render.call(at,l)),e&&e.call(at,!1)}qt=o},J=function(e){for(var t=0,r=e.keyFrames.length;r>t;t++){for(var n,o,a,i,l=e.keyFrames[t],s={};null!==(i=z.exec(l.props));)a=i[1],o=i[2],n=a.match(O),null!==n?(a=n[1],n=n[2]):n=w,o=o.indexOf("!")?K(o):[o.slice(1)],s[a]={value:o,easing:j[n]};l.props=s}},K=function(e){var t=[];return M.lastIndex=0,e=e.replace(M,function(e){return e.replace(L,function(e){return 100*(e/255)+"%"})}),_&&(N.lastIndex=0,e=e.replace(N,function(e){return _+e})),e=e.replace(L,function(e){return t.push(+e),"{?}"}),t.unshift(e),t},Q=function(e){var t,r,n={};for(t=0,r=e.keyFrames.length;r>t;t++)et(e.keyFrames[t],n);for(n={},t=e.keyFrames.length-1;t>=0;t--)et(e.keyFrames[t],n)},et=function(e,t){var r;for(r in t)l.call(e.props,r)||(e.props[r]=t[r]);for(r in e.props)t[r]=e.props[r]},tt=function(e,t,r){var n,o=e.length;if(o!==t.length)throw"Can't interpolate between \""+e[0]+'" and "'+t[0]+'"';var a=[e[0]];for(n=1;o>n;n++)a[n]=e[n]+(t[n]-e[n])*r;return a},rt=function(e){var t=1;return B.lastIndex=0,e[0].replace(B,function(){return e[t++]})},nt=function(e,t){e=[].concat(e);for(var r,n,o=0,a=e.length;a>o;o++)n=e[o],r=it[n[H]],r&&(t?(n.style.cssText=r.dirtyStyleAttr,xt(n,r.dirtyClassAttr)):(r.dirtyStyleAttr=n.style.cssText,r.dirtyClassAttr=At(n),n.style.cssText=r.styleAttr,xt(n,r.classAttr)))},ot=function(){yt="translateZ(0)",i.setStyle(lt,"transform",yt);var e=c(lt),t=e.getPropertyValue("transform"),r=e.getPropertyValue(_+"transform"),n=t&&"none"!==t||r&&"none"!==r;n||(yt="")};i.setStyle=function(e,t,r){var n=e.style;if(t=t.replace(q,I).replace("-",""),"zIndex"===t)n[t]=""+(0|r);else if("float"===t)n.styleFloat=n.cssFloat=r;else try{$&&(n[$+t.slice(0,1).toUpperCase()+t.slice(1)]=r),n[t]=r}catch(o){}};var at,it,lt,st,ct,ft,ut,pt,mt,gt,dt,vt,ht,yt,Tt,bt=i.addEvent=function(t,r,n){var o=function(t){return t=t||e.event,t.target||(t.target=t.srcElement),t.preventDefault||(t.preventDefault=function(){t.returnValue=!1}),n.call(this,t)};r=r.split(" ");for(var a,i=0,l=r.length;l>i;i++)a=r[i],t.addEventListener?t.addEventListener(a,n,!1):t.attachEvent("on"+a,o),_t.push({element:t,name:a,listener:n})},St=i.removeEvent=function(e,t,r){t=t.split(" ");for(var n=0,o=t.length;o>n;n++)e.removeEventListener?e.removeEventListener(t[n],r,!1):e.detachEvent("on"+t[n],r)},wt=function(){for(var e,t=0,r=_t.length;r>t;t++)e=_t[t],St(e.element,e.name,e.listener);_t=[]},kt=function(){var e=at.getScrollTop();Pt=0,ct&&!Nt&&(a.style.height="auto"),Y(),ct&&!Nt&&(a.style.height=Pt+o.clientHeight+"px"),Nt?at.setScrollTop(s.min(at.getScrollTop(),Pt)):at.setScrollTop(e,!0),vt=!0},Et=function(){var e=lt&&lt.offsetHeight||0,t=s.max(e,a.scrollHeight,a.offsetHeight,o.scrollHeight,o.offsetHeight,o.clientHeight);return t-o.clientHeight},At=function(t){var r="className";return e.SVGElement&&t instanceof e.SVGElement&&(t=t[r],r="baseVal"),t[r]},xt=function(t,n,o){var a="className";if(e.SVGElement&&t instanceof e.SVGElement&&(t=t[a],a="baseVal"),o===r)return t[a]=n,r;for(var i=t[a],l=0,s=o.length;s>l;l++)i=Ct(i).replace(Ct(o[l])," ");i=Ft(i);for(var c=0,f=n.length;f>c;c++)-1===Ct(i).indexOf(Ct(n[c]))&&(i+=" "+n[c]);t[a]=Ft(i)},Ft=function(e){return e.replace(P,"")},Ct=function(e){return" "+e+" "},Dt=Date.now||function(){return+new Date},Ht=function(e,t){return e.frame-t.frame},Pt=0,Vt=1,zt="down",Ot=-1,qt=Dt(),It=0,Lt=0,Bt=!1,Mt=0,Nt=!1,$t=0,_t=[]})(window,document);
!function(e){var t={animation:"dissolve",separator:",",speed:2e3};e.fx.step.textShadowBlur=function(t){e(t.elem).prop("textShadowBlur",t.now).css({textShadow:"0 0 "+Math.floor(t.now)+"px black"})};e.fn.textrotator=function(n){var r=e.extend({},t,n);return this.each(function(){var t=e(this);var n=[];e.each(t.text().split(r.separator),function(e,t){n.push(t)});t.text(n[0]);var i=function(){switch(r.animation){case"dissolve":t.animate({textShadowBlur:20,opacity:0},500,function(){s=e.inArray(t.text(),n);if(s+1==n.length)s=-1;t.text(n[s+1]).animate({textShadowBlur:0,opacity:1},500)});break;case"flip":if(t.find(".back").length>0){t.html(t.find(".back").html())}var i=t.text();var s=e.inArray(i,n);if(s+1==n.length)s=-1;t.html("");e("<span class='front'>"+i+"</span>").appendTo(t);e("<span class='back'>"+n[s+1]+"</span>").appendTo(t);t.wrapInner("<span class='rotating' />").find(".rotating").hide().addClass("flip").show().css({"-webkit-transform":" rotateY(-180deg)","-moz-transform":" rotateY(-180deg)","-o-transform":" rotateY(-180deg)",transform:" rotateY(-180deg)"});break;case"flipUp":if(t.find(".back").length>0){t.html(t.find(".back").html())}var i=t.text();var s=e.inArray(i,n);if(s+1==n.length)s=-1;t.html("");e("<span class='front'>"+i+"</span>").appendTo(t);e("<span class='back'>"+n[s+1]+"</span>").appendTo(t);t.wrapInner("<span class='rotating' />").find(".rotating").hide().addClass("flip up").show().css({"-webkit-transform":" rotateX(-180deg)","-moz-transform":" rotateX(-180deg)","-o-transform":" rotateX(-180deg)",transform:" rotateX(-180deg)"});break;case"flipCube":if(t.find(".back").length>0){t.html(t.find(".back").html())}var i=t.text();var s=e.inArray(i,n);if(s+1==n.length)s=-1;t.html("");e("<span class='front'>"+i+"</span>").appendTo(t);e("<span class='back'>"+n[s+1]+"</span>").appendTo(t);t.wrapInner("<span class='rotating' />").find(".rotating").hide().addClass("flip cube").show().css({"-webkit-transform":" rotateY(180deg)","-moz-transform":" rotateY(180deg)","-o-transform":" rotateY(180deg)",transform:" rotateY(180deg)"});break;case"flipCubeUp":if(t.find(".back").length>0){t.html(t.find(".back").html())}var i=t.text();var s=e.inArray(i,n);if(s+1==n.length)s=-1;t.html("");e("<span class='front'>"+i+"</span>").appendTo(t);e("<span class='back'>"+n[s+1]+"</span>").appendTo(t);t.wrapInner("<span class='rotating' />").find(".rotating").hide().addClass("flip cube up").show().css({"-webkit-transform":" rotateX(180deg)","-moz-transform":" rotateX(180deg)","-o-transform":" rotateX(180deg)",transform:" rotateX(180deg)"});break;case"spin":if(t.find(".rotating").length>0){t.html(t.find(".rotating").html())}s=e.inArray(t.text(),n);if(s+1==n.length)s=-1;t.wrapInner("<span class='rotating spin' />").find(".rotating").hide().text(n[s+1]).show().css({"-webkit-transform":" rotate(0) scale(1)","-moz-transform":"rotate(0) scale(1)","-o-transform":"rotate(0) scale(1)",transform:"rotate(0) scale(1)"});break;case"fade":t.fadeOut(r.speed,function(){s=e.inArray(t.text(),n);if(s+1==n.length)s=-1;t.text(n[s+1]).fadeIn(r.speed)});break}};setInterval(i,r.speed)})}}(window.jQuery)
/*---------------------------------------------------------------------------------------------

@author       Constantin Saguin - @brutaldesign
@link            http://csag.co
@github        http://github.com/brutaldesign/swipebox
@version     1.2.1
@license      MIT License

----------------------------------------------------------------------------------------------*/
!function(window,document,$,undefined){$.swipebox=function(elem,options){var defaults={useCSS:true,initialIndexOnArray:0,hideBarsDelay:3e3,videoMaxWidth:1140,vimeoColor:"CCCCCC",beforeOpen:null,afterClose:null},plugin=this,elements=[],elem=elem,selector=elem.selector,$selector=$(selector),isTouch=document.createTouch!==undefined||"ontouchstart"in window||"onmsgesturechange"in window||navigator.msMaxTouchPoints,supportSVG=!!window.SVGSVGElement,winWidth=window.innerWidth?window.innerWidth:$(window).width(),winHeight=window.innerHeight?window.innerHeight:$(window).height(),html='<div id="swipebox-overlay">				<div id="swipebox-slider"></div>				<div id="swipebox-caption"></div>				<div id="swipebox-action">					<a id="swipebox-close"></a>					<a id="swipebox-prev"></a>					<a id="swipebox-next"></a>				</div>		</div>';plugin.settings={};plugin.init=function(){plugin.settings=$.extend({},defaults,options);if($.isArray(elem)){elements=elem;ui.target=$(window);ui.init(plugin.settings.initialIndexOnArray)}else{$selector.click(function(e){elements=[];var index,relType,relVal;if(!relVal){relType="rel";relVal=$(this).attr(relType)}if(relVal&&relVal!==""&&relVal!=="nofollow"){$elem=$selector.filter("["+relType+'="'+relVal+'"]')}else{$elem=$(selector)}$elem.each(function(){var title=null,href=null;if($(this).attr("title"))title=$(this).attr("title");if($(this).attr("href"))href=$(this).attr("href");elements.push({href:href,title:title})});index=$elem.index($(this));e.preventDefault();e.stopPropagation();ui.target=$(e.target);ui.init(index)})}};plugin.refresh=function(){if(!$.isArray(elem)){ui.destroy();$elem=$(selector);ui.actions()}};var ui={init:function(index){if(plugin.settings.beforeOpen)plugin.settings.beforeOpen();this.target.trigger("swipebox-start");$.swipebox.isOpen=true;this.build();this.openSlide(index);this.openMedia(index);this.preloadMedia(index+1);this.preloadMedia(index-1)},build:function(){var $this=this;$("body").append(html);if($this.doCssTrans()){$("#swipebox-slider").css({"-webkit-transition":"left 0.4s ease","-moz-transition":"left 0.4s ease","-o-transition":"left 0.4s ease","-khtml-transition":"left 0.4s ease",transition:"left 0.4s ease"});$("#swipebox-overlay").css({"-webkit-transition":"opacity 1s ease","-moz-transition":"opacity 1s ease","-o-transition":"opacity 1s ease","-khtml-transition":"opacity 1s ease",transition:"opacity 1s ease"});$("#swipebox-action, #swipebox-caption").css({"-webkit-transition":"0.5s","-moz-transition":"0.5s","-o-transition":"0.5s","-khtml-transition":"0.5s",transition:"0.5s"})}if(supportSVG){var bg=$("#swipebox-action #swipebox-close").css("background-image");bg=bg.replace("png","svg");$("#swipebox-action #swipebox-prev,#swipebox-action #swipebox-next,#swipebox-action #swipebox-close").css({"background-image":bg})}$.each(elements,function(){$("#swipebox-slider").append('<div class="slide"></div>')});$this.setDim();$this.actions();$this.keyboard();$this.gesture();$this.animBars();$this.resize()},setDim:function(){var width,height,sliderCss={};if("onorientationchange"in window){window.addEventListener("orientationchange",function(){if(window.orientation==0){width=winWidth;height=winHeight}else if(window.orientation==90||window.orientation==-90){width=winHeight;height=winWidth}},false)}else{width=window.innerWidth?window.innerWidth:$(window).width();height=window.innerHeight?window.innerHeight:$(window).height()}sliderCss={width:width,height:height};$("#swipebox-overlay").css(sliderCss)},resize:function(){var $this=this;$(window).resize(function(){$this.setDim()}).resize()},supportTransition:function(){var prefixes="transition WebkitTransition MozTransition OTransition msTransition KhtmlTransition".split(" ");for(var i=0;i<prefixes.length;i++){if(document.createElement("div").style[prefixes[i]]!==undefined){return prefixes[i]}}return false},doCssTrans:function(){if(plugin.settings.useCSS&&this.supportTransition()){return true}},gesture:function(){if(isTouch){var $this=this,distance=null,swipMinDistance=10,startCoords={},endCoords={};var bars=$("#swipebox-caption, #swipebox-action");bars.addClass("visible-bars");$this.setTimeout();$("body").bind("touchstart",function(e){$(this).addClass("touching");endCoords=e.originalEvent.targetTouches[0];startCoords.pageX=e.originalEvent.targetTouches[0].pageX;$(".touching").bind("touchmove",function(e){e.preventDefault();e.stopPropagation();endCoords=e.originalEvent.targetTouches[0]});return false}).bind("touchend",function(e){e.preventDefault();e.stopPropagation();distance=endCoords.pageX-startCoords.pageX;if(distance>=swipMinDistance){$this.getPrev()}else if(distance<=-swipMinDistance){$this.getNext()}else{if(!bars.hasClass("visible-bars")){$this.showBars();$this.setTimeout()}else{$this.clearTimeout();$this.hideBars()}}$(".touching").off("touchmove").removeClass("touching")})}},setTimeout:function(){if(plugin.settings.hideBarsDelay>0){var $this=this;$this.clearTimeout();$this.timeout=window.setTimeout(function(){$this.hideBars()},plugin.settings.hideBarsDelay)}},clearTimeout:function(){window.clearTimeout(this.timeout);this.timeout=null},showBars:function(){var bars=$("#swipebox-caption, #swipebox-action");if(this.doCssTrans()){bars.addClass("visible-bars")}else{$("#swipebox-caption").animate({top:0},500);$("#swipebox-action").animate({bottom:0},500);setTimeout(function(){bars.addClass("visible-bars")},1e3)}},hideBars:function(){var bars=$("#swipebox-caption, #swipebox-action");if(this.doCssTrans()){bars.removeClass("visible-bars")}else{$("#swipebox-caption").animate({top:"-50px"},500);$("#swipebox-action").animate({bottom:"-50px"},500);setTimeout(function(){bars.removeClass("visible-bars")},1e3)}},animBars:function(){var $this=this;var bars=$("#swipebox-caption, #swipebox-action");bars.addClass("visible-bars");$this.setTimeout();$("#swipebox-slider").click(function(e){if(!bars.hasClass("visible-bars")){$this.showBars();$this.setTimeout()}});$("#swipebox-action").hover(function(){$this.showBars();bars.addClass("force-visible-bars");$this.clearTimeout()},function(){bars.removeClass("force-visible-bars");$this.setTimeout()})},keyboard:function(){var $this=this;$(window).bind("keyup",function(e){e.preventDefault();e.stopPropagation();if(e.keyCode==37){$this.getPrev()}else if(e.keyCode==39){$this.getNext()}else if(e.keyCode==27){$this.closeSlide()}})},actions:function(){var $this=this;if(elements.length<2){$("#swipebox-prev, #swipebox-next").hide()}else{$("#swipebox-prev").bind("click touchend",function(e){e.preventDefault();e.stopPropagation();$this.getPrev();$this.setTimeout()});$("#swipebox-next").bind("click touchend",function(e){e.preventDefault();e.stopPropagation();$this.getNext();$this.setTimeout()})}$("#swipebox-close").bind("click touchend",function(e){$this.closeSlide()})},setSlide:function(index,isFirst){isFirst=isFirst||false;var slider=$("#swipebox-slider");if(this.doCssTrans()){slider.css({left:-index*100+"%"})}else{slider.animate({left:-index*100+"%"})}$("#swipebox-slider .slide").removeClass("current");$("#swipebox-slider .slide").eq(index).addClass("current");this.setTitle(index);if(isFirst){slider.fadeIn()}$("#swipebox-prev, #swipebox-next").removeClass("disabled");if(index==0){$("#swipebox-prev").addClass("disabled")}else if(index==elements.length-1){$("#swipebox-next").addClass("disabled")}},openSlide:function(index){$("html").addClass("swipebox");$(window).trigger("resize");this.setSlide(index,true)},preloadMedia:function(index){var $this=this,src=null;if(elements[index]!==undefined)src=elements[index].href;if(!$this.isVideo(src)){setTimeout(function(){$this.openMedia(index)},1e3)}else{$this.openMedia(index)}},openMedia:function(index){var $this=this,src=null;if(elements[index]!==undefined)src=elements[index].href;if(index<0||index>=elements.length){return false}if(!$this.isVideo(src)){$this.loadMedia(src,function(){$("#swipebox-slider .slide").eq(index).html(this)})}else{$("#swipebox-slider .slide").eq(index).html($this.getVideo(src))}},setTitle:function(index,isFirst){var title=null;$("#swipebox-caption").empty();if(elements[index]!==undefined)title=elements[index].title;if(title){$("#swipebox-caption").append(title)}},isVideo:function(src){if(src){if(src.match(/youtube\.com\/watch\?v=([a-zA-Z0-9\-_]+)/)||src.match(/vimeo\.com\/([0-9]*)/)){return true}}},getVideo:function(url){var iframe="";var output="";var youtubeUrl=url.match(/watch\?v=([a-zA-Z0-9\-_]+)/);var vimeoUrl=url.match(/vimeo\.com\/([0-9]*)/);if(youtubeUrl){iframe='<iframe width="560" height="315" src="//www.youtube.com/embed/'+youtubeUrl[1]+'" frameborder="0" allowfullscreen></iframe>'}else if(vimeoUrl){iframe='<iframe width="560" height="315"  src="http://player.vimeo.com/video/'+vimeoUrl[1]+"?byline=0&amp;portrait=0&amp;color="+plugin.settings.vimeoColor+'" frameborder="0" webkitAllowFullScreen mozallowfullscreen allowFullScreen></iframe>'}return'<div class="swipebox-video-container" style="max-width:'+plugin.settings.videomaxWidth+'px"><div class="swipebox-video">'+iframe+"</div></div>"},loadMedia:function(src,callback){if(!this.isVideo(src)){var img=$("<img>").on("load",function(){callback.call(img)});img.attr("src",src)}},getNext:function(){var $this=this;index=$("#swipebox-slider .slide").index($("#swipebox-slider .slide.current"));if(index+1<elements.length){index++;$this.setSlide(index);$this.preloadMedia(index+1)}else{$("#swipebox-slider").addClass("rightSpring");setTimeout(function(){$("#swipebox-slider").removeClass("rightSpring")},500)}},getPrev:function(){index=$("#swipebox-slider .slide").index($("#swipebox-slider .slide.current"));if(index>0){index--;this.setSlide(index);this.preloadMedia(index-1)}else{$("#swipebox-slider").addClass("leftSpring");setTimeout(function(){$("#swipebox-slider").removeClass("leftSpring")},500)}},closeSlide:function(){$("html").removeClass("swipebox");$(window).trigger("resize");this.destroy()},destroy:function(){$(window).unbind("keyup");$("body").unbind("touchstart");$("body").unbind("touchmove");$("body").unbind("touchend");$("#swipebox-slider").unbind();$("#swipebox-overlay").remove();if(!$.isArray(elem))elem.removeData("_swipebox");if(this.target)this.target.trigger("swipebox-destroy");$.swipebox.isOpen=false;if(plugin.settings.afterClose)plugin.settings.afterClose()}};plugin.init()};$.fn.swipebox=function(options){if(!$.data(this,"_swipebox")){var swipebox=new $.swipebox(this,options);this.data("_swipebox",swipebox)}return this.data("_swipebox")}}(window,document,jQuery);
/*
 * Swipe 2.0
 *
 * Brad Birdsall
 * Copyright 2013, MIT License
 *
*/

function Swipe(container, options) {

  "use strict";

  // utilities
  var noop = function() {}; // simple no operation function
  var offloadFn = function(fn) { setTimeout(fn || noop, 0) }; // offload a functions execution
  
  // check browser capabilities
  var browser = {
    addEventListener: !!window.addEventListener,
    touch: ('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch,
    transitions: (function(temp) {
      var props = ['transitionProperty', 'WebkitTransition', 'MozTransition', 'OTransition', 'msTransition'];
      for ( var i in props ) if (temp.style[ props[i] ] !== undefined) return true;
      return false;
    })(document.createElement('swipe'))
  };

  // quit if no root element
  if (!container) return;
  var element = container.children[0];
  var slides, slidePos, width, length;
  options = options || {};
  var index = parseInt(options.startSlide, 10) || 0;
  var speed = options.speed || 300;
  options.continuous = options.continuous !== undefined ? options.continuous : true;

  function setup() {

    // cache slides
    slides = element.children;
    length = slides.length;

    // set continuous to false if only one slide
    if (slides.length < 2) options.continuous = false;

    //special case if two slides
    if (browser.transitions && options.continuous && slides.length < 3) {
      element.appendChild(slides[0].cloneNode(true));
      element.appendChild(element.children[1].cloneNode(true));
      slides = element.children;
    }

    // create an array to store current positions of each slide
    slidePos = new Array(slides.length);

    // determine width of each slide
    width = container.getBoundingClientRect().width || container.offsetWidth;

    element.style.width = (slides.length * width) + 'px';

    // stack elements
    var pos = slides.length;
    while(pos--) {

      var slide = slides[pos];

      slide.style.width = width + 'px';
      slide.setAttribute('data-index', pos);

      if (browser.transitions) {
        slide.style.left = (pos * -width) + 'px';
        move(pos, index > pos ? -width : (index < pos ? width : 0), 0);
      }

    }

    // reposition elements before and after index
    if (options.continuous && browser.transitions) {
      move(circle(index-1), -width, 0);
      move(circle(index+1), width, 0);
    }

    if (!browser.transitions) element.style.left = (index * -width) + 'px';

    container.style.visibility = 'visible';

  }

  function prev() {

    if (options.continuous) slide(index-1);
    else if (index) slide(index-1);

  }

  function next() {

    if (options.continuous) slide(index+1);
    else if (index < slides.length - 1) slide(index+1);

  }

  function circle(index) {

    // a simple positive modulo using slides.length
    return (slides.length + (index % slides.length)) % slides.length;

  }

  function slide(to, slideSpeed) {

    // do nothing if already on requested slide
    if (index == to) return;
    
    if (browser.transitions) {

      var direction = Math.abs(index-to) / (index-to); // 1: backward, -1: forward

      // get the actual position of the slide
      if (options.continuous) {
        var natural_direction = direction;
        direction = -slidePos[circle(to)] / width;

        // if going forward but to < index, use to = slides.length + to
        // if going backward but to > index, use to = -slides.length + to
        if (direction !== natural_direction) to =  -direction * slides.length + to;

      }

      var diff = Math.abs(index-to) - 1;

      // move all the slides between index and to in the right direction
      while (diff--) move( circle((to > index ? to : index) - diff - 1), width * direction, 0);
            
      to = circle(to);

      move(index, width * direction, slideSpeed || speed);
      move(to, 0, slideSpeed || speed);

      if (options.continuous) move(circle(to - direction), -(width * direction), 0); // we need to get the next in place
      
    } else {     
      
      to = circle(to);
      animate(index * -width, to * -width, slideSpeed || speed);
      //no fallback for a circular continuous if the browser does not accept transitions
    }

    index = to;
    offloadFn(options.callback && options.callback(index, slides[index]));
  }

  function move(index, dist, speed) {

    translate(index, dist, speed);
    slidePos[index] = dist;

  }

  function translate(index, dist, speed) {

    var slide = slides[index];
    var style = slide && slide.style;

    if (!style) return;

    style.webkitTransitionDuration = 
    style.MozTransitionDuration = 
    style.msTransitionDuration = 
    style.OTransitionDuration = 
    style.transitionDuration = speed + 'ms';

    style.webkitTransform = 'translate(' + dist + 'px,0)' + 'translateZ(0)';
    style.msTransform = 
    style.MozTransform = 
    style.OTransform = 'translateX(' + dist + 'px)';

  }

  function animate(from, to, speed) {

    // if not an animation, just reposition
    if (!speed) {

      element.style.left = to + 'px';
      return;

    }
    
    var start = +new Date;
    
    var timer = setInterval(function() {

      var timeElap = +new Date - start;
      
      if (timeElap > speed) {

        element.style.left = to + 'px';

        if (delay) begin();

        options.transitionEnd && options.transitionEnd.call(event, index, slides[index]);

        clearInterval(timer);
        return;

      }

      element.style.left = (( (to - from) * (Math.floor((timeElap / speed) * 100) / 100) ) + from) + 'px';

    }, 4);

  }

  // setup auto slideshow
  var delay = options.auto || 0;
  var interval;

  function begin() {

    interval = setTimeout(next, delay);

  }

  function stop() {

    delay = 0;
    clearTimeout(interval);

  }


  // setup initial vars
  var start = {};
  var delta = {};
  var isScrolling;      

  // setup event capturing
  var events = {

    handleEvent: function(event) {

      switch (event.type) {
        case 'touchstart': this.start(event); break;
        case 'touchmove': this.move(event); break;
        case 'touchend': offloadFn(this.end(event)); break;
        case 'webkitTransitionEnd':
        case 'msTransitionEnd':
        case 'oTransitionEnd':
        case 'otransitionend':
        case 'transitionend': offloadFn(this.transitionEnd(event)); break;
        case 'resize': offloadFn(setup.call()); break;
      }

      if (options.stopPropagation) event.stopPropagation();

    },
    start: function(event) {

      var touches = event.touches[0];

      // measure start values
      start = {

        // get initial touch coords
        x: touches.pageX,
        y: touches.pageY,

        // store time to determine touch duration
        time: +new Date

      };
      
      // used for testing first move event
      isScrolling = undefined;

      // reset delta and end measurements
      delta = {};

      // attach touchmove and touchend listeners
      element.addEventListener('touchmove', this, false);
      element.addEventListener('touchend', this, false);

    },
    move: function(event) {

      // ensure swiping with one touch and not pinching
      if ( event.touches.length > 1 || event.scale && event.scale !== 1) return

      if (options.disableScroll) event.preventDefault();

      var touches = event.touches[0];

      // measure change in x and y
      delta = {
        x: touches.pageX - start.x,
        y: touches.pageY - start.y
      }

      // determine if scrolling test has run - one time test
      if ( typeof isScrolling == 'undefined') {
        isScrolling = !!( isScrolling || Math.abs(delta.x) < Math.abs(delta.y) );
      }

      // if user is not trying to scroll vertically
      if (!isScrolling) {

        // prevent native scrolling 
        event.preventDefault();

        // stop slideshow
        stop();

        // increase resistance if first or last slide
        if (options.continuous) { // we don't add resistance at the end

          translate(circle(index-1), delta.x + slidePos[circle(index-1)], 0);
          translate(index, delta.x + slidePos[index], 0);
          translate(circle(index+1), delta.x + slidePos[circle(index+1)], 0);

        } else {

          delta.x = 
            delta.x / 
              ( (!index && delta.x > 0               // if first slide and sliding left
                || index == slides.length - 1        // or if last slide and sliding right
                && delta.x < 0                       // and if sliding at all
              ) ?                      
              ( Math.abs(delta.x) / width + 1 )      // determine resistance level
              : 1 );                                 // no resistance if false
          
          // translate 1:1
          translate(index-1, delta.x + slidePos[index-1], 0);
          translate(index, delta.x + slidePos[index], 0);
          translate(index+1, delta.x + slidePos[index+1], 0);
        }

      }

    },
    end: function(event) {

      // measure duration
      var duration = +new Date - start.time;

      // determine if slide attempt triggers next/prev slide
      var isValidSlide = 
            Number(duration) < 250               // if slide duration is less than 250ms
            && Math.abs(delta.x) > 20            // and if slide amt is greater than 20px
            || Math.abs(delta.x) > width/2;      // or if slide amt is greater than half the width

      // determine if slide attempt is past start and end
      var isPastBounds = 
            !index && delta.x > 0                            // if first slide and slide amt is greater than 0
            || index == slides.length - 1 && delta.x < 0;    // or if last slide and slide amt is less than 0

      if (options.continuous) isPastBounds = false;
      
      // determine direction of swipe (true:right, false:left)
      var direction = delta.x < 0;

      // if not scrolling vertically
      if (!isScrolling) {

        if (isValidSlide && !isPastBounds) {

          if (direction) {

            if (options.continuous) { // we need to get the next in this direction in place

              move(circle(index-1), -width, 0);
              move(circle(index+2), width, 0);

            } else {
              move(index-1, -width, 0);
            }

            move(index, slidePos[index]-width, speed);
            move(circle(index+1), slidePos[circle(index+1)]-width, speed);
            index = circle(index+1);  
                      
          } else {
            if (options.continuous) { // we need to get the next in this direction in place

              move(circle(index+1), width, 0);
              move(circle(index-2), -width, 0);

            } else {
              move(index+1, width, 0);
            }

            move(index, slidePos[index]+width, speed);
            move(circle(index-1), slidePos[circle(index-1)]+width, speed);
            index = circle(index-1);

          }

          options.callback && options.callback(index, slides[index]);

        } else {

          if (options.continuous) {

            move(circle(index-1), -width, speed);
            move(index, 0, speed);
            move(circle(index+1), width, speed);

          } else {

            move(index-1, -width, speed);
            move(index, 0, speed);
            move(index+1, width, speed);
          }

        }

      }

      // kill touchmove and touchend event listeners until touchstart called again
      element.removeEventListener('touchmove', events, false)
      element.removeEventListener('touchend', events, false)

    },
    transitionEnd: function(event) {

      if (parseInt(event.target.getAttribute('data-index'), 10) == index) {
        
        if (delay) begin();

        options.transitionEnd && options.transitionEnd.call(event, index, slides[index]);

      }

    }

  }

  // trigger setup
  setup();

  // start auto slideshow if applicable
  if (delay) begin();


  // add event listeners
  if (browser.addEventListener) {
    
    // set touchstart event on element    
    if (browser.touch) element.addEventListener('touchstart', events, false);

    if (browser.transitions) {
      element.addEventListener('webkitTransitionEnd', events, false);
      element.addEventListener('msTransitionEnd', events, false);
      element.addEventListener('oTransitionEnd', events, false);
      element.addEventListener('otransitionend', events, false);
      element.addEventListener('transitionend', events, false);
    }

    // set resize event on window
    window.addEventListener('resize', events, false);

  } else {

    window.onresize = function () { setup() }; // to play nice with old IE

  }

  // expose the Swipe API
  return {
    setup: function() {

      setup();

    },
    slide: function(to, speed) {
      
      // cancel slideshow
      stop();
      
      slide(to, speed);

    },
    prev: function() {

      // cancel slideshow
      stop();

      prev();

    },
    next: function() {

      // cancel slideshow
      stop();

      next();

    },
    getPos: function() {

      // return current index position
      return index;

    },
    getNumSlides: function() {
      
      // return total number of slides
      return length;
    },
    kill: function() {

      // cancel slideshow
      stop();

      // reset element
      element.style.width = 'auto';
      element.style.left = 0;

      // reset slides
      var pos = slides.length;
      while(pos--) {

        var slide = slides[pos];
        slide.style.width = '100%';
        slide.style.left = 0;

        if (browser.transitions) translate(pos, 0, 0);

      }

      // removed event listeners
      if (browser.addEventListener) {

        // remove current event listeners
        element.removeEventListener('touchstart', events, false);
        element.removeEventListener('webkitTransitionEnd', events, false);
        element.removeEventListener('msTransitionEnd', events, false);
        element.removeEventListener('oTransitionEnd', events, false);
        element.removeEventListener('otransitionend', events, false);
        element.removeEventListener('transitionend', events, false);
        window.removeEventListener('resize', events, false);

      }
      else {

        window.onresize = null;

      }

    }
  }

}


if ( window.jQuery || window.Zepto ) {
  (function($) {
    $.fn.Swipe = function(params) {
      return this.each(function() {
        $(this).data('Swipe', new Swipe($(this)[0], params));
      });
    }
  })( window.jQuery || window.Zepto )
}

var slider = (function($){
  
    var buildBullets = function(slider, bullet_holder){
      var number_of_slides = slider.getNumSlides()
      
      for(var i = 0; i < number_of_slides; i++){
        var el = $(document.createElement('li'))
                  .addClass('slider-indicators__indicator')         
        bullet_holder.append(el);        
      }
      
      return bullet_holder.find('.slider-indicators__indicator');
    };
  
    var init = function(slider_selector, indicators_selector){

      var bullet_holder = $(indicators_selector);      
      var slider_element = $(slider_selector).get(0);
      
      var slider_moved = function(pos){
        bullets.attr('class', 'slider-indicators__indicator');
        bullets.eq(pos).addClass('is-active');
      };
            
      var slider = Swipe(slider_element, {
          continuous: true,
          callback: slider_moved
      });
      
      bullet_holder.on('click', '.slider-indicators__indicator', function(ev){
                    var index = $(event.currentTarget).find('.slider-indicators__indicator').index(event.target);
                    slider.slide(index, 300)
                  });
      

      var bullets = buildBullets(slider, bullet_holder);
      bullets.eq(slider.getPos()).addClass('is-active');
    };
    
    return {
      slidify: init
    };
  
})($);
function addCodeLineNumbers() {
  if (navigator.appName === 'Microsoft Internet Explorer') { return; }
  $('div.gist-highlight').each(function(code) {
    var tableStart = '<table><tbody><tr><td class="gutter">',
      lineNumbers = '<pre class="line-numbers">',
      tableMiddle = '</pre></td><td class="code">',
      tableEnd = '</td></tr></tbody></table>',
      count = $('.line', code).length;
    for (var i=1;i<=count; i++) {
      lineNumbers += '<span class="line-number">'+i+'</span>\n';
    }
    var table = tableStart + lineNumbers + tableMiddle + '<pre>'+$('pre', code).html()+'</pre>' + tableEnd;
    $(code).html(table);
  });
}


(function(){

  nav = $('.page-post .navbar').removeAttr('data-500-start data-540-start');
  $('.page-post .site-header__footer').removeAttr('data-400-start data-500-start');

  $('.navbar-collapse').on('show.bs.collapse', function() {
    $('#navToggler').addClass('opened');
  });

  $('.navbar-collapse').on('hide.bs.collapse', function() {
    $('#navToggler').removeClass('opened');
  });

})();

(function(){

  $(".rotate").textrotator({
    animation: "flip",
    separator: ",",
    speed: 2000
  });

})();

(function(){

  if($('#slider').length > 0){
    slider.slidify('#slider', '#slider_nav');
  }

})();

(function(){

  $(function() {
    $('.swipebox').swipebox();
    addCodeLineNumbers();
  });

})();


(function(){
  function isTouchy(){
    //  Hacky
    return (/Android|iPhone|iPad|iPod|BlackBerry|Windows Phone/i).test(navigator.userAgent || navigator.vendor || window.opera) || Modernizr.touch;
  }

  if (!isTouchy()){
    skrollr.init({forceHeight: false});
  }
})();



if (navigator.userAgent.match(/IEMobile\/10\.0/)) {
  var msViewportStyle = document.createElement("style")
  msViewportStyle.appendChild(
    document.createTextNode(
      "@-ms-viewport{width:auto!important}"
    )
  )
  document.getElementsByTagName("head")[0].appendChild(msViewportStyle)
}