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