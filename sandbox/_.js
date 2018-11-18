import { Template } from './template.flave';
const t = {};
for (const key in Template) {
	t[key] = data => $(Template[key](data));
}
export const View = t;
export function $(node) {
	if (typeof node == 'string')
		node = parseHTML(node);
	if (node._$DOM)
		return node;
	if (node.$DOM)
		return node.$DOM;
	if (node.hasOwnProperty(length))
		return node.length > 1 ? toArray(node).map(function (n) { return $(n); }) : $(node[0]);
	var $DOM = {
		_$DOM: true,
		element: node,
		attribute: function (attr) {
			return node.getAttribute(attr);
		},
		append: function append(childs, before) {
			if (typeof before == 'number')
				before = node.childNodes[before];
			if (typeof before == 'string')
				before = $DOM.find(before);
			if (!childs.length)
				return appendChild(childs, before);
			return $(childs).reduce((a, e) => appendChild(e, before) && a, true);
		},
		remove: function remove(childs) {
			if (typeof childs == 'undefined')
				return node.parentNode.removeChild(node);
			if (typeof childs == 'string')
				return $DOM.findAll(childs).map(e => e.remove());
			if (Array.isArray(childs))
				return childs.map(e => $(e).remove());
			return $(childs).remove();
		},
		find: function find(selector) {
			return $(node.querySelector(selector));
		},
		findAll: function findAll(selector) {
			const nodes = node.querySelectorAll(selector);
			return nodes.length ? $(nodes) : [];
		},
		toggleClass: function toggleClass(className, force) {
			if (Array.isArray(className))
				return className.map((cl) => $DOM.toggleClass(cl, force));
			if (typeof force == 'undefined')
				force = !node.classList.contains(className);
			node.classList[force ? 'add' : 'remove'](className);
		},
		on: function on(event, selector, callback) {
			const listener = typeof selector == 'function' ? selector : function (e) {
				const element = e.target.closest(selector);
				if (element)
					callback($(element), e);
			};
			node.addEventListener(event, listener);
		}
	};
	node.$DOM = $DOM;
	return $DOM;

	function nativeElement(element) {
		return element._$DOM ? element.element : element;
	}

	function appendChild(element, before) {
		return before ? nativeElement(before).parentNode.insertBefore(element, before) : node.appendChild(nativeElement(element));
	}
	//Lifted and modified from https://gist.github.com/Munawwar/6e6362dbdf77c7865a99 which is lifted from jQuery2
	function parseHTML(html, c) {
		c = c || document;
		if (!/<|&#?\\w+;/.test(html))
			return c.createTextNode(html);
		var
			m = {
				option: [1, '<select multiple="multiple">', '</select>'],
				thead: [1, '<table>', '</table>'],
				col: [2, '<table><colgroup>', '</colgroup></table>'],
				tr: [2, '<table><tbody>', '</tbody></table>'],
				td: [3, '<table><tbody><tr>', '</tr></tbody></table>']
			},
			tmp = c.createElement('div'),
			tag = (/<([\\w:]+)/.exec(html) || ['', ''])[1].toLowerCase(),
			w = m[tag] || [0, '', ''];
		tmp.innerHTML = w[1] + html.replace(/<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi, '<$1></$2>') + w[2];
		while (w[0]--) {
			tmp = tmp.lastChild;
		}
		return tmp.children.length > 1 ? tmp.children : tmp.children[0];
	}

	function toArray(iteratable) {
		var a = [];
		for (var i = 0; i < iteratable.length; i++)
			a.push(iteratable[i]);

		return a;
	}
}

