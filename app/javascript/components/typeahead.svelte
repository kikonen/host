<script>
 import {onMount} from 'svelte';

 export let real;
 export let fetcher;

 export let hasMore = false;
 export let entries = [];
 export let query = '';

 export let popupVisible = false;
 export let activeFetch = null;

 let input;
 let toggle;
 let popup;

 let previousQuery = null;
 let fetched = false;
 let fetchOffset = 0;
 let selectedItem = null;
 let downQuery = null;

 let i18n = {
     fetching: 'Searching..',
     no_results: 'No results',
 };

 ////////////////////////////////////////////////////////////
 //
 function fetchEntries() {
     if (query === previousQuery) {
         return;
     }

     console.debug("START fetch: " + query);

     cancelFetch();
     openPopup();

     entries = [];
     hasMore = false;
     fetched = false;
     fetchOffset = 0;

     let currentQuery = query;
     let currentFetch = new Promise(function(resolve, reject) {
         console.debug("TIMER start: " + currentQuery);
         setTimeout(function() {
             if (currentFetch === activeFetch) {
                 console.debug("TIMER hit: " + currentQuery);
                 resolve(callFetcher());
             } else {
                 console.debug("TIMER reject: " + currentQuery);
                 reject("cancel");
             }
         }, 300);
     }).catch(function(err) {
         if (currentFetch === activeFetch) {
             closePopup(true);
         }
     });

     activeFetch = currentFetch;

     function callFetcher() {
         return fetcher(fetchOffset, currentQuery).then(function(response) {
             if (currentFetch === activeFetch) {
                 console.debug("APPLY fetch: " + currentQuery + ", size:" + response.entries.length);

                 entries = response.entries || [];
                 hasMore = response.hasMore;

                 reindexEntries(entries);

                 previousQuery = currentQuery;
                 activeFetch = null;
                 fetched = true;
             } else {
                 console.debug("ABORT fetch: " + currentQuery);
             }
         }).catch(function(err) {
             if (currentFetch === activeFetch) {
                 closePopup(true);
             }
         });
     }

     function reindexEntries(entries) {
         let index = 0;
         entries.forEach(function(item) {
             item.index = index;
             index = index + 1;
         });
     }
 }

 function cancelFetch() {
     if (activeFetch !== null) {
         activeFetch = null;
         // no result fetched; since it doesn't match input any longer
         fetched = false;
         previousQuery = null;
     }
 }

 function closePopup(focusInput) {
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
         selectedItem = item;
         let changed = item.text !== query
         query = item.text;
         previousQuery = query;
         closePopup(true);
         if (changed) {
             previousQuery = null;
         }
     } else {
         console.log("MISSING item", el);
     }
 }

 function containsElement(el) {
     return el === input || el === toggle || popup.contains(el);
 }

 function hasModifier(event) {
     return event.altKey || event.ctrlKey || event.metaKey || event.shiftKey;
 }

 ////////////////////////////////////////////////////////////
 // HANDLERS
 //
 $: real.setAttribute('value', query);

 onMount(function() {
     query = real.value || '';
     real.classList.add('d-none');
 });

 function nop() {};

 let inputKeypressHandlers = {
     base: function(event) {
//         console.log("PRESS: " + query);
         selectedItem = false;
     },
 };

 let inputKeydownHandlers = {
     base: function(event) {
//         console.log("DOWN: " + query);
         downQuery = query;
     },
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
         // NOTE KI closing popup here is *irritating* i.e. if one is trying to select
         // first entry in dropdown
         event.preventDefault();
     },
     Escape: function(event) {
         cancelFetch();
         closePopup(false);
     },
     Tab: nop,
 };

 let inputKeyupHandlers = {
     base: function(event) {
//         console.log("UP: " + query);
         if (query !== downQuery) {
             openPopup();
             fetchEntries();
         }
     },
     ArrowDown: nop,
     ArrowUp: nop,
     Enter: nop,
     Escape: nop,
     Tab: nop,
     // skip "meta" keys from triggering search
     PageDown: nop,
     PageUp: nop,
     Home: nop,
     End: nop,
     // disallow modifier keys to trigger search
     Control: nop,
     Shift: nop,
     AltGraph: nop,
     Meta: nop,
     ContextMenu: nop,
 }

 let toggleKeydownHandlers = {
     base: function(event) {
         input.focus();
     },
     ArrowDown: inputKeydownHandlers.ArrowDown,
     ArrowUp: function(event) {
         closePopup(false);
         event.preventDefault();
     },
     Escape: function(event) {
         cancelFetch();
         closePopup(false);
         input.focus();
     },
     Tab: function(event) {
         input.focus();
     },
 };

 let itemKeydownHandlers = {
     base: function(event) {
         input.focus();
     },
     ArrowDown: function(event) {
         let next = event.target.nextElementSibling;
         if (next) {
             next.focus();
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
         cancelFetch();
         closePopup(true);
     },
     // allow "meta" keys to navigate in items
     PageUp: nop,
     PageDown: nop,
     Home: nop,
     End: nop,
     // disallow modifier keys to trigger search
     Control: nop,
     Shift: nop,
     AltGraph: nop,
     Meta: nop,
     ContextMenu: nop,
 };

 let itemKeyupHandlers = {
     base: nop,
     // allow "meta" keys to navigate in items
     PageUp: function(event) {
         let scrollLeft = document.body.scrollLeft;
         let scrollTop = document.body.scrollTop;

         let rect = popup.getBoundingClientRect();
         let item = document.elementFromPoint(scrollLeft + rect.x + 10, scrollTop + rect.top + 1);
         if (!item) {
             item = popup.querySelector('.js-item:first-child');
         } else {
             if (!item.classList.contains('js-item')) {
                 item = popup.querySelector('.js-item:first-child');
             }
         }
         if (item) {
             item.focus();
         }
         event.preventDefault();
     },
     PageDown: function(event) {
         let scrollLeft = document.body.scrollLeft;
         let scrollTop = document.body.scrollTop;
         let h = popup.offsetHeight;

         let rect = popup.getBoundingClientRect();
         let item = document.elementFromPoint(scrollLeft + rect.x + 10, scrollTop + rect.top + h - 10);
         if (!item) {
             item = popup.querySelector('.js-item:last-child');
         } else {
             if (!item.classList.contains('js-item')) {
                 item = popup.querySelector('.js-item:last-child');
             }
         }
         if (item) {
             item.focus();
         }
         event.preventDefault();
     },
     Home: function(event) {
         let item = popup.querySelector('.js-item:first-child');
         if (item) {
             item.focus();
         }
         event.preventDefault();
     },
     End: function(event) {
         let item = popup.querySelector('.js-item:last-child');
         if (item) {
             item.focus();
         }
         event.preventDefault();
     },
 }

 function handleEvent(code, handlers, event) {
     console.log(event);
     let handler = handlers[code] || handlers.base;
     handler(event);
 }

 function handleBlur(event) {
     if (!containsElement(event.relatedTarget)) {
         cancelFetch();
         closePopup(false);
     }
 }

 function handleInputKeypress(event) {
     handleEvent(event.key, inputKeypressHandlers, event);
 }

 function handleInputKeydown(event) {
     handleEvent(event.key, inputKeydownHandlers, event);
 }

 function handleInputKeyup(event) {
     handleEvent(event.key, inputKeyupHandlers, event);
 }

 function handleInputClick(event) {
 }

 function handleToggleKeydown(event) {
     handleEvent(event.key, toggleKeydownHandlers, event);
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
     handleEvent(event.key, itemKeydownHandlers, event);
 }

 function handleItemKeyup(event) {
     handleEvent(event.key, itemKeyupHandlers, event);
 }

 function handleItemClick() {
     if (event.button === 0 && !hasModifier(event)) {
         selectItem(event.target)
     }
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
         bind:value={query}
         on:blur={handleBlur}
         on:keypress={handleInputKeypress}
         on:keydown={handleInputKeydown}
         on:keyup={handleInputKeyup}
         on:click={handleInputClick}>
  <div class="input-group-append">
    <button class="btn btn-outline-secondary" type="button" tabindex="-1"
            bind:this={toggle}
            on:blur={handleBlur}
            on:keydown={handleToggleKeydown}
            on:click={handleToggleClick}>
      <i class="fas fa-caret-down"></i>
    </button>
  </div>

  <div class="js-popup dropdown-menu typeahead-popup {popupVisible ? 'show' : ''}"
       bind:this={popup} >
    {#if activeFetch}
      <div tabindex=-1 class="dropdown-item text-muted">
        {i18n.fetching}
      </div>
    {/if}

    {#if !activeFetch && entries.length === 0 }
      <div tabindex=-1 class="dropdown-item text-muted">
        {i18n.no_results}
      </div>
    {/if}

    {#if !activeFetch && entries.length > 0 }
      {#each entries as item}
        <div tabindex=1 class="js-item dropdown-item"  data-index="{item.index}"
             on:blur={handleBlur}
             on:click={handleItemClick}
             on:keydown={handleItemKeydown}
             on:keyup={handleItemKeyup}>
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
