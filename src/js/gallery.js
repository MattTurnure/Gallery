/**
 * Constructor function used to invoke new Galleries
 * @param {String} focal_id
 * @param {String} caption_id
 * @param {String} thumbs_id
 */
var Gallery = function (focal_id, caption_id, thumbs_id) {
	'use strict';

	this.focal        = document.getElementById(focal_id);
	this.img_src      = this.focal.src;
	this.caption_node = document.getElementById(caption_id);
	this.thumbs       = document.getElementById(thumbs_id);
	this.thumb_items  = this.thumbs.getElementsByTagName('li');

	this.makeControls();
	this.activateThumbs();
	this.activateDataObj();
};
/**
 * Set event delegation on thumbnail parent node
 * @return {undefined}
 */
Gallery.prototype.activateThumbs = function () {
	'use strict';

	var self = this,
		len  = self.thumb_items.length,
		i    = 0,
		target;

	// set indexes on nodes to use later for linked node list
	for (; i < len; i++) {
		self.thumb_items[i].setAttribute('data-index', i);
	}

	this.thumbs.addEventListener('click', function (e) {
		e.preventDefault();
		target = e.target.parentNode;

		if (target.nodeName.toLowerCase() === 'a') {
			self.focal.src = target.getAttribute('data-img');
			self.caption_node.innerHTML = target.getAttribute('data-caption');
			self.updateFocalData(target);
		}

	}, false);
};

/**
 * Add data-attributes on main image
 * @return {undefined}
 */
Gallery.prototype.activateDataObj = function () {
	'use strict';

	var next_thumb, prev_thumb;

	// set data attributes on main image
	if (this.thumb_items.length > 1) {
		// since this is activated on first page load, it is safe to assume that the next thumb is the second
		// and the previous thumb is the the last
		next_thumb = this.thumb_items[1].getElementsByTagName('a')[0];
		prev_thumb = this.thumb_items[this.thumb_items.length - 1].getElementsByTagName('a')[0];

		// Add additional data attributes on focal image
		// next
		this.focal.setAttribute('data-next-caption', next_thumb.getAttribute('data-caption'));
		this.focal.setAttribute('data-next-img', next_thumb.getAttribute('data-img'));
		this.focal.setAttribute('data-next-img-thumb', next_thumb.getAttribute('data-img-thumb'));
		this.focal.setAttribute('data-next-index', 1);
		this.focal.setAttribute('data-next-count', 2);
		this.focal.setAttribute('data-next-page', next_thumb.getAttribute('data-page'));

		// previous
		this.focal.setAttribute('data-prev-caption', prev_thumb.getAttribute('data-caption'));
		this.focal.setAttribute('data-prev-img', prev_thumb.getAttribute('data-img'));
		this.focal.setAttribute('data-prev-img-thumb', prev_thumb.getAttribute('data-img-thumb'));
		this.focal.setAttribute('data-prev-index', prev_thumb.parentNode.getAttribute('data-index'));
		this.focal.setAttribute('data-prev-count', prev_thumb.getAttribute('data-count'));
		this.focal.setAttribute('data-prev-page', prev_thumb.getAttribute('data-page'));
	}
};

/**
 * Create next and previous buttons for the Gallery
 * @return {undefined}
 */
Gallery.prototype.makeControls = function () {
	'use strict';

	var container = this.focal.parentNode,
		next_btn  = document.createElement('span'),
		prev_btn  = next_btn.cloneNode(true),
		next_txt  = document.createTextNode('Next'),
		prev_txt  = document.createTextNode('Previous'),
		self      = this;

	// append DOM nodes
	next_btn.className = 'next-btn';
	next_btn.appendChild(next_txt);

	prev_btn.className = 'prev-btn';
	prev_btn.appendChild(prev_txt);

	container.parentNode.appendChild(prev_btn);
	container.parentNode.appendChild(next_btn);

	// Add event listeners
	next_btn.addEventListener('click', function () {
		self.updateFocalImg('next');
	}, false);

	prev_btn.addEventListener('click', function () {
		self.updateFocalImg('next');
	}, false);
};

Gallery.prototype.updateFocalData = function (target) {
	'use strict';

	var next = this.getThumb('next', target.parentNode.getAttribute('data-index')).getElementsByTagName('a')[0],
		prev = this.getThumb('prev', target.parentNode.getAttribute('data-index')).getElementsByTagName('a')[0];

    // TEST: window.performance.mark('mark_start_focal_attributes_set');

	// update Focal node data attributes
	this.focal.setAttribute('data-caption', target.getAttribute('data-caption'));
	this.focal.setAttribute('data-img', target.getAttribute('data-img'));
	this.focal.setAttribute('data-img-thumb', target.getAttribute('data-img-thumb'));
	this.focal.setAttribute('data-index', target.parentNode.getAttribute('data-index'));
	this.focal.setAttribute('data-count', target.getAttribute('data-count'));
	this.focal.setAttribute('data-page', target.getAttribute('data-page'));

	// next
	this.focal.setAttribute('data-next-caption', next.getAttribute('data-caption'));
	this.focal.setAttribute('data-next-img', next.getAttribute('data-img'));
	this.focal.setAttribute('data-next-img-thumb', next.getAttribute('data-img-thumb'));
	this.focal.setAttribute('data-next-index', next.parentNode.getAttribute('data-index'));
	this.focal.setAttribute('data-next-count', next.getAttribute('data-count'));

	// previous
	this.focal.setAttribute('data-prev-caption', prev.getAttribute('data-caption'));
	this.focal.setAttribute('data-prev-img', prev.getAttribute('data-img'));
	this.focal.setAttribute('data-prev-img-thumb', prev.getAttribute('data-img-thumb'));
	this.focal.setAttribute('data-prev-index', prev.parentNode.getAttribute('data-index'));
	this.focal.setAttribute('data-prev-count', prev.getAttribute('data-count'));

    // TEST: window.performance.mark('mark_end_focal_attributes_set');
    // TEST: window.performance.measure('measure_update_attr', 'mark_start_focal_attributes_set', 'mark_end_focal_attributes_set');

};

Gallery.prototype.updateFocalImg = function (direction) {
	'use strict';

	var next_node, prev_node;

	if (direction === 'next') {
		this.caption_node.innerHTML = this.focal.getAttribute('data-next-caption');
		this.focal.src = this.focal.getAttribute('data-next-img');

		// get the next thumb from the focal image data-attribute, data-index
		next_node = this.getThumb('next', this.focal.getAttribute('data-index')).getElementsByTagName('a')[0];
		this.updateFocalData(next_node);
	} else  {
		this.caption_node.innerHTML = this.focal.getAttribute('data-prev-caption');
		this.focal.src = this.focal.getAttribute('data-prev-img');

		// get the next thumb from the focal image data-attribute, data-prev-index
		prev_node = this.getThumb('next', this.focal.getAttribute('data-prev-index')).getElementsByTagName('a')[0];
		this.updateFocalData(prev_node);
	}
};

/**
 * Returns DOM node from an ordered/unordered list of thumbnail images
 * @param  {String} direction
 * @param  {String} or {int} index_str
 * @return {DOM node}
 */
Gallery.prototype.getThumb = function (direction, index_str) {
	'use strict';

	if (direction === 'next') {
		return this.thumb_items[+index_str + 1] !== undefined ? this.thumb_items[+index_str + 1] :
		                                                        this.thumb_items[0];
	} else {
		return this.thumb_items[+index_str - 1] !== undefined ? this.thumb_items[+index_str - 1] :
																this.thumb_items[this.thumb_items.length - 1];
	}
};
