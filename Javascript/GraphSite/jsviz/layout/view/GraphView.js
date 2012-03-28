/* Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *     http://www.apache.org/licenses/LICENSE-2.0
 *     
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * 
 * Author: Kyle Scholz      http://kylescholz.com/
 * Copyright: 2006-2007
 */

/**
 * GraphView
 * 
 * A universal graph view that supports HTML, vector, and canvas graphics.
 * 
 * @author Kyle Scholz
  * 
 * @version 0.3.4
 * 
 * @param {HTMLElement} container
 * @param {Boolean} skewView (optional) Indicates whether we should draw on a
 *        'skewed' canvas.
 * @param {Object} properties (optional) A set of properties for this view.
  */
var GraphView = function(container, properties) {
	this.properties = properties ? properties : this.defaultProperties;

	this.container = container;

	this.frameLeft = 0;
	this.frameTop = 0;

	this.skewView = this.properties.skew ? true : false;
	this.skewBase = 0;
	this.skewX = 1;
	this.skewY = 1;

	this['nodes'] = {};
	this['edges'] = {};
	
	this.container.style.position="relative";
		
	this.supportCanvas = this.isCanvasSupported();
	this.supportVector = document.implementation.hasFeature("org.w3c.dom.svg", '1.1') ? true : false;

	if (this.properties.useCanvas && this.supportCanvas) {
		this.node_canvas = document.createElement("canvas");
		this.node_canvas.style.position="absolute";
		this.node_canvas.style.left="0px";
		this.node_canvas.style.top="0px";
		this.node_twod = this.node_canvas.getContext('2d');
		this.container.appendChild( this.node_canvas );		
	}

	// TODO(kyle) Add check for svg2vml
	if (this.properties.useVector && this.supportVector) {
		this.svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");	
		this.svg.setAttribute("version", "1.1");
		this.container.appendChild(this.svg);
	
		this.ng = document.createElementNS("http://www.w3.org/2000/svg", "g");
	   	this.svg.appendChild(this.ng);
	}

	// if this is IE, turn on caching of javascript-loaded images explicitly
	if ( document.all ) {
		document.createStyleSheet().addRule('html', 
			'filter:expression(document.execCommand("BackgroundImageCache", false, true))' );		
	}

	if (this.properties.edgeRenderer == "canvas" && this.supportCanvas) {
		this.edge_canvas = document.createElement("canvas");
		this.edge_canvas.style.position="absolute";
		this.edge_canvas.style.zIndex=0;
		this.edge_canvas.style.left="0px";
		this.edge_canvas.style.top="0px";
		this.edge_twod = this.edge_canvas.getContext('2d');
		if(this.container.hasChildNodes) {
			this.container.insertBefore(this.edge_canvas, this.container.firstChild);
		} else {
			this.container.appendChild( this.edge_canvas );			
		}
		this.addEdge = this.addCanvasEdge;
		this.drawEdge = this.drawCanvasEdge;

	} else if(this.properties.edgeRenderer == "vector" && this.supportVector) {
		this.eg = document.createElementNS("http://www.w3.org/2000/svg", "g");
		if(this.svg.hasChildNodes) {
			this.svg.insertBefore(this.eg, this.svg.firstChild);
		} else {
			this.svg.appendChild(this.eg);			
		}
		this.addEdge = this.addVectorEdge;
		this.drawEdge = this.drawVectorEdge;

	} else {
		this.addEdge = this.addHTMLEdge;
		this.drawEdge = this.drawHTMLEdge;
	}
};

/*
 * 
 */
GraphView.prototype.isCanvasSupported = function() {
	var canvas = document.createElement("canvas");
	return canvas && canvas.getContext;
};

/*
 * 
 */
GraphView.prototype.defaultProperties = {
	skew: true,
	useCanvas: true,
	useVector: true,
	edgeRenderer: "canvas"
};

/*
 * 
 */
GraphView.prototype.defaultEdgeProperties = {
	'html_pixels': 5,
	'stroke': "#444444",
	'stroke-width': '2px',
	'stroke-dasharray': '2,4'
};

/*
 * @param {Number} frameLeft
 * @param {Number} frameTop
 * @param {Number} frameWidth
 * @param {Number} frameHeight
 */
GraphView.prototype.setSize = function( frameLeft, frameTop, frameWidth, frameHeight ) {
	this.frameLeft = frameLeft;
	this.frameTop = frameTop;
	this.frameWidth = frameWidth;
	this.frameHeight = frameHeight;

	this.centerX = parseInt(frameWidth/2);
	this.centerY = parseInt(frameHeight/2);		

	if ( this.skewView && this.skewBase) {
		this.skewX = this.frameWidth/this.skewBase;
		this.skewY = this.frameHeight/this.skewBase;
	} else {
		this.skewX = 1;
		this.skewY = 1;
	}

	if (this.properties.useCanvas && this.supportCanvas) {
		if(this.properties.edgeRenderer=="canvas") {
			this.edge_canvas.width=frameWidth;
			this.edge_canvas.height=frameHeight;	
		}

		this.node_canvas.width=frameWidth;
		this.node_canvas.height=frameHeight;	
	}

	if (this.properties.useVector && this.supportVector) {
	   	this.svg.setAttribute("width", this.frameWidth);
	   	this.svg.setAttribute("height", this.frameHeight);
		var dimString = parseInt(-1*this.frameWidth/2) + " " + parseInt(-1*this.frameHeight/2)
			+ " " + this.frameWidth + " " + this.frameHeight;
		this.svg.setAttribute("viewBox", dimString);
	}
};

/*
 * Add a node to the view. 
 *
 * @param {Particle} particle
 * @param {DOMNode} domElement
 * @param {Number} centerOffsetX, Position of center of domNode relative to 
 * 		left. If not provided, SVG elements are assumed centered. The center of
 * 		HTML elements is set to offsetWidth/2.
 * @param {Number} centerOffsetY, Position of center of domNode relative to 
 * 		top. If not provided, SVG elements are assumed centered. The center of
 * 		HTML elements is determined by offsetHeight/2.
 */
GraphView.prototype.addNode = function( particle, o, cx, cy ) {
	if( typeof o == "function" ) {
		this.addCanvasNode(particle, o, cx, cy);
	} else {
		this.addDOMNode(particle, o, cx, cy);
	}
};

GraphView.prototype.addCanvasNode = function( particle, drawFunction,
	centerOffsetX, centerOffsetY ) {

	this.nodes[particle.id] = {
		drawFunction: drawFunction,
		centerX: centerOffsetX,
		centerY: centerOffsetY			
	}
	
	this.drawCanvasNode(particle);
};

GraphView.prototype.addDOMNode = function( particle, domElement,
	centerOffsetX, centerOffsetY ) {
	// With an SVG View Element
	//TODO: is this the best we can do for detecting SVG types??
	if ( domElement.localName=="circle" || domElement.localName == "text" ) {
		this.ng.appendChild(domElement);
		centerOffsetX = 0;
		centerOffsetY = 0;

	// With an HTML View Element
	} else {
		this.container.appendChild(domElement);
		domElement.style.zIndex=10;
		if ( centerOffsetX == null ) {
			centerOffsetX = parseInt( domElement.offsetWidth/2 );
		}
		if ( centerOffsetY == null ) {
			centerOffsetY = parseInt( domElement.offsetHeight/2 );
		}
	}

	this.nodes[particle.id] = {
		domElement: domElement,
		centerX: centerOffsetX,
		centerY: centerOffsetY			
	}

	if ( domElement.localName=="circle" || domElement.localName == "text" ) {
		this.nodes[particle.id]['width'] = domElement.getAttribute("width");
		this.nodes[particle.id]['height'] = domElement.getAttribute("height");
	}
	
	this.drawDOMNode(particle);
	return domElement;
};

/*
 * Drop node, eliminating dom element from document
 */
GraphView.prototype.removeNode = function( particle ) {
	if ( particle ) {
		delete this.nodes[particle.id];
	}
};

/*
 * Add an edge to the view.
 * 
 * @param {Particle} particleA
 * @param {Particle} particleB
 */
GraphView.prototype.addCanvasEdge = function( particleA, particleB, edgeProperties ) {
	if ( !this['edges'][particleA.id] ) {
		this['edges'][particleA.id]={};
	}

	if ( !this['edges'][particleA.id][particleB.id] ) {
		this['edges'][particleA.id][particleB.id] = {
			source: particleA,
			target: particleB,
			stroke: edgeProperties.stroke,
			'stroke-width': edgeProperties['stroke-width'],
			'stroke-dasharray': edgeProperties['stroke-dasharray']
		}
	}
};

GraphView.prototype.addHTMLEdge = function( particleA, particleB, edgeProperties ) {
	if ( !this['edges'][particleA.id] ) {
		this['edges'][particleA.id]={};
	}

	if ( !this['edges'][particleA.id][particleB.id] ) {		
		// create the "pixels" used to draw the edge
		var edgePixels = new Array();

		if ( !edgeProperties ) {
			edgeProperties = this.defaultEdgeProperties;
		}
	
		var pixelCount = edgeProperties['html_pixels'];
		var pixels = [];

		for ( var k=0, l=pixelCount; k<l; k++ ) {
			var pixel = document.createElement('div');
			pixel.style.width = edgeProperties['stroke-width'];
			pixel.style.height = edgeProperties['stroke-width'];
			pixel.style.backgroundColor = edgeProperties.stroke;
			pixel.style.position = 'absolute';
			pixel.innerHTML="<img height=1 width=1/>";
			edgePixels.push( pixel );
			this.container.appendChild(pixel);
		}

		this['edges'][particleA.id][particleB.id] = {
			source: particleA,
			target: particleB,
			edge: edgePixels
		}
		return edgePixels;
	} else {
		return this['edges'][particleA.id][particleB.id].edge;
	}
};

GraphView.prototype.addVectorEdge = function( particleA, particleB, edgeProperties ) {
	if ( !this['edges'][particleA.id] ) {
		this['edges'][particleA.id]={};
	}

	if ( !this['edges'][particleA.id][particleB.id] ) {
		var edge = document.createElementNS("http://www.w3.org/2000/svg", "polyline");
		if ( !edgeProperties ) {
			edgeProperties = this.defaultEdgeProperties;
		}
		for ( var p in edgeProperties ) {
			edge.setAttribute( p, edgeProperties[p] );
		}

		this.edges[particleA.id][particleB.id] = edge;
		edge.id = 'edge'+particleA.id+':'+particleB.id;
		this.eg.appendChild(edge);

		if( edgeProperties.label ) {
			edgeProperties.label.style.position = "absolute";
			this.container.appendChild(edgeProperties.label);
			edgeProperties.label.style.zIndex=10;
		}

		this['edges'][particleA.id][particleB.id] = {
			source: particleA,
			target: particleB,
			domEdge: edge,
			label: edgeProperties.label,
			labelCenterX: edgeProperties.label ? edgeProperties.label.offsetWidth/2 : 0,
			labelCenterY: edgeProperties.label ? edgeProperties.label.offsetHeight/2 : 0
		}
		
		return edge;
	} else {
		return this['edges'][particleA.id][particleB.id].domEdge;
	}
};

/*
 * Drop edge, eliminating dom element from document
 */
GraphView.prototype.removeCanvasEdge = function( edge ) {

};

/*
 * Drop edge, eliminating dom element from document
 */
GraphView.prototype.removeDOMEdge = function( edge ) {
	var domElement = edge.domEdge;
	var particleA = edge.source;
	var particleB = edge.target;
	this.eg.removeChild(domElement);
	delete this['edges'][particleA.id][particleB.id];
};

/*
 * 
 */
GraphView.prototype.drawNode = function(particle, redraw) {
	if(this['nodes'][particle.id].drawFunction) {
		this.drawCanvasNode(particle);
	} else if(redraw) {
		this.drawDOMNode(particle);
	} else if(this.properties.useCanvas) {
		var e = this.edges[particle.id];
		for ( var t in e ) {
			this.drawEdge( particle, e[t]['target'] );
		}		
	}
};

/*
 * Draw a node at it's current position.
 * 
 * @param {Particle} particle
 */
GraphView.prototype.drawCanvasNode = function( particle ) {
	var nodeProps = this['nodes'][particle.id];
	nodeProps.drawFunction.apply(this, [particle]);	

	var e = this.edges[particle.id];
	for ( var t in e ) {
		this.drawEdge( particle, e[t]['target'] );
	}
};

/*
 * Draw a node at it's current position.
 * 
 * @param {Particle} particle
 */
GraphView.prototype.drawDOMNode = function( particle ) {
	var domNodeProps = this['nodes'][particle.id];
	if ( domNodeProps ) {
		var domNode = domNodeProps.domElement;
		if( domNode.localName == 'circle' ) {
			domNode.setAttribute('transform','translate(' + particle.positionX*this.skewX + ' ' + particle.positionY*this.skewY + ')');
		} else if ( domNode.localName == 'text' ) {
			domNode.setAttribute('transform','translate(' + (particle.positionX*this.skewX - 
				domNodeProps.width) + ' ' + (particle.positionY*this.skewY - 
				domNodeProps.height) + ')');
		} else {
			domNode.style.left = (particle.positionX*this.skewX) - 
				domNodeProps.centerX + this.centerX + 'px';
			domNode.style.top = particle.positionY*this.skewY - 
				domNodeProps.centerY + this.centerY + 'px';
		}
	
		var e = this.edges[particle.id];
		for ( var t in e ) {
			this.drawEdge( particle, e[t]['target'] );
		}
	}
};

/*
 * Draw an edge at it's current position.
 * 
 * @param {Particle} particleA
 * @param {Particle} particleB
 */
GraphView.prototype.drawCanvasEdge = function ( particleA, particleB ) {
	var edge_color = this.edges[particleA.id][particleB.id]['stroke'];
	this.edge_twod.strokeStyle = edge_color;
	this.edge_twod.lineWidth = parseInt(this.edges[particleA.id][particleB.id]['stroke-width']);

	var dasharray = this.edges[particleA.id][particleB.id]['stroke-dasharray'];
	// lame
	if(dasharray) dasharray = dasharray.split(",");
	//TODO: ??assert %2==0?
	this.edge_twod.beginPath();
	this.edge_twod.moveTo(
		(particleA.positionX*this.skewX) + this.centerX,
		(particleA.positionY*this.skewY) + this.centerY
	);

	var dx = particleA.positionX-particleB.positionX; 
	var dy = particleA.positionY-particleB.positionY; 
	var d = Math.sqrt(dx*dx + dy*dy);
	
	if(dasharray) {
		var c=0;
		var cx = particleA.positionX;
		var cy = particleA.positionY;
		while(c<d) {
			for(var i=0; i<dasharray.length && c<d; i++) {
				var da = parseInt(dasharray[i]);
				c+=da;
				cx -= da*(dx/d);
				cy -= da*(dy/d);
				if(i%2==0) {
					this.edge_twod.lineTo(
						parseInt(cx)*this.skewX + this.centerX,
						parseInt(cy)*this.skewY + this.centerY
					);
				} else {
					this.edge_twod.moveTo(
						parseInt(cx)*this.skewX + this.centerX,
						parseInt(cy)*this.skewY + this.centerY
					);
				}
			}
		}		
	} else {
		this.edge_twod.lineTo(
			(particleB.positionX*this.skewX) + this.centerX,
			(particleB.positionY*this.skewY) + this.centerY
		);
	}

	this.edge_twod.stroke();
};

/*
 * Draw an edge at it's current position.
 * 
 * @param {Particle} particleA
 * @param {Particle} particleB
 */
GraphView.prototype.drawHTMLEdge = function ( nodeI, nodeJ ) {
	// get a distance vector between nodes
	var dx = nodeI.positionX - nodeJ.positionX;
	var dy = nodeI.positionY - nodeJ.positionY;
	if (dx == 0 && dy == 0) return;

	var distance = Math.sqrt( dx*dx	+ dy*dy );
		
	var pixels = this['edges'][nodeI.id][nodeJ.id]['edge'];

	// draw a line between particles using the "pixels"
	for ( var k=0, l=pixels.length; k<l; k++ ) {
		var p = (distance / l) * k;
		pixels[k].style.left=parseInt(nodeI.positionX +(-1)*p*(dx/distance))*this.skewX + this.centerX + 'px';
		pixels[k].style.top=parseInt(nodeI.positionY +(-1)*p*(dy/distance))*this.skewY + this.centerY + 'px';
	}
};

/*
 * Draw an edge at it's current position.
 * 
 * @param {Particle} particleA
 * @param {Particle} particleB
 */
GraphView.prototype.drawVectorEdge = function ( particleA, particleB ) {
	var edge = this.edges[particleA.id][particleB.id]['domEdge'];

	edge.setAttribute('points',
		(particleA.positionX)*this.skewX + "," + (particleA.positionY)*this.skewY + "," + 
		(particleB.positionX)*this.skewX + "," + (particleB.positionY)*this.skewY);

	// TODO: presumes that label is HTML
	var label = this.edges[particleA.id][particleB.id]['label'];
	if( label ) {
		label.style.left = ((particleA.positionX+particleB.positionX)/2)*this.skewX - this.edges[particleA.id][particleB.id].labelCenterX + this.centerX + 'px';
		label.style.top =  ((particleA.positionY+particleB.positionY)/2)*this.skewY - this.edges[particleA.id][particleB.id].labelCenterY + this.centerY + 'px';
	}
};

/*
 * Called at the begnning of each drawing loop. Used by views that need to clear
 * or reset at the begninning of each iteration.
 */
GraphView.prototype.set = function() {
	if( this.properties.useCanvas ) {
		this.clearCanvas();		
	}
};

/*
 * Remove everything from the view.
 */	
GraphView.prototype.clearCanvas = function() {
	if(this.supportCanvas) {
		if(this.properties.edgeRenderer == "canvas") {
			this.edge_twod.clearRect(0,0,this.edge_canvas.width,this.edge_canvas.height)			
		}
		this.node_twod.clearRect(0,0,this.node_canvas.width,this.node_canvas.height)		
	}		
};

/*
 * Remove everything from the view.
 */
GraphView.prototype.clearDOM = function() {
	// first, remove all the edges
	for ( var e in this.edges ) {
		for ( var eb in this.edges[e] ) {
			this.eg.removeChild( this.edges[e][eb].domEdge );
		}
	}

	this.edges = {};

	// now remove the nodes
	for ( var n in this.nodes ) {
		var domElement = this.nodes[n].domElement;
		if (domElement.localName=="circle" || domElement.localName=="text") {
			this.ng.removeChild(domElement);
		} else {
			document.body.removeChild(domElement);
		}
	}		

	this.nodes = {};
};