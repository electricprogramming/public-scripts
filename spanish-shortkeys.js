/*
  Custom Keyboard Shortcuts for Browsers/Websites



  DISCLAIMERS:
    1. If a site uses a custom input field (other than a textarea/div/input/other html feature for input), it may not work.
    2. This code technically keeps a record of all keys pressed at any moment.
       It should only know which keys are pressed at one given moment, but
       it could be easily adapted to keep a keylog or another script could access
       its variables somehow, such as the currentKeys variable.
       This should not cause much of an issue, however as
         1) Any other malicious script could easily create its own keylogs, and this
            should not affect it at all.
         2) It is very hard or impossible for another script to access this script's variables, as
            this script is contained within an IIFE (Immediately Invoked Function Expression) and
            JavaScript variables, at least the ones in this script, are block-scoped, meaning they
            do not affect anything anywhere outside of the block where they were declared.
            In this case, that is **inside** the IIFE.
       If you want to look at the code to ensure for yourself that it is not malicious, feel free to.
       It is still in its original state, and has not been minified or obfuscated.



  These are designed for being able to type quickly in Spanish, without the issue
  of special characters like á, ñ, ¡, etc.

  HOW TO USE

    Each unusual character has a specific keyboard shortcut:
      Á/á/É/é/Í/í/Ó/ó/Ú/ú:
        Ctrl + ' + [Desired vowel] -- use shift for capitalization
      Ñ/ñ:
        Ctrl + Alt + N -- Again, use shift for capitalization
      ¡:
        Alt + Shift + 1 -- Shift + 1 does '!'; Alt flips it
      ¿:
        Alt + Shift + / -- Shift + / does '?'; Alt flips it

  To use these keyboard shortcuts, open the browser dev
  tools via either FN + F12, F12, or Ctrl + Shift + I.
  Then, find the console and paste this code in, before hitting 'Enter'.
  If the browser's security measures are annoyed, follow any instructions to
  bypass them. In Chrome, this would be by typing 'allow pasting' and hitting Enter.
  Other browsers may differ.
  Be careful not to run it more than once, as that would run multiple copies of it, which
  might type the desired character multiple times.
*/




// This script is licensed under the Unlicense, as follows:

/*
This is free and unencumbered software released into the public domain.

Anyone is free to copy, modify, publish, use, compile, sell, or
distribute this software, either in source code form or as a compiled
binary, for any purpose, commercial or non-commercial, and by any
means.

In jurisdictions that recognize copyright laws, the author or authors
of this software dedicate any and all copyright interest in the
software to the public domain. We make this dedication for the benefit
of the public at large and to the detriment of our heirs and
successors. We intend this dedication to be an overt act of
relinquishment in perpetuity of all present and future rights to this
software under copyright law.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS BE LIABLE FOR ANY CLAIM, DAMAGES OR
OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE,
ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.
*/
if (!window._isElectricProgrammingSpanishKeyboardShortcutsLoaded) {
  (function(){
    window._isElectricProgrammingSpanishKeyboardShortcutsLoaded = true;
    Array.prototype.includesAll = function(arr) {
      try {
        return arr.every(item => this.includes(item));
      } catch (e) {
        return false;
      }
    };
    let keysPressed = new Set();
    document.addEventListener('keydown', (e) => {
      // Makes Shift, Alt, Control, etc. keys simply that, instead of ShiftLeft, ControlRight, etc. as there is no need to differentiate.
      // Uses e.code instead of e.key so shift doesn't mess up the Set of keys (by making 'A' and 'a' seperate, which can make unexistent keys linger.)
      if (e.code.startsWith('Shift')) {
        keysPressed.add('Shift');
      } else if (e.code.startsWith('Control')) {
        keysPressed.add('Control');
      } else if (e.code.startsWith('Alt')) {
        keysPressed.add('Alt');
      } else if (e.code.startsWith('Meta')) {
        keysPressed.add('Meta');
      } else if (e.code === 'Tab') { // Omit tab key because it lingers in set after being released -- document may leave focus if run in browser or other similar environments. Other possibility is to call e.preventDefault and create custom logic, but only if the tab key should mean something BY ITSELF.
      } else {
        keysPressed.add(e.code);
      }
      handleKeysUpdate(Array.from(keysPressed), e);
    });
    document.addEventListener('keyup', (e) => {
      if (e.code.startsWith('Shift')) {
        keysPressed.delete('Shift');
      } else if (e.code.startsWith('Control')) {
        keysPressed.delete('Control');
      } else if (e.code.startsWith('Alt')) {
        keysPressed.delete('Alt');
      } else if (e.code.startsWith('Meta')) {
        keysPressed.delete('Meta');
      } else {
        keysPressed.delete(e.code);
      }
      handleKeysUpdate(Array.from(keysPressed), e);
    });
    // clears all keys pressed when window changes (to avoid issues with alt+tab, ctrl+tab.)
    function clear () { keysPressed.clear(); }
    document.addEventListener('visibilitychange', clear);
    window.addEventListener('blur', clear);
    window.addEventListener('focus', clear);
    function handleKeysUpdate (currentKeys, e) {
      function insertChar(char) {
        const activeElement = document.activeElement;
        if (activeElement instanceof HTMLInputElement || activeElement instanceof HTMLTextAreaElement) {
          const start = activeElement.selectionStart;
          const end = activeElement.selectionEnd;
          activeElement.value =
            activeElement.value.substring(0, start) +
            char +
            activeElement.value.substring(end);
          activeElement.setSelectionRange(start + 1, start + 1);
          activeElement.focus();
        } else if (activeElement.isContentEditable) {
          const selection = window.getSelection();
          const range = selection.getRangeAt(0);
          const textNode = document.createTextNode(char);
          range.insertNode(textNode);
          range.setStartAfter(textNode);
          range.setEndAfter(textNode);
          selection.removeAllRanges();
          selection.addRange(range);
          activeElement.focus();
        }
      }
      if (currentKeys.includesAll(['Control', 'Quote'])) {
        if (currentKeys.includes('KeyA')) {
          e.preventDefault(); /* these call e.preventDefault() so that unwanted default actions do not occur. For example, in Chrome, Ctrl+Shift+A
          opens a modal to search open/recently closed tabs, and we do not want that happening when trying to make uppercase Á via Ctrl+Shift+'+A. */
          insertChar(currentKeys.includes('Shift')? 'Á' : 'á');
        } else if (currentKeys.includes('KeyE')) {
          e.preventDefault();
          insertChar(currentKeys.includes('Shift')? 'É' : 'é');
        } else if (currentKeys.includes('KeyI')) {
          e.preventDefault();
          insertChar(currentKeys.includes('Shift')? 'Í' : 'í');
        } else if (currentKeys.includes('KeyO')) {
          e.preventDefault();
          insertChar(currentKeys.includes('Shift')? 'Ó' : 'ó');
        } else if (currentKeys.includes('KeyU')) {
          e.preventDefault();
          insertChar(currentKeys.includes('Shift')? 'Ú' : 'ú');
        }
      } else if (currentKeys.includesAll(['Alt', 'Shift', 'Digit1'])) {
        e.preventDefault();
        insertChar('¡');
      } else if (currentKeys.includesAll(['Alt', 'Shift', 'Slash'])) {
        e.preventDefault();
        insertChar('¿');
      } else if (currentKeys.includesAll(['Control', 'Alt', 'KeyN'])) {
        e.preventDefault();
        insertChar(currentKeys.includes('Shift')? 'Ñ' : 'ñ');
      } else if (currentKeys.includesAll(['Control', 'Alt', 'KeyU'])) {
        e.preventDefault();
        insertChar(currentKeys.includes('Shift')? 'Ü' : 'ü')
      }
    }
  })();
}
