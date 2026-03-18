// ==UserScript==
// @name         RuHeb Optimized v1.4.3
// @namespace    http://tampermonkey.net/
// @version      1.4.3
// @description  Transliterates Russian text to a unique Hebrew-based mapping for the RuRunes art project with optimized performance and consistent transliteration. Handles soft sign placement correctly.
// @match        http://*/*
// @match        https://*/*
// @grant        none
// @license      The Uncertain Commons License https://gist.github.com/dobrosketchkun/d0c6aba085fb4a910926616a8b83c4c5
// ==/UserScript==

(function() {
    'use strict';

    // === FONT CONFIGURATION ===
    // Uncomment the block below to use cursive (handwritten) Hebrew font


//     const style = document.createElement('style');
//     style.textContent = `
//       @font-face {
//         font-family: 'KtavYad';
//         src: url('data:font/woff2;base64,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') format('woff2');
//       }
//       .hebrew-output, [lang="he"], .mw-parser-output {
//         font-family: 'KtavYad', cursive !important;
//       }
//     `;
//     document.head.appendChild(style);



    // **Mapping Object**
    const correspondences = {
        // **Vowels**
        'А': 'א', 'а': 'א',
        'Е': 'יֵ', 'е': 'יֵ',
        'Ё': 'יֹ', 'ё': 'יֹ',
        'И': 'י', 'и': 'י',
        'О': 'וֹ', 'о': 'וֹ',
        'У': 'וּ', 'у': 'וּ',
        'Ы': 'אִ', 'ы': 'אִ',
        'Э': 'אֶ', 'э': 'אֶ',
        'Ю': 'יְוּ', 'ю': 'יְוּ',
        'Я': 'יַ', 'я': 'יַ',

        // **Consonants**
        'Б': 'בּ', 'б': 'בּ',
        'В': 'ב', 'в': 'ב',
        'Г': 'ג', 'г': 'ג',
        'Д': 'ד', 'д': 'ד',
        'Ж': 'ז׳', 'ж': 'ז׳',
        'З': 'ז', 'з': 'ז',
        'Й': 'י׳', 'й': 'י׳',
        'К': 'כּ', 'к': 'כּ',
        'Л': 'ל', 'л': 'ל',
        'М': 'מ', 'м': 'מ',
        'Н': 'נ', 'н': 'נ',
        'П': 'פּ', 'п': 'פּ',
        'Р': 'ר', 'р': 'ר',
        'С': 'ס', 'с': 'ס',
        'Т': 'ת', 'т': 'ת',
        'Ф': 'פ', 'ф': 'פ',
        'Х': 'ח', 'х': 'ח',
        'Ц': 'צ', 'ц': 'צ',
        'Ч': 'צ׳', 'ч': 'צ׳',
        'Ш': 'שׁ', 'ш': 'שׁ',
        'Щ': 'שּׁ', 'щ': 'שּׁ',

        // **Signs**
        'Ъ': '״', 'ъ': '״',
        'Ь': 'ֽ', 'ь': 'ֽ'
    };

    // **Function to Escape Special Regex Characters**
    function escapeRegExp(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // Escapes special characters
    }

    // **Letters except 'ь' and 'Ь'**
    const lettersExceptSoftSign = Object.keys(correspondences)
        .filter(c => c.toLowerCase() !== 'ь')
        .map(escapeRegExp)
        .join('');

    // **Regex to match letter + 'ь'**
    const letterPlusSoftSignRegex = new RegExp('([' + lettersExceptSoftSign + '])ь', 'g');

    // **Combined Regex for Replacement with Escaped Characters**
    const replaceRegex = new RegExp(Object.keys(correspondences).map(escapeRegExp).join('|'), 'g');

    // **Regular Expression to Detect Russian Characters**
    const russianRegex = /[АаЕеЁёИиЙйОоУуЫыЭэЮюЯяБбВвГгДдЖжЗзКкЛлМмНнПпРрСсТтФфХхЦцЧчШшЩщЪъЬь]/g;

    // **Debounce Function to Limit Frequency of replaceText Execution**
    function debounce(func, wait) {
        let timeout;
        return function(...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    }

    // **WeakSet to Track Processed Text Nodes**
    const processedNodes = new WeakSet();

    // **Replace Function**
    function replaceText() {
        const walker = document.createTreeWalker(
            document.body,
            NodeFilter.SHOW_TEXT,
            {
                acceptNode: function(node) {
                    // Exclude certain parent elements
                    if (node.parentNode &&
                        ['SCRIPT', 'STYLE', 'TEXTAREA', 'INPUT', 'CODE', 'PRE', 'NOSCRIPT'].includes(node.parentNode.nodeName)) {
                        return NodeFilter.FILTER_REJECT;
                    }
                    // Accept node if it contains Russian characters
                    if (russianRegex.test(node.nodeValue)) {
                        return NodeFilter.FILTER_ACCEPT;
                    }
                    return NodeFilter.FILTER_SKIP;
                }
            },
            false
        );

        let node;
        while (node = walker.nextNode()) {
            // Avoid reprocessing already processed nodes
            if (processedNodes.has(node)) {
                continue;
            }

            const originalText = node.nodeValue;

            // **Step 1: Replace letter + 'ь' with Meteg applied before diacritics**
            const replacedTextWithSoftSign = originalText.replace(letterPlusSoftSignRegex, (match, p1) => {
                const mapped = correspondences[p1];
                if (!mapped) return p1 + 'ь'; // Fallback if no mapping found

                const meteg = 'ֽ';
                const geresh = '׳';
                const gereshIndex = mapped.indexOf(geresh);

                if (gereshIndex !== -1) {
                    // Insert Meteg before Geresh
                    return mapped.slice(0, gereshIndex) + meteg + mapped.slice(gereshIndex);
                }

                // If no Geresh, append Meteg at the end
                return mapped + meteg;
            });

            // **Step 2: Replace remaining letters**
            const replacedLetters = replacedTextWithSoftSign.replace(replaceRegex, match => correspondences[match] || match);

            // **Step 3: Replace any remaining 'ь' with Meteg**
            const finalReplacedText = replacedLetters.replace(/[ьЬ]/g, 'ֽ');

            if (finalReplacedText !== originalText) {
                node.nodeValue = finalReplacedText;
                processedNodes.add(node); // Mark this text node as processed

                // **Logging for Debugging (Optional)**
                // Uncomment the lines below to enable logging
                /*
                console.log('Original:', originalText);
                console.log('Replaced:', finalReplacedText);
                */
            }
        }
    }

    // **Debounced Version of replaceText for MutationObserver**
    const debouncedReplaceText = debounce(replaceText, 300);

    // **Initial Replacement**
    replaceText();

    // **Set Up MutationObserver with Debouncing**
    const observer = new MutationObserver(function(mutations) {
        debouncedReplaceText();
    });

    observer.observe(document.body, { childList: true, subtree: true });

})();