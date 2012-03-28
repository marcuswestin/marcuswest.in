
var DataGraph=function(){this.nodes=new Array();this.edges=[];this.numEdges=0;this.subscribers=new Array();}
DataGraph.prototype.subscribe=function(observer){this.subscribers.push(observer);}
DataGraph.prototype.notifyNode=function(node){for(var i=0,l=this.subscribers.length;i<l;i++){this.subscribers[i].newDataGraphNode(node);}}
DataGraph.prototype.notifyEdge=function(nodeA,nodeB,label){for(var i=0,l=this.subscribers.length;i<l;i++){this.subscribers[i].newDataGraphEdge(nodeA,nodeB,label);}}
DataGraph.prototype.addNode=function(dataGraphNode){dataGraphNode.id=this.nodes.length;dataGraphNode.rendered=false;this.nodes.push(dataGraphNode);this.edges[dataGraphNode.id]=[];this.notifyNode(dataGraphNode);}
DataGraph.prototype.addEdge=function(nodeA,nodeB,label,weight){if(!this.edges[nodeA.id][nodeB.id]){this.numEdges++;this.edges[nodeA.id][nodeB.id]=weight||label||1;this.notifyEdge(nodeA,nodeB,label);return true;}
return false;}
DataGraph.prototype.addEdgeFromIds=function(aId,bId,weight){this.addEdge(this.nodes[aId],this.nodes[bId],weight);}
function DataGraphNode(params){this.edges={};this.edgeCount=0;for(var key in params){this[key]=params[key];}
return this;}
var EventHandler=function(_caller,_handler){var args=new Array();for(var i=2;i<arguments.length;i++){args.push(arguments[i]);}
return(function(e){if(e){args.push(e);}
_handler.apply(_caller,args);});};var ForceDirectedLayout=function(container,viewProperties,graphPanel){this.container=container;this.containerLeft=0;this.containerTop=0;this.containerWidth=0;this.containerHeight=0;this.graphPanel=graphPanel;this.view=new GraphView(container,viewProperties);this.model=new ParticleModel(this.view);this.model.start();this.setSize();this.dataNodeQueue=new Array();this.relationshipQueue=new Array();this.dataGraph=new DataGraph();this.dataGraph.subscribe(this);if(document.all){document.createStyleSheet().addRule('html','filter:expression(document.execCommand("BackgroundImageCache", false, true))');}
var resizeEvent=new EventHandler(this,this.setSize);if(window.addEventListener){window.addEventListener("resize",resizeEvent,false);}else{window.attachEvent("onresize",resizeEvent);}
if(window.Event){document.captureEvents(Event.MOUSEMOVE);}
var mouseMoveEvent=new EventHandler(this,this.handleMouseMoveEvent);var mouseUpEvent=new EventHandler(this,this.handleMouseUpEvent);var doubleClickEvent=new EventHandler(this,this.handleDoubleClickEvent);if(document.addEventListener){document.addEventListener("mousemove",mouseMoveEvent,false);document.addEventListener("mouseup",mouseUpEvent,false);}else{document.attachEvent("onmousemove",mouseMoveEvent);document.attachEvent("onmouseup",mouseUpEvent);}}
ForceDirectedLayout.prototype.setSize=function(){if(this.container.tagName=="BODY"){if(document.all){this.containerWidth=document.body.offsetWidth-5;this.containerHeight=document.documentElement.offsetHeight-5;}else{this.containerWidth=window.innerWidth-5;this.containerHeight=window.innerHeight-5;}
this.containerLeft=0;this.containerTop=0;}else{this.containerWidth=this.container.offsetWidth;this.containerHeight=this.container.offsetHeight;this.containerLeft=this.container.offsetLeft;this.containerTop=this.container.offsetTop;}
this.view.setSize(this.containerLeft,this.containerTop,this.containerWidth,this.containerHeight);this.model.setSize(this.containerWidth,this.containerHeight);this.model.draw(true);}
ForceDirectedLayout.prototype.handleMouseMoveEvent=function(e){if(this.model.selected!=null){e=arguments[arguments.length-1];var mouseX=e.pageX?e.pageX:e.clientX;var mouseY=e.pageY?e.pageY:e.clientY;mouseX-=this.view.centerX;mouseY-=this.view.centerY;mouseY-=this.containerTop;mouseX-=this.containerLeft;this.model.particles[this.model.selected].positionX=mouseX/this.view.skewX;this.model.particles[this.model.selected].positionY=mouseY/this.view.skewY;this.model.tick();}}
ForceDirectedLayout.prototype.handleContextMenu=function(id){if(this.view.properties.edgeRenderer=="canvas"){this.view.edge_twod.clearRect(0,0,this.view.edge_canvas.width,this.view.edge_canvas.height)}
if(this.view.properties.nodeRenderer=='canvas'){this.view.node_twod.clearRect(0,0,this.view.node_canvas.width,this.view.node_canvas.height)}
var eds=this.view.edges;for(var i in eds[id]){this.removeHtmlEdge(eds[id][i])}
for(var i in eds){if(eds[i]&&eds[i][id]){this.removeHtmlEdge(eds[i][id]);}}
this.container.removeChild(this.view.nodes[id].domElement);}
ForceDirectedLayout.prototype.removeHtmlEdge=function(edg){var pixels=edg.edge;for(var i=0;i<pixels.length;i++){this.view.container.removeChild(pixels[i]);}
if(edg.label){this.view.container.removeChild(edg.label);}}
ForceDirectedLayout.prototype.handleDoubleClickEvent=function(id){if(this.model.lastSelected!=null){if(this.model.lastSelected!=id){this.graphPanel.addEdge(this.dataGraph.nodes[this.model.lastSelected],this.dataGraph.nodes[id]);}
this.view.nodes[this.model.lastSelected].domElement.style.border='none'
this.model.lastSelected=null;}else{this.model.lastSelected=id;this.view.nodes[id].domElement.style.border='dashed 2px yellow';}}
ForceDirectedLayout.prototype.handleMouseUpEvent=function(){if(this.model.selected!=null){this.model.particles[this.model.selected].selected=false;this.model.reset();this.model.selected=null;}}
ForceDirectedLayout.prototype.handleMouseDownEvent=function(id){this.model.selected=id;this.model.particles[id].selected=true;}
ForceDirectedLayout.prototype.newDataGraphNode=function(dataNode){this.dataNodeQueue.push(dataNode);}
ForceDirectedLayout.prototype.newDataGraphEdge=function(nodeA,nodeB,label){this.relationshipQueue.push({'nodeA':nodeA,'nodeB':nodeB,label:label});}
ForceDirectedLayout.prototype.dequeueNode=function(){var node=this.dataNodeQueue.shift();if(node){this.addParticle(node);return true;}
return false;}
ForceDirectedLayout.prototype.dequeueNode=function(){var node=this.dataNodeQueue.shift();if(node){this.addParticle(node);return true;}
return false;}
ForceDirectedLayout.prototype.dequeueRelationship=function(){var edge=this.relationshipQueue[0]
if(edge&&edge.nodeA.particle&&edge.nodeB.particle){this.relationshipQueue.shift();this.addSimilarity(edge.nodeA,edge.nodeB,edge.label);}}
ForceDirectedLayout.prototype.update=function(){this.dequeueNode();this.dequeueRelationship();}
ForceDirectedLayout.prototype.clear=function(modelNode){this.model.clear();}
ForceDirectedLayout.prototype.recenter=function(modelNode){}
ForceDirectedLayout.prototype.config=function(layout){}
ForceDirectedLayout.prototype.forces={spring:{}};ForceDirectedLayout.prototype.addParticle=function(dataNode){var particle=this.makeNodeModel(dataNode);var domElement=this.makeNodeView(dataNode,particle);this.view.addNode(particle,domElement);if(dataNode.fixed){particle.fixed=true;}
var rx=Math.random()*2-1;var ry=Math.random()*2-1;particle.positionX=rx;particle.positionY=ry;if(dataNode.parent){particle.positionX=dataNode.parent.particle.positionX+rx;particle.positionY=dataNode.parent.particle.positionY+ry;var configNode=(dataNode.type in this.forces.spring&&dataNode.parent.type in this.forces.spring[dataNode.type])?this.forces.spring[dataNode.type][dataNode.parent.type](dataNode,dataNode.parent,true):this.forces.spring['_default'](dataNode,dataNode.parent,true);this.model.makeSpring(particle,dataNode.parent.particle,configNode.springConstant,configNode.dampingConstant,configNode.restLength);var props=this.viewEdgeBuilder(dataNode.parent,dataNode);this.view.addEdge(particle,dataNode.parent.particle,props);}
for(var j=0,l=this.model.particles.length;j<l;j++){if(this.model.particles[j]!=particle){var magnetConstant=this.forces.magnet()['magnetConstant'];var minimumDistance=this.forces.magnet()['minimumDistance'];this.model.makeMagnet(particle,this.model.particles[j],magnetConstant,minimumDistance);}}
dataNode.particle=particle;dataNode.viewNode=domElement;return dataNode;}
ForceDirectedLayout.prototype.addSimilarity=function(nodeA,nodeB,label){var configNode=(nodeA.type in this.forces.spring&&nodeB.type in this.forces.spring[nodeA.type])?this.forces.spring[nodeA.type][nodeB.parent.type](nodeA,nodeB,false):this.forces.spring['_default'](nodeA,nodeB,false);this.model.makeSpring(nodeA.particle,nodeB.particle,configNode.springConstant,configNode.dampingConstant,configNode.restLength);var props=this.viewEdgeBuilder(nodeA,nodeB,label);this.view.addEdge(nodeA.particle,nodeB.particle,props);}
ForceDirectedLayout.prototype.makeNodeView=function(dataNode,modelNode){var configNode=(dataNode.type in this.config)?this.config[dataNode.type]:this.config['_default'];return configNode.view(dataNode,modelNode);}
ForceDirectedLayout.prototype.makeNodeModel=function(dataNode){var configNode=(dataNode.type in this.config)?this.config[dataNode.type]:this.config['_default'];for(var attribute in configNode.model(dataNode)){dataNode[attribute]=configNode.model(dataNode)[attribute];}
var modelNode=this.model.makeParticle(dataNode.mass,0,0);return modelNode;}
var GraphView=function(container,properties){this.properties=properties?properties:this.defaultProperties;this.container=container;this.frameLeft=0;this.frameTop=0;this.skewView=this.properties.skew?true:false;this.skewBase=this.properties.skew;this.skewX=1;this.skewY=1;this['nodes']={};this['edges']={};this.container.style.position="relative";this.supportCanvas=this.isCanvasSupported();this.supportVector=document.implementation.hasFeature("org.w3c.dom.svg",'1.1')?true:false;if(this.properties.useCanvas&&this.supportCanvas){this.node_canvas=document.createElement("canvas");this.node_canvas.style.position="absolute";this.node_canvas.style.left="0px";this.node_canvas.style.top="0px";this.node_twod=this.node_canvas.getContext('2d');this.container.appendChild(this.node_canvas);}
if(this.properties.useVector&&this.supportVector){this.svg=document.createElementNS("http://www.w3.org/2000/svg","svg");this.svg.setAttribute("version","1.1");this.container.appendChild(this.svg);this.ng=document.createElementNS("http://www.w3.org/2000/svg","g");this.svg.appendChild(this.ng);}
if(document.all){document.createStyleSheet().addRule('html','filter:expression(document.execCommand("BackgroundImageCache", false, true))');}
if(this.properties.edgeRenderer=="canvas"&&this.supportCanvas){this.edge_canvas=document.createElement("canvas");this.edge_canvas.style.position="absolute";this.edge_canvas.style.zIndex=0;this.edge_canvas.style.left="0px";this.edge_canvas.style.top="0px";this.edge_twod=this.edge_canvas.getContext('2d');if(this.container.hasChildNodes){this.container.insertBefore(this.edge_canvas,this.container.firstChild);}else{this.container.appendChild(this.edge_canvas);}
this.addEdge=this.addCanvasEdge;this.drawEdge=this.drawCanvasEdge;}else if(this.properties.edgeRenderer=="vector"&&this.supportVector){this.eg=document.createElementNS("http://www.w3.org/2000/svg","g");if(this.svg.hasChildNodes){this.svg.insertBefore(this.eg,this.svg.firstChild);}else{this.svg.appendChild(this.eg);}
this.addEdge=this.addVectorEdge;this.drawEdge=this.drawVectorEdge;}else{this.addEdge=this.addHTMLEdge;this.drawEdge=this.drawHTMLEdge;}};GraphView.prototype.isCanvasSupported=function(){var canvas=document.createElement("canvas");return canvas&&canvas.getContext;};GraphView.prototype.defaultProperties={skew:true,useCanvas:true,useVector:true,edgeRenderer:"canvas"};GraphView.prototype.defaultEdgeProperties={'html_pixels':5,'stroke':"#444444",'stroke-width':'2px','stroke-dasharray':'2,4'};GraphView.prototype.setSize=function(frameLeft,frameTop,frameWidth,frameHeight){this.frameLeft=frameLeft;this.frameTop=frameTop;this.frameWidth=frameWidth;this.frameHeight=frameHeight;this.centerX=parseInt(frameWidth/2);this.centerY=parseInt(frameHeight/2);if(this.skewView&&this.skewBase){this.skewX=this.frameWidth/this.skewBase;this.skewY=this.frameHeight/this.skewBase;}else{this.skewX=1;this.skewY=1;}
if(this.properties.useCanvas&&this.supportCanvas){if(this.properties.edgeRenderer=="canvas"){this.edge_canvas.width=frameWidth/1;this.edge_canvas.height=frameHeight/1;}
this.node_canvas.width=frameWidth;this.node_canvas.height=frameHeight;}
if(this.properties.useVector&&this.supportVector){this.svg.setAttribute("width",this.frameWidth);this.svg.setAttribute("height",this.frameHeight);var dimString=parseInt(-1*this.frameWidth/2)+" "+parseInt(-1*this.frameHeight/2)
+" "+this.frameWidth+" "+this.frameHeight;this.svg.setAttribute("viewBox",dimString);}};GraphView.prototype.addNode=function(particle,o,cx,cy){if(typeof o=="function"){this.addCanvasNode(particle,o,cx,cy);}else{this.addDOMNode(particle,o,cx,cy);}};GraphView.prototype.addCanvasNode=function(particle,drawFunction,centerOffsetX,centerOffsetY){this.nodes[particle.id]={drawFunction:drawFunction,centerX:centerOffsetX,centerY:centerOffsetY}
this.drawCanvasNode(particle);};GraphView.prototype.addDOMNode=function(particle,domElement,centerOffsetX,centerOffsetY){if(domElement.localName=="circle"||domElement.localName=="text"){this.ng.appendChild(domElement);centerOffsetX=0;centerOffsetY=0;}else{this.container.appendChild(domElement);domElement.style.zIndex=10;if(centerOffsetX==null){centerOffsetX=parseInt(domElement.offsetWidth/2);}
if(centerOffsetY==null){centerOffsetY=parseInt(domElement.offsetHeight/2);}}
this.nodes[particle.id]={domElement:domElement,centerX:centerOffsetX,centerY:centerOffsetY}
if(domElement.localName=="circle"||domElement.localName=="text"){this.nodes[particle.id]['width']=domElement.getAttribute("width");this.nodes[particle.id]['height']=domElement.getAttribute("height");}
this.drawDOMNode(particle);return domElement;};GraphView.prototype.removeNode=function(particle){if(particle){delete this.nodes[particle.id];}};GraphView.prototype.addCanvasEdge=function(particleA,particleB,edgeProperties){if(!this['edges'][particleA.id]){this['edges'][particleA.id]={};}
if(!this['edges'][particleA.id][particleB.id]){this['edges'][particleA.id][particleB.id]={source:particleA,target:particleB,stroke:edgeProperties.stroke,'stroke-width':edgeProperties['stroke-width'],'stroke-dasharray':edgeProperties['stroke-dasharray']}}};GraphView.prototype.addHTMLEdge=function(particleA,particleB,edgeProperties){if(!this['edges'][particleA.id]){this['edges'][particleA.id]={};}
if(!this['edges'][particleA.id][particleB.id]){var edgePixels=new Array();if(!edgeProperties){edgeProperties=this.defaultEdgeProperties;}
var pixelCount=edgeProperties['html_pixels'];var pixels=[];for(k=pixelCount-1;k>=0;k--){var pixel=document.createElement('div');pixel.style.width=(k+2)+'px';pixel.style.height=(k+2)+'px';pixel.style.backgroundColor=edgeProperties.stroke;pixel.style.position='absolute';edgePixels.push(pixel);this.container.appendChild(pixel);}
if(edgeProperties.label){var label=document.createElement('div');label.style.position='absolute';label.innerHTML=edgeProperties.label;this.container.appendChild(label);}
this.edges[particleA.id][particleB.id]={source:particleA,target:particleB,edge:edgePixels,label:label}
return edgePixels;}else{return this['edges'][particleA.id][particleB.id].edge;}};GraphView.prototype.addVectorEdge=function(particleA,particleB,edgeProperties){if(!this['edges'][particleA.id]){this['edges'][particleA.id]={};}
if(!this['edges'][particleA.id][particleB.id]){var edge=document.createElementNS("http://www.w3.org/2000/svg","polyline");if(!edgeProperties){edgeProperties=this.defaultEdgeProperties;}
for(var p in edgeProperties){edge.setAttribute(p,edgeProperties[p]);}
this.edges[particleA.id][particleB.id]=edge;edge.id='edge'+particleA.id+':'+particleB.id;this.eg.appendChild(edge);if(edgeProperties.label){edgeProperties.label.style.position="absolute";this.container.appendChild(edgeProperties.label);edgeProperties.label.style.zIndex=10;}
this['edges'][particleA.id][particleB.id]={source:particleA,target:particleB,domEdge:edge,label:edgeProperties.label,labelCenterX:edgeProperties.label?edgeProperties.label.offsetWidth/2:0,labelCenterY:edgeProperties.label?edgeProperties.label.offsetHeight/2:0}
return edge;}else{return this['edges'][particleA.id][particleB.id].domEdge;}};GraphView.prototype.removeCanvasEdge=function(edge){};GraphView.prototype.removeDOMEdge=function(edge){var domElement=edge.domEdge;var particleA=edge.source;var particleB=edge.target;this.eg.removeChild(domElement);delete this['edges'][particleA.id][particleB.id];};GraphView.prototype.drawNode=function(particle,redraw){if(this['nodes'][particle.id]&&this['nodes'][particle.id].drawFunction){this.drawCanvasNode(particle);}else if(redraw){this.drawDOMNode(particle);}else if(this.properties.useCanvas){var e=this.edges[particle.id];for(var t in e){this.drawEdge(particle,e[t]['target']);}}};GraphView.prototype.drawCanvasNode=function(particle){var nodeProps=this['nodes'][particle.id];nodeProps.drawFunction.apply(this,[particle]);var e=this.edges[particle.id];for(var t in e){this.drawEdge(particle,e[t]['target']);}};GraphView.prototype.drawDOMNode=function(particle){var domNodeProps=this['nodes'][particle.id];if(domNodeProps){var domNode=domNodeProps.domElement;if(domNode.localName=='circle'){domNode.setAttribute('transform','translate('+particle.positionX*this.skewX+' '+particle.positionY*this.skewY+')');}else if(domNode.localName=='text'){domNode.setAttribute('transform','translate('+(particle.positionX*this.skewX-
domNodeProps.width)+' '+(particle.positionY*this.skewY-
domNodeProps.height)+')');}else{domNode.style.left=(particle.positionX*this.skewX)-
domNodeProps.centerX+this.centerX+'px';domNode.style.top=particle.positionY*this.skewY-
domNodeProps.centerY+this.centerY+'px';}
var e=this.edges[particle.id];for(var t in e){this.drawEdge(particle,e[t]['target']);}}};GraphView.prototype.drawCanvasEdge=function(particleA,particleB){var edge_color=this.edges[particleA.id][particleB.id]['stroke'];this.edge_twod.strokeStyle=edge_color;this.edge_twod.lineWidth=parseInt(this.edges[particleA.id][particleB.id]['stroke-width']);var dasharray=this.edges[particleA.id][particleB.id]['stroke-dasharray'];if(dasharray)dasharray=dasharray.split(",");this.edge_twod.beginPath();this.edge_twod.moveTo((particleA.positionX*this.skewX)+this.centerX,(particleA.positionY*this.skewY)+this.centerY);var dx=particleA.positionX-particleB.positionX;var dy=particleA.positionY-particleB.positionY;var d=Math.sqrt(dx*dx+dy*dy);if(dasharray){var c=0;var cx=particleA.positionX;var cy=particleA.positionY;while(c<d){for(var i=0;i<dasharray.length&&c<d;i++){var da=parseInt(dasharray[i]);c+=da;cx-=da*(dx/d);cy-=da*(dy/d);if(i%2==0){this.edge_twod.lineTo(parseInt(cx)*this.skewX+this.centerX,parseInt(cy)*this.skewY+this.centerY);}else{this.edge_twod.moveTo(parseInt(cx)*this.skewX+this.centerX,parseInt(cy)*this.skewY+this.centerY);}}}}else{this.edge_twod.lineTo((particleB.positionX*this.skewX)+this.centerX,(particleB.positionY*this.skewY)+this.centerY);}
this.edge_twod.stroke();};GraphView.prototype.drawHTMLEdge=function(nodeI,nodeJ){var dx=nodeI.positionX-nodeJ.positionX;var dy=nodeI.positionY-nodeJ.positionY;if(dx==0&&dy==0)return;var distance=Math.sqrt(dx*dx+dy*dy);var pixels=this['edges'][nodeI.id][nodeJ.id]['edge'];var label=this.edges[nodeI.id][nodeJ.id].label;if(label){label.style.left=parseInt(nodeI.positionX-dx/4)*this.skewX+this.centerX+'px';label.style.top=parseInt(nodeI.positionY-dy/4-25)*this.skewY+this.centerY+'px';}
var gapDistance=10;signX=(dx<0)?-1:1;signY=(dy<0)?-1:1;for(var k=0,l=pixels.length;k<l;k++){var p=(distance/l)*k;pixels[k].style.left=parseInt(nodeI.positionX+(-1)*p*(dx/distance))*this.skewX+this.centerX+'px';pixels[k].style.top=parseInt(nodeI.positionY+(-1)*p*(dy/distance))*this.skewY+this.centerY+'px';}};GraphView.prototype.drawVectorEdge=function(particleA,particleB){var edge=this.edges[particleA.id][particleB.id]['domEdge'];edge.setAttribute('points',(particleA.positionX)*this.skewX+","+(particleA.positionY)*this.skewY+","+
(particleB.positionX)*this.skewX+","+(particleB.positionY)*this.skewY);var label=this.edges[particleA.id][particleB.id]['label'];if(label){label.style.left=((particleA.positionX+particleB.positionX)/2)*this.skewX-this.edges[particleA.id][particleB.id].labelCenterX+this.centerX+'px';label.style.top=((particleA.positionY+particleB.positionY)/2)*this.skewY-this.edges[particleA.id][particleB.id].labelCenterY+this.centerY+'px';}};GraphView.prototype.set=function(){if(this.properties.useCanvas){this.clearCanvas();}};GraphView.prototype.clearCanvas=function(){if(this.supportCanvas){if(this.properties.edgeRenderer=="canvas"){this.edge_twod.clearRect(0,0,this.edge_canvas.width,this.edge_canvas.height)}
this.node_twod.clearRect(0,0,this.node_canvas.width,this.node_canvas.height)}};GraphView.prototype.clearDOM=function(){for(var e in this.edges){for(var eb in this.edges[e]){this.eg.removeChild(this.edges[e][eb].domEdge);}}
this.edges={};for(var n in this.nodes){var domElement=this.nodes[n].domElement;if(domElement.localName=="circle"||domElement.localName=="text"){this.ng.removeChild(domElement);}else{document.body.removeChild(domElement);}}
this.nodes={};};var Magnet=function(a,b,g,distanceMin){this.init(a,b,g,distanceMin);}
Magnet.prototype={init:function(a,b,g,distanceMin){this['a']=a;this['b']=b;this['g']=g;this['distanceMin']=distanceMin;this['age']=0;this['forceX']=0;this['forceY']=0;},apply:function(){var dx=this.a.positionX-this.b.positionX;var dy=this.a.positionY-this.b.positionY;var distance=Math.sqrt(dx*dx+dy*dy);if(distance==0){return;}else{dx*=(1/distance);dy*=(1/distance);}
var force=this.g*this.a.mass*this.b.mass;if(distance<this.distanceMin){force*=1/(this.distanceMin*this.distanceMin);}else{force*=1/(distance*distance);}
dx*=force;dy*=force;var dfx=dx-this.forceX;var dfy=dy-this.forceY;if(!this.a.fixed&&!this.a.selected){this.a.forceX-=dfx;this.a.forceY-=dfy;}
if(!this.b.fixed&&!this.b.selected){this.b.forceX+=dfx;this.b.forceY+=dfy;}
this.forceX=dx;this.forceY=dy;}}
var Particle=function(mass,positionX,positionY){this.init(mass,positionX,positionY);}
Particle.prototype={init:function(mass,positionX,positionY){this['positionX']=positionX;this['positionY']=positionY;this['originalPositionX']=positionX;this['originalPositionY']=positionY;this['lastDrawPositionX']=0;this['lastDrawPositionY']=0;this['mass']=mass;this['forceX']=0;this['forceY']=0;this['velocityX']=0;this['velocityY']=0;this['originalVelocityX']=0;this['originalVelocityY']=0;this['fixed']=false;this['selected']=false;this['age']=0;this['width']=0;this['height']=0;}}
var ParticleModel=function(view){this.init(view);}
ParticleModel.prototype={init:function(view){this.ENTROPY_THROTTLE=true;this.view=view;this.particles=new Array();this.nextParticleId=0;this.springs=new Array();this.activeSprings=new Array();this.springLast=0;this.magnets=new Array();this.activeMagnets=new Array();this.magLast=0;this.integrator=new RungeKuttaIntegrator(this,view);this.timer=new Timer(1);this.timer.subscribe(this);this.setSize(this.view.frameWidth,this.view.frameHeight,this.view.skewX,this.view.skewY);},tick:function(){this.integrator.step(1);return this.draw();},setSize:function(frameWidth,frameHeight){this.boundsLeft=(-frameWidth/this.view.skewX)/2;this.boundsRight=(frameWidth/this.view.skewX)/2;this.boundsTop=(-frameHeight/this.view.skewY)/2;this.boundsBottom=(frameHeight/this.view.skewY)/2;},draw:function(force){var view=this.view;view.set();var particles=this.particles;var moved=0;var skewX=this.view.skewX;var skewY=this.view.skewY;for(var i=0,l=particles.length;i<l;i++){var particle=particles[i];if(this.boundsLeft){if(particle.positionX<this.boundsLeft+(particle.width/2)/skewX){particle.positionX=this.boundsLeft+(particle.width/2)/skewX;}else if(particle.positionX>(this.boundsRight-(particle.width/2)/skewX)){particle.positionX=this.boundsRight-(particle.width/2)/skewX;}
if(particle.positionY<this.boundsTop+(particle.height/2/skewY)){particle.positionY=this.boundsTop+(particle.height/2/skewY);}else if(particle.positionY>(this.boundsBottom-(particle.height/2/skewY))){particle.positionY=this.boundsBottom-(particle.height/2/skewY);}}
var newDrawPositionX=Math.round(particle.positionX*2)/2;var newDrawPositionY=Math.round(particle.positionY*2)/2;var redraw=(force||newDrawPositionX!=particle.lastDrawPositionX||newDrawPositionY!=particle.lastDrawPositionY)?true:false;view.drawNode(particle,redraw);if(redraw)moved++;particle.lastDrawPositionX=newDrawPositionX;particle.lastDrawPositionY=newDrawPositionY;}
return moved;},makeParticle:function(mass,x,y){var particle=new Particle(mass,x,y);particle.id=this.nextParticleId++;this.particles.push(particle);this['integrator'].allocateParticle(particle.id);if(this.timer.interupt){this.timer.start();}
return particle;},makeSpring:function(a,b,springConstant,dampingConstant,restLength){var spring=new Spring(a,b,springConstant,dampingConstant,restLength);this.springs.push(spring);this.activeSprings.push(spring);return(spring);},makeMagnet:function(a,b,g,distanceMin){var magnet=new Magnet(a,b,g,distanceMin);this.magnets.push(magnet);this.activeMagnets.push(magnet);if(this.activeMagnets.length>50){this.activeMagnets.shift();}
return magnet;},applyForces:function(){var activeSprings=this.activeSprings;var springs=this.springs;var springLast=this.springLast;var scanLength=parseInt(springs.length/10);for(var i=0,l=activeSprings.length;i<l;i++){activeSprings[i].apply();activeSprings[i].age++;}
var springLen=this.activeSprings.length;if(springLen>0&&this.activeSprings[0].age>20){this.activeSprings.shift();}
for(var i=springLast,t=springLast+scanLength,l=springs.length;i<t&&i<l;i++){springs[i].apply();}
this['springLast']+=scanLength;if(this['springLast']>=springs.length){this['springLast']=0;}
var activeMagnets=this.activeMagnets;var magnets=this.magnets;var magLast=this['magLast']
scanLength=parseInt(magnets.length/10);for(var i=0,l=activeMagnets.length;i<l;i++){activeMagnets[i].apply();activeMagnets[i].age++;}
var magLen=this.activeMagnets.length;if(magLen>0&&this.activeMagnets[0].age>50){this.activeMagnets.shift();}
for(var i=magLast,t=magLast+scanLength,l=magnets.length;i<t&&i<l;i++){magnets[i].apply();}
this['magLast']+=scanLength;if(this['magLast']>=magnets.length){this['magLast']=0;}},reset:function(){var springs=this.springs;for(var i=0,l=springs.length;i<l;i++){springs[i].forceX=0;springs[i].forceY=0;}
var magnets=this.magnets;for(var i=0,l=magnets.length;i<l;i++){magnets[i].forceX=0;magnets[i].forceY=0;}
var particles=this.particles;for(var i=0,l=particles.length;i<l;i++){particles[i].forceX=0;particles[i].forceY=0;}
var particles=this.particles;for(var i=0,l=particles.length;i<l;i++){this.integrator.allocateParticle(i);}
if(this.timer.interupt){this.timer.start();}},update:function(){var moved=this.tick();var result=1;if(this.ENTROPY_THROTTLE&&this.particles.length>2){var e=(moved/(this.particles.length));if(e<.01){this.stop();}else if(e<.05){return(1000);}else if(e<.1){return(200);}
return(1);}
return result;},start:function(){this.timer.start();},stop:function(){if(this.doNotStop){}else{this.timer.stop();}},clear:function(){this.particles=new Array();this.nextParticleId=0;this.springs=new Array();this.activeSprings=new Array();this.springLast=0;this.magnets=new Array();this.activeMagnets=new Array();this.magLast=0;this.view.clear();this.integrator.initialize(this,this.view);}}
var RungeKuttaIntegrator=function(particleModel,view){this.initialize(particleModel,view);};RungeKuttaIntegrator.prototype={initialize:function(particleModel,view){this.particleModel=particleModel;this.particles=particleModel.particles;this.view=view;this.setSize(view.frameWidth,view.frameHeight,view.skew);this.k1ForcesX=new Array();this.k2ForcesX=new Array();this.k3ForcesX=new Array();this.k4ForcesX=new Array();this.k1ForcesY=new Array();this.k2ForcesY=new Array();this.k3ForcesY=new Array();this.k4ForcesY=new Array();this.k1VelocitiesX=new Array();this.k2VelocitiesX=new Array();this.k3VelocitiesX=new Array();this.k4VelocitiesX=new Array();this.k1VelocitiesY=new Array();this.k2VelocitiesY=new Array();this.k3VelocitiesY=new Array();this.k4VelocitiesY=new Array();},setSize:function(frameWidth,frameHeight,skew){this.boundsLeft=(-frameWidth/2)/skew;this.boundsRight=(frameWidth/2)/skew;this.boundsTop=-frameHeight/2;this.boundsBottom=frameHeight/2;},allocateParticle:function(i){this.k1ForcesX[i]=0;this.k2ForcesX[i]=0;this.k3ForcesX[i]=0;this.k4ForcesX[i]=0;this.k1ForcesY[i]=0;this.k2ForcesY[i]=0;this.k3ForcesY[i]=0;this.k4ForcesY[i]=0;this.k1VelocitiesX[i]=0;this.k2VelocitiesX[i]=0;this.k3VelocitiesX[i]=0;this.k4VelocitiesX[i]=0;this.k1VelocitiesY[i]=0;this.k2VelocitiesY[i]=0;this.k3VelocitiesY[i]=0;this.k4VelocitiesY[i]=0;},step:function(){var particles=this.particles;var k1ForcesX=this.k1ForcesX;var k2ForcesX=this.k2ForcesX;var k3ForcesX=this.k3ForcesX;var k4ForcesX=this.k4ForcesX;var k1ForcesY=this.k1ForcesY;var k2ForcesY=this.k2ForcesY;var k3ForcesY=this.k3ForcesY;var k4ForcesY=this.k4ForcesY;var k1VelocitiesX=this.k1VelocitiesX;var k2VelocitiesX=this.k2VelocitiesX;var k3VelocitiesX=this.k3VelocitiesX;var k4VelocitiesX=this.k4VelocitiesX;var k1VelocitiesY=this.k1VelocitiesY;var k2VelocitiesY=this.k2VelocitiesY;var k3VelocitiesY=this.k3VelocitiesY;var k4VelocitiesY=this.k4VelocitiesY;for(var i=0,l=particles.length;i<l;i++){if(!particles[i].fixed&&!particles[i].selected){particles[i].originalPositionX=particles[i].positionX;particles[i].originalPositionY=particles[i].positionY;particles[i].originalVelocityX=particles[i].velocityX/2;particles[i].originalVelocityY=particles[i].velocityY/2;}}
this.particleModel.applyForces();for(var i=0,l=particles.length;i<l;i++){if(!particles[i].fixed&&!particles[i].selected){k1ForcesX[i]=particles[i].forceX;k1ForcesY[i]=particles[i].forceY;k1VelocitiesX[i]=particles[i].velocityX;k1VelocitiesY[i]=particles[i].velocityY;}}
for(var i=0,l=particles.length;i<l;i++){if(!particles[i].fixed&&!particles[i].selected){particles[i].positionX=particles[i].originalPositionX+k1VelocitiesX[i]*0.5;particles[i].positionY=particles[i].originalPositionY+k1VelocitiesY[i]*0.5;particles[i].velocityX=particles[i].originalVelocityX+(k1ForcesX[i]*0.5)/particles[i].mass;particles[i].velocityY=particles[i].originalVelocityY+(k1ForcesY[i]*0.5)/particles[i].mass;}}
this.particleModel.applyForces();for(var i=0,l=particles.length;i<l;i++){if(!particles[i].fixed&&!particles[i].selected){k2ForcesX[i]=particles[i].forceX;k2ForcesY[i]=particles[i].forceY;k2VelocitiesX[i]=particles[i].velocityX;k2VelocitiesY[i]=particles[i].velocityY;}}
for(var i=0,l=particles.length;i<l;i++){if(!particles[i].fixed&&!particles[i].selected){particles[i].positionX=particles[i].originalPositionX+k2VelocitiesX[i]*0.5;particles[i].positionY=particles[i].originalPositionY+k2VelocitiesY[i]*0.5;particles[i].velocityX=particles[i].originalVelocityX+(k2ForcesX[i]*0.5)/particles[i].mass;particles[i].velocityY=particles[i].originalVelocityY+(k2ForcesY[i]*0.5)/particles[i].mass;}}
this.particleModel.applyForces();for(var i=0,l=particles.length;i<l;i++){if(!particles[i].fixed&&!particles[i].selected){k3ForcesX[i]=particles[i].forceX;k3ForcesY[i]=particles[i].forceY;k3VelocitiesX[i]=particles[i].velocityX;k3VelocitiesY[i]=particles[i].velocityY;}}
for(var i=0,l=particles.length;i<l;i++){if(!particles[i].fixed&&!particles[i].selected){particles[i].positionX=particles[i].originalPositionX+k3VelocitiesX[i];particles[i].positionY=particles[i].originalPositionY+k3VelocitiesY[i];particles[i].velocityX=particles[i].originalVelocityX+(k3ForcesX[i])/particles[i].mass;particles[i].velocityY=particles[i].originalVelocityY+(k3ForcesY[i])/particles[i].mass;}}
this.particleModel.applyForces();for(var i=0,l=particles.length;i<l;i++){if(!particles[i].fixed&&!particles[i].selected){k4ForcesX[i]=particles[i].forceX;k4ForcesY[i]=particles[i].forceY;k4VelocitiesX[i]=particles[i].velocityX;k4VelocitiesY[i]=particles[i].velocityY;}}
for(var i=0,l=particles.length;i<l;i++){if(!particles[i].fixed&&!particles[i].selected){particles[i].positionX=particles[i].originalPositionX
+(1/6)*(k1VelocitiesX[i]+2*k2VelocitiesX[i]+2*k3VelocitiesX[i]+k4VelocitiesX[i]);particles[i].positionY=particles[i].originalPositionY
+(1/6)*(k1VelocitiesY[i]+2*k2VelocitiesY[i]+2*k3VelocitiesY[i]+k4VelocitiesY[i]);particles[i].velocityX=particles[i].originalVelocityX
+(1/(6*particles[i].mass))*(k1ForcesX[i]+2*k2ForcesX[i]+2*k3ForcesX[i]+k4ForcesX[i]);particles[i].velocityY=particles[i].originalVelocityY
+(1/(6*particles[i].mass))*(k1ForcesY[i]+2*k2ForcesY[i]+2*k3ForcesY[i]+k4ForcesY[i]);}}}}
var Spring=function(a,b,springConstant,dampingConstant,restLength){this.init(a,b,springConstant,dampingConstant,restLength);}
Spring.prototype={init:function(a,b,springConstant,dampingConstant,restLength){this['springConstant']=springConstant;this['damping']=dampingConstant;this['restLength']=restLength;this['a']=a;this['b']=b;this.forceX=0;this.forceY=0;},apply:function(){var dx=this.a.positionX-this.b.positionX;var dy=this.a.positionY-this.b.positionY;var springLength=Math.sqrt(dx*dx+dy*dy);if(springLength==0){dx=0;dy=0;}else{dx*=(1/springLength);dy*=(1/springLength);}
var springForce=-(springLength-this.restLength)*this.springConstant;var vx=this.a.velocityX-this.b.velocityX;var vy=this.a.velocityY-this.b.velocityY;var dampingForce=-this.damping*(dx*vx+dy*vy);var force=springForce+dampingForce;dx*=force;dy*=force;var dfx=dx-this.forceX;var dfy=dy-this.forceY;if(!this.a.fixed&&!this.a.selected){this.a.forceX+=dfx;this.a.forceY+=dfy;}
if(!this.b.fixed&&!this.b.selected){this.b.forceX-=dfx;this.b.forceY-=dfy;}
this.forceX=dx;this.forceY=dy;}}
var Timer=function(timeout){this.init(timeout);};Timer.prototype={init:function(timeout){this['timer'];this['TIMEOUT']=timeout;this['BASE_TIMEOUT']=timeout;this['interupt']=true;this['subscribers']=new Array();this['ontimeout']=new EventHandler(this,function(){this.notify();if(!this.interupt){this.start();}});},start:function(){this['interupt']=false;this['timer']=window.setTimeout(this.ontimeout,this['TIMEOUT']);},stop:function(){this['interupt']=true;},subscribe:function(observer){this.subscribers.push(observer);},notify:function(){for(var i=0;i<this.subscribers.length;i++){var nextTimeout=this.subscribers[i].update();if(nextTimeout==false){this.stop();}else if(nextTimeout!=null){this['TIMEOUT']=nextTimeout;}}}}
var Graph;if(Graph==null){Graph={};}
Graph.GraphPanel=function(params){if(params.dampingConstant>params.springConstant){throw("Warning: dampingConstant "+params.dampingConstant+" is bigger than springConstant "+params.springConstant)}
this.labelEl=params.labelEl
this.regexpEl=params.regexpEl
this.getNumberOfNodes=this.numberOfNodes=function(){return layout.dataGraph.nodes.length;}
this.getNumberOfEdges=this.numberOfEdges=function(){return layout.dataGraph.numEdges;}
this.stopBuild=function(){buildTimer.stop();building=false;}
this.startBuild=function(){buildTimer.start();building=true;}
var building=true;this.toggleBuild=function(){building?this.stopBuild():this.startBuild();}
this.startSettle=function(){layout.model.timer.start();settling=true;}
this.stopSettle=function(){layout.model.timer.stop();settling=false;}
var settling=true;this.toggleSettle=function(){settling?this.stopSettle():this.startSettle();}
this.stopAll=function(){this.stopBuild();this.stopSettle();}
this.startAll=function(){this.render();this.startBuild();this.startSettle();}
this.edges=this.getEdges=function(){return layout.dataGraph.edges;}
this.toggleAddEdgesOnClick=function(){layout.model.lastSelected=null;layout.model.doNotStop=!layout.model.doNotStop;layout.model.start();return layout.addEdgesOnClick=!layout.addEdgesOnClick;}
this.addEdgesOnClick=function(){layout.addEdgesOnClick=true;layout.model.doNotStop=true;}
this.dragNodesOnClick=function(){layout.model.lastSelected=null;layout.addEdgesOnClick=false;layout.model.doNotStop=false;}
this.nodesWeight=this.getNodesWeight=function(params){sum=0;for(var i=0;i<layout.dataGraph.nodes.length;i++){sum+=(layout.dataGraph.nodes[i].weight||params.defaultWeight||1);}
return sum;}
this.randomNode=this.getRandomNode=function(){return layout.dataGraph.nodes[Math.round((layout.dataGraph.nodes.length-1)*Math.random())];}
this.nodeByIndex=this.getNodeByIndex=function(index){return layout.dataGraph.nodes[index]}
this.addEdge=function(src,dst,label){if(this.labelEl&&!label){label=this.labelEl.value}
this.startSettle()
var success=layout.dataGraph.addEdge(src,dst,label);return success;}
this.states={}
this.addNode=function(params){params=(params||{});var node=new DataGraphNode();node.accept=params.accept;node.start=params.start;if(node.accept){node.img='./images/green.gif'
node.color="#3f3"}else if(node.start){node.img='./images/blue.gif'
node.color="#33f"}else{node.img='./images/red.gif'
node.color="#f33"}
node.fixed=params.fixed||false;node.attributes=params;layout.dataGraph.addNode(node);if(params.accept){this.states.accept=node.id
node.accept=true}
if(params.start){this.states.start=node.id
node.start=true}
function initializePos(){if(node.particle){node.particle.positionX=params.xy[0]
node.particle.positionY=params.xy[1]}else{window.setTimeout(initializePos,100);}}
if(params.xy){initializePos();}
return node;}
this.removeNode=function(id){layout.view.removeNode(id);}
var edgs=null;function regExp2(start,goal,current){if(current==0){if(start==goal){return'';}else{return(edgs[start]&&edgs[start][goal])||null;}}else{var p1=regExp2(start,goal,current-1);var r1=regExp2(start,current,current-1);var r2=regExp2(current,current,current-1);var r3=regExp2(current,goal,current-1);var p2;if(!r1||!r3){p2='';}else{p2=(r1?r1:'')+(r2?'('+r2+')*':'')+(r3?r3:'');}
if(p1&&p2){var regExp=p1+'+'+p2;}else{if(p1){var regExp=p1;}
if(p2){var regExp=p2;}}
if(regExp){return regExp;return(regExp[0]=='(')?regExp:'('+regExp+')'}else{return'';}}}
this.toRegExp=function(params){edgs=layout.dataGraph.edges
p=start=this.states.start;q=accept=this.states.accept;val=regExp2(start,accept,edgs.length);this.regexpEl.value=val;}
function genRow(row){s='';for(i=0;i<row.length;i++){s+='<td>'+row[i]?row[i]:'&nbsp;'+'</td>';}
return s;}
function rowMatrix(edges){s='<table><tbody>';for(j=0;j<edges.length;j++){s+='<tr><th>'+j+'</th>'+genRow(edges[j])+'</tr>';}
return s+'</tbody></table>';}
this.addRandomEdge=function(params){if(!params){params={};}
while((!this.addEdge(this.getRandomNode(),this.getRandomNode(),params.label))&&params.force){}}
this.load=function(params){params.format=params.format||'xml'
if(params.url){loader.loadFromNetwork(params.url);}else{loader.loadFromText(params)}}
var buildTimer=new Timer(1);var rendered=false;this.render=function(params){if(!rendered){buildTimer.subscribe(layout);buildTimer.start();rendered=true;}}
this.subscribe=function(subscriber){buildTimer.subscribe(subscriber);}
params.graph=this;var layout=buildGraphLayout(params)
if(params.edgeMatrixEl){edgeMatrixDrawer=new Graph.EdgeMatrixPanel({el:params.edgeMatrixEl,dataGraph:layout.dataGraph});}
function buildGraphLayout(params){layoutParams={skew:(params.skew!=null),useCanvas:true,useVector:true,edgeRenderer:(params.edgeRender||'canvas'),springConstant:(params.springConstant||0.3),dampingConstant:(params.dampingConstant||0.2),restLength:(params.nodeRestDistance||20)}
var layout=new ForceDirectedLayout(params.el,layoutParams,params.graph);layout.view.skewBase=(params.skew||0);layout.setSize();var renderFunction=Graph.renderers.getRenderer(params.nodeRender);layout.config._default={model:function(dataNode){return{mass:.5};},view:function(dataNode,modelNode){return renderFunction(dataNode,modelNode,layout);}}
layout.forces.spring._default=function(nodeA,nodeB,isParentChild){return{springConstant:(params.springConstant||0.3),dampingConstant:(params.dampingConstant||0.2),restLength:(params.nodeRestDistance||20)}}
layout.forces.spring['A']={};layout.forces.spring['A']['B']=function(nodeA,nodeB,isParentChild){return{springConstant:(params.springConstant||0.4),dampingConstant:(params.dampingConstant||0.2),restLength:(params.restLength||30)}}
layout.forces.magnet=function(){return{magnetConstant:-4000,minimumDistance:20}}
layout.viewEdgeBuilder=function(dataNodeSrc,dataNodeDest,label){return{'html_pixels':7,'stroke':dataNodeSrc.color,'stroke-width':(params.edgePixelWidth||2)+'px','stroke-dasharray':(params.edgePixelLength||2)+','+(params.edgePixelGap||4),label:label}}
return layout;}
return this;}
Graph.renderers={getRenderer:function(format){switch(format){case"canvas":return this.canvasRenderer;case"vector":return this.vectorRenderer;case"html":return this.htmlRenderer;default:return this.htmlRenderer;}},canvasRenderer:function(dataNode,modelNode){return function(particle){this.node_twod.strokeStyle=dataNode.color;this.node_twod.fillStyle=dataNode.color;this.node_twod.beginPath();this.node_twod.arc((particle.positionX*this.skewX)+this.centerX,(particle.positionY*this.skewY)+this.centerY,6,0,Math.PI*2,true);this.node_twod.stroke();this.node_twod.fill();}},vectorRenderer:function(dataNode,modelNode,layout){var nodeElement=document.createElementNS("http://www.w3.org/2000/svg","circle");nodeElement.setAttribute('stroke','#888888');nodeElement.setAttribute('stroke-width','.25px');nodeElement.setAttribute('fill',dataNode.color);nodeElement.setAttribute('r',6+'px');nodeElement.onmousedown=new EventHandler(layout,layout.handleMouseDownEvent,modelNode.id)
return nodeElement;},htmlRenderer:function(dataNode,modelNode,layout){var nodeElement=document.createElement('div');nodeElement.style.position="absolute";nodeElement.style.width="12px";nodeElement.style.height="12px";var color=dataNode.color.replace("#","");if(dataNode.img){url=dataNode.img}
nodeElement.style.backgroundImage='url('+url+')';nodeElement.style.border="none";html='<img class="node" width="1" height="1" />';if(dataNode.start){html+='<p class="nodeLabel">Start</p>'}
if(dataNode.accept){html+='<p class="nodeLabel">Accept</p>'}
nodeElement.innerHTML=html
nodeElement.onmousedown=new EventHandler(layout,layout.handleMouseDownEvent,modelNode.id);nodeElement.onmouseup=new EventHandler(layout,layout.handleMouseUpEvent,modelNode.id);nodeElement.ondblclick=new EventHandler(layout,layout.handleDoubleClickEvent,modelNode.id);return nodeElement;}}
function $(id){return document.getElementById(id);}
function rand(max){return Math.floor(Math.random()*max);}
function init(){var colors=['#dce','#edf','#cce','#ddf','#e6e6ef']
graphPanel=new Graph.GraphPanel({el:$('graph'),labelEl:$('label'),regexpEl:$('regexp'),nodeRender:'html',edgeRender:'html',springConstant:0.25,dampingConstant:0.05,nodeRestDistance:140,edgePixelWidth:2,edgePixelLength:5,edgePixelGap:3,skew:1000});graphPanel.render();graphPanel.startAll();a=graphPanel.addNode({start:true,xy:[-450,0],fixed:true});b=graphPanel.addNode({accept:true,xy:[100,0],fixed:true});graphPanel.labelEl.onfocus=function(){graphPanel.labelEl.blur()}
window.onkeypress=function(e){graphPanel.labelEl.value=String.fromCharCode(e.charCode||e.keyCode)}}
var addNodes=false;function toggleMode(){graphPanel.toggleAddEdgesOnClick();if(addNodes){$('toggle').innerHTML="Drag Nodes"}else{$('toggle').innerHTML="Add Edges"}
addNodes=!addNodes;}
var animating=true;function toggleAnimate(){if(animating){$('animate').innerHTML="Unfreeze"}else{$('animate').innerHTML="Freeze"}
animating=!animating;}