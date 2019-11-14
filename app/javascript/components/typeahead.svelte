<script>
 import {onMount} from 'svelte';

 export let real;
 export let fetcher;

 export let hasMore = false;
 export let entries = [];
 export let value = '';

 export let popupVisible = false;
 export let currentFetch = null;

 let input;
 let toggle;
 let popup;

 let previousValue = '';
 let fetched = false;
 let fetchOffset = 0;

 ////////////////////////////////////////////////////////////
 //
 function fetchEntries() {
     if (value === previousValue) {
         return;
     }

     console.debug("START fetch: " + value);

     cancelFetch();

     entries = [];
     hasMore = false;
     fetched = false;
     fetchOffset = 0;

     let searchValue = value;
     openPopup();
     let fetch = fetcher(fetchOffset, searchValue).then(function(response) {
         if (fetch === currentFetch) {
             console.debug("APPLY fetch: " + value);

             entries = response.entries || [];
             hasMore = response.hasMore;

             reindexEntries(entries);

             previousValue = searchValue;
             currentFetch = null;
             fetched = true;
         } else {
             console.debug("ABORT fetch: " + value);
         }
     }).catch(function(err) {
         if (fetch === currentFetch) {
             currentFetch = null;
             popupVisible = false;
         }
     });
     currentFetch = fetch;

     function reindexEntries(entries) {
         let index = 0;
         entries.forEach(function(item) {
             item.index = index;
             index = index + 1;
         });
     }
 }

 function cancelFetch() {
     if (currentFetch !== null) {
         currentFetch = null;
         // no result fetched; since it doesn't match input any longer
         fetched = false;
         previousValue = null;
     }
 }

 function togglePopup(focusInput) {
     if (popupVisible) {
         closePopup(focusInput);
     } else {
         openPopup();
         if (!fetched) {
             previousValue = null;
             fetchEntries();
         }
     }
 }

 function closePopup(focusInput) {
     cancelFetch();
     popupVisible = false;
     if (focusInput) {
         input.focus();
     }
 }

 function openPopup() {
     if (!popupVisible) {
         popupVisible = true;
         let w = input.parentElement.offsetWidth;
         popup.style.minWidth = w + "px";
     }
 }

 function selectItem(el) {
     let item = entries[el.dataset.index];
     if (item) {
         let changed = item.text !== value
         value = item.text;
         previousValue = value;
         closePopup(true);
         if (changed) {
             previousValue = null;
         }
     } else {
         console.log("MISSING item", el);
     }
 }

 ////////////////////////////////////////////////////////////
 // HANDLERS
 //
 $: real.setAttribute('value', value);

 onMount(function() {
     value = real.value;
     previousValue = value;
     real.classList.add('d-none');
 });

 function nop() {};

 let inputKeydownHandlers = {
     base: nop,
     ArrowDown: function(event) {
         let item = popupVisible ? popup.querySelector('.js-item:first-child') : null;
         if (item) {
             item.focus();
         } else {
             openPopup();
             fetchEntries();
         }
         event.preventDefault();
     },
     ArrowUp: function(event) {
         let item = popupVisible ? popup.querySelector('.js-item:last-child') : null;
         if (item) {
         // NOTE KI no focus to item; irritating behaviour
//             item.focus();
         }
         event.preventDefault();
     },
     Escape: function(event) {
         closePopup();
     }
 };

 let toggleKeydownHandlers = {
     base: nop,
     ArrowDown: inputKeydownHandlers.ArrowDown,
     ArrowUp: function(event) {
         closePopup(false);
         event.preventDefault();
     },
     Escape: inputKeydownHandlers.Escape,
 };

 let inputKeyupHandlers = {
     base: function(event) {
         fetchEntries();
     },
     ArrowDown: nop,
     ArrowUp: nop,
     Enter: nop,
     Escape: nop,
 }

 let itemKeydownHandlers = {
     base: function(event) {
         input.focus();
     },
     ArrowDown: function(event) {
         let next = event.target.nextElementSibling;
         if (next) {
             next.focus();
         } else {
             // NOTE KI no focus to input; irritating behaviour
//             input.focus();
         }
         event.preventDefault();
     },
     ArrowUp: function(event) {
         let next = event.target.previousElementSibling;
         if (next) {
             next.focus();
         } else {
             input.focus();
         }
         event.preventDefault();
     },
     Enter: function(event) {
         selectItem(event.target)
         event.preventDefault();
     },
     Escape: function(event) {
         closePopup(true);
     },
 };

 function handleEvent(code, handlers, event) {
     let handler = handlers[code] || handlers.base;
     handler(event);
 }

 function handleBlur(event) {
     let next = event.relatedTarget;
     if (!popup.contains(next) &&
         next !== input &&
         next !== toggle) {
         closePopup(false);
     }
 }

 function handleKeyup(event) {
     handleEvent(event.code, inputKeyupHandlers, event);
 }

 function handleInputKeydown(event) {
     handleEvent(event.code, inputKeydownHandlers, event);
 }

 function handleInputClick(event) {
//     if (event.button === 0 && !hasModifier(event)) {
//         fetchEntries();
//     }
 }

 function handleToggleKeydown(event) {
     handleEvent(event.code, toggleKeydownHandlers, event);
 }

 function handleToggleClick(event) {
     if (event.button === 0 && !hasModifier(event)) {
         if (popupVisible) {
             closePopup(false);
         } else {
             openPopup();
             fetchEntries();
         }
     }
 }

 function handleItemKeydown(event) {
     handleEvent(event.code, itemKeydownHandlers, event);
 }

 function handleItemClick() {
     if (event.button === 0 && !hasModifier(event)) {
         selectItem(event.target)
     }
 }

 function hasModifier(event) {
     return event.altKey || event.ctrlKey || event.metaKey || event.shiftKey;
 }
</script>

<!-- ------------------------------------------------------------ -->
<!-- ------------------------------------------------------------ -->
<style>
 .typeahead {
     position: relative;
 }
 .typeahead-popup {
     max-height: 15rem;
     max-width: 90vw;
     overflow-y: auto;
 }
 .no-click {
     pointer-events: none;
 }
</style>

<!-- ------------------------------------------------------------ -->
<!-- ------------------------------------------------------------ -->
<div class="input-group mb-3 typeahead js-typeahead-container">
  <input class="js-input {real.getAttribute('class')}"
         data-target="{real.id}"
         placeholder="{real.placeholder}"
         bind:this={input}
         bind:value
         on:blur={handleBlur}
         on:keydown={handleInputKeydown}
         on:keyup={handleKeyup}
         on:click={handleInputClick}>
  <div class="input-group-append">
    <button class="btn btn-outline-secondary" type="button"
            bind:this={toggle}
            on:blur={handleBlur}
            on:keydown={handleToggleKeydown}
            on:click={handleToggleClick}>
      <i class="fas fa-caret-down"></i>
    </button>
  </div>

  <div class="js-popup dropdown-menu typeahead-popup {popupVisible ? 'show' : ''}"
       bind:this={popup} >
    {#if currentFetch}
      <div tabindex=-1 class="dropdown-item text-muted">
        Searching...
      </div>
    {/if}

    {#if !currentFetch && entries.length === 0 }
      <div tabindex=-1 class="dropdown-item text-muted">
        No entries
      </div>
    {/if}

    {#if !currentFetch && entries.length > 0 }
      {#each entries as item}
        <div tabindex=1 class="js-item dropdown-item"  data-index="{item.index}"
             on:blur={handleBlur}
             on:click={handleItemClick}
             on:keydown={handleItemKeydown}>
          <div class="no-click">
            {item.text}
          </div>
          <div class="no-click text-muted">
            {item.desc}
          </div>
        </div>
      {/each}
    {/if}
  </div>
</div>
