"use strict";(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[3771],{19860:(e,t,a)=>{a.d(t,{MZ:()=>r.M,wk:()=>i.w});var r=a(48630),i=a(14816)},38254:(e,t,a)=>{var r=a(80643),i=a(67543);a(72969),a(25322),a(98750);var o=a(97265),s=a(54166);let n=(0,r.AH)`
  button {
    border: none;
    border-radius: var(--wui-border-radius-3xl);
  }

  button[data-variant='main'] {
    background-color: var(--wui-color-accent-100);
    color: var(--wui-color-inverse-100);
    box-shadow: inset 0 0 0 1px var(--wui-color-gray-glass-010);
  }

  button[data-variant='accent'] {
    background-color: var(--wui-color-accent-glass-010);
    color: var(--wui-color-accent-100);
    box-shadow: inset 0 0 0 1px var(--wui-color-gray-glass-005);
  }

  button[data-variant='gray'] {
    background-color: transparent;
    color: var(--wui-color-fg-200);
    box-shadow: inset 0 0 0 1px var(--wui-color-gray-glass-010);
  }

  button[data-variant='shade'] {
    background-color: transparent;
    color: var(--wui-color-accent-100);
    box-shadow: inset 0 0 0 1px var(--wui-color-gray-glass-010);
  }

  button[data-size='sm'] {
    height: 32px;
    padding: 0 var(--wui-spacing-s);
  }

  button[data-size='md'] {
    height: 40px;
    padding: 0 var(--wui-spacing-l);
  }

  button[data-size='sm'] > wui-image {
    width: 16px;
    height: 16px;
  }

  button[data-size='md'] > wui-image {
    width: 24px;
    height: 24px;
  }

  button[data-size='sm'] > wui-icon {
    width: 12px;
    height: 12px;
  }

  button[data-size='md'] > wui-icon {
    width: 14px;
    height: 14px;
  }

  wui-image {
    border-radius: var(--wui-border-radius-3xl);
    overflow: hidden;
  }

  button.disabled > wui-icon,
  button.disabled > wui-image {
    filter: grayscale(1);
  }

  button[data-variant='main'] > wui-image {
    box-shadow: inset 0 0 0 1px var(--wui-color-accent-090);
  }

  button[data-variant='shade'] > wui-image,
  button[data-variant='gray'] > wui-image {
    box-shadow: inset 0 0 0 1px var(--wui-color-gray-glass-010);
  }

  @media (hover: hover) and (pointer: fine) {
    button[data-variant='main']:focus-visible {
      background-color: var(--wui-color-accent-090);
    }

    button[data-variant='main']:hover:enabled {
      background-color: var(--wui-color-accent-090);
    }

    button[data-variant='main']:active:enabled {
      background-color: var(--wui-color-accent-080);
    }

    button[data-variant='accent']:hover:enabled {
      background-color: var(--wui-color-accent-glass-015);
    }

    button[data-variant='accent']:active:enabled {
      background-color: var(--wui-color-accent-glass-020);
    }

    button[data-variant='shade']:focus-visible,
    button[data-variant='gray']:focus-visible,
    button[data-variant='shade']:hover,
    button[data-variant='gray']:hover {
      background-color: var(--wui-color-gray-glass-002);
    }

    button[data-variant='gray']:active,
    button[data-variant='shade']:active {
      background-color: var(--wui-color-gray-glass-005);
    }
  }

  button.disabled {
    color: var(--wui-color-gray-glass-020);
    background-color: var(--wui-color-gray-glass-002);
    box-shadow: inset 0 0 0 1px var(--wui-color-gray-glass-002);
    pointer-events: none;
  }
`;var c=function(e,t,a,r){var i,o=arguments.length,s=o<3?t:null===r?r=Object.getOwnPropertyDescriptor(t,a):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)s=Reflect.decorate(e,t,a,r);else for(var n=e.length-1;n>=0;n--)(i=e[n])&&(s=(o<3?i(s):o>3?i(t,a,s):i(t,a))||s);return o>3&&s&&Object.defineProperty(t,a,s),s};let l=class extends r.WF{constructor(){super(...arguments),this.variant="accent",this.imageSrc="",this.disabled=!1,this.icon="externalLink",this.size="md",this.text=""}render(){let e="sm"===this.size?"small-600":"paragraph-600";return(0,r.qy)`
      <button
        class=${this.disabled?"disabled":""}
        data-variant=${this.variant}
        data-size=${this.size}
      >
        ${this.imageSrc?(0,r.qy)`<wui-image src=${this.imageSrc}></wui-image>`:null}
        <wui-text variant=${e} color="inherit"> ${this.text} </wui-text>
        <wui-icon name=${this.icon} color="inherit" size="inherit"></wui-icon>
      </button>
    `}};l.styles=[o.W5,o.fD,n],c([(0,i.MZ)()],l.prototype,"variant",void 0),c([(0,i.MZ)()],l.prototype,"imageSrc",void 0),c([(0,i.MZ)({type:Boolean})],l.prototype,"disabled",void 0),c([(0,i.MZ)()],l.prototype,"icon",void 0),c([(0,i.MZ)()],l.prototype,"size",void 0),c([(0,i.MZ)()],l.prototype,"text",void 0),l=c([(0,s.E)("wui-chip-button")],l)},63771:(e,t,a)=>{a.r(t),a.d(t,{W3mWalletReceiveView:()=>N});var r=a(68082),i=a(19860),o=a(63370),s=a(11076),n=a(70625),c=a(5517),l=a(34735),d=a(7478),u=a(19628),w=a(35558),p=a(52515);a(38254);var h=a(80643),v=a(67543);a(72969),a(25322),a(98750),a(43804);var g=a(97265),b=a(54166);let m=(0,h.AH)`
  button {
    display: flex;
    gap: var(--wui-spacing-xl);
    width: 100%;
    background-color: var(--wui-color-gray-glass-002);
    border-radius: var(--wui-border-radius-xxs);
    padding: var(--wui-spacing-m) var(--wui-spacing-s);
  }

  wui-text {
    width: 100%;
  }

  wui-flex {
    width: auto;
  }

  .network-icon {
    width: var(--wui-spacing-2l);
    height: var(--wui-spacing-2l);
    border-radius: calc(var(--wui-spacing-2l) / 2);
    overflow: hidden;
    box-shadow:
      0 0 0 3px var(--wui-color-gray-glass-002),
      0 0 0 3px var(--wui-color-modal-bg);
  }
`;var f=function(e,t,a,r){var i,o=arguments.length,s=o<3?t:null===r?r=Object.getOwnPropertyDescriptor(t,a):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)s=Reflect.decorate(e,t,a,r);else for(var n=e.length-1;n>=0;n--)(i=e[n])&&(s=(o<3?i(s):o>3?i(t,a,s):i(t,a))||s);return o>3&&s&&Object.defineProperty(t,a,s),s};let y=class extends h.WF{constructor(){super(...arguments),this.networkImages=[""],this.text=""}render(){return(0,h.qy)`
      <button>
        <wui-text variant="small-400" color="fg-200">${this.text}</wui-text>
        <wui-flex gap="3xs" alignItems="center">
          ${this.networksTemplate()}
          <wui-icon name="chevronRight" size="sm" color="fg-200"></wui-icon>
        </wui-flex>
      </button>
    `}networksTemplate(){let e=this.networkImages.slice(0,5);return(0,h.qy)` <wui-flex class="networks">
      ${e?.map(e=>(0,h.qy)` <wui-flex class="network-icon"> <wui-image src=${e}></wui-image> </wui-flex>`)}
    </wui-flex>`}};y.styles=[g.W5,g.fD,m],f([(0,v.MZ)({type:Array})],y.prototype,"networkImages",void 0),f([(0,v.MZ)()],y.prototype,"text",void 0),y=f([(0,b.E)("wui-compatible-network")],y),a(98160),a(4146),a(22724);var x=a(45312);let k=(0,r.AH)`
  wui-compatible-network {
    margin-top: var(--wui-spacing-l);
  }
`;var $=function(e,t,a,r){var i,o=arguments.length,s=o<3?t:null===r?r=Object.getOwnPropertyDescriptor(t,a):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)s=Reflect.decorate(e,t,a,r);else for(var n=e.length-1;n>=0;n--)(i=e[n])&&(s=(o<3?i(s):o>3?i(t,a,s):i(t,a))||s);return o>3&&s&&Object.defineProperty(t,a,s),s};let N=class extends r.WF{constructor(){super(),this.unsubscribe=[],this.address=s.U.state.address,this.profileName=s.U.state.profileName,this.network=n.W.state.activeCaipNetwork,this.preferredAccountTypes=s.U.state.preferredAccountTypes,this.unsubscribe.push(s.U.subscribe(e=>{e.address?(this.address=e.address,this.profileName=e.profileName,this.preferredAccountTypes=e.preferredAccountTypes):c.P.showError("Account not found")}),n.W.subscribeKey("activeCaipNetwork",e=>{e?.id&&(this.network=e)}))}disconnectedCallback(){this.unsubscribe.forEach(e=>e())}render(){if(!this.address)throw Error("w3m-wallet-receive-view: No account provided");let e=l.$.getNetworkImage(this.network);return(0,r.qy)` <wui-flex
      flexDirection="column"
      .padding=${["0","l","l","l"]}
      alignItems="center"
    >
      <wui-chip-button
        data-testid="receive-address-copy-button"
        @click=${this.onCopyClick.bind(this)}
        text=${p.Zv.getTruncateString({string:this.profileName||this.address||"",charsStart:this.profileName?18:4,charsEnd:4*!this.profileName,truncate:this.profileName?"end":"middle"})}
        icon="copy"
        size="sm"
        imageSrc=${e||""}
        variant="gray"
      ></wui-chip-button>
      <wui-flex
        flexDirection="column"
        .padding=${["l","0","0","0"]}
        alignItems="center"
        gap="s"
      >
        <wui-qr-code
          size=${232}
          theme=${d.W.state.themeMode}
          uri=${this.address}
          ?arenaClear=${!0}
          color=${(0,o.J)(d.W.state.themeVariables["--w3m-qr-color"])}
          data-testid="wui-qr-code"
        ></wui-qr-code>
        <wui-text variant="paragraph-500" color="fg-100" align="center">
          Copy your address or scan this QR code
        </wui-text>
      </wui-flex>
      ${this.networkTemplate()}
    </wui-flex>`}networkTemplate(){let e=n.W.getAllRequestedCaipNetworks(),t=n.W.checkIfSmartAccountEnabled(),a=n.W.state.activeCaipNetwork,i=e.filter(e=>e?.chainNamespace===a?.chainNamespace);if(this.preferredAccountTypes?.[a?.chainNamespace]===x.Vl.ACCOUNT_TYPES.SMART_ACCOUNT&&t)return a?(0,r.qy)`<wui-compatible-network
        @click=${this.onReceiveClick.bind(this)}
        text="Only receive assets on this network"
        .networkImages=${[l.$.getNetworkImage(a)??""]}
      ></wui-compatible-network>`:null;let o=(i?.filter(e=>e?.assets?.imageId)?.slice(0,5)).map(l.$.getNetworkImage).filter(Boolean);return(0,r.qy)`<wui-compatible-network
      @click=${this.onReceiveClick.bind(this)}
      text="Only receive assets on these networks"
      .networkImages=${o}
    ></wui-compatible-network>`}onReceiveClick(){u.I.push("WalletCompatibleNetworks")}onCopyClick(){try{this.address&&(w.w.copyToClopboard(this.address),c.P.showSuccess("Address copied"))}catch{c.P.showError("Failed to copy")}}};N.styles=k,$([(0,i.wk)()],N.prototype,"address",void 0),$([(0,i.wk)()],N.prototype,"profileName",void 0),$([(0,i.wk)()],N.prototype,"network",void 0),$([(0,i.wk)()],N.prototype,"preferredAccountTypes",void 0),N=$([(0,p.EM)("w3m-wallet-receive-view")],N)},68082:(e,t,a)=>{a.d(t,{AH:()=>r.AH,WF:()=>r.WF,qy:()=>r.qy}),a(30572),a(77508);var r=a(53676)}}]);