<script>
 import {onMount} from 'svelte';

 export let real;
 export let fetcher;

 export let results = [];
 export let value = '';

 export let popupVisible = false;

 let previousValue = '';

 export let currentFetch = null;

 function onSelectItem() {
     counter = counter + 1;
 }

 onMount(function() {
     value = real.value;
     real.classList.add('d-none');
     filterResults();
 });

 function reindexResults(results) {
     let index = 0;
     results.forEach(function(item) {
         item.index = index;
         index = index + 1;
     });
 }

 function filterResults() {
     if (value === previousValue) {
         return;
     }
     console.log("filter: " + value);

     let searchValue = value;
     let fetch = fetcher(searchValue).then(function(entries) {
         if (fetch === currentFetch) {
             console.log("APPLY fetch: " + searchValue);
             reindexResults(entries);
             results = entries;
             previousValue = searchValue;
             popupVisible = results.length > 0;
             currentFetch = null;
         } else {
             console.log("CANCEL fetch: " + searchValue);
         }
     }).catch(function(err) {
         if (fetch === currentFetch) {
             currentFetch = null;
         }
     });
     currentFetch = fetch;
 }

 function handleKeyup(event) {
     filterResults();
 }

 let inputKeydownHandlers = {
     base: function(event) {
     },
     ArrowDown: function(event) {
         let item = getPopup(event).querySelector('.js-item:first-child');
         if (item) {
             item.focus();
         }
     },
     ArrowUp: function(event) {
         let item = getPopup(event).querySelector('.js-item:last-child');
         if (item) {
             item.focus();
         }
     },
     Tab: function(event) {
         popupVisible = false;
         currentFetch = null;
     }
 };

 function handleInputKeydown(event) {
     let handler = inputKeydownHandlers[event.code] || inputKeydownHandlers.base;
     handler(event);
 }

 let itemKeydownHandlers = {
     base: function(event) {
     },
     ArrowDown: function(event) {
         let next = event.target.nextElementSibling;
         if (next) {
             next.focus();
         } else {
             getInput(event).focus();
         }
     },
     ArrowUp: function(event) {
         let next = event.target.previousElementSibling;
         if (next) {
             next.focus();
         } else {
             getInput(event).focus();
         }
     },
     Tab: function(event) {
         popupVisible = false;
         currentFetch = null;
         getInput(event).focus();
     },
     Enter: function(event) {
         let item = results[event.target.dataset.index];
         previousValue = item.text;
         value = previousValue;
         popupVisible = false;
         getInput(event).focus();
     },
 };

 function handleItemKeydown(event) {
     let handler = itemKeydownHandlers[event.code] || itemKeydownHandlers.base;
     handler(event);
 }

 function handleTogglePopup() {
     popupVisible = !popupVisible && results.length > 0;
 }

 function getInput(event) {
     var container = event.target.closest('.js-typeahead-container');
     return container.querySelector('.js-input');
 }

 function getPopup(event) {
     var container = event.target.closest('.js-typeahead-container');
     return container.querySelector('.js-popup');
 }

 $: real.setAttribute('value', value);
</script>

<style>
.typeahead {
    position: relative;
}
</style>

<div class="input-group mb-3 typeahead js-typeahead-container">
  <input class="js-input {real.getAttribute('class')}"
         data-target="{real.id}"
         placeholder="{real.placeholder}"
         bind:value
         on:keydown={handleInputKeydown}
         on:keyup={handleKeyup}
         on:click={handleTogglePopup}>
  <div class="input-group-append">
    <span class="input-group-text"><i class="fas fa-clock"></i></span>
  </div>

  <div class="js-popup dropdown-menu {popupVisible ? 'show' : ''}">
    {#if currentFetch}
      <div tabindex=-1 class="dropdown-item">
        Searching...
      </div>
    {/if}

    {#if !currentFetch}
      {#each results as item}
        <div tabindex=1 class="js-item dropdown-item"  data-index="{item.index}" on:keydown={handleItemKeydown}>
          {item.text}
          <div class="text-muted">
            {item.desc}
          </div>
        </div>
      {/each}
    {/if}
  </div>
</div>

{value}

<!--
<div class="eco-w-search-quicksearch">
  <input class=" w-100 form-control eco-js-search-field"
         placeholder="Quick search"
         data-eco-target="main"
         data-eco-autofocus="true"
         autocomplete="new-password"
         autocorrect="off"
         autocapitalize="off"
         spellcheck="false"
         type="text"
         value="100"
         name="run_status[sf_quicksearch]"
         id="run_status_sf_quicksearch">
</div>
-->
