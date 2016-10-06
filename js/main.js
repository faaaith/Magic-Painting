
	var canvas = document.getElementById('canvas');
	var can = canvas.getContext('2d');

	var brush = document.getElementById('brush');           
	var eraser = document.getElementById('eraser');         
	var text = document.getElementById('text');             
	
	var line = document.getElementById('line');             
	var arc = document.getElementById('arc');               
	var rect = document.getElementById('rect');             
	var poly = document.getElementById('poly');            
	var arcFill = document.getElementById('arcfill');      
	var rectFill = document.getElementById('rectfill');    

	var tools = document.getElementsByClassName('tools')[0].getElementsByTagName('li');

	var lines = document.getElementsByClassName('line')[0].getElementsByTagName('img');
	
	var colors = document.getElementsByClassName('color')[0].getElementsByTagName('li');

	//颜色设置
	for(var i=0; i<colors.length; i++){
		addEvent(colors[i],'click',function(e){
			var event = e||window.event;
			var target = event.target || event.srcElement;
			setColor(target.className);
			setStatus(colors,target,0)
		})
	}
	function setColor(color){
		can.strokeStyle = color;
		can.fillStyle = color;
	}	

	//线宽设置
	for(var i=0;i<lines.length;i++){
		addEvent(lines[i],'click',function(e){
			var event = e||window.event;
			var target = event.target || event.srcElement;
			setLineWidth(parseInt(target.className.charAt(target.className.length-1)));
			setStatus(lines,target,0)
		})
	}
	function setLineWidth(n){
		can.lineWidth = n;
	}
		
	for(var i =0;i<tools.length;i++){
		switch(i){
			case 0: addEvent(brush, "click", dBrush);break;
			case 1: addEvent(eraser, "click", dEraser);break;
			case 2: addEvent(text, "click", dText);break;
			case 3: addEvent(line, "click", dLine);break;
			case 4: addEvent(arc, "click", dArc);break;
			case 5: addEvent(rect, "click", dRect);break;
			case 6: addEvent(poly, "click", dPoly);break;
			case 7: addEvent(arcfill, "click", dArcFill);break;
			case 8: addEvent(rectfill, "click", dRectFill);break;
		}
	};
	//跨浏览器点击事件绑定
	function addEvent(element, type, handler) {
	    if (element.addEventListener) {
	        element.addEventListener(type, handler, false);
	    } else if (element.attachEvent) {
	        element.attachEvent("on" + type, handler);
	    } else {
	        element["on" + type] = handler;
	    }
	}
	// console.log(tools);
	canvas.onselectstart=function(){return false} 

	function setStatus(arr,ele,type){ 
		for(var i=0;i<arr.length;i++){
			if(arr[i]===ele){
				if(type){
					arr[i].style.background="gray";	
				}
				else {
					arr[i].style.border="2px solid #423";	
				}
			}else{
				if(type){
					arr[i].style.background="#eee";
				}
				else{
					arr[i].style.border="1px solid #fff";
				}
			}
		}
	}

	// 清除画布功能
	document.getElementById('clearPic').onclick=function(){
		can.clearRect(0,0,1326,405);
	}

	function dBrush(){
		setStatus(tools,brush,1);
		//鼠标按下的时候
		var status = 0;
		canvas.onmousedown=function(e){
			e=window.event||e;
			var sX=e.pageX-this.offsetLeft;
			var sY=e.pageY-this.offsetTop;
			can.beginPath();
			can.moveTo(sX,sY);
			status=1;
		}
		//鼠标移动的时候
		canvas.onmousemove=function(e){
			e=window.event||e;
			var eX=e.pageX-this.offsetLeft;
			var eY=e.pageY-this.offsetTop;
			if(status==1){
				can.lineTo(eX,eY);
				can.stroke();
			}else {return false}
					
		}
		//鼠标抬起的时候
		canvas.onmouseup=function(){
			can.closePath();
			status=0;			
		}
		//鼠标移出canvas画布结束画图
		canvas.onmouseout=function(){
			can.closePath();
			status=0;
		}
	}

	function dEraser(n){
		setStatus(tools,eraser,1);
		var status=0;
		//鼠标按下也开始清除，范围为当前线宽的两倍
		canvas.onmousedown=function(e){
			e=window.event||e;
			var sX=e.pageX-this.offsetLeft;
			var sY=e.pageY-this.offsetTop;
			can.clearRect(sX-can.lineWidth,sY-can.lineWidth,can.lineWidth*4,can.lineWidth*4);
			status=1; //状态标志位
		}
		// 鼠标移动时跟着轨迹一齐擦除
		canvas.onmousemove=function(e){
			e=window.event||e;
			var X=e.pageX-this.offsetLeft;
			var Y=e.pageY-this.offsetTop;
			if(status){
				can.clearRect(X-can.lineWidth,Y-can.lineWidth,can.lineWidth*4,can.lineWidth*4);
			}
			
		}
		//鼠标抬起，清除状态标志位
		canvas.onmouseup=function(){
			status=0;
		}
		canvas.onmouseout=null
	}

	function dText(){
		setStatus(tools,text,1);
		canvas.onmousedown=function(e){
			e=window.event||e;
			var x=e.pageX-this.offsetLeft;
			var y=e.pageY-this.offsetTop;
			var val = window.prompt('输入填充的文字','');
			if(val==null) return false; //输入为空则返回
			can.fillText(val,x,y);
			dBrush(0); //填入文字后返回自由画笔工具
		}
		canvas.onmouseup=null;
		canvas.onmousemove=null;
		canvas.onmouseout=null;
	}

	function dLine(){
		setStatus(tools,line,1);
		//画直线，鼠标按下时，当前鼠标位置为起点
		canvas.onmousedown=function(e){
			e=window.event||e;
			var sX=e.pageX-this.offsetLeft;
			var sY=e.pageY-this.offsetTop;
			can.beginPath();
			can.moveTo(sX,sY);
		}
		//画直线，鼠标抬起时，当前鼠标位置为终点
		canvas.onmouseup=function(e){
			e=window.event||e;
			var eX=e.pageX-this.offsetLeft;
			var eY=e.pageY-this.offsetTop;
			can.lineTo(eX,eY);
			can.closePath();
			can.stroke();
		}
		canvas.onmousemove=null;
		canvas.onmouseout=null;
	}

	function dArc(){
		setStatus(tools,arc,1);
		var sX=0;  //内部的“全局标量”
		var sY=0;
		//画空心圆，鼠标按下时，当前鼠标位置为圆心
		canvas.onmousedown=function(e){
			e=window.event||e;
			sX=e.pageX-this.offsetLeft;
			sY=e.pageY-this.offsetTop;
		}		
		//画空心圆，鼠标抬起时，当前鼠标位置为外圆结束点
		canvas.onmouseup=function(e){
			e=window.event||e;
			var eX=e.pageX-this.offsetLeft;
			var eY=e.pageY-this.offsetTop;
			var dX=eX-sX
			var dY=eY-sY;
			var r = Math.sqrt(Math.pow(dX,2)+Math.pow(dY,2)); //计算出半径
			can.beginPath();
			can.arc(sX,sY,r,0,360,false);
			can.closePath();
			can.stroke();
		}
		canvas.onmousemove=null;
		canvas.onmouseout=null;
	}

	function dRect(){
		setStatus(tools,rect,1);
		var sX=0; //内部的“全局标量”
		var sY=0;
		//画空心矩形，鼠标按下时，当前鼠标位置为矩形的左上角
		canvas.onmousedown=function(e){ 
			e=window.event||e;
			sX=e.pageX-this.offsetLeft;
			sY=e.pageY-this.offsetTop;
		}
		//画空心矩形，鼠标抬起时，当前鼠标位置为矩形的右下角
		canvas.onmouseup=function(e){
			e=window.event||e;
			var eX=e.pageX-this.offsetLeft;
			var eY=e.pageY-this.offsetTop;
			var w=eX-sX; //矩形的宽
			var h=eY-sY; //矩形的高
			can.strokeRect(sX,sY,w,h);
		}
		canvas.onmousemove=null;
		canvas.onmouseout=null;
	}

	function dPoly(){
		setStatus(tools,poly,1);
		var sX=0;
		var sY=0;
		//画三角形，鼠标按下，当前鼠标位置为三角形顶点坐标
		canvas.onmousedown=function(e){
			e=window.event||e;
			sX=e.pageX-this.offsetLeft;
			sY=e.pageY-this.offsetTop;
			can.beginPath();
			can.moveTo(sX,sY);
		}		
		//画三角形，鼠标抬起时，当前鼠标位置为三角形右边的结束点
		canvas.onmouseup=function(e){
			e=window.event||e;
			var eX=e.pageX-this.offsetLeft;
			var eY=e.pageY-this.offsetTop;
			var dX=eX-sX;
			var dY=eY-sY; //三角形的高
			var w = Math.sqrt(Math.pow(dX,2)+Math.pow(dY,2)); //三角形腰的长度
			var bottom = 2*Math.sqrt(Math.pow(w,2)-Math.pow(dY,2)); //底边长度
			can.lineTo(eX,eY);
			can.lineTo(eX-bottom,eY);
			can.lineTo(sX,sY);
			can.closePath();
			can.stroke();
		}
		canvas.onmousemove=null;
		canvas.onmouseout=null;
	}

	function dArcFill(){
		setStatus(tools,arcFill,1);
		var sX=0;  //内部的“全局标量”
		var sY=0;
		//画实心圆，鼠标按下时，当前鼠标位置为圆心
		canvas.onmousedown=function(e){
			e=window.event||e;
			sX=e.pageX-this.offsetLeft;
			sY=e.pageY-this.offsetTop;
		}		
		//画实心圆，鼠标抬起时，当前鼠标位置为外圆结束点
		canvas.onmouseup=function(e){
			e=window.event||e;
			var eX=e.pageX-this.offsetLeft;
			var eY=e.pageY-this.offsetTop;
			var dX=eX-sX
			var dY=eY-sY;
			var r = Math.sqrt(Math.pow(dX,2)+Math.pow(dY,2)); //计算出半径
			can.beginPath();
			can.arc(sX,sY,r,0,360,false);
			can.closePath();
			can.fill();
		}
		canvas.onmousemove=null;
		canvas.onmouseout=null;
	}

	function dRectFill(){
		setStatus(tools,rectFill,1);
		var sX=0; //内部的“全局标量”
		var sY=0;
		//画实心矩形，鼠标按下时，当前鼠标位置为矩形的左上角
		canvas.onmousedown=function(e){ 
			e=window.event||e;
			sX=e.pageX-this.offsetLeft;
			sY=e.pageY-this.offsetTop;
		}
		//画实心矩形，鼠标抬起时，当前鼠标位置为矩形的右下角
		canvas.onmouseup=function(e){
			e=window.event||e;
			var eX=e.pageX-this.offsetLeft;
			var eY=e.pageY-this.offsetTop;
			var w=eX-sX; //矩形的宽
			var h=eY-sY; //矩形的高
			can.fillRect(sX,sY,w,h);
		}
		canvas.onmousemove=null;
		canvas.onmouseout=null;
	}
	