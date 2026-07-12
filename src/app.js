/*
    (c) 2023 kanaaa224. All rights reserved.
*/

import * as utils from 'https://cdn.jsdelivr.net/gh/kanaaa224/web-common-sources@master/utils.js';

const { $, create } = utils.dom; utils.dom.extend();

import Lenis from 'https://cdn.jsdelivr.net/npm/lenis@1.3.25/+esm';

export default class App {

    constructor() {
        this.initialize();
    }

    async initialize() {
        let manifest = $('link[rel="manifest"]');

        const response = await fetch(manifest.href);
        const data     = await response.json();

        manifest = data;

        const link = create('link');

        link.rel  = 'icon';
        link.href = new URL(manifest.icons[0].src, response.url).href;

        document.head.appendChild(link);

        const title = document.title = manifest.name;

        await $('body').setHTMLWithFade(`
            <main></main>
            <header>
                <h1>${title}</h1>
                <span class="mdi mdi-apps"></span>
                <nav>
                    <div>` + '<a href=""></a>'.repeat(10) + `</div>
                    <div>` + '<a href=""></a>'.repeat(10) + `</div>
                </nav>
            </header>
            <footer>
                <p>© 2023 <a href="https://kanaaa224.github.io" target="_blank">kanaaa224</a>. All rights reserved.</p>
            </footer>
        `);

        await $('main').setHTMLWithFade(`
            <article>
                ` + '<section>main</section>'.repeat(50) + `
            </article>
        `);

        const lenis = new Lenis({ autoRaf: true });

        this.dialogOpen();
    }

    async dialogOpen() {
        if($('dialog')) return;

        let dialog = null;

        $('body').add(dialog = create('dialog'));

        await dialog.setHTMLWithFade(`
            <div data-lenis-prevent>
                <div class="header">
                    <h1>
                        <span class="mdi mdi-login"></span> ログイン
                    </h1>
                    <p>アカウントでログイン</p>
                </div>
                <div class="main">
                    <p>IDとPasswordを入力してください</p>
                    <input placeholder="ID">
                    <input placeholder="Password">
                    <a style="text-align: center; opacity: .5; font-size: .85rem;">アカウントを作成...</a>
                </div>
                <div class="footer">
                    <button id="close">閉じる</button>
                    <button class="A" id="proceed">ログイン</button>
                </div>
            </div>
        `);

        dialog.on('click', e => { if(e.target === dialog) this.dialogClose(); });

        $('button#close', dialog).on('click', e => { this.dialogClose(); });

        $('button#proceed', dialog).on('click', e => {
            dialog.css('pointer-events: none;');

            $('div.footer', dialog).css('opacity: .5;');

            $('button#proceed', dialog).insertAdjacentHTML('afterbegin', '<span class="mdi mdi-loading mdi-spin"></span> ');

            setTimeout(() => {
                dialog.css('');

                $('div.footer', dialog).css('');

                $('button#proceed span.mdi', dialog).remove();

                this.outputShow();
            }, 3000);
        });
    }

    async dialogClose() {
        await $('dialog').setHTMLWithFade('');

        $('dialog').remove();
    }

    async outputShow() {
        if($('output')) return;

        let output = null;

        $('body').add(output = create('output', { style: 'inset-block-end: -5rem;' }));

        await output.setHTMLWithFade(`
            <div>
                <h1>
                    <span class="mdi mdi-check-circle"></span> ログインしました
                </h1>
            </div>
        `);

        output.css('');

        setTimeout(this.outputHide, 3000);
    }

    async outputHide() {
        await $('output').setHTMLWithFade('');

        $('output').remove();
    }

}