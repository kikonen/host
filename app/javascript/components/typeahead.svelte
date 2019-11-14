<script>
 import {onMount} from 'svelte';

 export let real;
 export let fetcher;

 export let results = [];
 export let value = '';

 export let popupVisible = false;
 export let currentFetch = null;

 let input;
 let popup;

 let previousValue = '';
 let resultFetched = false;

 ////////////////////////////////////////////////////////////
 //
 function fetchResults() {
     if (value === previousValue) {
         return;
     }
     console.log("filter: " + value);

     cancelFetch();

     results = [];
     resultFetched = false;

     let searchValue = value;
     popupVisible = true;

     let fetch = fetcher(searchValue).then(function(entries) {
         if (fetch === currentFetch) {
             console.log("APPLY fetch: " + searchValue);
             reindexResults(entries);
             results = entries;
             previousValue = searchValue;
             currentFetch = null;
             resultFetched = true;
         } else {
             console.log("CANCEL fetch: " + searchValue);
         }
     }).catch(function(err) {
         if (fetch === currentFetch) {
             currentFetch = null;
             popupVisible = false;
         }
     });
     currentFetch = fetch;

     function reindexResults(results) {
         let index = 0;
         results.forEach(function(item) {
             item.index = index;
             index = index + 1;
         });
     }
 }

 function cancelFetch() {
     if (currentFetch !== null) {
         currentFetch = null;
         // no result fetched; since it doesn't match input any longer
         resultFetched = false;
         previousValue = null;
     }
 }

 function togglePopup(focusInput) {
     if (popupVisible) {
         closePopup(focusInput);
     } else {
         if (resultFetched) {
             popupVisible = true;
         } else {
             previousValue = null;
             fetchResults();
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

 function selectItem(el) {
     let item = results[el.dataset.index];
     if (item) {
         previousValue = item.text;
         value = previousValue;
         closePopup(true);
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
         } else if (value && !popupVisible) {
             popupVisible = true;
             fetchResults();
         }
     },
     ArrowUp: function(event) {
         let item = popupVisible ? popup.querySelector('.js-item:last-child') : null;
         if (item) {
             item.focus();
         }
     },
     Tab: function(event) {
         closePopup(false);
     },
     Escape: function(event) {
         closePopup();
     }
 };

 let inputKeyupHandlers = {
     base: function(event) {
         fetchResults();
     },
     ArrowDown: nop,
     ArrowUp: nop,
     Tab: nop,
     Escape: nop,
 }

 let itemKeydownHandlers = {
     base: nop,
     ArrowDown: function(event) {
         let next = event.target.nextElementSibling;
         if (next) {
             next.focus();
         } else {
             input.focus();
         }
     },
     ArrowUp: function(event) {
         let next = event.target.previousElementSibling;
         if (next) {
             next.focus();
         } else {
             input.focus();
         }
     },
     Tab: function(event) {
         closePopup(true);
     },
     Enter: function(event) {
         selectItem(event.target)
     },
     Escape: function(event) {
         closePopup(true);
     },
 };

 function handleEvent(code, handlers, event) {
     let handler = handlers[code] || handlers.base;
     handler(event);
 }

 function handleKeyup(event) {
     handleEvent(event.code, inputKeyupHandlers, event);
 }

 function handleInputKeydown(event) {
     handleEvent(event.code, inputKeydownHandlers, event);
 }

 function handleInputClick(event) {
     if (event.button === 0 && !hasModifier(event)) {
         fetchResults();
     }
 }

 function handleToggleClick(event) {
     if (event.button === 0 && !hasModifier(event)) {
         togglePopup(false);
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

<style>
 .typeahead {
     position: relative;
 }
 .no-click {
     pointer-events: none;
 }
</style>

<div class="input-group mb-3 typeahead js-typeahead-container">
  <input class="js-input {real.getAttribute('class')}"
         data-target="{real.id}"
         placeholder="{real.placeholder}"
         bind:this={input}
         bind:value
         on:keydown={handleInputKeydown}
         on:keyup={handleKeyup}
         on:click={handleInputClick}>
  <div class="input-group-append">
    <button class="btn btn-outline-secondary" type="button" on:click={handleToggleClick}>
      <i class="fas fa-caret-down"></i>
    </button>
  </div>

  <div class="js-popup dropdown-menu {popupVisible ? 'show' : ''}"
       bind:this={popup} >
    {#if currentFetch}
      <div tabindex=-1 class="dropdown-item text-muted">
        Searching...
      </div>
    {/if}

    {#if !currentFetch && results.length === 0 }
      <div tabindex=-1 class="dropdown-item text-muted">
        No results
      </div>
    {/if}

    {#if !currentFetch && results.length > 0 }
      {#each results as item}
        <div tabindex=1 class="js-item dropdown-item"  data-index="{item.index}" on:click={handleItemClick} on:keydown={handleItemKeydown}>
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
