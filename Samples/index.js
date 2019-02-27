STK.namespace("v6page", function (a, b) {
    var STK = arguments[0],
        $ = arguments[1];
    STK.register("lib.kit.io.ajax",
        function (a) {
            var b = function (b, c, d) {
                c = c | 0 || 1;
                d = d || "fail";
                var e = b.args;
                e.__rnd && delete e.__rnd;
                (new Image).src = "//weibolog.sinaapp.com/?t=" + c + "&u=" + encodeURIComponent(b.url) + "&p=" + encodeURIComponent(a.core.json.jsonToQuery(e)) + "&m=" + d;
                (new Image).src = "//s1.sinaedge.com/whb.gif?t=" + c + "&u=" + encodeURIComponent(b.url) + "&p=" + encodeURIComponent(a.core.json.jsonToQuery(e)) + "&m=" + d
            };
            return function (c) {
                var d = {},
                    e = [],
                    f = null,
                    g = !1,
                    h = a.parseParam({
                        url: "",
                        method: "get",
                        responseType: "json",
                        timeout: 3e4,
                        onTraning: a.funcEmpty,
                        isEncode: !0
                    }, c);
                h.onComplete = function (a) {
                    g = !1;
                    c.onComplete(a, h.args);
                    setTimeout(i, 0)
                };
                h.onFail = function (a) {
                    g = !1;
                    if (typeof c.onFail == "function") try {
                        c.onFail(a, h.args)
                    } catch (d) {}
                    setTimeout(i, 0);
                    try {
                        b(h)
                    } catch (d) {}
                };
                h.onTimeout = function (a) {
                    try {
                        b(h);
                        c.onTimeout(a)
                    } catch (d) {}
                };
                var i = function () {
                        if (!!e.length) {
                            if (g === !0) return;
                            g = !0;
                            h.args = e.shift();
                            if (h.method.toLowerCase() == "post") {
                                var b = a.core.util.URL(h.url);
                                b.setParam("__rnd", +(new Date));
                                h.url = b.toString()
                            }
                            f = a.ajax(h)
                        }
                    },
                    j = function (a) {
                        while (e.length) e.shift();
                        g = !1;
                        if (f) try {
                            f.abort()
                        } catch (b) {}
                        f = null
                    };
                d.request = function (a) {
                    a || (a = {});
                    c.noQueue && j();
                    if (!c.uniqueRequest || !f) {
                        e.push(a);
                        a._t = 0;
                        i()
                    }
                };
                d.abort = j;
                return d
            }
        });
    STK.register("lib.kit.io.jsonp", function (a) {
        return function (b) {
            var c = a.parseParam({
                    url: "",
                    method: "get",
                    responseType: "json",
                    varkey: "_v",
                    timeout: 3e4,
                    onComplete: a.funcEmpty,
                    onTraning: a.funcEmpty,
                    onFail: a.funcEmpty,
                    isEncode: !0
                }, b),
                d = [],
                e = {},
                f = !1,
                g = function () {
                    if (!!d.length) {
                        if (f === !0) return;
                        f = !0;
                        e.args = d.shift();
                        e.onComplete = function (a) {
                            f = !1;
                            c.onComplete(a, e.args);
                            setTimeout(g, 0)
                        };
                        e.onFail = function (a) {
                            f = !1;
                            c.onFail(a);
                            setTimeout(g, 0)
                        };
                        a.jsonp(a.core.json.merge(c, {
                            args: e.args,
                            onComplete: function (a) {
                                e.onComplete(a)
                            },
                            onFail: function (a) {
                                try {
                                    e.onFail(a)
                                } catch (b) {}
                            }
                        }))
                    }
                },
                h = {};
            h.request = function (a) {
                a || (a = {});
                d.push(a);
                a._t = 1;
                g()
            };
            h.abort = function (a) {
                while (d.length) d.shift();
                f = !1;
                e = null
            };
            return h
        }
    });
    STK.register("lib.kit.io.ijax", function (a) {
        return function (b) {
            var c = a.parseParam({
                    url: "",
                    timeout: 3e4,
                    isEncode: !0,
                    abaurl: null,
                    responseName: null,
                    varkey: "callback",
                    abakey: "callback"
                }, b),
                d = [],
                e = null,
                f = !1;
            c.onComplete = function (a, d) {
                f = !1;
                b.onComplete(a, c.form, d);
                c.form = null;
                c.args = null;
                setTimeout(g, 0)
            };
            c.onFail = function (a, d) {
                f = !1;
                b.onFail(a, c.form, d);
                c.form = null;
                c.args = null;
                setTimeout(g, 0)
            };
            var g = function () {
                    var b;
                    if (!!d.length) {
                        if (f === !0) return;
                        f = !0;
                        b = d.shift();
                        c.args = b.args;
                        c.form = b.form;
                        e = a.ijax(c)
                    }
                },
                h = function (a) {
                    while (d.length) d.shift();
                    f = !1;
                    if (e) try {
                        e.abort()
                    } catch (b) {}
                    e = null
                },
                i = {};
            i.request = function (c, e) {
                if (!a.isNode(c)) throw "[lib.kit.io.ijax.request] need a form as first parameter";
                e || (e = {});
                b.noQueue && h();
                d.push({
                    form: c,
                    args: e
                });
                g()
            };
            i.abort = h;
            return i
        }
    });
    STK.register("lib.kit.io.inter", function (a) {
        var b = a.core.json.merge;
        return function () {
            var c = {},
                d = {},
                e = {},
                f = function (a, b) {
                    return function (c, d) {
                        try {
                            b.onComplete(c, d)
                        } catch (f) {}
                        try {
                            c.code === "100000" ? b.onSuccess(c, d) : b.onError(c, d)
                        } catch (f) {}
                        for (var g in e[a]) try {
                            e[a][g](c, d)
                        } catch (f) {}
                    }
                },
                g = function (a, b, c) {
                    return function (d) {
                        try {
                            b.onComplete(d, c)
                        } catch (f) {}
                        try {
                            d.code === "100000" ? b.onSuccess(d, c) : b.onError(d, c)
                        } catch (f) {}
                        for (var g in e[a]) try {
                            e[a][g](d, c)
                        } catch (f) {}
                    }
                };
            c.register = function (a, b) {
                if (typeof d[a] != "undefined") throw a + " registered";
                d[a] = b;
                e[a] = {}
            };
            c.addHook = function (b, c) {
                var d = a.core.util.getUniqueKey();
                e[b][d] = c;
                return d
            };
            c.rmHook = function (a, b) {
                e[a] && e[a][b] && delete e[a][b]
            };
            c.getTrans = function (c, e) {
                var g = b(d[c], e);
                g.onComplete = f(c, e);
                g.url += (g.url.indexOf("?") >= 0 ? "&" : "?") + "ajwvr=6";
                g.withDomain && (g.url += "&domain=" + $CONFIG.domain);
                var h = d[c].requestMode,
                    i = "ajax";
                if (h === "jsonp" || h === "ijax") i = h;
                return a.lib.kit.io[i](g)
            };
            c.request = function (c, e, f) {
                var h = b(d[c], e);
                h.onComplete = g(c, e, f);
                h.url += (h.url.indexOf("?") >= 0 ? "&" : "?") + "ajwvr=6";
                h.withDomain && (h.url += "&domain=" + $CONFIG.domain);
                h = a.core.obj.cut(h, ["noqueue"]);
                h.args = f;
                var i = d[c].requestMode;
                return i === "jsonp" ? a.jsonp(h) : i === "ijax" ? a.ijax(h) : a.ajax(h)
            };
            return c
        }
    });
    STK.register("conf.trans.relation", function (a) {
        var b = a.lib.kit.io.inter(),
            c = b.register;
        c("cfinvite", {
            url: "/aj/invite/unread",
            method: "get"
        });
        c("followby", {
            url: "/aj/relation/followbyother",
            method: "get"
        });
        c("adds", {
            url: "/aj/relation/groupupdate",
            method: "post"
        });
        c("addmulti", {
            url: "/aj/f/group/update",
            method: "post"
        });
        c("addone", {
            url: "/aj/relation/groupupdate",
            method: "post"
        });
        c("removes", {
            url: "/aj/f/group/remove",
            method: "post"
        });
        c("unFollow", {
            url: "/aj/f/unfollow",
            method: "post"
        });
        c("remarkname", {
            url: "/aj/f/remarkname",
            method: "post"
        });
        c("addgroup", {
            url: "/aj/f/group/add",
            method: "post"
        });
        c("renameGroup", {
            url: "/aj/relation/rename",
            method: "post"
        });
        c("deletegroup", {
            url: "/aj/relation/delete",
            method: "post"
        });
        c("removecf", {
            url: "/aj/f/removeclosefriend",
            method: "post"
        });
        c("getLeftNavCount", {
            url: "/aj/relation/groupnums",
            method: "post"
        });
        c("getInviteList", {
            url: "/aj/invite/mailinvite",
            method: "post"
        });
        c("getInviteMessage", {
            url: "/aj/invite/mobileinvite",
            method: "post"
        });
        c("cleartrashfans", {
            url: "/aj/f/trash/cleartrashfans",
            method: "post"
        });
        c("deltrashfans", {
            url: "/aj/f/trash/deltrashfans",
            method: "post"
        });
        c("confirmfans", {
            url: "/aj/f/trash/confirmfans",
            method: "post"
        });
        c("recommendfollow", {
            url: "/aj/f/recomafterfollow",
            method: "get"
        });
        c("closerecommend", {
            url: "/aj/f/closerecommend",
            method: "get"
        });
        c("newuserguide", {
            url: "/aj/user/interest/newuserguide",
            method: "get"
        });
        c("mayinterested", {
            url: "/aj/user/interest/list",
            method: "get"
        });
        c("uninterested", {
            url: "/aj/user/interest/uninterested",
            method: "post"
        });
        c("userCard", {
            url: "/aj/user/cardv5",
            method: "get"
        });
        c("userCard2", {
            url: "//weibo.com/aj/user/newcard",
            method: "get",
            requestMode: "jsonp",
            varkey: "callback"
        });
        c("userCard2_abroad", {
            url: "//www.weibo.com/aj/user/newcard",
            method: "get",
            requestMode: "jsonp",
            varkey: "callback"
        });
        c("follow", {
            url: "/aj/f/followed",
            method: "post"
        });
        c("follow_register", {
            url: "/nguide/aj/relation/followed",
            method: "post"
        });
        c("unfollow_register", {
            url: "/nguide/aj/relation/unfollow",
            method: "post"
        });
        c("block", {
            url: "/aj/f/addblack",
            method: "post"
        });
        c("unBlock", {
            url: "/aj/f/delblack",
            method: "post"
        });
        c("removeFans", {
            url: "/aj/f/remove",
            method: "post"
        });
        c("requestFollow", {
            url: "/ajax/relation/requestfollow",
            method: "post"
        });
        c("questions", {
            url: "/aj/invite/attlimit",
            method: "get"
        });
        c("answer", {
            url: "/aj/invite/att",
            method: "post"
        });
        c("setRemark", {
            url: "/aj/f/remarkname",
            method: "post"
        });
        c("recommendusers", {
            url: "/aj/f/recommendusers",
            method: "get"
        });
        c("recommendAttUsers", {
            url: "/aj/f/worthfollowusers",
            method: "get"
        });
        c("recommendPopularUsers", {
            url: "/aj/user/interest/recommendpopularusers",
            method: "get"
        });
        c("mayinterestedweiqun", {
            url: "/aj/weiqun/getinterestedlist",
            method: "get"
        });
        c("moreData", {
            url: "/aj/f/listuserdetail",
            method: "get"
        });
        c("getInvite", {
            url: "/aj/invite/unread",
            method: "get"
        });
        c("quiet_addUser", {
            url: "/aj/f/addwhisper",
            method: "post"
        });
        c("quiet_removeUser", {
            url: "/aj/f/delwhisper",
            method: "post"
        });
        c("quiet_know", {
            url: "/aj/tipsbar/closetipsbar",
            method: "post"
        });
        c("groupUserList", {
            url: "/aj/f/group/getgroupmembers",
            method: "get"
        });
        c("groupSubmit", {
            url: "/aj/f/group/list",
            method: "get"
        });
        c("wqList", {
            url: "/aj/proxy?api=//recom.i.t.sina.com.cn/1/weiqun/weiqun_may_interest.php",
            method: "get"
        });
        c("uninterestedWq", {
            url: "/aj/proxy?api=//recom.i.t.sina.com.cn/1/weiqun/weiqun_uninterest.php",
            method: "get"
        });
        c("inviteNeglect", {
            url: "/aj/invite/handleinvite",
            method: "post"
        });
        c("checkNeglect", {
            url: "/aj/invite/shieldedlist",
            method: "post"
        });
        c("inviteLift", {
            url: "/aj/invite/lift",
            method: "post"
        });
        c("inviteAccept", {
            url: "/aj/invite/handleinvite",
            method: "post"
        });
        c("searchByTel", {
            url: "/aj/relation/getuserbymobile",
            method: "post"
        });
        c("inviteCloseTips", {
            url: "/aj/invite/closetips",
            method: "post"
        });
        c("checkrelation", {
            url: "/aj/f/checkrelation",
            method: "post"
        });
        c("addCloseFriend", {
            url: "/aj/f/createclosefriend",
            method: "post"
        });
        c("recommendCf", {
            url: "/aj/user/closefriend/recommend",
            method: "get"
        });
        c("clearInvalidUsers", {
            url: "/aj/f/clearinvalidfriends",
            method: "post"
        });
        c("unIstCf", {
            url: "/aj/user/closefriend/deny",
            method: "post"
        });
        c("fanslikemore", {
            url: "/aj/relation/fanslikemore",
            method: "get"
        });
        c("getProfileInfo", {
            url: "/aj/relation/getprofileinfo",
            method: "get"
        });
        c("interestlist", {
            url: "/aj/user/interest/profileinfo",
            method: "get"
        });
        c("recommendGroupMember", {
            url: "/aj/user/group/recommend",
            method: "get"
        });
        c("followGroup", {
            url: "/aj/f/group/followedgroup",
            method: "post"
        });
        c("recommendWholeGroup", {
            url: "/aj/relation/rename",
            method: "post"
        });
        c("recommendUserAdd", {
            url: "/aj/f/group/addrecommenduser",
            method: "post"
        });
        c("recommendUserRemove", {
            url: "/aj/f/group/remove",
            method: "post"
        });
        c("specialAttentionClose", {
            url: "/aj/limit/increment",
            method: "get"
        });
        c("friendShield", {
            url: "/aj/mblog/friendsmblogshield",
            method: "post"
        });
        c("friendRecover", {
            url: "/aj/mblog/friendsshieldrecover",
            method: "post"
        });
        c("rightmod_getCloseFriendRecommend", {
            url: "/aj/f/recomfriendsmore",
            method: "get"
        });
        c("unsubscribe", {
            url: "/aj/relation/unsubscribe",
            method: "post"
        });
        c("batch", {
            url: "/aj/f/group/batch",
            method: "post"
        });
        c("attention", {
            url: "/aj/relation/attention",
            method: "get"
        });
        c("recommend", {
            url: "/aj/f/group/recommend",
            method: "get"
        });
        c("interest_uninterested", {
            url: "/aj/relation/uninterested",
            method: "post"
        });
        c("clearTrash", {
            url: "/p/aj/relation/cleanfans",
            method: "post"
        });
        c("scanfans", {
            url: "/p/aj/relation/scanfans",
            method: "post"
        });
        c("getquiet", {
            url: "/aj/f/lenovo",
            method: "get"
        });
        c("interestUnFollow", {
            url: "/p/aj/relation/unfollow",
            method: "post"
        });
        c("removeGroup", {
            url: "/p/aj/groupchat/removeuser",
            method: "post"
        });
        c("reportGroup", {
            url: "/aj/groupchat/report",
            method: "post"
        });
        c("shieldGroup", {
            url: "/aj/groupchat/addblack",
            method: "post"
        });
        c("joinGroup", {
            url: "/p/aj/groupchat/applygroup",
            method: "post"
        });
        c("quietuserIgnore", {
            url: "/p/aj/relation/ignoreslientuser",
            method: "post"
        });
        c("addSpeical", {
            url: "/aj/f/group/addspecial",
            method: "post"
        });
        c("delSpecial", {
            url: "/aj/f/group/delspecial",
            method: "post"
        });
        return b
    });
    STK.register("lib.kit.extra.listener", function (a) {
        var b = {},
            c = {};
        c.define = function (c, d) {
            if (b[c] != null) throw "lib.kit.extra.listener.define: 频道已被占用";
            b[c] = d;
            var e = {};
            e.register = function (d, e) {
                if (b[c] == null) throw "lib.kit.extra.listener.define: 频道未定义";
                a.listener.register(c, d, e)
            };
            e.fire = function (d, e) {
                if (b[c] == null) throw "commonlistener.define: 频道未定义";
                a.listener.fire(c, d, e)
            };
            e.remove = function (b, d) {
                a.listener.remove(c, b, d)
            };
            e.cache = function (b) {
                return a.listener.cache(c, b)
            };
            return e
        };
        return c
    });
    STK.register("conf.channel.follow", function (a) {
        var b = ["changeStatus", "specialFollow"];
        return a.lib.kit.extra.listener.define("conf.channel.follow", b)
    });
    STK.register("lib.kit.extra.language", function (a) {
        window.$LANG || (window.$LANG = {});
        return function (b) {
            var c = [].splice.call(arguments, 1, arguments.length),
                d = [b, $LANG].concat(c),
                e = a.core.util.language.apply(this, d);
            return e
        }
    });
    STK.register("lib.kit.extra.merge", function (a) {
        return function (a, b) {
            var c = {};
            for (var d in a) c[d] = a[d];
            for (var d in b) c[d] = b[d];
            return c
        }
    });
    STK.register("conf.trans.follow", function (a) {
        var b = a.lib.kit.io.inter(),
            c = b.register;
        c("follow", {
            url: "/aj/f/followed",
            method: "post"
        });
        c("follows", {
            url: "//weibo.com/aj/f/followed",
            method: "get",
            requestMode: "jsonp",
            varkey: "callback"
        });
        c("unFollow", {
            url: "/aj/f/unfollow",
            method: "post"
        });
        c("block", {
            url: "/aj/f/addblack",
            method: "post"
        });
        c("unBlock", {
            url: "/aj/f/delblack",
            method: "post"
        });
        c("removeFans", {
            url: "/aj/f/remove",
            method: "post"
        });
        c("follow_object", {
            url: "/p/aj/relation/follow",
            method: "post"
        });
        c("unFollow_object", {
            url: "/p/aj/relation/unfollow",
            method: "post"
        });
        c("unloginfollow", {
            url: "/p/aj/official/unloginfollow",
            method: "post"
        });
        c("proxy", {
            url: "/aj/proxy",
            method: "post"
        });
        c("recommend", {
            url: "/aj/f/recomafterfollowv2",
            method: "get"
        });
        c("removeFollow", {
            url: "/aj/f/removerecomfollow",
            method: "get"
        });
        return b
    });
    STK.register("conf.trans.validateCode", function (a) {
        var b = a.lib.kit.io.inter(),
            c = b.register;
        c("checkValidate", {
            url: "/aj/pincode/verified",
            method: "post"
        });
        return b
    });
    STK.register("lib.kit.io.cssLoader", function (a) {
        var b = "",
            c = "//img.t.sinajs.cn/t4/",
            d = "//timg.sjs.sinajs.cn/t4/";
        if (typeof $CONFIG != "undefined") {
            c = $CONFIG.cssPath || c;
            b = $CONFIG.version || ""
        }
        var e = {};
        return function (f, g, h, i, j) {
            i = i || b;
            h = h || function () {};
            var k = function (a, b) {
                    var c = e[a] || (e[a] = {
                        loaded: !1,
                        list: []
                    });
                    if (c.loaded) {
                        b(a);
                        return !1
                    }
                    c.list.push(b);
                    return c.list.length > 1 ? !1 : !0
                },
                l = function (a) {
                    var b = e[a].list;
                    for (var c = 0; c < b.length; c++) b[c](a);
                    e[a].loaded = !0;
                    delete e[a].list
                };
            if (!!k(f, h)) {
                var m;
                j ? m = d + f : m = c + f + "?version=" + i;
                var n = a.C("link");
                n.setAttribute("rel", "Stylesheet");
                n.setAttribute("type", "text/css");
                n.setAttribute("charset", "utf-8");
                n.setAttribute("href", m);
                document.getElementsByTagName("head")[0].appendChild(n);
                var o = a.C("div");
                o.id = g;
                a.core.util.hideContainer.appendChild(o);
                var p = 3e3,
                    q = function () {
                        if (parseInt(a.core.dom.getStyle(o, "height")) == 42) {
                            a.core.util.hideContainer.removeChild(o);
                            l(f)
                        } else if (--p > 0) setTimeout(q, 10);
                        else {
                            a.log(f + "timeout!");
                            a.core.util.hideContainer.removeChild(o);
                            delete e[f]
                        }
                    };
                setTimeout(q, 50)
            }
        }
    });
    STK.register("lib.dialog.loginLayer", function (a) {
        var b, c = "//tjs.sjs.sinajs.cn/t5/register/js/page/remote/loginLayer.js?version=";
        return function (d) {
            d = a.core.obj.parseParam({
                lang: "zh-cn",
                loginSuccessUrl: encodeURIComponent(window.location.href),
                version: window.$CONFIG && window.$CONFIG.version || "20170103"
            }, d || {});
            "$CONFIG" in window || (window.$CONFIG = {});
            window.$CONFIG.sinaSSOControllerTemporary = window.$CONFIG.sinaSSOControllerTemporary || {};
            if (!window.$CONFIG.sinaSSOControllerTemporary.lock) {
                window.$CONFIG.sinaSSOControllerTemporary.lock = !0;
                if (window.sinaSSOController) {
                    window.sinaSSOController.loginSuccessUrl && window.sinaSSOController.loginSuccessUrl.indexOf("comefrom=loginlayer") > -1 ? window.$CONFIG.sinaSSOControllerTemporary.top = window.sinaSSOController : window.$CONFIG.sinaSSOControllerTemporary.oth = window.sinaSSOController;
                    window.sinaSSOController = window.$CONFIG.sinaSSOControllerTemporary.top || {}
                }
                if (window.WBtopGlobal_loginLayer) window.WBtopGlobal_loginLayer(d);
                else {
                    if (b) return;
                    b = !0;
                    a.core.io.scriptLoader({
                        url: c + d.version,
                        onComplete: function () {
                            b = !1;
                            window.WBtopGlobal_loginLayer(d)
                        },
                        timeout: 1e4,
                        onTimeout: function () {
                            b = !1
                        }
                    })
                }
            }
        }
    });
    STK.register("lib.dialog.authentication", function (a) {
        return function (b) {
            var c = a.lib.kit.extra.language,
                d = a.core.util.browser;
            b = a.parseParam({
                src: "//weibo.com/a/verify/realname?stage=home_verification",
                icon: "warn",
                isHold: !0,
                width: "380px",
                height: "240px",
                title: c("#L{帐号验证}")
            }, b || {});
            var e = {},
                f, g, h = !1,
                i = "tblog_checkfailed_reform",
                j = {
                    init: function () {
                        f = a.ui.dialog(b);
                        var c = [];
                        c.push('<iframe id="account_authentication" name="account_authentication" node-type="frame" width="' + b.width + '" height="' + b.height + '" allowtransparency="true" scrolling="no" frameborder="0" src=""></iframe>');
                        var d = a.builder(c.join(""));
                        f.setTitle(b.title);
                        f.setContent(d.box);
                        var e = f.getDomList()
                    },
                    show: function () {
                        try {
                            window.SUDA && SUDA.uaTrack && SUDA.uaTrack(i, "checkfailed_box")
                        } catch (c) {}
                        h || a.lib.kit.io.cssLoader("style/css/module/layer/layer_check_identity.css", "js_style_css_module_layer_check_identity", function () {
                            h = !0
                        });
                        f.show().setMiddle();
                        g = a.E("account_authentication");
                        var d = decodeURIComponent(b.src) + "&rnd=";
                        g.attachEvent ? g.attachEvent("onload", function () {
                            g.height = b.height;
                            f.setMiddle()
                        }) : g.onload = function () {
                            g.height = b.height;
                            f.setMiddle()
                        };
                        g.src = d + a.core.util.getUniqueKey()
                    },
                    destroy: function () {},
                    hook: function (a, b) {
                        try {
                            a == "100000" ? j.verifySucc() : j.verifyFail()
                        } catch (c) {}
                    },
                    verifySucc: function () {
                        window.SUDA && SUDA.uaTrack && SUDA.uaTrack(i, "checkfailed_success");
                        f.hide();
                        var b = {
                                title: c("#L{提示}"),
                                icon: "success",
                                OK: function () {
                                    window.SUDA && SUDA.uaTrack && SUDA.uaTrack(i, "checkfailed_play");
                                    history.go(0)
                                },
                                OKText: c("#L{进入首页}"),
                                msg: c("#L{恭喜，您的身份已验证成功，马上进入微博。}")
                            },
                            d = a.ui.alert(b.msg, b);
                        a.custEvent.add(d, "hide", function () {
                            history.go(0)
                        })
                    },
                    verifyFail: function () {
                        window.SUDA && SUDA.uaTrack && SUDA.uaTrack(i, "checkfailed_twotimes");
                        f.hide();
                        var b = {
                                title: c("#L{提示}"),
                                icon: "warn",
                                OK: function () {
                                    SUDA.uaTrack && SUDA.uaTrack(i, "checkfailed_triple");
                                    j.show()
                                },
                                OKText: c("#L{再次验证}"),
                                msg: c("#L{抱歉，您的身份信息不准确，请再次验证。<br/>}") + '<a class="S_spetxt" suda-data="key=tblog_checkfailed_reform&value=checkfailed_havealook" href="//weibo.com">' + c("#L{您也可以先体验微博，随后再验证身份信息>>}") + "</a>"
                            },
                            d = a.ui.alert(b.msg, b);
                        a.custEvent.add(d, "hide", function () {
                            history.go(0)
                        })
                    }
                };
            j.init();
            e.destroy = j.destory;
            e.show = j.show;
            window.App = window.App || {};
            window.App.checkRealName = j.hook;
            return e
        }
    });
    STK.register("lib.dialog.memberDialog", function (a) {
        var b = '<div node-type="outer" class="layer_point"><dl class="point clearfix"><dt><span class="" node-type="icon"></span></dt><dd node-type="inner"><p class="S_txt1" node-type="textLarge"></p><p class="S_txt1" node-type="textComplex"></p><p class="S_txt2" node-type="textSmall"></p></dd></dl></div><div class="W_layer_btn S_bg1"><a href="javascript:void(0);" class="W_btn_b" node-type="OK"></a><a href="javascript:void(0);" class="W_btn_a" node-type="cancel"></a><a href="http://vip.weibo.com/paycenter?pageid=byebank" class="W_btn_a" node-type="member"><span><em class="W_icon icon_member"></em>#L{立即开通会员}</span></a></div>',
            c = {
                success: "icon_succM",
                error: "icon_errorM",
                warn: "icon_warnM",
                "delete": "icon_delM",
                question: "icon_questionM"
            },
            d = a.lib.kit.extra.language,
            e = function (e, f) {
                var g, h, i, j, k, l;
                g = a.parseParam({
                    title: "&nbsp;",
                    icon: "warn",
                    textLarge: e,
                    textComplex: "",
                    textSmall: "",
                    OK: a.funcEmpty,
                    OKText: d("#L{确定}"),
                    cancel: a.funcEmpty,
                    cancelText: d("#L{确认}")
                }, f);
                g.icon = c[g.icon];
                h = {};
                i = a.ui.dialog();
                i.setContent(d(b));
                l = i.getDomList(!0);
                l.icon.className = g.icon;
                l.textLarge.innerHTML = g.textLarge;
                l.textComplex.innerHTML = g.textComplex;
                l.textSmall.innerHTML = g.textSmall;
                l.OK.innerHTML = "<span>" + g.OKText + "</span>";
                l.cancel.innerHTML = "<span>" + g.cancelText + "</span>";
                i.setTitle(g.title);
                i.getDomList().title.style.borderBottomStyle = "none";
                var m = function () {
                    j = !0;
                    k = a.htmlToJson(l.textComplex);
                    i.hide()
                };
                a.addEvent(l.OK, "click", m);
                a.addEvent(l.cancel, "click", i.hide);
                a.custEvent.add(i, "hide", function () {
                    a.custEvent.remove(i, "hide", arguments.callee);
                    a.removeEvent(l.OK, "click", m);
                    a.removeEvent(l.cancel, "click", i.hide);
                    j ? g.OK(k) : g.cancel(k)
                });
                i.show().setMiddle();
                h.dia = i;
                return h
            };
        return function (b) {
            b = a.parseParam({
                type: "follow",
                errortype: "1"
            }, b);
            var c, f, g = {
                    textLarge: d("#L{您已达到悄悄关注上限！}"),
                    textComplex: d('#L{开通}<a href="http://vip.weibo.com/privilege">#L{微博会员}</a>，#L{悄悄关注上限立即提高}'),
                    textSmall: d('#L{可}<a href="http://vip.weibo.com/paycenter?pageid=byebank" class="S_link2">#L{开通会员}</a>#L{或先将悄悄关注减少至10人以下，再添加}'),
                    OKText: d("#L{管理我的悄悄关注}"),
                    OK: function () {
                        a.preventDefault();
                        window.location.href = "/" + $CONFIG.uid + "/whisper"
                    }
                },
                h = {
                    textLarge: d("#L{您已达到关注上限！}"),
                    textComplex: d('#L{开通}<a href="http://vip.weibo.com/privilege">#L{微博会员}</a>，#L{关注上限立即提高}'),
                    textSmall: d('#L{可}<a href="http://vip.weibo.com/paycenter?pageid=byebank" class="S_link2">#L{开通会员}</a>#L{或先将关注减少至2000人以下，再添加}'),
                    OKText: d("#L{管理我的关注}"),
                    OK: function () {
                        a.preventDefault();
                        window.location.href = "/" + $CONFIG.uid + "/follow"
                    }
                };
            if (b.type == "quiet") {
                switch (parseInt(b.errortype, 10)) {
                    case 2:
                        g.textLarge = d("#L{您当前已达会员等级悄悄关注上限啦！}");
                        g.textSmall = "";
                        g.textComplex = d('<a href="http://vip.weibo.com/privilege" class="S_link2">#L{了解更多会员特权信息»}</a>');
                        break;
                    case 1:
                        g.textLarge = d("#L{您已达到悄悄关注上限！}");
                        g.textSmall = "";
                        g.textComplex = d('#L{开通}<a href="http://vip.weibo.com/privilege">#L{微博会员}</a>，#L{悄悄关注上限立即提高}');
                        break;
                    case 3:
                        g.textLarge = d("#L{您已达到悄悄关注上限！}");
                        g.textComplex = d('#L{开通}<a href="http://vip.weibo.com/privilege">#L{微博会员}</a>，#L{悄悄关注上限立即提高}');
                        g.textSmall = d('#L{可}<a href="http://vip.weibo.com/paycenter">#L{开通会员}</a>#L{或将悄悄关注减少至10人以下，再添加}')
                }
                c = g
            } else {
                switch (parseInt(b.errortype, 10)) {
                    case 2:
                        h.textLarge = d("#L{您当前已达会员等级关注上限啦！}");
                        h.textSmall = "";
                        h.textComplex = d('<a href="http://vip.weibo.com/privilege" class="S_link2">#L{了解更多会员特权信息»}</a>');
                        break;
                    case 1:
                        h.textLarge = d("#L{您已达到关注上限！}");
                        h.textSmall = "";
                        h.textComplex = d('#L{开通}<a href="http://vip.weibo.com/privilege">#L{微博会员}</a>，#L{关注上限立即提高}');
                        break;
                    case 3:
                        h.textLarge = d("#L{您已达到关注上限！}");
                        h.textComplex = d('#L{开通}<a href="http://vip.weibo.com/privilege">#L{微博会员}</a>，#L{关注上限立即提高}');
                        h.textSmall = d('#L{可}<a href="http://vip.weibo.com/paycenter">#L{开通会员}</a>#L{或将关注减少至2000人以下，再添加}')
                }
                c = h
            }
            f = e("", c);
            parseInt(b.errortype, 10) == 2 ? f.dia.getDomList().member.style.display = "none" : f.dia.getDomList().cancel.style.display = "none"
        }
    });
    STK.register("conf.trans.publisher", function (a) {
        var b = a.lib.kit.io.inter(),
            c = b.register;
        c("publish_v6", {
            url: "/aj/mblog/add",
            method: "post"
        });
        c("publish_page", {
            url: "/p/aj/v6/mblog/add",
            method: "post",
            withDomain: !0
        });
        c("publish", {
            url: "/p/aj/v6/mblog/add",
            method: "post",
            withDomain: !0
        });
        c("publishPro", {
            url: "/aj/mblog/add",
            method: "post"
        });
        c("interactive", {
            url: "/aj/mblog/interactive",
            method: "post"
        });
        c("timingPublish", {
            url: "/aj/v6/mblog/addtime",
            method: "post"
        });
        c("getpublish", {
            url: "/p/aj/v6/publish",
            method: "get"
        });
        c("reviewadd", {
            url: "/p/aj/review/add",
            method: "post"
        });
        c("follow", {
            url: "/aj/f/followed",
            method: "post"
        });
        c("proxy", {
            url: "/p/aj/proxy",
            method: "post"
        });
        c("getReEdit", {
            url: "/p/aj/v6/edit",
            method: "get",
            withDomain: !0
        });
        c("checkeditable", {
            url: "/aj/v6/mblog/checkeditable",
            method: "get"
        });
        c("publisherReEdit", {
            url: "/p/aj/v6/mblog/edit",
            method: "post",
            withDomain: !0
        });
        c("getHistoricRecod", {
            url: "/p/aj/v6/history",
            method: "get",
            withDomain: !0
        });
        c("getTopic", {
            url: "/aj/v6/topic/recent",
            method: "get"
        });
        c("queryTopic", {
            url: "/aj/v6/topic/search",
            method: "get"
        });
        return b
    });
    STK.register("lib.dialog.ioError", function (a) {
        var b = a.lib.kit.extra.language,
            c, d;
        return function (d, e, f) {
            var g = {},
                h, i, j = function () {},
                k = {
                    init: function () {
                        k.data()
                    },
                    data: function () {
                        i = a.parseParam({
                            auto: !0,
                            call: j,
                            ok: j,
                            cancel: j,
                            beside: null
                        }, f);
                        h = a.parseParam({
                            location: "",
                            title: "",
                            icon: "",
                            oKText: b("#L{确 定}"),
                            cancelText: b("#L{取 消}"),
                            api: "",
                            reload: "",
                            suda: ""
                        }, e.data);
                        h.msg = e.msg || b("#L{网络繁忙}");
                        e.data && e.data.OKText && (h.okText = e.data.OKText);
                        h.OK = function () {
                            a.preventDefault();
                            var b = a.queryToJson(h.suda || "");
                            b = b.ok || {};
                            window.SUDA && SUDA.uaTrack && b.key && SUDA.uaTrack(b.key, b.value);
                            i.ok();
                            e.data.openNewPage != 1 && h.location && (window.location.href = h.location)
                        };
                        h.cancel = function () {
                            a.preventDefault();
                            var b = a.queryToJson(h.suda || "");
                            b = b.cancel || {};
                            window.SUDA && SUDA.uaTrack && b.key && SUDA.uaTrack(b.key, b.value);
                            i.cancel()
                        }
                    },
                    run: function () {
                        var a = l[e.code] || l[100001];
                        return a() || i.call(h, e)
                    },
                    destroy: function () {
                        c && c.destroy()
                    }
                },
                l = {
                    100001: function () {
                        if (i.beside) a.ui.tipAlert(h.msg, a.core.json.merge(h, {
                            autoHide: !1,
                            icon: "warnS"
                        })).beside(i.beside);
                        else {
                            var b = a.ui.alert(h.msg.split("\\n"), {
                                isCenter: !0
                            }, a.core.json.merge(h, {
                                icon: "warnB"
                            }));
                            a.addClassName(b.getOuter(), "W_translateZ")
                        }
                    },
                    100002: function () {
                        a.lib.dialog.loginLayer({
                            lang: window.$CONFIG && window.$CONFIG.lang || "zh-cn"
                        })
                    },
                    100003: function () {
                        function c() {
                            if (h.location && e.data.openNewPage == 1) h.location && window.open(h.location);
                            else if (h.location) location.href = h.location;
                            else if (h.api) {
                                var c = h.api.split("?"),
                                    d = a.core.json.merge({
                                        api: c[0]
                                    }, a.queryToJson(c[1] || ""));
                                a.conf.trans.publisher.request("proxy", {
                                    onSuccess: function (c) {
                                        a.ui.notice(b(c.msg) || b("#L{请求成功}")).on("hide", function () {
                                            var a = FM.getState();
                                            $CONFIG.bigpipe ? FM.setState(a.split("#")[0] + "#_0") : location.reload()
                                        })
                                    },
                                    onError: function (b) {
                                        a.lib.dialog.ioError(b.code, b)
                                    },
                                    onFail: function (b) {
                                        a.lib.dialog.ioError(b.code, b)
                                    }
                                }, d)
                            }
                        }
                        i.beside ? a.ui.tipConfirm(h.msg, h).ok(c).beside(i.beside) : a.ui.confirm(h.msg.split("\n"), h).ok(c)
                    },
                    100004: function () {
                        c || (c = a.lib.dialog.authentication());
                        c.show()
                    },
                    100005: function () {
                        h.type = e.data && (e.data.type ? e.data.type : "follow");
                        h.errortype = e.data && (e.data.errortype || "1");
                        return a.lib.dialog.memberDialog(h || {})
                    },
                    100008: function () {
                        a.lib.dialog.loginLayer({
                            lang: window.$CONFIG && window.$CONFIG.lang || "zh-cn"
                        })
                    },
                    100012: function () {
                        e.data && window.open(e.data, "_self")
                    }
                };
            k.init();
            g.getdata = function () {
                return h
            };
            g.getAction = function (a) {
                return a ? l[a] : l
            };
            g.getCode = function () {
                return e.code || ""
            };
            g.run = k.run;
            i.auto && k.run();
            return g
        }
    });
    STK.register("lib.dialog.validateCode", function (a) {
        var b = window.$LANG,
            c = a.lib.kit.extra.language,
            d = "/aj/pincode/pin?_wv=5&type=rule&lang=" + $CONFIG.lang + "&ts=",
            e = {
                dialog_html: '<div class="layer_point layer_verification"><div class="clearfix"><div class="v_img W_fl"><img height="25" width="250" class="yzm_img"/></div><div class="v_change W_fl"><a href="javascript:void(0);" class="yzm_change" action-type="yzm_change"><span class="W_ficon ficon_rotate S_ficon">e</span><span class="font S_txt1">#L{换一组}</span></a></div></div><div class="v_text yzm_wng"><span class="v_text">#L{请输入上面问题的答案}：</span><input type="text" class="yzm_input ontext W_input" action-type="yzm_input"/></div><div class="W_layer W_layer_pop yzm_error" style="display:none;top:70px;left:200px;"><div class="content layer_mini_info"><p class="main_txt"><i class="W_icon icon_rederrorS"></i><span class="txt S_txt1"></span><a class="W_ficon ficon_close S_ficon yzm_hideError">X</a></p><div class="W_layer_arrow"><span class="W_arrow_bor W_arrow_bor_b"><i class="S_line3"></i><em class="S_bg2_br"></em></span></div></div></div></div><div class="W_layer_btn S_bg1"><a class="W_btn_a btn_34px yzm_submit" href="javascript:void(0);" action-type="yzm_submit">#L{确定}</a><a class="W_btn_b btn_34px yzm_cancel" href="javascript:void(0);" action-type="yzm_cancel" action-data="value=frombtn">#L{取消}</a></div>'
            },
            f;
        return function () {
            if (f) return f;
            var b = {},
                g = {},
                h, i, j, k, l = function () {
                    g.yzm_error.innerHTML = "";
                    g.yzm_error_layer.style.display = "none";
                    a.removeClassName(g.yzm_wng, "v_wrong")
                },
                m = function (b) {
                    g.yzm_error.innerHTML = b;
                    g.yzm_error_layer.style.display = "";
                    a.addClassName(g.yzm_wng, "v_wrong")
                },
                n = function () {
                    a.lib.kit.io.cssLoader("style/css/module/layer/layer_verifycode.css", "js_style_css_module_layer_layer_verifycode", function () {
                        h || o();
                        l();
                        h.setTop();
                        h.show();
                        t.changesrc();
                        h.setMiddle();
                        g.input_text.value = "";
                        a.hotKey.add(document.documentElement, ["esc"], t.closeDialog, {
                            type: "keyup",
                            disableInInput: !0
                        })
                    })
                },
                o = function () {
                    h = a.ui.dialog({
                        isHold: !0
                    });
                    h.setTitle(c("#L{请输入验证码}"));
                    h.setContent(c(e.dialog_html));
                    var b = h.getBox();
                    s(b);
                    u()
                },
                p = function (b) {
                    a.conf.trans.validateCode.request("checkValidate", {
                        onError: function () {
                            m(c("#L{验证码错误}"));
                            t.changesrc();
                            j = !1;
                            g.input_text.value = ""
                        },
                        onFail: function () {
                            m(c("#L{验证码错误}"));
                            t.changesrc();
                            g.input_text.value = "";
                            j = !1
                        },
                        onSuccess: function (b, c) {
                            j = !1;
                            var d = b.data.retcode;
                            l();
                            g.input_text.value = "";
                            h.hide();
                            var e = i.requestAjax,
                                f = a.lib.kit.extra.merge(i.param, {
                                    retcode: d
                                });
                            e.request(f)
                        }
                    }, b)
                },
                q = function () {},
                r = function () {},
                s = function (b) {
                    g.vImg = a.core.dom.sizzle("img.yzm_img", b)[0];
                    g.yzm_change = a.core.dom.sizzle("a.yzm_change", b)[0];
                    g.yzm_submit = a.core.dom.sizzle("a.yzm_submit", b)[0];
                    g.yzm_cancel = a.core.dom.sizzle("a.yzm_cancel", b)[0];
                    g.input_text = a.core.dom.sizzle("input.yzm_input", b)[0];
                    g.yzm_wng = a.core.dom.sizzle("div.yzm_wng", b)[0];
                    g.yzm_error = a.core.dom.sizzle("div.yzm_error span.txt", b)[0];
                    g.yzm_error_layer = a.core.dom.sizzle("div.yzm_error", b)[0];
                    g.yzm_hideError = a.core.dom.sizzle(".yzm_hideError", b)[0]
                },
                t = {
                    enter: function () {
                        a.fireEvent(g.yzm_submit, "click")
                    },
                    changesrc: function () {
                        var b = d + a.getUniqueKey();
                        g.vImg.setAttribute("src", b);
                        try {
                            g.yzm_change.blur()
                        } catch (c) {}
                    },
                    checkValidateCode: function () {
                        l();
                        var b = a.core.str.trim(g.input_text.value);
                        b ? j || p({
                            secode: b,
                            type: "rule",
                            data: i.param
                        }) : m(c("#L{请输入验证码}"));
                        try {
                            g.yzm_submit.blur()
                        } catch (d) {}
                    },
                    closeDialog: function (b) {
                        typeof b == "object" && b.el && h.hide();
                        typeof i == "object" && i.onRelease && typeof i.onRelease == "function" && i.onRelease();
                        a.hotKey.remove(document.documentElement, ["esc"], t.closeDialog, {
                            type: "keyup"
                        });
                        try {
                            a.preventDefault()
                        } catch (c) {}
                    },
                    onFocus: function (b) {
                        b = a.core.evt.getEvent();
                        var c = b.target || b.srcElement,
                            d = c.value;
                        d || l()
                    }
                },
                u = function () {
                    var b = h.getBox();
                    k = a.core.evt.delegatedEvent(b);
                    k.add("yzm_change", "click", function () {
                        t.changesrc();
                        a.preventDefault()
                    });
                    k.add("yzm_submit", "click", function () {
                        t.checkValidateCode();
                        a.preventDefault()
                    });
                    k.add("yzm_cancel", "click", t.closeDialog);
                    a.core.evt.addEvent(g.yzm_hideError, "click", l);
                    a.core.evt.addEvent(g.input_text, "focus", t.onFocus);
                    a.core.evt.addEvent(g.input_text, "blur", t.onFocus);
                    a.hotKey.add(g.input_text, ["enter"], t.enter, {
                        type: "keyup"
                    })
                },
                v = function () {
                    if (h) {
                        k.destroy();
                        a.core.evt.removeEvent(g.yzm_hideError, "click", l);
                        a.core.evt.removeEvent(g.input_text, "focus", t.onFocus);
                        a.core.evt.removeEvent(g.input_text, "blur", t.onFocus);
                        h && h.destroy && h.destroy()
                    }
                    j = h = f = null
                },
                w = function (a, b, c) {
                    if (a.code == "100027") {
                        i = c;
                        n()
                    } else if (a.code === "100000") try {
                        var d = c.onSuccess;
                        d && d(a, b)
                    } catch (e) {} else try {
                        var d = c.onError;
                        d && d(a, b)
                    } catch (e) {}
                };
            r();
            r = null;
            b.destroy = v;
            b.validateIntercept = w;
            b.addUnloadEvent = function () {
                h && a.core.evt.addEvent(window, "unload", v)
            };
            f = b;
            return b
        }
    });
    STK.register("lib.follow.utils.follow", function (a) {
        var b = a.lib.kit.extra.merge,
            c = a.conf.channel.follow;
        return function (d) {
            var e = {};
            d = a.parseParam({
                trans: a.conf.trans.follow,
                transNameFollow: "follow",
                transNameUnfollow: "unFollow",
                transNameBlock: "block",
                transNameUnBlock: "unBlock",
                transNameRemoveFans: "removeFans",
                refer_sort: "",
                refer_flag: ""
            }, d);
            var f = a.lib.kit.extra.merge,
                g = a.lib.dialog.validateCode(),
                h = function (b, c) {
                    a.lib.dialog.ioError(b.code, b)
                },
                i = function (e, h) {
                    var j = b({
                            uid: undefined,
                            objectid: undefined,
                            f: 0,
                            extra: "",
                            refer_sort: d.refer_sort,
                            refer_flag: d.refer_flag,
                            location: window.$CONFIG && $CONFIG.location || "",
                            oid: window.$CONFIG && $CONFIG.oid || "",
                            wforce: 1,
                            nogroup: !1
                        }, h),
                        k = e + (j.objectid ? "_object" : "");
                    if (e === "follow") {
                        j.api ? k = "proxy" : j.unlogin && (k = "unloginfollow");
                        var l = d.trans.getTrans(k, {
                            onComplete: function (b, d) {
                                var j = {
                                    onSuccess: function (a, b) {
                                        var d = f(h, a.data),
                                            g = h.onSuccessCb;
                                        typeof g == "function" && g(d);
                                        c.fire("changeStatus", {
                                            uid: d.uid,
                                            objectid: d.objectid,
                                            action: e,
                                            both: d.relation && d.relation.follow_me == 1
                                        })
                                    },
                                    onError: function (b, c) {
                                        b.code == 100050 ? a.ui.confirm(b.msg, {
                                            OK: function () {
                                                h.wforce = 0;
                                                i(e, h)
                                            }
                                        }) : a.lib.dialog.ioError(b.code, b);
                                        var d = h.onFailCb;
                                        typeof d == "function" && d(f(h, b.data))
                                    },
                                    requestAjax: l,
                                    param: d,
                                    onRelease: function () {
                                        var a = h.onRelease;
                                        typeof a == "function" && a()
                                    }
                                };
                                g.validateIntercept(b, d, j)
                            }
                        });
                        l.request(j)
                    } else d.trans.request(k, {
                        onSuccess: function (a, b) {
                            var d = f(h, a.data),
                                g = h.onSuccessCb;
                            typeof g == "function" && g(d);
                            c.fire("changeStatus", {
                                uid: d.uid,
                                objectid: d.objectid,
                                action: e,
                                fan: d.relation && d.relation.follow_me == 1
                            })
                        },
                        onError: function (b, c) {
                            a.lib.dialog.ioError(b.code, b);
                            var d = h.onFailCb;
                            typeof d == "function" && d()
                        }
                    }, j)
                };
            e.follow = function (a) {
                i(d.transNameFollow, a)
            };
            e.unFollow = function (a) {
                i(d.transNameUnfollow, a)
            };
            e.block = function (a) {
                i(d.transNameBlock, a)
            };
            e.unBlock = function (a) {
                i(d.transNameUnBlock, a)
            };
            e.removeFans = function (a) {
                i(d.transNameRemoveFans, a)
            };
            return e
        }
    });
    STK.register("conf.trans.setGroup", function (a) {
        var b = a.lib.kit.io.inter(),
            c = b.register;
        c("list", {
            url: "/aj/f/group/list",
            method: "get"
        });
        c("update", {
            url: "/aj/f/group/update",
            method: "post"
        });
        c("batchSet", {
            url: "/aj3/attention/aj_group_batchupdate_v4.php",
            method: "post"
        });
        c("add", {
            url: "/aj/f/group/add",
            method: "post"
        });
        c("recommendfollow", {
            url: "/aj/f/recomafterfollow",
            method: "get"
        });
        c("closerecommend", {
            url: "/aj/f/closerecommend",
            method: "get"
        });
        c("checkcloserelation", {
            url: "/aj/f/checkcloserelation",
            method: "post"
        });
        c("addCloseFriend", {
            url: "/aj/f/createclosefriend",
            method: "post"
        });
        c("followGroup", {
            url: "/aj/f/group/followedgroup",
            method: "post"
        });
        return b
    });
    STK.register("lib.kit.dom.parseDOM", function (a) {
        return function (a) {
            for (var b in a) a[b] && a[b].length == 1 && (a[b] = a[b][0]);
            return a
        }
    });
    STK.register("lib.kit.dom.parentAttr", function (a) {
        return function (a, b, c) {
            var d;
            if (a && b) {
                c = c || document.body;
                while (a && a != c && !(d = a.getAttribute(b))) a = a.parentNode
            }
            return d
        }
    });
    STK.register("lib.kit.extra.getDiss", function (a) {
        return function () {
            var b = {},
                c = 0,
                d = {
                    location: $CONFIG.location
                };
            arguments[0] && !a.core.dom.isNode(arguments[0]) && (b = arguments[c++]);
            b = a.lib.kit.extra.merge(b, d);
            if (!arguments[c]) return b;
            b = a.lib.kit.extra.merge(b, a.core.json.queryToJson(a.lib.kit.dom.parentAttr(arguments[c++], "diss-data", arguments[c]) || ""));
            return b
        }
    });
    STK.register("lib.kit.extra.parseURL", function (a) {
        return function () {
            return STK.historyM && STK.historyM.parseURL ? STK.historyM.parseURL() : a.core.str.parseURL(location.href)
        }
    });
    STK.register("lib.dialog.groupListPanel", function (a) {
        var b = a.lib.kit.extra.language,
            c = b("#L{我的推荐}");
        return function (c) {
            var d = {},
                e = a.C("div"),
                f = {},
                g = {},
                h, i = a.delegatedEvent(e),
                j = $CONFIG.imgPath + "style/images/common/transparent.gif",
                k = [{
                    mode: "special",
                    className: "W_ico16 i_conn_public",
                    title: b("#L{所有人可见}")
                }, {
                    mode: "normal",
                    className: "W_ico16 i_conn_public",
                    title: b("#L{所有人可见}")
                }],
                l = function (a, b, c) {
                    if (!!a) {
                        c && (c = c.toUpperCase());
                        var d = a[b];
                        while (d) {
                            if (d.nodeType == 1 && (c ? d.nodeName == c : !0)) break;
                            d = d[b]
                        }
                        return d
                    }
                },
                m = c.multi ? 'style="display:none;"' : '<#if (item.belong==1)><#else>style="display:none;"</#if>',
                n = '<ul node-type="#{mode}" class="group_ul #{addOnClass} clearfix"></ul>',
                o = a.core.util.easyTemplate('<#et listItem gList><#list gList as item><li class="group_li" ><label for="${item.gid}" ><input action-type="select" id="${item.gid}" type="checkbox"<#if (item.recom_join)> recom_join="1" </#if><#if (item.belong==1 || item.recom_join || item.gid == 0)>checked="checked"</#if> <#if (item.ogname)>ogname="${item.ogname}"</#if>class="W_checkbox" value="${item.gid}"><span class="group_name <#if (item.gid==0 || item.recom_join)>W_autocut</#if>"  node-type="gplist_${item.gid}_gname"><span><#if (item.ogname)>${item.ogname}<#elseif (item.gname)>${item.gname}</#if></span><#if (item.needIcon == 1)><span class="W_icon icon_askS" action-type="specialAttentionTip"></span><#elseif (item.gid == 0)><i class="new_group_tag">' + b("#L{新分组}") + "</i></#if>" + "<#if (item.gid == 0)>" + '<em class="S_txt2">(' + b("#L{建议创建并加到该组}") + '</em></span><em class="S_txt2">)</em>' + "<#elseif (item.recom_join)>" + '<em class="S_txt2">(' + b("#L{建议加到该组}") + '</em></span><em class="S_txt2">)</em>' + "</#if>" + "<#if (item.recom_add)>" + '<em class="S_txt2">(' + b("#L{勾选此组即可将这个帐号推荐给粉丝}") + '</em></span><em class="S_txt2">)</em>' + "</#if>" + "</label>" + "</li>" + "</#list>" + "</#et>"),
                p, q = '<div class="W_layer W_layer_pop"><div class="content layer_mini_info"> <p class="main_txt"><i class="W_icon icon_succ"></i><span class="txt S_txt1">#L{不想错过Ta的每一条微博？<br>可以将其加到这个分组里，方便在首页查看}</span></p><div class="W_layer_arrow"><span node-type="arrow" class="W_arrow_bor"><i class="S_line3"></i><em class="S_bg2_br"></em></span></div></div></div>',
                r = function (b) {
                    var c = document.createTextNode(b),
                        d = a.C("div");
                    d.appendChild(c);
                    var e = d.innerHTML;
                    d = c = null;
                    return e
                },
                s = function () {
                    var b = "";
                    for (var d = 0; d < k.length; d++) {
                        d != k.length - 1 ? k[d].addOnClass = "spec" : k[d].addOnClass = "";
                        b += a.templet(n, k[d])
                    }
                    e.innerHTML = b;
                    h = a.lib.kit.dom.parseDOM(a.core.dom.builder(e).list);
                    c.data && A(c.data)
                },
                t = function () {
                    for (var b = 0; b < k.length; b++) {
                        var d = k[b].mode;
                        if (d == "system" && f[d]) {
                            c.fromFollow && a.foreach(f[d], function (a, b) {
                                a.fromFollow = 1
                            });
                            var e = o(f[d]).toString(),
                                g = c.fromFollow ? h.special : h.normal;
                            g && a.insertHTML(g, e, "afterbegin")
                        } else if (f[d]) {
                            var e = o(f[d]).toString();
                            h[d].innerHTML += e
                        }
                    }!f.special && h.special && (h.special.style.display = "none")
                };
            lengthLimit = function (b) {
                var c = a.fixEvent(b).target;
                a.bLength(c.value) > 16 && (c.value = a.leftB(c.value, 16))
            }, onEnter = function (b) {
                if (b.keyCode === 13) {
                    var c = a.fixEvent(b).target;
                    a.fireEvent(c, "blur")
                }
            };
            var u = function (b) {
                    var c = l(b, "parentNode", "li");
                    if (!!c) {
                        var d = a.sizzle('input[action-type="select"]', c)[0];
                        g[d.id] || (g[d.id] = {});
                        return g[d.id]
                    }
                },
                v = {
                    show: function (c) {
                        p = a.ui.bubble(b(q)).show().beside(c.el, {
                            pos: "bottom-left",
                            offsetX: -10,
                            offsetY: 2
                        })
                    },
                    hide: function () {
                        p.hide()
                    }
                },
                w = function () {
                    i.add("specialAttentionTip", "mouseover", v.show);
                    i.add("specialAttentionTip", "mouseout", v.hide)
                },
                x = function () {
                    s();
                    w()
                },
                y = function () {
                    return e
                },
                z = function (b) {
                    var c = b.mode || "normal";
                    f[c] = f[c] || [];
                    f[c].push(b);
                    var d = o([b]).toString();
                    a.insertHTML(h[c], d, "beforeend")
                },
                A = function (d) {
                    f = {};
                    if (a.isArray(d))
                        for (var e = 0, g = d.length; e < g; e++) {
                            d[e].gid == "0" || d[e].recom_join == 1 ? d[e].mode = "special" : d[e].mode = "normal";
                            c.fromFollow && d[e].gname == b("#L{特别关注}") && (d[e].needIcon = 1);
                            var h = d[e].mode;
                            f[h] = f[h] || [];
                            f[h].push(d[e])
                        }
                    t()
                },
                B = function () {
                    var b = [],
                        c = {
                            suda: [],
                            diss: {
                                allGroup: 0,
                                autoSelect: 0,
                                gid: [],
                                uid: $CONFIG.uid
                            }
                        },
                        d = a.sizzle('input[action-type="select"]', e),
                        f, g;
                    c.diss.allGroup = d.length;
                    for (var h = d.length; h--;) {
                        var i = {};
                        f = g = !1;
                        if (d[h].checked) {
                            f = !0;
                            var j = u(d[h]);
                            if (j) {
                                i.gid = d[h].value;
                                i.gid == "0" && (i.ogname = d[h].getAttribute("ogname") || "");
                                b.push(i)
                            }
                        }
                        if (d[h].getAttribute("recom_join")) {
                            g = !0;
                            c.diss.autoSelect++;
                            c.diss.gid.push(d[h].value)
                        }(g || f) && c.suda.push(d[h].value + (g ? "_a" : "_b") + (f ? "_1" : "_0"))
                    }
                    b.suda_diss = c;
                    return b
                },
                C = function () {
                    t()
                },
                D = function () {
                    f = {};
                    t()
                },
                E = function () {
                    i.destroy();
                    g = null;
                    f = null;
                    h = null;
                    e = null
                },
                F = function () {
                    var b = a.sizzle('input[action-type="select"]', e);
                    return b.length
                };
            x();
            d.getOuter = y;
            d.length = F;
            d.add = z;
            d.setData = A;
            d.getData = B;
            d.reset = C;
            d.clear = D;
            d.destroy = E;
            return d
        }
    });
    STK.register("lib.dialog.vipError", function (a) {
        var b = '<#et temp data><div node-type="outer" class="layer_point"><dl class="point clearfix"><dt><span class="${data.icon}" node-type="icon"></span></dt><dd node-type="inner">${data.info}</dd></dl></div><div class="W_layer_btn S_bg1"><a href="javascript:void(0);" <#if (data.lbtnStyle == 1)>class="W_btn_a"<#else if (data.lbtn == 0)>class="W_btn_b"</#if> node-type="lbtn"><span><#if (data.lbtnIcon == 1)><i class="W_icon icon_member"></i></#if>${data.lbtnText}</span></a><a href="javascript:void(0);" <#if (data.rbtnStyle == 1)>class="W_btn_a"<#else if (data.rbtn == 0)>class="W_btn_b"</#if> node-type="rbtn"><span><#if (data.rbtnIcon == 1)><i class="W_icon icon_member"></i></#if>${data.rbtnText}</span></a></div></#et>',
            c = {
                success: "icon_succM",
                error: "icon_errorM",
                warn: "icon_warnM",
                "delete": "icon_delM",
                question: "icon_questionM"
            },
            d = a.lib.kit.extra.language,
            e = function (e) {
                var f, g, h;
                f = a.parseParam({
                    title: "&nbsp;",
                    icon: "warn",
                    info: "",
                    lbtnFunc: a.funcEmpty,
                    lbtnStyle: 0,
                    lbtnIcon: 0,
                    lbtnText: d("#L{立即开通会员}"),
                    rbtnFunc: a.funcEmpty,
                    rbtnStyle: 0,
                    rbtnIcon: 0,
                    rbtnText: d("#L{立即开通会员}")
                }, e);
                f.icon = c[f.icon];
                g = a.ui.dialog();
                g.setContent(a.core.util.easyTemplate(b, f).toString());
                h = g.getDomList(!0);
                g.setTitle(f.title);
                g.getDomList().title.style.borderBottomStyle = "none";
                var i = function () {
                        f.lbtnFunc();
                        g.hide()
                    },
                    j = function () {
                        f.rbtnFunc();
                        g.hide()
                    };
                a.addEvent(h.lbtn, "click", i);
                a.addEvent(h.rbtn, "click", j);
                a.custEvent.add(g, "hide", function () {
                    a.custEvent.remove(g, "hide", arguments.callee);
                    a.removeEvent(h.lbtn, "click", i);
                    a.removeEvent(h.rbtn, "click", j)
                });
                g.show().setMiddle();
                return g
            };
        return function (a, b) {
            if (a == "100096" || a == "100098") {
                b.lbtnStyle = 0;
                b.lbtnIcon = 0;
                b.lbtnText = d("#L{管理分组}");
                b.rbtnStyle = 1;
                b.rbtnIcon = 1;
                b.rbtnText = d("#L{开通会员}");
                b.rbtnFunc = function () {
                    location.href = "//vip.weibo.com/paycenter?form=group"
                }
            } else if (a == "100097") {
                b.lbtnStyle = 0;
                b.lbtnIcon = 0;
                b.lbtnText = d("#L{管理分组}");
                b.rbtnStyle = 0;
                b.rbtnIcon = 0;
                b.rbtnText = d("#L{知道了}")
            }
            return e(b)
        }
    });
    STK.register("lib.dialog.setGroup", function (a) {
        var b = 30,
            c = "//rs.sinajs.cn/sgmark.gif",
            d = a.lib.kit.extra.language,
            e = a.lib.kit.extra.merge;
        return function () {
            function C(a) {
                return s.extraPostData ? e(a, typeof s.extraPostData == "function" ? s.extraPostData() : s.extraPostData) : a
            }
            var f = {},
                g = !1,
                h = 0,
                i, j = 5,
                k = a.ui.dialog(),
                l = a.ui.alert,
                m, n = {
                    groupBox: '<div class="layer_set_group" node-type="group_panel"><input type="hidden" node-type="uid" name="touid" ><div class="remark_set" node-type="remarkPanel"><label for=""><em class="W_fb">#L{备注名称：}</em><input type="text" node-type="remarkInput" name="remark" class="W_input" value="#L{填写备注名称}"></label></div><div class="group_box"><h4 class="tit W_fb" node-type="message">#L{选择分组：}</h4><div class="loading_box" node-type="loading"><i class="W_loading"></i><span class="S_txt1">正在加载，请稍候</span></div><div class="choose_area"><div class="group_list" node-type="groupList"></div><div node-type="addGroupPanel"><div class="opt_area" node-type="showBtnBox"><a href="javascript:void(0);" class="W_btn_b" action-type="showBtn"><em class="W_ficon ficon_add S_ficon">+</em>#L{创建新分组}</a></div><div style="display:block;" class="add_group clearfix" node-type="addGroupBox"><div class="W_fl"><input type="text" node-type="groupInput" class="W_input" value="#L{新分組}"><a href="javascript:void(0);" class="W_btn_a" action-type="addGroup" node-type="addGroup">#L{创建}</a><a action-type="hideBtn" href="javascript:void(0);" action-type="hideBtn">#L{取消}</a></div></div></div></div><div class="reco_area" style="display:none;" node-type="samelist"><div class="WB_cardtitle_a" ><h4 class="obj_name"><span class="main_title W_fb" node-type="recommMsg">#L{Ta 的粉丝也关注}</span></h4><div class="opt_box"><a href="javascript:void(0);"  suda-uatrack="key=V6addattenlayer&value=change" action-type="refresh" class="opt_change S_txt1" node-type="refreshbtn"><em class="W_ficon ficon_rotate W_f14 S_ficon">e</em>#L{换一换}</a></div></div><ul class="pt_ul clearfix" node-type="userList"></ul></div></div></div><div class="W_layer_btn S_bg1" node-type="confirmBox"><a href="javascript:void(0);" suda-data="key=V6addattenlayer&value=save" class="W_btn_a btn_34px" action-type="submit" node-type="submit">#L{保存}</a><a href="javascript:void(0);" suda-data="key=V6addattenlayer&value=cancel" class="W_btn_b btn_34px" action-type="cancel">#L{取消}</a></div>',
                    checkBox: '<input type="checkbox" value="{value}" name="gid" class="W_checkbox" {checked} id="group_{groupId}"><label for="group_{groupId}">{name}</label>',
                    userlist: '<#et data data><li class="picitems" uid="${data.uid}"><div class="midbox"><p class="pic_wrap"><span class="pic_box"><a href="${data.profile_url}" suda-data="key=V6addattenlayer&value=head" target="_blank"><img src="${data.profile_image_url}" width="50" height="50" alt="${data.fnick}"  class="pic"></a><a href="${data.profile_url}"  class="icon_bed" target="_blank"><em class="W_icon  ${data.icon}"></em></a></span></p><p class="name W_tc" ><a href="${data.profile_url}" target="_blank" suda-data="key=V6addattenlayer&value=nickname" class="S_txt1">${data.fnick}</a></p><p class="opt" node-type="widget_followBtnBox" action-data="uid=${data.uid}&fnick=${data.fnick}&template=2&nogroup=1&location=afterfollow_v6&refer_sort=similar&refer_lflag=${data.refer_lflag}&refer_flag=${data.refer_flag}"><a href="javascript:;" action-type="follow" suda-data="key=V6addattenlayer&value=follow" class="W_btn_b btn_22px"><em class="W_ficon ficon_add S_ficon">+</em>关注</a></p></div></li></#et>'
                },
                o = {
                    title: "#L{关注成功}",
                    setGroupTitle: "#L{设置分组}",
                    gEmpty: "#L{分组名不能为空}",
                    rEmpty: "#L{备注名不能为空}",
                    gMaxLen: "#L{请不要超过16个字符}",
                    gDefVal: "#L{新分组}",
                    okLabel: "#L{设置成功}",
                    rDefVal: "#L{设置备注}",
                    message: '#L{为   <span class="W_fb">%s</span>  选择分组}',
                    recommMsg: '#L{<span class="W_fb">%s</span>  的粉丝也关注}',
                    repeat: "#L{此分组名已存在}"
                },
                p = !1,
                q = [],
                r = !1,
                s, t, u, v, w, x, y, z, A, B, D = function (a) {
                    u.remarkInput.value = d(o.rDefVal);
                    u.groupInput.value = d(o.gDefVal);
                    u.showBtnBox.style.display = "";
                    u.addGroupBox.style.display = "none";
                    u.loading.style.display = "";
                    u.groupList.innerHTML = ""
                },
                E = function () {},
                F = function (b, c) {
                    var e, f;
                    if (b == "addGroup") {
                        e = d("#L{创建}");
                        f = "addGroup"
                    } else {
                        e = d("#L{保存}");
                        f = "submit"
                    }
                    if (c == "normal") {
                        a.addClassName(u[b], "btn_noloading");
                        a.removeClassName(u[b], "W_btn_a_disable");
                        u[f].innerHTML = e
                    } else {
                        a.addClassName(u[b], "W_btn_a_disable");
                        a.removeClassName(u[b], "btn_noloading");
                        u[f].innerHTML = d("#L{保存中...}")
                    }
                },
                G = function (b) {
                    D(b);
                    s = a.parseParam({
                        uid: "",
                        fnick: "",
                        sex: "m",
                        hasRemark: !0,
                        fromFollow: !1,
                        groupList: [],
                        recommend: [],
                        title: d(o.setGroupTitle),
                        successCb: function () {},
                        cancelCb: function () {},
                        extraPostData: {},
                        remark: undefined,
                        refer_lflag: "",
                        refer_flag: ""
                    }, b);
                    r = s.fromFollow;
                    r && (s.title = d(o.title));
                    b.tarEl && (s = a.lib.kit.extra.getDiss(s, b.tarEl));
                    A = s.successCb;
                    B = s.cancelCb;
                    u.uid.value = s.uid;
                    u.remarkInput.value = d(o.rDefVal);
                    if (s.hasRemark) {
                        u.remarkInput.removeAttribute("disabled");
                        u.remarkPanel.style.display = ""
                    } else {
                        u.remarkInput.setAttribute("disabled", "disabled");
                        u.remarkPanel.style.display = "none"
                    }
                    s.groupList.length ? M(s.groupList) : R.request({
                        uid: s.uid
                    });
                    s.recommend.length ? N(s.recommend) : N([]);
                    u.message.innerHTML = d(o.message, s.fnick);
                    u.recommMsg.innerHTML = d(o.recommMsg, s.fnick);
                    k.setTitle(s.title);
                    k.getDomList().close.setAttribute("suda-uatrack", "key=V6addattenlayer&value=shutdown");
                    k.insertElement(u.group_panel, "beforeend");
                    k.insertElement(u.confirmBox, "beforeend");
                    s.fromFollow || (u.remarkPanel.style.display = "none");
                    k.show();
                    window.WBEXP && window.WBEXP.collect({
                        V6addattenlayer: "addatten"
                    })
                },
                H = function (b) {
                    if (!!b) {
                        if (s && s.fromFollow != !0) return;
                        var d = parseInt(Math.random() * 1e4),
                            e = a.C("img");
                        e.src = c + "?n=" + b.allGroup + "_" + b.autoSelect + "&gid=" + b.gid.join(",") + "&uid=" + b.uid + "&rd=" + d;
                        document.body.appendChild(e);
                        setTimeout(function () {
                            e.parentNode.removeChild(e)
                        }, 3e3)
                    }
                },
                I = function (a) {
                    var a = a || {};
                    k.hide()
                },
                J = {
                    defVal: d(o.gDefVal),
                    check: function (b) {
                        var c = "";
                        b === "" || b === this.defVal ? c = o.gEmpty : a.core.str.bLength(b) > 16 && (c = o.gMaxLen);
                        return d(c)
                    },
                    checkRepeat: function (a) {
                        var b = "";
                        for (var c = q.length; c--;)
                            if (a === q[c].gname) {
                                b = o.repeat;
                                break
                            } return d(b)
                    },
                    showError: function (b) {
                        m = a.ui.tipAlert('<span class="txt S_txt1">' + b + "</span>", {
                            autoHide: !1,
                            icon: "rederrorS"
                        }).beside(u.groupInput, {
                            pos: "top-middle"
                        })
                    },
                    hideError: function () {
                        m && m.hide && m.hide();
                        m = undefined
                    }
                },
                K = {
                    defVal: d(o.rDefVal),
                    check: function (b) {
                        var c = "";
                        b === "" ? c = o.rEmpty : a.core.str.bLength(b) > 16 && (c = o.gMaxLen);
                        return d(c)
                    },
                    showError: function (a) {},
                    hideError: function () {}
                },
                L = function (b) {
                    var c = a.C("li"),
                        d = n.checkBox.replace(/\{value\}/g, b.gid).replace(/\{groupId\}/g, b.gid).replace(/\{name\}/g, b.gname).replace(/\{checked\}/g, b.belong ? "checked" : "");
                    c.innerHTML = d;
                    return c
                },
                M = function (b) {
                    var c = b,
                        d = b.recommend,
                        e = {
                            data: c,
                            fnick: s.fnick,
                            uid: s.uid,
                            fromFollow: r
                        };
                    t = a.lib.dialog.groupListPanel(e);
                    u.groupList.appendChild(t.getOuter());
                    u.loading.style.display = "none";
                    c.length >= 20 && (u.addGroupPanel.style.display = "none")
                },
                N = function (a) {
                    i = a;
                    if (!!i) {
                        var b = i.length;
                        if (b == 0) {
                            u.samelist.style.display = "none";
                            u.userList.innerHTML = "";
                            return
                        }
                        window.WBEXP && window.WBEXP.collect({
                            V6addattenlayer: "similar"
                        });
                        var c = [];
                        u.samelist.style.display = "";
                        u.refreshbtn.style.display = b > j ? "" : "none";
                        P()
                    }
                },
                O = function (a) {
                    a.icon = "";
                    a.verified ? a.verified_type == 0 ? a.icon = "icon_pf_approve" : a.verified_type >= 1 && a.verified_type <= 7 && (a.icon = "icon_pf_approve_co") : a.verified_type == 220 && (a.icon = "icon_pf_club")
                },
                P = function () {
                    var b, c = [],
                        d = i.length,
                        e = [];
                    for (var f = 0; f < d && f < j; f++) {
                        h >= d && (h = h - d);
                        b = i[h];
                        h++;
                        O(b);
                        b = a.core.json.merge(b, {
                            refer_lflag: s.refer_lflag,
                            refer_flag: s.refer_flag
                        });
                        var g = a.core.util.easyTemplate(n.userlist, b).toString();
                        e.push(b.uid);
                        c.push(g)
                    }
                    u.userList.innerHTML = c.join("");
                    var k = "p2p:" + e.join("_") + ":" + $CONFIG.uid + ":" + s.uid;
                    window.WBEXP && window.WBEXP.collect({
                        similarhead: k
                    })
                },
                Q = {
                    errorCd: function (b, c) {
                        g = !1;
                        if (b.code == "100096" || b.code == "100097" || b.code == "100098") {
                            var d = a.lib.dialog.vipError(b.code, {
                                info: b.data.html,
                                lbtnFunc: function () {
                                    location.href = b.data.gurl
                                }
                            });
                            a.custEvent.add(d, "hide", I)
                        } else a.lib.dialog.ioError(b.code, b);
                        F("submit", "normal")
                    },
                    getGroupSuccess: function (a, b) {
                        M(a.data);
                        i = a.data.recommend || [];
                        N(i)
                    },
                    setGroupSuccess: function (b, c) {
                        g = !1;
                        F("submit", "normal");
                        I();
                        A(b, c);
                        a.ui.tip("lite", {
                            msg: d(o.okLabel),
                            type: "succM",
                            timer: "500"
                        })
                    },
                    setGroupError: function (a, b) {
                        g = !1;
                        J.showError(a.msg)
                    },
                    addGroupSuccess: function (a, b) {
                        F("addGroup", "normal");
                        var c = a.data,
                            e;
                        u.addGroupPanel.style.display = c.length >= 20 ? "none" : "";
                        for (var f in c)
                            if (c[f].belong === 1) {
                                e = c[f];
                                break
                            } e && q.push(e);
                        t.add(e);
                        W.hideAddPanel();
                        u.groupInput.value = d(o.gDefVal);
                        t.length() >= 20 && (u.addGroupPanel.style.display = "none")
                    }
                },
                R = a.conf.trans.setGroup.getTrans("list", {
                    onSuccess: Q.getGroupSuccess,
                    onError: Q.errorCd
                }),
                S = function (b) {
                    a.conf.trans.setGroup.getTrans("update", {
                        onSuccess: Q.setGroupSuccess,
                        onError: Q.errorCd,
                        onFail: Q.errorCd
                    }).request(C(b))
                },
                T = a.conf.trans.setGroup.getTrans("batchSet", {
                    onSuccess: Q.setGroupSuccess,
                    onError: Q.errorCd
                }),
                U = function (b) {
                    a.conf.trans.setGroup.getTrans("add", {
                        onSuccess: Q.addGroupSuccess,
                        onError: function (b, c) {
                            F("addGroup", "normal");
                            a.lib.dialog.ioError(b.code, b)
                        }
                    }).request(b)
                },
                V = function (b) {
                    var c = document.createTextNode(b),
                        d = a.C("div");
                    d.appendChild(c);
                    var e = d.innerHTML;
                    d = c = null;
                    return e
                },
                W = {
                    showAddPanel: function () {
                        u.showBtnBox.style.display = "none";
                        u.addGroupBox.style.display = "";
                        u.groupInput.focus()
                    },
                    hideAddPanel: function () {
                        u.showBtnBox.style.display = "";
                        u.addGroupBox.style.display = "none";
                        J.hideError();
                        u.groupInput.value = J.defVal
                    },
                    addGroup: function () {
                        var b = V(a.trim(u.groupInput.value)),
                            c = J.check(b) || J.checkRepeat(b);
                        if (c) J.showError(c);
                        else {
                            J.hideError();
                            F("addGroup", "loading");
                            U({
                                name: b,
                                ispublic: ""
                            })
                        }
                    },
                    submit: function () {
                        if (!g) {
                            g = !0;
                            var b = {};
                            p = !0;
                            b.type = "s";
                            var c = t.getData(),
                                e = [],
                                f = u.remarkInput.value;
                            f === d(o.rDefVal) && (f = "");
                            b.remark = f;
                            var h = u.uid.value;
                            b.user = h;
                            b.gid = a.jsonToStr(c);
                            if (c.suda_diss && s.fromFollow == !0) {
                                var i = c.suda_diss.suda,
                                    j = c.suda_diss.diss;
                                window.SUDA && window.SUDA.uaTrack && window.SUDA.uaTrack("group_aftermark", "save:" + i.join(","))
                            }
                            F("submit", "loading");
                            S(b)
                        }
                    },
                    followEnd: function (b) {
                        if (b.action == "follow") {
                            var c = b.uid;
                            if (!i) return;
                            var d = i.length;
                            for (var e = d - 1; e >= 0; e--)
                                if (i[e].uid == c) {
                                    i.splice(e, 1);
                                    break
                                } i.length <= j && (u.refreshbtn.style.display = "none");
                            var f = a.sizzle("[uid=" + c + "]", u.userList)[0];
                            f && a.tween(f, {
                                end: function () {
                                    if (i.length >= j) {
                                        var b = h - 1;
                                        b >= i.length && (b = 0);
                                        O(i[b]);
                                        f = a.core.json.merge(f, {
                                            refer_lflag: s.refer_lflag,
                                            refer_flag: s.refer_flag
                                        });
                                        var c = a.core.util.easyTemplate(n.userlist, i[b]).toString(),
                                            d = "p2p:" + i[b].uid + ":" + $CONFIG.uid + ":" + s.uid;
                                        window.WBEXP && window.WBEXP.collect({
                                            similarhead: d
                                        });
                                        a.insertHTML(f, c, "afterend")
                                    }
                                    a.removeNode(f);
                                    f = null
                                },
                                duration: 800
                            }).play({
                                opacity: 0
                            })
                        }
                    },
                    cancel: function () {
                        p = !1;
                        I()
                    },
                    inputFocus: function (b) {
                        return function (c) {
                            var c = a.fixEvent(c),
                                d = c.target,
                                e = d.value;
                            b.hideError();
                            e === b.defVal && (d.value = "")
                        }
                    },
                    inputBlur: function (b) {
                        return function (c) {
                            var c = a.fixEvent(c),
                                d = c.target,
                                e = a.trim(d.value);
                            e || (d.value = b.defVal)
                        }
                    },
                    inputMaxLen: function (c) {
                        var c = a.fixEvent(c),
                            d = c.target,
                            e = d.value,
                            f = a.core.str.bLength(e);
                        c.keyCode == "13" ? W.submit() : f > b && (d.value = a.core.str.leftB(e, b))
                    }
                },
                X = function () {
                    _();
                    Y();
                    Z()
                },
                Y = function () {
                    var b = k.getDomList().close;
                    b && b.setAttribute("suda-uatrack", "key=group_aftermark&value=close");
                    a.custEvent.define(f, ["hide"]);
                    v = a.core.evt.delegatedEvent(k.getDomList().inner);
                    w = W.inputFocus(J);
                    x = W.inputBlur(J);
                    y = W.inputFocus(K);
                    z = W.inputBlur(K);
                    a.addEvent(u.remarkInput, "focus", y);
                    a.addEvent(u.remarkInput, "blur", z);
                    a.addEvent(u.groupInput, "focus", w);
                    a.addEvent(u.groupInput, "blur", x);
                    a.addEvent(u.remarkInput, "keyup", W.inputMaxLen);
                    a.addEvent(u.groupInput, "keyup", W.inputMaxLen);
                    v.add("showBtn", "click", W.showAddPanel);
                    v.add("hideBtn", "click", W.hideAddPanel);
                    v.add("addGroup", "click", W.addGroup);
                    v.add("submit", "click", W.submit);
                    v.add("cancel", "click", W.cancel);
                    v.add("refresh", "click", P);
                    a.conf.channel.follow.register("changeStatus", W.followEnd)
                },
                Z = function () {
                    a.custEvent.add(k, "hide", function () {
                        a.custEvent.fire(f, ["hide"]);
                        p || B();
                        var b = t.getData();
                        b && b.suda_diss && H(b.suda_diss.diss);
                        J.hideError()
                    })
                },
                _ = function () {
                    var b = a.core.dom.builder(d(n.groupBox));
                    u = a.lib.kit.dom.parseDOM(b.list)
                },
                ba = function () {
                    a.custEvent.undefine(f, ["hide"]);
                    a.removeEvent(u.remarkInput, "focus", y);
                    a.removeEvent(u.remarkInput, "blur", z);
                    a.removeEvent(u.groupInput, "focus", w);
                    a.removeEvent(u.groupInput, "blur", x);
                    a.removeEvent(u.remarkInput, "keyup", W.inputMaxLen);
                    a.removeEvent(u.groupInput, "keyup", W.inputMaxLen);
                    a.conf.channel.follow.remove("changeStatus", W.followEnd);
                    w = null;
                    x = null;
                    y = null;
                    z = null;
                    v && v.destroy();
                    recommend && recommend.destroy()
                };
            X();
            f.show = G;
            f.hide = I;
            f.destroy = ba;
            return f
        }
    });
    STK.register("conf.trans.setRemark", function (a) {
        var b = a.lib.kit.io.inter(),
            c = b.register;
        c("setRemark", {
            url: "/aj/f/remarkname",
            method: "post"
        });
        c("setInterestRemark", {
            url: "/p/aj/relation/updatepageremark",
            method: "get"
        });
        return b
    });
    STK.register("lib.kit.extra.textareaUtils", function (a) {
        var b = {},
            c = document.selection;
        b.selectionStart = function (a) {
            if (!c) try {
                return a.selectionStart
            } catch (b) {
                return 0
            }
            var d = c.createRange(),
                e, f, g = 0,
                h = document.body.createTextRange();
            try {
                h.moveToElementText(a)
            } catch (b) {}
            for (g; h.compareEndPoints("StartToStart", d) < 0; g++) h.moveStart("character", 1);
            return g
        };
        b.selectionBefore = function (a) {
            return a.value.slice(0, b.selectionStart(a))
        };
        b.selectText = function (a, b, d) {
            a.focus();
            if (!c) a.setSelectionRange(b, d);
            else {
                var e = a.createTextRange();
                e.collapse(1);
                e.moveStart("character", b);
                e.moveEnd("character", d - b);
                e.select()
            }
        };
        b.insertText = function (a, d, e, f) {
            a.focus();
            f = f || 0;
            if (!c) {
                var g = a.value,
                    h = e - f,
                    i = h + d.length;
                a.value = g.slice(0, h) + d + g.slice(e, g.length);
                b.selectText(a, i, i)
            } else {
                var j = c.createRange();
                j.moveStart("character", -f);
                j.text = d
            }
        };
        b.replaceText = function (a, d) {
            a.focus();
            var e = a.value,
                f = b.getSelectedText(a),
                g = f.length;
            if (f.length == 0) b.insertText(a, d, b.getCursorPos(a));
            else {
                var h = b.getCursorPos(a);
                if (!c) {
                    var j = h + f.length;
                    a.value = e.slice(0, h) + d + e.slice(h + g, e.length);
                    b.setCursor(a, h + d.length);
                    return
                }
                var i = c.createRange();
                i.text = d;
                b.setCursor(a, h + d.length)
            }
        };
        b.getCursorPos = function (a) {
            var b = 0;
            if (STK.core.util.browser.IE) {
                a.focus();
                var d = null;
                d = c.createRange();
                var e = d.duplicate();
                e.moveToElementText(a);
                e.setEndPoint("EndToEnd", d);
                a.selectionStartIE = e.text.length - d.text.length;
                a.selectionEndIE = a.selectionStartIE + d.text.length;
                b = a.selectionStartIE
            } else if (a.selectionStart || a.selectionStart == "0") b = a.selectionStart;
            return b
        };
        b.getSelectedText = function (a) {
            var b = "",
                d = function (a) {
                    return a.selectionStart != undefined && a.selectionEnd != undefined ? a.value.substring(a.selectionStart, a.selectionEnd) : ""
                };
            window.getSelection ? b = d(a) : b = c.createRange().text;
            return b
        };
        b.setCursor = function (a, b, c) {
            b = b == null ? a.value.length : b;
            c = c == null ? 0 : c;
            a.focus();
            if (a.createTextRange) {
                var d = a.createTextRange();
                d.move("character", b);
                d.moveEnd("character", c);
                d.select()
            } else a.setSelectionRange && a.setSelectionRange(b, b + c)
        };
        b.unCoverInsertText = function (a, b, c) {
            c = c == null ? {} : c;
            c.rcs = c.rcs == null ? a.value.length : c.rcs * 1;
            c.rccl = c.rccl == null ? 0 : c.rccl * 1;
            var d = a.value,
                e = d.slice(0, c.rcs),
                f = d.slice(c.rcs + c.rccl, d == "" ? 0 : d.length);
            a.value = e + b + f;
            this.setCursor(a, c.rcs + (b == null ? 0 : b.length))
        };
        return b
    });
    STK.register("lib.kit.dom.textSelection", function (a) {
        return function (b, c) {
            var d, e;
            d = {};
            e = a.parseParam({}, c);
            var f = function (c) {
                    return a.core.dom.selectText(b, c)
                },
                g = function () {
                    b.__areaQuery = a.jsonToQuery(a.core.dom.textSelectArea(b))
                },
                h = function () {
                    b.__areaQuery = !1
                };
            a.addEvent(b, "beforedeactivate", g);
            a.addEvent(b, "active", h);
            var i = function () {
                    var c = null;
                    try {
                        c = a.core.dom.textSelectArea(b)
                    } catch (d) {
                        c = a.queryToJson(b.__areaQuery)
                    }
                    c.start === 0 && c.len === 0 && b.__areaQuery && (c = a.queryToJson(b.__areaQuery));
                    c.start = parseInt(c.start, 10);
                    c.len = parseInt(c.len, 10);
                    return c
                },
                j = function (a, c) {
                    var d = b.value,
                        e = c.start,
                        f = c.len || 0,
                        g = d.slice(0, e),
                        h = d.slice(e + f, d.length);
                    b.value = g + a + h;
                    d = null;
                    g = null;
                    h = null;
                    var e = null,
                        f = null
                };
            d.setCursor = function (a) {
                f(a)
            };
            d.getCursor = function () {
                return i()
            };
            d.insertCursor = function (a) {
                var b = i();
                j(a, b);
                b.len = a.length;
                f(b)
            };
            d.TempletCursor = function (c) {
                var d, e, g;
                d = i();
                d.len > 0 ? e = b.value.substr(d.start, d.len) : e = "";
                g = a.templet(c, {
                    origin: e
                });
                j(g, d);
                d.start = d.start + c.indexOf("#{origin");
                d.len = g.length - c.replace(/#\{[origin].+?\}/, "").length;
                f(d)
            };
            d.insertText = j;
            d.destroy = function () {
                a.removeEvent(b, "beforedeactivate", g);
                a.removeEvent(b, "active", h);
                b = null
            };
            return d
        }
    });
    STK.register("lib.kit.dom.smartInput", function (a) {
        return function (b, c) {
            var d, e, f, g, h, i, j, k, l, m = "stop",
                n, o, p, q, r;
            d = a.parseParam({
                notice: "",
                currentClass: null,
                noticeClass: null,
                noticeStyle: null,
                maxLength: null,
                needLazyInput: !1,
                LazyInputDelay: 200
            }, c);
            e = a.cascadeNode(b);
            h = a.lib.kit.dom.textSelection(b);
            a.custEvent.define(e, "enter");
            a.custEvent.define(e, "ctrlEnter");
            a.custEvent.define(e, "lazyInput");
            f = function () {
                d.maxLength && a.bLength(b.value) > d.maxLength && (b.value = a.leftB(b.value, d.maxLength))
            };
            o = function () {
                if (b.value === d.notice) {
                    b.value = "";
                    d.noticeClass != null && a.removeClassName(b, d.noticeClass)
                }
                d.currentClass != null && a.addClassName(b.parentNode, d.currentClass)
            };
            p = function () {
                if (b.value === "") {
                    b.value = d.notice;
                    d.noticeClass != null && a.addClassName(b, d.noticeClass)
                }
                d.currentClass != null && a.removeClassName(b.parentNode, d.currentClass)
            };
            g = function () {
                f();
                return b.value === d.notice ? "" : b.value
            };
            q = function (b) {
                b.keyCode === 13 && a.custEvent.fire(e, "enter", g())
            };
            r = function (b) {
                (b.keyCode === 13 || b.keyCode === 10) && b.ctrlKey && a.custEvent.fire(e, "ctrlEnter", g())
            };
            i = function () {
                if (m === "stop") {
                    l = setInterval(k, d.LazyInputDelay);
                    m = "sleep"
                }
            };
            j = function () {
                clearInterval(l);
                m = "stop"
            };
            k = function () {
                if (n === b.value)
                    if (m === "weakup") {
                        a.custEvent.fire(e, "lazyInput", b.value);
                        m = "sleep"
                    } else m === "waiting" && (m = "weakup");
                else m = "waiting";
                n = b.value
            };
            if (d.needLazyInput) {
                a.addEvent(b, "focus", i);
                a.addEvent(b, "blur", j)
            }
            a.addEvent(b, "focus", o);
            a.addEvent(b, "blur", p);
            a.addEvent(b, "keyup", f);
            a.addEvent(b, "keydown", q);
            a.addEvent(b, "keydown", r);
            e.getValue = g;
            e.setValue = function (a) {
                b.value = a;
                f();
                return e
            };
            e.setNotice = function (a) {
                d.notice = a;
                return e
            };
            e.setNoticeClass = function (a) {
                d.noticeClass = a;
                return e
            };
            e.setNoticeStyle = function (a) {
                d.noticeStyle = a;
                return e
            };
            e.setMaxLength = function (a) {
                d.maxLength = a;
                return e
            };
            e.restart = function () {
                p()
            };
            e.startLazyInput = i;
            e.stopLazyInput = j;
            e.setCursor = h.setCursor;
            e.getCursor = h.getCursor;
            e.insertCursor = h.insertCursor;
            e.insertText = h.insertText;
            e.destroy = function () {
                if (d.needLazyInput) {
                    a.removeEvent(b, "focus", o);
                    a.removeEvent(b, "blur", p)
                }
                j();
                a.removeEvent(b, "focus", o);
                a.removeEvent(b, "blur", p);
                a.removeEvent(b, "keyup", f);
                a.removeEvent(b, "keydown", q);
                a.removeEvent(b, "keydown", r);
                a.custEvent.undefine(e, "enter");
                a.custEvent.undefine(e, "ctrlEnter");
                a.custEvent.undefine(e, "lazyInput");
                h.destroy();
                e = null
            };
            return e
        }
    });
    STK.register("lib.dialog.setRemark", function (a) {
        var b = a.lib.kit.extra.merge,
            c = '<div class="W_layer" style="top:50px;left:550px;"><div class="content"><div class="W_layer_title" node-type="title">#L{设置备注名}</div><div class="W_layer_close"><a href="javascript:void(0);" node-type="close" class="W_ficon ficon_close S_ficon">X</a></div><div class="layer_prompt" ><dl class="clearfix"><dt node-type="label">#L{备注名}:</dt><dd><input type="text" class="W_input W_input_default" node-type="input"></dd></dl></div><div class="W_layer_btn S_bg1"><a href="javascript:void(0);" action-type="ok" class="W_btn_a btn_34px">#L{确定}</a><a href="javascript:void(0)" action-type="close" class="W_btn_b btn_34px">#L{取消}</a></div></div></div>';
        return function (d) {
            function o(a) {
                return d.extraPostData ? b(a, typeof d.extraPostData == "function" ? d.extraPostData() : d.extraPostData) : a
            }
            var e = a.lib.kit.extra.language,
                f, g, h, i, j, k, l, m = "",
                n = {},
                p = {
                    init: function () {
                        p.pars();
                        p.build()
                    },
                    pars: function () {
                        d = d || {};
                        j = d.trans || a.conf.trans.setRemark;
                        k = d.transName || "setRemark";
                        f = d.uid;
                        if (d.uid != null) {
                            g = a.trim(d.remark || "");
                            h = d.callback
                        }
                    },
                    build: function () {
                        i = a.ui.dialog(e(c)).show().on("ok", "click", function () {
                            m = a.trim(b.getValue());
                            if (m === g) {
                                h && h(g);
                                i.hide()
                            } else j.request(k, {
                                onSuccess: function (a, b) {
                                    h && h(m);
                                    i.hide()
                                } || a.funcEmpty,
                                onError: function (b, c) {
                                    a.lib.dialog.ioError(b.code, b, {
                                        beside: i.getDomList().input
                                    })
                                },
                                onFail: function (b, c) {
                                    a.lib.dialog.ioError(b.code, b, {
                                        beside: i.getDomList().input
                                    })
                                }
                            }, o({
                                touid: f,
                                remark: encodeURIComponent(m)
                            }))
                        });
                        i.on("close", "click", function () {
                            i.hide()
                        });
                        var b = a.lib.kit.dom.smartInput(i.getDomList().input);
                        b.setNotice(e("#L{请输入备注名}"));
                        b.setValue(g || "");
                        b.setMaxLength(30);
                        b.restart();
                        a.addEvent(b, "keydown", function () {
                            b.value = a.leftB(b.value, 30)
                        });
                        setTimeout(function () {
                            b.setCursor({
                                start: b.getValue().length,
                                len: 0
                            })
                        }, 0)
                    },
                    destroy: function () {
                        i.destroy()
                    }
                };
            p.init();
            n.destroy = p.destroy;
            return n
        }
    });
    STK.register("lib.kit.touch.cantouch", function (a) {
        return STK.core.util.browser.IPAD
    });
    STK.register("lib.kit.dom.hover", function (a) {
        function b(b, c) {
            var d = c.length;
            while (d--)
                if (c[d] === b || a.contains(c[d], b)) return !0;
            return !1
        }
        var c = {};
        return a.lib.kit.touch.cantouch ? function (d) {
            var e = d.act,
                f = d.extra || [],
                g = function (a) {
                    d.onmouseover.apply(e, [a])
                },
                h = function (a) {
                    d.onmouseout.apply(e, [a])
                },
                i = function (c, d) {
                    b(a.fixEvent(d).target, [e].concat(f)) ? g(d) : h(d)
                };
            if (!("inited" in c)) {
                c.inited = !0;
                a.custEvent.define(c, ["tap"]);
                a.addEvent(document.body, "tap", function (b) {
                    a.custEvent.fire(c, "tap", b)
                })
            }
            a.custEvent.add(c, "tap", i);
            return {
                destroy: function () {
                    a.removeEvent(document.body, "tap", i)
                }
            }
        } : function (b) {
            var c = b.delay || 300,
                d = b.moutDelay || c,
                e = b.isover || !1,
                f = b.act,
                g = b.extra || [],
                h = null,
                i = function (a) {
                    e && b.onmouseover.apply(f, [a])
                },
                j = function (a) {
                    e || b.onmouseout.apply(f, [a])
                },
                k = function (a) {
                    e = !0;
                    h && clearTimeout(h);
                    h = setTimeout(function () {
                        i(a)
                    }, c)
                },
                l = function (a) {
                    e = !1;
                    h && clearTimeout(h);
                    h = setTimeout(function () {
                        j(a)
                    }, d)
                };
            a.core.evt.addEvent(f, "mouseover", k);
            a.core.evt.addEvent(f, "mouseout", l);
            for (var m = 0, n = g.length; m < n; m += 1) {
                a.core.evt.addEvent(g[m], "mouseover", k);
                a.core.evt.addEvent(g[m], "mouseout", l)
            }
            var o = {};
            o.destroy = function () {
                a.core.evt.removeEvent(f, "mouseover", k);
                a.core.evt.removeEvent(f, "mouseout", l);
                for (var b = 0, c = g.length; b < c; b += 1) {
                    a.core.evt.removeEvent(g[b], "mouseover", k);
                    a.core.evt.removeEvent(g[b], "mouseout", l)
                }
            };
            return o
        }
    });
    STK.register("lib.kit.dom.firstChild", function (a) {
        var b = a.core.dom.next;
        return function (a) {
            var c = a.firstChild;
            c && c.nodeType != 1 && (c = b(c));
            return c
        }
    });
    STK.register("lib.follow.followButton", function (a) {
        function l(c, d, e) {
            a.foreach(k, function (b) {
                a.removeClassName(c, b)
            });
            a.foreach([].concat(d[1]), function (b) {
                a.addClassName(c, b)
            });
            e === !1 ? c.innerHTML = b(d[0]) : a.ui.badge(c, b(d[0]));
            c.setAttribute("action-type", d[2])
        }
        var b = a.lib.kit.extra.language,
            c = a.templet,
            d = a.conf.channel.follow,
            e = a.lib.kit.extra.merge,
            f = a.lib.kit.dom.hover,
            g = a.conf.trans.relation,
            h = a.lib.dialog.ioError,
            i = {
                0: {
                    temp_follow: ['<em class="W_ficon ficon_right S_ficon">Y</em>#L{已关注}<em class="W_ficon ficon_arrow_down_lite S_ficon">g</em>', "W_btn_d", "unFollow"],
                    temp_followBoth: ['<em class="W_ficon ficon_addtwo S_ficon">Z</em>#L{互相关注}<em class="W_ficon ficon_arrow_down_lite S_ficon">g</em>', "W_btn_d", "unFollow"],
                    temp_unfollow: ['<em class="W_ficon ficon_add">+</em>#L{关注}', "W_btn_c", "follow"],
                    temp_unfollowFan: ['<em class="W_ficon ficon_right S_ficon">Y</em><em class="W_vline S_line1"></em><em class="W_ficon ficon_add">+</em>#L{关注}', "W_btn_c", "follow"],
                    temp_block: ["#L{解除黑名单}", "W_btn_d", "unBlock"],
                    temp_loading: ['<i class="W_loading"></i>#L{关注中}', "W_btn_c", "noop"],
                    temp_loading2: ['<i class="W_loading"></i>#L{取消关注中}', "W_btn_d", "noop"],
                    temp_layer: ['<div class="layer_menu_list_b" style="position:absolute;z-index:3000;"><div class="list_wrap"><div class="list_content W_f14"><ul class="list_ul"><li action-type="ok" class="item"><a href="javascript:void(0);" suda-data="key=tblog_profile_v6&value=cancel_atten" class="tlink S_txt1">#L{取消关注}</a></li><li class="item" action-type="setGroup"><a href="javascript:void(0);" suda-data="key=tblog_profile_v6&value=set_up_groups" class="tlink S_txt1">#L{设置分组}</a></li></ul></div></div>'],
                    temp_layerOffset: {
                        x: 1,
                        y: 2,
                        width: 0
                    }
                },
                1: {
                    temp_follow: ['<em class="W_ficon ficon_right">Y</em>#L{已关注}<em class="W_ficon ficon_arrow_down_lite">g</em>', "W_btn_b", "unFollow"],
                    temp_followBoth: ['<em class="W_ficon ficon_addtwo">Z</em>#L{互相关注}<em class="W_ficon ficon_arrow_down_lite">g</em>', "W_btn_b", "unFollow"],
                    temp_unfollow: ['<em class="W_ficon ficon_add">+</em>#L{关注}', "W_btn_b", "follow"],
                    temp_unfollowFan: ['<em class="W_ficon ficon_right">Y</em><em class="W_vline S_line1"></em><em class="W_ficon ficon_add">+</em>#L{关注}', "W_btn_b", "follow"],
                    temp_block: ["#L{解除黑名单}", "W_btn_b", "unBlock"],
                    temp_loading: ['<i class="W_loading"></i>#L{关注中}', "W_btn_b", "noop"],
                    temp_loading2: ['<i class="W_loading"></i>#L{取消关注中}', "W_btn_b", "noop"],
                    temp_layer: ['<div class="layer_menu_list" style="position:absolute;z-index:3000;"><ul><li action-type="ok"><a href="javascript:void(0);">#L{取消关注}</a></li><li action-type="setGroup"><a href="javascript:void(0);">#L{设置分组}</a></li></ul></div>']
                },
                2: {
                    temp_follow: ["#L{已关注}", ["W_btn_b", "W_btn_b W_btn_b_disable"], "noop"],
                    temp_followBoth: ["#L{已关注}", ["W_btn_b", "W_btn_b W_btn_b_disable"], "noop"],
                    temp_unfollow: ['<em class="W_ficon ficon_add">+</em>#L{关注}', "W_btn_b", "follow"],
                    temp_unfollowFan: ['<em class="W_ficon ficon_add">+</em>#L{关注}', "W_btn_b", "follow"],
                    temp_block: ["#L{解除黑名单}", "W_btn_b", "unBlock"],
                    temp_loading: ['<em class="W_ficon ficon_add">+</em>#L{关注}', "W_btn_b", "noop"],
                    temp_loading2: ["#L{已关注}", "W_btn_b", ""],
                    temp_layer: [""]
                },
                3: {
                    temp_follow: ['<em class="W_ficon ficon_right">Y</em>#L{已关注}', "W_btn_b W_btn_b_disable", "noop"],
                    temp_followBoth: ['<em class="W_ficon ficon_right">Y</em>#L{已关注}', "W_btn_b W_btn_b_disable", "noop"],
                    temp_unfollow: ['<em class="W_ficon ficon_add">+</em>#L{关注}', "W_btn_b", "follow"],
                    temp_unfollowFan: ['<em class="W_ficon ficon_add">+</em>#L{关注}', "W_btn_b", "follow"],
                    temp_block: ["#L{解除黑名单}", "W_btn_b", "unBlock"],
                    temp_loading: ['<i class="W_loading"></i>#L{关注中}', "W_btn_b", "noop"],
                    temp_loading2: ['<i class="W_loading"></i>#L{取消关注中}', "W_btn_b", "noop"],
                    temp_layer: [""]
                },
                4: {
                    temp_follow: ['<em class="W_ficon ficon_right">Y</em>#L{已关注}<em class="W_ficon ficon_arrow_down_lite">g</em>', "W_btn_b", "unFollow"],
                    temp_followBoth: ['<em class="W_ficon ficon_addtwo">Z</em>#L{互相关注}<em class="W_ficon ficon_arrow_down_lite">g</em>', "W_btn_b", "unFollow"],
                    temp_unfollow: ['<em class="W_ficon ficon_add">+</em>#L{关注}', "W_btn_b", "follow"],
                    temp_unfollowFan: ['<em class="W_ficon ficon_right">Y</em><em class="W_vline S_line1"></em><em class="W_ficon ficon_add">+</em>#L{关注}', "W_btn_c", "follow"],
                    temp_block: ["#L{解除黑名单}", "W_btn_b", "unBlock"],
                    temp_loading: ['<i class="W_loading"></i>#L{关注中}', "W_btn_b", "noop"],
                    temp_loading2: ['<i class="W_loading"></i>#L{取消关注中}', "W_btn_b", "noop"],
                    temp_layer: ['<div class="layer_menu_list_b" style="position:absolute;z-index:3000;"><div class="list_wrap"><div class="list_content W_f14"><ul class="list_ul"><li action-type="ok" class="item"><a href="javascript:void(0);" suda-data="key=tblog_profile_v6&value=cancel_atten" class="tlink S_txt1">#L{取消关注}</a></li><li class="item" action-type="setGroup"><a href="javascript:void(0);" suda-data="key=tblog_profile_v6&value=set_up_groups" class="tlink S_txt1">#L{设置分组}</a></li></ul></div></div>', '<div class="layer_menu_list_b" style="position:absolute;z-index:3000;"><div class="list_wrap"><div class="list_content W_f14"><ul class="list_ul"><li action-type="ok" class="item"><a href="javascript:void(0);" suda-data="key=tblog_profile_v6&value=cancel_atten" class="tlink S_txt1">#L{取消关注}</a></li></ul></div></div>'],
                    temp_layerOffset: {
                        x: 1,
                        y: 2,
                        width: 0
                    }
                },
                5: {
                    temp_follow: ["#L{已关注}", ["W_btn_b", "W_btn_b W_btn_b_disable"], "noop"],
                    temp_followBoth: ["#L{已关注}", ["W_btn_b", "W_btn_b W_btn_b_disable"], "noop"],
                    temp_unfollow: ['<em class="W_ficon icon_hongbao">+</em>#L{关注}', "W_btn_b", "follow"],
                    temp_unfollowFan: ['<em class="W_ficon icon_hongbao">+</em>#L{关注}', "W_btn_b", "follow"],
                    temp_block: ["#L{解除黑名单}", "W_btn_b", "unBlock"],
                    temp_loading: ["#L{关注中}", "W_btn_b", ""],
                    temp_loading2: ["#L{取消中}", "W_btn_b", ""],
                    temp_layer: [""]
                },
                6: {
                    temp_follow: ['<em class="W_ficon ficon_right S_ficon">Y</em>#L{已关注}', "W_btn_d", "noop"],
                    temp_followBoth: ['<em class="W_ficon ficon_addtwo S_ficon">Z</em>#L{互相关注}', "W_btn_d", "noop"],
                    temp_unfollow: ['<em class="W_ficon ficon_add">+</em>#L{关注}', "W_btn_c", "follow"],
                    temp_unfollowFan: ['<em class="W_ficon ficon_right S_ficon">Y</em><em class="W_vline S_line1"></em><em class="W_ficon ficon_add">+</em>#L{关注}', "W_btn_c", "follow"],
                    temp_block: ["#L{解除黑名单}", "W_btn_d", "unBlock"],
                    temp_loading: ['<i class="W_loading"></i>#L{关注中}', "W_btn_c", "noop"],
                    temp_loading2: ['<i class="W_loading"></i>#L{取消关注中}', "W_btn_d", "noop"]
                },
                7: {
                    temp_follow: ['<em class="W_ficon ficon_right S_ficon">Y</em>#L{已关注}', "W_btn_d", "unFollow"],
                    temp_special: ['<em class="W_ficon ficon_right S_ficon">Y</em>#L{特别关注}', "W_btn_d", "unFollow"],
                    temp_followBoth: ['<em class="W_ficon ficon_addtwo S_ficon">Z</em>#L{互相关注}', "W_btn_d", "unFollow"],
                    temp_unfollow: ['<em class="W_ficon ficon_add">+</em>#L{关注}', "W_btn_c", "follow"],
                    temp_unfollowFan: ['<em class="W_ficon ficon_right S_ficon">Y</em><em class="W_vline S_line1"></em><em class="W_ficon ficon_add">+</em>#L{关注}', "W_btn_c", "follow"],
                    temp_block: ["#L{解除黑名单}", "W_btn_d", "unBlock"],
                    temp_loading: ['<i class="W_loading"></i>#L{关注中}', "W_btn_c", "noop"],
                    temp_loading1: ['<i class="W_loading"></i>#L{关注中}', "W_btn_d", "noop"],
                    temp_loading2: ['<i class="W_loading"></i>#L{取消关注中}', "W_btn_d", "noop"],
                    temp_layer: ['<div class="layer_menu_list_b" style="position:absolute;z-index:3000;"><div class="list_wrap"><div class="list_content W_f14"><ul class="list_ul"></li><li class="item" action-type="setGroup"><a href="javascript:void(0);" class="tlink S_txt1">#L{设置分组}</a></li><li class="item"><a href="javascript:void(0);" action-type="setRemark" action-data="remark=" class="tlink">#L{设置备注}</a></li><li action-type="ok" class="item"><a href="javascript:void(0);" class="tlink S_txt1">#L{取消关注}</a></li></ul></div></div>'],
                    temp_layerS: ['<div class="layer_menu_list_b" style="position:absolute;z-index:3000;"><div class="list_wrap"><div class="list_content W_f14"><ul class="list_ul"><li class="item" action-type="setSpecial" action-data="special=1"><a href="javascript:void(0);" class="tlink S_txt1">#L{设为特别关注}</a></li><li class="item" action-type="setGroup"><a href="javascript:void(0);" class="tlink S_txt1">#L{设置分组}</a></li><li class="item"><a href="javascript:void(0);" action-type="setRemark" action-data="remark=" class="tlink">#L{设置备注}</a></li><li action-type="ok" class="item"><a href="javascript:void(0);" class="tlink S_txt1">#L{取消关注}</a></li></ul></div></div>', '<div class="layer_menu_list_b" style="position:absolute;z-index:3000;"><div class="list_wrap"><div class="list_content W_f14"><ul class="list_ul"><li class="item" action-type="setSpecial" action-data="special=0"><a href="javascript:void(0);" class="tlink S_txt1">#L{移出特别关注}</a></li><li class="item" action-type="setGroup"><a href="javascript:void(0);" class="tlink S_txt1">#L{设置分组}</a></li><li class="item"><a href="javascript:void(0);" action-type="setRemark" action-data="remark=" class="tlink">#L{设置备注}</a></li><li action-type="ok" class="item"><a href="javascript:void(0);" class="tlink S_txt1">#L{取消关注}</a></li></ul></div></div>'],
                    temp_layerOffset: {
                        x: 1,
                        y: 2,
                        width: 0
                    }
                },
                8: {
                    temp_follow: ['<em class="W_ficon ficon_right">Y</em>#L{已关注}', "W_btn_b", "unFollow"],
                    temp_special: ['<em class="W_ficon ficon_right">Y</em>#L{特别关注}', "W_btn_b", "unFollow"],
                    temp_followBoth: ['<em class="W_ficon ficon_addtwo">Z</em>#L{互相关注}', "W_btn_b", "unFollow"],
                    temp_unfollow: ['<em class="W_ficon ficon_add">+</em>#L{关注}', "W_btn_b", "follow"],
                    temp_unfollowFan: ['<em class="W_ficon ficon_right">Y</em><em class="W_vline S_line1"></em><em class="W_ficon ficon_add">+</em>#L{关注}', "W_btn_b", "follow"],
                    temp_block: ["#L{解除黑名单}", "W_btn_b", "unBlock"],
                    temp_loading: ['<i class="W_loading"></i>#L{关注中}', "W_btn_b", "noop"],
                    temp_loading1: ['<i class="W_loading"></i>#L{关注中}', "W_btn_b", "noop"],
                    temp_loading2: ['<i class="W_loading"></i>#L{取消关注中}', "W_btn_b", "noop"],
                    temp_layer: ['<div class="layer_menu_list" style="position:absolute;z-index:3000;"><ul></li><li action-type="setGroup"><a href="javascript:void(0);">#L{设置分组}</a></li><li action-type="setRemark"><a href="javascript:void(0);">#L{设置备注}</a></li><li action-type="ok"><a href="javascript:void(0);">#L{取消关注}</a></li></ul></div>'],
                    temp_layerS: ['<div class="layer_menu_list" style="position:absolute;z-index:3000;"><ul><li action-type="setSpecial" action-data="special=1"><a href="javascript:void(0);">#L{设为特别关注}</a></li><li action-type="setGroup"><a href="javascript:void(0);">#L{设置分组}</a></li><li action-type="setRemark"><a href="javascript:void(0);">#L{设置备注}</a></li><li action-type="ok"><a href="javascript:void(0);">#L{取消关注}</a></li></ul></div>', '<div class="layer_menu_list" style="position:absolute;z-index:3000;"><ul><li action-type="setSpecial" action-data="special=0"><a href="javascript:void(0);">#L{移出特别关注}</a></li><li action-type="setGroup"><a href="javascript:void(0);">#L{设置分组}</a></li><li action-type="setRemark"><a href="javascript:void(0);">#L{设置备注}</a></li><li action-type="ok"><a href="javascript:void(0);">#L{取消关注}</a></li></ul></div>']
                }
            },
            j = {
                profile_headerv6: {
                    special: ["wb_pc_profile", "FolHover_SpeFol"],
                    group: ["wb_pc_profile", "FolHover_SetGop"],
                    remark: ["wb_pc_profile", "FolHover_SetAli"],
                    unFollow: ["wb_pc_profile", "FolHover_RemFol"],
                    delSpecial: ["wb_pc_profile", "SpeFolHover_RemSpeFol"]
                },
                single_weibo: {
                    special: ["weibo_pc_PostFollow", "FolHover_SpeFol"],
                    group: ["weibo_pc_PostFollow", "FolHover_SetGop"],
                    remark: ["weibo_pc_PostFollow", "FolHover_SetAli"],
                    unFollow: ["weibo_pc_PostFollow", "FolHover_RemFol"],
                    delSpecial: ["weibo_pc_PostFollow", "SpeFolHover_RemSpeFol"]
                },
                hotfeed: {
                    special: ["weibo_pc_PostFollow_hot", "FolHover_SpeFol"],
                    group: ["weibo_pc_PostFollow_hot", "FolHover_SetGop"],
                    remark: ["weibo_pc_PostFollow_hot", "FolHover_SetAli"],
                    unFollow: ["weibo_pc_PostFollow_hot", "FolHover_RemFol"],
                    delSpecial: ["weibo_pc_PostFollow_hot", "SpeFolHover_RemSpeFol"]
                },
                profile_card: {
                    special: ["V6newcard", "FolHover_SpeFol"],
                    group: ["V6newcard", "FolHover_SetGop"],
                    remark: ["V6newcard", "FolHover_SetAli"],
                    unFollow: ["V6newcard", "FolHover_RemFol"],
                    delSpecial: ["V6newcard", "SpeFolHover_RemSpeFol"]
                },
                homefeed: {
                    special: ["weibo_pc_PostFollow_feed", "FolHover_SpeFol"],
                    group: ["weibo_pc_PostFollow_feed", "FolHover_SetGop"],
                    remark: ["weibo_pc_PostFollow_feed", "FolHover_SetAli"],
                    unFollow: ["weibo_pc_PostFollow_feed", "FolHover_RemFol"],
                    delSpecial: ["weibo_pc_PostFollow_feed", "SpeFolHover_RemSpeFol"]
                }
            },
            k = ["W_btn_a", "W_btn_b", "W_btn_c", "W_btn_d", "W_btn_a_disable", "W_btn_b_disable", "W_btn_c_disable", "W_btn_d_disable"],
            m = function (a, b) {
                if (a.type != "mouseout" && a.type != "mouseover") return !1;
                var c = a.relatedTarget ? a.relatedTarget : a.type == "mouseout" ? a.toElement : a.fromElement;
                while (c && c != b) c = c.parentNode;
                return c != b
            },
            n = {
                getAttrData: function (b, c) {
                    if (!!b && !!c) {
                        var d = b.getAttribute(c),
                            e = d && a.queryToJson(d) || !1;
                        return e
                    }
                },
                setAttrData: function (b, c, d) {
                    var e = this.getAttrData(b, c) || {};
                    e = a.core.json.merge(e, d);
                    b.setAttribute(c, a.jsonToQuery(e))
                },
                sendSuda: function (a, b) {
                    window.SUDA && window.SUDA.uaTrack && window.SUDA.uaTrack(a, b)
                }
            };
        return function (c) {
            function u(a) {
                return c.extraPostData ? e(a, typeof c.extraPostData == "function" ? c.extraPostData() : c.extraPostData) : a
            }
            var k = {},
                c = a.parseParam({
                    outer: null,
                    outNodeExpr: '[node-type="followBtnBox"]',
                    refer_sort: "",
                    refer_flag: "",
                    extraPostData: {},
                    needSync: !1,
                    followOpts: null
                }, c),
                o, p = null,
                q = a.lib.follow.utils.follow(c.followOpts),
                r = a.lib.dialog.setGroup,
                s = a.ui.confirm,
                t = a.delegatedEvent(c.outer),
                v = function (b) {
                    return a.core.dom.dir.parent(b, {
                        expr: c.outNodeExpr
                    })[0]
                },
                w = {
                    "click:follow": function (b) {
                        a.preventDefault();
                        var d = v(b.el);
                        if (!!d) {
                            var e = b.el,
                                f = a.queryToJson(d.getAttribute("action-data") || ""),
                                g = d.innerHTML,
                                h, j = f.template || "0";
                            f.onSuccessCb = function (b) {
                                var c = b.relation,
                                    g = c && c.follow_me == 1;
                                l(p = e, i[j][g ? "temp_followBoth" : "temp_follow"]);
                                a.custEvent.fire(k, "change", {
                                    state: "follow",
                                    data: a.core.json.merge(f, b),
                                    el: e
                                });
                                b.isrecommend == 1 && b.wforce != 0 && a.custEvent.fire(k, "recommend", {
                                    state: "follow",
                                    data: b,
                                    el: d
                                });
                                b.tipMessage && a.ui.tipAlert(b.tipMessage).beside(a.lib.kit.dom.firstChild(d));
                                b.groupList = b.group;
                                b.fromFollow = !0;
                                if (!b.nogroup) {
                                    o || (o = r());
                                    setTimeout(function () {
                                        o.show(b);
                                        a.custEvent.fire(k, "showDialog")
                                    }, 700)
                                }
                            };
                            f.onFailCb = function (a) {
                                h && (d.innerHTML = h)
                            };
                            f.onRelease = function () {
                                d.innerHTML = g
                            };
                            setTimeout(function () {
                                h = d.innerHTML;
                                l(e, i[j].temp_loading, !1);
                                f.refer_sort = f.refer_sort || c.refer_sort;
                                f.refer_flag = f.refer_flag || c.refer_flag;
                                f = u(f);
                                if (f.proxy_api) {
                                    f.api = f.proxy_api;
                                    delete f.proxy_api;
                                    a.lib.follow.utils.follow({
                                        transNameFollow: "proxy"
                                    }).follow(f)
                                } else q.follow(f)
                            }, 0)
                        }
                    },
                    "mouseout:unFollow": function (b) {
                        a.preventDefault();
                        if (!!m(b.evt, b.el)) {
                            var c = v(b.el);
                            if (c) {
                                clearTimeout(c.t);
                                c.t = null
                            }
                        }
                    },
                    "mouseover:unFollow": function (c) {
                        a.preventDefault();
                        if (!!m(c.evt, c.el)) {
                            var e = v(c.el);
                            if (!e) return;
                            e.confirm || (e.t = setTimeout(function () {
                                var m = c.el,
                                    s = a.queryToJson(e.getAttribute("action-data") || ""),
                                    t = e.innerHTML,
                                    v = s.template || "0",
                                    w, x, y = s.refer_from,
                                    z = s.special_focus && s.special_focus == 1 ? "temp_layerS" : "temp_layer";
                                if (!!i[v][z] && !!i[v][z][0]) {
                                    s.onSuccessCb = function (b) {
                                        var c = b.relation,
                                            d = c && c.follow_me == 1;
                                        l(p = m, i[v][d ? "temp_unfollowFan" : "temp_unfollow"]);
                                        a.custEvent.fire(k, "change", {
                                            state: "unfollow",
                                            data: b,
                                            el: m
                                        });
                                        b.isrecommend == 1 && a.custEvent.fire(k, "recommend", {
                                            state: "unfollow",
                                            data: b,
                                            el: e
                                        })
                                    };
                                    s.onFailCb = function (a) {
                                        w && (e.innerHTML = w)
                                    };
                                    var A = function () {
                                            var a = y && j[y] && j[y].unFollow;
                                            a && n.sendSuda(a[0], a[1]);
                                            w = e.innerHTML;
                                            l(m, i[v].temp_loading2, !1);
                                            s.refer_sort = "";
                                            s = u(s);
                                            q.unFollow(s);
                                            e.hover.destroy();
                                            e.confirm.hide();
                                            setTimeout(function () {
                                                e.confirm.hide();
                                                e.confirm.destroy();
                                                e.confirm = null
                                            }, 100)
                                        },
                                        B = function (b) {
                                            var c = a.core.util.browser.IE6 ? "width" : "minWidth",
                                                d = i[v].temp_layerOffset ? i[v].temp_layerOffset.width | 0 : 0;
                                            b.style[c] = m.offsetWidth - (parseInt(a.getStyle(b, "padding-left")) || 0) - (parseInt(a.getStyle(b, "padding-right")) || 0) - (parseInt(a.getStyle(b, "border-left")) || 0) - (parseInt(a.getStyle(b, "border-right")) || 0) + d + "px"
                                        },
                                        C = function (c) {
                                            var f = c.el,
                                                k = c.data,
                                                o = a.sizzle("em", m)[0];
                                            if (!!o) {
                                                w = e.innerHTML;
                                                var q = {
                                                        uids: s.uid
                                                    },
                                                    r = y && j[y] && j[y][k.special == 1 ? "special" : "delSpecial"];
                                                r && n.sendSuda(r[0], r[1]);
                                                var t = function (c) {
                                                        var g = a.sizzle("a", f)[0];
                                                        g.innerHTML = k.special == 1 ? "移出特别关注" : "设为特别关注";
                                                        var h = c.data.follow_data && c.data.follow_data[s.uid] && c.data.follow_data[s.uid].follow_me == 1;
                                                        l(m, i[v][h ? "temp_followBoth" : k.special == 1 ? "temp_special" : "temp_follow"], !1);
                                                        k.special == 1 ? a.ui.alert([b("#L{Ta发布的微博在信息流将置顶显示。}"), b("#L{<a href=%s>特别关注管理</a>}", "//weibo.com" + decodeURIComponent(s.redirect_url))], {
                                                            okText: b("#L{我知道了}"),
                                                            icon: "succB"
                                                        }) : null;
                                                        n.setAttrData(f, "action-data", {
                                                            special: k.special == 1 ? 0 : 1
                                                        });
                                                        e.confirm.hide();
                                                        s.isSpecial = k.special;
                                                        s.lastBtn = p;
                                                        s.both = h;
                                                        d.fire("specialFollow", s)
                                                    },
                                                    u = function (a) {
                                                        h(a.code, a);
                                                        w && (e.innerHTML = w);
                                                        e.confirm.hide();
                                                        e.confirm.destroy();
                                                        e.confirm = null
                                                    };
                                                l(m, i[v][k.special == 1 ? "temp_loading1" : "temp_loading2"], !1);
                                                g.request(k.special == 1 ? "addSpeical" : "delSpecial", {
                                                    onSuccess: t,
                                                    onFail: u,
                                                    onError: u
                                                }, q)
                                            }
                                        },
                                        D = i[v][z][0];
                                    if (s.isinterest === "true" || s.special_focus == 1 && s.is_special == 1) D = i[v][z][1];
                                    e.confirm = a.ui.mlayer(D, {
                                        stopClickPropagation: !0
                                    }).on("ok", "click", A).on("setGroup", "click", function () {
                                        var b = y && j[y] && j[y].group;
                                        b && n.sendSuda(b[0], b[1]);
                                        o || (o = r());
                                        o.show(s);
                                        e.confirm.hide();
                                        a.custEvent.fire(k, "showDialog")
                                    }).on("setRemark", "click", function (b) {
                                        var c = y && j[y] && j[y].remark;
                                        c && n.sendSuda(c[0], c[1]);
                                        a.custEvent.fire(k, "setRemark", {
                                            data: a.core.json.merge(s, b.data),
                                            el: b.el
                                        })
                                    }).on("setSpecial", "click", C);
                                    e.hover = f({
                                        act: m,
                                        extra: [e.confirm.getBox()],
                                        delay: 200,
                                        isover: !0,
                                        onmouseover: function () {
                                            e.confirm && !e.confirm.getState() && B(e.confirm.show().beside(m, {
                                                pos: "bottom-left",
                                                offsetX: E,
                                                offsetY: F
                                            }).getBox())
                                        },
                                        onmouseout: function () {
                                            e.confirm && e.confirm.hide && e.confirm.hide();
                                            clearTimeout(x)
                                        }
                                    });
                                    var E = i[v].temp_layerOffset ? i[v].temp_layerOffset.x | 0 : 0,
                                        F = i[v].temp_layerOffset ? i[v].temp_layerOffset.y | 0 : 0;
                                    B(e.confirm.show().beside(m, {
                                        pos: "bottom-left",
                                        offsetX: E,
                                        offsetY: F
                                    }).getBox())
                                }
                            }, 200))
                        }
                    },
                    "click:unBlock": function (c) {
                        var d = v(c.el);
                        if (!!d) {
                            var e = c.el,
                                f = a.queryToJson(d.getAttribute("action-data") || ""),
                                g = d.innerHTML,
                                h = f.template || "0";
                            f.onSuccessCb = function () {
                                window.location.reload()
                            };
                            var i = function () {
                                f = u(f);
                                q.unBlock(f)
                            };
                            s(b("#L{确认将此用户从你的黑名单中移除吗？}"), {
                                OK: i
                            });
                            a.custEvent.fire(k, "showDialog")
                        }
                    }
                },
                x = function (b) {
                    var d = b.uid,
                        e = b.objectid,
                        f = b.action.toLowerCase(),
                        g = b.both,
                        h = b.fan,
                        j = a.sizzle(c.outNodeExpr, c.outer);
                    for (var m = 0, n = j.length; m < n; m++) {
                        var o = j[m],
                            q = a.sizzle("[action-type=noop],[action-type=follow],[action-type=unFollow],[action-type=unBlock]", o)[0],
                            r = a.queryToJson(o.getAttribute("action-data")),
                            s = r.template || "0";
                        if (p != q)
                            if (r.uid && r.uid == d || r.objectid && r.objectid == e) {
                                f == "unfollow" ? l(q, i[s][h ? "temp_unfollowFan" : "temp_unfollow"], !1) : f == "unblock" ? l(q, i[s].temp_unfollow, !1) : f == "follow" && l(q, i[s][g ? "temp_followBoth" : "temp_follow"], !1);
                                a.custEvent.fire(k, "changeStatus", {
                                    state: f,
                                    el: q,
                                    data: r
                                })
                            }
                    }
                    p = null
                },
                y = function () {
                    a.custEvent.define(k, ["change", "showDialog", "changeStatus", "recommend", "setRemark"]);
                    a.foreach(w, function (a, b) {
                        b = b.split(":");
                        t.add(b[1], b[0], a)
                    });
                    c.needSync && d.register("changeStatus", x)
                },
                z = function () {
                    if (c.outer) {
                        a.foreach(w, function (a, b) {
                            t.remove(b, "click", a)
                        });
                        t.destroy()
                    }
                    c.needSync && d.remove("changeStatus", x)
                },
                A = function () {
                    c.outer && y()
                };
            A();
            k.renderBtn = function (a, b, c, d) {
                return l(a, i[b][c], d)
            };
            k.destroy = z;
            return k
        }
    });
    STK.register("lib.pagelimiter.index", function (a) {
        function h(a, b) {
            for (var c in b) b.hasOwnProperty(c) && (a[c] = b[c]);
            return a
        }
        var b = a.fixEvent,
            c = a.addEvent,
            d = a.removeEvent,
            e = a.custEvent,
            f = "page-limited",
            g = "sorry, page limited!";
        return function (i, j) {
            j = h({
                limitedTagName: "A",
                tagNames: "IMG|SPAN|I",
                limitText: g,
                onLimited: function () {
                    a.ui.alert(j.limitText)
                }
            }, j);
            var k = new RegExp(j.tagNames),
                l = j.limitedTagName,
                m = j.onLimited,
                n = function (c) {
                    c = b(c);
                    var d = c.target,
                        g = d.tagName.toUpperCase(),
                        h = g === l;
                    if (!h && k.test(g))
                        while (d = d.parentNode) {
                            if (d === i) return;
                            if (d.tagName.toUpperCase() === l) {
                                h = !0;
                                break
                            }
                        }
                    if (h) {
                        var j = d.getAttribute(f);
                        if (j) {
                            a.preventDefault(c);
                            e.fire(p, "filter", d);
                            m(c)
                        }
                    }
                },
                o = function () {
                    e.define(p, ["filter"]);
                    i && c(i, "click", n)
                },
                p = {
                    on: function (a, b, c) {
                        e.add(p, a, b, c)
                    },
                    un: function (a, b) {
                        e.remove(p, a, b)
                    },
                    destroy: function () {
                        e.remove(p);
                        e.undefine(p);
                        d(i, "click", n);
                        i = null;
                        n = null
                    }
                };
            o(i, j);
            return p
        }
    });
    STK.register("lib.follow.recommendFollow", function (a) {
        var b = a.lib.kit.extra.language,
            c = a.core.util.easyTemplate,
            d = a.core.ani.tween,
            e = a.conf.trans.follow,
            f = a.conf.channel.follow,
            g = {
                profile: {
                    jump: 'suda-uatrack="key=wb_pc_profile&value=Click_RecCardJump"',
                    down: 'suda-uatrack="key=wb_pc_profile&value=atten_down"',
                    up: 'suda-uatrack="key=wb_pc_profile&value=atten_up"',
                    close: 'suda-uatrack="key=wb_pc_profile&value=atten_close"',
                    right: 'suda-uatrack="key=wb_pc_profile&value=atten_flip"'
                },
                hot: {
                    jump: 'suda-uatrack="key=weibo_pc_PostFollow_hot&value=Click_RecCardJump"',
                    down: 'suda-uatrack="key=weibo_pc_PostFollow_hot&value=Click_UnfoldTri"',
                    up: 'suda-uatrack="key=weibo_pc_PostFollow_hot&value=Click_FoldTri"',
                    close: 'suda-uatrack="key=weibo_pc_PostFollow_hot&value=Click_RecCardOff"',
                    right: 'suda-uatrack="key=weibo_pc_PostFollow_hot&value=SlideRight_RecArea"'
                },
                page: {
                    jump: 'suda-uatrack="key=weibo_pc_PostFollow_main&value=Click_RecCardJump"',
                    down: 'suda-uatrack="key=weibo_pc_PostFollow_main&value=Click_UnfoldTri"',
                    up: 'suda-uatrack="key=weibo_pc_PostFollow_main&value=Click_FoldTri"',
                    close: 'suda-uatrack="key=weibo_pc_PostFollow_main&value=Click_RecCardOff"',
                    right: 'suda-uatrack="key=weibo_pc_PostFollow_main&value=SlideRight_RecArea"'
                },
                feed: {
                    jump: 'suda-uatrack="key=weibo_pc_PostFollow_feed&value=Click_RecCardJump"',
                    down: 'suda-uatrack="key=weibo_pc_PostFollow_feed&value=Click_UnfoldTri"',
                    up: 'suda-uatrack="key=weibo_pc_PostFollow_feed&value=Click_FoldTri"',
                    close: 'suda-uatrack="key=weibo_pc_PostFollow_feed&value=Click_RecCardOff"',
                    right: 'suda-uatrack="key=weibo_pc_PostFollow_feed&value=SlideRight_RecArea"'
                },
                hostFans: {
                    jump: 'suda-uatrack="key=weibo_pc_PostFollow_FollowList&value=FanListHost_Click_RecCardJump"',
                    down: 'suda-uatrack="key=weibo_pc_PostFollow_FollowList&value=FanListHost_Click_UnfoldTri"',
                    up: 'suda-uatrack="key=weibo_pc_PostFollow_FollowList&value=FanListHost_Click_FoldTri"',
                    close: 'suda-uatrack="key=weibo_pc_PostFollow_FollowList&value=FanListHost_Click_RecCardOff"',
                    right: 'suda-uatrack="key=weibo_pc_PostFollow_FollowList&value=FanListHost_SlideRight_RecArea"'
                },
                cusFans: {
                    jump: 'suda-uatrack="key=weibo_pc_PostFollow_FollowList&value=FanListGuest_Click_RecCardJump"',
                    down: 'suda-uatrack="key=weibo_pc_PostFollow_FollowList&value=FanListGuest_Click_UnfoldTri"',
                    up: 'suda-uatrack="key=weibo_pc_PostFollow_FollowList&value=FanListGuest_Click_FoldTri"',
                    close: 'suda-uatrack="key=weibo_pc_PostFollow_FollowList&value=FanListGuest_Click_RecCardOff"',
                    right: 'suda-uatrack="key=weibo_pc_PostFollow_FollowList&value=FanListGuest_SlideRight_RecArea"'
                },
                cusFollow: {
                    jump: 'suda-uatrack="key=weibo_pc_PostFollow_FollowList&value=FollowListGuest_Click_RecCardJump"',
                    down: 'suda-uatrack="key=weibo_pc_PostFollow_FollowList&value=FollowListGuest_Click_UnfoldTri"',
                    up: 'suda-uatrack="key=weibo_pc_PostFollow_FollowList&value=FollowListGuest_Click_FoldTri"',
                    close: 'suda-uatrack="key=weibo_pc_PostFollow_FollowList&value=FollowListGuest_Click_RecCardOff"',
                    right: 'suda-uatrack="key=weibo_pc_PostFollow_FollowList&value=FollowListGuest_SlideRight_RecArea"'
                },
                card: {
                    jump: 'suda-uatrack="key=V6newcard&value=Click_RecCardJump"',
                    down: 'suda-uatrack="key=V6newcard&value=Click_UnfoldTri"',
                    up: 'suda-uatrack="key=V6newcard&value=Click_FoldTri"',
                    close: 'suda-uatrack="key=V6newcard&value=Click_RecCardOff"',
                    right: 'suda-uatrack="key=V6newcard&value=SlideRight_RecArea"'
                }
            },
            h = c(b('<#et recommendFollow data><div class="user_tit"><span class="W_f14 S_txt2">#L{关注推荐}</span></div><div class="user_scroll" node-type="recommend_outer"><ul class="picitems_ul clearfix" node-type="recommend_inner" style="width: ${data.containerW}px;"><#list data.list as list><li class="picitems S_bg2" node-type="recommendCard"><div class="midbox"><p class="pic_wrap"><span class="pic_box"><a target="_blank" ${data.suda.jump} href="${list.user.profile_url}"><img src="${list.user.avatar_large}" alt="${list.user.screen_name}" title="${list.user.screen_name}" class="pic"></a>${list.verify_icon}</span></p><p class="name W_autocut W_fb W_f14"><a target="_blank" ${data.suda.jump} href="${list.user.profile_url}" class="S_txt1">${list.user.screen_name}</a></p><p class="info"><a target="_blank" ${data.suda.jump} href="${list.user.profile_url}" class="S_txt2">${list.user.verified_reason || list.user.description}</a></p><p class="opt" ${data.outNodeExpr} action-data="uid=${list.user.id}&fnick=${list.user.screen_name}&pos=${list.pos}&f=1&nogroup=1&isrecommend=0&card=1&refer_flag=${list.refer_flag}&refer_from=recommend&template=6"><a href="javascript:void(0);" class="W_btn_c btn_34px" action-type="follow"><em class="W_ficon ficon_add">+</em>#L{关注}</a></p><a href="javascript:void(0);" ${data.suda.close} class="W_ficon ficon_close S_ficon" action-type="follow_cancle" action-data="pos=${list.pos}&uid=${list.user.id}">X</a></div></li></#list></ul><a href="javascript:void(0);" class="scroll_control left" style="display:none;" action-type="follow_turn" action-data="dir=1&"><i class="W_icon icon_scrollarr_l"></i></a><a href="javascript:void(0);" ${data.suda.right} class="scroll_control right" style="${data.showArrR}" action-type="follow_turn" action-data="dir=-1&"><i class="W_icon icon_scrollarr_r"></i></a></div></#et>')),
            i = {
                special: '<em class="W_ficon S_ficon ficon_right">Y</em>#L{特别关注}',
                follow: '<em class="W_ficon S_ficon ficon_right">Y</em>#L{已关注}',
                both: '<em class="W_ficon ficon_addtwo S_ficon">Z</em>#L{互相关注}'
            },
            j = {
                getAttrData: function (b, c) {
                    if (!!b && !!c) {
                        var d = b.getAttribute(c),
                            e = d && a.queryToJson(d) || !1;
                        return e
                    }
                },
                setAttrData: function (b, c, d) {
                    var e = this.getAttrData(b, c) || {};
                    e = a.core.json.merge(e, d);
                    b.setAttribute(c, a.jsonToQuery(e))
                }
            };
        return function (c) {
            c = a.parseParam({
                outer: "",
                vf: "profile",
                dEvt: "",
                cardW: 144,
                minNum: 4,
                outNodeExpr: 'node-type="followBtnBox"',
                needSync: !1
            }, c);
            var k, l, m = {},
                n, o, p, q, r = ["rended", "unrend", "followed"];
            q = {
                render: function (b) {
                    if (!!b && !!b.reqData) {
                        var d;
                        d = a.parseParam({
                            uid: window.$CONFIG && window.$CONFIG.uid,
                            to_uid: "",
                            refer_flag: "",
                            refer_from: ""
                        }, b.reqData);
                        var f = function (d) {
                                if (!!d) {
                                    if (d.code == 100070 || !d.data.list) {
                                        a.ui.tipAlert(d.msg || "暂时没有相关推荐！", {
                                            icon: "warnS"
                                        }).beside(b.arrBtn || b.el);
                                        return
                                    }
                                    d.data.suda = g[c.vf];
                                    d.data.outNodeExpr = c.outNodeExpr;
                                    d.data.containerW = d.data.list.length * c.cardW;
                                    d.data.showArrR = d.data.list.length > c.minNum ? "" : "display:none;";
                                    var e = h(d.data).toString();
                                    b.html = e;
                                    a.custEvent.fire(m, "rended", b)
                                }
                            },
                            i = function (c) {
                                c.code == 100070 ? a.ui.tipAlert(c.msg, {
                                    icon: "warnS"
                                }).beside(b.arrBtn) : a.lib.dialog.ioError(c.code, c)
                            };
                        e.request("recommend", {
                            onComplete: f,
                            onFail: i
                        }, d)
                    }
                },
                showArr: function (b, c, d, e) {
                    var f = b.offsetWidth,
                        g = c.offsetWidth,
                        h = Math.abs(c.offsetLeft),
                        i = g - f - h;
                    h <= 0 ? a.setStyle(d, "display", "none") : a.setStyle(d, "display", "");
                    i <= 0 ? a.setStyle(e, "display", "none") : a.setStyle(e, "display", "")
                },
                followTurn: function (b) {
                    var e = b.el,
                        f = b.data,
                        g = f.dir,
                        h = a.core.dom.dir.parent(e, {
                            expr: '[node-type="recommend_outer"]'
                        })[0],
                        i = a.core.dom.dir.prev(e, {
                            expr: '[node-type="recommend_inner"]'
                        })[0],
                        j = h.offsetWidth,
                        k = i.offsetWidth,
                        l = Math.abs(i.offsetLeft),
                        m = k - j - l,
                        n = Math.floor(j / c.cardW) * c.cardW,
                        o, p, r;
                    if (g == 1) {
                        p = e;
                        r = a.core.dom.dir.next(e, {
                            expr: 'a[action-type="follow_turn"]'
                        })[0];
                        if (l <= 0) return;
                        l >= n ? o = -g * (l - n) : o = 0
                    } else {
                        r = e;
                        p = a.core.dom.dir.prev(e, {
                            expr: 'a[action-type="follow_turn"]'
                        })[0];
                        if (m <= 0) return;
                        m >= n ? o = g * (l + n) : o = g * (l + m)
                    }
                    d(i, {
                        animationType: "linear",
                        duration: 200,
                        delay: 3,
                        end: function () {
                            !!p && !!r && q.showArr(h, i, p, r)
                        }
                    }).finish({
                        left: o
                    })
                },
                followed: function (a, b) {
                    q.removeCard(b)
                },
                removeCard: function (b) {
                    var d = b.el,
                        e = a.core.dom.dir.parent(d, {
                            expr: '[node-type="recommendCard"]'
                        })[0],
                        f = a.core.dom.dir.parent(d, {
                            expr: '[node-type="recommend_inner"]'
                        })[0],
                        g = a.core.dom.dir.parent(d, {
                            expr: '[node-type="recommend_outer"]'
                        })[0],
                        h = a.sizzle('a[action-type="follow_turn"]', g),
                        i = f.offsetWidth,
                        j = a.tween(e, {
                            duration: 200,
                            end: function () {
                                e.innerHTML = "";
                                a.removeNode(e);
                                d = e = null;
                                j.destroy();
                                a.setStyle(f, "width", i - c.cardW + "px");
                                q.showArr(g, f, h[0], h[1]);
                                if (!a.sizzle('[node-type="recommendCard"]', f)[0]) {
                                    b.el = f;
                                    a.custEvent.fire(m, "unrend", b)
                                }
                            }
                        }).play({
                            width: 0
                        })
                },
                cancelCard: function (b) {
                    var c = b.data,
                        d = {
                            uid: window.$CONFIG && window.$CONFIG.uid,
                            to_uid: c.uid
                        },
                        f = function (a) {
                            a.code == 1e5 && q.removeCard(b)
                        },
                        g = function (b) {
                            a.lib.dialog.ioError(b.code, b)
                        };
                    e.request("removeFollow", {
                        onComplete: f,
                        onFail: g
                    }, d)
                },
                channelSpecial: function (d) {
                    if (!!c.outer) {
                        var e = d.uid,
                            f = d.lastBtn,
                            g = a.sizzle("[" + c.outNodeExpr + "]", c.outer);
                        if (!g || g.length <= 0) return;
                        for (var h = 0, k = g.length; h < k; h++) {
                            var l = g[h],
                                m = a.sizzle("[action-type=noop],[action-type=unFollow],[action-type=unBlock]", l)[0],
                                n = j.getAttrData(l, "action-data");
                            if (f && f == m) return;
                            if (n.uid && n.uid == e || n.objectid && n.objectid == objectid) {
                                m.innerHTML = b(i[d.both ? "both" : d.isSpecial == 1 ? "special" : "follow"]);
                                j.setAttrData(l, "action-data", {
                                    is_special: d.isSpecial
                                });
                                if (l.confirm) {
                                    l.confirm.hide();
                                    l.confirm.destroy();
                                    l.confirm = null
                                }
                                l.hover && l.hover.destroy()
                            }
                        }
                    }
                },
                destroy: function () {
                    m = null;
                    k.remove("follow_cancle", "click", q.cancelCard);
                    k.remove("follow_turn", "click", q.followTurn);
                    k && k.destroy && k.destroy();
                    c.needSync && f.remove("specialFollow", q.channelSpecial)
                },
                initplugins: function () {
                    m.render = q.render;
                    m.destroy = q.destroy
                }
            };
            parseDom = function () {
                k = c.dEvt || a.delegatedEvent(document.body)
            };
            o = function () {
                a.custEvent.define(m, r);
                a.custEvent.add(m, "followed", q.followed);
                k.add("follow_cancle", "click", q.cancelCard);
                k.add("follow_turn", "click", q.followTurn);
                c.needSync && f.register("specialFollow", q.channelSpecial)
            };
            p = function () {
                parseDom();
                o();
                q.initplugins()
            };
            p();
            return m
        }
    });
    STK.register("conf.trans.hisInfo", function (a) {
        var b = a.lib.kit.io.inter(),
            c = b.register;
        c("recommendfollow", {
            url: "/aj/f/recomafterfollow",
            method: "get"
        });
        c("closerecommend", {
            url: "/aj/f/closerecommend",
            method: "get"
        });
        c("newuserguide", {
            url: "/aj/user/interest/newuserguide",
            method: "get"
        });
        c("mayinterested", {
            url: "/aj/user/interest/list",
            method: "get"
        });
        c("uninterested", {
            url: "/aj/user/interest/uninterested",
            method: "post"
        });
        c("userCard", {
            url: "/aj/user/cardv5",
            method: "get"
        });
        c("follow", {
            url: "/aj/f/followed",
            method: "post"
        });
        c("unFollow", {
            url: "/aj/f/unfollow",
            method: "post"
        });
        c("follow_register", {
            url: "/nguide/aj/relation/followed",
            method: "post"
        });
        c("unfollow_register", {
            url: "/nguide/aj/relation/unfollow",
            method: "post"
        });
        c("block", {
            url: "/aj/f/addblack",
            method: "post"
        });
        c("unBlock", {
            url: "/aj/f/delblack",
            method: "post"
        });
        c("removeFans", {
            url: "/aj/f/remove",
            method: "post"
        });
        c("requestFollow", {
            url: "/ajax/relation/requestfollow",
            method: "post"
        });
        c("questions", {
            url: "/aj/invite/attlimit",
            method: "get"
        });
        c("answer", {
            url: "/aj/invite/att",
            method: "post"
        });
        c("setRemark", {
            url: "/aj/f/remarkname",
            method: "post"
        });
        c("recommendusers", {
            url: "/aj/f/recommendusers",
            method: "get"
        });
        c("recommendAttUsers", {
            url: "/aj/f/worthfollowusers",
            method: "get"
        });
        c("recommendPopularUsers", {
            url: "/aj/user/interest/recommendpopularusers",
            method: "get"
        });
        c("mayinterestedweiqun", {
            url: "/aj/weiqun/getinterestedlist",
            method: "get"
        });
        c("moreData", {
            url: "/aj/f/listuserdetail",
            method: "get"
        });
        c("getInvite", {
            url: "/aj/invite/unread",
            method: "get"
        });
        c("quiet_addUser", {
            url: "/aj/f/addwhisper",
            method: "post"
        });
        c("quiet_removeUser", {
            url: "/aj/f/delwhisper",
            method: "post"
        });
        c("quiet_know", {
            url: "/aj/tipsbar/closetipsbar",
            method: "post"
        });
        c("groupUserList", {
            url: "/aj/f/group/getgroupmembers",
            method: "get"
        });
        c("smart_sort", {
            url: "/aj/mblog/mblogcard",
            method: "post"
        });
        c("groupSubmit", {
            url: "/aj/f/group/list",
            method: "get"
        });
        c("wqList", {
            url: "/aj/proxy?api=//recom.i.t.sina.com.cn/1/weiqun/weiqun_may_interest.php",
            method: "get"
        });
        c("uninterestedWq", {
            url: "/aj/proxy?api=//recom.i.t.sina.com.cn/1/weiqun/weiqun_uninterest.php",
            method: "get"
        });
        c("inviteNeglect", {
            url: "/aj/invite/handleinvite",
            method: "post"
        });
        c("checkNeglect", {
            url: "/aj/invite/shieldedlist",
            method: "post"
        });
        c("inviteLift", {
            url: "/aj/invite/lift",
            method: "post"
        });
        c("inviteAccept", {
            url: "/aj/invite/handleinvite",
            method: "post"
        });
        c("searchByTel", {
            url: "/aj/relation/getuserbymobile",
            method: "post"
        });
        c("inviteCloseTips", {
            url: "/aj/invite/closetips",
            method: "post"
        });
        c("checkrelation", {
            url: "/aj/f/checkrelation",
            method: "post"
        });
        c("addCloseFriend", {
            url: "/aj/f/createclosefriend",
            method: "post"
        });
        c("removeClsFrd", {
            url: "/aj/f/removeclosefriend",
            method: "post"
        });
        c("cfInviteUnread", {
            url: "/aj/invite/unread",
            method: "get"
        });
        c("recommendCf", {
            url: "/aj/user/closefriend/recommend",
            method: "get"
        });
        c("clearInvalidUsers", {
            url: "/aj/f/clearinvalidfriends",
            method: "post"
        });
        c("unIstCf", {
            url: "/aj/user/closefriend/deny",
            method: "post"
        });
        c("checkcloserelation", {
            url: "/aj/f/checkcloserelation",
            method: "post"
        });
        c("closeunfollow", {
            url: "/aj/profile/closeunfollow",
            method: "post"
        });
        c("fanslikemore", {
            url: "/aj/relation/fanslikemore",
            method: "get"
        });
        c("getProfileInfo", {
            url: "/aj/relation/getprofileinfo",
            method: "get"
        });
        c("getheaderinfo", {
            url: "/p/aj/official/getheaderinfo",
            method: "get"
        });
        c("interestlist", {
            url: "/aj/user/interest/profileinfo",
            method: "get"
        });
        c("recommendGroupMember", {
            url: "/aj/user/group/recommend",
            method: "get"
        });
        c("feedShield", {
            url: "/aj/user/block",
            method: "post"
        });
        c("removeShield", {
            url: "/aj/user/unblock",
            method: "post"
        });
        return b
    });
    STK.register("conf.trans.block", function (a) {
        var b = a.lib.kit.io.inter(),
            c = b.register;
        c("block", {
            url: "/aj/f/addblack",
            method: "post"
        });
        c("shield", {
            url: "/aj/filter/block",
            method: "post"
        });
        return b
    });
    STK.register("lib.dialog.block", function (a) {
        var b = a.lib.kit.extra.language,
            c = a.templet,
            d = b("#L{你和他将自动解除关注关系，并且他不能再关注你<br/>他不能再给你发评论、私信、@通知}"),
            e = b("#L{确认将}") + "#{nickName}" + b("#L{加入到我的黑名单中么？}");
        return function (f) {
            var g = f.trans || a.conf.trans.block,
                h = f.transName || "block",
                i = f.uid || $CONFIG.oid,
                j = f.nickname || $CONFIG.onick;
            a.ui.confirm(c(e, {
                nickName: j
            }), {
                textSmall: d,
                icon: "rederrorB",
                OK: function () {
                    g.request(h, {
                        onSuccess: function (c) {
                            a.ui.notice(b("#L{已将%s加入黑名单}", j)).on("hide", function () {
                                window.location.reload()
                            })
                        },
                        onError: function (b) {
                            a.lib.dialog.ioError(b.code, b)
                        }
                    }, {
                        uid: i,
                        f: 1
                    })
                }
            })
        }
    });
    STK.register("pl.content.followTab.source.init", function (a) {
        var b = a.lib.follow.followButton,
            c = a.lib.kit.extra.language,
            d = a.lib.follow.recommendFollow,
            e = a.lib.dialog.setRemark,
            f = a.core.dom.dir,
            g = {
                fans: c('由于系统限制，你无法查看所有粉丝，如有疑问请点击<a href="http://help.weibo.com/faq/q/77/15023" target="_blank">这里</a>。'),
                follow: c('由于系统限制，你无法查看所有关注，如有疑问请点击<a href="http://help.weibo.com/faq/q/77/15024" target="_blank">这里</a>。')
            },
            h = {
                fans: {
                    down: '<em suda-uatrack="key=weibo_pc_PostFollow_FollowList&value=FanListGuest_Click_UnfoldTri" class="W_ficon ficon_arrow_down_lite S_ficon">g</em>',
                    up: '<em suda-uatrack="key=weibo_pc_PostFollow_FollowList&value=FanListGuest_Click_FoldTri" class="W_ficon ficon_arrow_up_lite S_ficon">h</em>'
                },
                follow: {
                    down: '<em suda-uatrack="key=weibo_pc_PostFollow_FollowList&value=FollowListGuest_Click_UnfoldTri" class="W_ficon ficon_arrow_down_lite S_ficon">g</em>',
                    up: '<em suda-uatrack="key=weibo_pc_PostFollow_FollowList&value=FollowListGuest_Click_FoldTri" class="W_ficon ficon_arrow_up_lite S_ficon">h</em>'
                }
            },
            i = {
                down: '<em class="W_ficon ficon_arrow_down_lite">g</em>',
                up: '<em class="W_ficon ficon_arrow_up_lite">h</em>',
                follow: "W_btn_c",
                unFollow: "W_btn_d"
            };
        return function (j, k) {
            var l, m, n = 1,
                o, p, q, r, s, t, u, v, w, x = !0,
                y = "cusFans";
            t = {
                getDirNode: function (b, c, d) {
                    return a.core.dom.dir(b, {
                        expr: d || "[action-type=itemClick]",
                        endpoint: c || document.body
                    })[0]
                }
            };
            var z = {},
                A = function (b) {
                    var c = a.core.dom.neighbor(b.el).parent('[node-type="opt_box"]').finish(),
                        d = a.sizzle('[node-type="layer_menu_list"]', c)[0];
                    r == d && clearTimeout(q);
                    r = d;
                    d.style.display = ""
                },
                B = function (b) {
                    q = setTimeout(function () {
                        var c = a.core.dom.neighbor(b.el).parent('[node-type="opt_box"]').finish(),
                            d = a.sizzle('[node-type="layer_menu_list"]', c)[0];
                        d.style.display = "none"
                    }, 200)
                },
                C = function (b) {
                    a.preventDefault();
                    var c = b.el.getAttribute("href"),
                        d = b.el.className.indexOf("S_txt1") >= 0 ? !0 : !1;
                    if (n == 1 && !d) window.location.href = c;
                    else if (!d) {
                        o = a.lib.dialog.authentication();
                        o.show()
                    }
                };
            s = {
                addQuietFollow: function (b) {
                    function d(b, d) {
                        var e = {
                            location: $CONFIG.location || "",
                            action: b.action || "add",
                            fname: "",
                            fuid: ""
                        };
                        e = a.parseParam(e, b);
                        b.fnick && (e.fname = b.fnick);
                        b.uid && (e.fuid = b.uid);
                        (!!e.fname || !!e.fuid) && a.conf.trans.hisInfo.request("quiet_addUser", {
                            onSuccess: function (e) {
                                a.ui.notice(c("#L{成功悄悄关注}") + (b.fname || ""));
                                d && d(e)
                            },
                            onError: function (b) {
                                if (b.code == "100001") return d && d(b);
                                if (b.code == "100004") return a.ui.confirm(b.msg, {
                                    OKText: c("#L{管理我的悄悄关注}"),
                                    cancelText: c("#L{知道了}"),
                                    OK: function () {
                                        a.preventDefault();
                                        window.location.href = "/" + $CONFIG.uid + "/whisper"
                                    }
                                });
                                a.lib.dialog.ioError(b.code, b)
                            },
                            onFail: function (b) {
                                a.lib.dialog.ioError(b.code, b)
                            }
                        }, e)
                    }
                    var e = b.el,
                        f = b.data;
                    f.fname = f.fname || "";
                    var g = function (b) {
                        if (!!b) {
                            if (b.code == "100001") {
                                a.ui.confirm(b.msg, {
                                    OK: function () {
                                        f.action = "force";
                                        d(f, g)
                                    }
                                });
                                return
                            }
                            if (b.code == 1e5) {
                                var c = t.getDirNode(e, j, '[node-type="opt_box"]');
                                if (!c) return;
                                var h = a.sizzle('[node-type="fans_recommend_follow"]', c)[0];
                                if (!h) return;
                                var i = a.queryToJson(h.getAttribute("action-data")),
                                    k = h.children[0];
                                if (!k) return;
                                v.renderBtn(k, i.template, "temp_unfollow", !1);
                                h.hover && h.hover.destroy && h.hover.destroy();
                                h.confirm && h.confirm.hide && h.confirm.hide();
                                h.confirm && h.confirm.destroy && h.confirm.destroy();
                                h.confirm = null;
                                e.setAttribute("action-type", "removeQuietFollow");
                                e.innerHTML = "已悄悄关注，取消"
                            }
                        }
                    };
                    d(f, g)
                },
                removeQuietFollow: function (b) {
                    function d(b, d) {
                        var e = {
                            location: $CONFIG.location || "",
                            fname: "",
                            fuid: ""
                        };
                        e = a.parseParam(e, b);
                        b.name && (e.fname = b.name);
                        b.uid && (e.fuid = b.uid);
                        (!!e.fname || !!e.fuid) && a.conf.trans.hisInfo.request("quiet_removeUser", {
                            onSuccess: function (e) {
                                a.ui.notice(c("#L{成功取消悄悄关注}") + (b.name || ""));
                                d && d(e)
                            },
                            onError: function (b) {
                                a.lib.dialog.ioError(b.code, b);
                                d && d(b)
                            },
                            onFail: function (b) {
                                a.lib.dialog.ioError(b.code, b)
                            }
                        }, e)
                    }
                    var e = b.el,
                        f = b.data;
                    f.name = f.name || "";
                    var g = function (a) {
                        if (!!a && a.code == 1e5) {
                            e.setAttribute("action-type", "addQuietFollow");
                            e.innerHTML = "悄悄关注"
                        }
                    };
                    a.ui.confirm(c("#L{确定不再悄悄关注}") + f.name + "？", {
                        OK: function () {
                            d(f, g)
                        }
                    })
                },
                block: function (b) {
                    var c = b.el,
                        d = t.getDirNode(c, j, "[action-type=itemClick]"),
                        e = a.queryToJson(d.getAttribute("action-data"));
                    b.data = a.parseParam({
                        uid: "",
                        fnick: "",
                        sex: ""
                    }, e);
                    b.data.nickname = e.fnick;
                    a.lib.dialog.block(b.data)
                }
            };
            u = {
                initArr: function () {
                    var b = G();
                    if (h[b]) {
                        i = a.parseParam(i, h[b]);
                        y = b == "fans" ? "cusFans" : "cusFollow"
                    }
                },
                change: function (b, c) {
                    if (c.state == "follow") {
                        if (c.data.isrecommend == 1 && c.data.wforce != 0) return;
                        if (c.data.wforce == 0) {
                            window.location.reload();
                            return;
                            var d = f.parent(c.el, {
                                    expr: "[action-type=itemClick]"
                                }),
                                e = a.sizzle('[action-type="removeQuietFollow"]', d)[0]
                        }
                        if (c.data.isrecommend != 1 && c.data.card == 1) {
                            setTimeout(function () {
                                a.custEvent.fire(w, "followed", c)
                            }, 800);
                            return
                        }
                    }
                },
                recommend: function (b, c) {
                    if (!!c) {
                        var d = t.getDirNode(c.el, j, "[action-type=itemClick]"),
                            e = a.sizzle('[node-type="follow_recommend_box"]', d)[0],
                            f = a.sizzle('[action-type="follow_recommend_arr"]', d)[0];
                        if (!f || !e) return;
                        c.arrBtn = f;
                        c.recommendBox = e;
                        var g = !!a.sizzle('[node-type="recommend_outer"]', e)[0],
                            h = !!a.sizzle('[node-type="recommendCard"]', e)[0];
                        if (c.state == "follow") {
                            if (g && h) {
                                u.toggleBox(!0, e, f);
                                return
                            }
                            var i = {
                                uid: window.$CONFIG && window.$CONFIG.uid,
                                to_uid: c.data.uid,
                                refer_flag: c.data.refer_flag,
                                refer_from: c.data.refer_from
                            };
                            c.reqData = i;
                            w.render(c)
                        } else u.toggleBox(!1, e, f)
                    }
                },
                rended: function (a, b) {
                    if (!(!b || !b.arrBtn || !b.html || !b.recommendBox)) {
                        b.recommendBox.innerHTML = b.html;
                        u.toggleBox(!0, b.recommendBox, b.arrBtn)
                    }
                },
                changeStatus: function (a, b) {
                    if (!!b && !!j) {
                        var c = b.el,
                            d = b.data,
                            e = b.state,
                            g = t.getDirNode(c, j, "[action-type=itemClick]");
                        if (!g) return;
                        var h = f.parent(c, {
                            expr: '[node-type="fans_recommend_follow"]'
                        })[0];
                        if (!h) return;
                        if (e == "follow") return;
                        if (e == "unfollow") {
                            h.hover && h.hover.destroy && h.hover.destroy();
                            h.confirm && h.confirm.hide && h.confirm.hide();
                            h.confirm && h.confirm.destroy && h.confirm.destroy();
                            h.confirm = null
                        }
                    }
                },
                unrend: function (b, c) {
                    var d = c.el,
                        e = t.getDirNode(d, j, "[action-type=itemClick]");
                    if (!!e) {
                        var f = a.sizzle('[node-type="follow_recommend_box"]', e)[0],
                            g = a.sizzle('[action-type="follow_recommend_arr"]', e)[0];
                        if (!f || !g) return;
                        u.toggleBox(!1, f, g)
                    }
                },
                toggleBox: function (b, c, d) {
                    if (!!c && !!d)
                        if (b) {
                            d.innerHTML = i.up;
                            a.setStyle(c, "display", "")
                        } else {
                            d.innerHTML = i.down;
                            a.setStyle(c, "display", "none")
                        }
                },
                arrClick: function (b) {
                    var c = b.el,
                        d = t.getDirNode(c, j, "[action-type=itemClick]");
                    if (!!d) {
                        var e = b.data,
                            f = a.sizzle('[node-type="follow_recommend_box"]', d)[0];
                        if (!f) return;
                        var g = !!a.sizzle('[node-type="recommend_outer"]', f)[0],
                            h = !!a.sizzle('[node-type="recommendCard"]', f)[0],
                            i = a.getStyle(f, "display") == "none";
                        if (g && h) {
                            u.toggleBox(i, f, c);
                            return
                        }
                        b.arrBtn = c;
                        b.recommendBox = f;
                        var k = {
                            uid: window.$CONFIG && window.$CONFIG.uid,
                            to_uid: e.uid,
                            refer_flag: b.data.refer_flag,
                            refer_from: b.data.refer_from
                        };
                        b.reqData = k;
                        w && w.render(b)
                    }
                },
                setRemark: function (b, c) {
                    var d = c.data,
                        f = d.remark || "";
                    e({
                        uid: d.uid,
                        remark: a.core.str.decodeHTML(decodeURIComponent(f))
                    })
                }
            };
            var D = function () {
                    p = a.lib.kit.dom.parseDOM(a.builder(j).list);
                    if (p.activated) {
                        var b = a.core.json.queryToJson(p.activated.value);
                        n = b.activated
                    }
                },
                E = function () {
                    l = a.delegatedEvent(j);
                    l.add("opt_box_more", "mouseover", A);
                    l.add("opt_box_more", "mouseout", B);
                    if (n == 0 && p.pageList) {
                        m = a.delegatedEvent(p.pageList);
                        m.add("page", "click", C)
                    }
                    a.foreach(s, function (a, b) {
                        l.add(b, "click", a)
                    });
                    v = b({
                        outer: j,
                        needSync: x,
                        outNodeExpr: '[node-type="fans_recommend_follow"]'
                    });
                    w = d({
                        outer: j,
                        vf: y,
                        dEvt: l,
                        outNodeExpr: 'node-type="fans_recommend_follow"',
                        needSync: !0
                    });
                    a.custEvent.add(v, "change", u.change);
                    a.custEvent.add(v, "recommend", u.recommend);
                    a.custEvent.add(v, "setRemark", u.setRemark);
                    x && a.custEvent.add(v, "changeStatus", u.changeStatus);
                    a.custEvent.add(w, "rended", u.rended);
                    a.custEvent.add(w, "unrend", u.unrend);
                    l.add("follow_recommend_arr", "click", u.arrClick)
                },
                F, G = function () {
                    var b = a.queryToJson(location.search.substring(1)) || {},
                        c = b.relate || "follow";
                    return c.replace(/^.*(follow|fans).*$/, "$1")
                },
                H = function () {
                    var b = p.pageList;
                    if (b) {
                        F = a.lib.pagelimiter.index(b, {
                            limitText: g[G()]
                        });
                        F.on("filter", function (a, b) {
                            b.removeAttribute("bpfilter")
                        })
                    }
                    u.initArr()
                },
                I = function () {
                    D();
                    H();
                    E()
                };
            I();
            z.destroy = function () {
                a.foreach(s, function (a, b) {
                    l.remove(b, "click", a)
                });
                a.custEvent.remove(v, "change", u.change);
                a.custEvent.remove(v, "recommend", u.recommend);
                x && a.custEvent.remove(v, "changeStatus", u.changeStatus);
                v && v.destroy && v.destroy();
                a.custEvent.remove(w, "rended", u.rended);
                a.custEvent.remove(w, "unrend", u.unrend);
                w && w.destroy && w.destroy();
                l.remove("follow_recommend_arr", "click", u.arrClick);
                l && l.destroy && l.destroy();
                F && F.destroy()
            };
            return z
        }
    });
    FM.register("pl.content.followTab.index", function (b, c) {
        return a.pl.content.followTab.source.init(a.E(b), c)
    })
});






var FM = function (a, b, c) {
    function bN(b, c) {
        a.clear && (bN = a.clear)(b, c)
    }

    function bM(b, c, d) {
        a.start && (bM = a.start)(b, c, d)
    }

    function bL(a) {
        return a === null ? "" : Object.prototype.toString.call(a).slice(8, -1).toLowerCase()
    }

    function bK() {
        bv(function () {
            bH();
            for (var a in J) {
                if (I[a]) {
                    bB(P, I[a]);
                    delete I[a]
                }
                J[a]()
            }
            J = {}
        })
    }

    function bJ(a) {
        function v() {
            if (k.indexOf(bI) != 0) throw "view: csstextkey must have *" + bI + "* as prefix.";
            T(k) || bo(j, k)
        }

        function u() {
            function d() {
                --a <= 0 && t()
            }
            j && cssloadCssText();
            var a, b, c = -1;
            g = [].concat(g || []);
            i = [].concat(i || []);
            if (a = g.length) {
                h(t, K);
                while (b = g[++c]) T(b) ? d() : bk(b, d, i[c])
            } else t()
        }

        function t() {
            if (!t.r) {
                t.r = 1;
                bB(M, a);
                a[P] ? r() : s()
            }
        }

        function s() {
            function b(b) {
                r();
                b || a[P] || bH()
            }
            d ? bv(function () {
                bF(d, function (f) {
                    if (!a[P] && f && e != c) {
                        bG(f, d);
                        f.innerHTML = e || "";
                        br(b);
                        delete a.html
                    } else b(!0)
                })
            }) : b(!0)
        }

        function r() {
            bB(N, a);
            a[P] ? p() : q()
        }

        function q() {
            function a() {
                bA(f, p, m)
            }
            f ? l ? h(a, l) : a() : p()
        }

        function p() {
            if (!a[P]) {
                if (b) {
                    bN(b, d);
                    bM(b, d, a)
                }
                bD(o, a)
            }
            bB(O, a)
        }
        a = a || {};
        var b = a.ns,
            d = a.domid,
            e = a.html,
            f = a.js,
            g = a.css,
            i = a.cssid,
            j = a.csstext,
            k = a.csstextkey = a.csstextkey || bI + "_" + x(),
            l = a.jsDely || 0,
            m = a.jsDefer,
            n = a.renderDely || 0,
            o = d || b;
        if (!!o) {
            bC(o, a);
            bB(L, a);
            n ? h(u, n) : u()
        }
    }

    function bH() {
        for (var a in J) bF(a, J[a])
    }

    function bG(a, b) {
        var c, d, e;
        for (c in H)
            if ((d = H[c].domid) && (d === b || (e = p(d)) && bw(a, e))) {
                bN(H[c].ns, d);
                delete H[c]
            }
    }

    function bF(a, b) {
        var c, d;
        if (d = J[a]) {
            d != b && d();
            delete J[a]
        }!(c = p(a)) || bE(c) ? J[a] = b : b(c)
    }

    function bE(a) {
        var b, c, d;
        for (c in I)
            if (!(d = I[c])[N] && (b = d.domid) && (b = p(b)) && bw(b, a)) return !0
    }

    function bD(a, b) {
        if (I[a] == b) {
            H[a] = I[a];
            delete I[a]
        }
    }

    function bC(a, b) {
        I[a] && bB(P, I[a]);
        I[a] = b
    }

    function bB(a, b) {
        b[a] = r();
        G(a, b)
    }

    function bA(a, d, e) {
        var f = d,
            i;
        if (by && by !== a) bz.push(arguments);
        else {
            if (!by && e) {
                by = a;
                d = function (a, d) {
                    by = c;
                    while (i = bz.shift()) {
                        bA.apply(b, i);
                        if (i[2]) break
                    }
                    f(a, d)
                }
            }
            bx && (a = bx(a));
            if (!Y(a, d)) {
                var k = bd("script"),
                    l = !1,
                    m, n;
                bh(k, "src", a);
                bh(k, "charset", "UTF-8");
                m = k.onerror = k.onload = k.onreadystatechange = function () {
                    if (!l && (!k.readyState || /loaded|complete/.test(k.readyState))) {
                        l = !0;
                        j(n);
                        k.onerror = k.onload = k.onreadystatechange = null;
                        g.removeChild(k);
                        Z(a)
                    }
                };
                n = h(m, 3e4);
                g.insertBefore(k, g.firstChild)
            }
        }
    }

    function bv(a) {
        bs.push(a);
        bt || bu()
    }

    function bu() {
        if (bs.length > 0) {
            bt = 1;
            bs.shift()();
            br(bu)
        } else bt = 0
    }

    function bq() {
        var a = {},
            b, c, d;
        for (c in H)
            if (b = H[c].css || H[c].csstextkey) {
                b = [].concat(b);
                for (d = b.length; --d > -1;) b[d] && (a[b[d]] = 1)
            } U(a);
        bn(a)
    }

    function bp(a) {
        return a
    }

    function bo(a, b) {
        var c, d;
        if (!Y(b)) {
            c = x();
            d = bd("style");
            bh(d, "type", "text/css");
            bh(d, "id", c);
            g.appendChild(d);
            try {
                d.styleSheet.cssText = a
            } catch (f) {
                d.appendChild(e.createTextNode(a))
            }
            bi[b] = c
        }
    }

    function bn(a) {
        var b = {},
            c;
        for (c in a) b[bp(c)] = 1;
        for (c in bi)
            if (!b[c]) {
                bm(c);
                $(c)
            }
    }

    function bm(a) {
        var b = bi[a],
            c, d, e = p(b);
        if (e) {
            if (m && b in bj) {
                d = b && bj[b];
                if (d && (c = A(a, d)) > -1) {
                    (e.styleSheet || e.sheet).removeImport(c);
                    d.splice(c, 1)
                }
            } else R(e);
            delete bi[a]
        }
    }

    function bl(a) {
        var b, c;
        if (m) {
            for (b in bj)
                if (bj[b].length < 31) {
                    c = p(b);
                    break
                } if (!c) {
                b = x();
                c = bd("style");
                bh(c, "type", "text/css");
                bh(c, "id", b);
                g.appendChild(c);
                bj[b] = []
            }(c.styleSheet || c.sheet).addImport(a);
            bj[b].push(a)
        } else {
            b = x();
            var d = bd("link");
            bh(d, "rel", "stylesheet");
            bh(d, "type", "text/css");
            bh(d, "href", a);
            bh(d, "id", b);
            g.appendChild(d)
        }
        bi[a] = b
    }

    function bk(a, c, d) {
        function j() {
            if (parseInt(b.getComputedStyle ? getComputedStyle(e, null)[f] : e.currentStyle && e.currentStyle[f]) === 42) i();
            else if (--g > 0) h(j, 10);
            else {
                i();
                bm(a);
                bl(a)
            }
        }

        function i() {
            bg(e);
            Z(a)
        }
        a = bp(a);
        var e, f = "height",
            g = 3e3;
        if (!Y(a, c)) {
            bl(a);
            e = bd("div");
            e.id = d;
            bf(e);
            h(j, 50)
        }
    }

    function bh(a, b, c) {
        return a.setAttribute(b, c)
    }

    function bg(a) {
        be && be.removeChild(a)
    }

    function bf(a) {
        if (!be) {
            (be = bd("div")).style.cssText = "position:absolute;top:-9999px;";
            g.appendChild(be)
        }
        be.appendChild(a)
    }

    function bd(a) {
        return e.createElement(a)
    }

    function bc(a, b) {
        b && (b[ba] = b[2] - b[1] + 2);
        return function (c) {
            return !c || /^https?\:\/\//.test(c.toLowerCase()) ? c : (b ? _[c] || (_[c] = bb(b, c)) : a) + c
        }
    }

    function bb(a, b) {
        b = b.replace(/\?.*$/, "");
        var c = 0,
            d = 0,
            e, f;
        while (e = b.charCodeAt(c++)) d += e;
        return a[0].replace("{n}", d % a[ba] || "")
    }

    function $(a) {
        W[a] && delete W[a];
        a in V && delete V[a]
    }

    function Z(a, b) {
        V[a] = b;
        G(X + a, b);
        F(X + a)
    }

    function Y(a, b) {
        if (a in V) {
            b && b(a, V[a]);
            return !0
        }
        b && E(X + a, function (c, d) {
            b(a, d)
        });
        if (W[a]) return !0;
        W[a] = 1
    }

    function U(a) {
        var b = {},
            c, d, e;
        for (d in S) {
            c = S[d].ins;
            for (e in c)
                if (a[e]) {
                    b[d] = !0;
                    break
                }
        }
        for (d in S)
            if (!b[d]) {
                R(S[d].el);
                delete S[d]
            }
    }

    function T(a) {
        for (var b in S)
            if (S[b].ins[a]) return !0
    }

    function R(a) {
        a && a.parentNode.removeChild(a)
    }

    function Q(a) {
        try {
            return [].slice.call(a)
        } catch (b) {
            var c, d = 0,
                e = [];
            while (c = a[d]) e[d++] = c;
            return e
        }
    }

    function G(a, b) {
        var d = D(a);
        b = [].concat(b || []);
        for (var e = d.length - 1; e > -1; e--) try {
            d[e] && d[e].apply(c, b)
        } catch (f) {
            a != n && G(n, ["[error][notice][" + a + "]", f])
        }
    }

    function F(a, b) {
        var c = D(a),
            d, e;
        if (b)(d = A(b, c)) > -1 && (e = 1);
        else {
            d = 0;
            e = c.length
        }
        e && c.splice(d, e)
    }

    function E(a, b) {
        D(a).unshift(b)
    }

    function D(a) {
        return C[a] || (C[a] = [])
    }

    function A(a, b) {
        if (b.indexOf) return b.indexOf(a);
        for (var c = 0, d = b.length; c < d; ++c)
            if (b[c] === a) return c;
        return -1
    }

    function z(a) {
        return a[y] || (a[y] = x())
    }

    function x() {
        return w + v++
    }

    function u(a) {
        t.push(a)
    }

    function r() {
        return Date.now ? Date.now() : +(new Date)
    }

    function q(a, b) {
        return (b || e).getElementsByTagName(a)
    }

    function p(a) {
        return e.getElementById(a)
    }

    function o() {}
    if (a) return a;
    !!b.sessionStorage && !!b.history.pushState && b.scrollTo(0, 0);
    a = a || {
        v: 2,
        t: r()
    };
    var d = navigator.userAgent,
        e = b.document,
        f = e.documentElement,
        g = e.head || q("head")[0] || f,
        h = b.setTimeout,
        i = b.location,
        j = b.clearTimeout,
        k = b.decodeURI,
        l = e.addEventListener,
        m = /msie (\d+\.\d+)/i.test(d) ? e.documentMode || +RegExp.$1 : 0,
        n = "log",
        s = "_I",
        t = a[s] = a[s] || [];
    a.init = function (a) {
        a = a || {};
        var b = "linkFilter",
            c = "history",
            d = "iLoader";
        b in a || (a[b] = !0);
        c in a || (a[c] = !0);
        d in a || (a[d] = !0);
        var e;
        while (e = t.shift()) e(a)
    };
    var v = 1,
        w = "FM_" + r(),
        y = "__FM_ID",
        B = "_N",
        C = a[B] = a[B] || {},
        H = {},
        I = {},
        J = {},
        K = 5e3,
        L = "plViewReady",
        M = "plCssReady",
        N = "plRenderReady",
        O = "plJsReady",
        P = "plAbort",
        S = {};
    u(function () {
        var a = Q(q("link")).concat(Q(q("style"))),
            b, c, d;
        for (var e = 0; d = a[e++];)
            if (b = d.getAttribute("includes")) {
                c = z(d);
                b = b.split("|");
                var f = {};
                for (var g = 0; b[g];) f[b[g++]] = 1;
                S[c] = {
                    el: d,
                    ins: f
                }
            }
    });
    var V = {},
        W = {},
        X = x(),
        _ = {},
        ba = "MODN",
        be, bi = {},
        bj = {};
    u(function (a) {
        bp = bc(a.cssPath || "", a.mCssPath)
    });
    var br = function () {
            var a = b.requestAnimationFrame || b.webkitRequestAnimationFrame || b.mozRequestAnimationFrame || b.oRequestAnimationFrame || b.msRequestAnimationFrame,
                c = function (a) {
                    return h(a, 2)
                };
            a && a(function () {
                c = a
            });
            return function (a) {
                return c(function () {
                    a()
                })
            }
        }(),
        bs = [],
        bt = 0,
        bw = f.contains ? function (a, b) {
            a = a === e ? f : a;
            b = b.parentNode;
            return a === b || !!(b && a.contains && a.contains(b))
        } : f.compareDocumentPosition ? function (a, b) {
            return !!(a.compareDocumentPosition(b) & 16)
        } : function (a, b) {
            while (b = b.parentNode)
                if (b === a) return !0;
            return !1
        },
        bx, by, bz = [];
    u(function (a) {
        bx = bc(a.jsPath || "", a.mJsPath)
    });
    var bI = "csstext:";
    u(function (a) {
        var b = a.cssTimeOut;
        bL(b) === "number" && (K = b)
    });
    E("vf", bK);
    E("vd", bq);
    var bO = "_NC",
        bP = G;
    G = function (b, c) {
        bP(b, c);
        a[bO] && a[bO].push(arguments)
    };
    a[bO] = [];
    a.view = bJ;
    a.getViews = function () {
        return H
    };
    return a
}(FM, window);
! function () {
    function e(a) {
        return "js_" + a.replace(/^\/?(.*)\.css\??.*$/i, "$1").replace(/\//g, "_").replace(/^https:/, 'http:');
    }

    function d(a) {
        var b;
        if (a && ((b = a.match(c("pl"))) || (b = a.match(c("trustPagelet"))))) return b[1].replace(/\//g, ".")
    }

    function c(a) {
        return new RegExp("^.*?\\/(" + a + "\\/.*?)(_[a-z\\d]{16})?\\.js\\??.*$")
    }
    var a = $CONFIG,
        b = FM.view;
    FM.init({
        jsPath: a.jsPath,
        cssPath: a.cssPath,
        mJsPath: a.mJsPath
    });
    FM.view = function (a) {
        a = a || {};
        var c = a.js,
            f = "domid",
            g = "ns",
            h, i;
        c = c && [].concat(c);
        a[f] = a[f] || a.pid;
        a.js = c = c && c[0];
        g in a || (a[g] = d(c));
        a.css = h = [].concat(a.css || []);
        a.cssid = i = [].concat(a.cssid || []);
        for (var j = i.length, k = h.length; j < k; ++j) i[j] = e(h[j]);
        b(a)
    }
}()


