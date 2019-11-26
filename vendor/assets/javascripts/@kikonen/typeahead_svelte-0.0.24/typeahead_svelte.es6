function noop() { }
function run(fn) {
    return fn();
}
function blank_object() {
    return Object.create(null);
}
function run_all(fns) {
    fns.forEach(run);
}
function is_function(thing) {
    return typeof thing === 'function';
}
function safe_not_equal(a, b) {
    return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
}

function append(target, node) {
    target.appendChild(node);
}
function insert(target, node, anchor) {
    target.insertBefore(node, anchor || null);
}
function detach(node) {
    node.parentNode.removeChild(node);
}
function destroy_each(iterations, detaching) {
    for (let i = 0; i < iterations.length; i += 1) {
        if (iterations[i])
            iterations[i].d(detaching);
    }
}
function element(name) {
    return document.createElement(name);
}
function text(data) {
    return document.createTextNode(data);
}
function space() {
    return text(' ');
}
function empty() {
    return text('');
}
function listen(node, event, handler, options) {
    node.addEventListener(event, handler, options);
    return () => node.removeEventListener(event, handler, options);
}
function attr(node, attribute, value) {
    if (value == null)
        node.removeAttribute(attribute);
    else if (node.getAttribute(attribute) !== value)
        node.setAttribute(attribute, value);
}
function children(element) {
    return Array.from(element.childNodes);
}
function set_data(text, data) {
    data = '' + data;
    if (text.data !== data)
        text.data = data;
}
function set_input_value(input, value) {
    if (value != null || input.value) {
        input.value = value;
    }
}

let current_component;
function set_current_component(component) {
    current_component = component;
}
function get_current_component() {
    if (!current_component)
        throw new Error(`Function called outside component initialization`);
    return current_component;
}
function onMount(fn) {
    get_current_component().$$.on_mount.push(fn);
}

const dirty_components = [];
const binding_callbacks = [];
const render_callbacks = [];
const flush_callbacks = [];
const resolved_promise = Promise.resolve();
let update_scheduled = false;
function schedule_update() {
    if (!update_scheduled) {
        update_scheduled = true;
        resolved_promise.then(flush);
    }
}
function add_render_callback(fn) {
    render_callbacks.push(fn);
}
function flush() {
    const seen_callbacks = new Set();
    do {
        // first, call beforeUpdate functions
        // and update components
        while (dirty_components.length) {
            const component = dirty_components.shift();
            set_current_component(component);
            update(component.$$);
        }
        while (binding_callbacks.length)
            binding_callbacks.pop()();
        // then, once components are updated, call
        // afterUpdate functions. This may cause
        // subsequent updates...
        for (let i = 0; i < render_callbacks.length; i += 1) {
            const callback = render_callbacks[i];
            if (!seen_callbacks.has(callback)) {
                callback();
                // ...so guard against infinite loops
                seen_callbacks.add(callback);
            }
        }
        render_callbacks.length = 0;
    } while (dirty_components.length);
    while (flush_callbacks.length) {
        flush_callbacks.pop()();
    }
    update_scheduled = false;
}
function update($$) {
    if ($$.fragment !== null) {
        $$.update($$.dirty);
        run_all($$.before_update);
        $$.fragment && $$.fragment.p($$.dirty, $$.ctx);
        $$.dirty = null;
        $$.after_update.forEach(add_render_callback);
    }
}
const outroing = new Set();
function transition_in(block, local) {
    if (block && block.i) {
        outroing.delete(block);
        block.i(local);
    }
}

const globals = (typeof window !== 'undefined' ? window : global);
function mount_component(component, target, anchor) {
    const { fragment, on_mount, on_destroy, after_update } = component.$$;
    fragment && fragment.m(target, anchor);
    // onMount happens before the initial afterUpdate
    add_render_callback(() => {
        const new_on_destroy = on_mount.map(run).filter(is_function);
        if (on_destroy) {
            on_destroy.push(...new_on_destroy);
        }
        else {
            // Edge case - component was destroyed immediately,
            // most likely as a result of a binding initialising
            run_all(new_on_destroy);
        }
        component.$$.on_mount = [];
    });
    after_update.forEach(add_render_callback);
}
function destroy_component(component, detaching) {
    const $$ = component.$$;
    if ($$.fragment !== null) {
        run_all($$.on_destroy);
        $$.fragment && $$.fragment.d(detaching);
        // TODO null out other refs, including component.$$ (but need to
        // preserve final state?)
        $$.on_destroy = $$.fragment = null;
        $$.ctx = {};
    }
}
function make_dirty(component, key) {
    if (!component.$$.dirty) {
        dirty_components.push(component);
        schedule_update();
        component.$$.dirty = blank_object();
    }
    component.$$.dirty[key] = true;
}
function init(component, options, instance, create_fragment, not_equal, props) {
    const parent_component = current_component;
    set_current_component(component);
    const prop_values = options.props || {};
    const $$ = component.$$ = {
        fragment: null,
        ctx: null,
        // state
        props,
        update: noop,
        not_equal,
        bound: blank_object(),
        // lifecycle
        on_mount: [],
        on_destroy: [],
        before_update: [],
        after_update: [],
        context: new Map(parent_component ? parent_component.$$.context : []),
        // everything else
        callbacks: blank_object(),
        dirty: null
    };
    let ready = false;
    $$.ctx = instance
        ? instance(component, prop_values, (key, ret, value = ret) => {
            if ($$.ctx && not_equal($$.ctx[key], $$.ctx[key] = value)) {
                if ($$.bound[key])
                    $$.bound[key](value);
                if (ready)
                    make_dirty(component, key);
            }
            return ret;
        })
        : prop_values;
    $$.update();
    ready = true;
    run_all($$.before_update);
    // `false` as a special case of no DOM component
    $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
    if (options.target) {
        if (options.hydrate) {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            $$.fragment && $$.fragment.l(children(options.target));
        }
        else {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            $$.fragment && $$.fragment.c();
        }
        if (options.intro)
            transition_in(component.$$.fragment);
        mount_component(component, options.target, options.anchor);
        flush();
    }
    set_current_component(parent_component);
}
class SvelteComponent {
    $destroy() {
        destroy_component(this, 1);
        this.$destroy = noop;
    }
    $on(type, callback) {
        const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
        callbacks.push(callback);
        return () => {
            const index = callbacks.indexOf(callback);
            if (index !== -1)
                callbacks.splice(index, 1);
        };
    }
    $set() {
        // overridden by instance, if it has props
    }
}

/* src/typeahead.svelte generated by Svelte v3.15.0 */

const { document: document_1 } = globals;

function add_css() {
	var style = element("style");
	style.id = "svelte-2ap05h-style";
	style.textContent = ".typeahead.svelte-2ap05h{position:relative}.typeahead-popup.svelte-2ap05h{max-height:15rem;max-width:90vw;overflow-y:auto}.no-click.svelte-2ap05h{pointer-events:none}";
	append(document_1.head, style);
}

function get_each_context(ctx, list, i) {
	const child_ctx = Object.create(ctx);
	child_ctx.item = list[i];
	child_ctx.index = i;
	return child_ctx;
}

// (557:8) {#if entries.length === 0 }
function create_if_block_9(ctx) {
	let div;

	function select_block_type_1(changed, ctx) {
		if (ctx.tooShort) return create_if_block_10;
		return create_else_block_1;
	}

	let current_block_type = select_block_type_1(null, ctx);
	let if_block = current_block_type(ctx);

	return {
		c() {
			div = element("div");
			if_block.c();
			attr(div, "tabindex", "-1");
			attr(div, "class", "dropdown-item text-muted");
		},
		m(target, anchor) {
			insert(target, div, anchor);
			if_block.m(div, null);
		},
		p(changed, ctx) {
			if (current_block_type === (current_block_type = select_block_type_1(changed, ctx)) && if_block) {
				if_block.p(changed, ctx);
			} else {
				if_block.d(1);
				if_block = current_block_type(ctx);

				if (if_block) {
					if_block.c();
					if_block.m(div, null);
				}
			}
		},
		d(detaching) {
			if (detaching) detach(div);
			if_block.d();
		}
	};
}

// (550:6) {#if activeFetch }
function create_if_block_7(ctx) {
	let if_block_anchor;
	let if_block = !ctx.fetchingMore && create_if_block_8(ctx);

	return {
		c() {
			if (if_block) if_block.c();
			if_block_anchor = empty();
		},
		m(target, anchor) {
			if (if_block) if_block.m(target, anchor);
			insert(target, if_block_anchor, anchor);
		},
		p(changed, ctx) {
			if (!ctx.fetchingMore) {
				if (if_block) {
					if_block.p(changed, ctx);
				} else {
					if_block = create_if_block_8(ctx);
					if_block.c();
					if_block.m(if_block_anchor.parentNode, if_block_anchor);
				}
			} else if (if_block) {
				if_block.d(1);
				if_block = null;
			}
		},
		d(detaching) {
			if (if_block) if_block.d(detaching);
			if (detaching) detach(if_block_anchor);
		}
	};
}

// (545:4) {#if fetchError }
function create_if_block_6(ctx) {
	let div;
	let t;

	return {
		c() {
			div = element("div");
			t = text(ctx.fetchError);
			attr(div, "tabindex", "-1");
			attr(div, "class", "dropdown-item text-danger");
		},
		m(target, anchor) {
			insert(target, div, anchor);
			append(div, t);
		},
		p(changed, ctx) {
			if (changed.fetchError) set_data(t, ctx.fetchError);
		},
		d(detaching) {
			if (detaching) detach(div);
		}
	};
}

// (561:12) {:else}
function create_else_block_1(ctx) {
	let t_value = ctx.translate("no_results") + "";
	let t;

	return {
		c() {
			t = text(t_value);
		},
		m(target, anchor) {
			insert(target, t, anchor);
		},
		p: noop,
		d(detaching) {
			if (detaching) detach(t);
		}
	};
}

// (559:12) {#if tooShort }
function create_if_block_10(ctx) {
	let t_value = ctx.translate("too_short") + "";
	let t;

	return {
		c() {
			t = text(t_value);
		},
		m(target, anchor) {
			insert(target, t, anchor);
		},
		p: noop,
		d(detaching) {
			if (detaching) detach(t);
		}
	};
}

// (551:8) {#if !fetchingMore }
function create_if_block_8(ctx) {
	let div;

	return {
		c() {
			div = element("div");
			div.textContent = `${ctx.translate("fetching")}`;
			attr(div, "tabindex", "-1");
			attr(div, "class", "dropdown-item text-muted");
		},
		m(target, anchor) {
			insert(target, div, anchor);
		},
		p: noop,
		d(detaching) {
			if (detaching) detach(div);
		}
	};
}

// (569:4) {#if (!activeFetch  || fetchingMore) && entries.length > 0 }
function create_if_block_1(ctx) {
	let each_1_anchor;
	let each_value = ctx.entries;
	let each_blocks = [];

	for (let i = 0; i < each_value.length; i += 1) {
		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
	}

	return {
		c() {
			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			each_1_anchor = empty();
		},
		m(target, anchor) {
			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].m(target, anchor);
			}

			insert(target, each_1_anchor, anchor);
		},
		p(changed, ctx) {
			if (changed.entries || changed.handleBlur || changed.handleItemClick || changed.handleItemKeydown || changed.handleItemKeyup) {
				each_value = ctx.entries;
				let i;

				for (i = 0; i < each_value.length; i += 1) {
					const child_ctx = get_each_context(ctx, each_value, i);

					if (each_blocks[i]) {
						each_blocks[i].p(changed, child_ctx);
					} else {
						each_blocks[i] = create_each_block(child_ctx);
						each_blocks[i].c();
						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
					}
				}

				for (; i < each_blocks.length; i += 1) {
					each_blocks[i].d(1);
				}

				each_blocks.length = each_value.length;
			}
		},
		d(detaching) {
			destroy_each(each_blocks, detaching);
			if (detaching) detach(each_1_anchor);
		}
	};
}

// (584:8) {:else}
function create_else_block(ctx) {
	let div1;
	let div0;
	let t0_value = (ctx.item.display_text || ctx.item.text) + "";
	let t0;
	let t1;
	let t2;
	let div1_data_index_value;
	let dispose;
	let if_block = ctx.item.desc && create_if_block_5(ctx);

	return {
		c() {
			div1 = element("div");
			div0 = element("div");
			t0 = text(t0_value);
			t1 = space();
			if (if_block) if_block.c();
			t2 = space();
			attr(div0, "class", "no-click svelte-2ap05h");
			attr(div1, "tabindex", "1");
			attr(div1, "class", "js-item dropdown-item");
			attr(div1, "data-index", div1_data_index_value = ctx.index);

			dispose = [
				listen(div1, "blur", ctx.handleBlur),
				listen(div1, "click", ctx.handleItemClick),
				listen(div1, "keydown", ctx.handleItemKeydown),
				listen(div1, "keyup", ctx.handleItemKeyup)
			];
		},
		m(target, anchor) {
			insert(target, div1, anchor);
			append(div1, div0);
			append(div0, t0);
			append(div1, t1);
			if (if_block) if_block.m(div1, null);
			append(div1, t2);
		},
		p(changed, ctx) {
			if (changed.entries && t0_value !== (t0_value = (ctx.item.display_text || ctx.item.text) + "")) set_data(t0, t0_value);

			if (ctx.item.desc) {
				if (if_block) {
					if_block.p(changed, ctx);
				} else {
					if_block = create_if_block_5(ctx);
					if_block.c();
					if_block.m(div1, t2);
				}
			} else if (if_block) {
				if_block.d(1);
				if_block = null;
			}
		},
		d(detaching) {
			if (detaching) detach(div1);
			if (if_block) if_block.d();
			run_all(dispose);
		}
	};
}

// (573:32) 
function create_if_block_3(ctx) {
	let div1;
	let div0;
	let t0_value = (ctx.item.display_text || ctx.item.text) + "";
	let t0;
	let t1;
	let t2;
	let if_block = ctx.item.desc && create_if_block_4(ctx);

	return {
		c() {
			div1 = element("div");
			div0 = element("div");
			t0 = text(t0_value);
			t1 = space();
			if (if_block) if_block.c();
			t2 = space();
			attr(div0, "class", "no-click svelte-2ap05h");
			attr(div1, "tabindex", "-1");
			attr(div1, "class", "dropdown-item text-muted js-blank");
		},
		m(target, anchor) {
			insert(target, div1, anchor);
			append(div1, div0);
			append(div0, t0);
			append(div1, t1);
			if (if_block) if_block.m(div1, null);
			append(div1, t2);
		},
		p(changed, ctx) {
			if (changed.entries && t0_value !== (t0_value = (ctx.item.display_text || ctx.item.text) + "")) set_data(t0, t0_value);

			if (ctx.item.desc) {
				if (if_block) {
					if_block.p(changed, ctx);
				} else {
					if_block = create_if_block_4(ctx);
					if_block.c();
					if_block.m(div1, t2);
				}
			} else if (if_block) {
				if_block.d(1);
				if_block = null;
			}
		},
		d(detaching) {
			if (detaching) detach(div1);
			if (if_block) if_block.d();
		}
	};
}

// (571:8) {#if item.separator}
function create_if_block_2(ctx) {
	let div;
	let div_data_index_value;

	return {
		c() {
			div = element("div");
			attr(div, "tabindex", "-1");
			attr(div, "class", "dropdown-divider js-blank");
			attr(div, "data-index", div_data_index_value = ctx.index);
		},
		m(target, anchor) {
			insert(target, div, anchor);
		},
		p: noop,
		d(detaching) {
			if (detaching) detach(div);
		}
	};
}

// (594:12) {#if item.desc}
function create_if_block_5(ctx) {
	let div;
	let t_value = ctx.item.desc + "";
	let t;

	return {
		c() {
			div = element("div");
			t = text(t_value);
			attr(div, "class", "no-click text-muted svelte-2ap05h");
		},
		m(target, anchor) {
			insert(target, div, anchor);
			append(div, t);
		},
		p(changed, ctx) {
			if (changed.entries && t_value !== (t_value = ctx.item.desc + "")) set_data(t, t_value);
		},
		d(detaching) {
			if (detaching) detach(div);
		}
	};
}

// (578:12) {#if item.desc}
function create_if_block_4(ctx) {
	let div;
	let t_value = ctx.item.desc + "";
	let t;

	return {
		c() {
			div = element("div");
			t = text(t_value);
			attr(div, "class", "no-click text-muted svelte-2ap05h");
		},
		m(target, anchor) {
			insert(target, div, anchor);
			append(div, t);
		},
		p(changed, ctx) {
			if (changed.entries && t_value !== (t_value = ctx.item.desc + "")) set_data(t, t_value);
		},
		d(detaching) {
			if (detaching) detach(div);
		}
	};
}

// (570:6) {#each entries as item, index}
function create_each_block(ctx) {
	let if_block_anchor;

	function select_block_type_2(changed, ctx) {
		if (ctx.item.separator) return create_if_block_2;
		if (ctx.item.disabled) return create_if_block_3;
		return create_else_block;
	}

	let current_block_type = select_block_type_2(null, ctx);
	let if_block = current_block_type(ctx);

	return {
		c() {
			if_block.c();
			if_block_anchor = empty();
		},
		m(target, anchor) {
			if_block.m(target, anchor);
			insert(target, if_block_anchor, anchor);
		},
		p(changed, ctx) {
			if (current_block_type === (current_block_type = select_block_type_2(changed, ctx)) && if_block) {
				if_block.p(changed, ctx);
			} else {
				if_block.d(1);
				if_block = current_block_type(ctx);

				if (if_block) {
					if_block.c();
					if_block.m(if_block_anchor.parentNode, if_block_anchor);
				}
			}
		},
		d(detaching) {
			if_block.d(detaching);
			if (detaching) detach(if_block_anchor);
		}
	};
}

// (604:4) {#if hasMore}
function create_if_block(ctx) {
	let div;

	return {
		c() {
			div = element("div");
			div.textContent = `${ctx.translate("has_more")}`;
			attr(div, "tabindex", "-1");
			attr(div, "class", "js-more dropdown-item text-muted");
		},
		m(target, anchor) {
			insert(target, div, anchor);
			ctx.div_binding(div);
		},
		p: noop,
		d(detaching) {
			if (detaching) detach(div);
			ctx.div_binding(null);
		}
	};
}

function create_fragment(ctx) {
	let div2;
	let input_1;
	let input_1_class_value;
	let input_1_data_target_value;
	let input_1_placeholder_value;
	let t0;
	let div0;
	let button;
	let t1;
	let div1;
	let t2;
	let t3;
	let div1_class_value;
	let dispose;

	function select_block_type(changed, ctx) {
		if (ctx.fetchError) return create_if_block_6;
		if (ctx.activeFetch) return create_if_block_7;
		if (ctx.entries.length === 0) return create_if_block_9;
	}

	let current_block_type = select_block_type(null, ctx);
	let if_block0 = current_block_type && current_block_type(ctx);
	let if_block1 = (!ctx.activeFetch || ctx.fetchingMore) && ctx.entries.length > 0 && create_if_block_1(ctx);
	let if_block2 = ctx.hasMore && create_if_block(ctx);

	return {
		c() {
			div2 = element("div");
			input_1 = element("input");
			t0 = space();
			div0 = element("div");
			button = element("button");
			button.innerHTML = `<i class="text-dark fas fa-caret-down"></i>`;
			t1 = space();
			div1 = element("div");
			if (if_block0) if_block0.c();
			t2 = space();
			if (if_block1) if_block1.c();
			t3 = space();
			if (if_block2) if_block2.c();
			attr(input_1, "class", input_1_class_value = "js-input " + ctx.real.getAttribute("class") + " svelte-2ap05h");
			attr(input_1, "autocorrect", "off");
			attr(input_1, "autocapitalize", "off");
			attr(input_1, "spellcheck", "off");
			attr(input_1, "data-target", input_1_data_target_value = ctx.real.id);
			attr(input_1, "placeholder", input_1_placeholder_value = ctx.real.placeholder);
			attr(input_1, "autocomplete", "new-password");
			attr(button, "class", "btn btn-outline-secondary");
			attr(button, "type", "button");
			attr(button, "tabindex", "-1");
			attr(div0, "class", "input-group-append");
			attr(div1, "class", div1_class_value = "js-popup dropdown-menu typeahead-popup " + (ctx.popupVisible ? "show" : "") + " svelte-2ap05h");
			attr(div2, "class", "input-group typeahead js-typeahead-container svelte-2ap05h");

			dispose = [
				listen(input_1, "input", ctx.input_1_input_handler),
				listen(input_1, "click", handleInputClick),
				listen(input_1, "keyup", ctx.handleInputKeyup),
				listen(input_1, "blur", ctx.handleBlur),
				listen(input_1, "keypress", ctx.handleInputKeypress),
				listen(input_1, "keydown", ctx.handleInputKeydown),
				listen(button, "blur", ctx.handleBlur),
				listen(button, "keydown", ctx.handleToggleKeydown),
				listen(button, "click", ctx.handleToggleClick),
				listen(div1, "scroll", ctx.handlePopupScroll)
			];
		},
		m(target, anchor) {
			insert(target, div2, anchor);
			append(div2, input_1);
			set_input_value(input_1, ctx.query);
			ctx.input_1_binding(input_1);
			append(div2, t0);
			append(div2, div0);
			append(div0, button);
			ctx.button_binding(button);
			append(div2, t1);
			append(div2, div1);
			if (if_block0) if_block0.m(div1, null);
			append(div1, t2);
			if (if_block1) if_block1.m(div1, null);
			append(div1, t3);
			if (if_block2) if_block2.m(div1, null);
			ctx.div1_binding(div1);
		},
		p(changed, ctx) {
			if (changed.real && input_1_class_value !== (input_1_class_value = "js-input " + ctx.real.getAttribute("class") + " svelte-2ap05h")) {
				attr(input_1, "class", input_1_class_value);
			}

			if (changed.real && input_1_data_target_value !== (input_1_data_target_value = ctx.real.id)) {
				attr(input_1, "data-target", input_1_data_target_value);
			}

			if (changed.real && input_1_placeholder_value !== (input_1_placeholder_value = ctx.real.placeholder)) {
				attr(input_1, "placeholder", input_1_placeholder_value);
			}

			if (changed.query && input_1.value !== ctx.query) {
				set_input_value(input_1, ctx.query);
			}

			if (current_block_type === (current_block_type = select_block_type(changed, ctx)) && if_block0) {
				if_block0.p(changed, ctx);
			} else {
				if (if_block0) if_block0.d(1);
				if_block0 = current_block_type && current_block_type(ctx);

				if (if_block0) {
					if_block0.c();
					if_block0.m(div1, t2);
				}
			}

			if ((!ctx.activeFetch || ctx.fetchingMore) && ctx.entries.length > 0) {
				if (if_block1) {
					if_block1.p(changed, ctx);
				} else {
					if_block1 = create_if_block_1(ctx);
					if_block1.c();
					if_block1.m(div1, t3);
				}
			} else if (if_block1) {
				if_block1.d(1);
				if_block1 = null;
			}

			if (ctx.hasMore) {
				if (if_block2) {
					if_block2.p(changed, ctx);
				} else {
					if_block2 = create_if_block(ctx);
					if_block2.c();
					if_block2.m(div1, null);
				}
			} else if (if_block2) {
				if_block2.d(1);
				if_block2 = null;
			}

			if (changed.popupVisible && div1_class_value !== (div1_class_value = "js-popup dropdown-menu typeahead-popup " + (ctx.popupVisible ? "show" : "") + " svelte-2ap05h")) {
				attr(div1, "class", div1_class_value);
			}
		},
		i: noop,
		o: noop,
		d(detaching) {
			if (detaching) detach(div2);
			ctx.input_1_binding(null);
			ctx.button_binding(null);

			if (if_block0) {
				if_block0.d();
			}

			if (if_block1) if_block1.d();
			if (if_block2) if_block2.d();
			ctx.div1_binding(null);
			run_all(dispose);
		}
	};
}

function hasModifier(event) {
	return event.altKey || event.ctrlKey || event.metaKey || event.shiftKey;
}

function nop() {
	
}

function handleEvent(code, handlers, event) {
	let handler = handlers[code] || handlers.base;
	handler(event);
}

function handleInputClick(event) {
	
}

function instance($$self, $$props, $$invalidate) {
	const I18N_DEFAULTS = {
		fetching: "Searching..",
		no_results: "No results",
		too_short: "Too short",
		has_more: "More...",
		fetching_more: "Searching more..."
	};

	let { real } = $$props;
	let { fetcher } = $$props;
	let { queryMinLen = 1 } = $$props;

	let { onSelected = function () {
		
	} } = $$props;

	let { translations = I18N_DEFAULTS } = $$props;
	let { query } = $$props;
	let { delay = 250 } = $$props;
	let entries = [];
	let hasMore = false;
	let tooShort = false;
	let fetchingMore = false;
	let fetchError = null;
	let popupVisible = false;
	let activeFetch = null;
	let input;
	let toggle;
	let popup;
	let more;
	let previousQuery = null;
	let wasDown = false;

	function fetchEntries(more) {
		let currentQuery = query.trim();

		if (currentQuery.length > 0) {
			currentQuery = query;
		}

		if (!more && !fetchingMore && currentQuery === previousQuery) {
			return;
		}

		cancelFetch();
		let fetchOffset = 0;

		if (more) {
			fetchOffset = fetchOffset + entries.length;
			$$invalidate("fetchingMore", fetchingMore = true);
		} else {
			$$invalidate("entries", entries = []);
			$$invalidate("hasMore", hasMore = false);
			$$invalidate("fetchingMore", fetchingMore = false);
		}

		$$invalidate("fetchError", fetchError = null);
		let currentFetchOffset = fetchOffset;
		let currentFetchingMore = fetchingMore;

		let currentFetch = new Promise(function (resolve, reject) {
				if (currentFetchingMore) {
					resolve(fetcher(currentFetchOffset, currentQuery));
				} else {
					if (currentQuery.length < queryMinLen) {
						resolve({
							entries: [],
							info: { more: false, too_short: true }
						});
					} else {
						setTimeout(
							function () {
								if (currentFetch === activeFetch) {
									resolve(fetcher(currentFetchOffset, currentQuery));
								} else {
									reject("cancel");
								}
							},
							delay
						);
					}
				}
			}).then(function (response) {
			if (currentFetch === activeFetch) {
				let newEntries = response.entries || [];
				let info = response.info || ({});
				let updateEntries;

				if (currentFetchingMore) {
					updateEntries = entries;

					newEntries.forEach(function (item) {
						updateEntries.push(item);
					});
				} else {
					updateEntries = newEntries;
				}

				$$invalidate("entries", entries = updateEntries);
				$$invalidate("hasMore", hasMore = info.more && entries.length > 0);
				$$invalidate("tooShort", tooShort = info.too_short);
				previousQuery = currentQuery;
				$$invalidate("activeFetch", activeFetch = null);
				$$invalidate("fetchingMore", fetchingMore = false);
			}
		}).catch(function (err) {
			if (currentFetch === activeFetch) {
				console.error(err);
				$$invalidate("fetchError", fetchError = err);
				$$invalidate("entries", entries = []);
				$$invalidate("hasMore", hasMore = false);
				$$invalidate("tooShort", tooShort = false);
				previousQuery = null;
				$$invalidate("activeFetch", activeFetch = null);
				$$invalidate("fetchingMore", fetchingMore = false);
				input.focus();
				openPopup();
			}
		});

		$$invalidate("activeFetch", activeFetch = currentFetch);
	}

	function cancelFetch() {
		if (activeFetch !== null) {
			$$invalidate("activeFetch", activeFetch = null);
			previousQuery = null;
		}
	}

	function fetchMoreIfneeded() {
		if (hasMore && !fetchingMore) {
			if (popup.scrollTop + popup.clientHeight >= popup.scrollHeight - more.clientHeight * 2 - 2) {
				fetchEntries(true);
			}
		}
	}

	function closePopup(focusInput) {
		$$invalidate("popupVisible", popupVisible = false);

		if (focusInput) {
			input.focus();
		}
	}

	function openPopup() {
		if (!popupVisible) {
			$$invalidate("popupVisible", popupVisible = true);
			let w = input.parentElement.offsetWidth;
			$$invalidate("popup", popup.style.minWidth = w + "px", popup);
		}
	}

	function selectItem(el) {
		let item = entries[el.dataset.index];

		if (item) {
			let changed = item.text !== query;
			$$invalidate("query", query = item.text);
			previousQuery = query.trim();

			if (previousQuery.length > 0) {
				previousQuery = query;
			}

			closePopup(true);

			if (changed) {
				previousQuery = null;
			}

			real.setAttribute("value", query);
			onSelected(item);
		}
	}

	function containsElement(el) {
		return el === input || el === toggle || popup.contains(el);
	}

	function translate(key) {
		return translations[key] || I18N_DEFAULTS[key];
	}

	onMount(function () {
		$$invalidate("query", query = real.getAttribute("value") || "");
		real.classList.add("d-none");

		real.addEventListener("change", function () {
			var realValue = real.getAttribute("value");

			if (realValue !== query) {
				$$invalidate("query", query = realValue);
			}
		});
	});

	

	let inputKeypressHandlers = {
		base(event) {
		}
	};

	let inputKeydownHandlers = {
		base(event) {
			wasDown = true;
		},
		ArrowDown(event) {
			let item = popupVisible
			? popup.querySelectorAll(".js-item")[0]
			: null;

			if (item) {
				while (item && item.classList.contains("js-blank")) {
					item = item.nextElementSibling;
				}

				item.focus();
			} else {
				openPopup();
				fetchEntries();
			}

			event.preventDefault();
		},
		ArrowUp(event) {
			event.preventDefault();
		},
		Escape(event) {
			cancelFetch();
			closePopup(false);
		},
		Tab: nop
	};

	let inputKeyupHandlers = {
		base(event) {
			if (wasDown) {
				openPopup();
				fetchEntries();
			}
		},
		Enter: nop,
		Escape: nop,
		Tab: nop,
		ArrowDown: nop,
		ArrowUp: nop,
		ArrowLeft: nop,
		ArrowRight: nop,
		PageDown: nop,
		PageUp: nop,
		Home: nop,
		End: nop,
		Control: nop,
		Shift: nop,
		AltGraph: nop,
		Meta: nop,
		ContextMenu: nop
	};

	let toggleKeydownHandlers = {
		base(event) {
			input.focus();
		},
		ArrowDown: inputKeydownHandlers.ArrowDown,
		ArrowUp: inputKeydownHandlers.ArrowDown,
		Escape(event) {
			cancelFetch();
			closePopup(false);
			input.focus();
		},
		Tab(event) {
			input.focus();
		}
	};

	let itemKeydownHandlers = {
		base(event) {
			input.focus();
		},
		ArrowDown(event) {
			let next = event.target.nextElementSibling;

			if (next) {
				while (next && next.classList.contains("js-blank")) {
					next = next.nextElementSibling;
				}

				if (next && !next.classList.contains("js-item")) {
					next = null;
				}
			}

			if (next) {
				next.focus();
			}

			event.preventDefault();
		},
		ArrowUp(event) {
			let next = event.target.previousElementSibling;

			if (next) {
				while (next && next.classList.contains("js-blank")) {
					next = next.previousElementSibling;
				}

				if (next && !next.classList.contains("js-item")) {
					next = null;
				}
			}

			if (next) {
				next.focus();
			} else {
				input.focus();
			}

			event.preventDefault();
		},
		Enter(event) {
			selectItem(event.target);
			event.preventDefault();
		},
		Escape(event) {
			cancelFetch();
			closePopup(true);
		},
		PageUp: nop,
		PageDown: nop,
		Home: nop,
		End: nop,
		Control: nop,
		Shift: nop,
		AltGraph: nop,
		Meta: nop,
		ContextMenu: nop
	};

	let itemKeyupHandlers = {
		base: nop,
		PageUp(event) {
			let scrollLeft = document.body.scrollLeft;
			let scrollTop = document.body.scrollTop;
			let rect = popup.getBoundingClientRect();
			let item = document.elementFromPoint(scrollLeft + rect.x + 10, scrollTop + rect.top + 1);

			if (!item) {
				item = popup.querySelector(".js-item:first-child");
			} else {
				if (!item.classList.contains("js-item")) {
					item = popup.querySelector(".js-item:first-child");
				}
			}

			if (item) {
				item.focus();
			}

			event.preventDefault();
		},
		PageDown(event) {
			let scrollLeft = document.body.scrollLeft;
			let scrollTop = document.body.scrollTop;
			let h = popup.offsetHeight;
			let rect = popup.getBoundingClientRect();
			let item = document.elementFromPoint(scrollLeft + rect.x + 10, scrollTop + rect.top + h - 10);

			if (!item) {
				item = popup.querySelector(".js-item:last-child");
			} else {
				if (!item.classList.contains("js-item")) {
					item = popup.querySelector(".js-item:last-child");
				}
			}

			if (item) {
				item.focus();
			}

			event.preventDefault();
		},
		Home(event) {
			let item = popup.querySelector(".js-item:first-child");

			if (item) {
				item.focus();
			}

			event.preventDefault();
		},
		End(event) {
			let item = popup.querySelector(".js-item:last-child");

			if (item) {
				item.focus();
			}

			event.preventDefault();
		}
	};

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
			selectItem(event.target);
		}
	}

	function handlePopupScroll(event) {
		fetchMoreIfneeded();
	}

	function input_1_input_handler() {
		query = this.value;
		$$invalidate("query", query);
	}

	function input_1_binding($$value) {
		binding_callbacks[$$value ? "unshift" : "push"](() => {
			$$invalidate("input", input = $$value);
		});
	}

	function button_binding($$value) {
		binding_callbacks[$$value ? "unshift" : "push"](() => {
			$$invalidate("toggle", toggle = $$value);
		});
	}

	function div_binding($$value) {
		binding_callbacks[$$value ? "unshift" : "push"](() => {
			$$invalidate("more", more = $$value);
		});
	}

	function div1_binding($$value) {
		binding_callbacks[$$value ? "unshift" : "push"](() => {
			$$invalidate("popup", popup = $$value);
		});
	}

	$$self.$set = $$props => {
		if ("real" in $$props) $$invalidate("real", real = $$props.real);
		if ("fetcher" in $$props) $$invalidate("fetcher", fetcher = $$props.fetcher);
		if ("queryMinLen" in $$props) $$invalidate("queryMinLen", queryMinLen = $$props.queryMinLen);
		if ("onSelected" in $$props) $$invalidate("onSelected", onSelected = $$props.onSelected);
		if ("translations" in $$props) $$invalidate("translations", translations = $$props.translations);
		if ("query" in $$props) $$invalidate("query", query = $$props.query);
		if ("delay" in $$props) $$invalidate("delay", delay = $$props.delay);
	};

	$$self.$$.update = (changed = { real: 1, query: 1 }) => {
		if (changed.real || changed.query) {
			 real.setAttribute("value", query);
		}
	};

	return {
		real,
		fetcher,
		queryMinLen,
		onSelected,
		translations,
		query,
		delay,
		entries,
		hasMore,
		tooShort,
		fetchingMore,
		fetchError,
		popupVisible,
		activeFetch,
		input,
		toggle,
		popup,
		more,
		translate,
		handleBlur,
		handleInputKeypress,
		handleInputKeydown,
		handleInputKeyup,
		handleToggleKeydown,
		handleToggleClick,
		handleItemKeydown,
		handleItemKeyup,
		handleItemClick,
		handlePopupScroll,
		input_1_input_handler,
		input_1_binding,
		button_binding,
		div_binding,
		div1_binding
	};
}

class Typeahead extends SvelteComponent {
	constructor(options) {
		super();
		if (!document_1.getElementById("svelte-2ap05h-style")) add_css();

		init(this, options, instance, create_fragment, safe_not_equal, {
			real: 0,
			fetcher: 0,
			queryMinLen: 0,
			onSelected: 0,
			translations: 0,
			query: 0,
			delay: 0
		});
	}
}

export default Typeahead;
