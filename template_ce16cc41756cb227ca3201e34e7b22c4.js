
; /* Start:"a:4:{s:4:"full";s:55:"/bitrix/templates/mediartstore/script.js?14338671171166";s:6:"source";s:40:"/bitrix/templates/mediartstore/script.js";s:3:"min";s:0:"";s:3:"map";s:0:"";}"*/
function eshopOpenNativeMenu()
{
	var native_menu = BX("bx_native_menu"),
		is_menu_active = BX.hasClass(native_menu, "active"),
		topHeight,
		easing;

	if (is_menu_active)
	{
		BX.removeClass(native_menu, "active");
		BX.removeClass(BX('bx_menu_bg'), "active");
		BX("bx_eshop_wrap").style.position = "";
		BX("bx_eshop_wrap").style.top = "";
		BX("bx_eshop_wrap").style.overflow = "";
	}
	else
	{
		BX.addClass(native_menu, "active");
		BX.addClass(BX('bx_menu_bg'), "active");
		topHeight = document.body.scrollTop;
		BX("bx_eshop_wrap").style.position = "fixed";
		BX("bx_eshop_wrap").style.top = -topHeight+"px";
		BX("bx_eshop_wrap").style.overflow = "hidden";
	}

	easing = new BX.easing({
		duration : 300,
		start : { left : (is_menu_active ? 0 : -100) },
		finish : { left : (is_menu_active ? -100 : 0) },
		transition : BX.easing.transitions.quart,
		step : function(state){
			native_menu.style.left = state.left + "%";
		}
	});
	easing.animate();
}

BX.bind(window, 'resize',
	function() {
		if (window.innerWidth >= 640 && BX.hasClass(BX("bx_native_menu"), "active"))
		{
			eshopOpenNativeMenu();
		}
	}
);
/* End */
;
; /* Start:"a:4:{s:4:"full";s:100:"/bitrix/templates/mediartstore/components/bitrix/menu/horizontal_multilevel3/script.js?1437858774469";s:6:"source";s:86:"/bitrix/templates/mediartstore/components/bitrix/menu/horizontal_multilevel3/script.js";s:3:"min";s:0:"";s:3:"map";s:0:"";}"*/
var jshover = function()
{
	var menuDiv = document.getElementById("horizontal-multilevel-menu")
	if (!menuDiv)
		return;

	var sfEls = menuDiv.getElementsByTagName("li");
	for (var i=0; i<sfEls.length; i++) 
	{
		sfEls[i].onmouseover=function()
		{
			this.className+=" jshover";
		}
		sfEls[i].onmouseout=function() 
		{
			this.className=this.className.replace(new RegExp(" jshover\\b"), "");
		}
	}
}

if (window.attachEvent) 
	window.attachEvent("onload", jshover);
/* End */
;
; /* Start:"a:4:{s:4:"full";s:107:"/bitrix/templates/mediartstore/components/bitrix/sale.basket.basket.line/template1/script.js?14350768944656";s:6:"source";s:92:"/bitrix/templates/mediartstore/components/bitrix/sale.basket.basket.line/template1/script.js";s:3:"min";s:0:"";s:3:"map";s:0:"";}"*/
'use strict';

function BitrixSmallCart(){}

BitrixSmallCart.prototype = {

	activate: function ()
	{
		this.cartElement = BX(this.cartId);
		this.fixedPosition = this.arParams.POSITION_FIXED == 'Y';
		if (this.fixedPosition)
		{
			this.cartClosed = true;
			this.maxHeight = false;
			this.itemRemoved = false;
			this.verticalPosition = this.arParams.POSITION_VERTICAL;
			this.horizontalPosition = this.arParams.POSITION_HORIZONTAL;
			this.topPanelElement = BX("bx-panel");

			this.fixAfterRender(); // TODO onready
			this.fixAfterRenderClosure = this.closure('fixAfterRender');

			var fixCartClosure = this.closure('fixCart');
			this.fixCartClosure = fixCartClosure;

			if (this.topPanelElement && this.verticalPosition == 'top')
				BX.addCustomEvent(window, 'onTopPanelCollapse', fixCartClosure);

			var resizeTimer = null;
			BX.bind(window, 'resize', function() {
				clearTimeout(resizeTimer);
				resizeTimer = setTimeout(fixCartClosure, 200);
			});
		}
		this.setCartBodyClosure = this.closure('setCartBody');
		BX.addCustomEvent(window, 'OnBasketChange', this.closure('refreshCart', {}));
	},

	fixAfterRender: function ()
	{
		this.statusElement = BX(this.cartId + 'status');
		if (this.statusElement)
		{
			if (this.cartClosed)
				this.statusElement.innerHTML = this.openMessage;
			else
				this.statusElement.innerHTML = this.closeMessage;
		}
		this.productsElement = BX(this.cartId + 'products');
		this.fixCart();
	},

	closure: function (fname, data)
	{
		var obj = this;
		return data
			? function(){obj[fname](data)}
			: function(arg1){obj[fname](arg1)};
	},

	toggleOpenCloseCart: function ()
	{
		if (this.cartClosed)
		{
			BX.removeClass(this.cartElement, 'close');
			this.statusElement.innerHTML = this.closeMessage;
			this.cartClosed = false;
		}
		else // Opened
		{
			BX.addClass(this.cartElement, 'close');
			this.statusElement.innerHTML = this.openMessage;
			this.cartClosed = true;
		}
		setTimeout(this.fixCartClosure, 100);
	},

	setVerticalCenter: function(windowHeight)
	{
		var top = windowHeight/2 - (this.cartElement.offsetHeight/2);
		if (top < 5)
			top = 5;
		this.cartElement.style.top = top + 'px';
	},

	fixCart: function()
	{
		// set horizontal center
		if (this.horizontalPosition == 'hcenter')
		{
			var windowWidth = 'innerWidth' in window
				? window.innerWidth
				: document.documentElement.offsetWidth;
			var left = windowWidth/2 - (this.cartElement.offsetWidth/2);
			if (left < 5)
				left = 5;
			this.cartElement.style.left = left + 'px';
		}

		var windowHeight = 'innerHeight' in window
			? window.innerHeight
			: document.documentElement.offsetHeight;

		// set vertical position
		switch (this.verticalPosition) {
			case 'top':
				if (this.topPanelElement)
					this.cartElement.style.top = this.topPanelElement.offsetHeight + 5 + 'px';
				break;
			case 'vcenter':
				this.setVerticalCenter(windowHeight);
				break;
		}

		// toggle max height
		if (this.productsElement)
		{
			if (this.cartClosed)
			{
				if (this.maxHeight)
				{
					BX.removeClass(this.cartElement, 'max_height');
					this.maxHeight = false;
				}
			}
			else // Opened
			{
				if (this.maxHeight)
				{
					if (this.productsElement.scrollHeight == this.productsElement.clientHeight)
					{
						BX.removeClass(this.cartElement, 'max_height');
						this.maxHeight = false;
					}
				}
				else
				{
					if (this.verticalPosition == 'top' || this.verticalPosition == 'vcenter')
					{
						if (this.cartElement.offsetTop + this.cartElement.offsetHeight >= windowHeight)
						{
							BX.addClass(this.cartElement, 'max_height');
							this.maxHeight = true;
						}
					}
					else
					{
						if (this.cartElement.offsetHeight >= windowHeight)
						{
							BX.addClass(this.cartElement, 'max_height');
							this.maxHeight = true;
						}
					}
				}
			}

			if (this.verticalPosition == 'vcenter')
				this.setVerticalCenter(windowHeight);
		}
	},

	refreshCart: function (data)
	{
		if (this.itemRemoved)
		{
			this.itemRemoved = false;
			return;
		}
		data.sessid = BX.bitrix_sessid();
		data.siteId = this.siteId;
		data.templateName = this.templateName;
		data.arParams = this.arParams;
		BX.ajax({
			url: this.ajaxPath,
			method: 'POST',
			dataType: 'html',
			data: data,
			onsuccess: this.setCartBodyClosure
		});
	},

	setCartBody: function (result)
	{
		if (this.cartElement)
			this.cartElement.innerHTML = result;
		if (this.fixedPosition)
			setTimeout(this.fixAfterRenderClosure, 100);
	},

	removeItemFromCart: function (id)
	{
		this.refreshCart ({sbblRemoveItemFromCart: id});
		this.itemRemoved = true;
		BX.onCustomEvent('OnBasketChange');
	}
};

/* End */
;
; /* Start:"a:4:{s:4:"full";s:67:"/bitrix/components/bitrix/search.title/script.min.js?14666782056196";s:6:"source";s:48:"/bitrix/components/bitrix/search.title/script.js";s:3:"min";s:52:"/bitrix/components/bitrix/search.title/script.min.js";s:3:"map";s:52:"/bitrix/components/bitrix/search.title/script.map.js";}"*/
function JCTitleSearch(t){var e=this;this.arParams={AJAX_PAGE:t.AJAX_PAGE,CONTAINER_ID:t.CONTAINER_ID,INPUT_ID:t.INPUT_ID,MIN_QUERY_LEN:parseInt(t.MIN_QUERY_LEN)};if(t.WAIT_IMAGE)this.arParams.WAIT_IMAGE=t.WAIT_IMAGE;if(t.MIN_QUERY_LEN<=0)t.MIN_QUERY_LEN=1;this.cache=[];this.cache_key=null;this.startText="";this.running=false;this.currentRow=-1;this.RESULT=null;this.CONTAINER=null;this.INPUT=null;this.WAIT=null;this.ShowResult=function(t){if(BX.type.isString(t)){e.RESULT.innerHTML=t}e.RESULT.style.display=e.RESULT.innerHTML!==""?"block":"none";var s=e.adjustResultNode();var i;var r;var n=BX.findChild(e.RESULT,{tag:"table","class":"title-search-result"},true);if(n){r=BX.findChild(n,{tag:"th"},true)}if(r){var a=BX.pos(n);a.width=a.right-a.left;var l=BX.pos(r);l.width=l.right-l.left;r.style.width=l.width+"px";e.RESULT.style.width=s.width+l.width+"px";e.RESULT.style.left=s.left-l.width-1+"px";if(a.width-l.width>s.width)e.RESULT.style.width=s.width+l.width-1+"px";a=BX.pos(n);i=BX.pos(e.RESULT);if(i.right>a.right){e.RESULT.style.width=a.right-a.left+"px"}}var o;if(n)o=BX.findChild(e.RESULT,{"class":"title-search-fader"},true);if(o&&r){i=BX.pos(e.RESULT);o.style.left=i.right-i.left-18+"px";o.style.width=18+"px";o.style.top=0+"px";o.style.height=i.bottom-i.top+"px";o.style.display="block"}};this.onKeyPress=function(t){var s=BX.findChild(e.RESULT,{tag:"table","class":"title-search-result"},true);if(!s)return false;var i;var r=s.rows.length;switch(t){case 27:e.RESULT.style.display="none";e.currentRow=-1;e.UnSelectAll();return true;case 40:if(e.RESULT.style.display=="none")e.RESULT.style.display="block";var n=-1;for(i=0;i<r;i++){if(!BX.findChild(s.rows[i],{"class":"title-search-separator"},true)){if(n==-1)n=i;if(e.currentRow<i){e.currentRow=i;break}else if(s.rows[i].className=="title-search-selected"){s.rows[i].className=""}}}if(i==r&&e.currentRow!=i)e.currentRow=n;s.rows[e.currentRow].className="title-search-selected";return true;case 38:if(e.RESULT.style.display=="none")e.RESULT.style.display="block";var a=-1;for(i=r-1;i>=0;i--){if(!BX.findChild(s.rows[i],{"class":"title-search-separator"},true)){if(a==-1)a=i;if(e.currentRow>i){e.currentRow=i;break}else if(s.rows[i].className=="title-search-selected"){s.rows[i].className=""}}}if(i<0&&e.currentRow!=i)e.currentRow=a;s.rows[e.currentRow].className="title-search-selected";return true;case 13:if(e.RESULT.style.display=="block"){for(i=0;i<r;i++){if(e.currentRow==i){if(!BX.findChild(s.rows[i],{"class":"title-search-separator"},true)){var l=BX.findChild(s.rows[i],{tag:"a"},true);if(l){window.location=l.href;return true}}}}}return false}return false};this.onTimeout=function(){e.onChange(function(){setTimeout(e.onTimeout,500)})};this.onChange=function(t){if(e.running)return;e.running=true;if(e.INPUT.value!=e.oldValue&&e.INPUT.value!=e.startText){e.oldValue=e.INPUT.value;if(e.INPUT.value.length>=e.arParams.MIN_QUERY_LEN){e.cache_key=e.arParams.INPUT_ID+"|"+e.INPUT.value;if(e.cache[e.cache_key]==null){if(e.WAIT){var s=BX.pos(e.INPUT);var i=s.bottom-s.top-2;e.WAIT.style.top=s.top+1+"px";e.WAIT.style.height=i+"px";e.WAIT.style.width=i+"px";e.WAIT.style.left=s.right-i+2+"px";e.WAIT.style.display="block"}BX.ajax.post(e.arParams.AJAX_PAGE,{ajax_call:"y",INPUT_ID:e.arParams.INPUT_ID,q:e.INPUT.value,l:e.arParams.MIN_QUERY_LEN},function(s){e.cache[e.cache_key]=s;e.ShowResult(s);e.currentRow=-1;e.EnableMouseEvents();if(e.WAIT)e.WAIT.style.display="none";if(!!t)t();e.running=false});return}else{e.ShowResult(e.cache[e.cache_key]);e.currentRow=-1;e.EnableMouseEvents()}}else{e.RESULT.style.display="none";e.currentRow=-1;e.UnSelectAll()}}if(!!t)t();e.running=false};this.UnSelectAll=function(){var t=BX.findChild(e.RESULT,{tag:"table","class":"title-search-result"},true);if(t){var s=t.rows.length;for(var i=0;i<s;i++)t.rows[i].className=""}};this.EnableMouseEvents=function(){var t=BX.findChild(e.RESULT,{tag:"table","class":"title-search-result"},true);if(t){var s=t.rows.length;for(var i=0;i<s;i++)if(!BX.findChild(t.rows[i],{"class":"title-search-separator"},true)){t.rows[i].id="row_"+i;t.rows[i].onmouseover=function(t){if(e.currentRow!=this.id.substr(4)){e.UnSelectAll();this.className="title-search-selected";e.currentRow=this.id.substr(4)}};t.rows[i].onmouseout=function(t){this.className="";e.currentRow=-1}}}};this.onFocusLost=function(t){setTimeout(function(){e.RESULT.style.display="none"},250)};this.onFocusGain=function(){if(e.RESULT.innerHTML.length)e.ShowResult()};this.onKeyDown=function(t){if(!t)t=window.event;if(e.RESULT.style.display=="block"){if(e.onKeyPress(t.keyCode))return BX.PreventDefault(t)}};this.adjustResultNode=function(){var t;var s=BX.findParent(e.CONTAINER,BX.is_fixed);if(!!s){e.RESULT.style.position="fixed";e.RESULT.style.zIndex=BX.style(s,"z-index")+2;t=BX.pos(e.CONTAINER,true)}else{e.RESULT.style.position="absolute";t=BX.pos(e.CONTAINER)}t.width=t.right-t.left;e.RESULT.style.top=t.bottom+2+"px";e.RESULT.style.left=t.left+"px";e.RESULT.style.width=t.width+"px";return t};this._onContainerLayoutChange=function(){if(e.RESULT.style.display!=="none"&&e.RESULT.innerHTML!==""){e.adjustResultNode()}};this.Init=function(){this.CONTAINER=document.getElementById(this.arParams.CONTAINER_ID);BX.addCustomEvent(this.CONTAINER,"OnNodeLayoutChange",this._onContainerLayoutChange);this.RESULT=document.body.appendChild(document.createElement("DIV"));this.RESULT.className="title-search-result";this.INPUT=document.getElementById(this.arParams.INPUT_ID);this.startText=this.oldValue=this.INPUT.value;BX.bind(this.INPUT,"focus",function(){e.onFocusGain()});BX.bind(this.INPUT,"blur",function(){e.onFocusLost()});if(BX.browser.IsSafari()||BX.browser.IsIE())this.INPUT.onkeydown=this.onKeyDown;else this.INPUT.onkeypress=this.onKeyDown;if(this.arParams.WAIT_IMAGE){this.WAIT=document.body.appendChild(document.createElement("DIV"));this.WAIT.style.backgroundImage="url('"+this.arParams.WAIT_IMAGE+"')";if(!BX.browser.IsIE())this.WAIT.style.backgroundRepeat="none";this.WAIT.style.display="none";this.WAIT.style.position="absolute";this.WAIT.style.zIndex="1100"}BX.bind(this.INPUT,"bxchange",function(){e.onChange()})};BX.ready(function(){e.Init(t)})}
/* End */
;
; /* Start:"a:4:{s:4:"full";s:98:"/bitrix/templates/mediartstore/components/bitrix/menu/vertical_multilevel1/script.js?1435068375507";s:6:"source";s:84:"/bitrix/templates/mediartstore/components/bitrix/menu/vertical_multilevel1/script.js";s:3:"min";s:0:"";s:3:"map";s:0:"";}"*/
var jsvhover = function()
{
	var menuDiv = document.getElementById("vertical-multilevel-menu");
	if (!menuDiv)
		return;

  var nodes = menuDiv.getElementsByTagName("li");
  for (var i=0; i<nodes.length; i++) 
  {
    nodes[i].onmouseover = function()
    {
      this.className += " jsvhover";
    }
    
    nodes[i].onmouseout = function()
    {
      this.className = this.className.replace(new RegExp(" jsvhover\\b"), "");
    }
  }
}

if (window.attachEvent) 
	window.attachEvent("onload", jsvhover); 
/* End */
;
; /* Start:"a:4:{s:4:"full";s:108:"/bitrix/templates/mediartstore/components/bitrix/catalog.viewed.products/vertical2/script.js?143807012445850";s:6:"source";s:92:"/bitrix/templates/mediartstore/components/bitrix/catalog.viewed.products/vertical2/script.js";s:3:"min";s:0:"";s:3:"map";s:0:"";}"*/
(function (window) {

    if (!!window.JCCatalogSectionViewed)
    {
        return;
    }

    var BasketButton = function(params)
    {
        BasketButton.superclass.constructor.apply(this, arguments);
        this.nameNode = BX.create('span', {
            props : { className : 'bx_medium bx_bt_button', id : this.id },
            text: params.text
        });
        this.buttonNode = BX.create('span', {
            attrs: { className: params.ownerClass },
            style: { marginBottom: '0', borderBottom: '0 none transparent' },
            children: [this.nameNode],
            events : this.contextEvents
        });
        if (BX.browser.IsIE())
        {
            this.buttonNode.setAttribute("hideFocus", "hidefocus");
        }
    };
    BX.extend(BasketButton, BX.PopupWindowButton);

    window.JCCatalogSectionViewed = function (arParams)
    {
        this.productType = 0;
        this.showQuantity = true;
        this.showAbsent = true;
        this.secondPict = false;
        this.showOldPrice = false;
        this.showPercent = false;
        this.showSkuProps = false;
        this.visual = {
            ID: '',
            PICT_ID: '',
            SECOND_PICT_ID: '',
            QUANTITY_ID: '',
            QUANTITY_UP_ID: '',
            QUANTITY_DOWN_ID: '',
            PRICE_ID: '',
            DSC_PERC: '',
            SECOND_DSC_PERC: '',
            DISPLAY_PROP_DIV: '',
            BASKET_PROP_DIV: ''
        };
        this.product = {
            checkQuantity: false,
            maxQuantity: 0,
            stepQuantity: 1,
            isDblQuantity: false,
            canBuy: true,
            canSubscription: true,
            name: '',
            pict: {},
            id: 0,
            addUrl: '',
            buyUrl: ''
        };
        this.basketData = {
            useProps: false,
            emptyProps: false,
            quantity: 'quantity',
            props: 'prop',
            basketUrl: ''
        };

        this.defaultPict = {
            pict: null,
            secondPict: null
        };

        this.checkQuantity = false;
        this.maxQuantity = 0;
        this.stepQuantity = 1;
        this.isDblQuantity = false;
        this.canBuy = true;
        this.canSubscription = true;
        this.precision = 6;
        this.precisionFactor = Math.pow(10,this.precision);

        this.offers = [];
        this.offerNum = 0;
        this.treeProps = [];
        this.obTreeRows = [];
        this.showCount = [];
        this.showStart = [];
        this.selectedValues = {};

        this.obProduct = null;
        this.obQuantity = null;
        this.obQuantityUp = null;
        this.obQuantityDown = null;
        this.obPict = null;
        this.obSecondPict = null;
        this.obPrice = null;
        this.obTree = null;
        this.obBuyBtn = null;
        this.obDscPerc = null;
        this.obSecondDscPerc = null;
        this.obSkuProps = null;
        this.obMeasure = null;

        this.obPopupWin = null;
        this.basketUrl = '';
        this.basketParams = {};

        this.treeRowShowSize = 5;
        this.treeEnableArrow = { display: '', cursor: 'pointer', opacity: 1 };
        this.treeDisableArrow = { display: '', cursor: 'default', opacity:0.2 };

        this.lastElement = false;
        this.containerHeight = 0;

        this.errorCode = 0;

        if ('object' === typeof arParams)
        {
            this.productType = parseInt(arParams.PRODUCT_TYPE, 10);
            this.showQuantity = arParams.SHOW_QUANTITY;
            this.showAbsent = arParams.SHOW_ABSENT;
            this.secondPict = !!arParams.SECOND_PICT;
            this.showOldPrice = !!arParams.SHOW_OLD_PRICE;
            this.showPercent = !!arParams.SHOW_DISCOUNT_PERCENT;
            this.showSkuProps = !!arParams.SHOW_SKU_PROPS;

            this.visual = arParams.VISUAL;
            switch (this.productType)
            {
                case 1://product
                case 2://set
                    if (!!arParams.PRODUCT && 'object' === typeof(arParams.PRODUCT))
                    {
                        if (this.showQuantity)
                        {
                            this.product.checkQuantity = arParams.PRODUCT.CHECK_QUANTITY;
                            this.product.isDblQuantity = arParams.PRODUCT.QUANTITY_FLOAT;
                            if (this.product.checkQuantity)
                            {
                                this.product.maxQuantity = (this.product.isDblQuantity ? parseFloat(arParams.PRODUCT.MAX_QUANTITY) : parseInt(arParams.PRODUCT.MAX_QUANTITY, 10));
                            }
                            this.product.stepQuantity = (this.product.isDblQuantity ? parseFloat(arParams.PRODUCT.STEP_QUANTITY) : parseInt(arParams.PRODUCT.STEP_QUANTITY, 10));

                            this.checkQuantity = this.product.checkQuantity;
                            this.isDblQuantity = this.product.isDblQuantity;
                            this.maxQuantity = this.product.maxQuantity;
                            this.stepQuantity = this.product.stepQuantity;
                            if (this.isDblQuantity)
                            {
                                this.stepQuantity = Math.round(this.stepQuantity*this.precisionFactor)/this.precisionFactor;
                            }
                        }
                        this.product.canBuy = arParams.PRODUCT.CAN_BUY;
                        this.product.canSubscription = arParams.PRODUCT.SUBSCRIPTION;

                        this.canBuy = this.product.canBuy;
                        this.canSubscription = this.product.canSubscription;

                        this.product.name = arParams.PRODUCT.NAME;
                        this.product.pict = arParams.PRODUCT.PICT;
                        this.product.id = arParams.PRODUCT.ID;
                        if (!!arParams.PRODUCT.ADD_URL)
                        {
                            this.product.addUrl = arParams.PRODUCT.ADD_URL;
                        }
                        if (!!arParams.PRODUCT.BUY_URL)
                        {
                            this.product.buyUrl = arParams.PRODUCT.BUY_URL;
                        }
                        if (!!arParams.BASKET && 'object' === typeof(arParams.BASKET))
                        {
                            this.basketData.useProps = !!arParams.BASKET.ADD_PROPS;
                            this.basketData.emptyProps = !!arParams.BASKET.EMPTY_PROPS;
                        }
                    }
                    else
                    {
                        this.errorCode = -1;
                    }
                    break;
                case 3://sku
                    if (!!arParams.OFFERS && BX.type.isArray(arParams.OFFERS))
                    {
                        if (!!arParams.PRODUCT && 'object' === typeof(arParams.PRODUCT))
                        {
                            this.product.name = arParams.PRODUCT.NAME;
                            this.product.id = arParams.PRODUCT.ID;
                        }
                        this.offers = arParams.OFFERS;
                        this.offerNum = 0;
                        if (!!arParams.OFFER_SELECTED)
                        {
                            this.offerNum = parseInt(arParams.OFFER_SELECTED, 10);
                        }
                        if (isNaN(this.offerNum))
                        {
                            this.offerNum = 0;
                        }
                        if (!!arParams.TREE_PROPS)
                        {
                            this.treeProps = arParams.TREE_PROPS;
                        }
                        if (!!arParams.DEFAULT_PICTURE)
                        {
                            this.defaultPict.pict = arParams.DEFAULT_PICTURE.PICTURE;
                            this.defaultPict.secondPict = arParams.DEFAULT_PICTURE.PICTURE_SECOND;
                        }
                    }
                    else
                    {
                        this.errorCode = -1;
                    }
                    break;
                default:
                    this.errorCode = -1;
            }
            if (!!arParams.BASKET && 'object' === typeof(arParams.BASKET))
            {
                if (!!arParams.BASKET.QUANTITY)
                {
                    this.basketData.quantity = arParams.BASKET.QUANTITY;
                }
                if (!!arParams.BASKET.PROPS)
                {
                    this.basketData.props = arParams.BASKET.PROPS;
                }
                if (!!arParams.BASKET.BASKET_URL)
                {
                    this.basketData.basketUrl = arParams.BASKET.BASKET_URL;
                }
            }
            this.lastElement = (!!arParams.LAST_ELEMENT && 'Y' === arParams.LAST_ELEMENT);
        }
        if (0 === this.errorCode)
        {
            BX.ready(BX.delegate(this.Init,this));
        }
    };

    window.JCCatalogSectionViewed.prototype.Init = function()
    {
        var i = 0,
            strPrefix = '',
            TreeItems = null;

        this.obProduct = BX(this.visual.ID);
        if (!this.obProduct)
        {
            this.errorCode = -1;
        }
        this.obPict = BX(this.visual.PICT_ID);
        if (!this.obPict)
        {
            this.errorCode = -2;
        }
        if (this.secondPict && !!this.visual.SECOND_PICT_ID)
        {
            this.obSecondPict = BX(this.visual.SECOND_PICT_ID);
        }
        this.obPrice = BX(this.visual.PRICE_ID);
        if (!this.obPrice)
        {
            this.errorCode = -16;
        }
        if (this.showQuantity && !!this.visual.QUANTITY_ID)
        {
            this.obQuantity = BX(this.visual.QUANTITY_ID);
            if (!!this.visual.QUANTITY_UP_ID)
            {
                this.obQuantityUp = BX(this.visual.QUANTITY_UP_ID);
            }
            if (!!this.visual.QUANTITY_DOWN_ID)
            {
                this.obQuantityDown = BX(this.visual.QUANTITY_DOWN_ID);
            }
        }
        if (3 === this.productType)
        {
            if (!!this.visual.TREE_ID)
            {
                this.obTree = BX(this.visual.TREE_ID);
                if (!this.obTree)
                {
                    this.errorCode = -256;
                }
                strPrefix = this.visual.TREE_ITEM_ID;
                for (i = 0; i < this.treeProps.length; i++)
                {
                    this.obTreeRows[i] = {
                        LEFT: BX(strPrefix+this.treeProps[i].ID+'_left'),
                        RIGHT: BX(strPrefix+this.treeProps[i].ID+'_right'),
                        LIST: BX(strPrefix+this.treeProps[i].ID+'_list'),
                        CONT: BX(strPrefix+this.treeProps[i].ID+'_cont')
                    };
                    if (!this.obTreeRows[i].LEFT || !this.obTreeRows[i].RIGHT || !this.obTreeRows[i].LIST || !this.obTreeRows[i].CONT)
                    {
                        this.errorCode = -512;
                        break;
                    }
                }
            }
            if (!!this.visual.QUANTITY_MEASURE)
            {
                this.obMeasure = BX(this.visual.QUANTITY_MEASURE);
            }
        }
        if (!!this.visual.BUY_ID)
        {
            this.obBuyBtn = BX(this.visual.BUY_ID);
        }

        if (this.showPercent)
        {
            if (!!this.visual.DSC_PERC)
            {
                this.obDscPerc = BX(this.visual.DSC_PERC);
            }
            if (this.secondPict && !!this.visual.SECOND_DSC_PERC)
            {
                this.obSecondDscPerc = BX(this.visual.SECOND_DSC_PERC);
            }
        }

        if (this.showSkuProps)
        {
            if (!!this.visual.DISPLAY_PROP_DIV)
            {
                this.obSkuProps = BX(this.visual.DISPLAY_PROP_DIV);
            }
        }

        if (0 === this.errorCode)
        {
            if (this.showQuantity)
            {
                if (!!this.obQuantityUp)
                {
                    BX.bind(this.obQuantityUp, 'click', BX.delegate(this.QuantityUp, this));
                }
                if (!!this.obQuantityDown)
                {
                    BX.bind(this.obQuantityDown, 'click', BX.delegate(this.QuantityDown, this));
                }
                if (!!this.obQuantity)
                {
                    BX.bind(this.obQuantity, 'change', BX.delegate(this.QuantityChange, this));
                }
            }
            switch (this.productType)
            {
                case 1://product
                    break;
                case 3://sku
                    TreeItems = BX.findChildren(this.obTree, {tagName: 'li'}, true);
                    if (!!TreeItems && 0 < TreeItems.length)
                    {
                        for (i = 0; i < TreeItems.length; i++)
                        {
                            BX.bind(TreeItems[i], 'click', BX.delegate(this.SelectOfferProp, this));
                        }
                    }
                    for (i = 0; i < this.obTreeRows.length; i++)
                    {
                        BX.bind(this.obTreeRows[i].LEFT, 'click', BX.delegate(this.RowLeft, this));
                        BX.bind(this.obTreeRows[i].RIGHT, 'click', BX.delegate(this.RowRight, this));
                    }
                    this.SetCurrent();
                    break;
            }
            if (!!this.obBuyBtn)
            {
                BX.bind(this.obBuyBtn, 'click', BX.delegate(this.Basket, this));
            }
            if (this.lastElement)
            {
                this.containerHeight = parseInt(this.obProduct.parentNode.offsetHeight, 10);
                if (isNaN(this.containerHeight))
                {
                    this.containerHeight = 0;
                }
                this.setHeight();
                BX.bind(window, 'resize', BX.delegate(this.checkHeight, this));
                BX.bind(this.obProduct.parentNode, 'mouseover', BX.delegate(this.setHeight, this));
                BX.bind(this.obProduct.parentNode, 'mouseout', BX.delegate(this.clearHeight, this));
            }
        }
    };

    window.JCCatalogSectionViewed.prototype.checkHeight = function()
    {
        this.containerHeight = parseInt(this.obProduct.parentNode.offsetHeight, 10);
        if (isNaN(this.containerHeight))
        {
            this.containerHeight = 0;
        }
    };

    window.JCCatalogSectionViewed.prototype.setHeight = function()
    {
        if (0 < this.containerHeight)
        {
            BX.adjust(this.obProduct.parentNode, {style: { height: this.containerHeight+'px'}});
        }
    };

    window.JCCatalogSectionViewed.prototype.clearHeight = function()
    {
        BX.adjust(this.obProduct.parentNode, {style: { height: 'auto'}});
    };

    window.JCCatalogSectionViewed.prototype.QuantityUp = function()
    {
        var curValue = 0,
            boolSet = true;

        if (0 === this.errorCode && this.showQuantity && this.canBuy)
        {
            curValue = (this.isDblQuantity ? parseFloat(this.obQuantity.value) : parseInt(this.obQuantity.value, 10));
            if (!isNaN(curValue))
            {
                curValue += this.stepQuantity;
                if (this.checkQuantity)
                {
                    if (curValue > this.maxQuantity)
                    {
                        boolSet = false;
                    }
                }
                if (boolSet)
                {
                    if (this.isDblQuantity)
                    {
                        curValue = Math.round(curValue*this.precisionFactor)/this.precisionFactor;
                    }
                    this.obQuantity.value = curValue;
                }
            }
        }
    };

    window.JCCatalogSectionViewed.prototype.QuantityDown = function()
    {
        var curValue = 0,
            boolSet = true;

        if (0 === this.errorCode && this.showQuantity && this.canBuy)
        {
            curValue = (this.isDblQuantity ? parseFloat(this.obQuantity.value): parseInt(this.obQuantity.value, 10));
            if (!isNaN(curValue))
            {
                curValue -= this.stepQuantity;
                if (curValue < this.stepQuantity)
                {
                    boolSet = false;
                }
                if (boolSet)
                {
                    if (this.isDblQuantity)
                    {
                        curValue = Math.round(curValue*this.precisionFactor)/this.precisionFactor;
                    }
                    this.obQuantity.value = curValue;
                }
            }
        }
    };

    window.JCCatalogSectionViewed.prototype.QuantityChange = function()
    {
        var curValue = 0,
            boolSet = true;

        if (0 === this.errorCode && this.showQuantity)
        {
            if (this.canBuy)
            {
                curValue = (this.isDblQuantity ? parseFloat(this.obQuantity.value) : parseInt(this.obQuantity.value, 10));
                if (!isNaN(curValue))
                {
                    if (this.checkQuantity)
                    {
                        if (curValue > this.maxQuantity)
                        {
                            boolSet = false;
                            curValue = this.maxQuantity;
                        }
                        else if (curValue < this.stepQuantity)
                        {
                            boolSet = false;
                            curValue = this.stepQuantity;
                        }
                    }
                    if (!boolSet)
                    {
                        this.obQuantity.value = curValue;
                    }
                }
                else
                {
                    this.obQuantity.value = this.stepQuantity;
                }
            }
            else
            {
                this.obQuantity.value = this.stepQuantity;
            }
        }
    };

    window.JCCatalogSectionViewed.prototype.QuantitySet = function(index)
    {
        if (0 === this.errorCode)
        {
            this.canBuy = this.offers[index].CAN_BUY;
            if (this.canBuy)
            {
                BX.addClass(this.obBuyBtn, 'bx_bt_button');
                BX.removeClass(this.obBuyBtn, 'bx_bt_button_type_2');
                this.obBuyBtn.innerHTML = BX.message('MESS_BTN_BUY');
            }
            else
            {
                BX.addClass(this.obBuyBtn, 'bx_bt_button_type_2');
                BX.removeClass(this.obBuyBtn, 'bx_bt_button');
                this.obBuyBtn.innerHTML = BX.message('MESS_NOT_AVAILABLE');
            }
            if (this.showQuantity)
            {
                this.isDblQuantity = this.offers[index].QUANTITY_FLOAT;
                this.checkQuantity = this.offers[index].CHECK_QUANTITY;
                if (this.isDblQuantity)
                {
                    this.maxQuantity = parseFloat(this.offers[index].MAX_QUANTITY);
                    this.stepQuantity = Math.round(parseFloat(this.offers[index].STEP_QUANTITY)*this.precisionFactor)/this.precisionFactor;
                }
                else
                {
                    this.maxQuantity = parseInt(this.offers[index].MAX_QUANTITY, 10);
                    this.stepQuantity = parseInt(this.offers[index].STEP_QUANTITY, 10);
                }

                this.obQuantity.value = this.stepQuantity;
                this.obQuantity.disabled = !this.canBuy;
                if (!!this.obMeasure)
                {
                    if (!!this.offers[index].MEASURE)
                    {
                        BX.adjust(this.obMeasure, { html : this.offers[index].MEASURE});
                    }
                    else
                    {
                        BX.adjust(this.obMeasure, { html : ''});
                    }
                }
            }
        }
    };

    window.JCCatalogSectionViewed.prototype.SelectOfferProp = function()
    {
        var i = 0,
            value = '',
            strTreeValue = '',
            arTreeItem = [],
            RowItems = null,
            target = BX.proxy_context;

        if (!!target && target.hasAttribute('data-treevalue'))
        {
            strTreeValue = target.getAttribute('data-treevalue');
            arTreeItem = strTreeValue.split('_');
            if (this.SearchOfferPropIndex(arTreeItem[0], arTreeItem[1]))
            {
                RowItems = BX.findChildren(target.parentNode, {tagName: 'li'}, false);
                if (!!RowItems && 0 < RowItems.length)
                {
                    for (i = 0; i < RowItems.length; i++)
                    {
                        value = RowItems[i].getAttribute('data-onevalue');
                        if (value === arTreeItem[1])
                        {
                            BX.addClass(RowItems[i], 'bx_active');
                        }
                        else
                        {
                            BX.removeClass(RowItems[i], 'bx_active');
                        }
                    }
                }
            }
        }
    };

    window.JCCatalogSectionViewed.prototype.SearchOfferPropIndex = function(strPropID, strPropValue)
    {
        var strName = '',
            arShowValues = false,
            i, j,
            arCanBuyValues = [],
            index = -1,
            arFilter = {},
            tmpFilter = [];

        for (i = 0; i < this.treeProps.length; i++)
        {
            if (this.treeProps[i].ID === strPropID)
            {
                index = i;
                break;
            }
        }

        if (-1 < index)
        {
            for (i = 0; i < index; i++)
            {
                strName = 'PROP_'+this.treeProps[i].ID;
                arFilter[strName] = this.selectedValues[strName];
            }
            strName = 'PROP_'+this.treeProps[index].ID;
            arShowValues = this.GetRowValues(arFilter, strName);
            if (!arShowValues)
            {
                return false;
            }
            if (!BX.util.in_array(strPropValue, arShowValues))
            {
                return false;
            }
            arFilter[strName] = strPropValue;
            for (i = index+1; i < this.treeProps.length; i++)
            {
                strName = 'PROP_'+this.treeProps[i].ID;
                arShowValues = this.GetRowValues(arFilter, strName);
                if (!arShowValues)
                {
                    return false;
                }
                if (this.showAbsent)
                {
                    arCanBuyValues = [];
                    tmpFilter = [];
                    tmpFilter = BX.clone(arFilter, true);
                    for (j = 0; j < arShowValues.length; j++)
                    {
                        tmpFilter[strName] = arShowValues[j];
                        if (this.GetCanBuy(tmpFilter))
                        {
                            arCanBuyValues[arCanBuyValues.length] = arShowValues[j];
                        }
                    }
                }
                else
                {
                    arCanBuyValues = arShowValues;
                }
                if (!!this.selectedValues[strName] && BX.util.in_array(this.selectedValues[strName], arCanBuyValues))
                {
                    arFilter[strName] = this.selectedValues[strName];
                }
                else
                {
                    arFilter[strName] = arCanBuyValues[0];
                }
                this.UpdateRow(i, arFilter[strName], arShowValues, arCanBuyValues);
            }
            this.selectedValues = arFilter;
            this.ChangeInfo();
        }
        return true;
    };

    window.JCCatalogSectionViewed.prototype.RowLeft = function()
    {
        var i = 0,
            strTreeValue = '',
            index = -1,
            target = BX.proxy_context;

        if (!!target && target.hasAttribute('data-treevalue'))
        {
            strTreeValue = target.getAttribute('data-treevalue');
            for (i = 0; i < this.treeProps.length; i++)
            {
                if (this.treeProps[i].ID === strTreeValue)
                {
                    index = i;
                    break;
                }
            }
            if (-1 < index && this.treeRowShowSize < this.showCount[index])
            {
                if (0 > this.showStart[index])
                {
                    this.showStart[index]++;
                    BX.adjust(this.obTreeRows[index].LIST, { style: { marginLeft: this.showStart[index]*20+'%' }});
                    BX.adjust(this.obTreeRows[index].RIGHT, { style: this.treeEnableArrow });
                }

                if (0 <= this.showStart[index])
                {
                    BX.adjust(this.obTreeRows[index].LEFT, { style: this.treeDisableArrow });
                }
            }
        }
    };

    window.JCCatalogSectionViewed.prototype.RowRight = function()
    {
        var i = 0,
            strTreeValue = '',
            index = -1,
            target = BX.proxy_context;

        if (!!target && target.hasAttribute('data-treevalue'))
        {
            strTreeValue = target.getAttribute('data-treevalue');
            for (i = 0; i < this.treeProps.length; i++)
            {
                if (this.treeProps[i].ID === strTreeValue)
                {
                    index = i;
                    break;
                }
            }
            if (-1 < index && this.treeRowShowSize < this.showCount[index])
            {
                if ((this.treeRowShowSize - this.showStart[index]) < this.showCount[index])
                {
                    this.showStart[index]--;
                    BX.adjust(this.obTreeRows[index].LIST, { style: { marginLeft: this.showStart[index]*20+'%' }});
                    BX.adjust(this.obTreeRows[index].LEFT, { style: this.treeEnableArrow });
                }

                if ((this.treeRowShowSize - this.showStart[index]) >= this.showCount[index])
                {
                    BX.adjust(this.obTreeRows[index].RIGHT, { style: this.treeDisableArrow });
                }
            }
        }
    };

    window.JCCatalogSectionViewed.prototype.UpdateRow = function(intNumber, activeID, showID, canBuyID)
    {
		var i = 0,
			showI = 0,
			value = '',
			countShow = 0,
			strNewLen = '',
			obData = {},
			pictMode = false,
			extShowMode = false,
			isCurrent = false,
			selectIndex = 0,
			obLeft = this.treeEnableArrow,
			obRight = this.treeEnableArrow,
			currentShowStart = 0,
			RowItems = null;

		if (-1 < intNumber && intNumber < this.obTreeRows.length)
		{
			RowItems = BX.findChildren(this.obTreeRows[intNumber].LIST, {tagName: 'li'}, false);
			if (!!RowItems && 0 < RowItems.length)
			{
				pictMode = ('PICT' === this.treeProps[intNumber].SHOW_MODE);
				countShow = showID.length;
				extShowMode = this.treeRowShowSize < countShow;
				strNewLen = (extShowMode ? (100/countShow)+'%' : '20%');
				obData = {
					props: { className: '' },
					style: {
						width: strNewLen
					}
				};
				if (pictMode)
				{
					obData.style.paddingTop = strNewLen;
				}
				for (i = 0; i < RowItems.length; i++)
				{
					value = RowItems[i].getAttribute('data-onevalue');
					isCurrent = (value === activeID);
					if (BX.util.in_array(value, canBuyID))
					{
						obData.props.className = (isCurrent ? 'bx_active' : '');
					}
					else
					{
						obData.props.className = (isCurrent ? 'bx_active bx_missing' : 'bx_missing');
					}
					obData.style.display = 'none';
					if (BX.util.in_array(value, showID))
					{
						obData.style.display = '';
						if (isCurrent)
						{
							selectIndex = showI;
						}
						showI++;
					}
					BX.adjust(RowItems[i], obData);
				}

				obData = {
					style: {
						width: (extShowMode ? 20*countShow : 100)+'%',
						marginLeft: '0%'
					}
				};
				if (pictMode)
				{
					BX.adjust(this.obTreeRows[intNumber].CONT, {props: {className: (extShowMode ? 'bx_item_detail_scu full' : 'bx_item_detail_scu')}});
				}
				else
				{
					BX.adjust(this.obTreeRows[intNumber].CONT, {props: {className: (extShowMode ? 'bx_item_detail_size full' : 'bx_item_detail_size')}});
				}
				if (extShowMode)
				{
					if (selectIndex +1 === countShow)
					{
						obRight = this.treeDisableArrow;
					}
					if (this.treeRowShowSize <= selectIndex)
					{
						currentShowStart = this.treeRowShowSize - selectIndex - 1;
						obData.style.marginLeft = currentShowStart*20+'%';
					}
					if (0 === currentShowStart)
					{
						obLeft = this.treeDisableArrow;
					}
					BX.adjust(this.obTreeRows[intNumber].LEFT, {style: obLeft });
					BX.adjust(this.obTreeRows[intNumber].RIGHT, {style: obRight });
				}
				else
				{
					BX.adjust(this.obTreeRows[intNumber].LEFT, {style: {display: 'none'}});
					BX.adjust(this.obTreeRows[intNumber].RIGHT, {style: {display: 'none'}});
				}
				BX.adjust(this.obTreeRows[intNumber].LIST, obData);
				this.showCount[intNumber] = countShow;
				this.showStart[intNumber] = currentShowStart;
            }
        }
    };

    window.JCCatalogSectionViewed.prototype.GetRowValues = function(arFilter, index)
    {
        var i = 0,
            j,
            arValues = [],
            boolSearch = false,
            boolOneSearch = true;

        if (0 === arFilter.length)
        {
            for (i = 0; i < this.offers.length; i++)
            {
                if (!BX.util.in_array(this.offers[i].TREE[index], arValues))
                {
                    arValues[arValues.length] = this.offers[i].TREE[index];
                }
            }
            boolSearch = true;
        }
        else
        {
            for (i = 0; i < this.offers.length; i++)
            {
                boolOneSearch = true;
                for (j in arFilter)
                {
                    if (arFilter[j] !== this.offers[i].TREE[j])
                    {
                        boolOneSearch = false;
                        break;
                    }
                }
                if (boolOneSearch)
                {
                    if (!BX.util.in_array(this.offers[i].TREE[index], arValues))
                    {
                        arValues[arValues.length] = this.offers[i].TREE[index];
                    }
                    boolSearch = true;
                }
            }
        }
        return (boolSearch ? arValues : false);
    };

    window.JCCatalogSectionViewed.prototype.GetCanBuy = function(arFilter)
    {
        var i = 0,
            j,
            boolSearch = false,
            boolOneSearch = true;

        for (i = 0; i < this.offers.length; i++)
        {
            boolOneSearch = true;
            for (j in arFilter)
            {
                if (arFilter[j] !== this.offers[i].TREE[j])
                {
                    boolOneSearch = false;
                    break;
                }
            }
            if (boolOneSearch)
            {
                if (this.offers[i].CAN_BUY)
                {
                    boolSearch = true;
                    break;
                }
            }
        }
        return boolSearch;
    };

    window.JCCatalogSectionViewed.prototype.SetCurrent = function()
    {
        var i = 0,
            j = 0,
            arCanBuyValues = [],
            strName = '',
            arShowValues = false,
            arFilter = {},
            tmpFilter = [],
            current = this.offers[this.offerNum].TREE;

        for (i = 0; i < this.treeProps.length; i++)
        {
            strName = 'PROP_'+this.treeProps[i].ID;
            arShowValues = this.GetRowValues(arFilter, strName);
            if (!arShowValues)
            {
                break;
            }
            if (BX.util.in_array(current[strName], arShowValues))
            {
                arFilter[strName] = current[strName];
            }
            else
            {
                arFilter[strName] = arShowValues[0];
                this.offerNum = 0;
            }
            if (this.showAbsent)
            {
                arCanBuyValues = [];
                tmpFilter = [];
                tmpFilter = BX.clone(arFilter, true);
                for (j = 0; j < arShowValues.length; j++)
                {
                    tmpFilter[strName] = arShowValues[j];
                    if (this.GetCanBuy(tmpFilter))
                    {
                        arCanBuyValues[arCanBuyValues.length] = arShowValues[j];
                    }
                }
            }
            else
            {
                arCanBuyValues = arShowValues;
            }
            this.UpdateRow(i, arFilter[strName], arShowValues, arCanBuyValues);
        }
        this.selectedValues = arFilter;
        this.ChangeInfo();
    };

    window.JCCatalogSectionViewed.prototype.ChangeInfo = function()
    {
        var i = 0,
            j,
            index = -1,
            obData = {},
            boolOneSearch = true,
            strPrice = '';

        for (i = 0; i < this.offers.length; i++)
        {
            boolOneSearch = true;
            for (j in this.selectedValues)
            {
                if (this.selectedValues[j] !== this.offers[i].TREE[j])
                {
                    boolOneSearch = false;
                    break;
                }
            }
            if (boolOneSearch)
            {
                index = i;
                break;
            }
        }
        if (-1 < index)
        {
            if (!!this.obPict)
            {
                if (!!this.offers[index].PREVIEW_PICTURE)
                {
                    BX.adjust(this.obPict, {style: {backgroundImage: 'url('+this.offers[index].PREVIEW_PICTURE.SRC+')'}});
                }
                else
                {
                    BX.adjust(this.obPict, {style: {backgroundImage: 'url('+this.defaultPict.pict.SRC+')'}});
                }
            }
            if (this.secondPict && !!this.obSecondPict)
            {
                if (!!this.offers[index].PREVIEW_PICTURE_SECOND)
                {
                    BX.adjust(this.obSecondPict, {style: {backgroundImage: 'url('+this.offers[index].PREVIEW_PICTURE_SECOND.SRC+')'}});
                }
                else if (!!this.offers[index].PREVIEW_PICTURE.SRC)
                {
                    BX.adjust(this.obSecondPict, {style: {backgroundImage: 'url('+this.offers[index].PREVIEW_PICTURE.SRC+')'}});
                }
                else if (!!this.defaultPict.secondPict)
                {
                    BX.adjust(this.obSecondPict, {style: {backgroundImage: 'url('+this.defaultPict.secondPict.SRC+')'}});
                }
                else
                {
                    BX.adjust(this.obSecondPict, {style: {backgroundImage: 'url('+this.defaultPict.pict.SRC+')'}});
                }
            }
            if (this.showSkuProps && !!this.obSkuProps)
            {
                if (0 === this.offers[index].DISPLAY_PROPERTIES.length)
                {
                    BX.adjust(this.obSkuProps, {style: {display: 'none'}, html: ''});
                }
                else
                {
                    BX.adjust(this.obSkuProps, {style: {display: ''}, html: this.offers[index].DISPLAY_PROPERTIES});
                }
            }
            if (!!this.obPrice)
            {
                strPrice = this.offers[index].PRICE.PRINT_DISCOUNT_VALUE;
                if (this.showOldPrice && (this.offers[index].PRICE.DISCOUNT_VALUE !== this.offers[index].PRICE.VALUE))
                {
                    strPrice += ' <span>'+this.offers[index].PRICE.PRINT_VALUE+'</span>';
                }
                BX.adjust(this.obPrice, {html: strPrice});
                if (this.showPercent)
                {
                    if (this.offers[index].PRICE.DISCOUNT_VALUE !== this.offers[index].PRICE.VALUE)
                    {
                        obData = {
                            style: {
                                display: ''
                            },
                            html: this.offers[index].PRICE.DISCOUNT_DIFF_PERCENT
                        };
                    }
                    else
                    {
                        obData = {
                            style: {
                                display: 'none'
                            },
                            html: ''
                        };
                    }
                    if (!!this.obDscPerc)
                    {
                        BX.adjust(this.obDscPerc, obData);
                    }
                    if (!!this.obSecondDscPerc)
                    {
                        BX.adjust(this.obSecondDscPerc, obData);
                    }
                }
            }
            this.offerNum = index;
            this.QuantitySet(this.offerNum);
        }
    };

    window.JCCatalogSectionViewed.prototype.InitBasketUrl = function()
    {
        switch (this.productType)
        {
            case 1://product
            case 2://set
                this.basketUrl = this.product.addUrl;
                break;
            case 3://sku
                this.basketUrl = this.offers[this.offerNum].ADD_URL;
                break;
        }
        this.basketParams = {
            'ajax_basket': 'Y'
        };
        if (this.showQuantity)
        {
            this.basketParams[this.basketData.quantity] = this.obQuantity.value;
        }
    };

    window.JCCatalogSectionViewed.prototype.FillBasketProps = function()
    {
        if (!this.visual.BASKET_PROP_DIV)
        {
            return;
        }
        var
            i = 0,
            propCollection = null,
            foundValues = false,
            obBasketProps = null;

        if (this.basketData.useProps && !this.basketData.emptyProps)
        {
            if (!!this.obPopupWin && !!this.obPopupWin.contentContainer)
            {
                obBasketProps = this.obPopupWin.contentContainer;
            }
        }
        else
        {
            obBasketProps = BX(this.visual.BASKET_PROP_DIV);
        }
        if (!obBasketProps)
        {
            return;
        }
        propCollection = obBasketProps.getElementsByTagName('select');
        if (!!propCollection && !!propCollection.length)
        {
            for (i = 0; i < propCollection.length; i++)
            {
                if (!propCollection[i].disabled)
                {
                    switch(propCollection[i].type.toLowerCase())
                    {
                        case 'select-one':
                            this.basketParams[propCollection[i].name] = propCollection[i].value;
                            foundValues = true;
                            break;
                        default:
                            break;
                    }
                }
            }
        }
        propCollection = obBasketProps.getElementsByTagName('input');
        if (!!propCollection && !!propCollection.length)
        {
            for (i = 0; i < propCollection.length; i++)
            {
                if (!propCollection[i].disabled)
                {
                    switch(propCollection[i].type.toLowerCase())
                    {
                        case 'hidden':
                            this.basketParams[propCollection[i].name] = propCollection[i].value;
                            foundValues = true;
                            break;
                        case 'radio':
                            if (propCollection[i].checked)
                            {
                                this.basketParams[propCollection[i].name] = propCollection[i].value;
                                foundValues = true;
                            }
                            break;
                        default:
                            break;
                    }
                }
            }
        }
        if (!foundValues)
        {
            this.basketParams[this.basketData.props] = [];
            this.basketParams[this.basketData.props][0] = 0;
        }
    };

    window.JCCatalogSectionViewed.prototype.SendToBasket = function()
    {
        if (!this.canBuy)
        {
            return;
        }
        this.InitBasketUrl();
        this.FillBasketProps();
        BX.ajax.loadJSON(
            this.basketUrl,
            this.basketParams,
            BX.delegate(this.BasketResult, this)
        );
    };

    window.JCCatalogSectionViewed.prototype.Basket = function()
    {
        var contentBasketProps = '';
        if (!this.canBuy)
        {
            return;
        }
        switch (this.productType)
        {
            case 1://product
            case 2://set
                if (this.basketData.useProps && !this.basketData.emptyProps)
                {
                    this.InitPopupWindow();
                    this.obPopupWin.setTitleBar({
                        content: BX.create('div', {
                            style: { marginRight: '30px', whiteSpace: 'nowrap' },
                            text: BX.message('TITLE_BASKET_PROPS')
                        })
                    });
                    if (BX(this.visual.BASKET_PROP_DIV))
                    {
                        contentBasketProps = BX(this.visual.BASKET_PROP_DIV).innerHTML;
                    }
                    this.obPopupWin.setContent(contentBasketProps);
                    this.obPopupWin.setButtons([
                        new BasketButton({
                            ownerClass: this.obProduct.parentNode.parentNode.parentNode.className,
                            text: BX.message('BTN_MESSAGE_SEND_PROPS'),
                            events: {
                                click: BX.delegate(this.SendToBasket, this)
                            }
                        })
                    ]);
                    this.obPopupWin.show();
                }
                else
                {
                    this.SendToBasket();
                }
                break;
            case 3://sku
                this.SendToBasket();
                break;
        }
    };

    window.JCCatalogSectionViewed.prototype.BasketResult = function(arResult)
    {
        var strContent = '',
            strName = '',
            strPict = '',
            successful = true,
            buttons = [];

        if (!!this.obPopupWin)
        {
            this.obPopupWin.close();
        }
        if ('object' !== typeof arResult)
        {
            return false;
        }
        successful = ('OK' === arResult.STATUS);
        if (successful)
        {
            BX.onCustomEvent('OnBasketChange');
            strName = this.product.name;
            switch(this.productType)
            {
                case 1://
                case 2://
                    strPict = this.product.pict.SRC;
                    break;
                case 3:
                    strPict = (!!this.offers[this.offerNum].PREVIEW_PICTURE ?
                        this.offers[this.offerNum].PREVIEW_PICTURE.SRC :
                        this.defaultPict.pict.SRC
                        );
                    break;
            }
            strContent = '<div style="width: 96%; margin: 10px 2%; text-align: center;"><img src="'+strPict+'" height="130"><p>'+strName+'</p></div>';
            buttons = [
                new BasketButton({
                    ownerClass: this.obProduct.parentNode.parentNode.parentNode.className,
                    text: BX.message("BTN_MESSAGE_BASKET_REDIRECT"),
                    events: {
                        click: BX.delegate(function(){
                            location.href = (!!this.basketData.basketUrl ? this.basketData.basketUrl : BX.message('BASKET_URL'));
                        }, this)
                    }
                })
            ];
        }
        else
        {
            strContent = (!!arResult.MESSAGE ? arResult.MESSAGE : BX.message('BASKET_UNKNOWN_ERROR'));
            buttons = [
                new BasketButton({
                    ownerClass: this.obProduct.parentNode.parentNode.parentNode.className,
                    text: BX.message('BTN_MESSAGE_CLOSE'),
                    events: {
                        click: BX.delegate(this.obPopupWin.close, this.obPopupWin)
                    }
                })
            ];
        }
        this.InitPopupWindow();
        this.obPopupWin.setTitleBar({
            content: BX.create('div', {
                style: { marginRight: '30px', whiteSpace: 'nowrap' },
                text: (successful ? BX.message('TITLE_SUCCESSFUL') : BX.message('TITLE_ERROR'))
            })
        });
        this.obPopupWin.setContent(strContent);
        this.obPopupWin.setButtons(buttons);
        this.obPopupWin.show();
    };

    window.JCCatalogSectionViewed.prototype.InitPopupWindow = function()
    {
        if (!!this.obPopupWin)
        {
            return;
        }
        this.obPopupWin = BX.PopupWindowManager.create('CatalogSectionBasket_'+this.visual.ID, null, {
            autoHide: false,
            offsetLeft: 0,
            offsetTop: 0,
            overlay : true,
            closeByEsc: true,
            titleBar: true,
            closeIcon: {top: '10px', right: '10px'}
        });
    };
})(window);
/* End */
;; /* /bitrix/templates/mediartstore/script.js?14338671171166*/
; /* /bitrix/templates/mediartstore/components/bitrix/menu/horizontal_multilevel3/script.js?1437858774469*/
; /* /bitrix/templates/mediartstore/components/bitrix/sale.basket.basket.line/template1/script.js?14350768944656*/
; /* /bitrix/components/bitrix/search.title/script.min.js?14666782056196*/
; /* /bitrix/templates/mediartstore/components/bitrix/menu/vertical_multilevel1/script.js?1435068375507*/
; /* /bitrix/templates/mediartstore/components/bitrix/catalog.viewed.products/vertical2/script.js?143807012445850*/

//# sourceMappingURL=template_ce16cc41756cb227ca3201e34e7b22c4.map.js